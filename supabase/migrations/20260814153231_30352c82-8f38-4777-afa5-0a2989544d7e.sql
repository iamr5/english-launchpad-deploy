CREATE TABLE IF NOT EXISTS public.preinscripciones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  slug text NOT NULL DEFAULT 'cip',
  utm jsonb NOT NULL DEFAULT '{}'::jsonb,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS preinscripciones_email_slug_key
  ON public.preinscripciones (lower(email), slug);

GRANT SELECT ON public.preinscripciones TO authenticated;
GRANT ALL ON public.preinscripciones TO service_role;

ALTER TABLE public.preinscripciones ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can read preinscripciones" ON public.preinscripciones;
CREATE POLICY "Admins can read preinscripciones"
  ON public.preinscripciones FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));