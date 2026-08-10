// La biblioteca de mascotas guardadas.
//
// Una mascota hecha en el constructor (o un pack subido a mano) se guardaba
// sólo dentro de la configuración de UN demo, así que había que rehacerla para
// el siguiente. Aquí queda apuntada: nombre, dónde están sus archivos y su
// manifiesto, para poder ofrecerla junto a las mascotas incorporadas.
//
// Sólo los administradores la leen y la escriben; el panel de demos ya vive
// detrás de esa puerta.

import { supabase } from "@/integrations/supabase/client";
import type { MascotManifest } from "./mascot-pack";

/** Carpeta común del almacenamiento: los packs de la biblioteca no cuelgan de un demo. */
export const LIBRARY_FOLDER = "biblioteca";

export type SavedMascot = {
  id: string;
  name: string;
  shortName: string | null;
  kind: string | null;
  emoji: string | null;
  baseUrl: string;
  manifest: MascotManifest;
  /** Dirección de una imagen pequeña para la parrilla (el icono de cabeza del pack). */
  thumb: string | null;
  createdAt: string;
};

// La tabla es nueva y los tipos generados no la conocen todavía; el cliente se
// usa sin tipar sólo para ella.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const table = () => (supabase as any).from("mascot_library");

type Row = {
  id: string;
  name: string;
  short_name: string | null;
  kind: string | null;
  emoji: string | null;
  base_url: string;
  manifest: MascotManifest;
  thumb: string | null;
  created_at: string;
};

function fromRow(r: Row): SavedMascot {
  return {
    id: r.id,
    name: r.name,
    shortName: r.short_name,
    kind: r.kind,
    emoji: r.emoji,
    baseUrl: r.base_url,
    manifest: r.manifest,
    thumb: r.thumb,
    createdAt: r.created_at,
  };
}

/** Todas las mascotas guardadas, de la más reciente a la más antigua. */
export async function listSavedMascots(): Promise<SavedMascot[]> {
  const { data, error } = await table()
    .select("id,name,short_name,kind,emoji,base_url,manifest,thumb,created_at")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return ((data ?? []) as Row[]).map(fromRow);
}

/**
 * Guarda una mascota en la biblioteca. Si ya hay una con el mismo nombre se
 * actualiza en vez de duplicarla: guardar dos veces la misma mascota tras un
 * retoque es lo normal, y llenar la parrilla de copias no ayuda a nadie.
 */
export async function saveMascot(input: {
  name: string;
  manifest: MascotManifest;
  baseUrl: string;
}): Promise<SavedMascot> {
  const { manifest, baseUrl } = input;
  const name = input.name.trim() || manifest.name;
  const thumb = manifest.headIcon ? baseUrl.replace(/\/?$/, "/") + manifest.headIcon : null;
  const row = {
    name,
    short_name: manifest.shortName ?? null,
    kind: manifest.kind ?? null,
    emoji: manifest.emoji ?? null,
    base_url: baseUrl,
    manifest: { ...manifest, name },
    thumb,
    created_by: (await supabase.auth.getUser()).data.user?.id ?? null,
  };

  const { data: existing } = await table().select("id").eq("name", name).maybeSingle();
  const q = existing?.id
    ? table().update(row).eq("id", existing.id)
    : table().insert(row);
  const { data, error } = await q
    .select("id,name,short_name,kind,emoji,base_url,manifest,thumb,created_at")
    .single();
  if (error) throw new Error(error.message);
  return fromRow(data as Row);
}

/** Cambiarle el nombre a una mascota guardada. El manifiesto lleva el mismo. */
export async function renameMascot(id: string, name: string): Promise<void> {
  const { data: row, error: e1 } = await table().select("manifest").eq("id", id).single();
  if (e1) throw new Error(e1.message);
  const manifest = { ...((row?.manifest ?? {}) as MascotManifest), name };
  const { error } = await table().update({ name, manifest }).eq("id", id);
  if (error) throw new Error(error.message);
}

/**
 * Quitarla de la biblioteca. Los archivos siguen en el almacenamiento y cada
 * demo lleva copia de su manifiesto, así que los demos que ya la usan no se
 * rompen.
 */
export async function deleteMascot(id: string): Promise<void> {
  const { error } = await table().delete().eq("id", id);
  if (error) throw new Error(error.message);
}
