import { createFileRoute } from "@tanstack/react-router";
import html from "../assets/demo-dashboard.html?raw";

const htmlWithBase = html.replace("<head>", '<head><base href="/democip/">');

export const Route = createFileRoute("/demo-dashboard")({
  server: {
    handlers: {
      GET: async () =>
        new Response(htmlWithBase, {
          headers: { "Content-Type": "text/html; charset=utf-8" },
        }),
    },
  },
});
