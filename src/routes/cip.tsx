import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { getCipBrand } from "@/lib/cip-landing.functions";

// Campaña de preinscripción del Colegio de Ingenieros. El objetivo no es vender
// un curso: es juntar firmas (correos) para que el Colegio active el programa,
// y que cada ingeniero le pase la voz a sus colegas.
//
// El aspecto sigue el sistema de las presentaciones y sílabos: papel crema,
// bandas navy con textura de puntos, Archivo / Archivo Black y acentos en
// cursiva serif. La carga pesada (demo real y mascota animada) es diferida.

export const Route = createFileRoute("/cip")({
  loader: () => getCipBrand(),
  head: () => ({
    meta: [
      { title: "Inglés para los ingenieros del Perú · Preinscripción CIP" },
      {
        name: "description",
        content:
          "Inglés completo de A1 a C1 (MCER), con inglés técnico de ingeniería incluido. La plataforma ya está construida; el CIP la activa para todos los colegiados. Deja tu correo y únete.",
      },
      { property: "og:type", content: "website" },
      {
        property: "og:title",
        content: "Inglés para los ingenieros del Perú · Preinscripción CIP",
      },
      {
        property: "og:description",
        content:
          "Curso completo A1–C1 con marca del Colegio: 45 microlecciones, 8.127 ejercicios, 11.040 palabras (779 de ingeniería). Plataforma lista, esperando el visto bueno del CIP.",
      },
      { property: "og:image", content: "https://aprendoenglish.com/social-preview.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "Inglés para los ingenieros del Perú · Preinscripción CIP",
      },
      {
        name: "twitter:description",
        content: "Inglés A1–C1 con inglés técnico incluido. Plataforma construida, el CIP la activa cuando los colegiados la piden.",
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
  { n: "779", l: "de ellas, de ingeniería" },
];

/** Etiquetas cortas bajo el titular: qué incluye el programa. */
const BADGES = [
  "Niveles A1 a C1 (MCER)",
  "Incluye inglés técnico",
  "Test de ubicación",
  "Certificado por nivel",
  "Con la marca del CIP",
];

/** Capturas reales de la plataforma (tomadas del demo del CIP). */
const SHOTS = [
  {
    img: "/cip/app-quiz.webp",
    t: "Test de ubicación de 40 preguntas",
    d: "Se adapta a tus respuestas y te ubica entre A1 y C1 desde el primer día. Nadie empieza donde no le toca.",
  },
  {
    img: "/cip/app-nivel.webp",
    t: "Tu ruta completa, de A1 a C1",
    d: "Los cinco niveles del Marco Común Europeo (MCER) encadenados: gramática, lectura, escucha y escritura.",
  },
  {
    img: "/cip/app-ruta.webp",
    t: "Con la marca del Colegio",
    d: "Logo, colores y lenguaje del CIP. Para el colegiado es la plataforma de su Colegio, no la de un tercero.",
  },
  {
    img: "/cip/app-vocab.webp",
    t: "Vocabulario general y de ingeniería",
    d: "197 temas en tandas de diez con examen y definición en español; 779 de esas palabras son términos de ingeniería.",
  },
];

const TECH = [
  {
    e: "/demo-assets/ob-goal.svg",
    t: "Ubicación automática",
    d: "Motor adaptativo: el test corta apenas tiene evidencia suficiente de tu nivel del MCER.",
  },
  {
    e: "/demo-assets/ob-words.svg",
    t: "Corrección de escritura con IA",
    d: "Acepta varias formas correctas de decir la misma frase, no una sola respuesta memorizada.",
  },
  {
    e: "/demo-assets/streak.svg",
    t: "Progreso medible",
    d: "Racha, XP y niveles por colegiado; el Colegio ve avance real, no asistencia.",
  },
  {
    e: "/demo-assets/ob-thunder.svg",
    t: "Sin instalar nada",
    d: "Corre en el navegador del celular o la computadora. 20 minutos al día bastan para avanzar.",
  },
];


const STEPS = [
  {
    n: "1",
    t: "Dejas tu correo",
    d: "Toma diez segundos y no cuesta nada. Es tu voto para que el CIP active el programa.",
  },
  {
    n: "2",
    t: "Le pasas la voz a tus colegas",
    d: "Mientras más ingenieros firmen, más claro es el pedido al Colegio. Una firma sola no mueve nada.",
  },
  {
    n: "3",
    t: "El Colegio activa el acceso",
    d: "La plataforma ya está construida. Con la demanda demostrada, los colegiados empiezan a disfrutarla.",
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
.cipp .bg-ink{ color:#eef2fb; background:radial-gradient(900px 600px at 90% 0%,#1b2c52,transparent 60%),var(--ink); }
.cipp .bg-ink::before{ background-image:radial-gradient(rgba(255,255,255,.05) 1.2px,transparent 1.3px); opacity:.6; }

.cipp .eyebrow{ display:inline-flex; align-items:center; gap:10px; font:800 11.5px/1 var(--disp);
  letter-spacing:.24em; text-transform:uppercase; margin-bottom:18px; }
.cipp h1.title{ font-family:var(--black); font-weight:400; line-height:1; letter-spacing:-.03em;
  font-size:clamp(32px,5.6vw,62px); }
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

/* pasos numerados */
.cipp .step{ position:relative; padding-left:66px; }
.cipp .step b.num{ position:absolute; left:0; top:-4px; width:48px; height:48px; border-radius:14px;
  display:grid; place-items:center; font-family:var(--black); font-weight:400; font-size:22px;
  background:color-mix(in srgb,var(--cip) 14%,#fff); color:var(--cip); border:1px solid color-mix(in srgb,var(--cip) 30%,transparent); }
.cipp .step h3{ font-weight:800; font-size:18px; line-height:1.2; margin-bottom:6px; }
.cipp .step p{ font-size:15px; color:var(--ink-2); }

/* pantallas reales */
.cipp .shot{ border-radius:18px; overflow:hidden; border:1px solid var(--line); background:#fff;
  box-shadow:var(--shadow-sm); }
.cipp .shot img{ display:block; width:100%; height:auto; }
.cipp .badge{ display:inline-block; border-radius:999px; padding:6px 13px; font-size:11.5px; font-weight:800;
  letter-spacing:.14em; text-transform:uppercase; }

/* etiquetas de «qué incluye», bajo el titular */
.cipp .badges{ display:flex; flex-wrap:wrap; gap:8px; margin-top:20px; }
.cipp .badges li{ display:inline-flex; align-items:center; gap:7px; border-radius:999px;
  padding:6px 12px 6px 10px; font-size:12.5px; font-weight:700; letter-spacing:.01em;
  color:#eef2fb; background:rgba(255,255,255,.09); border:1px solid rgba(255,255,255,.18); }
.cipp .badges li::before{ content:""; width:6px; height:6px; border-radius:50%;
  background:var(--cip); box-shadow:0 0 0 3px color-mix(in srgb,var(--cip) 30%,transparent); }



/* burbuja de Boti */
.cipp .bubble{ position:relative; background:#fff; color:var(--ink); border-radius:18px;
  padding:14px 16px; font-size:15px; font-weight:600; line-height:1.4; box-shadow:var(--shadow-sm);
  max-width:260px; }
.cipp .bubble::after{ content:""; position:absolute; left:34px; bottom:-9px; width:18px; height:18px;
  background:#fff; transform:rotate(45deg); border-radius:3px; }
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
      <style dangerouslySetInnerHTML={{ __html: PAGE_CSS }} />
      <Hero brand={b} />
      <Steps />
      <Metrics />
      <Tech />
      <LiveDemo />
      <Share />
      <FinalCta brand={b} />
      <footer className="bg-paper band !py-8">
        <div className="sheet text-center text-xs font-semibold tracking-wide text-[var(--muted)]">
          AprendoEnglish × {b.institution} · Campaña de preinscripción · Plataforma lista para activarse
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
        <strong className="block text-lg">Firma registrada 🎉</strong>
        <span className="text-sm">
          Te escribiremos a {email}. Ahora lo importante: pásale este enlace a dos colegas
          ingenieros.
        </span>
        <div className="mt-3">
          <ShareButtons compact />
        </div>
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
        Sin costo y sin compromiso. Sólo usamos tu correo para avisarte si el programa se activa.
      </p>
      {state === "error" && (
        <p className="mt-2 text-sm font-semibold text-red-600">
          No pudimos registrarte. Revisa el correo e inténtalo otra vez.
        </p>
      )}
    </form>
  );
}

/* ------------------------------------------------------------------ contador */

function Counter() {
  const [n, setN] = useState<number | null>(null);

  useEffect(() => {
    let live = true;
    fetch("/api/public/preinscripcion?slug=cip")
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { total?: number } | null) => {
        if (live && d && typeof d.total === "number") setN(d.total);
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, []);

  if (n === null || n < 1) return null;
  return (
    <p className="mt-4 text-sm font-bold text-white/80">
      <span className="text-white">{n.toLocaleString("es-PE")}</span>{" "}
      {n === 1 ? "ingeniero ya firmó" : "ingenieros ya firmaron"} por que esto exista.
    </p>
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
          <p className="eyebrow text-white/70">Plataforma construida · El Colegio debe activarla</p>
          <h1 className="title">
            Que todos los ingenieros del Perú
            <br />
            <span className="acc">hablen inglés</span>
          </h1>
          <p className="lede mt-5 text-white/85">
            Un curso de inglés completo, de cero a nivel avanzado, con la marca del Colegio — y con
            inglés técnico de ingeniería incluido. La plataforma ya está construida; el Colegio debe
            asegurarse de que los colegiados la quieren para encender el acceso.
          </p>
          <ul className="badges">
            {BADGES.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>


          <div className="card mt-8 max-w-xl p-4" style={{ boxShadow: "var(--shadow)" }}>
            <EmailForm id="hero" cta="Firmar mi preinscripción" />
          </div>
          <Counter />
        </div>
        <div className="hidden flex-col items-center gap-3 md:flex">
          <BotiFull />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------- pasos */

function Steps() {
  return (
    <section className="band bg-cream">
      <div className="sheet">
        <p className="eyebrow text-[var(--cip)]">Cómo funciona esta campaña</p>
        <h2 className="head">El Colegio necesita ver que los colegiados lo quieren.</h2>
        <p className="lede mt-3 text-[var(--ink-2)]">
          No estás comprando un curso: estás confirmando tu interés para que el Colegio active la
          plataforma que ya está lista.
        </p>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="step">
              <b className="num">{s.n}</b>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ métricas */

function Metrics() {
  return (
    <section className="band bg-paper !py-10">
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

/* --------------------------------------------------- tecnología con capturas */

function Tech() {
  return (
    <section className="band bg-paper">
      <div className="sheet">
        <p className="eyebrow text-[var(--cip)]">Tecnología de punta, hecha para ingenieros</p>
        <h2 className="head">Esto es lo que ya está construido</h2>
        <p className="lede mt-3 text-[var(--ink-2)]">
          No es una idea ni una maqueta: son pantallas reales de la plataforma del CIP, funcionando
          hoy.
        </p>

        <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {SHOTS.map((s) => (
            <figure key={s.t} className="shot">
              <img src={s.img} alt={s.t} width={560} height={1147} loading="lazy" />
              <figcaption className="border-t border-[var(--line)] p-4">
                <h3 className="text-[16px] font-extrabold leading-tight">{s.t}</h3>
                <p className="mt-1.5 text-[14px] leading-snug text-[var(--ink-2)]">{s.d}</p>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TECH.map((x) => (
            <div key={x.t} className="mini">
              <img
                src={x.e}
                alt=""
                aria-hidden
                width={40}
                height={40}
                loading="lazy"
                className="h-10 w-10"
              />
              <h3>{x.t}</h3>
              <p>{x.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- demo en vivo */

function LiveDemo() {
  const [on, setOn] = useState(false);

  return (
    <section id="curso" className="band bg-cream">
      <div className="sheet text-center">
        <p className="eyebrow text-[var(--cip)]">Sin maquetas</p>
        <h2 className="head">Este es el curso, tal cual</h2>
        <p className="lede mx-auto mt-3 text-[var(--ink-2)]">
          Ábrelo y recórrelo completo: test de ubicación, ruta A1–C1, vocabulario general y de
          ingeniería, y panel de progreso.

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
                className="flex h-full w-full flex-col items-center justify-center gap-5 px-8 text-white"
                style={{
                  background:
                    "radial-gradient(600px 400px at 50% 0%, #22345A, transparent 60%), #0c1225",
                }}

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

/* --------------------------------------------------------------- compartir */

function ShareButtons({ compact = false }: { compact?: boolean }) {
  const [copied, setCopied] = useState(false);
  const url = "https://aprendoenglish.com/cip";
  const msg =
    "Colega ingeniero: el CIP puede darnos inglés de A1 a C1, con inglés técnico incluido, a todos los colegiados. Solo falta que seamos suficientes. Firma aquí: ";

  const wa = `https://wa.me/?text=${encodeURIComponent(msg + url + "?utm_source=whatsapp")}`;
  const li = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url + "?utm_source=linkedin")}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      /* sin portapapeles */
    }
  }

  const cls = compact
    ? "rounded-lg px-3.5 py-2 text-[13px] font-extrabold"
    : "rounded-xl px-5 py-3.5 text-base font-extrabold";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <a
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        className={`${cls} text-white`}
        style={{ background: "#25D366", boxShadow: "0 4px 0 #14904a" }}
      >
        WhatsApp
      </a>
      <a
        href={li}
        target="_blank"
        rel="noopener noreferrer"
        className={`${cls} text-white`}
        style={{ background: "#0A66C2", boxShadow: "0 4px 0 #06427d" }}
      >
        LinkedIn
      </a>
      <button
        type="button"
        onClick={copy}
        className={`${cls} border-2 border-current text-[var(--cip)]`}
      >
        {copied ? "¡Enlace copiado!" : "Copiar enlace"}
      </button>
    </div>
  );
}

function Share() {
  return (
    <section className="band bg-ink">
      <div className="sheet grid items-center gap-10 md:grid-cols-[1.1fr_.9fr]">
        <div>
          <p className="eyebrow text-white/70">Lo más importante de esta página</p>
          <h2 className="head text-white">Pásale la voz a tus colegas</h2>
          <p className="lede mt-4 text-white/85">
            Una firma no mueve nada; mil firmas mueven al Colegio. Manda este enlace a tu grupo de
            obra, a tu capítulo, a los ingenieros de tu empresa. Cada colegiado que firma acerca la
            fecha de arranque.
          </p>
          <div className="mt-7">
            <ShareButtons />
          </div>
        </div>
        <div className="card p-6">
          <p className="badge bg-[color-mix(in_srgb,var(--cip)_14%,#fff)] text-[var(--cip)]">
            Qué le dices
          </p>
          <p className="mt-4 text-[15.5px] font-semibold leading-relaxed text-[var(--ink-2)]">
            «Colega, el Colegio puede darnos inglés completo —de A1 a C1, con inglés técnico
            incluido— a todos los colegiados, con la plataforma ya construida. Sólo falta que
            seamos suficientes. Firma acá, toma diez segundos.»

          </p>
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
    <div className="flex flex-col items-center">
      <div className="bubble mb-4">
        ¡Hola! Soy <b>Boti</b>. Si tus colegas firman, te acompaño desde tu primer &quot;hello&quot;
        hasta que hables inglés de ingeniero.
      </div>

      <div
        ref={ref}
        aria-label="Boti, la mascota del programa"
        className="relative w-[240px] drop-shadow-2xl"
        style={{ aspectRatio: "757.6 / 1139.5" }}
      />
    </div>
  );
}

function FinalCta({ brand }: { brand: { institution: string } }) {
  return (
    <section className="band bg-accent">
      <div className="sheet mx-auto max-w-2xl text-center">
        <p className="eyebrow text-white/75">Última llamada</p>
        <h2 className="head text-white">Firma y pásala</h2>
        <p className="lede mx-auto mt-3 text-white/90">
          Diez segundos tuyos para que el {brand.institution} pueda lanzar la plataforma de inglés de
          todos los colegiados: A1 a C1, con inglés técnico incluido.

        </p>
        <div
          className="card mx-auto mt-8 max-w-xl p-4 text-left"
          style={{ boxShadow: "var(--shadow)" }}
        >
          <EmailForm id="final" cta="Firmar mi preinscripción" />
        </div>
      </div>
    </section>
  );
}
