import template from "../assets/demo-app.html?raw";
import dashboardTemplate from "../assets/demo-dashboard.html?raw";
import { BUILT_IN_PACKS, MASCOTS_DIR, type MascotPack } from "./mascot-packs";
import { type DemoConfig, shadeHex } from "./demo-config";
import { issueCourseToken } from "./course-token";

// Punto único donde se arma la página de un demo: coge la plantilla común y le
// inyecta la configuración de esta institución. La plantilla no sabe nada de
// demos; sólo lee window.DEMO y cae a sus valores de siempre si no existe.

const ASSET_BASE = "/demo-assets/";

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Serializa para incrustar dentro de <script>: `</script>` no puede aparecer literal. */
function json(v: unknown) {
  return JSON.stringify(v).replace(/</g, "\\u003c");
}

function headTags(cfg: DemoConfig) {
  const m = cfg.meta;
  const image = m.image ?? "https://aprendoenglish.com/social-preview.jpg";
  const alt = m.imageAlt ?? m.title;
  const icon = cfg.brand.appbarIcon ?? "/head.png";
  return `
<link rel="icon" href="${esc(icon)}">
<meta name="description" content="${esc(m.description)}">
<meta property="og:title" content="${esc(m.title)}">
<meta property="og:description" content="${esc(m.description)}">
<meta property="og:type" content="website">
<meta property="og:url" content="https://aprendoenglish.com/${esc(cfg.slug)}">
<meta property="og:image" content="${esc(image)}">
<meta property="og:image:secure_url" content="${esc(image)}">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(alt)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(m.title)}">
<meta name="twitter:description" content="${esc(m.description)}">
<meta name="twitter:image" content="${esc(image)}">`;
}

// Los valores de fábrica, tal como están escritos en la plantilla. Importan
// porque la sombra derivada no cae exactamente en el mismo tono: si un demo no
// toca el color, se le devuelve SU par original y no una aproximación, para que
// nada cambie de aspecto sin haberlo pedido.
const STOCK = {
  action: "#3FAA24",
  actionDark: "#2E7D1A",
  highlight: "#1CB0F6",
  highlightDark: "#1488C0",
};

/** Las variables CSS que puede mover un demo. El resto del tema es fijo. */
function themeCSS(cfg: DemoConfig) {
  const c = cfg.colors;

  // Verde = acción principal (Empecemos / Continuar / Empezar, acierto).
  // Azul = resalte (opción elegida, foco y pasos del onboarding).
  const action = c.action ?? STOCK.action;
  const highlight = c.highlight ?? STOCK.highlight;

  const vars = [
    `--accent:${c.accent}`,
    `--accent-d:${c.accentDark ?? shadeHex(c.accent, -0.24)}`,
    `--button:${c.button ?? c.accent}`,
    `--spinner:${c.spinner ?? c.accent}`,
    `--green:${action}`,
    `--greenDark:${c.actionDark ?? (c.action ? shadeHex(action, -0.28) : STOCK.actionDark)}`,
    `--blue:${highlight}`,
    `--blueDark:${c.highlightDark ?? (c.highlight ? shadeHex(highlight, -0.24) : STOCK.highlightDark)}`,
  ];
  return `<style id="demo-theme">:root{${vars.join(";")}}</style>`;
}

/**
 * Resuelve el pack de mascota. Un demo puede nombrar un pack incorporado
 * ('ozito', 'boti') o dar la URL de uno subido.
 */
function resolveMascot(cfg: DemoConfig) {
  const built = BUILT_IN_PACKS[cfg.mascot.pack];

  // Pack subido: su manifiesto viaja dentro de la configuración (lo guarda el
  // panel al subirlo), así no hay que ir a buscarlo para poder responder.
  const custom = !built && cfg.mascot.manifest ? (cfg.mascot.manifest as MascotPack) : null;

  const dir = built
    ? `${MASCOTS_DIR}${built.id}/`
    : (cfg.mascot.baseUrl ?? cfg.mascot.pack).replace(/\/?$/, "/");
  const pack = built ?? custom;
  return {
    dir,
    pack,
    runtime: {
      engine: pack?.engine ?? "layers",
      global: pack?.global ?? "Boti",
      fullName: cfg.mascot.fullName ?? pack?.name ?? "",
      name: cfg.mascot.name ?? pack?.shortName ?? pack?.name ?? "",
      kind: cfg.mascot.kind ?? pack?.kind ?? "",
      emoji: cfg.mascot.emoji ?? pack?.emoji ?? "",
      artboard: pack?.artboard ?? { width: 2, height: 3 },
      headIcon: pack?.headIcon ? dir + pack.headIcon : "",
    },
  };
}

/**
 * El icono de la barra superior, ya resuelto.
 *
 * La plantilla lo traía escrito a mano —la cabeza de Boti— y lo cambiaba el JS
 * al arrancar. Con la caché fría eso deja ver a Boti un instante en un demo cuya
 * mascota es otra: al cliente le parece que su personaje es uno más del montón.
 * Al escribirlo aquí, el primer pintado ya es el suyo.
 *
 * La regla es la misma que aplica applyIcons() en la plantilla, y tiene que
 * seguir siéndolo: manda el icono que haya subido el demo, la cabeza de la
 * mascota es el respaldo, y «none» deja el título solo.
 */
function appbarIcon(cfg: DemoConfig, m: ReturnType<typeof resolveMascot>) {
  const propio = cfg.brand.appbarIcon;
  if (propio === "none") return `<img class="appbar-en" alt="" hidden>`;
  const src = propio || m.runtime.headIcon;
  if (!src) return `<img class="appbar-en" alt="" hidden>`;
  // brand-icon achica el icono subido; la cabeza de la mascota va sin él, que
  // desborda la barra a propósito.
  return `<img class="appbar-en${propio ? " brand-icon" : ""}" src="${esc(src)}" alt="">`;
}

/** Las etiquetas <script> que cargan la mascota, según su motor. */
function mascotScripts(m: ReturnType<typeof resolveMascot>) {
  if (!m.pack) return "";
  if (m.pack.engine === "script") {
    return `<script src="${esc(m.dir + (m.pack.entry ?? "mascot.js"))}"></script>`;
  }
  return (
    `<script src="${esc(MASCOTS_DIR)}mascot-runtime.js"></script>\n` +
    `<script>Mascot.init(${json(m.pack)}, ${json(m.dir)});</script>`
  );
}

/** Slug que no corresponde a ningún demo publicado. */
export function renderDemoNotFound(slug: string): Response {
  const page = `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<link rel="icon" href="/head.png">
<title>Demo no encontrado</title>
<style>
  body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;
       font:16px/1.6 ui-rounded,'Segoe UI',system-ui,sans-serif;color:#1A1A1A;background:#F4F4F6;padding:24px}
  .c{max-width:420px;text-align:center}
  h1{font-size:22px;margin:0 0 8px}
  p{color:#5C5159;margin:0 0 20px}
  code{background:rgba(0,0,0,.06);padding:2px 6px;border-radius:6px;font:600 14px ui-monospace,monospace}
  a{display:inline-block;background:#7C1C56;color:#fff;text-decoration:none;font-weight:700;
    padding:11px 20px;border-radius:12px}
</style></head><body><div class="c">
<h1>Aquí no hay ningún demo</h1>
<p>El enlace <code>/${esc(slug)}</code> no corresponde a ningún link publicado en este sitio.</p>
<a href="/demo">Ver el demo general</a>
</div></body></html>`;
  return new Response(page, {
    status: 404,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

/**
 * Mete en una plantilla la configuración del demo: base de assets, cabeceras,
 * tema y mascota. Lo comparten la app y el panel de progreso, que necesitan
 * exactamente lo mismo.
 */
async function inject(tpl: string, cfg: DemoConfig, opts: { head?: boolean } = {}) {
  const mascot = resolveMascot(cfg);
  // Pase para pedir el contenido del curso. Va dentro de la pagina, asi que solo
  // lo tiene quien la ha abierto; caduca a las 6 h.
  const courseToken = await issueCourseToken(cfg.slug);
  const demo = {
    slug: cfg.slug,
    institution: cfg.institution,
    colors: cfg.colors,
    icons: cfg.icons,
    copy: cfg.copy,
    brand: cfg.brand,
    map: cfg.map,
    features: cfg.features,
    mascot: mascot.runtime,
    courseToken,
  };
  return (
    tpl
      .replace(
        "<head>",
        `<head><base href="${ASSET_BASE}">${opts.head ? headTags(cfg) : ""}
` + `<script>window.DEMO=${json(demo)};</script>`,
      )
      // El tema cierra el <head>: antes lo pisaría el :root de la plantilla.
      .replace(
        "</head>",
        `${themeCSS(cfg)}
</head>`,
      )
      .replace("<!--MASCOT-SCRIPTS-->", mascotScripts(mascot))
      // El icono de la barra, resuelto antes de servir: si se deja el de la
      // plantilla, se ve a Boti mientras arranca el JS.
      .replace(/<img class="appbar-en"[^>]*>/, () => appbarIcon(cfg, mascot))
  );
}

/** El panel de progreso, con la marca y la mascota del demo que lo abre. */
export async function renderDemoDashboard(cfg: DemoConfig): Promise<Response> {
  return new Response(await inject(dashboardTemplate, cfg), {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

export async function renderDemoPage(cfg: DemoConfig): Promise<Response> {
  // Misma inyección que el panel; lo propio de la app son las cabeceras para
  // compartir y el título.
  const html = (await inject(template, cfg, { head: true })).replace(
    "<title>Inglés para moverte</title>",
    `<title>${esc(cfg.meta.title)}</title>`,
  );

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
