import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

// Todo lo que cuelga de aquí exige sesión.
//
// Aquí vivía un atajo de depuración: con localStorage.fake_login = "1" se
// entraba sin sesión, para poder ver la interfaz sin backend. Se ha quitado.
// No es que fuera muy peligroso —sin sesión de Supabase, RLS no devuelve un
// solo dato, así que la app se veía vacía—, pero era una puerta de servicio en
// producción que cualquiera podía abrir desde la consola del navegador. Y en
// una demo con un cliente delante, tres botones amarillos de «fake login» bajo
// el formulario no ayudan.
export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/login" });
    return { user: data.user };
  },
  component: () => <Outlet />,
});
