import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getMyProfile, getMyProgress } from "@/lib/progress.functions";

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
  const router = useRouter();
  const profileFn = useServerFn(getMyProfile);
  const progressFn = useServerFn(getMyProgress);
  const profile = useQuery({ queryKey: ["me", "profile"], queryFn: () => profileFn() });
  const progress = useQuery({ queryKey: ["me", "progress"], queryFn: () => progressFn() });

  useEffect(() => {
    if (profile.data && !profile.data.roles.includes("student")) {
      navigate({ to: "/dashboard", replace: true });
    }
  }, [profile.data, navigate]);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.invalidate();
    navigate({ to: "/login", replace: true });
  };

  if (profile.isLoading || progress.isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-slate-500">Cargando...</div>;
  }

  const p = progress.data?.progress;
  const streak = Array.isArray(p?.streak_days) ? (p!.streak_days as unknown[]).length : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/head.png" alt="" className="w-8 h-8 rounded-full" />
            <span className="font-semibold">Aprendo English</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-slate-600">Hola, {profile.data?.profile?.name ?? "alumno"}</span>
            <button onClick={signOut} className="text-slate-500 hover:text-slate-900">Salir</button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold">Mi progreso</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Stat label="XP" value={p?.xp ?? 0} accent="bg-yellow-100 text-yellow-800" />
          <Stat label="Nivel" value={p?.level ?? 1} accent="bg-blue-100 text-blue-800" />
          <Stat label="Racha (días)" value={streak} accent="bg-orange-100 text-orange-800" />
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold mb-2">Objetivo diario</h2>
          <p className="text-slate-600 text-sm">Meta: {profile.data?.profile?.daily_goal ?? 15} minutos al día.</p>
          <a
            href="/democip"
            className="mt-4 inline-block px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
          >
            Comenzar lección
          </a>
        </div>
      </main>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm">
      <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${accent}`}>{label}</div>
      <div className="text-4xl font-bold mt-2">{value}</div>
    </div>
  );
}
