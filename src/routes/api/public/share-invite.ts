import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { sendTemplateEmail } from '@/lib/email-templates/send-email'

const schema = z.object({
  email: z.string().email().max(180),
  studentName: z.string().max(60).optional(),
  level: z.string().max(8).optional(),
  streak: z.number().int().min(0).max(9999).optional(),
  todayMin: z.number().int().min(0).max(1440).optional(),
  lessonsDone: z.number().int().min(0).max(9999).optional(),
})

// Very small in-memory throttle per IP (best effort; resets on redeploy).
const hits = new Map<string, number[]>()
function rateLimited(ip: string) {
  const now = Date.now()
  const win = (hits.get(ip) || []).filter((t) => now - t < 60 * 60 * 1000)
  win.push(now)
  hits.set(ip, win)
  return win.length > 10
}

export const Route = createFileRoute('/api/public/share-invite')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const ip =
          request.headers.get('cf-connecting-ip') ||
          request.headers.get('x-forwarded-for') ||
          'unknown'
        // `reason` (no `error`) porque es lo que lee el cliente. Antes estas tres
        // respuestas usaban `error`, así que al cliente le llegaba undefined y
        // mostraba el mensaje genérico "No pudimos enviar": quedar limitado por
        // intentos era indistinguible de un fallo real de envío. Se mantiene
        // `error` en paralelo por si algo más consume este endpoint.
        if (rateLimited(ip)) {
          return Response.json(
            { ok: false, reason: 'rate_limited', error: 'rate_limited' },
            { status: 429 },
          )
        }

        let body: unknown
        try {
          body = await request.json()
        } catch {
          return Response.json(
            { ok: false, reason: 'invalid_body', error: 'invalid_body' },
            { status: 400 },
          )
        }

        const parsed = schema.safeParse(body)
        if (!parsed.success) {
          return Response.json(
            { ok: false, reason: 'invalid_input', error: 'invalid_input' },
            { status: 400 },
          )
        }
        const data = parsed.data

        const origin = new URL(request.url).origin
        const day = new Date().toISOString().slice(0, 10)

        try {
          const result = await sendTemplateEmail('progress-invite', data.email, {
            templateData: {
              studentName: data.studentName || 'Un alumno',
              level: data.level || 'A1',
              streak: data.streak ?? 0,
              todayMin: data.todayMin ?? 0,
              lessonsDone: data.lessonsDone ?? 0,
              dashboardUrl: `${origin}/dashboard`,
            },
            idempotencyKey: `progress-invite-${data.email.toLowerCase()}-${day}`,
          })
          if (!result.sent) {
            return Response.json({ ok: false, reason: result.reason }, { status: 200 })
          }
          return Response.json({ ok: true })
        } catch (error) {
          const code = (error as { code?: string })?.code
          const status = (error as { status?: number })?.status
          // Log con el mensaje entero: solo con el código no se distingue una
          // clave ausente de un rechazo del proveedor, y son arreglos opuestos.
          console.error(
            '[share-invite] envío fallido',
            JSON.stringify({ code, status, message: (error as Error)?.message }),
          )
          if (
            code === 'domain_not_verified' ||
            code === 'emails_disabled' ||
            code === 'email_not_configured'
          ) {
            return Response.json({ ok: false, reason: code }, { status: 200 })
          }
          if (status === 429) {
            return Response.json({ ok: false, reason: 'rate_limited' }, { status: 200 })
          }
          // `detail` viaja al cliente para poder ver la causa en consola sin
          // tener acceso a los logs del servidor. No lleva secretos: son códigos
          // y mensajes del proveedor de correo.
          return Response.json(
            { ok: false, reason: 'send_failed', detail: code || (error as Error)?.message },
            { status: 200 },
          )
        }
      },
    },
  },
})
