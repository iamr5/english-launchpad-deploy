import { createFileRoute } from "@tanstack/react-router";
import html from "../assets/demo-index.html?raw";

export const Route = createFileRoute("/demo")({
  server: {
    handlers: {
      GET: async () =>
        new Response(html, {
          headers: { "Content-Type": "text/html; charset=utf-8" },
        }),
    },
  },
});
