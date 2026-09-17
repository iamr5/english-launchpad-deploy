import { getVocabIndex, getVocabTopics } from "@/lib/vocab-data.server";
import { type Band } from "./cefr";

export type TargetVocab = { temas: string[]; palabras: string[] };

const VACIO: TargetVocab = { temas: [], palabras: [] };

const NIVELES = ["A1", "A2", "B1", "B2", "C1", "C2"];
const nivelIdx = (lvl?: string) => Math.max(0, NIVELES.indexOf(lvl || "A1"));

/** Vocabulario del sílabo que el tutor debe empujar, por nivel y packs. */
export function targetVocabulary(band: Band, packs: string[] = [], maxPalabras = 36): TargetVocab {
  let secs;
  try {
    secs = getVocabIndex(packs, band);
  } catch {
    return VACIO;
  }

  const objetivo = nivelIdx(band);
  const candidatos = secs.flatMap((s) =>
    s.chips
      .filter((c) => c.c > 0)
      .map((c) => ({
        id: c.id,
        n: c.n,
        // Cuanto más lejos por debajo del nivel del alumno, peor.
        puntos: -Math.abs(objetivo - nivelIdx(c.lvl)) * 2 + (s.esp ? 3 : 0),
      })),
  );

  if (!candidatos.length) return VACIO;

  const elegidos = candidatos
    .sort((a, b) => b.puntos - a.puntos || a.id.localeCompare(b.id))
    .slice(0, 4);

  const temas = elegidos.map((c) => c.n);
  const porTema = getVocabTopics(elegidos.map((c) => c.id));

  const palabras: string[] = [];
  const vistas = new Set<string>();
  for (const { w } of Object.values(porTema)) {
    for (const [en, es] of w) {
      const clave = en.toLowerCase();
      if (vistas.has(clave)) continue;
      vistas.add(clave);
      palabras.push(`${en} (${es})`);
      if (palabras.length >= maxPalabras) return { temas, palabras };
    }
  }

  return { temas, palabras };
}
