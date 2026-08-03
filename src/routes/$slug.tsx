import { createFileRoute } from "@tanstack/react-router";
import { getDemoConfig } from "@/lib/demo-config";
import { renderDemoPage, renderDemoNotFound } from "@/lib/demo-page";

// Cualquier demo: aprendoenglish.com/<slug>. Las rutas fijas (/login, /cip, …)
// tienen prioridad sobre ésta, y además están en RESERVED_SLUGS para que no se
// pueda crear un demo que las tape.
export const Route = createFileRoute("/$slug")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const cfg = getDemoConfig(params.slug);
        return cfg ? renderDemoPage(cfg) : renderDemoNotFound(params.slug);
      },
    },
  },
});
