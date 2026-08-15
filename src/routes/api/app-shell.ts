import { createFileRoute } from "@tanstack/react-router";
import { verifyShellToken } from "@/lib/app-token";

/**
 * La app del alumno, ya pintada con la marca de su institución.
 *
 * Quien la pide es el <iframe> de /app, con el pase que le dio getMyAppShell()
 * por RPC. Un iframe no lleva cabecera Authorization, de ahí el pase; el porqué
 * completo está en src/lib/app-token.ts.
 *
 * Sin pase válido NO se sirve una versión genérica: se responde 401. Servirla
 * dejaría el curso entero accesible sin sesión, que es justo lo que el pase del
 * curso (src/lib/course-token.ts) intenta evitar.
 */
export const Route = createFileRoute("/api/app-shell")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const claims = await verifyShellToken(url.searchParams.get("t") ?? "");
        if (!claims) {
          return new Response("Sesión caducada. Vuelve a entrar.", {
            status: 401,
            headers: { "Content-Type": "text/plain; charset=utf-8" },
          });
        }

        const [{ getAppConfigForUser }, { renderOrgApp }] = await Promise.all([
          import("@/lib/org-config.server"),
          import("@/lib/demo-page"),
        ]);

        const cfg = await getAppConfigForUser(claims.uid, claims.email);
        return await renderOrgApp(cfg);
      },
    },
  },
});
