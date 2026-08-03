CREATE TABLE IF NOT EXISTS public.demos (
  slug        text PRIMARY KEY,
  institution text NOT NULL,
  config      jsonb NOT NULL DEFAULT '{}'::jsonb,
  published   boolean NOT NULL DEFAULT false,
  notes       text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT demos_slug_format CHECK (slug ~ '^[a-z0-9][a-z0-9-]{1,38}$')
);

ALTER TABLE public.demos ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.demos TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.demos TO authenticated;
GRANT ALL ON public.demos TO service_role;

GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

DROP POLICY IF EXISTS "anyone reads published demos" ON public.demos;
CREATE POLICY "anyone reads published demos" ON public.demos
  FOR SELECT TO anon, authenticated USING (published = true);

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

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role
FROM auth.users
WHERE lower(email) = lower('turuta.ai.tools@gmail.com')
ON CONFLICT (user_id, role) DO NOTHING;