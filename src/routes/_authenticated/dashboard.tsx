import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { getMyProfile } from "@/lib/progress.functions";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Panel — Aprendo English" },
      { name: "description", content: "Panel para familias y profesores." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const navigate = useNavigate();
  const profileFn = useServerFn(getMyProfile);
  const profile = useQuery({ queryKey: ["me", "profile"], queryFn: () => profileFn() });

  const roles = profile.data?.roles ?? [];
  const isStudentOnly = roles.includes("student") && !roles.includes("parent") && !roles.includes("teacher");
  const canView = roles.includes("parent") || roles.includes("teacher");

  useEffect(() => {
    if (profile.data && isStudentOnly) {
      navigate({ to: "/app", replace: true });
    }
  }, [profile.data, isStudentOnly, navigate]);

  if (profile.isLoading || isStudentOnly || !canView) return null;

  return (
    <iframe
      src="/dashboard/index.html"
      title="Aprendo English Dashboard"
      style={{ border: 0, position: "fixed", inset: 0, width: "100%", height: "100%" }}
    />
  );
}
