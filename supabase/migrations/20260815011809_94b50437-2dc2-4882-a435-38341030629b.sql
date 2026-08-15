GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_guardian_of(uuid, uuid) TO authenticated;
CREATE TABLE IF NOT EXISTS public.orgs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        text NOT NULL UNIQUE,
  name        text NOT NULL,
  brand_slug  text REFERENCES public.demos(slug) ON DELETE SET NULL,
  config      jsonb NOT NULL DEFAULT '{}'::jsonb,
  active      boolean NOT NULL DEFAULT true,
  notes       text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT orgs_slug_format CHECK (slug ~ '^[a-z0-9][a-z0-9-]{1,38}$')
);
ALTER TABLE public.orgs ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.orgs TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.orgs TO authenticated;
GRANT ALL ON public.orgs TO service_role;
CREATE TABLE IF NOT EXISTS public.org_domains (
  match      text PRIMARY KEY,
  org_id     uuid NOT NULL REFERENCES public.orgs(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT org_domains_lower CHECK (match = lower(match)),
  CONSTRAINT org_domains_shape CHECK (match ~ '^[a-z0-9._%+-]*@?[a-z0-9.-]+\.[a-z]{2,}$')
);
ALTER TABLE public.org_domains ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.org_domains TO authenticated;
GRANT ALL ON public.org_domains TO service_role;
CREATE INDEX IF NOT EXISTS org_domains_org_idx ON public.org_domains (org_id);
CREATE TABLE IF NOT EXISTS public.org_members (
  user_id   uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  org_id    uuid NOT NULL REFERENCES public.orgs(id) ON DELETE CASCADE,
  source    text NOT NULL DEFAULT 'domain' CHECK (source IN ('domain', 'invite', 'manual')),
  joined_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.org_members ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.org_members TO authenticated;
GRANT ALL ON public.org_members TO service_role;
CREATE INDEX IF NOT EXISTS org_members_org_idx ON public.org_members (org_id);
CREATE TABLE IF NOT EXISTS public.org_invites (
  code       text PRIMARY KEY,
  org_id     uuid NOT NULL REFERENCES public.orgs(id) ON DELETE CASCADE,
  max_uses   int  NOT NULL DEFAULT 0,
  uses       int  NOT NULL DEFAULT 0,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT org_invites_shape CHECK (code ~ '^[A-Z0-9-]{4,24}$')
);
ALTER TABLE public.org_invites ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.org_invites TO authenticated;
GRANT ALL ON public.org_invites TO service_role;
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS org_id uuid REFERENCES public.orgs(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS profiles_org_idx ON public.profiles (org_id);
CREATE OR REPLACE FUNCTION public.org_for_email(_email text)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT org_id FROM public.org_domains
  WHERE match IN (lower(_email), lower(split_part(_email, '@', 2)))
  ORDER BY (match = lower(_email)) DESC
  LIMIT 1
$$;
REVOKE EXECUTE ON FUNCTION public.org_for_email(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.org_for_email(text) TO authenticated, service_role;
CREATE OR REPLACE FUNCTION public.my_org_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT org_id FROM public.org_members WHERE user_id = auth.uid()
$$;
REVOKE EXECUTE ON FUNCTION public.my_org_id() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.my_org_id() TO authenticated, service_role;
CREATE OR REPLACE FUNCTION public.redeem_org_invite(_code text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _org uuid;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Sin sesión iniciada.';
  END IF;
  SELECT org_id INTO _org
  FROM public.org_invites
  WHERE code = upper(trim(_code))
    AND (expires_at IS NULL OR expires_at > now())
    AND (max_uses = 0 OR uses < max_uses)
  FOR UPDATE;
  IF _org IS NULL THEN
    RETURN NULL;
  END IF;
  UPDATE public.org_invites SET uses = uses + 1 WHERE code = upper(trim(_code));
  INSERT INTO public.org_members (user_id, org_id, source)
  VALUES (auth.uid(), _org, 'invite')
  ON CONFLICT (user_id) DO UPDATE SET org_id = EXCLUDED.org_id, source = 'invite';
  UPDATE public.profiles SET org_id = _org WHERE id = auth.uid();
  RETURN _org;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.redeem_org_invite(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.redeem_org_invite(text) TO authenticated;
CREATE OR REPLACE FUNCTION public.assign_org_on_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _org uuid;
BEGIN
  _org := public.org_for_email(NEW.email);
  IF _org IS NOT NULL THEN
    INSERT INTO public.org_members (user_id, org_id, source)
    VALUES (NEW.id, _org, 'domain')
    ON CONFLICT (user_id) DO NOTHING;
    UPDATE public.profiles SET org_id = _org WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.assign_org_on_signup() FROM PUBLIC, anon, authenticated;
DROP TRIGGER IF EXISTS zz_assign_org_on_signup ON auth.users;
CREATE TRIGGER zz_assign_org_on_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.assign_org_on_signup();
CREATE OR REPLACE FUNCTION public.resync_org_members()
RETURNS int
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _n int := 0;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Sólo un administrador puede reasignar instituciones.';
  END IF;
  WITH resuelto AS (
    SELECT u.id AS user_id, public.org_for_email(u.email) AS org_id
    FROM auth.users u
    WHERE public.org_for_email(u.email) IS NOT NULL
  ), escrito AS (
    INSERT INTO public.org_members (user_id, org_id, source)
    SELECT user_id, org_id, 'domain' FROM resuelto
    ON CONFLICT (user_id) DO UPDATE
      SET org_id = EXCLUDED.org_id
      WHERE public.org_members.source = 'domain'
        AND public.org_members.org_id IS DISTINCT FROM EXCLUDED.org_id
    RETURNING user_id
  )
  SELECT count(*) INTO _n FROM escrito;
  UPDATE public.profiles p
  SET org_id = m.org_id
  FROM public.org_members m
  WHERE m.user_id = p.id AND p.org_id IS DISTINCT FROM m.org_id;
  RETURN _n;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.resync_org_members() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.resync_org_members() TO authenticated;
CREATE OR REPLACE FUNCTION public.touch_orgs_updated_at()
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
REVOKE EXECUTE ON FUNCTION public.touch_orgs_updated_at() FROM PUBLIC, anon, authenticated;
DROP TRIGGER IF EXISTS orgs_touch_updated_at ON public.orgs;
CREATE TRIGGER orgs_touch_updated_at
  BEFORE UPDATE ON public.orgs
  FOR EACH ROW EXECUTE FUNCTION public.touch_orgs_updated_at();
DROP POLICY IF EXISTS "member reads own org" ON public.orgs;
CREATE POLICY "member reads own org" ON public.orgs
  FOR SELECT TO authenticated USING (id = public.my_org_id());
DROP POLICY IF EXISTS "admin reads every org" ON public.orgs;
CREATE POLICY "admin reads every org" ON public.orgs
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "admin writes orgs" ON public.orgs;
CREATE POLICY "admin writes orgs" ON public.orgs
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "admin updates orgs" ON public.orgs;
CREATE POLICY "admin updates orgs" ON public.orgs
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "admin deletes orgs" ON public.orgs;
CREATE POLICY "admin deletes orgs" ON public.orgs
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "admin manages domains" ON public.org_domains;
CREATE POLICY "admin manages domains" ON public.org_domains
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "admin manages invites" ON public.org_invites;
CREATE POLICY "admin manages invites" ON public.org_invites
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "member reads own membership" ON public.org_members;
CREATE POLICY "member reads own membership" ON public.org_members
  FOR SELECT TO authenticated USING (user_id = auth.uid());
DROP POLICY IF EXISTS "admin manages memberships" ON public.org_members;
CREATE POLICY "admin manages memberships" ON public.org_members
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
INSERT INTO public.orgs (slug, name, brand_slug, config, active) VALUES
  ('cip', 'Colegio de Ingenieros del Perú', 'democip', '{}'::jsonb, true)
ON CONFLICT (slug) DO NOTHING;