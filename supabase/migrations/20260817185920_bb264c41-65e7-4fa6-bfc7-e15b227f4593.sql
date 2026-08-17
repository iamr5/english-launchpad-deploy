-- Las primeras tres cuentas del padrón de APAVIT.
--
-- Son correos personales (gmail), no de un dominio institucional, así que van
-- como direcciones exactas: cada una entra sola, sin arrastrar a nadie más.
-- Es justo el caso para el que el padrón acepta direcciones enteras además de
-- dominios.
--
-- Va en su propia migración, y no dentro de 20260815120000, porque aquélla
-- puede estar ya aplicada: tocar una migración que ya corrió no la vuelve a
-- ejecutar, y estas filas no aparecerían nunca. Ésta es idempotente, así que
-- correrla dos veces no molesta.

INSERT INTO public.org_domains (match, org_id, role)
SELECT v.match, o.id, v.role::public.app_role
FROM (VALUES
  -- La app del curso.
  ('dmalcaruiz@gmail.com',      'student'),
  ('turuta.ai.tools@gmail.com', 'student'),
  -- El panel de seguimiento.
  ('feraligatr9000@gmail.com',  'teacher')
) AS v(match, role)
CROSS JOIN public.orgs o
WHERE o.slug = 'apavit'
ON CONFLICT (match) DO UPDATE
  SET org_id = EXCLUDED.org_id,
      role   = EXCLUDED.role;

-- Y se aplica ya a las cuentas que existan, sin esperar al botón del panel:
-- estas tres son las de prueba y lo que se quiere es entrar y verlo.
--
-- No se llama a resync_org_members() porque ésa exige ser administrador
-- (auth.uid()), y aquí no hay sesión: una migración corre como el rol de
-- servicio. Se hace el mismo trabajo, acotado a estos tres correos.
DO $$
DECLARE
  _f record;
BEGIN
  FOR _f IN
    SELECT u.id,
           public.org_for_email(u.email)      AS org_id,
           public.org_role_for_email(u.email) AS role
    FROM auth.users u
    WHERE lower(u.email) IN (
      'dmalcaruiz@gmail.com',
      'turuta.ai.tools@gmail.com',
      'feraligatr9000@gmail.com'
    )
  LOOP
    IF _f.org_id IS NOT NULL THEN
      INSERT INTO public.org_members (user_id, org_id, source)
      VALUES (_f.id, _f.org_id, 'domain')
      ON CONFLICT (user_id) DO UPDATE SET org_id = EXCLUDED.org_id;
      UPDATE public.profiles SET org_id = _f.org_id WHERE id = _f.id;
    END IF;
    -- apply_roster_role conserva el rol de administrador a propósito: sin eso,
    -- meter la cuenta de admin en la lista de alumnos le cerraría /demos y
    -- /instituciones.
    PERFORM public.apply_roster_role(_f.id, _f.role);
  END LOOP;
END $$;