// Cambia a Boti por la mascota del demo de cada marca, al servir la presentación.
//
// Las presentaciones son HTML subidos tal cual (~25 MB, viven como asset), con
// Boti dibujado dentro: un SVG aparcado en #boti-park que el propio HTML va
// mudando de slide en slide. En vez de reeditar y volver a subir ese archivo,
// aquí se le inyecta al vuelo un bloque en el <head> que:
//
//   1) esconde el SVG de Boti,
//   2) ajusta la proporción del hueco a la del artboard de la otra mascota,
//   3) monta el pack del demo dentro de #boti-host (el contenedor que el HTML
//      mueve), así que el reposicionamiento por slide sigue funcionando,
//   4) apaga el motor de animación de Boti si llegó a arrancar.
//
// Al leer la configuración del demo en cada respuesta, cambiar la mascota desde
// /demos se refleja en la presentación sin tocar nada más.

import { getDemoConfig } from "./demo-config";
import { BUILT_IN_PACKS, MASCOTS_DIR, type MascotPack } from "./mascot-packs";

const esc = (s: string) =>
  String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const json = (v: unknown) => JSON.stringify(v).replace(/</g, "\\u003c");

/** El pack del demo y la carpeta donde viven sus archivos. */
function packOf(cfg: { mascot: { pack: string; baseUrl?: string; manifest?: unknown } }) {
  const built = BUILT_IN_PACKS[cfg.mascot.pack];
  const custom = !built && cfg.mascot.manifest ? (cfg.mascot.manifest as MascotPack) : null;
  const pack = built ?? custom;
  if (!pack) return null;
  const dir = built
    ? `/demo-assets/${MASCOTS_DIR}${built.id}/`
    : (cfg.mascot.baseUrl ?? cfg.mascot.pack).replace(/\/?$/, "/");
  return { pack, dir };
}

/**
 * El <head> extra que reemplaza la mascota. Cadena vacía si el demo no existe,
 * si no tiene pack propio o si ya usa a Boti: en esos casos la presentación se
 * sirve tal como está.
 */
export async function mascotaDelDemo(slug: string): Promise<string> {
  const cfg = await getDemoConfig(slug).catch(() => null);
  if (!cfg) return "";
  const resolved = packOf(cfg);
  if (!resolved || resolved.pack.id === "boti") return "";

  const { pack, dir } = resolved;
  const art = pack.artboard ?? { width: 2, height: 3 };
  const root = (pack.rootClass as string) || "mascot";
  const css = pack.css ? `<link rel="stylesheet" href="${esc(dir + String(pack.css))}">` : "";

  // Los packs de un solo archivo (motor 'script') no se contemplan aquí: los
  // incorporados de ese tipo son justamente Boti.
  if (pack.engine === "script") return "";

  return `
${css}
${wardrobeCSS(pack, cfg.mascot)}
<style id="mascota-demo">
#boti-svg{display:none !important}
.boti-slot{aspect-ratio:${art.width}/${art.height} !important}
#boti-host .mascota-demo{position:relative;width:100%;height:100%;
  filter:drop-shadow(0 16px 20px rgba(1,9,39,.16))}
.bg-navy #boti-host .mascota-demo{filter:drop-shadow(0 16px 24px rgba(0,0,0,.42))}
</style>
<script src="/demo-assets/${MASCOTS_DIR}mascot-runtime.js"></script>
<script>
(function(){
  var pack = ${json(pack)}, dir = ${json(dir)};
  function poner(){
    var host = document.getElementById('boti-host');
    if (!host || !window.Mascot) return;
    try { if (window.BotiAnimation && window.BotiAnimation.pause) window.BotiAnimation.pause(); } catch (e) {}
    window.Mascot.init(pack, dir);
    var box = document.createElement('div');
    box.className = 'mascota-demo ${esc(root)}';
    box.innerHTML = window.Mascot.html();
    host.textContent = '';
    host.appendChild(box);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', poner);
  else poner();
})();
</script>
`;
}
