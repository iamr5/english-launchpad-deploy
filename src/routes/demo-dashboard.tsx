import { createFileRoute } from "@tanstack/react-router";
import html from "../assets/demo-dashboard.html?raw";

// Dirección vieja del panel: /demo-dashboard?d=<slug>.
//
// El panel ahora vive en /<slug>/dashboard, pero esta ruta se queda como
// redirección permanente: la anterior ya se compartió con instituciones y por
// correo, y esos enlaces no se pueden reemitir.
//
// Sin ?d= —si alguien entra a pelo— se sigue sirviendo la plantilla tal cual,
// con la marca genérica.
const plain = html.replace("<head>", '<head><base href="/demo-assets/">');

export const Route = createFileRoute("/demo-dashboard")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const slug = new URL(request.url).searchParams.get("d");
        if (slug) {
          return new Response(null, {
            status: 301,
            headers: { Location: `/${encodeURIComponent(slug)}/dashboard` },
          });
        }
        return new Response(plain, {
          headers: { "Content-Type": "text/html; charset=utf-8" },
        });
      },
    },
  },
});
