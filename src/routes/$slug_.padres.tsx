import { createFileRoute } from "@tanstack/react-router";
import { getDemoConfig } from "@/lib/demo-config";
import { renderDemoDashboard, renderDemoNotFound } from "@/lib/demo-page";

// El panel abierto en la pestaña de Familia: aprendoenglish.com/<slug>/padres.
//
// Es la dirección que se le pasa a un padre —por WhatsApp o por el correo de
// invitación—, así que tiene que llegar ya en su vista, con la marca de la
// institución. Sirve la misma plantilla que /<slug>/dashboard; lo único que
// cambia es la pestaña con la que arranca.
export const Route = createFileRoute("/$slug_/padres")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const cfg = await getDemoConfig(params.slug);
        return cfg
          ? await renderDemoDashboard(cfg, "parent")
          : renderDemoNotFound(params.slug);
      },
    },
  },
});
