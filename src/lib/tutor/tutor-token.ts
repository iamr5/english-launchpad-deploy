// tutor-token.ts — pase corto para poder abrir una sesión de tutor.

const enc = new TextEncoder();

/** Con qué se firma. */
function secret(): string | null {
  const env = (typeof process !== "undefined" && process.env) || ({} as Record<string, string>);
  if (env["TUTOR_TOKEN_SECRET"]) return env["TUTOR_TOKEN_SECRET"] as string;
  if (env["SUPABASE_SERVICE_ROLE_KEY"]) return `tutor-token-v1:${env["SUPABASE_SERVICE_ROLE_KEY"]}`;
  return import.meta.env.DEV ? "aprendoenglish-tutor-pase-por-defecto" : null;
}

const b64url = (b: ArrayBuffer | Uint8Array) => {
  const bytes = b instanceof Uint8Array ? b : new Uint8Array(b);
  let s = "";
  for (const x of bytes) s += String.fromCharCode(x);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

async function sign(payload: string): Promise<string> {
  const clave = secret();
  if (!clave) {
    console.error("[tutor] falta TUTOR_TOKEN_SECRET o SUPABASE_SERVICE_ROLE_KEY");
    throw new Error("tutor_no_disponible");
  }
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(clave),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return b64url(await crypto.subtle.sign("HMAC", key, enc.encode(payload)));
}

/** Cuánto dura el pase. */
const TTL_MS = 30 * 60 * 1000;

export type TutorClaims = { sid: string; exp: number };

/** Identificador de sesión. */
export function newSessionId(): string {
  const b = new Uint8Array(12);
  crypto.getRandomValues(b);
  return b64url(b);
}

/** Emite un pase para una sesión de tutor. */
export async function issueTutorToken(sid = newSessionId(), now = Date.now()): Promise<string> {
  const payload = `${sid}.${now + TTL_MS}`;
  return `${b64url(enc.encode(payload))}.${await sign(payload)}`;
}

/** Comprueba un pase. */
export async function verifyTutorToken(
  token: string,
  now = Date.now(),
): Promise<TutorClaims | null> {
  if (!token || token.length > 512 || !secret()) return null;

  const dot = token.lastIndexOf(".");
  if (dot < 1) return null;

  const rawPayload = token.slice(0, dot);
  const sig = token.slice(dot + 1);

  let payload: string;
  try {
    payload = atob(rawPayload.replace(/-/g, "+").replace(/_/g, "/"));
  } catch {
    return null;
  }

  if ((await sign(payload)) !== sig) return null;

  const sep = payload.lastIndexOf(".");
  if (sep < 1) return null;

  const sid = payload.slice(0, sep);
  const exp = Number(payload.slice(sep + 1));
  if (!sid || !exp || exp < now) return null;

  return { sid, exp };
}

/**
 * Acceso a /api/tutor/*: vale el pase del tutor o el del curso. La app del
 * alumno ya lleva el del curso, así que no necesita pedir otro.
 */
export async function verifyTutorAccess(token: string): Promise<TutorClaims | null> {
  const tutor = await verifyTutorToken(token);
  if (tutor) return tutor;
  const env = (typeof process !== "undefined" && process.env) || ({} as Record<string, string>);
  if (!env["COURSE_TOKEN_SECRET"] && !import.meta.env.DEV) {
    console.error("[tutor] falta COURSE_TOKEN_SECRET: no se aceptan pases de curso");
    return null;
  }
  const { verifyCourseToken } = await import("@/lib/course-token");
  const slug = await verifyCourseToken(token);
  return slug ? { sid: newSessionId(), exp: Date.now() + 30 * 60 * 1000 } : null;
}
