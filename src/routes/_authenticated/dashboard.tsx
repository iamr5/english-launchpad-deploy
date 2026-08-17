import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { getMyProfile } from "@/lib/progress.functions";
import { getMyDashboardShell } from "@/lib/org.functions";

// El panel de familias y profesores. Mismo cambio que /app: la página ya no es
// el archivo estático /dashboard/index.html sino /api/dashboard-shell, que la
// pinta con la marca de la institución de quien entra.
//
// La vista (familia o profesor) la decide el SERVIDOR a partir de los roles y
// viaja firmada dentro del pase. Antes iba en la URL del iframe (?role=…), de
// modo que una familia podía pedir el reporte de aula cambiando el parámetro.

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Panel — Aprendo English" },
      { name: "description", content: "Panel para familias y profesores." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const navigate = useNavigate();
  const profileFn = useServerFn(getMyProfile);
  const profile = useQuery({ queryKey: ["me", "profile"], queryFn: () => profileFn() });

  const shellFn = useServerFn(getMyDashboardShell);
  const shell = useQuery({
    queryKey: ["me", "dashboard-shell"],
    queryFn: () => shellFn(),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const roles = profile.data?.roles ?? [];
  const isStudentOnly =
    roles.includes("student") && !roles.includes("parent") && !roles.includes("teacher");
  const canView = roles.includes("parent") || roles.includes("teacher");

  useEffect(() => {
    if (profile.data && isStudentOnly) {
      navigate({ to: "/app", replace: true });
    }
  }, [profile.data, isStudentOnly, navigate]);

  if (profile.isLoading || isStudentOnly || !canView) return null;

  const role = roles.includes("teacher") ? "teacher" : "parent";

  if (shell.isLoading) return null;

  // Respaldo al panel estático si el pase no llega: se ve sin marca, pero se ve.
  const src =
    shell.isError || !shell.data?.token
      ? `/dashboard/index.html?role=${role}`
      : `/api/dashboard-shell?t=${encodeURIComponent(shell.data.token)}`;

  return (
    <iframe
      src={src}
      title="Aprendo English Dashboard"
      style={{ border: 0, position: "fixed", inset: 0, width: "100%", height: "100%" }}
    />
  );
}
