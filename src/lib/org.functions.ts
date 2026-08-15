// Lo que la ruta de React necesita saber antes de montar el iframe de la app:
// a qué institución pertenece quien entra y con qué pase pedir su página ya
// pintada con esa marca.
//
// Va por RPC (createServerFn) y no por fetch a mano porque así el bearer de la
// sesión viaja solo: lo pone attachSupabaseAuth, registrado en src/start.ts.
//
// Los import de app-token y org-config son DINÁMICOS a propósito: este archivo
// acaba en el paquete del navegador, y el secreto con el que se firma el pase
// no tiene por qué acompañarlo.

import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type MyOrg = {
  /** Nombre de la institución, o null si la cuenta no tiene ninguna. */
  institution: string | null;
  slug: string | null;
  /** El pase con el que pedir /api/app-shell o /api/dashboard-shell. */
  token: string;
};

/**
 * La institución de quien entra y su pase para la app del alumno.
 */
export const getMyAppShell = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<MyOrg> => {
    const email = (context.claims.email as string | undefined) ?? null;
    const [{ issueShellToken }, { getOrgForUser }] = await Promise.all([
      import("./app-token"),
      import("./org-config.server"),
    ]);

    const org = await getOrgForUser(context.userId, email).catch(() => null);
    return {
      institution: org?.name ?? null,
      slug: org?.slug ?? null,
      token: await issueShellToken({ uid: context.userId, email: email ?? undefined }),
    };
  });

/**
 * Lo mismo para el panel de seguimiento. La vista —familia o profesor— se
 * decide AQUÍ, a partir de los roles, y viaja firmada dentro del pase: si la
 * eligiera la URL del iframe, cualquiera podría pedir el reporte de aula
 * cambiando un parámetro.
 */
export const getMyDashboardShell = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<MyOrg & { view: "parent" | "teacher" | null }> => {
    const email = (context.claims.email as string | undefined) ?? null;

    const { data: roleRows } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    const roles = (roleRows ?? []).map((r) => (r as { role: string }).role);
    const view = roles.includes("teacher")
      ? ("teacher" as const)
      : roles.includes("parent")
        ? ("parent" as const)
        : null;

    if (!view) return { institution: null, slug: null, token: "", view: null };

    const [{ issueShellToken }, { getOrgForUser }] = await Promise.all([
      import("./app-token"),
      import("./org-config.server"),
    ]);

    const org = await getOrgForUser(context.userId, email).catch(() => null);
    return {
      institution: org?.name ?? null,
      slug: org?.slug ?? null,
      view,
      token: await issueShellToken({ uid: context.userId, email: email ?? undefined, view }),
    };
  });

/**
 * Alta por código de invitación, para quien se registra con un correo personal
 * y por tanto no cae en ninguna institución por dominio.
 *
 * La comprobación la hace la base (redeem_org_invite, SECURITY DEFINER): el
 * alumno no puede leer la tabla de códigos —sería el directorio de clientes—,
 * así que entrega el código y recibe un sí o un no.
 */
export const redeemInvite = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { code: string }) => ({
    code: String(d?.code ?? "")
      .trim()
      .toUpperCase(),
  }))
  .handler(async ({ data, context }): Promise<{ ok: boolean; institution: string | null }> => {
    if (!/^[A-Z0-9-]{4,24}$/.test(data.code)) return { ok: false, institution: null };

    // Sin los tipos generados: types.ts lo escribe la plataforma y aún no
    // conoce ni la tabla `orgs` ni esta función.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = context.supabase as any;

    const { data: orgId, error } = await db.rpc("redeem_org_invite", { _code: data.code });
    if (error || !orgId) return { ok: false, institution: null };

    // La caché de marca de este usuario se queda vieja en cuanto cambia de
    // institución: sin esto, acaba de canjear el código y la app le seguiría
    // saliendo con el aspecto de fábrica hasta que caducara sola.
    const { invalidateOrgCache } = await import("./org-config.server");
    invalidateOrgCache(context.userId);

    const { data: org } = await db.from("orgs").select("name").eq("id", orgId).maybeSingle();

    return { ok: true, institution: (org as { name?: string } | null)?.name ?? null };
  });
