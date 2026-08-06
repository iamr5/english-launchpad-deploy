import { createFileRoute } from "@tanstack/react-router";
import html from "../assets/1millondealumnos.html?raw";

export const Route = createFileRoute("/1millondealumnos")({
  server: {
    handlers: {
      GET: async () =>
        new Response(html, {
          headers: { "Content-Type": "text/html; charset=utf-8" },
        }),
    },
  },
});
