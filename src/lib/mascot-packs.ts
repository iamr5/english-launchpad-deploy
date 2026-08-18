// Las mascotas que vienen incorporadas, en un solo sitio.
//
// Antes la lista estaba escrita dos veces: una en el servidor, para saber
// resolver el pack, y otra en el panel, para ofrecerlo. Añadir una mascota y
// olvidar la segunda lista dejaba un pack que existía pero no se podía elegir.
// Ahora ambos leen de aquí, así que no pueden desincronizarse.
//
// Para sumar una mascota: se deja su carpeta en public/demo-assets/mascots/ y se
// añade su import más una línea en BUILT_IN_PACKS. Nada más.

import ozitoPack from "../../public/demo-assets/mascots/ozito/mascot.json";
import botiPack from "../../public/demo-assets/mascots/boti/mascot.json";
import gallitoPack from "../../public/demo-assets/mascots/gallito/mascot.json";
import martinPack from "../../public/demo-assets/mascots/martin/mascot.json";
import ariannaPack from "../../public/demo-assets/mascots/arianna/mascot.json";
import tomitoPack from "../../public/demo-assets/mascots/tomito/mascot.json";

export type MascotPack = {
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

export const BUILT_IN_PACKS: Record<string, MascotPack> = {
  ozito: ozitoPack as MascotPack,
  boti: botiPack as MascotPack,
  gallito: gallitoPack as MascotPack,
  martin: martinPack as MascotPack,
  arianna: ariannaPack as MascotPack,
  tomito: tomitoPack as MascotPack,
};

/** Carpeta de los packs, relativa a la base de assets de un demo. */
export const MASCOTS_DIR = "mascots/";

/** Ruta absoluta a un archivo de un pack incorporado, para usarla en el panel. */
export function packAsset(id: string, file: string) {
  return `/demo-assets/${MASCOTS_DIR}${id}/${file}`;
}

/** Una línea por mascota para el aviso del panel. */
const NOTES: Record<string, string> = {
  ozito: "Por defecto. Capas SVG animadas por CSS.",
  boti: "El robot. Lo usa /democip.",
  gallito: "Un tumi. Cabecea, parpadea y se estira; movimiento vertical.",
  martin: "Escolar con el uniforme del colegio. Respira, balancea los brazos y parpadea.",
  arianna: "Escolar con el uniforme del colegio. Misma animación que Martín.",
  tomito:
    "Escolar con mochila. Ropa recoloreable (polo, pantalón, zapatillas, mochila), logo en el pecho y boca que se abre al hablar.",
};

export type PackChoice = {
  id: string;
  /** Cómo se llama entero: «Ozzy el Osito». */
  fullName: string;
  /** Cómo se le llama a diario: «Ozzy». */
  name: string;
  kind: string;
  emoji: string;
  /** Icono de sólo la cabeza, ya en ruta absoluta. */
  head: string;
  /** Etiqueta para el botón del panel. */
  label: string;
  note: string;
};

/** Todo lo que el panel necesita para ofrecer las mascotas. */
export function packChoices(): PackChoice[] {
  return Object.values(BUILT_IN_PACKS).map((p) => ({
    id: p.id,
    fullName: p.name,
    name: p.shortName ?? p.name,
    kind: p.kind ?? "mascota guía",
    emoji: p.emoji ?? "✨",
    head: packAsset(p.id, p.headIcon),
    label: `${p.name} ${p.emoji ?? ""}`.trim(),
    note: NOTES[p.id] ?? p.kind ?? "",
  }));
}

/** Los datos de un pack por su id, con Ozzy de respaldo. */
export function packInfo(id: string): PackChoice {
  const all = packChoices();
  return all.find((p) => p.id === id) ?? all[0];
}

// ── Vestuario ────────────────────────────────────────────────────────────────
// Algunas mascotas traen la ropa recoloreable: su SVG va en línea y los
// rellenos salen de variables CSS (`--m-<prenda>`), con los valores del dibujo
// original como respaldo en su mascot.css. Aquí se traduce lo que el panel
// guardó en la configuración del demo a esas variables, para que la misma regla
// valga en la app, en el panel de progreso y en las presentaciones de marca.

/** Prendas que declara un pack, en el orden en que se enseñan en el panel. */
export function wardrobeOf(pack: MascotPack | null | undefined): string[] {
  const w = pack?.wardrobe;
  return Array.isArray(w) ? (w as string[]) : [];
}

/** Si el pack tiene ranura para el estampado del pecho. */
export function hasChestLogo(pack: MascotPack | null | undefined): boolean {
  return !!pack?.chestLogo;
}

/** Cómo se llama cada prenda en el panel. */
export const WARDROBE_LABELS: Record<string, string> = {
  polo: "Polo",
  pants: "Pantalón",
  shoes: "Zapatillas",
  bag: "Mochila",
  skirt: "Falda",
  hair: "Cabello",
};

export type WardrobeCfg = {
  wardrobe?: Record<string, string> | null;
  chestLogo?: { url?: string; size?: number } | null;
};

/**
 * El bloque `<style>` con la ropa del personaje. Cadena vacía si el pack no
 * tiene vestuario o si el demo no ha cambiado nada: en ese caso manda el
 * mascot.css del pack, que ya trae los colores originales.
 */
export function wardrobeCSS(pack: MascotPack | null | undefined, cfg: WardrobeCfg): string {
  if (!pack) return "";
  const root = (pack.rootClass as string) || "mascot";
  const prendas = wardrobeOf(pack);
  const vars: string[] = [];

  for (const prenda of prendas) {
    const color = cfg.wardrobe?.[prenda];
    if (color && /^#[0-9a-fA-F]{3,8}$/.test(color)) vars.push(`--m-${prenda}:${color}`);
  }

  if (hasChestLogo(pack)) {
    const url = cfg.chestLogo?.url;
    // Sólo rutas, nunca un url() escrito por quien edita: se cita y se escapa.
    if (url) vars.push(`--m-chest-logo:url("${url.replace(/["\\]/g, "")}")`);
    const size = cfg.chestLogo?.size;
    if (typeof size === "number" && size > 0) {
      vars.push(`--m-chest-scale:${Math.min(3, Math.max(0.2, size)).toFixed(2)}`);
    }
  }

  if (!vars.length) return "";
  return `<style id="mascota-ropa">.${root}{${vars.join(";")}}</style>`;
}
