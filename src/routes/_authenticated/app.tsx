import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/app")({
  head: () => ({
    meta: [
      { title: "Mi progreso — Aprendo English" },
      { name: "description", content: "Panel del alumno: XP, nivel y racha diaria." },
    ],
  }),
  component: StudentApp,
});

function StudentApp() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.data?.type === "logout") {
        await supabase.auth.signOut();
        navigate({ to: "/login", replace: true });
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [navigate]);

  return (
    <iframe
      src="/app/index.html"
      title="Aprendo English App"
      style={{ border: 0, position: "fixed", inset: 0, width: "100%", height: "100%" }}
    />
  );
}
