import { createFileRoute } from "@tanstack/react-router";
import { getCourse, getPlacement, getPractice } from "@/lib/course-data.server";
import { verifyCourseToken } from "@/lib/course-token";

// El contenido del curso. Antes vivía en public/ y se bajaba entero con una sola
// petición; ahora sale por aquí, y sólo con un pase válido de los que emite la
// página al servirse.
//
// Lo que esto consigue es subir el coste y dejar rastro, no cerrar la puerta:
// lo que el navegador pinta, el usuario lo tiene. Ver src/lib/course-token.ts.

// Recuento por IP, en memoria. Es "mejor que nada": se reinicia en cada
// despliegue y no se comparte entre instancias, pero corta la descarga repetida
// desde un mismo sitio, que es el caso que importa.
const hits = new Map<string, number[]>();
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_HOUR = 40;

function tooMany(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear(); // techo de memoria
  return recent.length > MAX_PER_HOUR;
}

export const Route = createFileRoute("/api/course/bundle")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const ip =
          request.headers.get("cf-connecting-ip") ||
          request.headers.get("x-forwarded-for") ||
          "unknown";

        const slug = await verifyCourseToken(url.searchParams.get("t") ?? "");
        if (!slug) {
          return Response.json({ error: "invalid_token" }, { status: 401 });
        }
        if (tooMany(ip)) {
          console.warn(`[curso] demasiadas descargas desde ${ip} (demo ${slug})`);
          return Response.json({ error: "rate_limited" }, { status: 429 });
        }

        return Response.json(
          { course: getCourse(), placement: getPlacement(), practice: getPractice() },
          {
            headers: {
              // Que no se quede en ninguna caché intermedia: cada visita pasa
              // por aquí, que es lo que permite contar y cortar.
              "Cache-Control": "private, no-store",
              "X-Robots-Tag": "noindex, nofollow",
            },
          },
        );
      },
    },
  },
});
