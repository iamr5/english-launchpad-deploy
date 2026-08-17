import { createFileRoute } from "@tanstack/react-router";

// Enviar un turno al círculo: nota de voz (WAV) o texto.

export const Route = createFileRoute("/api/public/circles/message")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const C = await import("@/lib/circles.server");
        if (C.tooMany(C.ipOf(request), 120)) return Response.json({ error: "rate_limited" }, { status: 429 });

        const form = await request.formData().catch(() => null);
        if (!form) return Response.json({ error: "bad_request" }, { status: 400 });

        const auth = await C.authMember(
          String(form.get("code") ?? ""),
          String(form.get("member") ?? ""),
          String(form.get("token") ?? ""),
        );
        if (auth === "expired") return Response.json({ error: "expired" }, { status: 410 });
        if (!auth) return Response.json({ error: "unauthorized" }, { status: 401 });
        const { circle, member } = auth;

        const db = await C.admin();
        const body = String(form.get("body") ?? "").trim().slice(0, 600);
        const replyTo = String(form.get("replyTo") ?? "") || null;
        const durationMs = Math.max(0, Math.min(120_000, Number.parseInt(String(form.get("durationMs") ?? "0"), 10) || 0));
        const audio = form.get("audio");
        const id = crypto.randomUUID();
        let audioPath: string | null = null;

        if (audio instanceof Blob && audio.size > 0) {
          if (audio.size < 1024 || audio.size > C.MAX_AUDIO_BYTES) {
            return Response.json({ error: "invalid_audio" }, { status: 400 });
          }
          const path = `${circle.id}/${member.id}/${id}.wav`;
          const up = await db.storage
            .from(C.CIRCLE_BUCKET)
            .upload(path, audio, { contentType: "audio/wav", upsert: false });
          if (up.error) return Response.json({ error: "audio_save_failed" }, { status: 500 });
          audioPath = path;
        } else if (!body) {
          return Response.json({ error: "empty" }, { status: 400 });
        }

        const ins = await db
          .from("circle_messages")
          .insert({
            id,
            circle_id: circle.id,
            member_id: member.id,
            task_idx: circle.task_idx,
            kind: audioPath ? "voice" : "text",
            body,
            audio_path: audioPath,
            duration_ms: durationMs,
            reply_to: replyTo,
          })
          .select("id, created_at")
          .single();
        if (ins.error) {
          if (audioPath) await db.storage.from(C.CIRCLE_BUCKET).remove([audioPath]);
          return Response.json({ error: "send_failed" }, { status: 500 });
        }

        return Response.json({ message: ins.data }, { status: 201, headers: { "Cache-Control": "private, no-store" } });
      },
    },
  },
});
