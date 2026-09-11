import { createFileRoute } from "@tanstack/react-router";
import { observe } from "@/lib/tutor/observer";
import { verifyTutorToken } from "@/lib/tutor/tutor-token";

// Observación de lo que dijo el alumno.

const MAX_CHARS = 4000;

const hits = new Map<string, number[]>();
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_HOUR = 200;

function tooMany(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_HOUR;
}

export const Route = createFileRoute("/api/tutor/observe")({
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

        const studentText = String(body["studentText"] || "").slice(0, MAX_CHARS);
        const tutorText = String(body["tutorText"] || "").slice(0, MAX_CHARS) || undefined;

        // Con menos de cinco palabras no hay nada que observar: la llamada solo gastaría.
        if (studentText.trim().split(/\s+/).filter(Boolean).length < 5) {
          return Response.json({ error: "too_short" }, { status: 422 });
        }

        try {
          const obs = await observe({ studentText, tutorText, apiKey });

          // Si el modelo se inventó citas, queda registrado.
          if (obs.tutorMisquotes.length) {
            console.warn(
              "[tutor] el tutor citó al alumno diciendo algo que no dijo:",
              obs.tutorMisquotes.join(" | "),
            );
          }

          if (obs.descartados > 0) {
            console.warn(
              `[tutor] observador: ${obs.descartados} hallazgo(s) descartado(s) por citar texto inexistente`,
            );
          }

          return Response.json(obs, { headers: { "Cache-Control": "private, no-store" } });
        } catch (e) {
          const status = (e as { status?: number }).status ?? 500;
          console.error("[tutor] observación fallida", (e as Error).message);
          return Response.json({ error: "observe_failed" }, { status: status === 402 ? 402 : 502 });
        }
      },
    },
  },
});
