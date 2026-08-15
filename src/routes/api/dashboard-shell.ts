import { createFileRoute } from "@tanstack/react-router";
import { verifyShellToken } from "@/lib/app-token";

/**
 * El panel de seguimiento de una cuenta con sesión, con la marca de su
 * institución. Igual que /api/app-shell, pero para familias y profesores.
 *
 * La vista —familia o profesor— viene FIRMADA dentro del pase, no en la URL: la
 * decidió el servidor mirando los roles (ver getMyDashboardShell). Si viajara
 * suelta, una familia pediría el reporte de aula cambiando un parámetro.
 */
export const Route = createFileRoute("/api/dashboard-shell")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const claims = await verifyShellToken(url.searchParams.get("t") ?? "");
        if (!claims?.view) {
          return new Response("Sesión caducada. Vuelve a entrar.", {
            status: 401,
            headers: { "Content-Type": "text/plain; charset=utf-8" },
          });
        }

        const [{ getAppConfigForUser }, { renderOrgDashboard }] = await Promise.all([
          import("@/lib/org-config.server"),
          import("@/lib/demo-page"),
        ]);

        const cfg = await getAppConfigForUser(claims.uid, claims.email);
        return await renderOrgDashboard(cfg, claims.view);
      },
    },
  },
});
