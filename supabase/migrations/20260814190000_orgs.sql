-- Instituciones: a qué institución pertenece cada cuenta, y con qué marca ve la
-- app cuando entra.
--
-- Hasta aquí la marca por institución sólo existía en los demos, y la elegía la
-- URL: aprendoenglish.com/<slug> leía su fila de `demos` y pintaba la plantilla
-- con esos colores. Eso sirve para enseñar el producto por WhatsApp, pero no
-- para el producto: quien entra con su cuenta no llega por un slug, llega por
-- /login, y la app le salía siempre con la marca de fábrica.
--
-- Lo que se añade:
--
--   orgs         una institución de verdad (un cliente), con su configuración
--                de marca. Puede heredarla del demo con el que se le vendió
--                (`brand_slug` → demos.slug) y encima poner lo suyo.
--   org_domains  cómo se asigna sola una cuenta a su institución: por dominio
--                de correo («@cip.org.pe») o por la dirección entera, para el
--                caso de quien usa un gmail.
--   org_members  la pertenencia ya resuelta. Una cuenta, una institución.
--   org_invites  código de alta para quien no cae por dominio.
--
-- La resolución de la marca vive en src/lib/org-config.ts y NO consulta esto
-- desde el navegador: la sirve el servidor al montar la página de la app.

-- ── Instituciones ─────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.orgs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Nombre corto y estable. No sale en ninguna URL pública (para eso están los
  -- demos); sirve para reconocerla en el panel y en los registros.
  slug        text NOT NULL UNIQUE,
  name        text NOT NULL,
  -- De qué demo hereda la marca. La institución casi siempre se vende con un
  -- demo ya pintado con sus colores: apuntar aquí evita rehacer ese trabajo, y
  -- además mantiene el demo y la app en la misma marca sin copiar nada.
  brand_slug  text REFERENCES public.demos(slug) ON DELETE SET NULL,
  -- Lo que esta institución cambia POR ENCIMA de lo heredado. Misma forma que
  -- demos.config (ver DemoConfig en src/lib/demo-config.ts).
  config      jsonb NOT NULL DEFAULT '{}'::jsonb,
  -- Una institución dada de baja deja de pintar su marca; sus cuentas siguen
  -- entrando, pero con el aspecto de fábrica.
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

-- ── Cómo se asigna una cuenta a su institución ────────────────────────────
--
-- `match` guarda o un dominio («cip.org.pe») o una dirección entera
-- («ana@gmail.com»). Se busca primero la dirección entera y luego el dominio,
-- así una cuenta suelta puede vivir en otra institución que la de su dominio.
-- Todo se guarda en minúsculas: lo fuerza el CHECK, no la buena voluntad.

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

-- ── Pertenencia ───────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.org_members (
  user_id   uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  org_id    uuid NOT NULL REFERENCES public.orgs(id) ON DELETE CASCADE,
  -- Cómo llegó: por dominio, por código de invitación o a mano desde el panel.
  -- Sirve para saber qué se puede recalcular sin pisar una decisión humana.
  source    text NOT NULL DEFAULT 'domain' CHECK (source IN ('domain', 'invite', 'manual')),
  joined_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.org_members ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.org_members TO authenticated;
GRANT ALL ON public.org_members TO service_role;

CREATE INDEX IF NOT EXISTS org_members_org_idx ON public.org_members (org_id);

-- ── Códigos de alta ───────────────────────────────────────────────────────
--
-- Para el alumno que se registra con su correo personal: el colegio le da un
-- código y con eso entra en su institución. Sin esto, cualquiera con un gmail
-- se quedaría sin marca.

CREATE TABLE IF NOT EXISTS public.org_invites (
  code       text PRIMARY KEY,
  org_id     uuid NOT NULL REFERENCES public.orgs(id) ON DELETE CASCADE,
  max_uses   int  NOT NULL DEFAULT 0,   -- 0 = sin tope
  uses       int  NOT NULL DEFAULT 0,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT org_invites_shape CHECK (code ~ '^[A-Z0-9-]{4,24}$')
);

ALTER TABLE public.org_invites ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.org_invites TO authenticated;
GRANT ALL ON public.org_invites TO service_role;

-- La institución de cada cuenta, también en profiles: es la tabla que ya lee
-- todo lo demás, y así un reporte no necesita un JOIN más para agrupar por
-- institución. La fuente de verdad sigue siendo org_members; esto es copia.
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS org_id uuid REFERENCES public.orgs(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS profiles_org_idx ON public.profiles (org_id);

-- ── Funciones ─────────────────────────────────────────────────────────────

-- A qué institución le toca un correo. Dirección entera primero, dominio
-- después: es lo que permite sacar a una cuenta suelta de su dominio.
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

-- La institución de quien está entrando. La usan las políticas de abajo, así
-- que va SECURITY DEFINER: si consultara org_members directamente desde una
-- política sobre org_members, la política se llamaría a sí misma.
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

-- Alta por código de invitación. Va SECURITY DEFINER porque el alumno no puede
-- leer org_invites (le diría a qué institución pertenece cada código): entrega
-- el código, y esto responde sí o no.
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
    RETURN NULL;   -- código inexistente, caducado o agotado: lo mismo de cara afuera
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

-- ── Asignación automática al registrarse ──────────────────────────────────
--
-- Mismo patrón que grant_admin_on_signup: un disparador para las cuentas
-- nuevas y un UPDATE de una vez para las que ya existen. Sin las dos mitades,
-- cambiar el mapeo de dominios sólo afectaría al futuro.

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

-- Detrás de on_auth_user_created (que crea el profiles), porque este actualiza
-- esa misma fila. Los disparadores AFTER de una misma tabla corren en orden
-- alfabético de nombre, y «on_auth_user_created» < «zz_assign_org_on_signup».
DROP TRIGGER IF EXISTS zz_assign_org_on_signup ON auth.users;
CREATE TRIGGER zz_assign_org_on_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.assign_org_on_signup();

-- Recorre las cuentas existentes y les pone la institución que les toque por
-- dominio. NO toca a quien ya entró por código o a mano: eso fue una decisión,
-- y un mapeo de dominios no debería deshacerla.
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

-- updated_at al día, igual que en demos.
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

-- ── Políticas ─────────────────────────────────────────────────────────────
--
-- Regla de fondo: cada quien ve SU institución y nada más; el administrador ve
-- y escribe todo. El mapeo de dominios y los códigos no los lee nadie salvo el
-- administrador — un listado de dominios es un directorio de clientes.

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

-- La propia pertenencia sí se lee: es lo que la app pregunta al arrancar.
DROP POLICY IF EXISTS "member reads own membership" ON public.org_members;
CREATE POLICY "member reads own membership" ON public.org_members
  FOR SELECT TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "admin manages memberships" ON public.org_members;
CREATE POLICY "admin manages memberships" ON public.org_members
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ── Semilla ───────────────────────────────────────────────────────────────
--
-- La institución del CIP, heredando la marca del demo con el que se le enseñó.
-- Sin dominios: los pone el panel cuando se sepan los correos de verdad, y
-- añadir uno aquí a ciegas metería cuentas ajenas en la institución.
INSERT INTO public.orgs (slug, name, brand_slug, config, active) VALUES
  ('cip', 'Colegio de Ingenieros del Perú', 'democip', '{}'::jsonb, true)
ON CONFLICT (slug) DO NOTHING;
