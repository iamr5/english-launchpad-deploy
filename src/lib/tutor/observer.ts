// observer.ts — el modelo mirando la transcripción, sin permiso para opinar.

import { STRUCTURES } from "./cefr";

/** Modelo del observador. */
const MODEL = "gpt-5-mini";

const OPENAI_RESPONSES = "https://api.openai.com/v1/responses";

const STRUCTURE_IDS = STRUCTURES.map((s) => s.id);

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    errors: {
      type: "array",
      description:
        "Errores de inglés del alumno, máximo 4, los más importantes. Vacío si no hay ninguno.",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          quote: {
            type: "string",
            description:
              "El fragmento EXACTO de la transcripción donde está el error, copiado literal. Debe aparecer tal cual en el texto que se te dio.",
          },
          kind: {
            type: "string",
            enum: [
              "verb-tense",
              "word-order",
              "preposition",
              "article",
              "word-choice",
              "agreement",
              "other",
            ],
          },
          correction: { type: "string", description: "Cómo se dice correctamente, en inglés." },
        },
        required: ["quote", "kind", "correction"],
      },
    },
    structuresConfirmed: {
      type: "array",
      description:
        "Estructuras gramaticales que el alumno usó de forma CORRECTA en este texto. Solo las que veas realmente construidas bien.",
      items: { type: "string", enum: STRUCTURE_IDS },
    },
    spanishFragments: {
      type: "array",
      description:
        "Fragmentos copiados literal de la transcripción que están en español y no en inglés. Vacío si todo está en inglés.",
      items: { type: "string" },
    },
    comprehension: {
      type: "string",
      enum: ["followed", "partial", "lost"],
      description:
        "Si la respuesta del alumno encaja con lo que el tutor le preguntó: followed = contestó a lo que se le preguntó; partial = contestó a medias o se desvió; lost = no entendió la pregunta.",
    },
    unclearAudio: {
      type: "boolean",
      description:
        "true si la transcripción parece defectuosa (palabras sueltas sin sentido, cortes) y por tanto no es fiable para juzgar al alumno.",
    },
  },
  required: ["errors", "structuresConfirmed", "spanishFragments", "comprehension", "unclearAudio"],
} as const;

export type ObservedError = {
  quote: string;
  kind: string;
  correction: string;
};

export type Observation = {
  errors: ObservedError[];
  structuresConfirmed: string[];
  spanishFragments: string[];
  comprehension: "followed" | "partial" | "lost";
  unclearAudio: boolean;
  /** Cuántos hallazgos se descartaron por citar texto inexistente. */
  descartados: number;
  /** Frases que el TUTOR atribuyó al alumno y que el alumno no dijo. */
  tutorMisquotes: string[];
  cost: { usd: number; inputTokens: number; outputTokens: number };
};

/** Precio de referencia por millón de tokens (USD). */
const PRICE = { in: 0.25, out: 2.0 };

function normaliza(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s']/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Fórmulas con las que el tutor atribuye palabras al alumno, seguidas de la cita. */
// Tres maneras de atribuirle una frase. La tercera hace falta porque
// `Nice, "I have two coffees" is good` no dice "you said" en ningún sitio y le
// está atribuyendo la frase igual.
//
// No vale marcar toda comilla: el tutor entrecomilla sus PROPIOS ejemplos
// —«Option one: "I study every day."»— y eso es su trabajo. Lo que delata la
// atribución es el verbo de decir delante, o el juicio de valor detrás.
const ATRIBUCION = [
  /\byou\s+(?:said|say|told\s+me|mentioned)\b[,:]?\s*["'“‘«]([^"'”’»]{3,120})["'”’»]/gi,
  /\b(?:dijiste|has dicho|acabas de decir)\b[,:]?\s*["'“‘«]([^"'”’»]{3,120})["'”’»]/gi,
  /["'“‘«]([^"'”’»]{3,120})["'”’»]\s*(?:is|was|sounds|sounded)\s+(?:good|great|perfect|correct|right|nice|fine|better|clear)\b/gi,
];

/** Comprueba que las citas que el tutor atribuye al alumno existan de verdad. */
export function detectarMisquotes(tutorText: string, studentText: string): string[] {
  if (!tutorText || !studentText) return [];
  const heno = normaliza(studentText);
  const fuera: string[] = [];
  for (const patron of ATRIBUCION) {
    for (const m of tutorText.matchAll(patron)) {
      const cita = normaliza(m[1] ?? "");
      if (cita.split(" ").length < 2) continue; // una palabra suelta no es una cita
      if (heno.includes(cita)) continue;
      if (!fuera.includes(m[1] ?? "")) fuera.push(m[1] ?? "");
    }
  }
  return fuera;
}

export type ObserveInput = {
  /** Lo que dijo el alumno, uno o varios turnos concatenados. */
  studentText: string;
  /** Lo último que dijo el tutor, para poder juzgar si el alumno lo siguió. */
  tutorText?: string;
  apiKey: string;
};

export async function observe(input: ObserveInput): Promise<Observation> {
  const { studentText, tutorText, apiKey } = input;

  const prompt = [
    "Eres un analista de lengua. Tu trabajo es observar, no enseñar y no evaluar.",
    "",
    tutorText ? `Lo último que dijo el tutor:\n"""${tutorText}"""` : "",
    "",
    `Transcripción de lo que dijo el alumno (hispanohablante aprendiendo inglés):\n"""${studentText}"""`,
    "",
    "Extrae únicamente lo que puedas VER en esa transcripción.",
    "",
    "Reglas:",
    "· Cada `quote` debe estar copiado LITERAL de la transcripción del alumno. Si no puedes copiarlo palabra por palabra, no lo reportes.",
    "· No inventes errores. Si el inglés está bien, devuelve `errors` vacío.",
    "· No juzgues la pronunciación: esto es texto transcrito, no audio. Una palabra rara puede ser fallo del micrófono.",
    "· En `structuresConfirmed` pon solo las estructuras que el alumno construyó BIEN. Si la intentó y le salió mal, no cuenta.",
    "· Si la transcripción está rota o es ininteligible, marca `unclearAudio` y no acumules errores.",
    "· No indiques el nivel del alumno. No es tu tarea y no se te va a preguntar.",
  ]
    .filter(Boolean)
    .join("\n");

  const r = await fetch(OPENAI_RESPONSES, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      input: prompt,
      store: false,
      text: {
        format: {
          type: "json_schema",
          name: "language_observation",
          strict: true,
          schema: SCHEMA,
        },
      },
    }),
  });

  if (!r.ok) {
    const detalle = await r.text().catch(() => "");
    throw Object.assign(new Error(`observador ${r.status} ${detalle.slice(0, 300)}`), {
      status: r.status,
    });
  }

  const data = (await r.json()) as Record<string, unknown>;
  const raw = extraeTexto(data);
  const parsed = JSON.parse(raw) as {
    errors: ObservedError[];
    structuresConfirmed: string[];
    spanishFragments: string[];
    comprehension: Observation["comprehension"];
    unclearAudio: boolean;
  };

  const heno = normaliza(studentText);
  let descartados = 0;

  const errors = (parsed.errors || []).filter((e) => {
    const aguja = normaliza(e.quote || "");
    if (!aguja || !heno.includes(aguja)) {
      descartados++;
      return false;
    }
    return true;
  });

  const spanishFragments = (parsed.spanishFragments || []).filter((f) => {
    const aguja = normaliza(f || "");
    if (!aguja || !heno.includes(aguja)) {
      descartados++;
      return false;
    }
    return true;
  });

  // El enum ya lo garantiza, pero el esquema puede cambiar y esto no cuesta nada.
  const structuresConfirmed = (parsed.structuresConfirmed || []).filter((id) =>
    STRUCTURE_IDS.includes(id),
  );

  const usage = (data["usage"] || {}) as Record<string, number>;
  const inputTokens = Number(usage["input_tokens"] || 0);
  const outputTokens = Number(usage["output_tokens"] || 0);

  return {
    errors,
    structuresConfirmed,
    spanishFragments,
    comprehension: parsed.comprehension || "partial",
    unclearAudio: Boolean(parsed.unclearAudio),
    descartados,
    tutorMisquotes: detectarMisquotes(tutorText ?? "", studentText),
    cost: {
      usd: Math.round(((inputTokens * PRICE.in + outputTokens * PRICE.out) / 1e6) * 1e6) / 1e6,
      inputTokens,
      outputTokens,
    },
  };
}

/** Saca el texto de una respuesta de /v1/responses sin streaming. */
function extraeTexto(data: Record<string, unknown>): string {
  const directo = data["output_text"];
  if (typeof directo === "string" && directo) return directo;

  const output = data["output"];
  if (Array.isArray(output)) {
    for (const item of output) {
      const content = (item as Record<string, unknown>)?.["content"];
      if (!Array.isArray(content)) continue;
      for (const c of content) {
        const t = (c as Record<string, unknown>)?.["text"];
        if (typeof t === "string" && t) return t;
      }
    }
  }

  throw new Error("respuesta del observador sin texto");
}
