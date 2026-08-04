// Pase de corta duración para pedir el contenido del curso.
//
// Qué resuelve y qué NO:
//
//   · SÍ: que el curso no se baje con una sola petición a una URL fija. Ahora
//     hay que abrir una página, sacar el pase y usarlo antes de que caduque,
//     lo cual además se puede limitar y contar.
//   · NO: impedir que alguien decidido se lo lleve. Lo que el navegador pinta,
//     el usuario lo tiene. Cualquier "cifrado" en el cliente lleva la llave
//     dentro. Esto sube el coste y deja rastro; no es una cerradura.
//
// El pase va firmado con HMAC-SHA256 sobre Web Crypto, que existe tanto en
// Cloudflare Workers como en Node.

const enc = new TextEncoder();

/**
 * Secreto de firma. Si no hay uno en el entorno se usa uno fijo: el pase sigue
 * cumpliendo su función —caducar y permitir el recuento—, pero deja de ser
 * imprevisible. Para que lo sea, define COURSE_TOKEN_SECRET.
 */
function secret() {
  return (
    (typeof process !== "undefined" && process.env && process.env.COURSE_TOKEN_SECRET) ||
    "aprendoenglish-curso-pase-por-defecto"
  );
}

const b64url = (b: ArrayBuffer | Uint8Array) => {
  const bytes = b instanceof Uint8Array ? b : new Uint8Array(b);
  let s = "";
  for (const x of bytes) s += String.fromCharCode(x);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

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

/** Cuánto vale un pase. Lo justo para una sesión larga de estudio. */
const TTL_MS = 6 * 60 * 60 * 1000;

/**
 * Emite un pase para un demo. Va dentro de la página que sirve el servidor, así
 * que sólo lo tiene quien la ha abierto de verdad.
 */
export async function issueCourseToken(slug: string, now = Date.now()) {
  const payload = `${slug}.${now + TTL_MS}`;
  return `${b64url(enc.encode(payload))}.${await sign(payload)}`;
}

/** Comprueba un pase. Devuelve el slug para el que se emitió, o null. */
export async function verifyCourseToken(token: string, now = Date.now()): Promise<string | null> {
  if (!token || token.length > 512) return null;
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
  const slug = payload.slice(0, sep);
  const exp = Number(payload.slice(sep + 1));
  if (!exp || exp < now) return null;
  return slug;
}
