// Acceso a la tabla `demos` desde el panel. Va con la sesión del usuario: es RLS
// quien comprueba que sea administrador, no este archivo.

import { supabase } from "@/integrations/supabase/client";
import { DEFAULTS, isValidSlug, RESERVED_SLUGS } from "./demo-config";

export type DemoRow = {
  slug: string;
  institution: string;
  published: boolean;
  config: Record<string, unknown>;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

const TABLE = "demos";

export type SessionInfo = {
  /** Cuenta con la que se está entrando, tal como la conoce Supabase. */
  email: string | null;
  userId: string | null;
  /** Todos los roles del usuario, no sólo admin. */
  roles: string[];
  isAdmin: boolean;
  /**
   * true si se entró por el atajo de depuración de _authenticated/route.tsx
   * (localStorage.fake_login). En ese caso NO hay sesión de Supabase, así que
   * toda escritura la rechaza RLS por más roles que tenga la cuenta real.
   */
  fakeLogin: boolean;
  error: string | null;
};

/** Quién está entrando y con qué permisos. Lo muestra el pie del panel. */
export async function sessionInfo(): Promise<SessionInfo> {
  const fakeLogin = typeof window !== "undefined" && localStorage.getItem("fake_login") === "1";

  const { data: auth } = await supabase.auth.getUser();
  const user = auth?.user ?? null;
  if (!user) {
    return { email: null, userId: null, roles: [], isAdmin: false, fakeLogin, error: null };
  }

  const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
  const roles = (data ?? []).map((r) => (r as { role: string }).role);
  return {
    email: user.email ?? null,
    userId: user.id,
    roles,
    isAdmin: roles.includes("admin"),
    fakeLogin,
    error: error?.message ?? null,
  };
}

/**
 * Si la sesión actual es administradora. El panel lo comprueba al entrar para
 * poder decirlo claro, en vez de dejar que cada acción falle contra RLS.
 */
export async function isAdmin(): Promise<{ ok: boolean; email: string | null; reason?: string }> {
  const { data: auth } = await supabase.auth.getUser();
  const user = auth?.user ?? null;
  if (!user) return { ok: false, email: null, reason: "Sin sesión iniciada." };

  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .maybeSingle();

  if (error) return { ok: false, email: user.email ?? null, reason: error.message };
  return { ok: !!data, email: user.email ?? null };
}

export async function fetchDemos(): Promise<DemoRow[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as DemoRow[];
}

export async function fetchDemo(slug: string): Promise<DemoRow | null> {
  const { data, error } = await supabase.from(TABLE).select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return (data as DemoRow) ?? null;
}

export async function createDemo(row: {
  slug: string;
  institution: string;
  config?: Record<string, unknown>;
}) {
  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      slug: row.slug,
      institution: row.institution,
      config: (row.config ?? {}) as never,
      published: false,
    })
    .select()
    .single();
  if (error) throw error;
  return data as DemoRow;
}

/**
 * Avisa al servidor de que tire su copia en memoria de este demo.
 *
 * Hace falta porque estas funciones corren en el NAVEGADOR —van con la sesión
 * del usuario, es RLS quien autoriza— y la caché de getDemoConfig() vive en el
 * servidor. Sin esto, guardar no se notaba hasta que caducaba sola.
 *
 * Si falla no se interrumpe nada: el guardado ya se hizo y la caché caduca
 * igualmente; solo se tardaría unos segundos más en verlo.
 */
async function tirarCache(slug: string) {
  try {
    await fetch("/api/demos/invalidate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });
  } catch {
    /* el guardado ya está hecho; la caché caduca sola */
  }
}

export async function saveDemo(
  slug: string,
  patch: Partial<Pick<DemoRow, "institution" | "config" | "published" | "notes">>,
) {
  const { data, error } = await supabase
    .from(TABLE)
    .update(patch as never)
    .eq("slug", slug)
    .select()
    .single();
  if (error) throw error;
  await tirarCache(slug);
  return data as DemoRow;
}

export async function deleteDemo(slug: string) {
  const { error } = await supabase.from(TABLE).delete().eq("slug", slug);
  if (error) throw error;
  await tirarCache(slug);
}

/**
 * Sube un archivo de marca y devuelve la URL con la que servirlo.
 *
 * No se usa getPublicUrl(): el bucket es privado (la plataforma no admite
 * buckets públicos) y ese endpoint devuelve "Bucket not found". Se sirve por
 * /api/brand/<ruta>, que reemite el archivo y no caduca como una URL firmada.
 */
export async function uploadBrandFile(slug: string, kind: string, file: File): Promise<string> {
  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const path = `${slug}/${kind}/${Date.now()}-${safe}`;
  const { error } = await supabase.storage
    .from("demo-brand")
    .upload(path, file, { cacheControl: "31536000", upsert: false });
  if (error) throw error;
  return `/api/brand/${path}`;
}

// ── SVG: leer sus colores y volver a pintarlo ──────────────────────────────
//
// Un logo o un icono en .svg es texto: se pueden cambiar sus colores aquí mismo
// en vez de tener que reexportarlo fuera. Se trabaja sobre el marcado original
// y se sube una copia nueva, así el archivo de partida sigue intacto.

const CSS_NAMES: Record<string, string> = {
  black: "#000000",
  white: "#FFFFFF",
  red: "#FF0000",
  lime: "#00FF00",
  green: "#008000",
  blue: "#0000FF",
  yellow: "#FFFF00",
  cyan: "#00FFFF",
  aqua: "#00FFFF",
  magenta: "#FF00FF",
  fuchsia: "#FF00FF",
  silver: "#C0C0C0",
  gray: "#808080",
  grey: "#808080",
  maroon: "#800000",
  olive: "#808000",
  purple: "#800080",
  teal: "#008080",
  navy: "#000080",
  orange: "#FFA500",
};

/** Pasa cualquier forma de color CSS habitual en un SVG a #RRGGBB, o null. */
export function toHex(raw: string): string | null {
  const v = raw.trim().toLowerCase();
  if (!v || v === "none" || v === "transparent" || v === "currentcolor" || v.startsWith("url("))
    return null;
  if (CSS_NAMES[v]) return CSS_NAMES[v];
  let m = /^#([0-9a-f]{3})$/.exec(v);
  if (m) return ("#" + [...m[1]].map((c) => c + c).join("")).toUpperCase();
  m = /^#([0-9a-f]{6})$/.exec(v);
  if (m) return ("#" + m[1]).toUpperCase();
  m = /^#([0-9a-f]{8})$/.exec(v);
  if (m) return ("#" + m[1].slice(0, 6)).toUpperCase();
  m = /^rgba?\(\s*([0-9.]+)[\s,]+([0-9.]+)[\s,]+([0-9.]+)/.exec(v);
  if (m) {
    const p = m
      .slice(1, 4)
      .map((n) => Math.max(0, Math.min(255, Math.round(parseFloat(n)))))
      .map((n) => n.toString(16).padStart(2, "0"))
      .join("");
    return ("#" + p).toUpperCase();
  }
  return null;
}

// Todo lo que en un SVG puede llevar un color: atributos de presentación,
// `style="..."` en línea y las reglas de un bloque <style>.
const COLOR_RE =
  /(fill|stroke|stop-color|flood-color|lighting-color|color)\s*[:=]\s*("|'|)\s*(#[0-9a-fA-F]{3,8}|rgba?\([^)]*\)|[a-zA-Z]+)\s*\2/g;

/** Descarga el texto de un SVG (mismo origen: /api/brand/…). */
export async function fetchSvgText(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error("No se pudo leer el SVG.");
  return await res.text();
}

/** Los colores distintos que usa el dibujo, en orden de aparición. */
export function svgColors(text: string): string[] {
  const out: string[] = [];
  for (const m of text.matchAll(COLOR_RE)) {
    const hex = toHex(m[3]);
    if (hex && !out.includes(hex)) out.push(hex);
  }
  return out;
}

/**
 * Devuelve el SVG con los colores cambiados. Con un mapa, sustituye cada color
 * por el suyo; con un solo color, lo tiñe entero (y le pone `fill` a las formas
 * que no declaraban ninguno, que si no saldrían negras).
 */
export function recolorSvg(text: string, spec: Record<string, string> | string): string {
  const unico = typeof spec === "string" ? toHex(spec) : null;
  let out = text.replace(COLOR_RE, (full, prop: string, q: string, val: string) => {
    const hex = toHex(val);
    if (!hex) return full;
    const nuevo = unico ?? (spec as Record<string, string>)[hex];
    if (!nuevo) return full;
    const sep = full.includes(":") && !full.includes("=") ? ": " : "=";
    return sep === ": " ? `${prop}: ${nuevo}` : `${prop}=${q || '"'}${nuevo}${q || '"'}`;
  });
  if (unico) {
    // Formas sin fill declarado: el negro por defecto del navegador.
    out = out.replace(
      /<(path|circle|rect|ellipse|polygon|polyline|g)\b([^>]*)>/g,
      (full, tag: string, attrs: string) =>
        /fill\s*[:=]/.test(attrs) ? full : `<${tag}${attrs} fill="${unico}">`,
    );
  }
  return out;
}

/** Motivo por el que un slug no vale, o null si está bien. */
export function slugProblem(slug: string): string | null {
  if (!slug) return "Escribe un nombre para el enlace.";
  if (RESERVED_SLUGS.has(slug)) return `«${slug}» ya lo usa una página del sitio. Elige otro.`;
  if (!isValidSlug(slug)) return "Usa sólo minúsculas, números y guiones, entre 2 y 39 caracteres.";
  return null;
}

/** Sugiere un slug a partir del nombre de la institución. */
export function suggestSlug(institution: string): string {
  const base = institution
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 30);
  return base ? `demo${base}` : "";
}

export { DEFAULTS };
