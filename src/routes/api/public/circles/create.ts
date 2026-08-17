import { createFileRoute } from "@tanstack/react-router";

// Crea un círculo de speaking y devuelve el código para compartir.
// Sin sesión: la credencial es el par (memberId, token) que se devuelve aquí.

export const Route = createFileRoute("/api/public/circles/create")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const C = await import("@/lib/circles.server");
        if (C.tooMany(C.ipOf(request), 20)) return Response.json({ error: "rate_limited" }, { status: 429 });

        const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
        const nickname = C.cleanNick(body["nickname"]) || "Tú";
        const level = C.isLevel(body["level"]) ? String(body["level"]) : "A1";
        const topic = body["topic"] === "engineering" ? "engineering" : "general";
        const bots = body["bots"] === true;

        const db = await C.admin();
        let circle = null;
        for (let i = 0; i < 5 && !circle; i++) {
          const ins = await db
            .from("circles")
            .insert({ code: C.newCode(), level, topic, bots_enabled: bots })
            .select("*")
            .single();
          if (!ins.error) circle = ins.data;
        }
        if (!circle) return Response.json({ error: "create_failed" }, { status: 500 });

        const token = C.newToken();
        const me = await db
          .from("circle_members")
          .insert({ circle_id: circle.id, nickname, color: "#1CB0F6", token })
          .select("id, nickname, color, is_bot")
          .single();
        if (me.error) return Response.json({ error: "create_failed" }, { status: 500 });

        if (bots) {
          await db.from("circle_members").insert(
            C.BOT_PERSONAS.slice(0, 3).map((p) => ({
              circle_id: circle!.id,
              nickname: p.nickname,
              color: p.color,
              is_bot: true,
              token: C.newToken(),
              persona: p.trait,
            })),
          );
        }

        await C.ensureTask(circle.id, level, topic, 0);

        return Response.json(
          { code: circle.code, memberId: me.data.id, token, level, topic, bots },
          { status: 201, headers: { "Cache-Control": "private, no-store" } },
        );
      },
    },
  },
});
