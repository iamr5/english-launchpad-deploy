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
    e: "/demo-assets/clock.svg",
    t: "15 minutos al día",
    d: "Microlecciones pensadas para agendas de ingeniero: entras, practicas y sigues con tu día.",
  },
  {
    e: "/demo-assets/settings.svg",
    t: "Inglés técnico de verdad",
    d: "Vocabulario de matemáticas, programación, construcción, energía y calidad, no frases de turista.",
  },
  {
    e: "/demo-assets/dart.svg",
    t: "Empiezas en tu nivel",
    d: "Un test de ubicación de 40 preguntas te coloca en A1, A2, B1, B2 o C1 desde el primer día.",
  },
  {
    e: "/demo-assets/stats.svg",
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

/** Versión oscurecida de un color hex, para el «labio» inferior de los botones. */
function darken(hex: string, amount = 0.22) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return "rgba(0,0,0,.28)";
  const n = parseInt(m[1]!, 16);
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) =>
    Math.max(0, Math.round(c * (1 - amount))),
  );
  return `rgb(${ch[0]},${ch[1]},${ch[2]})`;
}

function CipLanding() {
  const b = Route.useLoaderData();

  const vars = {
    "--cip": b.accent,
    "--cta": b.button,
    "--ctaLip": darken(b.button),
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
        Solo usamos tu correo para avisarte del inicio.
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
          <BotiFull />
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
              <img src={x.e} alt="" aria-hidden className="h-12 w-12" />

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

/**
 * El mismo quiz que ve el alumno en la app: barra segmentada arriba, pregunta a
 * la izquierda, pastillas de opción con hueco fijo para el icono, franja de
 * feedback de alto fijo y botón anclado abajo. Nada de esto cambia de tamaño al
 * responder: el alto de la tarjeta y de cada zona está reservado de antemano.
 */
const QUIZ_CSS = `
.qz { --ink:#3C3C3C; --muted:#8C8C8C; --line:#E5E5E5; --blue:#1CB0F6; --ok:#3FAA24;
  --okDark:#2E7D1A; --red:#F44336; }
.qz .q-top { display:flex; align-items:center; gap:10px; margin-bottom:16px; }
.qz .segs { display:flex; gap:5px; flex:1 1 auto; }
.qz .seg { flex:1; height:5px; border-radius:3px; background:var(--line); transition:background .3s; }
.qz .seg.done { background:var(--ok); }
.qz .seg.fail { background:var(--red); }
.qz .seg.now { background:#FF9600; }
.qz .q-counter { font-size:13px; font-weight:800; color:var(--muted); flex:0 0 auto; min-width:36px; text-align:right; }
.qz .q-kicker { font-size:12px; font-weight:800; letter-spacing:1px; color:var(--muted); text-transform:uppercase; margin:0 0 10px; }
.qz .q-question { font-size:23px; font-weight:800; text-align:left; color:var(--ink); line-height:1.3;
  margin:0 0 22px; min-height:60px; }
.qz .q-options { display:flex; flex-direction:column; gap:11px; }
.qz .opt { border:2px solid var(--line); background:#fff; border-radius:16px; color:var(--ink);
  padding:16px 18px; font-size:17px; font-weight:700; text-align:left; cursor:pointer; font-family:inherit;
  display:flex; align-items:center; justify-content:space-between; gap:10px; width:100%; }
.qz .opt:disabled { cursor:default; }
.qz .opt .opt-ic { flex:0 0 22px; width:22px; height:22px; display:flex; align-items:center; justify-content:center; }
.qz .opt.sel { border-color:var(--blue); background:color-mix(in srgb, var(--blue) 10%, transparent); }
.qz .opt.correct { background:color-mix(in srgb, var(--ok) 12%, transparent); border-color:var(--ok); color:var(--okDark); }

.qz .opt.wrong { background:rgba(244,67,54,.08); border-color:var(--red); color:#B3261E; }
.qz .fb-slot { min-height:64px; margin:14px 2px 2px; display:flex; align-items:flex-start; overflow:hidden; }
.qz .fb-line { font-size:15px; font-weight:700; line-height:1.4; text-align:left; }
.qz .fb-line strong { display:block; font-size:16px; font-weight:800; }
.qz .fb-line.ok strong { color:var(--okDark); }
.qz .fb-line.no strong { color:#B3261E; }
.qz .btn { width:100%; border:none; border-radius:18px; padding:14px; font-family:inherit; font-size:18px;
  font-weight:700; color:#fff; cursor:pointer; min-height:52px; margin-top:auto; background:var(--ok); --lip:var(--okDark);
  transition:transform .12s ease, box-shadow .12s ease; }
.qz .btn:disabled { opacity:.45; cursor:default; box-shadow:none; }
.qz .btn:not(:disabled) { box-shadow:0 4px 0 var(--lip), 0 6px 14px rgba(0,0,0,.16); }
.qz .btn:not(:disabled):active { transform:translateY(2px); box-shadow:0 2px 0 var(--lip), 0 3px 8px rgba(0,0,0,.14); }
`;

function SampleQuiz() {
  const [i, setI] = useState(0);
  const [sel, setSel] = useState<number | null>(null);
  const [picked, setPicked] = useState<number | null>(null);
  const [marks, setMarks] = useState<("done" | "fail")[]>([]);
  const q = SAMPLE[i]!;
  const done = picked !== null;
  const right = picked === q.ok;
  const last = i === SAMPLE.length - 1;

  function choose(k: number) {
    if (done) return;
    setSel(k);
  }

  function confirm() {
    if (sel === null) return;
    setPicked(sel);
    setMarks((m) => [...m, sel === q.ok ? "done" : "fail"]);
  }

  function next() {
    if (last) {
      document.getElementById("curso")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    setI(i + 1);
    setPicked(null);
    setSel(null);
  }



  return (
    <section className="bg-slate-50 px-5 py-14">
      <style dangerouslySetInnerHTML={{ __html: QUIZ_CSS }} />
      <div className="mx-auto max-w-2xl">
        <h2 className="text-center text-3xl font-black">Pruébalo ahora mismo</h2>
        <p className="mt-2 text-center text-slate-600">
          Tres ejercicios reales del curso. Así se siente cada día.
        </p>

        {/* Alto fijo: la tarjeta no crece ni encoge al responder o avanzar. */}
        <div className="qz mt-7 flex h-[620px] flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-lg sm:h-[600px]">
          <div className="q-top">
            <div className="segs">
              {SAMPLE.map((_, k) => (
                <div
                  key={k}
                  className={`seg ${marks[k] ?? (k === i ? "now" : "")}`}
                />
              ))}
            </div>
            <div className="q-counter">
              {i + 1}/{SAMPLE.length}
            </div>
          </div>

          <p className="q-kicker">Elige la opción correcta</p>
          <p className="q-question">{q.q}</p>

          <div className="q-options">
            {q.opts.map((o, k) => (
              <button
                key={o}
                type="button"
                disabled={done}
                onClick={() => choose(k)}
                className={`opt ${
                  done && k === q.ok
                    ? "correct"
                    : done && k === picked
                      ? "wrong"
                      : !done && k === sel
                        ? "sel"
                        : ""
                }`}
              >
                <span>{o}</span>
                <span className="opt-ic">
                  {done && k === q.ok ? "✓" : done && k === picked ? "✕" : ""}
                </span>
              </button>
            ))}
          </div>

          <div className="fb-slot">
            {done && (
              <p className={`fb-line ${right ? "ok" : "no"}`}>
                <strong>{right ? "¡Correcto!" : "Casi."}</strong>
                {q.tip}
              </p>
            )}
          </div>

          <button
            type="button"
            className="btn"
            disabled={!done && sel === null}
            onClick={done ? next : confirm}
          >
            {!done
              ? sel === null
                ? "Elige una opción"
                : "Confirmar"
              : last
                ? "Y así hay 8.127 ejercicios más"
                : "Siguiente ejercicio"}

          </button>
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
    <section id="curso" className="px-5 py-14">
      <div className="mx-auto max-w-5xl text-center">
        <h2 className="text-3xl font-black">Este es el curso, sin maquetas</h2>
        <p className="mt-2 text-slate-600">
          La app real del Colegio de Ingenieros. Toca y recórrela.
        </p>
        {/* El demo se pinta al 111,11 % del marco y se reduce a 0,9 para que,
            una vez escalado, ocupe exactamente el hueco interior sin recortes
            ni franjas blancas. Usamos porcentajes para que se adapte al ancho. */}
        <div ref={ref} className="mx-auto mt-8 w-full max-w-[390px]">
          <div className="relative h-[720px] overflow-hidden rounded-[2rem] border-8 border-slate-900 bg-[#f4f4f6] shadow-2xl">
            {on ? (
              <iframe
                src="/democip"
                title="Demo del curso del CIP"
                className="block h-[111.111%] w-[111.111%] border-0"
                loading="lazy"
                style={{
                  transform: "scale(0.9)",
                  transformOrigin: "top left",
                }}
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-slate-100 text-slate-400">
                Cargando demo…
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ mascota entera */

/** Boti completo (cuerpo, brazos, piernas) con su animación real, no el icono. */
function BotiFull() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let live = true;
    const SRC = "/demo-assets/mascots/boti/boti.js";

    function mount() {
      const w = window as unknown as { Boti?: { mount: (el: Element, o?: object) => void } };
      if (!live || !ref.current || !w.Boti) return;
      w.Boti.mount(ref.current, { shadow: true, track: true, interactive: true });
    }

    if ((window as unknown as { Boti?: unknown }).Boti) {
      mount();
      return () => {
        live = false;
      };
    }

    let s = document.querySelector<HTMLScriptElement>(`script[src="${SRC}"]`);
    if (!s) {
      s = document.createElement("script");
      s.src = SRC;
      s.async = true;
      document.head.appendChild(s);
    }
    s.addEventListener("load", mount);
    return () => {
      live = false;
      s?.removeEventListener("load", mount);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-label="Boti, la mascota del programa"
      className="relative w-[260px] drop-shadow-2xl"
      style={{ aspectRatio: "757.6 / 1139.5" }}
    />
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
