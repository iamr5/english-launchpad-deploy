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
    /** Carpeta del pack: 'ozito', 'boti', o una URL a un pack subido. */
    pack: string;
    /** Sobrescriben lo que declara el manifiesto del pack. */
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
    description:
      "Prueba el demo interactivo de AprendoEnglish y descubre nuestra metodología.",
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
  const slug = path.split("/").pop()!.replace(/\.json$/, "");
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

export function listDemos(): DemoConfig[] {
  return [...fromFiles.values()].sort((a, b) => a.slug.localeCompare(b.slug));
}

export function getDemoConfig(slug: string): DemoConfig | null {
  if (!isValidSlug(slug)) return null;
  const cfg = fromFiles.get(slug);
  if (!cfg || !cfg.published) return null;
  return cfg;
}
