-- Tabla de demos: una fila por enlace personalizado (aprendoenglish.com/<slug>).
--
-- La plantilla y los assets son los mismos para todos; lo único propio de cada
-- institución es la configuración que guarda esta tabla. Ver src/lib/demo-config.ts.

CREATE TABLE IF NOT EXISTS public.demos (
  slug        text PRIMARY KEY,
  institution text NOT NULL,
  config      jsonb NOT NULL DEFAULT '{}'::jsonb,
  published   boolean NOT NULL DEFAULT false,
  notes       text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  -- Mismo criterio que isValidSlug() en el cliente: minúsculas, sin espacios.
  CONSTRAINT demos_slug_format CHECK (slug ~ '^[a-z0-9][a-z0-9-]{1,38}$')
);

ALTER TABLE public.demos ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.demos TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.demos TO authenticated;
GRANT ALL ON public.demos TO service_role;

-- has_role se usa desde las políticas de abajo; el REVOKE de la migración
-- 20260724234048 quitó el permiso por defecto, así que se concede explícitamente.
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

-- Un demo publicado lo puede leer cualquiera, sin cuenta: es justo lo que hace
-- que el enlace personalizado funcione para quien lo recibe por WhatsApp.
DROP POLICY IF EXISTS "anyone reads published demos" ON public.demos;
CREATE POLICY "anyone reads published demos" ON public.demos
  FOR SELECT TO anon, authenticated USING (published = true);

-- Los borradores y la escritura, sólo para administradores.
DROP POLICY IF EXISTS "admin reads every demo" ON public.demos;
CREATE POLICY "admin reads every demo" ON public.demos
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "admin writes demos" ON public.demos;
CREATE POLICY "admin writes demos" ON public.demos
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "admin updates demos" ON public.demos;
CREATE POLICY "admin updates demos" ON public.demos
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "admin deletes demos" ON public.demos;
CREATE POLICY "admin deletes demos" ON public.demos
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- updated_at al día, para poder ordenar por "editado hace poco" en el panel.
CREATE OR REPLACE FUNCTION public.touch_demos_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.touch_demos_updated_at() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS demos_touch_updated_at ON public.demos;
CREATE TRIGGER demos_touch_updated_at
  BEFORE UPDATE ON public.demos
  FOR EACH ROW EXECUTE FUNCTION public.touch_demos_updated_at();

-- Almacenamiento de lo que sube cada demo: logos, fondos del mapa, packs de
-- mascota. Escritura sólo para administradores; lectura abierta por política.
--
-- El bucket va PRIVADO a propósito: la plataforma bloquea los buckets públicos.
-- La consecuencia práctica es que /storage/v1/object/public/ responde
-- "Bucket not found", así que los archivos NO se enlazan con getPublicUrl():
-- se sirven por /api/brand/<ruta> (ver src/routes/api/brand/$.ts), que descarga
-- con la clave publicable apoyándose en la política de abajo. Se prefiere eso a
-- las URLs firmadas porque la dirección no caduca.
INSERT INTO storage.buckets (id, name, public)
VALUES ('demo-brand', 'demo-brand', false)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "anyone reads demo brand files" ON storage.objects;
CREATE POLICY "anyone reads demo brand files" ON storage.objects
  FOR SELECT TO anon, authenticated USING (bucket_id = 'demo-brand');

DROP POLICY IF EXISTS "admin writes demo brand files" ON storage.objects;
CREATE POLICY "admin writes demo brand files" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'demo-brand' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "admin updates demo brand files" ON storage.objects;
CREATE POLICY "admin updates demo brand files" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'demo-brand' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "admin deletes demo brand files" ON storage.objects;
CREATE POLICY "admin deletes demo brand files" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'demo-brand' AND public.has_role(auth.uid(), 'admin'));

-- Los dos demos que ya existen, para que el panel no arranque vacío.
INSERT INTO public.demos (slug, institution, published, config) VALUES
  ('demo', 'AprendoEnglish', true, '{
     "meta": {
       "title": "AprendoEnglish · Demo interactivo",
       "description": "Prueba el demo interactivo de AprendoEnglish y descubre nuestra metodología.",
       "imageAlt": "AprendoEnglish.com — Inglés de clase mundial para tu institución"
     }
   }'::jsonb),
  ('democip', 'Colegio de Ingenieros del Perú', true, '{
     "meta": {
       "title": "AprendoEnglish × CIP · Demo interactivo",
       "description": "Prueba el demo interactivo de AprendoEnglish y descubre nuestra metodología.",
       "imageAlt": "AprendoEnglish × CIP"
     },
     "mascot": { "pack": "boti" },
     "copy": { "audience": "ingenier@" }
   }'::jsonb)
ON CONFLICT (slug) DO NOTHING;

-- Primer administrador, para poder entrar al panel. Si hace falta otro, se
-- añade una fila más en user_roles con role = 'admin'.
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role
FROM auth.users
WHERE lower(email) = lower('turuta.ai.tools@gmail.com')
ON CONFLICT (user_id, role) DO NOTHING;
