import { createFileRoute } from "@tanstack/react-router";
import { getDemoConfig } from "@/lib/demo-config";
import { renderDemoDashboard, renderDemoNotFound } from "@/lib/demo-page";

// El panel del profesor: aprendoenglish.com/<slug>/dashboard.
//
// Muestra SOLO el reporte de aula. La vista de familia vive en /<slug>/padres,
// y el selector de pestañas no se pinta en ninguna de las dos: cada dirección
// es una página cerrada, para poder mandarle a cada quien la suya.
//
// El guion bajo de `$slug_` es lo que evita que esta ruta se anide bajo
// `$slug.tsx`: son handlers de servidor que devuelven HTML suelto, no UI con
// <Outlet />, así que anidarlas obligaría a `$slug.tsx` a volverse layout.
export const Route = createFileRoute("/$slug_/dashboard")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const cfg = await getDemoConfig(params.slug);
        return cfg
          ? await renderDemoDashboard(cfg, "teacher")
          : renderDemoNotFound(params.slug);
      },
    },
  },
});
