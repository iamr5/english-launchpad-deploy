import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { TutorConsole } from "@/components/tutor/TutorConsole";
import { getTutorPass } from "@/lib/tutor/tutor.functions";
import { BANDS, type Band, type TurnMode } from "@/lib/tutor/cefr";

// /asistente-interaccion — el prototipo del tutor conversacional.

function esBanda(v: unknown): v is Band {
  return typeof v === "string" && (BANDS as readonly string[]).includes(v);
}

function esModo(v: unknown): v is TurnMode {
  return v === "auto" || v === "manual";
}

type Busqueda = { nivel?: Band; packs?: string; mic?: "near" | "far"; modo?: TurnMode };

export const Route = createFileRoute("/asistente-interaccion")({
  validateSearch: (search: Record<string, unknown>): Busqueda => ({
    nivel: esBanda(search["nivel"]) ? search["nivel"] : undefined,
    packs: typeof search["packs"] === "string" ? search["packs"].slice(0, 120) : undefined,
    mic: search["mic"] === "near" ? "near" : search["mic"] === "far" ? "far" : undefined,
    modo: esModo(search["modo"]) ? search["modo"] : undefined,
  }),
  head: () => ({
    meta: [{ title: "Asistente de conversación" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: AsistentePage,
});

function AsistentePage() {
  const { nivel, packs, mic, modo } = Route.useSearch();
  const passFn = useServerFn(getTutorPass);

  const pass = useQuery({
    queryKey: ["tutor", "pass"],
    queryFn: () => passFn(),
    staleTime: 20 * 60 * 1000,
    retry: 1,
  });

  if (pass.isPending) return <Aviso>Preparando la sesión…</Aviso>;
  if (pass.isError || !pass.data)
    return <Aviso>No se pudo preparar la sesión. Recarga la página.</Aviso>;

  if (!pass.data.ready) {
    return (
      <Aviso>
        Falta configurar <code className="font-mono">OPENAI_API_KEY</code> en el entorno del
        servidor. El asistente no puede abrir sesiones sin ella.
      </Aviso>
    );
  }

  return (
    <TutorConsole
      token={pass.data.token}
      bandaInicial={nivel}
      mic={mic}
      modoInicial={modo}
      packs={
        packs
          ? packs
              .split(",")
              .map((p) => p.trim())
              .filter(Boolean)
              .slice(0, 4)
          : undefined
      }
    />
  );
}

function Aviso({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <p className="max-w-md text-center text-sm text-muted-foreground">{children}</p>
    </div>
  );
}
