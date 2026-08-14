import { createFileRoute } from "@tanstack/react-router";

// Recoge los correos del landing de preinscripción. Es público a propósito: lo
// llama el formulario desde el navegador. La tabla no tiene política de
// inserción para anon, así que la escritura va con la clave de servicio y sólo
// con los campos que validamos aquí.

const EMAIL = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

const hits = new Map<string, number[]>();
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_HOUR = 30;

function tooMany(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_HOUR;
}

export const Route = createFileRoute("/api/public/preinscripcion")({
  server: {
    handlers: {
      // Contador público de firmas para el landing (sólo el total, sin correos).
      GET: async ({ request }) => {
        const raw = (new URL(request.url).searchParams.get("slug") ?? "cip").toLowerCase();
        const slug = /^[a-z0-9-]{1,40}$/.test(raw) ? raw : "cip";
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { count, error } = await supabaseAdmin
          .from("preinscripciones")
          .select("id", { count: "exact", head: true })
          .eq("slug", slug);
        if (error) return Response.json({ error: "server" }, { status: 500 });
        return Response.json(
          { total: count ?? 0 },
          { headers: { "Cache-Control": "public, max-age=60" } },
        );
      },
      POST: async ({ request }) => {

        const ip =
          request.headers.get("cf-connecting-ip") ||
          request.headers.get("x-forwarded-for") ||
          "unknown";
        if (tooMany(ip)) return Response.json({ error: "rate_limited" }, { status: 429 });

        let body: Record<string, unknown> = {};
        try {
          body = (await request.json()) as Record<string, unknown>;
        } catch {
          return Response.json({ error: "bad_json" }, { status: 400 });
        }

        const email = String(body["email"] ?? "").trim().toLowerCase();
        if (!EMAIL.test(email) || email.length > 200) {
          return Response.json({ error: "invalid_email" }, { status: 400 });
        }

        const slugRaw = String(body["slug"] ?? "cip").trim().toLowerCase();
        const slug = /^[a-z0-9-]{1,40}$/.test(slugRaw) ? slugRaw : "cip";

        const utmRaw = body["utm"];
        const utm: Record<string, string> = {};
        if (utmRaw && typeof utmRaw === "object") {
          for (const [k, v] of Object.entries(utmRaw as Record<string, unknown>).slice(0, 12)) {
            if (typeof v === "string" && v) utm[k.slice(0, 40)] = v.slice(0, 200);
          }
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { error } = await supabaseAdmin.from("preinscripciones").insert({
          email,
          slug,
          utm,
          user_agent: (request.headers.get("user-agent") ?? "").slice(0, 400),
        });

        // Correo repetido: para el visitante es un éxito, ya está apuntado.
        if (error && !/duplicate|unique/i.test(error.message)) {
          return Response.json({ error: "server" }, { status: 500 });
        }

        return Response.json({ ok: true });
      },
    },
  },
});
