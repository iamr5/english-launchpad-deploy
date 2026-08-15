// Pase corto para pedir la página de la app ya pintada con la marca de la
// institución de quien entra.
//
// Por qué hace falta un pase y no basta con la sesión: la sesión de Supabase
// vive en localStorage y viaja como cabecera Authorization, y un <iframe src>
// no lleva cabeceras. El shell de la app ES un iframe (así ha estado siempre:
// /app envuelve una página suelta de 3000 líneas). Así que la ruta de React,
// que sí tiene la sesión, pide un pase por RPC —donde el bearer sí viaja— y lo
// pone en la URL del iframe.
//
// Se firma con HMAC-SHA256 sobre Web Crypto, igual que el pase del curso, que
// existe tanto en Cloudflare Workers como en Node. Y dura poco: 10 minutos son
// de sobra para cargar una página, y un enlace que se copie por accidente deja
// de servir enseguida.
//
// Qué NO es: una sesión. El pase sólo abre la página; todo lo que esa página
// haga después contra la base sigue pasando por RLS con la sesión de verdad.

const enc = new TextEncoder();

function secret() {
  return (
    (typeof process !== "undefined" && process.env && process.env.APP_SHELL_SECRET) ||
    (typeof process !== "undefined" && process.env && process.env.COURSE_TOKEN_SECRET) ||
    "aprendoenglish-shell-pase-por-defecto"
  );
}

const b64url = (b: ArrayBuffer | Uint8Array) => {
  const bytes = b instanceof Uint8Array ? b : new Uint8Array(b);
  let s = "";
  for (const x of bytes) s += String.fromCharCode(x);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

const unb64url = (s: string) => atob(s.replace(/-/g, "+").replace(/_/g, "/"));

async function sign(payload: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return b64url(await crypto.subtle.sign("HMAC", key, enc.encode(payload)));
}

/** Lo justo para que cargue una página. Un enlace filtrado caduca solo. */
const TTL_MS = 10 * 60 * 1000;

export type ShellClaims = {
  /** A quién se le emitió. Es lo que decide qué marca se pinta. */
  uid: string;
  /** Su correo, para poder resolver la institución por dominio. */
  email?: string;
  /** Qué vista pide: la app del alumno o el panel de familia/profesor. */
  view?: "parent" | "teacher";
};

/**
 * Emite un pase. El cuerpo va en JSON dentro de base64url en vez de campos
 * separados por puntos: un correo lleva puntos y un nombre de institución
 * puede llevar cualquier cosa, y trocear por el separador acabaría partiendo
 * mal el pase de alguien.
 */
export async function issueShellToken(claims: ShellClaims, now = Date.now()) {
  const payload = b64url(enc.encode(JSON.stringify({ ...claims, exp: now + TTL_MS })));
  return `${payload}.${await sign(payload)}`;
}

/** Comprueba un pase. Devuelve lo que declara, o null si no vale. */
export async function verifyShellToken(
  token: string,
  now = Date.now(),
): Promise<ShellClaims | null> {
  if (!token || token.length > 1024) return null;
  const dot = token.lastIndexOf(".");
  if (dot < 1) return null;

  const payload = token.slice(0, dot);
  if ((await sign(payload)) !== token.slice(dot + 1)) return null;

  try {
    const claims = JSON.parse(unb64url(payload)) as ShellClaims & { exp?: number };
    if (!claims?.uid || !claims.exp || claims.exp < now) return null;
    return { uid: claims.uid, email: claims.email, view: claims.view };
  } catch {
    return null;
  }
}
