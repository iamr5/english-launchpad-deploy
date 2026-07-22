import { createFileRoute } from "@tanstack/react-router";
import html from "../assets/presentacion.html?raw";

export const Route = createFileRoute("/presentacion")({
  server: {
    handlers: {
      GET: async () =>
        new Response(html, {
          headers: { "Content-Type": "text/html; charset=utf-8" },
        }),
    },
  },
});
