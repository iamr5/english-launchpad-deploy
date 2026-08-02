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
        if (rateLimited(ip)) {
          return Response.json({ error: 'rate_limited' }, { status: 429 })
        }

        let body: unknown
        try {
          body = await request.json()
        } catch {
          return Response.json({ error: 'invalid_body' }, { status: 400 })
        }

        const parsed = schema.safeParse(body)
        if (!parsed.success) {
          return Response.json({ error: 'invalid_input' }, { status: 400 })
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
          console.error('share-invite send failed', error)
          return Response.json({ error: 'send_failed' }, { status: 502 })
        }
      },
    },
  },
})
