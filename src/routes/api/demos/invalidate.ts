import { createFileRoute } from '@tanstack/react-router'
import { invalidateDemoCache } from '@/lib/demo-config'

/**
 * Tira la caché en memoria de un demo.
 *
 * getDemoConfig() guarda la configuración un rato para no consultar la base en
 * cada visita, y su comentario decía «el panel la invalida al guardar» — pero
 * nadie la invalidaba: saveDemo() corre en el NAVEGADOR (usa la sesión del
 * usuario y es RLS quien autoriza), así que no tiene forma de tocar un Map que
 * vive en el servidor. Resultado: guardabas, recargabas, y el demo seguía
 * saliendo como antes hasta que la entrada caducaba sola.
 *
 * El panel llama aquí después de guardar y el cambio se ve en la siguiente
 * recarga.
 *
 * Sobre el alcance: la caché es del proceso. En un despliegue con varias
 * instancias esto vacía la del servidor que atienda la llamada, no la de todas;
 * las demás caducan solas, y por eso el TTL se dejó corto. Para invalidar de
 * verdad en todas haría falta almacenamiento compartido, que no compensa para
 * lo que cuesta la consulta que evita.
 */
const hits = new Map<string, number[]>()
function rateLimited(ip: string) {
  const now = Date.now()
  const win = (hits.get(ip) || []).filter((t) => now - t < 60_000)
  win.push(now)
  hits.set(ip, win)
  return win.length > 60
}

export const Route = createFileRoute('/api/demos/invalidate')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // Vaciar una caché solo provoca que se relea de la base. Aun así va
        // limitado: sin tope, pedirlo en bucle convertiría cada visita al demo
        // en una consulta.
        const ip =
          request.headers.get('cf-connecting-ip') ||
          request.headers.get('x-forwarded-for') ||
          'unknown'
        if (rateLimited(ip)) {
          return Response.json({ ok: false, reason: 'rate_limited' }, { status: 429 })
        }

        let slug: string | undefined
        try {
          slug = (await request.json())?.slug
        } catch {
          // Sin cuerpo válido se vacía entera: es lo más seguro y sigue siendo barato.
        }
        invalidateDemoCache(typeof slug === 'string' && slug ? slug : undefined)
        return Response.json({ ok: true })
      },
    },
  },
})
