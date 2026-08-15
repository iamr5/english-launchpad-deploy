import { createFileRoute } from "@tanstack/react-router";
import { verifyCourseToken } from "@/lib/course-token";

// Evaluación de una respuesta hablada.
//
// El navegador manda un WAV corto; aquí se transcribe y se puntúa. Dos llamadas
// al Gateway de IA:
//   1. /v1/audio/transcriptions  — qué dijo exactamente (openai/gpt-4o-transcribe)
//   2. /v1/responses             — qué tan bien lo dijo (openai/gpt-5.6-sol)
//
// Esta ruta evalúa y descarta su copia; el cliente autenticado guarda la misma toma mediante speaking-attempts.
//
// En el piloto debug se usa para todos los modos y se compara con el resultado
// local. El mismo WAV alimenta ambos análisis; nunca se vuelve a grabar.

const GATEWAY = "https://ai.gateway.lovable.dev/v1";
const MAX_BYTES = 6 * 1024 * 1024; // ~30 s de WAV a 16 kHz mono, con holgura

const hits = new Map<string, number[]>();
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_HOUR = 80; // techo por IP: la app además limita por alumno y día

function tooMany(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_HOUR;
}

// Precios de referencia por millón de tokens (USD). Se actualizan aquí y en
// ningún otro sitio; el número que ve el alumno se presenta como estimado.
const PRICES: Record<string, { in: number; audioIn: number; out: number }> = {
  "openai/gpt-4o-transcribe": { in: 2.5, audioIn: 6, out: 10 },
  "openai/gpt-5.6-sol": { in: 1.25, audioIn: 1.25, out: 10 },
};

type Usage = Record<string, unknown> | null;

function num(v: unknown) {
  return typeof v === "number" && Number.isFinite(v) ? v : 0;
}

/** Costo estimado en USD a partir del uso que reporta el gateway. */
function costOf(model: string, usage: Usage) {
  const p = PRICES[model];
  if (!p || !usage) return { usd: 0, inputTokens: 0, audioTokens: 0, outputTokens: 0 };
  const details = (usage["input_token_details"] || {}) as Record<string, unknown>;
  const audioTokens = num(details["audio_tokens"]);
  const inputTokens = Math.max(0, num(usage["input_tokens"]) - audioTokens);
  const outputTokens = num(usage["output_tokens"]);
  const usd =
    (inputTokens * p.in + audioTokens * p.audioIn + outputTokens * p.out) / 1_000_000;
  return { usd: Math.round(usd * 1e6) / 1e6, inputTokens, audioTokens, outputTokens };
}

/** Lee un cuerpo SSE entero: concatena un campo por evento y guarda el `usage`. */
async function drainSSE(
  body: ReadableStream<Uint8Array>,
  pick: (evt: Record<string, unknown>) => string | undefined,
) {
  const reader = body.getReader();
  const dec = new TextDecoder();
  let buf = "";
  let out = "";
  let usage: Usage = null;
  const anota = (evt: Record<string, unknown>) => {
    const u = (evt["usage"] ||
      ((evt["response"] as Record<string, unknown> | undefined) || {})["usage"]) as Usage;
    if (u && typeof u === "object") usage = u;
  };
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    const lines = buf.split("\n");
    buf = lines.pop() || "";
    for (const line of lines) {
      if (!line.startsWith("data:")) continue;
      const raw = line.slice(5).trim();
      if (!raw || raw === "[DONE]") continue;
      try {
        const evt = JSON.parse(raw) as Record<string, unknown>;
        anota(evt);
        const piece = pick(evt);
        if (piece) out += piece;
      } catch {
        /* fragmento no-JSON: se ignora */
      }
    }
  }
  return { text: out, usage };
}

async function transcribe(file: Blob, name: string, key: string) {
  const started = Date.now();
  const model = "openai/gpt-4o-transcribe";
  const form = new FormData();
  form.append("model", model);
  form.append("file", file, name);
  form.append("language", "en");
  form.append("stream", "true");
  const r = await fetch(`${GATEWAY}/audio/transcriptions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}` },
    body: form,
  });
  if (!r.ok || !r.body) {
    const detalle = await r.text().catch(() => "");
    throw Object.assign(new Error(`transcripcion ${r.status} ${detalle}`), { status: r.status });
  }
  const drained = await drainSSE(r.body, (e) =>
    e["type"] === "transcript.text.delta" ? (e["delta"] as string) : undefined,
  );
  return {
    transcript: drained.text.trim(),
    latencyMs: Date.now() - started,
    runId: r.headers.get("X-Lovable-AIG-Run-ID"),
    model,
    cost: costOf(model, drained.usage),
  };
}


const SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    pronunciation: { type: "integer", description: "0-100" },
    fluency: { type: "integer", description: "0-100" },
    grammar: { type: "integer", description: "0-100" },
    passed: { type: "boolean" },
    headline: { type: "string", description: "Una frase en español, cálida y breve." },
    advice: { type: "string", description: "Un consejo concreto en español, máx 200 caracteres." },
    betterVersion: {
      type: ["string", "null"],
      description: "Cómo habría sonado mejor en inglés, o null si ya está bien.",
    },
    problemWords: {
      type: "array",
      description: "Palabras que sonaron mal o se usaron mal (máx 4).",
      items: { type: "string" },
    },
    evidence: {
      type: "array",
      description: "Señales observables en la transcripción que justifican el feedback (máx 4).",
      items: { type: "string" },
    },
    unintelligible: {
      type: "array",
      description:
        "Fragmentos de la transcripción que NO son inglés reconocible: palabras en español, sonidos sin sentido, relleno o audio dudoso. Copia el texto tal cual aparece en la transcripción. Vacío si todo es inglés.",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          text: { type: "string", description: "El fragmento exacto de la transcripción." },
          reason: {
            type: "string",
            enum: ["spanish", "not-english", "unclear", "filler"],
            description: "spanish = está en español; not-english = no es una palabra inglesa; unclear = no se entiende; filler = muletilla.",
          },
          suggestion: {
            type: ["string", "null"],
            description: "Cómo se diría en inglés, o null si no aplica.",
          },
        },
        required: ["text", "reason", "suggestion"],
      },
    },
    mostlyUnintelligible: {
      type: "boolean",
      description: "true si la mayor parte de la grabación no es inglés reconocible.",
    },
  },
  required: [
    "pronunciation",
    "fluency",
    "grammar",
    "passed",
    "headline",
    "advice",
    "betterVersion",
    "problemWords",
    "evidence",
    "unintelligible",
    "mostlyUnintelligible",
  ],
} as const;


async function score(
  key: string,
  datos: { transcript: string; level: string; task: string; target: string; requirements: string; acceptedVariants: string },
) {
  const started = Date.now();
  const instruccion = datos.target
    ? `El alumno debía decir exactamente: "${datos.target}".`
    : `La tarea era: ${datos.task}`;
  const prompt = [
    `Eres profesor de inglés para hispanohablantes, nivel ${datos.level || "A2"} del MCER.`,
    instruccion,
    `Esto es la transcripción de lo que dijo en voz alta: "${datos.transcript}"`,
    datos.requirements ? `Criterios esperados: ${datos.requirements}` : "",
    datos.acceptedVariants ? `Variantes aceptables: ${datos.acceptedVariants}` : "",
    "Evalúa cumplimiento, fluidez aparente y gramática usando únicamente la transcripción.",
    "No asegures que una palabra fue mal pronunciada: una transcripción distinta no es evidencia acústica suficiente. Llama problemWords a palabras para revisar y explica la señal observable en evidence.",
    "Marca en unintelligible cada fragmento de la transcripción que no sea inglés reconocible (español, sonidos sin sentido, muletillas, texto dudoso), copiándolo literal y con su motivo. Si casi todo es así, pon mostlyUnintelligible en true y no apruebes.",
    "Sé exigente pero alentador, y ajusta el listón al nivel indicado: en A1 basta con hacerse entender.",
    "Escribe el titular y el consejo en español; la versión mejorada, en inglés.",
    "Aprueba (passed) si las tres notas llegan a 60 o más.",
  ].join("\n");

  const model = "openai/gpt-5.6-sol";
  const r = await fetch(`${GATEWAY}/responses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
      "X-Lovable-AIG-SDK": "fetch",
    },
    body: JSON.stringify({
      model,
      input: prompt,
      stream: true,
      store: false,
      text: {
        format: {
          type: "json_schema",
          name: "speaking_feedback",
          strict: true,
          schema: SCHEMA,
        },
      },
    }),
  });
  if (!r.ok || !r.body) {
    const detalle = await r.text().catch(() => "");
    throw Object.assign(new Error(`evaluacion ${r.status} ${detalle}`), { status: r.status });
  }
  const drained = await drainSSE(r.body, (e) =>
    e["type"] === "response.output_text.delta" ? (e["delta"] as string) : undefined,
  );
  return {
    feedback: JSON.parse(drained.text) as Record<string, unknown>,
    latencyMs: Date.now() - started,
    runId: r.headers.get("X-Lovable-AIG-Run-ID"),
    model,
    cost: costOf(model, drained.usage),
  };
}


export const Route = createFileRoute("/api/course/speaking-eval")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const url = new URL(request.url);
        const ip =
          request.headers.get("cf-connecting-ip") ||
          request.headers.get("x-forwarded-for") ||
          "unknown";

        const slug = await verifyCourseToken(url.searchParams.get("t") ?? "");
        if (!slug) return Response.json({ error: "invalid_token" }, { status: 401 });
        if (tooMany(ip)) return Response.json({ error: "rate_limited" }, { status: 429 });

        const key = process.env["LOVABLE_API_KEY"];
        if (!key) return Response.json({ error: "ai_unavailable" }, { status: 503 });

        const ct = request.headers.get("content-type") || "";
        if (!ct.includes("multipart/form-data")) {
          return Response.json({ error: "bad_request" }, { status: 400 });
        }

        const form = await request.formData();
        const audio = form.get("audio");
        if (!(audio instanceof Blob) || audio.size < 2048) {
          return Response.json({ error: "empty_audio" }, { status: 400 });
        }
        if (audio.size > MAX_BYTES) {
          return Response.json({ error: "audio_too_large" }, { status: 413 });
        }

        const level = String(form.get("level") || "A2").slice(0, 4);
        const task = String(form.get("task") || "").slice(0, 400);
        const target = String(form.get("target") || "").slice(0, 400);
        const requirements = String(form.get("requirements") || "").slice(0, 600);
        const acceptedVariants = String(form.get("acceptedVariants") || "").slice(0, 600);

        try {
          const transcription = await transcribe(audio, "recording.wav", key);
          if (!transcription.transcript) {
            return Response.json({ error: "no_speech" }, { status: 422 });
          }
          const scored = await score(key, {
            transcript: transcription.transcript,
            level,
            task,
            target,
            requirements,
            acceptedVariants,
          });
          return Response.json(
            {
              transcript: transcription.transcript,
              ...scored.feedback,
              metrics: {
                transcriptionMs: transcription.latencyMs,
                scoringMs: scored.latencyMs,
                totalMs: transcription.latencyMs + scored.latencyMs,
                audioBytes: audio.size,
              },
              cost: {
                currency: "USD",
                estimated: true,
                transcription: { model: transcription.model, ...transcription.cost },
                scoring: { model: scored.model, ...scored.cost },
                totalUsd:
                  Math.round((transcription.cost.usd + scored.cost.usd) * 1e6) / 1e6,
              },
              usage: {
                transcriptionRunId: transcription.runId,
                scoringRunId: scored.runId,
                aiCalls: 2,
              },

            },
            { headers: { "Cache-Control": "private, no-store" } },
          );
        } catch (e) {
          const status = (e as { status?: number }).status ?? 500;
          console.error("[speaking] evaluación fallida", (e as Error).message);
          return Response.json(
            { error: status === 402 ? "no_credits" : "eval_failed" },
            { status: status === 402 ? 402 : 502 },
          );
        }
      },
    },
  },
});
