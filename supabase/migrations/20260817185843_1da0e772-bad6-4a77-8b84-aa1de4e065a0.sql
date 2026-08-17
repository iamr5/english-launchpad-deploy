-- El padrón decide también QUÉ INTERFAZ ve cada correo.
--
-- Hasta aquí el padrón (org_domains) sólo decía a qué institución pertenece una
-- dirección, o sea con qué marca se pinta la app. Lo que veía cada quien al
-- entrar —la app del alumno o el panel de seguimiento— salía del botón que
-- hubiera pulsado al registrarse: «Soy… Alumno / Familia / Profesor».
--
-- Eso está al revés. Quien sabe si alguien es alumno o profesor es la
-- institución, no la persona rellenando un formulario: hoy cualquiera puede
-- marcarse «Profesor» y entrar al reporte de aula de su propio colegio.
--
-- Con esto, la institución entrega dos listas —los alumnos y quienes ven el
-- panel— y el correo decide las dos cosas: la marca y la interfaz.
--
-- `role` vacío = como hasta ahora: la dirección sólo asigna institución y el
-- papel lo sigue eligiendo quien se registra. Así ningún padrón ya cargado
-- cambia de comportamiento por esta migración.

ALTER TABLE public.org_domains
  ADD COLUMN IF NOT EXISTS role public.app_role;

-- Un padrón NUNCA puede repartir el rol de administrador: eso abre /demos y
-- /instituciones enteros. Se concede a mano, en admin_emails, y nada más.
ALTER TABLE public.org_domains
  DROP CONSTRAINT IF EXISTS org_domains_role_ok;
ALTER TABLE public.org_domains
  ADD CONSTRAINT org_domains_role_ok
  CHECK (role IS NULL OR role IN ('student', 'parent', 'teacher'));

/** Qué papel le toca a un correo según el padrón, o NULL si no lo dice. */
CREATE OR REPLACE FUNCTION public.org_role_for_email(_email text)
RETURNS public.app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.org_domains
  WHERE match IN (lower(_email), lower(split_part(_email, '@', 2)))
  ORDER BY (match = lower(_email)) DESC   -- la dirección exacta manda sobre el dominio
  LIMIT 1
$$;
REVOKE EXECUTE ON FUNCTION public.org_role_for_email(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.org_role_for_email(text) TO authenticated, service_role;

/**
 * Deja a una cuenta con exactamente el papel que diga el padrón.
 *
 * Se REEMPLAZA en vez de añadir: si se acumularan, alguien que entró como
 * alumno y luego aparece en la lista del panel se quedaría con los dos, y
 * /dashboard le dejaría pasar por tener «teacher» mientras la app le sigue
 * tratando de alumno. Un correo, una interfaz.
 *
 * El rol de administrador se respeta: se concede por otra vía (admin_emails) y
 * un padrón no tiene por qué quitarlo.
 */
CREATE OR REPLACE FUNCTION public.apply_roster_role(_user uuid, _role public.app_role)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF _role IS NULL THEN
    RETURN;
  END IF;

  DELETE FROM public.user_roles
  WHERE user_id = _user AND role <> 'admin' AND role <> _role;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (_user, _role)
  ON CONFLICT (user_id, role) DO NOTHING;

  UPDATE public.profiles SET role = _role WHERE id = _user;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.apply_roster_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;

-- Al registrarse: institución Y papel, los dos del padrón.
CREATE OR REPLACE FUNCTION public.assign_org_on_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _org  uuid;
  _role public.app_role;
BEGIN
  _org  := public.org_for_email(NEW.email);
  _role := public.org_role_for_email(NEW.email);

  IF _org IS NOT NULL THEN
    INSERT INTO public.org_members (user_id, org_id, source)
    VALUES (NEW.id, _org, 'domain')
    ON CONFLICT (user_id) DO NOTHING;
    UPDATE public.profiles SET org_id = _org WHERE id = NEW.id;
  END IF;

  PERFORM public.apply_roster_role(NEW.id, _role);
  RETURN NEW;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.assign_org_on_signup() FROM PUBLIC, anon, authenticated;

-- Y lo mismo para las cuentas que ya existían, al pulsar el botón del panel.
CREATE OR REPLACE FUNCTION public.resync_org_members()
RETURNS int
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _n int := 0;
  _f record;
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

  -- El papel se recorre aparte: una cuenta puede cambiar de lista sin cambiar
  -- de institución (pasa de alumno a profesor dentro del mismo colegio), y eso
  -- no lo detecta el bloque de arriba porque su org_id no se ha movido.
  FOR _f IN
    SELECT u.id, public.org_role_for_email(u.email) AS role
    FROM auth.users u
    WHERE public.org_role_for_email(u.email) IS NOT NULL
  LOOP
    PERFORM public.apply_roster_role(_f.id, _f.role);
  END LOOP;

  RETURN _n;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.resync_org_members() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.resync_org_members() TO authenticated;

-- ── APAVIT ────────────────────────────────────────────────────────────────
--
-- Se crea la institución, sin correos: las dos listas se llenan desde
-- /instituciones cuando APAVIT mande su padrón.
--
-- brand_slug va vacío a propósito. No hay ningún demo de APAVIT en el
-- repositorio (sólo la presentación, que es otra cosa), así que apuntarlo a
-- ciegas le pondría la marca de otra institución. Mientras esté vacío, sus
-- cuentas entran con el aspecto de fábrica —que funciona— y en cuanto exista su
-- demo se elige en el desplegable del panel.
INSERT INTO public.orgs (slug, name, brand_slug, config, active) VALUES
  ('apavit', 'APAVIT', NULL, '{}'::jsonb, true)
ON CONFLICT (slug) DO NOTHING;