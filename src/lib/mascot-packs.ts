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
  gallito: "Cabecea, parpadea y se estira; movimiento vertical.",
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
