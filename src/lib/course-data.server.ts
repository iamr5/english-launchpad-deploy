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
 */
export function getPractice(): Record<string, unknown[]> {
  return build().practice || {};
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
