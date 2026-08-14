import { createFileRoute } from "@tanstack/react-router";
import { getVocabTopics } from "@/lib/vocab-data.server";
import { verifyCourseToken } from "@/lib/course-token";

// Las palabras de un tema de vocabulario, servidas cuando el alumno lo abre. La
// biblioteca entera son varios MB: al arrancar sólo viaja su índice.

const hits = new Map<string, number[]>();
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_HOUR = 600;

function tooMany(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_HOUR;
}

export const Route = createFileRoute("/api/course/vocab")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const ip =
          request.headers.get("cf-connecting-ip") ||
          request.headers.get("x-forwarded-for") ||
          "unknown";

        const slug = await verifyCourseToken(url.searchParams.get("t") ?? "");
        if (!slug) return Response.json({ error: "invalid_token" }, { status: 401 });
        if (tooMany(ip)) return Response.json({ error: "rate_limited" }, { status: 429 });

        const ids = (url.searchParams.get("ids") || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        if (!ids.length) return Response.json({ topics: {} });

        return Response.json(
          { topics: getVocabTopics(ids) },
          {
            headers: {
              "Cache-Control": "private, no-store",
              "X-Robots-Tag": "noindex, nofollow",
            },
          },
        );
      },
    },
  },
});
