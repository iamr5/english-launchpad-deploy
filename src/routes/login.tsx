import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Iniciar sesión — Aprendo English" },
      { name: "description", content: "Accede a tu cuenta de Aprendo English como Alumno, Familia o Profesor." },
      { property: "og:title", content: "Iniciar sesión — Aprendo English" },
      { property: "og:description", content: "Accede a tu cuenta de Aprendo English." },
    ],
  }),
  component: LoginPage,
});

type Role = "student" | "parent" | "teacher";

async function routeByRole(userId: string, navigate: ReturnType<typeof useNavigate>) {
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId).limit(1).maybeSingle();
  const role = (data?.role as Role | undefined) ?? "student";
  navigate({ to: role === "student" ? "/app" : "/dashboard", replace: true });
}

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<Role>("student");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) routeByRole(data.session.user.id, navigate);
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { role, name },
          },
        });
        if (error) throw error;
        if (data.session) await routeByRole(data.session.user.id, navigate);
        else setErr("Revisa tu email para confirmar la cuenta.");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        await routeByRole(data.user.id, navigate);
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  };

  const google = async () => {
    setErr(null);
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/login" });
    if (r.error) setErr(r.error instanceof Error ? r.error.message : String(r.error));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-6">
          <img src="/head.png" alt="Aprendo English" className="w-16 h-16 mx-auto" />
          <h1 className="text-2xl font-bold mt-3">Aprendo English</h1>
          <p className="text-sm text-slate-500">{mode === "signin" ? "Inicia sesión" : "Crea tu cuenta"}</p>
        </div>

        <div className="flex bg-slate-100 rounded-lg p-1 mb-5">
          <button
            className={`flex-1 py-2 text-sm rounded-md ${mode === "signin" ? "bg-white shadow font-medium" : "text-slate-500"}`}
            onClick={() => setMode("signin")}
            type="button"
          >
            Entrar
          </button>
          <button
            className={`flex-1 py-2 text-sm rounded-md ${mode === "signup" ? "bg-white shadow font-medium" : "text-slate-500"}`}
            onClick={() => setMode("signup")}
            type="button"
          >
            Registrarse
          </button>
        </div>

        <form onSubmit={submit} className="space-y-3">
          {mode === "signup" && (
            <>
              <input
                type="text"
                placeholder="Nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
              <div>
                <label className="text-xs text-slate-500 font-medium">Soy...</label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {(["student", "parent", "teacher"] as Role[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`py-2 text-sm rounded-lg border-2 ${role === r ? "border-blue-500 bg-blue-50 font-medium" : "border-slate-200"}`}
                    >
                      {r === "student" ? "Alumno" : r === "parent" ? "Familia" : "Profesor"}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            required
            minLength={6}
          />
          {err && <p className="text-sm text-red-600">{err}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "..." : mode === "signin" ? "Entrar" : "Crear cuenta"}
          </button>
        </form>

        <div className="my-4 flex items-center gap-2 text-xs text-slate-400">
          <div className="flex-1 border-t" />o<div className="flex-1 border-t" />
        </div>

        <button
          onClick={google}
          type="button"
          className="w-full py-2.5 border rounded-lg font-medium hover:bg-slate-50 flex items-center justify-center gap-2"
        >
          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Continuar con Google
        </button>

        <div className="mt-6 pt-4 border-t border-dashed border-slate-300">
          <p className="text-[10px] uppercase tracking-wider text-slate-400 text-center mb-2">Debug — fake login (sin backend)</p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => { localStorage.setItem("fake_login", "1"); localStorage.setItem("fake_role", "student"); navigate({ to: "/app", replace: true }); }}
              className="py-2 text-xs rounded-lg bg-amber-100 text-amber-900 font-medium hover:bg-amber-200"
            >
              Alumno → /app
            </button>
            <button
              type="button"
              onClick={() => { localStorage.setItem("fake_login", "1"); localStorage.setItem("fake_role", "parent"); navigate({ to: "/dashboard", replace: true }); }}
              className="py-2 text-xs rounded-lg bg-amber-100 text-amber-900 font-medium hover:bg-amber-200"
            >
              Familia → /dashboard
            </button>
            <button
              type="button"
              onClick={() => { localStorage.setItem("fake_login", "1"); localStorage.setItem("fake_role", "teacher"); navigate({ to: "/dashboard", replace: true }); }}
              className="py-2 text-xs rounded-lg bg-amber-100 text-amber-900 font-medium hover:bg-amber-200"
            >
              Profesor → /dashboard
            </button>
          </div>
          <button
            type="button"
            onClick={() => { localStorage.removeItem("fake_login"); localStorage.removeItem("fake_role"); }}
            className="w-full mt-2 py-1.5 text-[11px] text-slate-500 hover:text-slate-700"
          >
            Limpiar fake login
          </button>
        </div>
      </div>
    </div>
  );
}
