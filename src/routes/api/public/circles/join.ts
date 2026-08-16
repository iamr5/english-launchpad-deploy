import { createFileRoute } from "@tanstack/react-router";

// Entrar a un círculo con el código y un apodo. Devuelve la credencial del
// participante para las siguientes llamadas.

const COLORS = ["#1CB0F6", "#3FAA24", "#F4A720", "#9B5DE5", "#EF6C6C", "#12A594"];

export const Route = createFileRoute("/api/public/circles/join")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const C = await import("@/lib/circles.server");
        if (C.tooMany(C.ipOf(request), 60)) return Response.json({ error: "rate_limited" }, { status: 429 });

        const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
        const code = C.cleanCode(body["code"]);
        const nickname = C.cleanNick(body["nickname"]);
        if (code.length !== 6) return Response.json({ error: "bad_code" }, { status: 400 });
        if (!nickname) return Response.json({ error: "bad_nickname" }, { status: 400 });

        const circle = await C.loadCircle(code);
        if (circle === "expired") return Response.json({ error: "expired" }, { status: 410 });
        if (!circle) return Response.json({ error: "not_found" }, { status: 404 });

        const db = await C.admin();
        const { data: members } = await db
          .from("circle_members")
          .select("id, nickname, is_bot")
          .eq("circle_id", circle.id);
        const humanos = (members || []).filter((m) => !m.is_bot).length;
        if (humanos >= C.CIRCLE_MAX_MEMBERS) return Response.json({ error: "full" }, { status: 409 });
        if ((members || []).some((m) => m.nickname.toLowerCase() === nickname.toLowerCase())) {
          return Response.json({ error: "nickname_taken" }, { status: 409 });
        }

        const token = C.newToken();
        const me = await db
          .from("circle_members")
          .insert({
            circle_id: circle.id,
            nickname,
            color: COLORS[(members || []).length % COLORS.length]!,
            token,
          })
          .select("id")
          .single();
        if (me.error) return Response.json({ error: "join_failed" }, { status: 500 });

        await C.ensureTask(circle.id, circle.level, circle.topic, circle.task_idx);

        return Response.json(
          { code: circle.code, memberId: me.data.id, token, level: circle.level, topic: circle.topic, bots: circle.bots_enabled },
          { headers: { "Cache-Control": "private, no-store" } },
        );
      },
    },
  },
});
