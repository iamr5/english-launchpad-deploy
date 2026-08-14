import { createFileRoute } from "@tanstack/react-router";

const MAX_AUDIO_BYTES = 6 * 1024 * 1024;
const asText = (value: FormDataEntryValue | null, max = 1000) => String(value ?? "").slice(0, max);
const asInt = (value: FormDataEntryValue | null) => {
  const parsed = Number.parseInt(String(value ?? "0"), 10);
  return Number.isFinite(parsed) ? parsed : 0;
};
const asJson = (value: FormDataEntryValue | null, fallback: unknown) => {
  try { return JSON.parse(String(value ?? "")); } catch { return fallback; }
};

export const Route = createFileRoute("/api/course/speaking-attempts")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { speakingUserClient } = await import("@/lib/speaking-attempts.server");
        const auth = await speakingUserClient(request);
        if (!auth) return Response.json({ error: "unauthorized" }, { status: 401 });
        const { data, error } = await auth.client.from("speaking_attempts")
          .select("id, exercise_id, level, mode, attempt_number, duration_ms, local_transcript, ai_transcript, local_score, pronunciation_score, fluency_score, grammar_score, passed, problem_words, word_differences, feedback, local_latency_ms, ai_latency_ms, audio_bytes, audio_path, audio_expires_at, usage, created_at")
          .order("created_at", { ascending: false }).limit(100);
        if (error) return Response.json({ error: "history_failed" }, { status: 500 });
        const rows = await Promise.all((data ?? []).map(async (row) => {
          if (!row.audio_path || !row.audio_expires_at || new Date(row.audio_expires_at).getTime() <= Date.now()) return { ...row, audio_url: null };
          const signed = await auth.client.storage.from("speaking-audio").createSignedUrl(row.audio_path, 600);
          return { ...row, audio_url: signed.data?.signedUrl ?? null };
        }));
        return Response.json({ attempts: rows }, { headers: { "Cache-Control": "private, no-store" } });
      },
      POST: async ({ request }) => {
        const { SPEAKING_AUDIO_BUCKET, speakingAudioExpiry, speakingUserClient } = await import("@/lib/speaking-attempts.server");
        const auth = await speakingUserClient(request);
        if (!auth) return Response.json({ error: "unauthorized" }, { status: 401 });
        const form = await request.formData();
        const audio = form.get("audio");
        if (!(audio instanceof Blob) || audio.size < 2048 || audio.size > MAX_AUDIO_BYTES || audio.type !== "audio/wav") {
          return Response.json({ error: "invalid_audio" }, { status: 400 });
        }
        const attemptId = crypto.randomUUID();
        const exerciseId = asText(form.get("exerciseId"), 120);
        const level = asText(form.get("level"), 2);
        const mode = asText(form.get("mode"), 20);
        if (!exerciseId || !["A1","A2","B1","B2","C1"].includes(level) || !["repeat","read","guided","dialogue","free"].includes(mode)) {
          return Response.json({ error: "invalid_attempt" }, { status: 400 });
        }
        const audioPath = `${auth.userId}/${attemptId}.wav`;
        const uploaded = await auth.client.storage.from(SPEAKING_AUDIO_BUCKET).upload(audioPath, audio, { contentType: "audio/wav", upsert: false });
        if (uploaded.error) return Response.json({ error: "audio_save_failed" }, { status: 500 });
        const payload = {
          id: attemptId, user_id: auth.userId, demo_slug: asText(form.get("demoSlug"), 80), exercise_id: exerciseId,
          level, mode, attempt_number: Math.max(1, asInt(form.get("attemptNumber"))), duration_ms: Math.max(0, asInt(form.get("durationMs"))),
          audio_path: audioPath, audio_expires_at: speakingAudioExpiry(), local_transcript: asText(form.get("localTranscript"), 4000),
          ai_transcript: asText(form.get("aiTranscript"), 4000), local_score: Math.min(100, Math.max(0, asInt(form.get("localScore")))),
          pronunciation_score: Math.min(100, Math.max(0, asInt(form.get("pronunciationScore")))), fluency_score: Math.min(100, Math.max(0, asInt(form.get("fluencyScore")))),
          grammar_score: Math.min(100, Math.max(0, asInt(form.get("grammarScore")))), passed: form.get("passed") === "true",
          problem_words: asJson(form.get("problemWords"), []), word_differences: asJson(form.get("wordDifferences"), []), feedback: asJson(form.get("feedback"), {}),
          local_latency_ms: Math.max(0, asInt(form.get("localLatencyMs"))), ai_latency_ms: Math.max(0, asInt(form.get("aiLatencyMs"))), audio_bytes: audio.size,
          usage: asJson(form.get("usage"), {}),
        };
        const inserted = await auth.client.from("speaking_attempts").insert(payload).select("id, created_at").single();
        if (inserted.error) {
          await auth.client.storage.from(SPEAKING_AUDIO_BUCKET).remove([audioPath]);
          return Response.json({ error: "attempt_save_failed" }, { status: 500 });
        }
        return Response.json({ attempt: inserted.data }, { status: 201, headers: { "Cache-Control": "private, no-store" } });
      },
      DELETE: async ({ request }) => {
        const { SPEAKING_AUDIO_BUCKET, speakingUserClient } = await import("@/lib/speaking-attempts.server");
        const auth = await speakingUserClient(request);
        if (!auth) return Response.json({ error: "unauthorized" }, { status: 401 });
        const id = new URL(request.url).searchParams.get("id") ?? "";
        const existing = await auth.client.from("speaking_attempts").select("audio_path").eq("id", id).maybeSingle();
        if (existing.error || !existing.data) return Response.json({ error: "not_found" }, { status: 404 });
        if (existing.data.audio_path) await auth.client.storage.from(SPEAKING_AUDIO_BUCKET).remove([existing.data.audio_path]);
        const removed = await auth.client.from("speaking_attempts").delete().eq("id", id);
        if (removed.error) return Response.json({ error: "delete_failed" }, { status: 500 });
        return Response.json({ ok: true });
      },
    },
  },
});
