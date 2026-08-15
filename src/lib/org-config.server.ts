// Con qué marca ve la app la persona que acaba de entrar.
//
// El equivalente de getDemoConfig() para el producto: allí la institución la
// dice el slug de la URL, aquí la dice la cuenta. Todo lo demás —la forma de la
// configuración, la plantilla, el inyector— es exactamente el mismo, y a
// propósito: lo que se pinta en /demos para vender es literalmente lo que ve
// después el alumno al entrar.
//
// La marca sale de apilar tres capas, de lo general a lo concreto:
//
//   1. DEFAULTS            el aspecto de fábrica de AprendoEnglish
//   2. demos[brand_slug]   la marca del demo con el que se vendió la cuenta
//   3. orgs.config         lo que esa institución cambia por encima
//
// Se lee con el rol de servicio, no con la sesión: quien llama es una ruta de
// servidor que YA ha comprobado la identidad (ver src/lib/app-token.ts), y
// resolver la institución de un usuario cualquiera es justo lo que RLS impide
// hacer desde el navegador.

import { supabaseAdmin as db } from "@/integrations/supabase/client.server";
import { DEFAULTS, layeredConfig, type DemoConfig } from "./demo-config";

/** La institución a la que pertenece una cuenta, sin resolver la marca. */
export type OrgRow = {
  id: string;
  slug: string;
  name: string;
  brand_slug: string | null;
  config: Record<string, unknown>;
  active: boolean;
};

/**
 * Lo que ve una cuenta sin institución: el aspecto de fábrica. Se le da el slug
 * "app" porque el resto del sistema (el pase del curso, las URLs de compartir)
 * necesita uno; no corresponde a ningún demo ni lo puede tomar ninguno — está
 * en RESERVED_SLUGS.
 */
export function genericAppConfig(): DemoConfig {
  return { ...DEFAULTS, slug: "app", institution: "AprendoEnglish" } as DemoConfig;
}

// Misma idea que la caché de getDemoConfig(): servir la app no debería costar
// dos consultas por visita. Corta a propósito — se edita desde el panel y hay
// que poder ver el cambio recargando, no dentro de un minuto.
const CACHE_MS = 10_000;
const cache = new Map<string, { at: number; cfg: DemoConfig }>();

export function invalidateOrgCache(userId?: string) {
  if (userId) cache.delete(userId);
  else cache.clear();
}

/** La institución de una cuenta, o null si no tiene ninguna asignada. */
export async function getOrgForUser(userId: string, email?: string | null): Promise<OrgRow | null> {
  const { data: member } = await db
    .from("org_members")
    .select("org_id")
    .eq("user_id", userId)
    .maybeSingle();

  let orgId = (member as { org_id?: string } | null)?.org_id ?? null;

  // Sin pertenencia escrita, se intenta por el correo. Cubre a las cuentas que
  // ya existían antes de que hubiera instituciones y a las que se registraron
  // mientras su dominio aún no estaba dado de alta: entran y ya ven su marca,
  // sin esperar a que un administrador pase el resincronizado.
  if (!orgId && email) {
    const { data } = await db.rpc("org_for_email", { _email: email });
    orgId = (data as string | null) ?? null;
  }

  if (!orgId) return null;

  const { data: org } = await db
    .from("orgs")
    .select("id, slug, name, brand_slug, config, active")
    .eq("id", orgId)
    .maybeSingle();

  const row = org as OrgRow | null;
  return row && row.active ? row : null;
}

/**
 * La marca con la que hay que pintar la app para esta cuenta.
 *
 * Nunca falla hacia una pantalla rota: si la institución no se puede resolver
 * —no tiene, está de baja, la base no responde— devuelve el aspecto de fábrica,
 * que es una app perfectamente usable. Una consulta caída no debería dejar a
 * nadie fuera de su curso.
 */
export async function getAppConfigForUser(
  userId: string,
  email?: string | null,
): Promise<DemoConfig> {
  const hit = cache.get(userId);
  if (hit && Date.now() - hit.at < CACHE_MS) return hit.cfg;

  let cfg = genericAppConfig();
  try {
    const org = await getOrgForUser(userId, email);
    if (org) {
      // La marca heredada del demo. Se lee sin mirar `published`: un demo
      // despublicado sigue siendo la marca acordada con esa institución, y
      // despublicarlo sólo debería cerrar el enlace público.
      let heredada: unknown = null;
      if (org.brand_slug) {
        const { data } = await db
          .from("demos")
          .select("config")
          .eq("slug", org.brand_slug)
          .maybeSingle();
        heredada = (data as { config?: unknown } | null)?.config ?? null;
      }
      cfg = layeredConfig({ slug: org.slug, institution: org.name }, heredada, org.config);
    }
  } catch (e) {
    console.error("[org] no se pudo resolver la institución; se sirve la marca de fábrica", e);
  }

  cache.set(userId, { at: Date.now(), cfg });
  return cfg;
}
