import { createFileRoute } from "@tanstack/react-router";
import html from "../assets/demo-dashboard.html?raw";
import { getDemoConfig } from "@/lib/demo-config";
import { renderDemoDashboard } from "@/lib/demo-page";

// El panel de progreso. Se abre desde un demo, que le pasa su slug en ?d=; con
// eso lleva el nombre de la institución y la mascota de ese demo, en vez de la
// marca genérica y Boti para todos.
//
// Sin ?d= —si alguien entra a pelo— se sirve la plantilla tal cual.
const plain = html.replace("<head>", '<head><base href="/demo-assets/">');

export const Route = createFileRoute("/demo-dashboard")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const slug = new URL(request.url).searchParams.get("d");
        const cfg = slug ? await getDemoConfig(slug) : null;
        if (cfg) return await renderDemoDashboard(cfg);
        return new Response(plain, {
          headers: { "Content-Type": "text/html; charset=utf-8" },
        });
      },
    },
  },
});
