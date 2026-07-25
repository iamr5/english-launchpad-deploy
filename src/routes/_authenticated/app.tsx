import { createFileRoute } from "@tanstack/react-router";

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
  return (
    <iframe
      src="/app/index.html"
      title="Aprendo English App"
      style={{ border: 0, position: "fixed", inset: 0, width: "100%", height: "100%" }}
    />
  );
}
