import template from "../assets/demo-app.html?raw";
import ozitoPack from "../../public/demo-assets/mascots/ozito/mascot.json";
import botiPack from "../../public/demo-assets/mascots/boti/mascot.json";
import { type DemoConfig, shadeHex } from "./demo-config";

// Punto único donde se arma la página de un demo: coge la plantilla común y le
// inyecta la configuración de esta institución. La plantilla no sabe nada de
// demos; sólo lee window.DEMO y cae a sus valores de siempre si no existe.

const ASSET_BASE = "/demo-assets/";
const MASCOTS_DIR = "mascots/"; // relativo a ASSET_BASE

type MascotPack = {
  id: string;
  name: string;
  shortName?: string;
  kind?: string;
  emoji?: string;
  engine: "layers" | "script";
  artboard: { width: number; height: number };
  headIcon: string;
  entry?: string;
  global?: string;
  [k: string]: unknown;
};

const BUILT_IN: Record<string, MascotPack> = {
  ozito: ozitoPack as MascotPack,
  boti: botiPack as MascotPack,
};

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

/** Las variables CSS que puede mover un demo. El resto del tema es fijo. */
function themeCSS(cfg: DemoConfig) {
  const c = cfg.colors;
  const vars = [
    `--accent:${c.accent}`,
    `--accent-d:${c.accentDark ?? shadeHex(c.accent, -0.24)}`,
    `--button:${c.button ?? c.accent}`,
    `--spinner:${c.spinner ?? c.accent}`,
  ];
  return `<style id="demo-theme">:root{${vars.join(";")}}</style>`;
}

/**
 * Resuelve el pack de mascota. Un demo puede nombrar un pack incorporado
 * ('ozito', 'boti') o dar la URL de uno subido.
 */
function resolveMascot(cfg: DemoConfig) {
  const built = BUILT_IN[cfg.mascot.pack];
  const dir = built ? `${MASCOTS_DIR}${built.id}/` : cfg.mascot.pack.replace(/\/?$/, "/");
  const pack = built ?? null;
  return {
    dir,
    pack,
    runtime: {
      engine: pack?.engine ?? "layers",
      global: pack?.global ?? "Boti",
      name: cfg.mascot.name ?? pack?.shortName ?? pack?.name ?? "",
      kind: cfg.mascot.kind ?? pack?.kind ?? "",
      emoji: cfg.mascot.emoji ?? pack?.emoji ?? "",
      artboard: pack?.artboard ?? { width: 2, height: 3 },
      headIcon: pack?.headIcon ? dir + pack.headIcon : "",
    },
  };
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
<p>El enlace <code>/${esc(slug)}</code> no corresponde a ningún demo publicado.
Puede que se haya escrito mal o que aún no esté activo.</p>
<a href="/demo">Ver el demo general</a>
</div></body></html>`;
  return new Response(page, {
    status: 404,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

export function renderDemoPage(cfg: DemoConfig): Response {
  const mascot = resolveMascot(cfg);

  // Sólo viaja al navegador lo que la plantilla realmente lee.
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
  };

  const html = template
    .replace(
      "<head>",
      `<head><base href="${ASSET_BASE}">${headTags(cfg)}\n${themeCSS(cfg)}\n` +
        `<script>window.DEMO=${json(demo)};</script>`,
    )
    .replace("<!--MASCOT-SCRIPTS-->", mascotScripts(mascot))
    .replace("<title>Inglés para moverte</title>", `<title>${esc(cfg.meta.title)}</title>`);

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
