import template from "../assets/demo-app.html?raw";
import dashboardTemplate from "../assets/demo-dashboard.html?raw";
import { BUILT_IN_PACKS, MASCOTS_DIR, wardrobeCSS, type MascotPack } from "./mascot-packs";
import { type DemoConfig, fontStack, fontsHref, shadeHex } from "./demo-config";
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

/**
 * Una subpágina del demo (el panel, la vista de familia). Cambia el título, la
 * descripción y la og:url; el resto de la marca —imagen social, favicon— sigue
 * siendo la del demo, que es justo lo que se quiere.
 */
export type DemoSubpage = { title: string; description: string; path: string };

function headTags(cfg: DemoConfig, page?: DemoSubpage) {
  const m = cfg.meta;
  const image = m.image ?? "https://aprendoenglish.com/social-preview.jpg";
  const alt = m.imageAlt ?? m.title;
  const icon = cfg.brand.appbarIcon ?? "/head.png";
  const title = page?.title ?? m.title;
  const description = page?.description ?? m.description;
  const url = `https://aprendoenglish.com/${esc(cfg.slug)}${page ? esc(page.path) : ""}`;
  return `
<link rel="icon" href="${esc(icon)}">
<meta name="description" content="${esc(description)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:type" content="website">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${esc(image)}">
<meta property="og:image:secure_url" content="${esc(image)}">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(alt)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
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
/**
 * La pantalla de bienvenida, resuelta EN EL SERVIDOR.
 *
 * Va en el HTML que se envía, no la monta el JS: si esperara al script, el
 * visitante vería un instante del demo desnudo antes de la marca, que es justo
 * lo contrario de lo que busca un splash.
 *
 * Los colores viajan como variables CSS. Cualquier hueco se deriva del acento
 * del demo, así que uno que no configure nada ya sale con su propia marca.
 */
function splashHTML(cfg: DemoConfig) {
  const s = cfg.splash ?? {};
  if (s.enabled === false) return "";

  const accent = cfg.colors.accent;
  const c = s.colors ?? {};
  const from = c.from || shadeHex(accent, -0.55);
  const to = c.to || shadeHex(accent, 0.12);
  const glow = c.accent || shadeHex(accent, 0.45);
  const style = s.style || "aurora";
  const dur = Math.max(600, Math.min(10000, Number(s.duration) || 2600));

  // La marca: el logo si lo hay, si no el texto de cabecera, y si tampoco, el
  // nombre de la institución. Siempre hay algo que enseñar.
  // El de la bienvenida manda sobre el de cabecera: a pantalla completa suele
  // pedir otra versión del logotipo.
  const logo = s.logo || cfg.brand.logo;
  const rotulo = cfg.brand.headerText || cfg.institution || "";

  // Las partículas de "constelación" son el único caso que necesita nodos de
  // verdad, y viven pegadas al logo: giran y convergen tomándolo como centro.
  const estrellas =
    style === "constelacion"
      ? `<span class="sp-stars">${Array.from({ length: 14 }, (_, i) => `<i style="--i:${i}"></i>`).join("")}</span>`
      : "";
  const nucleo = logo
    ? `<img class="sp-logo" src="${esc(logo)}" alt="${esc(rotulo)}">`
    : `<div class="sp-word">${esc(rotulo)}</div>`;
  const marca = `<span class="sp-halo">${nucleo}${estrellas}</span>`;

  const frase = s.phrase ? `<p class="sp-phrase">${esc(s.phrase)}</p>` : "";

  return `<div id="demo-splash" class="sp sp-${esc(style)}" data-dur="${dur}"
  style="--sp-from:${esc(from)};--sp-to:${esc(to)};--sp-glow:${esc(glow)}">
  <div class="sp-deco"></div>
  <div class="sp-mark">${marca}${frase}</div>
  
</div>`;
}

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

    // El panel de seguimiento (/dashboard y /padres) venía pintado con una
    // paleta violeta propia —--violet, --violet2, --violet-soft— que no tocaba
    // ninguna de las variables de arriba, así que salía con el mismo morado
    // para todas las instituciones por mucho color que se eligiera en /demos.
    // Se reenganchan al acento: el degradado y los fondos suaves salen de él.
    `--violet:${c.accent}`,
    `--violet2:${shadeHex(c.accent, 0.24)}`,
    `--violet-soft:${shadeHex(c.accent, 0.88)}`,
  ];

  // Barra superior del panel. Solo se emite si el demo la fijó: la plantilla
  // trae un `var(--bar-1, …)` con el color de siempre como respaldo, así que no
  // declararla deja cada cabecera como estaba y evita repintar demos ya hechos.
  if (c.dashboardBar) {
    vars.push(`--bar-1:${c.dashboardBar}`, `--bar-2:${shadeHex(c.dashboardBar, 0.2)}`);
  }

  // El fondo de la página del panel: lo que rodea a la tarjeta del reporte. Era
  // lo único de esa pantalla que no se podía cambiar por institución —un gris
  // frío fijo con dos halos, uno violeta y otro turquesa—, así que un demo con
  // marca cálida acababa con su reporte flotando sobre un fondo de otra paleta.
  //
  // Mismo criterio que la barra de arriba: solo se emite si el demo lo fija. La
  // plantilla trae los valores de siempre como respaldo, así que no declararlo
  // deja cada panel exactamente como está hoy.
  if (c.dashboardBg) {
    vars.push(
      `--bg:${c.dashboardBg}`,
      // Los halos se rederivan de la marca en vez de quedarse en el violeta y el
      // turquesa de fábrica: sobre un fondo nuevo esos dos se leen como manchas.
      // Muy lavados a propósito — son un halo, no un color más de la pantalla.
      `--bg-glow1:${shadeHex(c.accent, 0.86)}`,
      `--bg-glow2:${shadeHex(highlight, 0.86)}`,
    );
  }

  // Tipografías y color de letra: sólo se emiten si el demo los define, así lo
  // ya publicado mantiene exactamente el aspecto de hoy.
  const ui = fontStack(cfg.type?.uiFont, "ui");
  const body = fontStack(cfg.type?.bodyFont, "body");
  if (ui) vars.push(`--font-round:${ui}`);
  if (body) vars.push(`--font-body:${body}`);
  if (c.ink) vars.push(`--ink:${c.ink}`);
  if (c.muted) vars.push(`--muted:${c.muted}`, `--muted2:${c.muted}`);
  if (c.header) vars.push(`--brand-ink:${c.header}`);

  // Los textos de marca: rótulo de cabecera y los de la bienvenida.
  const s = cfg.splash ?? {};
  const headerFont = fontStack(cfg.brand.headerFont, "ui");
  const titleFont = fontStack(s.titleFont, "ui");
  const phraseFont = fontStack(s.phraseFont, "ui");
  if (headerFont) vars.push(`--brand-font:${headerFont}`);
  if (titleFont) vars.push(`--sp-word-font:${titleFont}`);
  if (s.titleColor) vars.push(`--sp-word-ink:${s.titleColor}`);
  if (phraseFont) vars.push(`--sp-phrase-font:${phraseFont}`);
  if (s.phraseColor) vars.push(`--sp-phrase-ink:${s.phraseColor}`);

  const href = fontsHref(
    cfg.type?.uiFont,
    cfg.type?.bodyFont,
    cfg.brand.headerFont,
    s.titleFont,
    s.phraseFont,
  );

  const link = href
    ? `<link rel="preconnect" href="https://fonts.googleapis.com">` +
      `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>` +
      `<link rel="stylesheet" href="${esc(href)}">`
    : "";

  return `${link}<style id="demo-theme">:root{${vars.join(";")}}</style>`;
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
      // El recoloreado necesita esta misma cadena para cazar por CSS todos los
      // <img> de la cabeza, así que viaja al lado de ella.
      // Un demo guardado antes de que esto fueran capas trae `tint` a secas: se
      // lee como la primera capa, así no pierde su teñido.
      tints: cfg.mascot.tints ?? (cfg.mascot.tint ? [cfg.mascot.tint] : undefined),
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
  const motor =
    m.pack.engine === "script"
      ? `<script src="${esc(m.dir + (m.pack.entry ?? "mascot.js"))}"></script>`
      : `<script src="${esc(MASCOTS_DIR)}mascot-runtime.js"></script>\n` +
        `<script>Mascot.init(${json(m.pack)}, ${json(m.dir)});</script>`;
  // El recoloreado va después del motor y se enciende solo leyendo window.DEMO.
  // Se carga siempre, no sólo cuando está encendido: pesa poco y así el panel
  // no tiene que pedir una recarga distinta para verlo.
  return `${motor}\n<script src="mascot-tint.js"></script>`;
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
async function inject(
  tpl: string,
  cfg: DemoConfig,
  opts: {
    head?: boolean;
    view?: "parent" | "teacher";
    page?: DemoSubpage;
    /**
     * Si se pinta la bienvenida. Por defecto va con las cabeceras, que es como
     * se comportaba: el demo la tiene y el panel no. La app de una cuenta la
     * quiere sin las otras —es una página privada, no se comparte por WhatsApp—
     * así que aquí se separan.
     */
    splash?: boolean;
  } = {},
) {
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
    splash: cfg.splash,
    map: cfg.map,
    features: cfg.features,
    // Bancos de vocabulario especializado encendidos para este demo. La app los
    // manda en la petición del contenido; el índice llega ya con ellos dentro.
    vocab: cfg.vocab,
    // Las metas del panel. Viajan tal cual: la plantilla rellena los huecos con
    // los valores de fábrica, así que no hay que normalizarlas aquí — y hacerlo
    // en dos sitios es la forma segura de que acaben discrepando.
    metas: cfg.metas,
    mascot: mascot.runtime,
    courseToken,
    // Pestaña con la que abre el panel. La fija la URL (/<slug>/padres abre en
    // "parent"), no el cliente: el servidor no ve el #hash, así que el deep link
    // por hash de la plantilla no alcanza para enrutarlo.
    view: opts.view,
  };
  return (
    tpl
      .replace(
        "<head>",
        `<head><base href="${ASSET_BASE}">${opts.head ? headTags(cfg, opts.page) : ""}
` + `<script>window.DEMO=${json(demo)};</script>`,
      )
      // El <title> de la plantilla es genérico ("Dashboard · Seguimiento para
      // familias y profesores"). En una subpágina lo pisamos con el de la
      // institución: es lo que se ve en la pestaña y al compartir el enlace.
      // Reemplazo por función, no por cadena: un "$" en el nombre de la
      // institución se interpretaría como grupo de captura y saldría mutilado.
      .replace(/<title>[\s\S]*?<\/title>/, (m) =>
        opts.page ? `<title>${esc(opts.page.title)}</title>` : m,
      )
      // Página de una sola vista: la pestaña se fija AQUÍ y no en el cliente.
      // Si la decidiera el JS del final de la página, el navegador alcanzaría a
      // pintar la vista de familia antes de saltar a la de profesor, y en
      // /dashboard se vería el parpadeo.
      .replace(/<body(\s[^>]*)?>/, (m, attrs) =>
        opts.view ? `<body${attrs ?? ""} class="solo solo-${opts.view}">` : m,
      )
      .replace(/<section class="view( on)?" id="(parent|teacher)">/g, (m, _on, id) =>
        opts.view ? `<section class="view${id === opts.view ? " on" : ""}" id="${id}">` : m,
      )
      // El tema cierra el <head>: antes lo pisaría el :root de la plantilla.
      .replace(
        "</head>",
        `${themeCSS(cfg)}${wardrobeCSS(mascot.pack, cfg.mascot)}
</head>`,
      )
      .replace("<!--MASCOT-SCRIPTS-->", mascotScripts(mascot))
      // El splash solo en la app; el panel de progreso no se abre en frío.
      .replace("<!--SPLASH-->", () => ((opts.splash ?? opts.head) ? splashHTML(cfg) : ""))
      // El icono de la barra, resuelto antes de servir: si se deja el de la
      // plantilla, se ve a Boti mientras arranca el JS.
      .replace(/<img class="appbar-en"[^>]*>/, () => appbarIcon(cfg, mascot))
  );
}

// La página de un demo se arma en cada petición y cambia en cuanto se guarda en
// el panel. Sin cabecera, el navegador le asigna una caducidad por su cuenta y
// recargar podía seguir enseñando lo anterior. `no-store` lo descarta: no es
// contenido estático, y rehacerla cuesta una consulta que además va cacheada en
// el servidor.
const SIN_CACHE = {
  "Content-Type": "text/html; charset=utf-8",
  "Cache-Control": "no-store, must-revalidate",
};

/** El panel de progreso, con la marca y la mascota del demo que lo abre. */
export async function renderDemoDashboard(
  cfg: DemoConfig,
  view?: "parent" | "teacher",
): Promise<Response> {
  // La vista de familia es la que se manda por WhatsApp o por correo, así que
  // se le pone su propio título y descripción: la tarjeta del enlace tiene que
  // decir de qué institución es y qué se va a ver al abrirla.
  const page: DemoSubpage =
    view === "parent"
      ? {
          title: `Progreso del alumno · ${cfg.institution}`,
          description: `Mira el avance semanal, la racha y los minutos de práctica en ${cfg.institution}.`,
          path: "/padres",
        }
      : {
          title: `Panel de seguimiento · ${cfg.institution}`,
          description: `Resumen semanal para familias y reporte de aula para profesores en ${cfg.institution}.`,
          path: "/dashboard",
        };
  return new Response(await inject(dashboardTemplate, cfg, { head: true, view, page }), {
    headers: SIN_CACHE,
  });
}

// La app y el panel de una cuenta con sesión son páginas privadas: no se
// comparten por enlace y no deben acabar en un buscador. Por eso no llevan las
// cabeceras para redes (og:*) y sí `noindex`, y por eso la caché es privada.
const PRIVADO = {
  "Content-Type": "text/html; charset=utf-8",
  "Cache-Control": "private, no-store, must-revalidate",
  "X-Robots-Tag": "noindex, nofollow",
};

/** Un <title> propio y `noindex`, para las páginas que van tras el login. */
function privateHead(tpl: string, title: string) {
  return tpl
    .replace("<head>", `<head><meta name="robots" content="noindex,nofollow">`)
    .replace(/<title>[\s\S]*?<\/title>/, () => `<title>${esc(title)}</title>`);
}

/**
 * La app del alumno con la marca de SU institución.
 *
 * Es la misma plantilla que sirve un demo, con la misma inyección: lo único que
 * cambia es de dónde sale la configuración —de la cuenta que entra, no del slug
 * de la URL—. Eso es deliberado: lo que la institución vio y aprobó en su demo
 * es literalmente lo que ve después su alumno al iniciar sesión, sin una
 * segunda plantilla que mantener al día.
 */
export async function renderOrgApp(cfg: DemoConfig): Promise<Response> {
  const title = cfg.institution ? `Inglés · ${cfg.institution}` : "Inglés para moverte";
  const html = privateHead(await inject(template, cfg, { splash: true }), title);
  return new Response(html, { headers: PRIVADO });
}

/** El panel de seguimiento de una cuenta con sesión, con su marca. */
export async function renderOrgDashboard(
  cfg: DemoConfig,
  view: "parent" | "teacher",
): Promise<Response> {
  const title =
    view === "teacher"
      ? `Panel de seguimiento${cfg.institution ? " · " + cfg.institution : ""}`
      : `Progreso del alumno${cfg.institution ? " · " + cfg.institution : ""}`;
  const html = privateHead(await inject(dashboardTemplate, cfg, { view }), title);
  return new Response(html, { headers: PRIVADO });
}

export async function renderDemoPage(cfg: DemoConfig): Promise<Response> {
  // Misma inyección que el panel; lo propio de la app son las cabeceras para
  // compartir y el título.
  const html = (await inject(template, cfg, { head: true })).replace(
    "<title>Inglés para moverte</title>",
    `<title>${esc(cfg.meta.title)}</title>`,
  );

  return new Response(html, { headers: SIN_CACHE });
}
