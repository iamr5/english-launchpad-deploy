import { createFileRoute } from "@tanstack/react-router";
import html from "../assets/demo-index.html?raw";

const htmlWithBase = html.replace("<head>", '<head><base href="/demo/">');

export const Route = createFileRoute("/demo")({
  server: {
    handlers: {
      GET: async () =>
        new Response(htmlWithBase, {
          headers: { "Content-Type": "text/html; charset=utf-8" },
        }),
    },
  },
});
