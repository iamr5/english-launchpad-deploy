CREATE TABLE IF NOT EXISTS public.mascot_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  short_name text,
  kind text,
  emoji text,
  base_url text NOT NULL,
  manifest jsonb NOT NULL DEFAULT '{}'::jsonb,
  thumb text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.mascot_library TO authenticated;
GRANT ALL ON public.mascot_library TO service_role;

ALTER TABLE public.mascot_library ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin reads mascot library" ON public.mascot_library
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "admin writes mascot library" ON public.mascot_library
  FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "admin updates mascot library" ON public.mascot_library
  FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "admin deletes mascot library" ON public.mascot_library
  FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER mascot_library_touch_updated_at
  BEFORE UPDATE ON public.mascot_library
  FOR EACH ROW EXECUTE FUNCTION public.touch_demos_updated_at();