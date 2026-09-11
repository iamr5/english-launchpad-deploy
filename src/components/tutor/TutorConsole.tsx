// TutorConsole.tsx — la pantalla del asistente.

import { useEffect, useRef, useState } from "react";
import { BANDS, PROFILES, bandIndex, type Band, type TurnMode } from "@/lib/tutor/cefr";
import { useRealtimeTutor } from "./useRealtimeTutor";
import { necesitaEspanol } from "@/lib/tutor/level-estimator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function TutorConsole({
  token,
  nombre,
  bandaInicial,
  packs,
  mic,
  modoInicial,
}: {
  token: string;
  nombre?: string;
  bandaInicial?: Band;
  packs?: string[];
  mic?: "near" | "far";
  modoInicial?: TurnMode;
}) {
  const modo: TurnMode = modoInicial ?? "auto";
  const tutor = useRealtimeTutor({ token, nombre, bandaInicial, packs, mic, modo });
  const [borrador, setBorrador] = useState("");
  const [pulsando, setPulsando] = useState(false);
  const finRef = useRef<HTMLDivElement | null>(null);

  // Durante una reconexión la sesión sigue viva: los controles no deben resetearse.
  const activo = tutor.status === "live" || tutor.status === "reconnecting";

  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [tutor.turns]);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-4 p-3 lg:grid lg:min-h-screen lg:grid-cols-[1fr_20rem] lg:p-6">
      {/* ── Conversación ─────────────────────────────────────────────── */}
      {/* En móvil el chat es un panel de altura fija: así los controles y el
          campo de texto quedan siempre a la vista sin tener que bajar. `svh`
          y no `vh` porque la barra de direcciones del móvil cambia de alto. */}
      <section className="flex h-[82svh] min-h-0 flex-col rounded-xl border border-border bg-card lg:h-auto">
        <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
          <div>
            <h1 className="text-sm font-semibold text-foreground">Asistente de conversación</h1>
            <p className="text-xs text-muted-foreground">
              Habla en inglés. El nivel se ajusta solo.
            </p>
          </div>
          <EstadoPill status={tutor.status} speaking={tutor.speaking} listening={tutor.listening} />
        </header>

        <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4 lg:min-h-96">
          {tutor.turns.length === 0 && (
            <div className="py-16 text-center text-sm text-muted-foreground">
              {activo ? "Di algo para empezar…" : "Pulsa «Empezar» y dale permiso al micrófono."}
            </div>
          )}

          {tutor.turns.map((t) => (
            <div
              key={t.id}
              className={t.role === "student" ? "flex justify-end" : "flex justify-start"}
            >
              <div
                className={[
                  "max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed",
                  t.role === "student"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground",
                  t.partial ? "opacity-60" : "",
                ].join(" ")}
              >
                {t.text || "…"}
              </div>
            </div>
          ))}
          <div ref={finRef} />
        </div>

        {tutor.error && (
          <p className="mx-4 mb-3 rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">
            {tutor.error}
          </p>
        )}

        <footer className="space-y-2 border-t border-border px-4 py-3">
          <div className="flex flex-wrap gap-2">
            {!activo ? (
              <Button onClick={() => void tutor.start()} disabled={tutor.status === "connecting"}>
                {tutor.status === "connecting" ? "Conectando…" : "Empezar"}
              </Button>
            ) : (
              <>
                <Button variant="destructive" onClick={tutor.stop}>
                  Terminar
                </Button>
                {modo === "manual" ? (
                  <Button
                    className={pulsando ? "flex-1 bg-emerald-600 hover:bg-emerald-600" : "flex-1"}
                    onPointerDown={() => {
                      setPulsando(true);
                      tutor.empezarAHablar();
                    }}
                    onPointerUp={() => {
                      setPulsando(false);
                      tutor.terminarDeHablar();
                    }}
                    onPointerLeave={() => {
                      if (!pulsando) return;
                      setPulsando(false);
                      tutor.terminarDeHablar();
                    }}
                  >
                    {pulsando ? "Te escucho… suelta al terminar" : "Mantén pulsado para hablar"}
                  </Button>
                ) : (
                  <Button variant="outline" onClick={tutor.toggleMic}>
                    {tutor.micMuted ? "Activar micrófono" : "Silenciar micrófono"}
                  </Button>
                )}
              </>
            )}
          </div>

          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              tutor.sendText(borrador);
              setBorrador("");
            }}
          >
            <Input
              value={borrador}
              onChange={(e) => setBorrador(e.target.value)}
              placeholder={activo ? "…o escríbelo aquí" : "Inicia la sesión para escribir"}
              disabled={!activo}
            />
            <Button type="submit" variant="secondary" disabled={!activo || !borrador.trim()}>
              Enviar
            </Button>
          </form>
        </footer>
      </section>

      {/* ── Panel de nivel ───────────────────────────────────────────── */}
      <aside className="space-y-4">
        <PanelNivel tutor={tutor} />
        <PanelSilabo vocabulario={tutor.vocabulario} />
        <PanelErrores notas={tutor.errorNotes} />
        <PanelCoste cost={tutor.cost} />
      </aside>
    </div>
  );
}

/** La banda a la que se parece una puntuación continua, para el informe. */
function bandFromScoreLabel(score: number): string {
  const i = Math.min(BANDS.length - 1, Math.max(0, Math.round(score) - 1));
  return BANDS[i]!;
}

function EstadoPill({
  status,
  speaking,
  listening,
}: {
  status: string;
  speaking: boolean;
  listening: boolean;
}) {
  const { texto, clase } = (() => {
    if (status === "connecting") return { texto: "Conectando", clase: "bg-amber-500" };
    if (status === "reconnecting") return { texto: "Reconectando", clase: "bg-amber-500" };
    if (status === "error") return { texto: "Error", clase: "bg-destructive" };
    if (status === "closed") return { texto: "Terminada", clase: "bg-muted-foreground" };
    if (status !== "live") return { texto: "En espera", clase: "bg-muted-foreground" };
    if (listening) return { texto: "Te escucho", clase: "bg-emerald-500" };
    if (speaking) return { texto: "Hablando", clase: "bg-sky-500" };
    return { texto: "En línea", clase: "bg-emerald-500" };
  })();

  return (
    <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">
      <span className={`size-2 rounded-full ${clase}`} />
      {texto}
    </span>
  );
}

function PanelNivel({ tutor }: { tutor: ReturnType<typeof useRealtimeTutor> }) {
  const { estimator, evidence, bandaPractica, nivelFijado } = tutor;
  const perfil = PROFILES[bandaPractica];
  const midiendo = estimator.confidence < 0.35;

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Practicando en
      </h2>

      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-3xl font-bold tabular-nums text-foreground">{bandaPractica}</span>
        <span className="text-xs text-muted-foreground">{perfil.label.split(" · ")[1]}</span>
      </div>
      <p className="mt-1 text-[11px] text-muted-foreground">
        {nivelFijado
          ? "Tu nivel, ya conocido. No cambia durante la práctica."
          : "Sin nivel informado: se está estimando sobre la marcha."}
      </p>

      {/* La escala hace visible que la estimación es continua y no un salto
          entre etiquetas: el punto se mueve aunque la banda no cambie. */}
      <div className="mt-3">
        <div className="relative h-1.5 rounded-full bg-muted">
          <div
            className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-card bg-primary transition-all duration-700"
            style={{ left: `${((estimator.score - 1) / (BANDS.length - 1)) * 100}%` }}
          />
        </div>
        <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
          {BANDS.map((b) => (
            <span key={b}>{b}</span>
          ))}
        </div>
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span>Confianza</span>
          <span className="tabular-nums">{Math.round(estimator.confidence * 100)}%</span>
        </div>
        <div className="mt-1 h-1 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary/60 transition-all duration-500"
            style={{ width: `${estimator.confidence * 100}%` }}
          />
        </div>
      </div>

      <div className="mt-3 border-t border-border pt-3">
        <h3 className="text-[11px] font-medium text-foreground">Observado en esta conversación</h3>
        <p className="mt-0.5 text-[11px] text-muted-foreground">
          {midiendo
            ? "Aún no hay evidencia suficiente."
            : `Por cómo has hablado, esta sesión se parece a ${bandFromScoreLabel(estimator.score)}.`}
        </p>
        <p className="mt-1 text-[10px] leading-relaxed text-muted-foreground">
          Esto es una observación, no tu nivel. Medirlo bien es un test de ubicación aparte.
        </p>
      </div>

      {necesitaEspanol(estimator) && (
        <div className="mt-3 rounded-lg bg-amber-500/10 px-2 py-1.5 text-[11px] text-amber-700 dark:text-amber-400">
          Explicando en español. {estimator.pidioEspanol ? "Lo pediste tú." : "Por tu nivel."}
        </div>
      )}

      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{evidence.resumenEs}</p>

      {evidence.demostrado.length > 0 && (
        <div className="mt-3 border-t border-border pt-3">
          <h3 className="text-[11px] font-medium text-foreground">Lo que has demostrado</h3>
          <ul className="mt-1.5 space-y-1">
            {evidence.demostrado.slice(0, 7).map((d) => (
              <li key={d.labelEs} className="flex items-center gap-2 text-[11px]">
                <span
                  className="rounded px-1 py-0.5 font-mono text-[10px] text-primary-foreground"
                  style={{ background: colorBanda(bandIndex(d.band)) }}
                >
                  {d.band}
                </span>
                <span className="flex-1 text-muted-foreground">{d.labelEs}</span>
                {d.veces > 1 && (
                  <span className="tabular-nums text-muted-foreground">×{d.veces}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-3 border-t border-border pt-2 text-[10px] leading-relaxed text-muted-foreground">
        El nivel lo calcula la app a partir de lo que dices, no lo decide el modelo.
      </p>
    </div>
  );
}

function PanelSilabo({ vocabulario }: { vocabulario?: { temas: string[]; palabras: string[] } }) {
  if (!vocabulario?.palabras.length) return null;

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Del sílabo
      </h2>
      {vocabulario.temas.length > 0 && (
        <p className="mt-1 text-[11px] text-muted-foreground">{vocabulario.temas.join(" · ")}</p>
      )}
      <div className="mt-2 flex flex-wrap gap-1">
        {vocabulario.palabras.slice(0, 18).map((p) => (
          <span
            key={p}
            className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground"
            title={p}
          >
            {p.split(" (")[0]}
          </span>
        ))}
      </div>
      <p className="mt-2 text-[10px] leading-relaxed text-muted-foreground">
        El tutor lleva la charla hacia estas palabras. Salen de tu módulo, elegidas por nivel.
      </p>
    </div>
  );
}

function PanelErrores({ notas }: { notas: { quote: string; correction: string; at: number }[] }) {
  if (!notas.length) return null;

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Para revisar
      </h2>
      <ul className="mt-2 space-y-2">
        {notas.slice(0, 6).map((n, i) => (
          <li key={`${n.at}-${i}`} className="text-[11px] leading-relaxed">
            <span className="text-muted-foreground line-through">{n.quote}</span>
            <span className="mx-1 text-muted-foreground">→</span>
            <span className="font-medium text-foreground">{n.correction}</span>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-[10px] text-muted-foreground">
        Solo aparecen frases que dijiste de verdad: cada cita se verifica contra la transcripción
        antes de mostrarla.
      </p>
    </div>
  );
}

function PanelCoste({ cost }: { cost: ReturnType<typeof useRealtimeTutor>["cost"] }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-baseline justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Coste estimado
        </h2>
        <span className="text-sm font-semibold tabular-nums text-foreground">
          ${cost.usd.toFixed(4)}
        </span>
      </div>
      <dl className="mt-2 space-y-0.5 text-[11px] text-muted-foreground">
        <Fila label="Audio entrada" valor={cost.audioInTokens} />
        <Fila label="Audio en caché" valor={cost.audioCachedTokens} />
        <Fila label="Audio salida" valor={cost.audioOutTokens} />
        <Fila label="Observador" valor={`$${cost.observerUsd.toFixed(5)}`} />
      </dl>
      <p className="mt-2 text-[10px] leading-relaxed text-muted-foreground">
        Calculado desde el uso que reporta la API. Es un estimado, no una factura.
      </p>
    </div>
  );
}

function Fila({ label, valor }: { label: string; valor: number | string }) {
  return (
    <div className="flex justify-between">
      <dt>{label}</dt>
      <dd className="tabular-nums">
        {typeof valor === "number" ? valor.toLocaleString("es") : valor}
      </dd>
    </div>
  );
}

/** Verde para lo básico, morado para lo avanzado. */
function colorBanda(i: number): string {
  const tonos = ["#16a34a", "#0891b2", "#2563eb", "#7c3aed", "#c026d3"];
  return tonos[Math.min(tonos.length - 1, Math.max(0, i - 1))];
}
