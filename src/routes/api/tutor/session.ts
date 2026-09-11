import { createFileRoute } from "@tanstack/react-router";
import { buildInstructions } from "@/lib/tutor/prompt";
import { PROFILES, BANDS, turnDetection, type Band, type TurnMode } from "@/lib/tutor/cefr";
import { verifyTutorToken } from "@/lib/tutor/tutor-token";
import { INITIAL_BAND } from "@/lib/tutor/level-estimator";

// Acuñación de la llave efímera para una sesión de tutor en tiempo real.

const OPENAI_CLIENT_SECRETS = "https://api.openai.com/v1/realtime/client_secrets";

/** Modelo de voz. */
const REALTIME_MODEL = "gpt-realtime-2.1-mini";

/** Transcripción de lo que dice el alumno. */
const TRANSCRIBE_MODEL = "gpt-transcribe";
const TRANSCRIBE_LANGS = ["en", "es"];

/** Voz del tutor. */
const VOICE = "marin";

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

        const claims = await verifyTutorToken(String(body["t"] || ""));
        if (!claims) return Response.json({ error: "invalid_token" }, { status: 401 });
        if (tooMany(ip)) return Response.json({ error: "rate_limited" }, { status: 429 });

        const apiKey = process.env["OPENAI_API_KEY"];
        if (!apiKey) return Response.json({ error: "ai_unavailable" }, { status: 503 });

        const band: Band = esBanda(body["band"]) ? body["band"] : INITIAL_BAND;
        const midiendo = body["midiendo"] !== false;
        const nombre = typeof body["nombre"] === "string" ? body["nombre"] : undefined;
        const noiseProfile = body["mic"] === "near" ? "near_field" : NOISE_DEFAULT;
        const cuestaSeguir = body["cuestaSeguir"] === true;
        const bilingue = body["bilingue"] === true;
        const modo: TurnMode = esModo(body["modo"]) ? body["modo"] : "auto";
        const packs = Array.isArray(body["packs"])
          ? (body["packs"] as unknown[])
              .filter((p): p is string => typeof p === "string")
              .slice(0, 4)
          : [];

        const { targetVocabulary } = await import("@/lib/tutor/syllabus.server");
        const vocabulario = targetVocabulary(band, packs);

        const perfil = PROFILES[band];
        const instructions = buildInstructions({
          band,
          nombre,
          midiendo,
          vocabulario,
          cuestaSeguir,
          bilingue,
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
                max_output_tokens: perfil.maxOutputTokens,
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
