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

/**
 * Con qué se firma el pase.
 *
 * El orden importa, y el segundo escalón es el que evita un fallo silencioso:
 *
 *  1. APP_SHELL_SECRET, si alguien se molestó en ponerlo.
 *  2. Si no, se deriva de SUPABASE_SERVICE_ROLE_KEY. Esa clave YA está en el
 *     entorno del servidor —la usa client.server.ts—, es secreta y es estable,
 *     así que da una firma imprevisible sin que haya que configurar nada.
 *     No se usa tal cual sino con una etiqueta delante: así el material de
 *     firma de esto no es el mismo que el de ningún otro uso de esa clave.
 *  3. Y sólo si tampoco hay clave de servicio —o sea, en local— una cadena
 *     fija, que es previsible y está bien que lo sea mientras se desarrolla.
 *
 * Lo que se gana con el paso 2: antes, olvidarse de la variable dejaba el pase
 * firmado con una cadena escrita en el repositorio y NADA lo delataba, porque
 * todo seguía funcionando igual. Ahora, en producción, no hay forma de acabar
 * en el escalón 3 sin que la app entera esté ya rota por otro motivo.
 */
function secret() {
  const env = (typeof process !== "undefined" && process.env) || ({} as Record<string, string>);
  if (env.APP_SHELL_SECRET) return env.APP_SHELL_SECRET;
  if (env.SUPABASE_SERVICE_ROLE_KEY) return `app-shell-token-v1:${env.SUPABASE_SERVICE_ROLE_KEY}`;
  return "aprendoenglish-shell-pase-por-defecto";
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
