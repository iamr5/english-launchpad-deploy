import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { getCipBrand } from "@/lib/cip-landing.functions";

// Landing de preinscripción para el Colegio de Ingenieros. Pide sólo el correo.
// La marca sale del demo /democip (configurable en /demos).
//
// El aspecto sigue el sistema de las presentaciones y sílabos: papel crema,
// bandas navy con textura de puntos, Archivo / Archivo Black y acentos en
// cursiva serif. La carga pesada (demo real y mascota animada) es diferida.

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
    links: [
      { rel: "icon", href: "/head.png", type: "image/png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&family=Archivo+Black&family=Libre+Caslon+Text:ital,wght@0,400;1,400&display=swap",
      },
    ],
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
    e: "/demo-assets/ob-thunder.svg",
    t: "20 minutos al día",
    d: "Microlecciones pensadas para agendas de ingeniero: entras, practicas y sigues con tu día.",
  },
  {
    e: "/demo-assets/ob-words.svg",
    t: "Inglés técnico de verdad",
    d: "Vocabulario de matemáticas, programación, construcción, energía y calidad, no frases de turista.",
  },
  {
    e: "/demo-assets/ob-goal.svg",
    t: "Empiezas en tu nivel",
    d: "Un test de ubicación de 40 preguntas te coloca en A1, A2, B1, B2 o C1 desde el primer día.",
  },
  {
    e: "/demo-assets/streak.svg",
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

/* ------------------------------------------------------- sistema de estilos */

/** Tokens y componentes tomados del sílabo/presentaciones, tintados con la marca. */
const PAGE_CSS = `
.cipp{ --ink:#16233F; --ink-2:#22345A; --ink-0:#0c1225;
  --cream:#FBF3DD; --paper:#FEFBF4; --line:#e7dcc2; --muted:#5f6b82;
  --shadow:0 18px 50px -22px rgba(22,35,63,.35); --shadow-sm:0 8px 24px -14px rgba(22,35,63,.4);
  --disp:'Archivo',system-ui,sans-serif; --black:'Archivo Black','Archivo',system-ui,sans-serif;
  --serif:'Libre Caslon Text',Georgia,serif;
  font-family:var(--disp); color:var(--ink); background:var(--paper); line-height:1.55;
  -webkit-font-smoothing:antialiased; }
.cipp .sheet{ max-width:1080px; margin:0 auto; padding:0 clamp(20px,5vw,72px); }
.cipp .band{ position:relative; padding:clamp(46px,6.4vw,88px) 0; }
.cipp .band::before{ content:""; position:absolute; inset:0; pointer-events:none;
  background-image:radial-gradient(rgba(22,35,63,.05) 1.2px,transparent 1.3px);
  background-size:26px 26px; opacity:.45; }
.cipp .band>*{ position:relative; z-index:2; }
.cipp .bg-paper{ background:var(--paper); }
.cipp .bg-cream{ background:radial-gradient(900px 500px at 12% 110%,#fff,transparent 55%),var(--cream); }
.cipp .bg-hero{ color:#eef2fb;
  background:radial-gradient(1100px 700px at 74% 4%,color-mix(in srgb,var(--cip) 55%,transparent),transparent 62%),
             radial-gradient(800px 600px at 4% 110%,#1b2c52,transparent 58%),var(--ink-0); }
.cipp .bg-hero::before{ background-image:radial-gradient(rgba(255,255,255,.05) 1.2px,transparent 1.3px); opacity:.7; }
.cipp .bg-accent{ color:#fff;
  background:radial-gradient(800px 500px at 80% -20%,color-mix(in srgb,#fff 18%,transparent),transparent 60%),var(--cip); }
.cipp .bg-accent::before{ background-image:radial-gradient(rgba(255,255,255,.07) 1.2px,transparent 1.3px); opacity:.6; }

.cipp .eyebrow{ display:inline-flex; align-items:center; gap:10px; font:800 11.5px/1 var(--disp);
  letter-spacing:.24em; text-transform:uppercase; margin-bottom:18px; }
.cipp h1.title{ font-family:var(--black); font-weight:400; line-height:1; letter-spacing:-.03em;
  font-size:clamp(34px,6.2vw,68px); }
.cipp h1.title .acc{ font-family:var(--serif); font-style:italic; font-weight:400; letter-spacing:-.005em; }
.cipp h2.head{ font-family:var(--black); font-weight:400; line-height:1.06; letter-spacing:-.025em;
  font-size:clamp(25px,3.5vw,42px); }
.cipp .lede{ font-size:clamp(16px,1.7vw,19px); line-height:1.6; max-width:60ch; }
.cipp .card{ background:#fff; border:1px solid var(--line); border-radius:20px; box-shadow:var(--shadow-sm); }
.cipp .mini{ background:#fff; border:1px solid var(--line); border-radius:18px; padding:22px 22px 20px;
  box-shadow:var(--shadow-sm); }
.cipp .mini h3{ font-family:var(--disp); font-weight:800; font-size:17px; margin:12px 0 6px; line-height:1.2; }
.cipp .mini p{ font-size:14.6px; color:var(--ink-2); line-height:1.55; }
.cipp .metric b{ display:block; font-family:var(--black); font-weight:400; letter-spacing:-.03em;
  font-size:clamp(28px,3.6vw,40px); line-height:1; color:var(--cip); }
.cipp .metric span{ display:block; margin-top:8px; font-size:12.5px; font-weight:700; letter-spacing:.02em; color:var(--muted); }
.cipp .rule{ height:1px; background:var(--line); }
`;

function CipLanding() {
  const b = Route.useLoaderData();

  const vars = {
    "--cip": b.accent,
    "--cta": b.button,
    "--ctaLip": darken(b.button),
    "--hi": b.highlight,
  } as React.CSSProperties;

  return (
    <main style={vars} className="cipp min-h-screen">
      <style dangerouslySetInnerHTML={{ __html: PAGE_CSS + QUIZ_CSS }} />
      <Hero brand={b} />
      <Metrics />
      <Benefits />
      <SampleQuiz />
      <LiveDemo />
      <FinalCta brand={b} />
      <footer className="bg-paper band !py-8">
        <div className="sheet text-center text-xs font-semibold tracking-wide text-[var(--muted)]">
          AprendoEnglish × {b.institution} · Programa de inglés para colegiados
        </div>
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
          className="min-w-0 flex-1 rounded-xl border-2 border-[#e7dcc2] bg-white px-4 py-3.5 text-base text-[#16233F] outline-none focus:border-[var(--hi)]"
        />
        <button
          type="submit"
          disabled={state === "sending"}
          className="rounded-xl px-6 py-3.5 text-base font-extrabold text-white transition active:translate-y-[2px] disabled:opacity-60"
          style={{ background: "var(--cta)", boxShadow: "0 4px 0 var(--ctaLip)" }}
        >
          {state === "sending" ? "Enviando…" : cta}
        </button>
      </div>
      <p className="mt-2 text-xs font-medium text-[#5f6b82]">
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
    <section className="band bg-hero overflow-hidden">
      <div className="sheet grid items-center gap-10 md:grid-cols-[1.15fr_.85fr]">
        <div>
          {brand.logo ? (
            <img
              src={brand.logo}
              alt="Colegio de Ingenieros del Perú"
              width={220}
              height={64}
              className="mb-7 h-16 w-auto object-contain"
            />
          ) : null}
          <p className="eyebrow text-white/70">Preinscripción abierta · Cupos limitados</p>
          <h1 className="title">
            Habla inglés en 1 año,
            <br />
            <span className="acc">quince minutos al día</span>
          </h1>
          <p className="lede mt-5 text-white/85">{brand.phrase}</p>
          <div className="card mt-8 max-w-xl p-4" style={{ boxShadow: "var(--shadow)" }}>
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
    <section className="band bg-cream !py-10">
      <div className="sheet grid grid-cols-2 gap-8 md:grid-cols-4">
        {METRICS.map((m) => (
          <div key={m.l} className="metric text-center">
            <b>{m.n}</b>
            <span>{m.l}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Benefits() {
  return (
    <section className="band bg-paper">
      <div className="sheet">
        <p className="eyebrow text-[var(--cip)]">Qué recibe cada colegiado</p>
        <h2 className="head">Un curso hecho para ingenieros</h2>
        <div className="mt-9 grid gap-5 sm:grid-cols-2">
          {BENEFITS.map((x) => (
            <div key={x.t} className="mini">
              <img src={x.e} alt="" aria-hidden width={40} height={40} loading="lazy" className="h-10 w-10" />
              <h3>{x.t}</h3>
              <p>{x.d}</p>
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
  --okDark:#2E7D1A; --red:#F44336; font-family:'Archivo',system-ui,sans-serif; }
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
    <section className="band bg-cream">
      <div className="sheet">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow text-[var(--cip)]">Ejercicios reales</p>
          <h2 className="head">Pruébalo ahora mismo</h2>
          <p className="lede mx-auto mt-3 text-[var(--ink-2)]">
            Tres ejercicios del curso, tal como se ven en la app.
          </p>
        </div>

        {/* Alto fijo: la tarjeta no crece ni encoge al responder o avanzar. */}
        <div
          className="qz card mx-auto mt-8 flex h-[620px] max-w-2xl flex-col p-6 sm:h-[600px]"
          style={{ boxShadow: "var(--shadow)" }}
        >
          <div className="q-top">
            <div className="segs">
              {SAMPLE.map((_, k) => (
                <div key={k} className={`seg ${marks[k] ?? (k === i ? "now" : "")}`} />
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

/**
 * El demo real pesa varios cientos de kB, así que no se pide hasta que la
 * persona lo abre: hasta entonces sólo se ve el marco del teléfono con una
 * portada estática. El iframe se pinta al 111,11 % y se reduce a 0,9 para que,
 * una vez escalado, ocupe exactamente el hueco interior sin recortes.
 */
function LiveDemo() {
  const [on, setOn] = useState(false);

  return (
    <section id="curso" className="band bg-paper">
      <div className="sheet text-center">
        <p className="eyebrow text-[var(--cip)]">Sin maquetas</p>
        <h2 className="head">Este es el curso, tal cual</h2>
        <p className="lede mx-auto mt-3 text-[var(--ink-2)]">
          La app real del Colegio de Ingenieros. Ábrela y recórrela.
        </p>

        <div className="mx-auto mt-8 w-full max-w-[390px]">
          <div
            className="relative h-[720px] overflow-hidden rounded-[2rem] border-8 border-[#16233F] bg-[#f4f4f6]"
            style={{ boxShadow: "var(--shadow)" }}
          >
            {on ? (
              <iframe
                src="/democip"
                title="Demo del curso del CIP"
                className="block h-[111.111%] w-[111.111%] border-0"
                style={{ transform: "scale(0.9)", transformOrigin: "top left" }}
              />
            ) : (
              <button
                type="button"
                onClick={() => setOn(true)}
                className="flex h-full w-full flex-col items-center justify-center gap-5 bg-[radial-gradient(600px_400px_at_50%_0%,#22345A,transparent_60%),#0c1225] px-8 text-white"
              >
                <img
                  src="/head.png"
                  alt=""
                  aria-hidden
                  width={92}
                  height={92}
                  loading="lazy"
                  className="h-[92px] w-[92px] object-contain"
                />
                <span className="text-lg font-extrabold leading-snug">
                  El curso completo, dentro de tu navegador
                </span>
                <span
                  className="rounded-xl px-6 py-3.5 text-base font-extrabold text-white"
                  style={{ background: "var(--cta)", boxShadow: "0 4px 0 var(--ctaLip)" }}
                >
                  Abrir el demo
                </span>
                <span className="text-xs font-semibold text-white/60">
                  Se carga sólo cuando lo pides
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ mascota entera */

/** Boti completo (cuerpo, brazos, piernas) con su animación real, no el icono.
 *  Su script se descarga sólo cuando el bloque entra en pantalla. */
function BotiFull() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let live = true;
    const SRC = "/demo-assets/mascots/boti/boti.js";
    let script: HTMLScriptElement | null = null;

    function mount() {
      const w = window as unknown as { Boti?: { mount: (el: Element, o?: object) => void } };
      if (!live || !ref.current || !w.Boti) return;
      w.Boti.mount(ref.current, { shadow: true, track: true, interactive: true });
    }

    function load() {
      if ((window as unknown as { Boti?: unknown }).Boti) {
        mount();
        return;
      }
      script = document.querySelector<HTMLScriptElement>(`script[src="${SRC}"]`);
      if (!script) {
        script = document.createElement("script");
        script.src = SRC;
        script.async = true;
        document.head.appendChild(script);
      }
      script.addEventListener("load", mount);
    }

    const io = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          io.disconnect();
          load();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);

    return () => {
      live = false;
      io.disconnect();
      script?.removeEventListener("load", mount);
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
    <section className="band bg-accent">
      <div className="sheet mx-auto max-w-2xl text-center">
        <p className="eyebrow text-white/75">Últimos cupos de la primera cohorte</p>
        <h2 className="head text-white">Asegura tu cupo hoy</h2>
        <p className="lede mx-auto mt-3 text-white/90">
          Deja tu correo y te avisamos apenas se abra la inscripción para colegiados del{" "}
          {brand.institution}.
        </p>
        <div className="card mx-auto mt-8 max-w-xl p-4 text-left" style={{ boxShadow: "var(--shadow)" }}>
          <EmailForm id="final" cta="Preinscribirme" />
        </div>
      </div>
    </section>
  );
}
