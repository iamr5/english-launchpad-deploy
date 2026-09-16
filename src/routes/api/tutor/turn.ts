import { createFileRoute } from "@tanstack/react-router";
import { BANDS, bandIndex, type Band } from "@/lib/tutor/cefr";
import {
  applyObservation,
  ingestTurn,
  initialState,
  necesitaEspanol,
  type EstimatorState,
} from "@/lib/tutor/level-estimator";
import { sessionUpdateForBand } from "@/lib/tutor/prompt";
import { verifyTutorAccess } from "@/lib/tutor/tutor-token";

// Estimación de nivel por turno, para clientes que no llevan el estimador dentro
// (la pestaña Conversar de la app). No llama a ningún modelo: es código puro.

const hits = new Map<string, number[]>();
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_HOUR = 1500;

function tooMany(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_HOUR;
}

function esBanda(v: unknown): v is Band {
  return typeof v === "string" && (BANDS as readonly string[]).includes(v);
}

/** El estado viaja por el cliente: se reconstruye sobre uno limpio para no fiarse de su forma. */
function sanea(raw: unknown, semilla: Band | undefined): EstimatorState {
  const base = initialState(semilla);
  if (!raw || typeof raw !== "object") return base;
  const r = raw as Record<string, unknown>;
  const num = (k: keyof EstimatorState) =>
    typeof r[k] === "number" && Number.isFinite(r[k]) ? (r[k] as number) : (base[k] as number);
  const repertoire: Record<string, number> = {};
  if (r["repertoire"] && typeof r["repertoire"] === "object") {
    for (const [k, v] of Object.entries(r["repertoire"] as Record<string, unknown>)) {
      if (typeof v === "number" && Number.isFinite(v)) repertoire[k.slice(0, 40)] = v;
    }
  }
  return {
    score: num("score"),
    band: esBanda(r["band"]) ? r["band"] : base.band,
    confidence: num("confidence"),
    repertoire,
    totalWords: num("totalWords"),
    turns: num("turns"),
    turnsSinceChange: num("turnsSinceChange"),
    errorRate: num("errorRate"),
    spanishRate: num("spanishRate"),
    lostRate: num("lostRate"),
    pidioEspanol: r["pidioEspanol"] === true,
  };
}

export const Route = createFileRoute("/api/tutor/turn")({
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

        if (!(await verifyTutorAccess(String(body["t"] || "")))) {
          return Response.json({ error: "invalid_token" }, { status: 401 });
        }
        if (tooMany(ip)) return Response.json({ error: "rate_limited" }, { status: 429 });

        const semilla = esBanda(body["semilla"]) ? body["semilla"] : undefined;
        // En repaso y vocabulario el nivel lo pone lo que se practica, no lo que
        // se habla. Se siguen midiendo las señales de que el alumno se pierde
        // —eso hace falta en todos los modos—, pero la banda no se mueve.
        const fijo = body["fijo"] === true;
        let state = sanea(body["state"], semilla);
        const bandaFija = fijo ? state.band : null;
        const antes = {
          band: state.band,
          bilingue: necesitaEspanol(state),
          cuestaSeguir: state.lostRate > 0.4,
        };

        const texto = typeof body["text"] === "string" ? body["text"].slice(0, 2000) : "";
        if (texto) state = ingestTurn(state, texto);

        const obs = body["obs"] as Record<string, unknown> | undefined;
        if (obs && typeof obs === "object") {
          state = applyObservation(state, {
            errorCount: Number(obs["errorCount"]) || 0,
            wordsObserved: Number(obs["wordsObserved"]) || 0,
            confirmedStructures: Array.isArray(obs["confirmedStructures"])
              ? (obs["confirmedStructures"] as unknown[]).filter(
                  (x): x is string => typeof x === "string",
                )
              : [],
            unclearAudio: obs["unclearAudio"] === true,
            comprehension: ["followed", "partial", "lost"].includes(String(obs["comprehension"]))
              ? (obs["comprehension"] as "followed" | "partial" | "lost")
              : undefined,
          });
        }

        if (bandaFija) state = { ...state, band: bandaFija, score: bandIndex(bandaFija) };

        const ahora = {
          band: state.band,
          bilingue: necesitaEspanol(state),
          cuestaSeguir: state.lostRate > 0.4,
        };
        const cambio =
          ahora.band !== antes.band ||
          ahora.bilingue !== antes.bilingue ||
          ahora.cuestaSeguir !== antes.cuestaSeguir;

        let sessionUpdate: unknown;
        if (cambio) {
          const { resolverContexto } = await import("@/lib/tutor/contexto.server");
          const mascota =
            typeof body["mascota"] === "string" ? body["mascota"].slice(0, 40) : undefined;
          sessionUpdate = sessionUpdateForBand({
            band: ahora.band,
            midiendo: !fijo && state.confidence < 0.35,
            bilingue: ahora.bilingue,
            cuestaSeguir: ahora.cuestaSeguir,
            contexto: body["contexto"] ? resolverContexto(body["contexto"], mascota) : undefined,
            mascota,
            nombre: typeof body["nombre"] === "string" ? body["nombre"] : undefined,
          });
        }

        return Response.json(
          { state, ...ahora, confidence: state.confidence, sessionUpdate },
          { headers: { "Cache-Control": "private, no-store" } },
        );
      },
    },
  },
});
