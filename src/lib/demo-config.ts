// Configuración de un demo: todo lo que puede cambiar entre una institución y
// otra. La plantilla (demo-app.html) es la misma para todos; lo único distinto
// es el objeto que se le inyecta.
//
// Hoy cada demo es un archivo en src/demos/*.json. Cuando exista el panel de
// gestión, getDemoConfig() leerá también de la tabla `demos` — el resto del
// código no se entera, porque todo pasa por aquí.

/**
 * Los cinco estilos de splash. Cada uno es una puesta en escena distinta, no un
 * cambio de color: el degradado ya es configurable aparte. La lista vive aquí
 * para que el panel y la plantilla no puedan desincronizarse.
 */
export const SPLASH_STYLES = [
  {
    id: "aurora",
    name: "Aurora",
    hint: "Manchas de luz a la deriva; la marca emerge del desenfoque.",
  },
  {
    id: "constelacion",
    name: "Constelación",
    hint: "Partículas que convergen y se enlazan alrededor de la marca.",
  },
  {
    id: "prisma",
    name: "Prisma",
    hint: "Un haz barre la pantalla y se descompone en bandas de color.",
  },
  {
    id: "pulso",
    name: "Pulso",
    hint: "Anillos concéntricos que laten desde la marca hacia afuera.",
  },
  {
    id: "amanecer",
    name: "Amanecer",
    hint: "La luz sube desde abajo y enciende la marca a contraluz.",
  },
] as const;

export type SplashStyle = (typeof SPLASH_STYLES)[number]["id"];

/**
 * Las tipografías que puede elegir un demo. La lista vive aquí para que el
 * panel y la plantilla no se desincronicen. `google` vacío = no se descarga
 * nada (la pila del sistema, que es el aspecto actual).
 */
export const DEMO_FONTS = [
  { id: "", name: "Sistema (por defecto)", stack: "", google: "" },
  { id: "nunito", name: "Nunito", stack: "'Nunito'", google: "Nunito:wght@400;600;700;800" },
  { id: "baloo", name: "Baloo 2", stack: "'Baloo 2'", google: "Baloo+2:wght@400;600;700;800" },
  {
    id: "quicksand",
    name: "Quicksand",
    stack: "'Quicksand'",
    google: "Quicksand:wght@400;600;700",
  },
  { id: "poppins", name: "Poppins", stack: "'Poppins'", google: "Poppins:wght@400;600;700;800" },
  {
    id: "montserrat",
    name: "Montserrat",
    stack: "'Montserrat'",
    google: "Montserrat:wght@400;600;700;800",
  },
  { id: "inter", name: "Inter", stack: "'Inter'", google: "Inter:wght@400;600;700;800" },
  { id: "rubik", name: "Rubik", stack: "'Rubik'", google: "Rubik:wght@400;600;700;800" },
  { id: "fredoka", name: "Fredoka", stack: "'Fredoka'", google: "Fredoka:wght@400;600;700" },
  { id: "outfit", name: "Outfit", stack: "'Outfit'", google: "Outfit:wght@400;600;700;800" },
  {
    id: "worksans",
    name: "Work Sans",
    stack: "'Work Sans'",
    google: "Work+Sans:wght@400;600;700;800",
  },
  { id: "lora", name: "Lora", stack: "'Lora'", google: "Lora:wght@400;600;700" },
  {
    id: "merriweather",
    name: "Merriweather",
    stack: "'Merriweather'",
    google: "Merriweather:wght@400;700",
  },
] as const;

export type DemoFontId = (typeof DEMO_FONTS)[number]["id"];

export function demoFont(id?: string) {
  return DEMO_FONTS.find((f) => f.id === (id ?? "")) ?? DEMO_FONTS[0];
}

/** La familia CSS completa de una fuente elegida, o "" si es la del sistema. */
export function fontStack(id: string | undefined, kind: "ui" | "body") {
  const f = demoFont(id);
  if (!f.stack) return "";
  const fallback =
    kind === "ui"
      ? "ui-rounded, 'Segoe UI', system-ui, sans-serif"
      : "-apple-system, 'Segoe UI', Roboto, sans-serif";
  return `${f.stack}, ${fallback}`;
}

/** El <link> a Google Fonts para las fuentes elegidas, o "" si no hace falta. */
export function fontsHref(...ids: (string | undefined)[]) {
  const fams = [...new Set(ids.map((i) => demoFont(i).google).filter(Boolean))];
  if (!fams.length) return "";
  return `https://fonts.googleapis.com/css2?${fams
    .map((f) => `family=${f}`)
    .join("&")}&display=swap`;
}

export type DemoConfig = {
  /** Lo que va después del dominio: aprendoenglish.com/<slug> */
  slug: string;
  /** Nombre de la institución, para el panel y los textos por defecto. */
  institution: string;
  /** Un demo sin publicar responde 404. */
  published: boolean;

  meta: {
    title: string;
    description: string;
    /** Imagen para WhatsApp / redes (1200×630). */
    image?: string;
    imageAlt?: string;
  };

  brand: {
    /** Texto de la cabecera. Si se deja vacío se usa el logotipo AprendoEnglish. */
    headerText?: string;
    /** Logo de la institución (URL). */
    logo?: string;
    /** Icono de la barra superior. Por defecto, la cabeza de la mascota. */
    appbarIcon?: string;
    /**
     * La ola de la cabecera del onboarding. NO sale por defecto: vacío = sin
     * ola. "default" pone la de serie (ola.svg, que repite sin costura y se
     * pinta con `colors.ola`); una URL la sustituye por esa imagen, estirada de
     * lado a lado, porque una imagen cualquiera no empalma consigo misma.
     */
    ola?: string;
    /**
     * Cómo encaja la imagen de la ola: "repeat" (por defecto) la repite a lo
     * ancho, que es para lo que suele dibujarse; "stretch" la estira de lado a
     * lado, útil si no empalma consigo misma y se le nota la costura.
     */
    olaFit?: "repeat" | "stretch";
    /**
     * Cuántas crestas caben a lo ancho de la pantalla. Por defecto 15. El ancho
     * de cada repetición se calcula a partir de esto, no del tamaño natural de
     * la imagen, para que la ola tenga la misma densidad en un móvil estrecho
     * que en una tableta. Sólo aplica con olaFit "repeat".
     */
    olaRepeats?: number;
    /**
     * Dónde se repite el logo además de la cabecera. La cabecera ya lo tiene
     * desde siempre (`logo`); esto es la presencia de marca en el resto del
     * recorrido. Sin `logo` cargado no se pinta nada, así que activarlo en un
     * demo sin logo no rompe nada.
     */
    logoSpots?: {
      /** Onboarding y test de ubicación: las primeras pantallas de la visita. */
      onboarding?: boolean;
      /** Lección completada y veredicto del test: máxima atención. */
      celebrations?: boolean;
      /** Esquina inferior, translúcido, durante todo el demo. */
      watermark?: boolean;
    };
    /**
     * De dónde sale la imagen de la marca de agua: el logo de la cabecera (por
     * defecto), el icono de la barra superior —o la cabeza de la mascota, si no
     * hay icono propio— o una imagen distinta subida para esto.
     */
    watermarkSource?: "logo" | "icon" | "custom";
    /** La imagen propia de la marca de agua, cuando `watermarkSource` es "custom". */
    watermarkImage?: string;
    /**
     * Dónde se planta la marca de agua. Por defecto abajo a la izquierda, que es
     * donde estaba antes de poder moverla: los demos ya publicados no cambian.
     */
    watermarkPos?: "tl" | "tc" | "tr" | "cc" | "bl" | "bc" | "br";
    /** Separación del borde, en píxeles (horizontal y vertical). Ignorada al centrar. */
    watermarkX?: number;
    watermarkY?: number;
    /** Ancho máximo en píxeles. El alto sale de la proporción de la imagen. */
    watermarkSize?: number;
    /** Opacidad de 0 a 1. */
    watermarkOpacity?: number;

    /**
     * Fuente del rótulo escrito de la cabecera (id de DEMO_FONTS). Vacío =
     * hereda la fuente de interfaz, como hasta hoy.
     */
    headerFont?: string;
  };



  /**
   * Pantalla de bienvenida. Sale en cada carga, antes del demo, y se puede
   * saltar tocando. Es lo primero que ve quien abre el enlace, así que lleva la
   * marca y una frase; el estilo decide la puesta en escena.
   */
  splash: {
    /** false lo desactiva por completo. */
    enabled?: boolean;
    /** Puesta en escena. Ver SPLASH_STYLES. */
    style?: SplashStyle;
    /** La frase bajo la marca. Vacío = solo marca. */
    phrase?: string;
    /**
     * Logo propio de la bienvenida. Si falta se usa el de la cabecera
     * (`brand.logo`). Existe porque el de cabecera suele ser una versión
     * horizontal y pequeña, pensada para una barra; a pantalla completa y sobre
     * un fondo oscuro casi siempre hace falta otra: la vertical, o la clara.
     */
    logo?: string;
    /**
     * Paleta del fondo. Cualquier hueco se deriva del acento del demo, así que
     * un demo que no toque nada ya sale coherente con su marca.
     */
    colors?: {
      /** Arranque del degradado. */
      from?: string;
      /** Final del degradado. */
      to?: string;
      /** Luces, partículas y trazos. */
      accent?: string;
    };
    /** Milisegundos en pantalla antes de irse solo. Por defecto 2600. */
    duration?: number;
    /** Fuente del rótulo grande (cuando no hay logo). Vacío = la de interfaz. */
    titleFont?: string;
    /** Color del rótulo grande. Vacío = blanco, como hoy. */
    titleColor?: string;
    /** Fuente de la frase. Vacío = la que hereda hoy. */
    phraseFont?: string;
    /** Color de la frase. Vacío = blanco al 90%, como hoy. */
    phraseColor?: string;
  };


  colors: {
    /** Color principal: cabeceras de módulo, chips, acentos. */
    accent: string;
    /** Sombra del acento. Si se omite, se deriva oscureciendo `accent`. */
    accentDark?: string;
    /** Color de los botones de acción. Por defecto, `accent`. */
    button?: string;
    /** Un color por módulo (5). Pintan el mapa, el anillo y las cápsulas. */
    modules: [string, string, string, string, string];
    /** Color de la ruedita de carga. Por defecto, `accent`. */
    spinner?: string;
    /**
     * Acción principal (verde de fábrica): los botones Empecemos / Continuar /
     * Empezar, la respuesta correcta y la barra de progreso completa.
     */
    action?: string;
    actionDark?: string;
    /**
     * Resalte (azul claro de fábrica): la opción elegida en un quiz, el foco de
     * los campos y los pasos del onboarding.
     */
    highlight?: string;
    highlightDark?: string;
    /**
     * La barra superior del panel de seguimiento: la cabecera oscura del
     * reporte en /<slug>/dashboard y la cabecera de color en /<slug>/padres.
     *
     * Si se deja vacío cada una conserva el suyo —la del profesor tira a
     * oscuro, la de familia al acento—, que es como se maquetaron. En cuanto
     * se pone un color, manda en las dos: son la misma barra vista por dos
     * personas distintas, y conviene que la institución la reconozca igual.
     */
    dashboardBar?: string;
    /**
     * De qué color va la barra fija del pie del curso («Tu próxima lección»):
     * el rótulo, el título y el botón.
     *   "module" (por defecto) — el color del módulo al que pertenece la
     *      lección pendiente, así que cambia de tono según avanzas.
     *   "action" — el color de acción, el mismo del acierto en los quizzes y
     *      del resto de botones. Es como se comporta el producto real; aquí se
     *      deja opcional para no cambiarle el aspecto a los demos ya hechos.
     */
    footerColor?: "module" | "action";
    /** Color del texto principal (títulos y párrafos). Vacío = el de siempre. */
    ink?: string;
    /** Color del texto secundario (subtítulos y textos apagados). */
    muted?: string;
    /** Color del rótulo de la cabecera. Vacío = como está hoy. */
    header?: string;
  };

  /** Tipografías del demo. Vacío = las de siempre (sin descargar nada). */
  type?: {
    /** Fuente de la interfaz: títulos, botones, mapa, cabecera. */
    uiFont?: string;
    /** Fuente de lectura: párrafos y tablas dentro de las lecciones. */
    bodyFont?: string;
  };

  mascot: {
    /** Pack incorporado ('ozito', 'boti') o 'custom' si se subió uno. */
    pack: string;
    /** Sólo para packs subidos: dónde quedaron sus archivos. */
    baseUrl?: string;
    /**
     * Sólo para packs subidos: copia de su mascot.json. Se guarda aquí para que
     * el servidor pueda pintar la página sin ir a buscar el manifiesto.
     */
    manifest?: Record<string, unknown>;
    /** Sobrescriben lo que declara el manifiesto del pack. */
    /** Nombre completo del personaje: «Ozzy el Osito». Sale en la presentación. */
    fullName?: string;
    /** Cómo se le llama a diario: «Ozzy». Es el que aparece en las lecciones. */
    name?: string;
    kind?: string;
    emoji?: string;
  };

  /** Emoji o URL de imagen. */
  icons: {
    /** La llama de la racha. */
    streak: string;
    /** El contador de minutos de la meta diaria. */
    goal: string;
    /** El botón que lleva al panel de progreso. */
    dashboard: string;
  };

  copy: {
    /** Cómo se dirige el curso al alumno: «ingenier@», «ruter@», «estudiante». */
    audience: string;
    dashboardCta: string;
    dashboardCtaSub: string;
    /**
     * El grupo del que habla el reporte del aula, bajo el título: «Inglés · 5.º
     * A», «Inglés · Ciclo III», «Inglés · Equipo de ventas». Es texto libre
     * porque cambia con la institución: un colegio numera secciones, una
     * universidad habla de ciclos y una empresa, de áreas.
     */
    groupLabel?: string;
  };

  map: {
    /** Fondo de cada módulo (5 URLs). Cualquier hueco usa el de siempre. */
    backgrounds?: (string | null)[];
    /**
     * Ajuste horizontal de cada botón, por módulo y por botón, en píxeles
     * (+ derecha). Se dial arrastrando el botón sobre el previo del panel.
     * Es por botón porque el caminito de un fondo propio no se desvía igual en
     * todas sus curvas. Ausente o todo ceros = sin tocar.
     */
    buttonOffsets?: (number[] | null)[];
    /**
     * Versión anterior: un solo corrimiento para todo el módulo. Se sigue
     * leyendo para no romper lo ya guardado, pero el panel escribe
     * `buttonOffsets`.
     */
    buttonShift?: (number | null)[];
  };

  features: {
    placement: boolean;
    share: boolean;
    dashboard: boolean;
  };
};

/** Lo que ve un demo que no configura nada. Es exactamente el aspecto actual. */
export const DEFAULTS: Omit<DemoConfig, "slug" | "institution"> = {
  published: true,
  meta: {
    title: "AprendoEnglish · Demo interactivo",
    description: "Prueba el demo interactivo de AprendoEnglish y descubre nuestra metodología.",
    image: "https://aprendoenglish.com/social-preview.jpg",
    imageAlt: "AprendoEnglish.com — Inglés de clase mundial para tu institución",
  },
  // La marca acompaña todo el recorrido. La marca de agua va aparte porque es
  // la única que se ve siempre y puede estorbar: se enciende a mano.
  brand: { logoSpots: { onboarding: true, celebrations: true, watermark: false } },
  splash: { enabled: true, style: "aurora", phrase: "", colors: {}, duration: 2600 },
  colors: {
    accent: "#7C1C56",
    modules: ["#3faa24", "#ff6ba0", "#b875f5", "#1cb0f6", "#fd5d04"],
  },
  mascot: { pack: "ozito" },
  // `goal` vacío conserva el anillo de progreso; con emoji o URL, lo sustituye.
  icons: { streak: "🔥", goal: "", dashboard: "📊" },
  copy: {
    audience: "estudiante",
    dashboardCta: "Ver mi panel de progreso",
    dashboardCtaSub: "Racha, XP, niveles y logros",
    groupLabel: "Inglés · Ciclo III",
  },
  map: {},
  features: { placement: true, share: true, dashboard: true },
};

/** Slugs que ya usa la app y que por tanto no puede tomar un demo. */
export const RESERVED_SLUGS = new Set([
  "1millondealumnos",
  "api",
  "app",
  "dashboard",
  "demo-assets",
  "demo-dashboard",
  "demos",
  "login",
  "lovable",
  "presentacion",
  "presentation",
  "cip",
  "cip-presenta",
  "silabo-autonoma",
  "head.png",
  "social-preview.jpg",
]);

export function isValidSlug(slug: string) {
  return /^[a-z0-9][a-z0-9-]{1,38}$/.test(slug) && !RESERVED_SLUGS.has(slug);
}

type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] };

function merge<T>(base: T, over: DeepPartial<T> | undefined): T {
  if (!over) return base;
  const out = { ...base } as Record<string, unknown>;
  for (const [k, v] of Object.entries(over)) {
    if (v === undefined) continue;
    const prev = out[k];
    out[k] =
      v && typeof v === "object" && !Array.isArray(v) && prev && typeof prev === "object"
        ? merge(prev, v as never)
        : v;
  }
  return out as T;
}

/** Aclara u oscurece un hex. Misma fórmula que shadeHex() en la plantilla. */
export function shadeHex(hex: string, amount: number) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => {
    const v = amount < 0 ? c * (1 + amount) : c + (255 - c) * amount;
    return Math.max(0, Math.min(255, Math.round(v)));
  });
  return "#" + ch.map((c) => c.toString(16).padStart(2, "0")).join("");
}

// Los demos definidos en el repositorio. Vite los empaqueta en build.
const files = import.meta.glob<{ default: Record<string, unknown> }>("../demos/*.json", {
  eager: true,
});

const fromFiles = new Map<string, DemoConfig>();
for (const [path, mod] of Object.entries(files)) {
  const slug = path
    .split("/")
    .pop()!
    .replace(/\.json$/, "");
  const raw = (mod.default ?? mod) as DeepPartial<DemoConfig> & {
    slug?: string;
    institution?: string;
  };
  fromFiles.set(slug, {
    ...merge(DEFAULTS, raw),
    slug,
    institution: raw.institution ?? slug,
  } as DemoConfig);
}

/** Los demos semilla del repositorio. Sirven de respaldo si la tabla no responde. */
export function listSeedDemos(): DemoConfig[] {
  return [...fromFiles.values()].sort((a, b) => a.slug.localeCompare(b.slug));
}

/** Convierte una fila de la tabla `demos` en la configuración completa. */
export function rowToConfig(row: {
  slug: string;
  institution: string;
  published: boolean;
  config: unknown;
}): DemoConfig {
  return {
    ...merge(DEFAULTS, (row.config ?? {}) as DeepPartial<typeof DEFAULTS>),
    slug: row.slug,
    institution: row.institution,
    published: row.published,
  } as DemoConfig;
}

// Pequeña caché en memoria: servir un demo no debería costar una consulta por
// visita. El panel la invalida al guardar (POST /api/demos/invalidate) y además
// caduca sola.
//
// El minuto que tenía antes era demasiado para editar: como nadie llamaba a
// invalidateDemoCache(), guardar un cambio y recargar seguía enseñando lo
// anterior durante un minuto entero. Con la invalidación ya conectada esto es
// solo la red de seguridad para instancias que no atendieron esa llamada, así
// que 10 s sobran y el ahorro de consultas se mantiene: una visita normal
// encadena varias peticiones en mucho menos que eso.
const CACHE_MS = 10_000;
const cache = new Map<string, { at: number; cfg: DemoConfig | null }>();

export function invalidateDemoCache(slug?: string) {
  if (slug) cache.delete(slug);
  else cache.clear();
}

/**
 * La configuración de un demo publicado, o null si no existe.
 *
 * Lee de la tabla `demos`. Si la consulta falla —tabla aún sin crear, Supabase
 * caído— cae a los archivos de src/demos, así los enlaces que ya funcionaban
 * siguen funcionando.
 */
export async function getDemoConfig(slug: string): Promise<DemoConfig | null> {
  if (!isValidSlug(slug)) return null;

  const hit = cache.get(slug);
  if (hit && Date.now() - hit.at < CACHE_MS) return hit.cfg;

  let cfg: DemoConfig | null = null;
  try {
    const { supabase } = await import("@/integrations/supabase/client");
    const { data, error } = await supabase
      .from("demos")
      .select("slug, institution, published, config")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    if (error) throw error;
    if (data) cfg = rowToConfig(data as never);
  } catch {
    // Respaldo: los archivos del repositorio.
    const seed = fromFiles.get(slug);
    cfg = seed && seed.published ? seed : null;
  }

  cache.set(slug, { at: Date.now(), cfg });
  return cfg;
}
