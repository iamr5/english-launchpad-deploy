import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getMyAppShell } from "@/lib/org.functions";

// La app del alumno. El contenido va en un <iframe> —así ha estado siempre— y
// lo que cambia aquí es de dónde sale esa página: antes era el archivo estático
// /app/index.html, igual para todo el mundo; ahora es /api/app-shell, que la
// pinta con la marca de la institución de quien entra.
//
// El rodeo del pase (getMyAppShell → token → ?t=) es porque un <iframe src> no
// lleva cabecera Authorization y la sesión de Supabase vive en localStorage.
// Ver src/lib/app-token.ts.

export const Route = createFileRoute("/_authenticated/app")({
  head: () => ({
    meta: [
      { title: "Mi progreso — Aprendo English" },
      { name: "description", content: "Panel del alumno: XP, nivel y racha diaria." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: StudentApp,
});

function StudentApp() {
  const navigate = useNavigate();
  const shellFn = useServerFn(getMyAppShell);
  const shell = useQuery({
    queryKey: ["me", "app-shell"],
    queryFn: () => shellFn(),
    // El pase dura 10 minutos y sólo sirve para cargar la página. Se vuelve a
    // pedir al remontar; no hace falta refrescarlo en segundo plano.
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

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

  // Mientras se resuelve la institución no se pinta un iframe a medias: se
  // dejaría ver la app sin marca y saltaría a la suya un instante después.
  if (shell.isLoading) return <Cargando />;

  // Si el pase no llega —la red, la sesión— se cae a la app estática. Peor
  // aspecto, pero el alumno entra en su curso, que es lo que importa.
  const src =
    shell.isError || !shell.data?.token
      ? "/app/index.html"
      : `/api/app-shell?t=${encodeURIComponent(shell.data.token)}`;

  return (
    <iframe
      src={src}
      title="Aprendo English App"
      style={{ border: 0, position: "fixed", inset: 0, width: "100%", height: "100%" }}
    />
  );
}

/**
 * El hueco mientras se resuelve la institución. Va en gris neutro a propósito:
 * es lo único de este recorrido que NO puede llevar la marca —todavía no se
 * sabe cuál es—, así que se pinta lo más callado posible y la bienvenida de la
 * institución, que sí la lleva, entra justo después.
 */
function Cargando() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#F4F4F6",
      }}
    >
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: "50%",
          border: "3px solid #E0E0E6",
          borderTopColor: "#9A9AA5",
          animation: "spin .8s linear infinite",
        }}
      />
      <style>{"@keyframes spin{to{transform:rotate(360deg)}}"}</style>
    </div>
  );
}
