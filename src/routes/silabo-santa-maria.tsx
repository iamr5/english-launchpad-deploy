import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/silabo-santa-maria")({
  server: {
    handlers: {
      GET: async () =>
        new Response(null, {
          status: 301,
          headers: {
            Location: "/silabo-santa-maria-de-la-gracia",
            "Cache-Control": "max-age=86400",
          },
        }),
    },
  },
});
