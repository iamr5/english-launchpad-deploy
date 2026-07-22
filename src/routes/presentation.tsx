import { createFileRoute } from "@tanstack/react-router";
import html from "../assets/presentation.html?raw";

export const Route = createFileRoute("/presentation")({
  server: {
    handlers: {
      GET: async () =>
        new Response(html, {
          headers: { "Content-Type": "text/html; charset=utf-8" },
        }),
    },
  },
});
