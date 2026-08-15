// Acceso a las tablas de instituciones desde el panel. Como demos.data.ts: va
// con la sesión del usuario y es RLS quien comprueba que sea administrador,
// no este archivo.
//
// El cliente va sin tipar contra Database a propósito: src/integrations/
// supabase/types.ts lo genera la plataforma y todavía no conoce estas tablas.
// Tiparlo a mano aquí sería una copia que se queda vieja en el primer
// regenerado.

import { supabase } from "@/integrations/supabase/client";

/** El mismo cliente, sin los tipos generados. Ver la nota de arriba. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

export type OrgRow = {
  id: string;
  slug: string;
  name: string;
  brand_slug: string | null;
  config: Record<string, unknown>;
  active: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type DomainRow = { match: string; org_id: string; created_at: string };

export type InviteRow = {
  code: string;
  org_id: string;
  max_uses: number;
  uses: number;
  expires_at: string | null;
  created_at: string;
};

export async function fetchOrgs(): Promise<OrgRow[]> {
  const { data, error } = await db.from("orgs").select("*").order("name");
  if (error) throw error;
  return (data ?? []) as OrgRow[];
}

export async function fetchDomains(): Promise<DomainRow[]> {
  const { data, error } = await db.from("org_domains").select("*").order("match");
  if (error) throw error;
  return (data ?? []) as DomainRow[];
}

export async function fetchInvites(): Promise<InviteRow[]> {
  const { data, error } = await db.from("org_invites").select("*").order("created_at", {
    ascending: false,
  });
  if (error) throw error;
  return (data ?? []) as InviteRow[];
}

/** Cuántas cuentas hay en cada institución. Es el dato que dice si esto funciona. */
export async function fetchMemberCounts(): Promise<Record<string, number>> {
  const { data, error } = await db.from("org_members").select("org_id");
  if (error) throw error;
  const out: Record<string, number> = {};
  for (const r of (data ?? []) as { org_id: string }[]) {
    out[r.org_id] = (out[r.org_id] ?? 0) + 1;
  }
  return out;
}

export async function createOrg(row: { slug: string; name: string; brand_slug?: string | null }) {
  const { data, error } = await db
    .from("orgs")
    .insert({
      slug: row.slug,
      name: row.name,
      brand_slug: row.brand_slug || null,
      config: {},
      active: true,
    })
    .select()
    .single();
  if (error) throw error;
  return data as OrgRow;
}

export async function saveOrg(id: string, patch: Partial<OrgRow>) {
  const { data, error } = await db.from("orgs").update(patch).eq("id", id).select().single();
  if (error) throw error;
  return data as OrgRow;
}

export async function deleteOrg(id: string) {
  const { error } = await db.from("orgs").delete().eq("id", id);
  if (error) throw error;
}

export async function addDomain(orgId: string, match: string) {
  const clean = match.trim().toLowerCase().replace(/^@/, "");
  const { error } = await db.from("org_domains").insert({ match: clean, org_id: orgId });
  if (error) throw error;
  return clean;
}

export async function removeDomain(match: string) {
  const { error } = await db.from("org_domains").delete().eq("match", match);
  if (error) throw error;
}

export async function addInvite(orgId: string, code: string, maxUses: number) {
  const { error } = await db.from("org_invites").insert({
    code: code.trim().toUpperCase(),
    org_id: orgId,
    max_uses: Math.max(0, Math.floor(maxUses) || 0),
  });
  if (error) throw error;
}

export async function removeInvite(code: string) {
  const { error } = await db.from("org_invites").delete().eq("code", code);
  if (error) throw error;
}

/**
 * Reasigna por dominio las cuentas que ya existían. Hace falta porque dar de
 * alta un dominio hoy no toca a quien se registró ayer: sin esto, el mapeo sólo
 * valdría para el futuro y las cuentas antiguas se quedarían sin marca.
 *
 * No pisa a quien entró por código o a mano: eso fue una decisión.
 */
export async function resyncMembers(): Promise<number> {
  const { data, error } = await db.rpc("resync_org_members");
  if (error) throw error;
  return (data as number) ?? 0;
}

/** Motivo por el que un identificador de institución no vale, o null. */
export function orgSlugProblem(slug: string): string | null {
  if (!slug) return "Escribe un identificador.";
  if (!/^[a-z0-9][a-z0-9-]{1,38}$/.test(slug)) {
    return "Usa sólo minúsculas, números y guiones, entre 2 y 39 caracteres.";
  }
  return null;
}

/** Qué tiene de malo un dominio o correo, o null. */
export function matchProblem(raw: string): string | null {
  const v = raw.trim().toLowerCase().replace(/^@/, "");
  if (!v) return "Escribe un dominio (colegio.edu.pe) o un correo entero.";
  if (!/^[a-z0-9._%+-]*@?[a-z0-9.-]+\.[a-z]{2,}$/.test(v)) {
    return "No parece un dominio ni un correo.";
  }
  return null;
}

/** Sugiere un identificador a partir del nombre de la institución. */
export function suggestOrgSlug(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 30);
}

/** Un código de alta legible: sin las letras que se confunden con números. */
export function suggestInviteCode(orgSlug: string): string {
  const alfabeto = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  const azar = [...bytes].map((b) => alfabeto[b % alfabeto.length]).join("");
  const base = orgSlug
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 8)
    .toUpperCase();
  return base ? `${base}-${azar}` : azar;
}
