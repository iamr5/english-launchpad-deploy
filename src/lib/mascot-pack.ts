// Subir y descargar packs de mascota.
//
// Un pack es una carpeta comprimida: mascot.json (el manifiesto), mascot.css (la
// animación) y layers/*.svg (el arte). Ver public/demo-assets/mascots/README.md.
//
// Al subirlo se valida, se guardan los archivos en el bucket y el MANIFIESTO se
// copia dentro de la configuración del demo. Así el servidor puede pintar la
// página sin ir a buscar nada: ya sabe la proporción, el icono de cabeza y las
// capas antes de responder.

import { unzipSync, zipSync, strToU8, strFromU8 } from "fflate";
import { supabase } from "@/integrations/supabase/client";

const BUCKET = "demo-brand";

/** Extensiones que se aceptan dentro de un pack. Cualquier otra cosa se ignora. */
const ALLOWED = /\.(svg|png|jpe?g|webp|css|json|md|html)$/i;
const MAX_FILE = 3 * 1024 * 1024; // 3 MB por archivo
const MAX_TOTAL = 15 * 1024 * 1024; // 15 MB el pack entero

export type MascotManifest = {
  id: string;
  name: string;
  shortName?: string;
  kind?: string;
  emoji?: string;
  engine: "layers" | "script";
  artboard: { width: number; height: number };
  headIcon: string;
  css?: string;
  rootClass?: string;
  shadow?: boolean;
  layers?: Record<string, string>;
  stack?: unknown[];
  entry?: string;
  global?: string;
};

export type PackCheck = {
  ok: boolean;
  manifest: MascotManifest | null;
  files: { path: string; bytes: number }[];
  errors: string[];
  warnings: string[];
};

/** Quita la carpeta contenedora si el zip trae todo dentro de una sola. */
function stripRoot(names: string[]): (p: string) => string {
  const tops = new Set(names.map((n) => n.split("/")[0]));
  const single = tops.size === 1 && names.every((n) => n.includes("/"));
  const root = single ? [...tops][0] + "/" : "";
  return (p: string) => (root && p.startsWith(root) ? p.slice(root.length) : p);
}

/**
 * Abre el zip y comprueba que sea un pack usable. No sube nada: sirve para
 * enseñar los problemas antes de tocar el almacenamiento.
 */
export async function inspectPack(file: File): Promise<PackCheck> {
  const errors: string[] = [];
  const warnings: string[] = [];
  const out: PackCheck = { ok: false, manifest: null, files: [], errors, warnings };

  let entries: Record<string, Uint8Array>;
  try {
    entries = unzipSync(new Uint8Array(await file.arrayBuffer()));
  } catch {
    errors.push("No se pudo abrir el archivo. ¿Seguro que es un .zip?");
    return out;
  }

  const names = Object.keys(entries).filter((n) => !n.endsWith("/"));
  if (!names.length) {
    errors.push("El zip está vacío.");
    return out;
  }
  const rel = stripRoot(names);

  const kept: Record<string, Uint8Array> = {};
  let total = 0;
  for (const name of names) {
    const path = rel(name);
    if (path.startsWith("__MACOSX") || path.split("/").pop()!.startsWith(".")) continue;
    if (path.includes("..")) {
      errors.push(`Ruta no permitida: ${path}`);
      continue;
    }
    if (!ALLOWED.test(path)) {
      warnings.push(`Se ignora ${path} (tipo de archivo no admitido).`);
      continue;
    }
    const bytes = entries[name];
    if (bytes.length > MAX_FILE) {
      errors.push(`${path} pesa más de 3 MB.`);
      continue;
    }
    total += bytes.length;
    kept[path] = bytes;
    out.files.push({ path, bytes: bytes.length });
  }
  if (total > MAX_TOTAL) errors.push("El pack entero supera los 15 MB.");

  // --- manifiesto ---
  const raw = kept["mascot.json"];
  if (!raw) {
    errors.push("Falta mascot.json en la raíz del pack.");
    return out;
  }
  let m: MascotManifest;
  try {
    m = JSON.parse(strFromU8(raw));
  } catch (e) {
    errors.push("mascot.json no es JSON válido: " + (e as Error).message);
    return out;
  }
  out.manifest = m;

  for (const k of ["id", "name", "engine", "artboard", "headIcon"] as const) {
    if (!m[k]) errors.push(`mascot.json: falta «${k}».`);
  }
  if (m.engine && m.engine !== "layers" && m.engine !== "script")
    errors.push('mascot.json: «engine» debe ser "layers" o "script".');
  if (m.artboard && (!m.artboard.width || !m.artboard.height))
    errors.push("mascot.json: «artboard» necesita width y height.");
  if (m.id && !/^[a-z0-9][a-z0-9-]*$/.test(m.id))
    errors.push("mascot.json: «id» sólo admite minúsculas, números y guiones.");

  // --- que exista lo que el manifiesto promete ---
  const need = (p?: string) =>
    p && !kept[p] && errors.push(`El manifiesto apunta a ${p}, que no está en el zip.`);
  need(m.headIcon);
  if (m.engine === "layers") {
    need(m.css);
    for (const [layer, path] of Object.entries(m.layers ?? {})) {
      if (!kept[path]) errors.push(`La capa «${layer}» apunta a ${path}, que no está en el zip.`);
    }
    if (!m.layers || !Object.keys(m.layers).length)
      errors.push("Un pack de capas necesita al menos una capa en «layers».");
    if (!m.stack || !(m.stack as unknown[]).length)
      errors.push("Falta «stack»: el orden en que se apilan las capas.");
  } else if (m.engine === "script") {
    need(m.entry);
    if (!m.global) errors.push("Un pack de script necesita «global».");
  }

  // --- saneado: nada que llame a casa ni ejecute código ajeno ---
  for (const [path, bytes] of Object.entries(kept)) {
    if (!/\.(svg|css|html)$/i.test(path)) continue;
    const text = strFromU8(bytes);
    if (/\.svg$/i.test(path)) {
      if (/<script[\s>]/i.test(text)) errors.push(`${path} contiene <script>.`);
      if (/\son\w+\s*=/i.test(text))
        errors.push(`${path} contiene manejadores de eventos (onload, onclick…).`);
    }
    if (/\.css$/i.test(path) && /@import/i.test(text)) errors.push(`${path} usa @import.`);
    if (/url\(\s*['"]?https?:/i.test(text))
      errors.push(`${path} carga recursos de un dominio externo.`);
  }

  out.ok = errors.length === 0;
  return out;
}

/**
 * Sube un pack ya validado y devuelve lo que hay que guardar en la
 * configuración del demo.
 */
export async function uploadPack(
  slug: string,
  file: File,
): Promise<{ baseUrl: string; manifest: MascotManifest }> {
  const check = await inspectPack(file);
  if (!check.ok || !check.manifest) {
    throw new Error(check.errors.join("\n") || "El pack no es válido.");
  }

  const entries = unzipSync(new Uint8Array(await file.arrayBuffer()));
  const names = Object.keys(entries).filter((n) => !n.endsWith("/"));
  const rel = stripRoot(names);
  const dir = `${slug}/mascot/${check.manifest.id}-${Date.now()}`;

  for (const name of names) {
    const path = rel(name);
    if (!ALLOWED.test(path) || path.includes("..") || path.startsWith("__MACOSX")) continue;
    if (path.split("/").pop()!.startsWith(".")) continue;
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(`${dir}/${path}`, new Blob([entries[name] as BlobPart], { type: mime(path) }), {
        cacheControl: "31536000",
        upsert: true,
      });
    if (error) throw new Error(`Al subir ${path}: ${error.message}`);
  }

  return { baseUrl: `/api/brand/${dir}/`, manifest: check.manifest };
}

function mime(path: string) {
  const ext = path.split(".").pop()!.toLowerCase();
  return (
    {
      svg: "image/svg+xml",
      png: "image/png",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      webp: "image/webp",
      css: "text/css",
      json: "application/json",
      html: "text/html",
      md: "text/markdown",
    }[ext] ?? "application/octet-stream"
  );
}

/**
 * Arma el zip de plantilla descargando el pack `ozito` que ya sirve el sitio.
 * `blank` sustituye el arte por siluetas de relleno, conservando los nombres de
 * capa, los pivotes y los comentarios: se redibuja encima sin tocar el andamiaje.
 */
export async function downloadTemplate(blank: boolean) {
  const base = "/demo-assets/mascots/ozito/";
  const manifest: MascotManifest = await (await fetch(base + "mascot.json")).json();

  const files: Record<string, Uint8Array> = {};
  const grab = async (p: string) => {
    const r = await fetch(base + p);
    if (!r.ok) throw new Error(`No se pudo leer ${p} (${r.status})`);
    files[p] = new Uint8Array(await r.arrayBuffer());
  };

  await grab("mascot.json");
  await grab("mascot.css");
  await grab("preview.html");
  await grab("README.md");
  for (const path of Object.values(manifest.layers ?? {})) {
    if (blank) files[path] = strToU8(placeholderSVG(path, manifest.artboard));
    else await grab(path);
  }
  // el runtime, para que preview.html funcione dentro del zip
  const rt = await fetch("/demo-assets/mascots/mascot-runtime.js");
  files["../mascot-runtime.js"] = new Uint8Array(await rt.arrayBuffer());

  if (blank) {
    const m = {
      ...manifest,
      id: "mi-mascota",
      name: "Mi mascota",
      shortName: "Mimi",
      kind: "mascota guía",
      emoji: "✨",
    };
    files["mascot.json"] = strToU8(JSON.stringify(m, null, 2) + "\n");
  }

  const zipped = zipSync(files, { level: 6 });
  const name = blank ? "plantilla-mascota.zip" : "mascota-ozito.zip";
  const url = URL.createObjectURL(new Blob([zipped as BlobPart], { type: "application/zip" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

/** Silueta de relleno con el nombre de la capa, para que se vea qué es cada una. */
function placeholderSVG(path: string, art: { width: number; height: number }) {
  const layer = path
    .split("/")
    .pop()!
    .replace(/\.svg$/i, "");
  const w = art?.width ?? 400;
  const h = art?.height ?? 600;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">
  <!-- Capa «${layer}».
       Ocupa el lienzo ENTERO (${w} × ${h}) y la pieza va dentro, en su sitio.
       No recortes el SVG al contorno de la pieza: se descolocaría. -->
  <rect x="${w * 0.3}" y="${h * 0.35}" width="${w * 0.4}" height="${h * 0.3}"
        rx="${w * 0.06}" fill="#d8d8e0" stroke="#a9a9b8" stroke-width="3" stroke-dasharray="10 8"/>
  <text x="${w / 2}" y="${h * 0.52}" text-anchor="middle"
        font-family="sans-serif" font-size="${w * 0.07}" fill="#6b6b78">${layer}</text>
</svg>
`;
}
