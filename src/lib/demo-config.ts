// Configuración de un demo: todo lo que puede cambiar entre una institución y
// otra. La plantilla (demo-app.html) es la misma para todos; lo único distinto
// es el objeto que se le inyecta.
//
// Hoy cada demo es un archivo en src/demos/*.json. Cuando exista el panel de
// gestión, getDemoConfig() leerá también de la tabla `demos` — el resto del
// código no se entera, porque todo pasa por aquí.

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
  };

  map: {
    /** Fondo de cada módulo (5 URLs). Cualquier hueco usa el de siempre. */
    backgrounds?: (string | null)[];
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
  brand: {},
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
  },
  map: {},
  features: { placement: true, share: true, dashboard: true },
};

/** Slugs que ya usa la app y que por tanto no puede tomar un demo. */
export const RESERVED_SLUGS = new Set([
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
// visita. Se vacía sola al minuto, y el panel la invalida al guardar.
const CACHE_MS = 60_000;
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
