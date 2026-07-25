import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    // DEBUG: fake login bypass (client-side only, for testing UI)
    if (typeof window !== "undefined" && localStorage.getItem("fake_login") === "1") {
      return { user: null, fake: true, fakeRole: localStorage.getItem("fake_role") ?? "student" };
    }
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/login" });
    return { user: data.user, fake: false };
  },
  component: () => <Outlet />,
});
