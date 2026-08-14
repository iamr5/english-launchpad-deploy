// El contenido del curso, cargado en el servidor.
//
// Los archivos viven en src/content/, NO en public/: si estuvieran en public
// cualquiera se los baja con una sola petición —eran 615 KB con las cinco
// lecciones completas y el banco del test con sus respuestas—. Desde aquí sólo
// salen por /api/course, que pide un pase y lleva la cuenta.
//
// Son .js escritos a mano (definen COURSE_DATA y window.PLACEMENT_ITEMS). Se
// evalúan EN TIEMPO DE BUILD por el plugin `virtual:course-content` de
// vite.config.ts: el runtime de producción (Cloudflare Workers) no permite
// `new Function`, así que hacerlo en caliente devolvía un 500.

import bundle from "virtual:course-content";


type Lesson = {
  id: string;
  title: string;
  durationMinutes?: number;
  contentBlocks?: unknown[];
  quizQuestions?: unknown[];
  [k: string]: unknown;
};
type Module = { id: string; title: string; description?: string; lessons: Lesson[] };
export type Course = { modules: Module[]; [k: string]: unknown };

const cache = bundle as {
  course: Course;
  placement: unknown[];
  practice?: Record<string, unknown[]>;
};

/** El curso ya armado (evaluado en build). */
function build() {
  if (!cache?.course?.modules?.length) {
    throw new Error("El contenido del curso no se pudo evaluar.");
  }
  return cache;
}


/** El curso entero. */
export function getCourse(): Course {
  return build().course;
}

/** El banco del test de ubicación. */
export function getPlacement(): unknown[] {
  return build().placement;
}

/**
 * El banco de práctica: ejercicios extra indexados por id de bloque de teoría.
 * No viven dentro del curso porque no son parte de la lección — la lección toma
 * una muestra y la pestaña Práctica los sirve todos.
 *
 * Los ejercicios marcados `needsContext` se quedan fuera: sólo se pueden
 * responder recordando el bloque de teoría, y en Práctica se entra sin haber
 * leído nada. Se filtran aquí, una vez, para que ni el índice ni las tandas los
 * vean.
 */
let filtrado: Record<string, unknown[]> | null = null;
export function getPractice(): Record<string, unknown[]> {
  if (filtrado) return filtrado;
  const crudo = build().practice || {};
  const out: Record<string, unknown[]> = {};
  for (const k of Object.keys(crudo)) {
    const items = (crudo[k] || []).filter(
      (q) => !(q as { needsContext?: boolean })?.needsContext,
    );
    if (items.length) out[k] = items;
  }
  filtrado = out;
  return out;
}


/**
 * Sólo cuántos ejercicios tiene cada bloque de teoría. Con esto la app pinta los
 * totales del cuaderno sin bajarse los ~2 MB del banco en el arranque: los
 * ejercicios se piden cuando el alumno abre esa tanda.
 */
export function getPracticeIndex(): Record<string, number> {
  const out: Record<string, number> = {};
  const bank = getPractice();
  for (const k of Object.keys(bank)) {
    const n = (bank[k] || []).length;
    if (n) out[k] = n;
  }
  return out;
}

/** Los ejercicios de unos pocos bloques de teoría, para servirlos bajo demanda. */
export function getPracticeFor(ids: string[]): Record<string, unknown[]> {
  const bank = getPractice();
  const out: Record<string, unknown[]> = {};
  for (const id of ids.slice(0, 20)) if (bank[id]) out[id] = bank[id];
  return out;
}



/**
 * Sólo el esqueleto: módulos y lecciones con su título y duración, sin una línea
 * del contenido. Son 2.8 KB frente a los 615 KB del curso completo — la base
 * para servir cada lección por separado más adelante.
 */
export function getCourseIndex() {
  const c = getCourse();
  return {
    modules: c.modules.map((m) => ({
      id: m.id,
      title: m.title,
      description: m.description,
      lessons: m.lessons.map((l) => ({
        id: l.id,
        title: l.title,
        durationMinutes: l.durationMinutes,
      })),
    })),
  };
}

/** Una lección por su id, o null. */
export function getLesson(id: string): Lesson | null {
  for (const m of getCourse().modules) {
    const l = m.lessons.find((x) => x.id === id);
    if (l) return l;
  }
  return null;
}
