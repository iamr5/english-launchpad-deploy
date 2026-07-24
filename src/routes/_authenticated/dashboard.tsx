import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getMyProfile, getLinkedStudents } from "@/lib/progress.functions";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Panel — Aprendo English" },
      { name: "description", content: "Panel para familias y profesores: seguimiento de alumnos vinculados." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const navigate = useNavigate();
  const router = useRouter();
  const profileFn = useServerFn(getMyProfile);
  const studentsFn = useServerFn(getLinkedStudents);
  const profile = useQuery({ queryKey: ["me", "profile"], queryFn: () => profileFn() });
  const students = useQuery({ queryKey: ["me", "linked-students"], queryFn: () => studentsFn() });

  useEffect(() => {
    if (profile.data && profile.data.roles.includes("student") && !profile.data.roles.some(r => r === "parent" || r === "teacher")) {
      navigate({ to: "/app", replace: true });
    }
  }, [profile.data, navigate]);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.invalidate();
    navigate({ to: "/login", replace: true });
  };

  const roleLabel = profile.data?.roles.includes("teacher") ? "Profesor" : "Familia";

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/head.png" alt="" className="w-8 h-8 rounded-full" />
            <span className="font-semibold">Aprendo English</span>
            <span className="ml-2 text-xs px-2 py-0.5 bg-slate-100 rounded">{roleLabel}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-slate-600">{profile.data?.profile?.name}</span>
            <button onClick={signOut} className="text-slate-500 hover:text-slate-900">Salir</button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold">Alumnos vinculados</h1>

        {students.isLoading ? (
          <p className="text-slate-500">Cargando...</p>
        ) : students.data?.students.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center shadow-sm">
            <p className="text-slate-600">Aún no tienes alumnos vinculados.</p>
            <p className="text-sm text-slate-400 mt-2">Próximamente: invitar alumnos por email.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.data?.students.map((s) => {
              const prof = s.profiles as { id: string; name: string | null; level: number; daily_goal: number } | null;
              const prog = s.progress as { xp: number; level: number; streak_days: unknown[] } | null;
              const streak = Array.isArray(prog?.streak_days) ? prog!.streak_days.length : 0;
              return (
                <div key={s.student_id} className="bg-white rounded-xl p-5 shadow-sm">
                  <h3 className="font-semibold">{prof?.name ?? "Alumno"}</h3>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                    <div><div className="text-xs text-slate-500">XP</div><div className="font-bold">{prog?.xp ?? 0}</div></div>
                    <div><div className="text-xs text-slate-500">Nivel</div><div className="font-bold">{prog?.level ?? 1}</div></div>
                    <div><div className="text-xs text-slate-500">Racha</div><div className="font-bold">{streak}</div></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
