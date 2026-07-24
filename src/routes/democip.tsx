import { createFileRoute } from "@tanstack/react-router";
import fs from "node:fs";
import path from "node:path";

const html = fs
  .readFileSync(path.resolve("public/democip/index.html"), "utf-8")
  .replace("<head>", '<head><base href="/democip/">');

export const Route = createFileRoute("/democip")({
  server: {
    handlers: {
      GET: async () =>
        new Response(html, {
          headers: { "Content-Type": "text/html; charset=utf-8" },
        }),
    },
  },
});
