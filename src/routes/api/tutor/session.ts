import { createFileRoute } from "@tanstack/react-router";
import { buildInstructions } from "@/lib/tutor/prompt";
import {
  PROFILES,
  BANDS,
  turnDetection,
  techoSalida,
  type Band,
  type TurnMode,
} from "@/lib/tutor/cefr";
import { verifyTutorAccess } from "@/lib/tutor/tutor-token";
import { INITIAL_BAND, initialState, necesitaEspanol } from "@/lib/tutor/level-estimator";

// Acuñación de la llave efímera para una sesión de tutor en tiempo real.

const OPENAI_CLIENT_SECRETS = "https://api.openai.com/v1/realtime/client_secrets";

/** Modelo de voz. */
const REALTIME_MODEL = "gpt-realtime-2.1-mini";

/** Transcripción de lo que dice el alumno. */
const TRANSCRIBE_MODEL = "gpt-transcribe";
const TRANSCRIBE_LANGS = ["en", "es"];

/**
 * Voz del tutor. `cedar` es de las nuevas de gpt-realtime: más natural y con
 * más rango que `coral`, que salía demasiado plana. El punto de partida para
 * probar otra es esta constante; el ánimo lo pone sobre todo el bloque
 * "CÓMO SUENAS" del prompt, no la voz en sí.
 * Alternativas válidas: marin, cedar, sage, ballad, alloy, ash, verse, shimmer, echo.
 */
const VOICE = "cedar";

/** Perfil de micrófono. */
const NOISE_DEFAULT = "far_field";

const hits = new Map<string, number[]>();
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_HOUR = 20;

function tooMany(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_HOUR;
}

function esModo(v: unknown): v is TurnMode {
  return v === "auto" || v === "manual";
}

function esBanda(v: unknown): v is Band {
  return typeof v === "string" && (BANDS as readonly string[]).includes(v);
}

export const Route = createFileRoute("/api/tutor/session")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const ip =
          request.headers.get("cf-connecting-ip") ||
          request.headers.get("x-forwarded-for") ||
          "unknown";

        let body: Record<string, unknown>;
        try {
          body = (await request.json()) as Record<string, unknown>;
        } catch {
          return Response.json({ error: "bad_request" }, { status: 400 });
        }

        const claims = await verifyTutorAccess(String(body["t"] || ""));
        if (!claims) return Response.json({ error: "invalid_token" }, { status: 401 });
        if (tooMany(ip)) return Response.json({ error: "rate_limited" }, { status: 429 });

        const apiKey = process.env["OPENAI_API_KEY"];
        if (!apiKey) return Response.json({ error: "ai_unavailable" }, { status: 503 });

        const band: Band = esBanda(body["band"]) ? body["band"] : INITIAL_BAND;
        const midiendo = body["midiendo"] !== false;
        const nombre = typeof body["nombre"] === "string" ? body["nombre"] : undefined;
        const noiseProfile = body["mic"] === "near" ? "near_field" : NOISE_DEFAULT;
        const cuestaSeguir = body["cuestaSeguir"] === true;
        // Si el cliente no lo dice, se deduce de la banda. Sin esto, una sesión
        // sembrada en A1 se montaba en "solo inglés" mientras la pantalla ya
        // prometía español, y el session.update que lo habría arreglado nunca
        // salía: /turn solo lo manda cuando el valor CAMBIA, y no cambiaba.
        const bilingue =
          typeof body["bilingue"] === "boolean"
            ? body["bilingue"]
            : necesitaEspanol(initialState(band));
        const mascota =
          typeof body["mascota"] === "string" ? body["mascota"].slice(0, 40) : undefined;
        const modo: TurnMode = esModo(body["modo"]) ? body["modo"] : "auto";
        const packs = Array.isArray(body["packs"])
          ? (body["packs"] as unknown[])
              .filter((p): p is string => typeof p === "string")
              .slice(0, 4)
          : [];

        const { targetVocabulary } = await import("@/lib/tutor/syllabus.server");
        const { resolverContexto } = await import("@/lib/tutor/contexto.server");
        const contexto = body["contexto"] ? resolverContexto(body["contexto"], mascota) : undefined;
        const vocabulario = contexto ? undefined : targetVocabulary(band, packs);

        const perfil = PROFILES[band];
        const instructions = buildInstructions({
          band,
          nombre,
          midiendo,
          vocabulario,
          cuestaSeguir,
          bilingue,
          contexto,
          primerTurno: true,
          mascota,
        });

        try {
          const r = await fetch(OPENAI_CLIENT_SECRETS, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              session: {
                type: "realtime",
                model: REALTIME_MODEL,
                instructions,
                max_output_tokens: techoSalida(perfil.maxOutputTokens, bilingue),
                // El historial de audio se reenvía en cada turno; conservar el 60% recorta el arrastre.
                truncation: { type: "retention_ratio", retention_ratio: 0.6 },
                audio: {
                  input: {
                    // Sin esto no llega el texto del alumno y no hay nada que medir.
                    transcription: { model: TRANSCRIBE_MODEL, languages: TRANSCRIBE_LANGS },
                    // Filtra el audio ANTES de que llegue al VAD.
                    noise_reduction: { type: noiseProfile },
                    turn_detection: turnDetection(modo, band),
                  },
                  output: { voice: VOICE, speed: perfil.speed },
                },
              },
            }),
          });

          if (!r.ok) {
            const detalle = await r.text().catch(() => "");
            console.error("[tutor] acuñación fallida", r.status, detalle.slice(0, 400));
            return Response.json(
              { error: r.status === 401 ? "bad_api_key" : "mint_failed" },
              { status: 502 },
            );
          }

          const data = (await r.json()) as Record<string, unknown>;

          // GA: la llave viene en `value` al nivel raíz, no bajo `client_secret`.
          const value =
            data["value"] ?? (data["client_secret"] as Record<string, unknown>)?.["value"];
          if (!value) {
            console.error(
              "[tutor] respuesta sin llave efímera",
              JSON.stringify(data).slice(0, 300),
            );
            return Response.json({ error: "mint_failed" }, { status: 502 });
          }

          return Response.json(
            {
              clientSecret: value,
              expiresAt: data["expires_at"] ?? null,
              sid: claims.sid,
              model: REALTIME_MODEL,
              band,
              // Vuelve al cliente para que un session.update no borre el anclaje al sílabo.
              vocabulario,
            },
            { headers: { "Cache-Control": "private, no-store" } },
          );
        } catch (e) {
          console.error("[tutor] error acuñando sesión", (e as Error).message);
          return Response.json({ error: "mint_failed" }, { status: 502 });
        }
      },
    },
  },
});
