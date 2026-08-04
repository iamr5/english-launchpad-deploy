// El contenido del curso, cargado en el servidor.
//
// Los archivos viven en src/content/, NO en public/: si estuvieran en public
// cualquiera se los baja con una sola petición —eran 615 KB con las cinco
// lecciones completas y el banco del test con sus respuestas—. Desde aquí sólo
// salen por /api/course, que pide un pase y lleva la cuenta.
//
// Son .js escritos a mano (definen COURSE_DATA y window.PLACEMENT_ITEMS), así que
// se evalúan una vez al arrancar el servidor y se guardan ya como objeto. No se
// vuelve a evaluar por petición.

import data1 from "../content/data.js?raw";
import data3 from "../content/data_modulo3.js?raw";
import data4 from "../content/data_modulo4.js?raw";
import data5 from "../content/data_modulo5.js?raw";
import placement from "../content/placement_items.js?raw";

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

let cache: { course: Course; placement: unknown[] } | null = null;

/**
 * Evalúa los archivos de contenido y devuelve el curso ya armado.
 *
 * Se hace con `new Function` y no con import porque son scripts pensados para
 * el navegador: declaran constantes sueltas y cuelgan cosas de `window`. Se les
 * da un `window` de mentira para que no revienten.
 */
function build() {
  if (cache) return cache;
  const src = [data1, data3, data4, data5, placement].join("\n;\n");
  const fake: Record<string, unknown> = {};
  const run = new Function(
    "window",
    `${src}\n;return { course: typeof COURSE_DATA !== "undefined" ? COURSE_DATA : window.COURSE_DATA, placement: window.PLACEMENT_ITEMS || [] };`,
  );
  const out = run(fake) as { course: Course; placement: unknown[] };
  if (!out?.course?.modules?.length) throw new Error("El contenido del curso no se pudo evaluar.");
  cache = out;
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
