// Speaking Circles: salas de conversación de verdad.
//
// Todo el acceso a datos pasa por aquí, con la clave de servicio: las tablas no
// tienen políticas para anon y el navegador nunca habla directo con la base.
// La credencial del participante es el par (memberId, token) que devuelve
// /join, más el código de sala.
//
// Los compañeros bot son opcionales (interruptor al crear la sala): responden
// la tarea y comentan lo que dicen los humanos, con voz generada.

import { getSpeaking } from "@/lib/course-data.server";

export const CIRCLE_BUCKET = "circle-audio";
export const MAX_AUDIO_BYTES = 6 * 1024 * 1024;
export const CIRCLE_MAX_MEMBERS = 6;

const GATEWAY = "https://ai.gateway.lovable.dev/v1";
const TEXT_MODEL = "openai/gpt-5.6-sol";
const TTS_MODEL = "openai/gpt-4o-mini-tts";

export const LEVELS = ["A1", "A2", "B1", "B2", "C1"] as const;
export type Level = (typeof LEVELS)[number];

export const BOT_PERSONAS = [
  { nickname: "Andrea", color: "#1CB0F6", voice: "shimmer", trait: "curiosa, hace preguntas de seguimiento" },
  { nickname: "Jorge", color: "#3FAA24", voice: "onyx", trait: "práctico, cuenta ejemplos de su trabajo" },
  { nickname: "María", color: "#9B5DE5", voice: "nova", trait: "alentadora, celebra lo que dicen los demás" },
  { nickname: "Renzo", color: "#F4A720", voice: "echo", trait: "bromista, respuestas cortas y naturales" },
];

export async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export function newCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
}
export function newToken() {
  return Array.from(crypto.getRandomValues(new Uint8Array(24)), (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("");
}
export function cleanCode(v: unknown) {
  return String(v ?? "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);
}
export function cleanNick(v: unknown) {
  return String(v ?? "").replace(/\s+/g, " ").trim().slice(0, 24);
}
export function isLevel(v: unknown): v is Level {
  return (LEVELS as readonly string[]).includes(String(v));
}

// ---- banco de tareas ------------------------------------------------------
// Se sacan del banco de speaking ya existente: nos quedamos con los modos
// conversacionales (guiado, diálogo, habla libre) del nivel pedido.
type BankItem = {
  id?: string;
  level?: string;
  mode?: string;
  prompt?: string;
  promptEs?: string;
  target?: string;
  requirements?: string[];
  domain?: string;
};

let cache: Record<string, BankItem[]> | null = null;
function byLevel(): Record<string, BankItem[]> {
  if (cache) return cache;
  const out: Record<string, BankItem[]> = { A1: [], A2: [], B1: [], B2: [], C1: [] };
  const bank = getSpeaking();
  for (const mod of Object.keys(bank)) {
    for (const raw of bank[mod] || []) {
      const it = raw as BankItem;
      const lvl = String(it.level || "");
      if (!out[lvl]) continue;
      if (!["guided", "dialogue", "free"].includes(String(it.mode))) continue;
      if (!it.prompt) continue;
      out[lvl].push(it);
    }
  }
  cache = out;
  return out;
}

export function pickTask(level: string, topic: string, idx: number) {
  const list = byLevel()[isLevel(level) ? level : "A1"] || [];
  const pool = topic === "engineering" ? list.filter((i) => i.domain === "engineering") : list;
  const use = pool.length ? pool : list;
  if (!use.length) {
    return { prompt_en: "Introduce yourself to the group.", prompt_es: "Preséntate al grupo.", model_en: "", functions: [] };
  }
  const it = use[(idx * 37 + Math.floor(Date.now() / 86_400_000)) % use.length]!;
  return {
    prompt_en: String(it.prompt || ""),
    prompt_es: String(it.promptEs || ""),
    model_en: String(it.target || ""),
    functions: (it.requirements || []).slice(0, 4).map(String),
  };
}

// ---- audio ----------------------------------------------------------------
/** Texto a voz por el gateway. Devuelve la ruta en el bucket, o null si falla. */
export async function speak(text: string, voice: string, path: string): Promise<string | null> {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key || !text.trim()) return null;
  try {
    const r = await fetch(`${GATEWAY}/audio/speech`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({ model: TTS_MODEL, voice, input: text.slice(0, 600), response_format: "mp3" }),
    });
    if (!r.ok) return null;
    const buf = await r.arrayBuffer();
    if (!buf.byteLength) return null;
    const db = await admin();
    const up = await db.storage.from(CIRCLE_BUCKET).upload(path, new Uint8Array(buf), {
      contentType: "audio/mpeg",
      upsert: true,
    });
    return up.error ? null : path;
  } catch {
    return null;
  }
}

export async function signed(paths: (string | null | undefined)[]) {
  const db = await admin();
  const out: Record<string, string> = {};
  const uniq = Array.from(new Set(paths.filter(Boolean) as string[]));
  await Promise.all(
    uniq.map(async (p) => {
      const r = await db.storage.from(CIRCLE_BUCKET).createSignedUrl(p, 3600);
      if (r.data?.signedUrl) out[p] = r.data.signedUrl;
    }),
  );
  return out;
}

// ---- tareas ---------------------------------------------------------------
export async function ensureTask(circleId: string, level: string, topic: string, idx: number) {
  const db = await admin();
  const found = await db.from("circle_tasks").select("*").eq("circle_id", circleId).eq("idx", idx).maybeSingle();
  if (found.data) return found.data;
  const t = pickTask(level, topic, idx);
  const ins = await db
    .from("circle_tasks")
    .insert({ circle_id: circleId, idx, ...t })
    .select("*")
    .single();
  const row = ins.data ?? { ...t, idx, circle_id: circleId, audio_path: null, id: "" };
  if (ins.data && !ins.data.audio_path) {
    const path = `${circleId}/task-${idx}.mp3`;
    const said = await speak(t.model_en || t.prompt_en, "alloy", path);
    if (said) {
      await db.from("circle_tasks").update({ audio_path: said }).eq("id", ins.data.id);
      return { ...ins.data, audio_path: said };
    }
  }
  return row;
}

// ---- bots -----------------------------------------------------------------
type BotPlan = { botId: string; nickname: string; persona: string; replyTo: string | null; heard: string };

async function botText(level: string, prompt: string, trait: string, heard: string) {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) return "";
  const instrucciones = [
    `You are an adult Peruvian student of English at CEFR level ${level}, practising in a small speaking circle.`,
    `Your personality: ${trait}.`,
    `The group task is: ${prompt}`,
    heard
      ? `A classmate just said: "${heard}". React to it naturally and add your own idea.`
      : "Answer the task with your own short turn.",
    `Speak like a ${level} learner: simple, natural, 1 to 2 sentences, maximum 30 words. English only. No quotes, no emojis, no translation.`,
  ].join("\n");
  try {
    const r = await fetch(`${GATEWAY}/responses`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}`, "X-Lovable-AIG-SDK": "fetch" },
      body: JSON.stringify({ model: TEXT_MODEL, input: instrucciones, stream: false, store: false }),
    });
    if (!r.ok) return "";
    const j = (await r.json()) as Record<string, unknown>;
    const direct = j["output_text"];
    if (typeof direct === "string" && direct.trim()) return direct.trim().slice(0, 300);
    const output = (j["output"] as Array<Record<string, unknown>>) || [];
    for (const item of output) {
      const content = (item["content"] as Array<Record<string, unknown>>) || [];
      for (const c of content) {
        const t = c["text"];
        if (typeof t === "string" && t.trim()) return t.trim().slice(0, 300);
      }
    }
    return "";
  } catch {
    return "";
  }
}

/**
 * Un solo movimiento de bot por llamada, serializado con bot_busy_until para
 * que dos sondeos simultáneos no generen dos respuestas.
 */
export async function botTick(circle: {
  id: string;
  level: string;
  topic: string;
  task_idx: number;
  bots_enabled: boolean;
  bot_busy_until: string | null;
  task_started_at: string;
}) {
  if (!circle.bots_enabled) return;
  if (circle.bot_busy_until && new Date(circle.bot_busy_until).getTime() > Date.now()) return;

  const db = await admin();
  const [membersQ, msgsQ, taskQ] = await Promise.all([
    db.from("circle_members").select("id, nickname, is_bot, persona").eq("circle_id", circle.id),
    db
      .from("circle_messages")
      .select("id, member_id, body, created_at")
      .eq("circle_id", circle.id)
      .eq("task_idx", circle.task_idx)
      .order("created_at", { ascending: true }),
    db.from("circle_tasks").select("prompt_en").eq("circle_id", circle.id).eq("idx", circle.task_idx).maybeSingle(),
  ]);
  const members = membersQ.data || [];
  const bots = members.filter((m) => m.is_bot);
  if (!bots.length) return;
  const msgs = msgsQ.data || [];
  const prompt = taskQ.data?.prompt_en || "Talk about the topic.";

  const last = msgs[msgs.length - 1];
  const lastAt = last ? new Date(last.created_at).getTime() : new Date(circle.task_started_at).getTime();
  const espera = last && bots.some((b) => b.id === last.member_id) ? 6000 : 3500;
  if (Date.now() - lastAt < espera) return;

  // 1) bots que aún no han respondido esta tarea; 2) si ya todos hablaron,
  //    uno comenta el último turno humano.
  const yaHablaron = new Set(msgs.map((m) => m.member_id));
  const pendiente = bots.find((b) => !yaHablaron.has(b.id));
  const humanoUltimo = [...msgs].reverse().find((m) => !bots.some((b) => b.id === m.member_id));
  let plan: BotPlan | null = null;
  if (pendiente) {
    plan = {
      botId: pendiente.id,
      nickname: pendiente.nickname,
      persona: pendiente.persona || "",
      replyTo: humanoUltimo?.id ?? null,
      heard: humanoUltimo?.body || "",
    };
  } else if (humanoUltimo && !msgs.some((m) => bots.some((b) => b.id === m.member_id) && m.created_at > humanoUltimo.created_at)) {
    const b = bots[Math.floor(Math.random() * bots.length)]!;
    plan = { botId: b.id, nickname: b.nickname, persona: b.persona || "", replyTo: humanoUltimo.id, heard: humanoUltimo.body || "" };
  }
  if (!plan) return;

  // candado corto: si la generación se cae, la sala se destraba sola
  await db.from("circles").update({ bot_busy_until: new Date(Date.now() + 60_000).toISOString() }).eq("id", circle.id);
  try {
    const persona = BOT_PERSONAS.find((p) => p.nickname === plan!.nickname);
    const texto = await botText(circle.level, prompt, persona?.trait || plan.persona, plan.heard);
    if (texto) {
      const id = crypto.randomUUID();
      const path = await speak(texto, persona?.voice || "alloy", `${circle.id}/bot-${id}.mp3`);
      await db.from("circle_messages").insert({
        id,
        circle_id: circle.id,
        member_id: plan.botId,
        task_idx: circle.task_idx,
        kind: path ? "voice" : "text",
        body: texto,
        audio_path: path,
        duration_ms: 0,
        reply_to: plan.replyTo,
      });
    }
  } finally {
    await db.from("circles").update({ bot_busy_until: null }).eq("id", circle.id);
  }
}

// ---- acceso ---------------------------------------------------------------
export async function loadCircle(code: string) {
  const db = await admin();
  const { data } = await db.from("circles").select("*").eq("code", code).maybeSingle();
  if (!data) return null;
  if (new Date(data.expires_at).getTime() <= Date.now()) return "expired" as const;
  return data;
}

export async function authMember(code: string, memberId: string, token: string) {
  const circle = await loadCircle(cleanCode(code));
  if (!circle || circle === "expired") return circle;
  const db = await admin();
  const { data } = await db
    .from("circle_members")
    .select("*")
    .eq("id", memberId)
    .eq("circle_id", circle.id)
    .maybeSingle();
  if (!data || data.token !== token) return null;
  return { circle, member: data };
}

// límite sencillo por IP, en memoria del worker
const hits = new Map<string, number[]>();
export function tooMany(ip: string, max: number, windowMs = 60_000) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > max;
}

export function ipOf(request: Request) {
  return (
    request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for") || "unknown"
  );
}
