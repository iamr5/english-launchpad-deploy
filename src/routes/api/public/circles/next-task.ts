import { createFileRoute } from "@tanstack/react-router";

// Avanzar a la siguiente tarea del círculo. Cualquier participante puede hacerlo.

export const Route = createFileRoute("/api/public/circles/next-task")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const C = await import("@/lib/circles.server");
        if (C.tooMany(C.ipOf(request), 60)) return Response.json({ error: "rate_limited" }, { status: 429 });

        const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
        const auth = await C.authMember(
          String(body["code"] ?? ""),
          String(body["member"] ?? ""),
          String(body["token"] ?? ""),
        );
        if (auth === "expired") return Response.json({ error: "expired" }, { status: 410 });
        if (!auth) return Response.json({ error: "unauthorized" }, { status: 401 });

        const { circle } = auth;
        const db = await C.admin();
        const next = circle.task_idx + 1;
        await db
          .from("circles")
          .update({ task_idx: next, task_started_at: new Date().toISOString(), bot_busy_until: null })
          .eq("id", circle.id);
        await C.ensureTask(circle.id, circle.level, circle.topic, next);

        return Response.json({ taskIdx: next }, { headers: { "Cache-Control": "private, no-store" } });
      },
    },
  },
});
