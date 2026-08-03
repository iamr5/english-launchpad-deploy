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
  return data as DemoRow;
}

export async function deleteDemo(slug: string) {
  const { error } = await supabase.from(TABLE).delete().eq("slug", slug);
  if (error) throw error;
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

/** Motivo por el que un slug no vale, o null si está bien. */
export function slugProblem(slug: string): string | null {
  if (!slug) return "Hace falta un nombre para el enlace.";
  if (RESERVED_SLUGS.has(slug)) return `«${slug}» ya lo usa la aplicación. Elige otro.`;
  if (!isValidSlug(slug)) return "Sólo minúsculas, números y guiones; entre 2 y 39 caracteres.";
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
