import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { invalidateDemoCache } from "@/lib/demo-config";

/**
 * Guarda las metas de un demo desde el propio panel de seguimiento.
 *
 * Por qué existe, habiendo ya /demos: las metas se leen en el panel, y decidir
 * el listón mirando la tabla es otra cosa que decidirlo en un formulario aparte.
 * El control vive en la cabecera del reporte, enfrente del selector de semana.
 *
 * SOBRE LOS PERMISOS. /<slug>/dashboard es una página pública: quien tenga el
 * enlace la abre. Por eso esto NO escribe con la clave del servidor —eso dejaría
 * que cualquiera con el link le cambiara las metas al colegio—, sino con el
 * token del usuario que lo pide, así que autoriza RLS exactamente igual que
 * cuando se guarda desde /demos. Sin sesión, Supabase rechaza la escritura y
 * aquí sale un 401; el visitante corriente ni siquiera ve el botón.
 *
 * Se actualiza SOLO `config.metas`. Se relee la configuración y se reescribe
 * entera porque `config` es una columna JSON y no hay actualización parcial de
 * un campo suelto; escribir el objeto entero desde el cliente sería peor, porque
 * un panel con la configuración vieja en memoria pisaría lo que otro acabara de
 * cambiar en /demos.
 */

const NIVELES = ["A1", "A2", "B1", "B2", "C1"];

/** Un entero de 0 a `tope`, o undefined si no vale. Vacío = «el de siempre». */
function entero(v: unknown, tope: number): number | undefined {
  if (v === null || v === undefined || v === "") return undefined;
  const n = Number(v);
  if (!Number.isFinite(n) || n < 0 || n > tope) return undefined;
  return Math.round(n);
}

/**
 * Deja pasar sólo los cuatro campos conocidos y con valores creíbles. El cuerpo
 * llega del navegador: sin esto, cualquiera con sesión podría meter en `config`
 * lo que quisiera, y esa columna la lee la plantilla entera.
 */
function limpiarMetas(entrada: unknown) {
  const m = (entrada ?? {}) as Record<string, unknown>;
  const salida: Record<string, number | string> = {};
  const activos = entero(m.activos, 100);
  const lecciones = entero(m.lecciones, 100000);
  const riesgo = entero(m.riesgo, 10000);
  if (activos !== undefined) salida.activos = activos;
  if (lecciones !== undefined) salida.lecciones = lecciones;
  if (riesgo !== undefined) salida.riesgo = riesgo;
  if (typeof m.nivel === "string" && NIVELES.includes(m.nivel)) salida.nivel = m.nivel;
  return salida;
}

export const Route = createFileRoute("/api/demos/metas")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const auth = request.headers.get("authorization") ?? "";
        const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
        if (!token) {
          return Response.json({ ok: false, reason: "sin_sesion" }, { status: 401 });
        }

        let cuerpo: { slug?: unknown; metas?: unknown };
        try {
          cuerpo = await request.json();
        } catch {
          return Response.json({ ok: false, reason: "json_invalido" }, { status: 400 });
        }

        const slug = typeof cuerpo.slug === "string" ? cuerpo.slug.trim() : "";
        if (!/^[a-z0-9-]{1,64}$/.test(slug)) {
          return Response.json({ ok: false, reason: "slug_invalido" }, { status: 400 });
        }
        const metas = limpiarMetas(cuerpo.metas);

        const url = process.env.SUPABASE_URL;
        const key = process.env.SUPABASE_PUBLISHABLE_KEY;
        if (!url || !key) {
          return Response.json({ ok: false, reason: "sin_configurar" }, { status: 500 });
        }

        // El token del usuario viaja en cada petición: para Supabase, esto ES
        // ese usuario, y sus políticas deciden si puede escribir este demo.
        const db = createClient(url, key, {
          global: { headers: { Authorization: `Bearer ${token}` } },
          auth: { persistSession: false, autoRefreshToken: false },
        });

        // maybeSingle y no single: con `single`, «no hay fila» también llega como
        // error, y entonces un token caducado y un slug que no existe se
        // confunden — al usuario le salía «este demo ya no existe» cuando lo que
        // pasaba es que se le había cerrado la sesión.
        const { data: fila, error: errLectura } = await db
          .from("demos")
          .select("config")
          .eq("slug", slug)
          .maybeSingle();
        if (errLectura) {
          return Response.json(
            { ok: false, reason: "sin_sesion", detalle: errLectura.message },
            { status: 401 },
          );
        }
        if (!fila) {
          return Response.json({ ok: false, reason: "no_encontrado" }, { status: 404 });
        }

        const config = { ...((fila.config as Record<string, unknown>) ?? {}) };
        // Sin metas que guardar se quita la clave, que es lo que devuelve el
        // panel a los valores de fábrica. Dejarla como objeto vacío daría lo
        // mismo, pero deja basura en la configuración.
        if (Object.keys(metas).length) config.metas = metas;
        else delete config.metas;

        const { error: errEscritura } = await db
          .from("demos")
          .update({ config } as never)
          .eq("slug", slug);
        if (errEscritura) {
          // RLS rechaza con error normal, no con 403: sin permiso no hay fila
          // que actualizar. Se responde 403 porque es lo que de verdad pasó.
          return Response.json(
            { ok: false, reason: "sin_permiso", detalle: errEscritura.message },
            { status: 403 },
          );
        }

        // La configuración se cachea en memoria unos segundos; sin esto, guardar
        // y recargar seguiría enseñando las metas viejas.
        invalidateDemoCache(slug);
        return Response.json({ ok: true, metas });
      },
    },
  },
});
