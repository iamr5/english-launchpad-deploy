import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { getCipBrand } from "@/lib/cip-landing.functions";

// Landing de preinscripción para el Colegio de Ingenieros. Pide sólo el correo.
// La marca sale del demo /democip (configurable en /demos).

export const Route = createFileRoute("/cip")({
  loader: () => getCipBrand(),
  head: () => ({
    meta: [
      { title: "Inglés para ingenieros del Perú · Preinscripción CIP" },
      {
        name: "description",
        content:
          "Preinscríbete al programa de inglés del Colegio de Ingenieros: 45 microlecciones A1–C1, 8.127 ejercicios y vocabulario técnico de ingeniería. Solo tu correo.",
      },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Inglés para ingenieros del Perú · Preinscripción CIP" },
      {
        property: "og:description",
        content:
          "45 microlecciones A1–C1, 8.127 ejercicios y 779 términos técnicos de ingeniería. Deja tu correo y asegura tu cupo.",
      },
      { property: "og:image", content: "https://aprendoenglish.com/social-preview.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Inglés para ingenieros del Perú · Preinscripción CIP" },
      {
        name: "twitter:description",
        content: "45 microlecciones A1–C1, 8.127 ejercicios y vocabulario técnico. Solo tu correo.",
      },
      { name: "twitter:image", content: "https://aprendoenglish.com/social-preview.jpg" },
    ],
    links: [{ rel: "icon", href: "/head.png", type: "image/png" }],
  }),
  component: CipLanding,
});

const METRICS = [
  { n: "45", l: "microlecciones A1 → C1" },
  { n: "8.127", l: "ejercicios de práctica" },
  { n: "11.040", l: "palabras de vocabulario" },
  { n: "779", l: "términos de ingeniería" },
];

const BENEFITS = [
  {
    e: "⏱️",
    t: "15 minutos al día",
    d: "Microlecciones pensadas para agendas de ingeniero: entras, practicas y sigues con tu día.",
  },
  {
    e: "⚙️",
    t: "Inglés técnico de verdad",
    d: "Vocabulario de matemáticas, programación, construcción, energía y calidad, no frases de turista.",
  },
  {
    e: "🎯",
    t: "Empiezas en tu nivel",
    d: "Un test de ubicación de 40 preguntas te coloca en A1, A2, B1, B2 o C1 desde el primer día.",
  },
  {
    e: "📊",
    t: "Progreso medible",
    d: "Racha, XP y niveles. Tú y el Colegio ven el avance real, no la asistencia.",
  },
];

type Quiz = {
  q: string;
  opts: string[];
  ok: number;
  tip: string;
};

const SAMPLE: Quiz[] = [
  {
    q: "The bridge ___ designed to resist earthquakes.",
    opts: ["was", "were", "is being were", "been"],
    ok: 0,
    tip: "Pasiva en pasado: was/were + participio. «Bridge» es singular → was designed.",
  },
  {
    q: "¿Cómo dirías «plazo de entrega» en un informe técnico?",
    opts: ["deadline", "dateline", "time limit out", "delay"],
    ok: 0,
    tip: "«Deadline» es el término estándar en gestión de proyectos.",
  },
  {
    q: "If we ___ the load, the structure would fail.",
    opts: ["increase", "increased", "will increase", "increasing"],
    ok: 1,
    tip: "Segundo condicional: if + pasado simple, would + verbo.",
  },
];

function CipLanding() {
  const b = Route.useLoaderData();

  const vars = {
    "--cip": b.accent,
    "--cta": b.button,
    "--hi": b.highlight,
  } as React.CSSProperties;

  return (
    <main
      style={vars}
      className="min-h-screen bg-white text-slate-900 [font-family:system-ui,-apple-system,'Segoe_UI',sans-serif]"
    >
      <Hero brand={b} />
      <Metrics />
      <Benefits />
      <SampleQuiz />
      <LiveDemo />
      <FinalCta brand={b} />
      <footer className="border-t border-slate-200 px-5 py-8 text-center text-xs text-slate-500">
        AprendoEnglish × {b.institution} · Programa de inglés para colegiados
      </footer>
    </main>
  );
}

/* ---------------------------------------------------------------- formulario */

function EmailForm({ id, cta }: { id: string; cta: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "sending" || state === "done") return;
    setState("sending");
    const utm: Record<string, string> = { origen: id };
    try {
      new URLSearchParams(window.location.search).forEach((v, k) => {
        if (k.startsWith("utm_")) utm[k] = v;
      });
    } catch {
      /* sin utm */
    }
    try {
      const res = await fetch("/api/public/preinscripcion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, slug: "cip", utm }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="rounded-2xl border-2 border-emerald-500 bg-emerald-50 px-5 py-4 text-emerald-800">
        <strong className="block text-lg">¡Listo, estás preinscrito! 🎉</strong>
        <span className="text-sm">Te escribiremos a {email} cuando se abra tu cupo.</span>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="w-full">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tucorreo@ejemplo.com"
          aria-label="Tu correo electrónico"
          className="min-w-0 flex-1 rounded-xl border-2 border-slate-300 px-4 py-3.5 text-base outline-none focus:border-[var(--hi)]"
        />
        <button
          type="submit"
          disabled={state === "sending"}
          className="rounded-xl px-6 py-3.5 text-base font-bold text-white shadow-lg transition active:scale-[.98] disabled:opacity-60"
          style={{ background: "var(--cta)" }}
        >
          {state === "sending" ? "Enviando…" : cta}
        </button>
      </div>
      <p className="mt-2 text-xs text-slate-500">
        Sin costo ni compromiso. Solo usamos tu correo para avisarte del inicio.
      </p>
      {state === "error" && (
        <p className="mt-2 text-sm font-semibold text-red-600">
          No pudimos registrarte. Revisa el correo e inténtalo otra vez.
        </p>
      )}
    </form>
  );
}

/* --------------------------------------------------------------------- hero */

function Hero({ brand }: { brand: { logo: string; icon: string; phrase: string } }) {
  return (
    <section
      className="relative overflow-hidden px-5 pb-14 pt-10 text-white"
      style={{ background: `linear-gradient(160deg, var(--cip), #7a0f0c)` }}
    >
      <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-[1.1fr_.9fr]">
        <div>
          {brand.logo ? (
            <img src={brand.logo} alt="Colegio de Ingenieros del Perú" className="mb-6 h-16 w-auto object-contain" />
          ) : null}
          <p className="mb-3 inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-bold tracking-wide">
            PREINSCRIPCIÓN ABIERTA · CUPOS LIMITADOS
          </p>
          <h1 className="text-4xl font-black leading-tight sm:text-5xl">
            Habla inglés en 1 año, <span className="opacity-90">15 minutos al día</span>
          </h1>
          <p className="mt-4 max-w-xl text-lg text-white/90">{brand.phrase}</p>
          <div className="mt-7 max-w-xl rounded-2xl bg-white p-4 text-slate-900 shadow-2xl">
            <EmailForm id="hero" cta="Quiero mi cupo" />
          </div>
        </div>
        <div className="hidden justify-center md:flex">
          <img
            src="/demo-assets/mascots/boti/boti_head.svg"
            alt="Boti, la mascota del programa"
            className="w-56 drop-shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ métricas */

function Metrics() {
  return (
    <section className="border-b border-slate-200 bg-slate-50 px-5 py-8">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 md:grid-cols-4">
        {METRICS.map((m) => (
          <div key={m.l} className="text-center">
            <div className="text-3xl font-black" style={{ color: "var(--cip)" }}>
              {m.n}
            </div>
            <div className="text-xs font-medium text-slate-600">{m.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Benefits() {
  return (
    <section className="px-5 py-14">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-3xl font-black">Un curso hecho para ingenieros</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {BENEFITS.map((x) => (
            <div key={x.t} className="rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="text-3xl">{x.e}</div>
              <h3 className="mt-2 text-lg font-bold">{x.t}</h3>
              <p className="mt-1 text-sm text-slate-600">{x.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ quiz de muestra */

function SampleQuiz() {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const q = SAMPLE[i]!;

  return (
    <section className="bg-slate-50 px-5 py-14">
      <div className="mx-auto max-w-2xl">
        <h2 className="text-center text-3xl font-black">Pruébalo ahora mismo</h2>
        <p className="mt-2 text-center text-slate-600">
          Tres ejercicios reales del curso. Así se siente cada día.
        </p>

        <div className="mt-7 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
          <div className="mb-3 text-xs font-bold text-slate-400">
            Ejercicio {i + 1} de {SAMPLE.length}
          </div>
          <p className="text-xl font-semibold">{q.q}</p>
          <div className="mt-4 grid gap-2">
            {q.opts.map((o, k) => {
              const done = picked !== null;
              const good = k === q.ok;
              const bg = !done ? "" : good ? "#dcfce7" : k === picked ? "#fee2e2" : "";
              const bd = !done ? "#e2e8f0" : good ? "#16a34a" : k === picked ? "#dc2626" : "#e2e8f0";
              return (
                <button
                  key={o}
                  onClick={() => picked === null && setPicked(k)}
                  className="rounded-xl border-2 px-4 py-3 text-left font-medium transition"
                  style={{ background: bg, borderColor: bd }}
                >
                  {o}
                </button>
              );
            })}
          </div>

          {picked !== null && (
            <div className="mt-4 rounded-xl bg-slate-100 p-4 text-sm">
              <strong>{picked === q.ok ? "¡Correcto!" : "Casi."}</strong> {q.tip}
              {i < SAMPLE.length - 1 ? (
                <button
                  onClick={() => {
                    setI(i + 1);
                    setPicked(null);
                  }}
                  className="mt-3 block w-full rounded-xl py-3 font-bold text-white"
                  style={{ background: "var(--cta)" }}
                >
                  Siguiente ejercicio
                </button>
              ) : (
                <p className="mt-3 font-semibold">
                  Y así hay 8.127 más, con corrección al instante.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- demo vivo */

function LiveDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || on) return;
    const io = new IntersectionObserver(
      (es) => es.some((e) => e.isIntersecting) && setOn(true),
      { rootMargin: "120px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [on]);

  return (
    <section className="px-5 py-14">
      <div className="mx-auto max-w-5xl text-center">
        <h2 className="text-3xl font-black">Este es el curso, sin maquetas</h2>
        <p className="mt-2 text-slate-600">
          La app real del Colegio de Ingenieros. Toca y recórrela.
        </p>
        <div ref={ref} className="mx-auto mt-8 w-full max-w-[390px]">
          <div className="overflow-hidden rounded-[2rem] border-8 border-slate-900 shadow-2xl">
            {on ? (
              <iframe
                src="/democip"
                title="Demo del curso del CIP"
                className="block h-[720px] w-full border-0"
                loading="lazy"
              />
            ) : (
              <div className="flex h-[720px] items-center justify-center bg-slate-100 text-slate-400">
                Cargando demo…
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalCta({ brand }: { brand: { institution: string } }) {
  return (
    <section className="px-5 py-16 text-white" style={{ background: "var(--cip)" }}>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-black sm:text-4xl">Asegura tu cupo hoy</h2>
        <p className="mt-3 text-white/90">
          Deja tu correo y te avisamos apenas se abra la inscripción para colegiados del{" "}
          {brand.institution}.
        </p>
        <div className="mx-auto mt-7 max-w-xl rounded-2xl bg-white p-4 text-slate-900 shadow-2xl">
          <EmailForm id="final" cta="Preinscribirme" />
        </div>
      </div>
    </section>
  );
}
