// Acceso a las tablas de instituciones desde el panel. Como demos.data.ts: va
// con la sesión del usuario y es RLS quien comprueba que sea administrador,
// no este archivo.

import { supabase as db } from "@/integrations/supabase/client";
import type { Tables, TablesUpdate } from "@/integrations/supabase/types";

// Las filas salen del esquema generado, no escritas a mano: así una columna
// nueva o un tipo que cambie aparece aquí solo, en vez de quedarse una copia
// vieja que compila pero miente.
export type OrgRow = Tables<"orgs">;
export type DomainRow = Tables<"org_domains">;
export type InviteRow = Tables<"org_invites">;

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

export async function saveOrg(id: string, patch: TablesUpdate<"orgs">) {
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

/**
 * Saca las direcciones de un texto pegado de cualquier sitio.
 *
 * Está pensado para lo que pasa de verdad: alguien copia una columna de Excel,
 * o pega la lista de destinatarios de un correo. Así que separa por saltos de
 * línea, comas, puntos y comas, tabuladores y espacios, y aguanta las formas en
 * las que suelen venir envueltas: «Ana Torres <ana@cip.org.pe>», «mailto:…»,
 * comillas sueltas.
 */
export function parseEmails(raw: string): { ok: string[]; bad: string[] } {
  const ok: string[] = [];
  const bad: string[] = [];
  const vistos = new Set<string>();

  for (const trozo of raw.split(/[\s,;]+/)) {
    let v = trozo.trim().toLowerCase();
    if (!v) continue;
    // «Ana Torres <ana@cip.org.pe>» deja el trozo «<ana@cip.org.pe>».
    v = v.replace(/^["'<(]+|[">')]+$/g, "").replace(/^mailto:/, "");
    if (!v) continue;

    // Tiene que ser una dirección: un dominio suelto aquí casi siempre es un
    // error de copiado, y metería a una empresa entera sin querer.
    // El patrón es el mismo del CHECK de la tabla, para que no se acepte aquí
    // algo que la base vaya a rechazar después.
    if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(v)) {
      // Sólo se avisa de lo que PARECÍA querer ser un correo: una dirección mal
      // escrita («ana@cip») o un dominio suelto («cip.org.pe»). Los nombres y
      // los números de la columna de al lado se tiran callando — al pegar
      // «Ana Torres <ana@cip.org.pe>» no se ha perdido nada, y avisar de dos
      // problemas que no existen sólo asusta.
      const pareciaCorreo = v.includes("@") || /^[a-z0-9.-]+\.[a-z]{2,}$/.test(v);
      if (pareciaCorreo && !bad.includes(v)) bad.push(v);
      continue;
    }
    if (vistos.has(v)) continue;
    vistos.add(v);
    ok.push(v);
  }
  return { ok, bad };
}

export type ImportResult = {
  /** Direcciones que han quedado asignadas a esta institución. */
  asignadas: number;
  /** De ésas, las que estaban en OTRA institución y se han movido. */
  movidas: string[];
  /** Lo que no parecía una dirección de correo. */
  invalidas: string[];
};

/**
 * Da de alta una lista de direcciones en una institución, de una vez.
 *
 * Es la forma en la que esto se usa de verdad: la institución manda su padrón
 * en una hoja de cálculo y hay que meterlo entero, no de uno en uno.
 *
 * Una dirección que ya estuviera en otra institución **se mueve**, y se informa
 * de cuáles: es lo que se quiere al corregir un padrón mal repartido, pero
 * conviene enterarse de que ha pasado en vez de que ocurra en silencio.
 */
export async function addEmails(orgId: string, raw: string): Promise<ImportResult> {
  const { ok, bad } = parseEmails(raw);
  if (!ok.length) return { asignadas: 0, movidas: [], invalidas: bad };

  // Quién estaba ya en otra institución, para poder contarlo.
  const previas = new Map<string, string>();
  for (const lote of trozos(ok, 200)) {
    const { data } = await db.from("org_domains").select("match, org_id").in("match", lote);
    for (const r of data ?? []) previas.set(r.match, r.org_id);
  }
  const movidas = ok.filter((m) => previas.has(m) && previas.get(m) !== orgId);

  // En tandas: una sola petición con miles de filas se corta por tamaño.
  for (const lote of trozos(ok, 500)) {
    const { error } = await db.from("org_domains").upsert(
      lote.map((match) => ({ match, org_id: orgId })),
      { onConflict: "match" },
    );
    if (error) throw error;
  }

  return { asignadas: ok.length, movidas, invalidas: bad };
}

function trozos<T>(xs: T[], n: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < xs.length; i += n) out.push(xs.slice(i, i + n));
  return out;
}

/** Cuántas direcciones tiene cada institución. El listado sólo enseña un puñado. */
export async function countEmails(orgId: string): Promise<number> {
  const { count, error } = await db
    .from("org_domains")
    .select("match", { count: "exact", head: true })
    .eq("org_id", orgId);
  if (error) throw error;
  return count ?? 0;
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
