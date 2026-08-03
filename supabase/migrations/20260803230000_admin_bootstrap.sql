-- Conceder el rol de administrador sin depender del orden de los registros.
--
-- Las migraciones anteriores hacían un INSERT ... SELECT contra auth.users. Eso
-- sólo funciona si la cuenta YA existía al aplicarse: si se crea después, la
-- migración ya pasó y no vuelve a ejecutarse, así que el usuario se queda sin
-- rol y el panel rechaza todo con "violates row-level security policy".
--
-- Aquí se arregla en los dos sentidos: se concede a quien ya exista, y se deja
-- un disparador para quien se registre más adelante.

-- Quién debe ser administrador. Para añadir a alguien, basta con una fila más.
CREATE TABLE IF NOT EXISTS public.admin_emails (
  email text PRIMARY KEY
);
ALTER TABLE public.admin_emails ENABLE ROW LEVEL SECURITY;
-- Sin políticas: nadie llega a esta tabla desde la API. Sólo la usan las
-- funciones SECURITY DEFINER de abajo y el rol de servicio.
GRANT ALL ON public.admin_emails TO service_role;

INSERT INTO public.admin_emails (email)
VALUES (lower('turuta.ai.tools@gmail.com'))
ON CONFLICT (email) DO NOTHING;

-- 1) Los que ya están registrados.
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'::public.app_role
FROM auth.users u
JOIN public.admin_emails a ON lower(u.email) = a.email
ON CONFLICT (user_id, role) DO NOTHING;

-- 2) Los que se registren a partir de ahora.
CREATE OR REPLACE FUNCTION public.grant_admin_on_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.admin_emails WHERE email = lower(NEW.email)) THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin'::public.app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.grant_admin_on_signup() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS grant_admin_on_signup ON auth.users;
CREATE TRIGGER grant_admin_on_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.grant_admin_on_signup();
