import { createFileRoute } from "@tanstack/react-router";

// Estado de la sala: miembros, tarea actual y mensajes nuevos.
// El cliente lo consulta cada pocos segundos; esta misma llamada es el "tick"
// que hace hablar a los bots cuando les toca.

export const Route = createFileRoute("/api/public/circles/state")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const C = await import("@/lib/circles.server");
        if (C.tooMany(C.ipOf(request), 400)) return Response.json({ error: "rate_limited" }, { status: 429 });

        const url = new URL(request.url);
        const auth = await C.authMember(
          url.searchParams.get("code") || "",
          url.searchParams.get("member") || "",
          url.searchParams.get("token") || "",
        );
        if (auth === "expired") return Response.json({ error: "expired" }, { status: 410 });
        if (!auth) return Response.json({ error: "unauthorized" }, { status: 401 });

        const db = await C.admin();
        const { circle, member } = auth;
        await db.from("circle_members").update({ last_seen_at: new Date().toISOString() }).eq("id", member.id);

        await C.botTick(circle);

        const since = url.searchParams.get("since") || "1970-01-01T00:00:00Z";
        const [membersQ, taskQ, msgsQ, freshQ] = await Promise.all([
          db.from("circle_members").select("id, nickname, color, is_bot, last_seen_at").eq("circle_id", circle.id).order("created_at"),
          C.ensureTask(circle.id, circle.level, circle.topic, circle.task_idx),
          db
            .from("circle_messages")
            .select("id, member_id, task_idx, kind, body, audio_path, duration_ms, reply_to, created_at")
            .eq("circle_id", circle.id)
            .gt("created_at", since)
            .order("created_at")
            .limit(80),
          db.from("circles").select("task_idx, bots_enabled").eq("id", circle.id).single(),
        ]);

        const task = taskQ as { prompt_en: string; prompt_es: string; model_en: string; functions: string[]; audio_path: string | null; idx: number };
        const msgs = msgsQ.data || [];
        const urls = await C.signed([task.audio_path, ...msgs.map((m) => m.audio_path)]);

        return Response.json(
          {
            circle: {
              code: circle.code,
              level: circle.level,
              topic: circle.topic,
              taskIdx: freshQ.data?.task_idx ?? circle.task_idx,
              bots: freshQ.data?.bots_enabled ?? circle.bots_enabled,
            },
            me: { id: member.id, nickname: member.nickname, color: member.color },
            members: membersQ.data || [],
            task: {
              idx: task.idx,
              promptEn: task.prompt_en,
              promptEs: task.prompt_es,
              modelEn: task.model_en,
              functions: task.functions || [],
              audioUrl: task.audio_path ? urls[task.audio_path] || null : null,
            },
            messages: msgs.map((m) => ({ ...m, audioUrl: m.audio_path ? urls[m.audio_path] || null : null })),
            now: new Date().toISOString(),
          },
          { headers: { "Cache-Control": "private, no-store" } },
        );
      },
    },
  },
});
