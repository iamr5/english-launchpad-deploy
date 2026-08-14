import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Los correos recogidos por el landing de preinscripción (/cip). Sólo lo puede
// leer una cuenta administradora: lo comprueba RLS, no este componente.

type Row = { id: string; email: string; slug: string; created_at: string; utm: Record<string, unknown> | null };

export function PreinscripcionesPanel() {
  const [filtro, setFiltro] = useState("");

  const q = useQuery({
    queryKey: ["preinscripciones"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("preinscripciones")
        .select("id, email, slug, created_at, utm")
        .order("created_at", { ascending: false })
        .limit(5000);
      if (error) throw error;
      return (data ?? []) as Row[];
    },
  });

  const rows = useMemo(() => {
    const all = q.data ?? [];
    const f = filtro.trim().toLowerCase();
    return f ? all.filter((r) => r.email.includes(f) || r.slug.includes(f)) : all;
  }, [q.data, filtro]);

  const hoy = useMemo(() => {
    const d = new Date().toDateString();
    return (q.data ?? []).filter((r) => new Date(r.created_at).toDateString() === d).length;
  }, [q.data]);

  function csv() {
    const head = "correo,demo,fecha,origen\n";
    const body = rows
      .map((r) => {
        const origen = (r.utm as Record<string, string> | null)?.["origen"] ?? "";
        return [r.email, r.slug, new Date(r.created_at).toISOString(), origen]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(",");
      })
      .join("\n");
    const url = URL.createObjectURL(new Blob([head + body], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `preinscripciones-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat n={String(q.data?.length ?? 0)} l="Correos totales" />
        <Stat n={String(hoy)} l="Hoy" />
        <Stat n={String(new Set((q.data ?? []).map((r) => r.slug)).size)} l="Landings activos" />
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Filtrar por correo o demo…"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
        <Button variant="outline" onClick={() => q.refetch()}>
          Actualizar
        </Button>
        <Button onClick={csv} disabled={!rows.length}>
          Descargar CSV
        </Button>
      </div>

      {q.isLoading && <p className="text-sm text-muted-foreground">Cargando…</p>}
      {q.error && (
        <p className="text-sm text-destructive">
          No se pudo leer la lista: {(q.error as Error).message}
        </p>
      )}
      {!q.isLoading && !rows.length && (
        <p className="text-sm text-muted-foreground">Todavía no hay preinscripciones.</p>
      )}

      {!!rows.length && (
        <div className="max-h-[420px] overflow-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-muted">
              <tr>
                <th className="p-2 text-left font-medium">Correo</th>
                <th className="p-2 text-left font-medium">Demo</th>
                <th className="p-2 text-left font-medium">Origen</th>
                <th className="p-2 text-left font-medium">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="p-2">{r.email}</td>
                  <td className="p-2">{r.slug}</td>
                  <td className="p-2 text-muted-foreground">
                    {(r.utm as Record<string, string> | null)?.["origen"] ?? "—"}
                  </td>
                  <td className="p-2 text-muted-foreground">
                    {new Date(r.created_at).toLocaleString("es-PE")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div className="rounded-lg border p-3">
      <div className="text-2xl font-bold">{n}</div>
      <div className="text-xs text-muted-foreground">{l}</div>
    </div>
  );
}
