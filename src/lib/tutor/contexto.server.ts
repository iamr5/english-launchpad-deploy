import { getLesson } from "@/lib/course-data.server";
import { getVocabIndex, getVocabTopics, listVocabPacks } from "@/lib/vocab-data.server";

export type ModoPractica = "conversacion" | "vocabulario" | "repaso";

/** Lo que manda el cliente: solo ids. La teoría y las palabras se buscan aquí. */
export type ContextoPedido = { modo: ModoPractica; lessonId?: string; vocabId?: string };

export type Contexto =
  | { modo: "conversacion"; tema?: string; titulo?: string }
  | { modo: "vocabulario"; tema: string; palabras: string[] }
  | { modo: "repaso"; titulo: string; tema: string; teoria: string };

// Una lección son unos 7.500 caracteres y antes se mandaban los 3.000 primeros.
// Con ese corte entraban `intro` y `cierre` —la mascota saludando y despidiéndose,
// que al tutor no le sirven— y se quedaba fuera SIEMPRE el `resumen`, que es justo
// lo que dice qué hay que practicar. De ahí que no se guiara por la lección.
// Ahora va lo útil: objetivo, orden de los puntos, resumen y ejemplos reales.
const TEORIA_MAX = 2600;
const EJEMPLOS_MAX = 14;

// Con función de reemplazo: un nombre con `$&` o `$1` se interpretaría como patrón.
function limpiaTokens(s: string, mascota: string): string {
  return s
    .replace(/\{\{\s*mascot\s*\}\}/g, () => mascota)
    .replace(/\{\{\s*mascotKind\s*\}\}/g, () => "tutor");
}

type Bloque = { type?: string; title?: string; subtitle?: string; markdown?: string };

function leccion(lessonId: string | undefined, mascota: string) {
  if (!lessonId) return null;
  const l = getLesson(lessonId) as { contentBlocks?: Bloque[] } | null;
  if (!l?.contentBlocks) return null;
  const titulo = l.contentBlocks.find((b) => b.type === "titulo") ?? {};
  return {
    l,
    titulo: limpiaTokens(titulo.title ?? "", mascota),
    tema: limpiaTokens(titulo.subtitle ?? "", mascota),
  };
}

/** Las tablas «Español | Inglés» de la teoría son los ejemplos que hay que practicar. */
function ejemplosDe(markdown: string): string[] {
  const filas: string[] = [];
  for (const linea of markdown.split("\n")) {
    const t = linea.trim();
    if (!t.startsWith("|")) continue;
    const celdas = t
      .split("|")
      .map((x) => x.trim())
      .filter(Boolean);
    if (celdas.length !== 2) continue;
    if (/^[-: ]+$/.test(celdas[0] ?? "")) continue;
    if (/^(Espa|Ingl|Spanish|English)/i.test(celdas[0] ?? "")) continue;
    if (!/[a-z]/i.test(celdas[1] ?? "")) continue;
    filas.push(`${celdas[1]}  (${celdas[0]})`);
  }
  return filas;
}

function nombreTemaVocab(id: string): string {
  const packs = listVocabPacks().map((p) => p.key);
  for (const sec of getVocabIndex(packs)) {
    const chip = sec.chips.find((c) => c.id === id);
    if (chip) return chip.n;
  }
  return "";
}

export function resolverContexto(pedido: unknown, nombreMascota?: string): Contexto {
  const mascota =
    (nombreMascota ?? "")
      .replace(/[^\p{L}\p{N} .'-]/gu, "")
      .trim()
      .slice(0, 40) || "Tomito";
  const p = (pedido ?? {}) as Partial<ContextoPedido>;
  const lessonId = typeof p.lessonId === "string" ? p.lessonId.slice(0, 80) : undefined;
  const vocabId = typeof p.vocabId === "string" ? p.vocabId.slice(0, 120) : undefined;

  if (p.modo === "repaso") {
    const x = leccion(lessonId, mascota);
    if (x) {
      const bloques = x.l.contentBlocks ?? [];
      const de = (tipo: string) =>
        bloques
          .filter((b) => b.type === tipo && b.markdown)
          .map((b) => limpiaTokens(b.markdown ?? "", mascota))
          .join("\n\n");
      const ejemplos = ejemplosDe(de("teoria")).slice(0, EJEMPLOS_MAX);
      const teoria = [
        de("mision"),
        de("sneakPeek"),
        de("resumen"),
        ejemplos.length ? `EJEMPLOS DE LA LECCIÓN:\n${ejemplos.join("\n")}` : "",
      ]
        .filter(Boolean)
        .join("\n\n")
        .slice(0, TEORIA_MAX);
      return { modo: "repaso", titulo: x.titulo, tema: x.tema, teoria };
    }
  }

  if (p.modo === "vocabulario" && vocabId) {
    const w = getVocabTopics([vocabId])[vocabId]?.w ?? [];
    if (w.length) {
      return {
        modo: "vocabulario",
        tema: nombreTemaVocab(vocabId),
        palabras: w.slice(0, 30).map(([en, es]) => `${en} (${es})`),
      };
    }
  }

  const x = leccion(lessonId, mascota);
  return { modo: "conversacion", tema: x?.tema, titulo: x?.titulo };
}
