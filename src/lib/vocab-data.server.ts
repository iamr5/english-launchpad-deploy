// La biblioteca de vocabulario, cargada en el servidor.
//
// Antes vivía entera en public/demo-assets/vocab.js y el navegador se la bajaba
// completa al abrir el demo. Con 8.000+ palabras eso son varios MB y la pestaña
// se congela, así que ahora funciona igual que el banco de práctica: al arrancar
// sólo viaja un ÍNDICE (secciones, temas y cuántas palabras tiene cada uno) y
// las palabras de un tema se piden cuando el alumno lo abre.
//
// Los .js del contenido se evalúan EN BUILD por el plugin `virtual:vocab-content`
// de vite.config.ts — el runtime de producción (Cloudflare Workers) no admite
// `new Function`.

import bank from "virtual:vocab-content";

export type VocabWord = [string, string, string?]; // [inglés, español, nivel]
export type VocabChip = {
  id: string;
  n: string;
  e: string;
  lvl?: string;
  w: VocabWord[];
  /** «¿para qué se usa?»: palabra inglesa → [uso correcto, 3 usos falsos]. */
  u?: Record<string, string[]>;
  /** Definición corta en español: palabra inglesa → una frase. */
  d?: Record<string, string>;
};
export type VocabSection = { s: string; chips: VocabChip[] };
export type VocabPack = { n: string; e: string; secs: VocabSection[] };

const data = bank as unknown as { general: VocabSection[]; packs: Record<string, VocabPack> };

const NIVELES = ["A1", "A2", "B1", "B2", "C1", "C2"];

/** Los packs especializados que existen, con su nombre y su tamaño. */
export function listVocabPacks() {
  return Object.entries(data.packs || {}).map(([key, p]) => ({
    key,
    n: p.n,
    e: p.e,
    temas: p.secs.reduce((a, s) => a + s.chips.length, 0),
    palabras: p.secs.reduce((a, s) => a + s.chips.reduce((b, c) => b + c.w.length, 0), 0),
  }));
}

function chipCabe(chip: VocabChip, tope: number) {
  if (tope < 0) return true;
  const i = NIVELES.indexOf(chip.lvl || "A1");
  return i < 0 || i <= tope;
}

/**
 * El índice: todo lo que hace falta para pintar la pantalla y sus barras de
 * progreso, sin una sola palabra dentro. Son unos pocos KB.
 */
export function getVocabIndex(packs: string[] = [], nivelMax = "") {
  const tope = NIVELES.indexOf(nivelMax);
  const secs: {
    s: string;
    esp?: string;
    chips: { id: string; n: string; e: string; lvl?: string; c: number }[];
  }[] = [];

  const push = (list: VocabSection[], esp?: string) => {
    for (const sec of list) {
      const chips = sec.chips
        .filter((c) => chipCabe(c, tope) && c.w.length)
        .map((c) => ({ id: c.id, n: c.n, e: c.e, lvl: c.lvl, c: c.w.length }));
      if (chips.length) secs.push(esp ? { s: sec.s, esp, chips } : { s: sec.s, chips });
    }
  };

  push(data.general || []);
  for (const key of packs) {
    const p = (data.packs || {})[key];
    if (p) push(p.secs, p.n);
  }
  return secs;
}

const porId = (() => {
  let mapa: Map<string, VocabChip> | null = null;
  return () => {
    if (mapa) return mapa;
    mapa = new Map();
    const eat = (list: VocabSection[]) =>
      list.forEach((s) => s.chips.forEach((c) => mapa!.set(c.id, c)));
    eat(data.general || []);
    Object.values(data.packs || {}).forEach((p) => eat(p.secs));
    return mapa;
  };
})();

/** Las palabras (y sus ítems de «¿para qué se usa?») de unos pocos temas. */
export function getVocabTopics(ids: string[]) {
  const out: Record<
    string,
    { w: VocabWord[]; u: Record<string, string[]>; d: Record<string, string> }
  > = {};
  const mapa = porId();
  for (const id of ids.slice(0, 10)) {
    const c = mapa.get(id);
    if (c) out[id] = { w: c.w, u: c.u || {}, d: c.d || {} };
  }
  return out;
}
