// useRealtimeTutor.ts — la sesión de voz y texto en tiempo real.

import { useCallback, useEffect, useRef, useState } from "react";
import {
  applyObservation,
  explain,
  ingestTurn,
  initialState,
  necesitaEspanol,
  type EstimatorState,
  type Evidence,
} from "@/lib/tutor/level-estimator";
import { sessionUpdateForBand } from "@/lib/tutor/prompt";
import { type Band, type TurnMode } from "@/lib/tutor/cefr";

export type Turn = {
  id: string;
  role: "student" | "tutor";
  text: string;
  at: number;
  /** Todavía llegando: se pinta en gris y no se manda a observar. */
  partial: boolean;
};

export type ErrorNote = {
  quote: string;
  kind: string;
  correction: string;
  at: number;
};

export type Status = "idle" | "connecting" | "live" | "reconnecting" | "closed" | "error";

export type CostBreakdown = {
  usd: number;
  audioInTokens: number;
  audioCachedTokens: number;
  audioOutTokens: number;
  textInTokens: number;
  textOutTokens: number;
  /** Lo que llevan gastado las llamadas al observador. */
  observerUsd: number;
};

const PRECIO = {
  textIn: 0.6,
  textCached: 0.06,
  audioIn: 10.0,
  audioCached: 0.3,
  textOut: 2.4,
  audioOut: 20.0,
};

/** Cada cuánto se llama al observador. */
function cadaCuantosTurnos(confidence: number): number {
  return confidence < 0.6 ? 3 : 6;
}
const OBSERVAR_SI_PALABRAS = 60;

type Opciones = {
  /** Pase emitido por el servidor al renderizar la página. */
  token: string;
  nombre?: string;
  /** El nivel del alumno, ya conocido (test de ubicación, progreso del curso). */
  bandaInicial?: Band;
  /** Packs de vocabulario de la institución, para anclar al sílabo. */
  packs?: string[];
  /** "near" para auriculares con micro; por defecto se asume micro de portátil. */
  mic?: "near" | "far";
  /** Cómo se decide que el alumno ha terminado de hablar. */
  modo?: TurnMode;
};

export function useRealtimeTutor({
  token,
  nombre,
  bandaInicial,
  packs,
  mic,
  modo = "auto",
}: Opciones) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [estimator, setEstimator] = useState<EstimatorState>(() => initialState(bandaInicial));
  const [evidence, setEvidence] = useState<Evidence>(() => explain(initialState(bandaInicial)));
  const [errorNotes, setErrorNotes] = useState<ErrorNote[]>([]);
  const [cost, setCost] = useState<CostBreakdown>({
    usd: 0,
    audioInTokens: 0,
    audioCachedTokens: 0,
    audioOutTokens: 0,
    textInTokens: 0,
    textOutTokens: 0,
    observerUsd: 0,
  });
  const [micMuted, setMicMuted] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [sonando, setSonando] = useState(false);
  const [listening, setListening] = useState(false);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);

  // Ref para leer el estimador fresco dentro de los manejadores de eventos.
  const estRef = useRef(estimator);
  estRef.current = estimator;

  /** La banda con la que se HABLA, que no tiene por qué ser la que se MIDE. */
  // Manda siempre el estimador. `bandaInicial` solo SIEMBRA el arranque (test
  // de ubicación, progreso del curso) para no empezar en frío; a partir de ahí
  // el nivel se recalibra con lo que el alumno habla, turno a turno.
  const bandaPractica: Band = estimator.band;

  const bandaEnviadaRef = useRef<Band>(bandaPractica);
  const atascoEnviadoRef = useRef(false);
  const arrancandoRef = useRef(false);
  const bilingueEnviadoRef = useRef(false);
  const reconexionRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const esperandoRef = useRef(false);
  const citaAvisadaRef = useRef(false);
  const sonandoRef = useRef(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const vigilaRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const modoRef = useRef<TurnMode>(modo);
  modoRef.current = modo;
  const vocabRef = useRef<{ temas: string[]; palabras: string[] } | undefined>(undefined);
  const packsRef = useRef<string[] | undefined>(packs);
  packsRef.current = packs;

  /** Turnos del alumno pendientes de mandar al observador. */
  const pendientesRef = useRef<{ texto: string[]; palabras: number; turnos: number }>({
    texto: [],
    palabras: 0,
    turnos: 0,
  });
  /** Lo último que dijo el tutor, para que el observador juzgue si le siguieron. */
  const ultimoTutorRef = useRef<string>("");

  const registrarTurnoAlumno = useCallback((texto: string) => {
    const limpio = texto.trim();
    if (!limpio) return;

    setEstimator((prev) => {
      const next = ingestTurn(prev, limpio);
      setEvidence(explain(next));
      return next;
    });

    const p = pendientesRef.current;
    p.texto.push(limpio);
    p.palabras += limpio.split(/\s+/).filter(Boolean).length;
    p.turnos += 1;
  }, []);

  const observar = useCallback(async () => {
    const p = pendientesRef.current;
    if (!p.texto.length) return;

    const studentText = p.texto.join(" ");
    const tutorText = ultimoTutorRef.current;
    const palabras = p.palabras;
    pendientesRef.current = { texto: [], palabras: 0, turnos: 0 };

    try {
      const r = await fetch("/api/tutor/observe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ t: token, studentText, tutorText }),
      });
      if (!r.ok) return;

      const obs = (await r.json()) as {
        errors: { quote: string; kind: string; correction: string }[];
        structuresConfirmed: string[];
        unclearAudio: boolean;
        comprehension: "followed" | "partial" | "lost";
        cost: { usd: number };
        tutorMisquotes?: string[];
      };

      const citas = obs.tutorMisquotes ?? [];
      const canal = dcRef.current;
      if (citas.length && !citaAvisadaRef.current && canal?.readyState === "open") {
        citaAvisadaRef.current = true;
        canal.send(
          JSON.stringify({
            type: "conversation.item.create",
            item: {
              type: "message",
              role: "system",
              content: [
                {
                  type: "input_text",
                  text: `AVISO DEL SISTEMA: le has atribuido al alumno una frase que no dijo (${citas
                    .slice(0, 2)
                    .map((c) => `"${c.slice(0, 80)}"`)
                    .join(
                      ", ",
                    )}). No vuelvas a repetir sus palabras ni a entrecomillarle, tampoco para felicitarle. Da el visto bueno sin citar.`,
                },
              ],
            },
          }),
        );
      }

      setEstimator((prev) => {
        const next = applyObservation(prev, {
          errorCount: obs.errors.length,
          wordsObserved: palabras,
          confirmedStructures: obs.structuresConfirmed,
          unclearAudio: obs.unclearAudio,
          comprehension: obs.comprehension,
        });
        setEvidence(explain(next));
        return next;
      });

      if (obs.errors.length) {
        const at = Date.now();
        setErrorNotes((prev) => [...obs.errors.map((e) => ({ ...e, at })), ...prev].slice(0, 12));
      }

      setCost((c) => ({
        ...c,
        observerUsd: c.observerUsd + (obs.cost?.usd || 0),
        usd: c.usd + (obs.cost?.usd || 0),
      }));
    } catch {
      // Que falle una observación no debe romper la conversación.
    }
  }, [token]);

  // Dispara la observación cuando toca.
  useEffect(() => {
    const p = pendientesRef.current;
    if (
      p.turnos >= cadaCuantosTurnos(estRef.current.confidence) ||
      p.palabras >= OBSERVAR_SI_PALABRAS
    ) {
      void observar();
    }
  }, [turns, observar]);

  // Se reinstruye al modelo si cambia la banda o si el alumno empieza a atascarse.
  useEffect(() => {
    const dc = dcRef.current;
    if (!dc || dc.readyState !== "open") return;

    const cuestaSeguir = estimator.lostRate > 0.4;
    const bilingue = necesitaEspanol(estimator);
    if (
      bandaPractica === bandaEnviadaRef.current &&
      cuestaSeguir === atascoEnviadoRef.current &&
      bilingue === bilingueEnviadoRef.current
    ) {
      return;
    }

    bandaEnviadaRef.current = bandaPractica;
    atascoEnviadoRef.current = cuestaSeguir;
    bilingueEnviadoRef.current = bilingue;
    dc.send(
      JSON.stringify(
        sessionUpdateForBand({
          band: bandaPractica,
          nombre,
          midiendo: estimator.confidence < 0.35,
          vocabulario: vocabRef.current,
          cuestaSeguir,
          bilingue,
          modo: modoRef.current,
        }),
      ),
    );
  }, [bandaPractica, estimator, nombre]);

  /** Corta el micrófono mientras el tutor habla. */
  useEffect(() => {
    if (modo === "manual" || micMuted) return;
    const track = streamRef.current?.getAudioTracks()[0];
    if (!track) return;
    track.enabled = !speaking && !sonando;
  }, [speaking, sonando, micMuted, modo]);

  const acumulaCoste = useCallback((usage: Record<string, unknown> | undefined) => {
    if (!usage) return;

    const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : 0);
    const inDet = (usage["input_token_details"] || {}) as Record<string, unknown>;
    const outDet = (usage["output_token_details"] || {}) as Record<string, unknown>;
    const cachedDet = (inDet["cached_tokens_details"] || {}) as Record<string, unknown>;

    const audioCached = num(cachedDet["audio_tokens"]);
    const textCached = num(cachedDet["text_tokens"]);
    const audioIn = Math.max(0, num(inDet["audio_tokens"]) - audioCached);
    const textIn = Math.max(0, num(inDet["text_tokens"]) - textCached);
    const audioOut = num(outDet["audio_tokens"]);
    const textOut = num(outDet["text_tokens"]);

    const usd =
      (audioIn * PRECIO.audioIn +
        audioCached * PRECIO.audioCached +
        textIn * PRECIO.textIn +
        textCached * PRECIO.textCached +
        audioOut * PRECIO.audioOut +
        textOut * PRECIO.textOut) /
      1e6;

    setCost((c) => ({
      usd: c.usd + usd,
      audioInTokens: c.audioInTokens + audioIn,
      audioCachedTokens: c.audioCachedTokens + audioCached,
      audioOutTokens: c.audioOutTokens + audioOut,
      textInTokens: c.textInTokens + textIn,
      textOutTokens: c.textOutTokens + textOut,
      observerUsd: c.observerUsd,
    }));
  }, []);

  const upsertTurn = useCallback(
    (id: string, role: Turn["role"], texto: string, partial: boolean, append: boolean) => {
      setTurns((prev) => {
        const i = prev.findIndex((t) => t.id === id);
        if (i === -1) {
          return [...prev, { id, role, text: texto, at: Date.now(), partial }];
        }
        const copia = [...prev];
        const anterior = copia[i];
        copia[i] = {
          ...anterior,
          text: append ? anterior.text + texto : texto,
          partial,
        };
        return copia;
      });
    },
    [],
  );

  const manejaEvento = useCallback(
    (evt: Record<string, unknown>) => {
      const tipo = String(evt["type"] || "");
      const itemId = String(evt["item_id"] || evt["response_id"] || "");

      switch (tipo) {
        case "input_audio_buffer.speech_started":
          esperandoRef.current = false;
          setListening(true);
          break;

        case "input_audio_buffer.speech_stopped":
          esperandoRef.current = true;
          setListening(false);
          break;

        case "conversation.item.input_audio_transcription.delta":
          upsertTurn(`u-${itemId}`, "student", String(evt["delta"] || ""), true, true);
          break;

        case "conversation.item.input_audio_transcription.completed": {
          const texto = String(evt["transcript"] || "").trim();
          // Sin texto fue ruido, no habla.
          if (!texto) {
            setTurns((prev) => prev.filter((t) => t.id !== `u-${itemId}`));
            break;
          }
          upsertTurn(`u-${itemId}`, "student", texto, false, false);
          registrarTurnoAlumno(texto);
          if (modoRef.current === "auto" && esperandoRef.current) {
            esperandoRef.current = false;
            const dc = dcRef.current;
            if (dc?.readyState === "open") dc.send(JSON.stringify({ type: "response.create" }));
          }
          break;
        }

        // La GA renombró response.audio_transcript.* a response.output_audio_transcript.*.
        case "response.output_audio_transcript.delta":
        case "response.audio_transcript.delta":
        case "response.output_text.delta":
        case "response.text.delta":
          setSpeaking(true);
          upsertTurn(`a-${itemId}`, "tutor", String(evt["delta"] || ""), true, true);
          break;

        case "response.output_audio_transcript.done":
        case "response.audio_transcript.done":
        case "response.output_text.done":
        case "response.text.done": {
          const texto = String(evt["transcript"] || evt["text"] || "").trim();
          if (texto) {
            upsertTurn(`a-${itemId}`, "tutor", texto, false, false);
            ultimoTutorRef.current = texto;
          } else {
            upsertTurn(`a-${itemId}`, "tutor", "", false, true);
          }
          break;
        }

        case "response.done": {
          setSpeaking(false);
          const resp = (evt["response"] || {}) as Record<string, unknown>;
          acumulaCoste(resp["usage"] as Record<string, unknown> | undefined);
          break;
        }

        case "error":
          console.error("[tutor] error del servidor de realtime", evt["error"]);
          break;

        default:
          break;
      }
    },
    [acumulaCoste, registrarTurnoAlumno, upsertTurn],
  );

  const vigilaVoz = useCallback((pista: MediaStream) => {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    try {
      const ctx = new AC();
      audioCtxRef.current = ctx;
      if (ctx.state === "suspended") void ctx.resume().catch(() => {});
      const an = ctx.createAnalyser();
      an.fftSize = 512;
      ctx.createMediaStreamSource(pista).connect(an);
      const datos = new Uint8Array(an.fftSize);
      let ultimaVoz = 0;
      vigilaRef.current = setInterval(() => {
        an.getByteTimeDomainData(datos);
        let suma = 0;
        for (const v of datos) {
          const d = (v - 128) / 128;
          suma += d * d;
        }
        if (Math.sqrt(suma / datos.length) > 0.01) ultimaVoz = Date.now();
        const suena = Date.now() - ultimaVoz < 150;
        if (suena !== sonandoRef.current) {
          sonandoRef.current = suena;
          setSonando(suena);
        }
      }, 50);
    } catch {
      audioCtxRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    arrancandoRef.current = false;
    esperandoRef.current = false;
    if (vigilaRef.current) clearInterval(vigilaRef.current);
    vigilaRef.current = null;
    void audioCtxRef.current?.close().catch(() => {});
    audioCtxRef.current = null;
    sonandoRef.current = false;
    setSonando(false);
    if (reconexionRef.current) clearTimeout(reconexionRef.current);
    reconexionRef.current = null;
    dcRef.current?.close();
    dcRef.current = null;

    pcRef.current?.getSenders().forEach((s) => s.track?.stop());
    pcRef.current?.close();
    pcRef.current = null;

    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;

    audioElRef.current?.remove();
    audioElRef.current = null;

    setSpeaking(false);
    setListening(false);
    setStatus((s) => (s === "error" ? s : "closed"));

    // Lo pendiente se observa ahora: el final de la conversación es la mejor evidencia.
    void observar();
  }, [observar]);

  const start = useCallback(async () => {
    // La reserva va antes del await: si no, dos pulsaciones abren dos sesiones.
    if (pcRef.current || arrancandoRef.current) return;
    arrancandoRef.current = true;
    citaAvisadaRef.current = false;
    esperandoRef.current = false;

    setError(null);
    setStatus("connecting");

    // El <audio> se crea y se desbloquea AQUÍ, antes de cualquier await.
    const audioEl = document.createElement("audio");
    audioEl.autoplay = true;
    // Vía atributo: playsInline no está tipado en HTMLAudioElement.
    audioEl.setAttribute("playsinline", "");
    audioEl.style.display = "none";
    document.body.appendChild(audioEl);
    audioElRef.current = audioEl;
    void audioEl.play().catch(() => {});

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new ErrorParaAlumno(
          window.isSecureContext
            ? "Este navegador no permite acceder al micrófono."
            : "El navegador solo da acceso al micrófono en HTTPS. Abre la página por el enlace https, no por la IP local.",
        );
      }

      const est = estRef.current;

      const r = await fetch("/api/tutor/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          t: token,
          band: est.band,
          nombre,
          packs: packsRef.current,
          mic,
          modo,
          midiendo: est.confidence < 0.35,
          cuestaSeguir: est.lostRate > 0.4,
          bilingue: necesitaEspanol(est),
        }),
      });

      if (!r.ok) {
        const cuerpo = (await r.json().catch(() => ({}))) as { error?: string };
        throw new ErrorParaAlumno(mensajeDeError(cuerpo.error));
      }

      const sesion = (await r.json()) as {
        clientSecret: string;
        vocabulario?: { temas: string[]; palabras: string[] };
      };
      const clientSecret = sesion.clientSecret;
      vocabRef.current = sesion.vocabulario;
      bandaEnviadaRef.current = est.band;

      const pc = new RTCPeerConnection();
      pcRef.current = pc;

      // Salida: el audio del tutor, sobre el elemento ya desbloqueado arriba.
      pc.ontrack = (e) => {
        const pista = e.streams[0] ?? null;
        audioEl.srcObject = pista;
        void audioEl.play().catch(() => {});
        if (pista) vigilaVoz(pista);
      };

      // Entrada: el micrófono.
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
      streamRef.current = stream;
      const track = stream.getAudioTracks()[0];
      if (track) {
        // En manual el micro arranca apagado y solo se abre al mantener pulsado.
        if (modo === "manual") track.enabled = false;
        pc.addTrack(track, stream);
      }

      // Canal de eventos: transcripciones, texto escrito y cambios de nivel.
      const dc = pc.createDataChannel("oai-events");
      dcRef.current = dc;

      dc.addEventListener("open", () => {
        setStatus("live");
        dc.send(JSON.stringify({ type: "response.create" }));
      });

      dc.addEventListener("message", (e) => {
        try {
          manejaEvento(JSON.parse(e.data) as Record<string, unknown>);
        } catch {
          // Fragmento no-JSON: se ignora.
        }
      });

      // Reconexión.
      pc.addEventListener("connectionstatechange", () => {
        const estado = pc.connectionState;

        if (estado === "connected") {
          if (reconexionRef.current) clearTimeout(reconexionRef.current);
          reconexionRef.current = null;
          setError(null);
          setStatus("live");
          return;
        }

        if (estado !== "failed" && estado !== "disconnected") return;

        if (estado === "failed") {
          try {
            pc.restartIce();
          } catch {
            // No todos los navegadores lo traen.
          }
        }

        setStatus("reconnecting");
        if (reconexionRef.current) return;
        reconexionRef.current = setTimeout(() => {
          reconexionRef.current = null;
          if (pcRef.current !== pc) return;
          if (pc.connectionState === "connected") return;
          setError("Se perdió la conexión con el tutor.");
          setStatus("error");
        }, 10000);
      });

      // Intercambio SDP.
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const sdpRes = await fetch("https://api.openai.com/v1/realtime/calls", {
        method: "POST",
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${clientSecret}`,
          "Content-Type": "application/sdp",
        },
      });

      if (!sdpRes.ok) {
        // El cuerpo de la respuesta dice el motivo real.
        const detalle = await sdpRes.text().catch(() => "");
        console.error("[tutor] intercambio SDP fallido", sdpRes.status, detalle);
        throw new ErrorParaAlumno(
          sdpRes.status === 401
            ? "La conexión caducó. Recarga la página y vuelve a intentarlo."
            : "No se pudo abrir el canal de voz. Inténtalo de nuevo.",
        );
      }

      await pc.setRemoteDescription({ type: "answer", sdp: await sdpRes.text() });
      arrancandoRef.current = false;
    } catch (e) {
      console.error("[tutor] no se pudo iniciar la sesión", e);
      setError(errorVisible(e));
      setStatus("error");
      arrancandoRef.current = false;
      stop();
    }
  }, [manejaEvento, mic, modo, nombre, stop, token, vigilaVoz]);

  /** Escribir en vez de hablar. */
  const sendText = useCallback(
    (texto: string) => {
      const limpio = texto.trim();
      const dc = dcRef.current;
      if (!limpio || !dc || dc.readyState !== "open") return;

      dc.send(
        JSON.stringify({
          type: "conversation.item.create",
          item: {
            type: "message",
            role: "user",
            content: [{ type: "input_text", text: limpio }],
          },
        }),
      );
      dc.send(JSON.stringify({ type: "response.create" }));

      upsertTurn(`t-${Date.now()}`, "student", limpio, false, false);
      registrarTurnoAlumno(limpio);
    },
    [registrarTurnoAlumno, upsertTurn],
  );

  /** Pulsar para hablar. */
  const empezarAHablar = useCallback(() => {
    const track = streamRef.current?.getAudioTracks()[0];
    if (track) track.enabled = true;
    setListening(true);
  }, []);

  const terminarDeHablar = useCallback(() => {
    const track = streamRef.current?.getAudioTracks()[0];
    if (track) track.enabled = false;
    setListening(false);

    const dc = dcRef.current;
    if (!dc || dc.readyState !== "open") return;
    dc.send(JSON.stringify({ type: "input_audio_buffer.commit" }));
    dc.send(JSON.stringify({ type: "response.create" }));
  }, []);

  const toggleMic = useCallback(() => {
    const track = streamRef.current?.getAudioTracks()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    setMicMuted(!track.enabled);
  }, []);

  // Cerrar al desmontar.
  useEffect(() => () => stop(), [stop]);

  return {
    status,
    error,
    turns,
    estimator,
    evidence,
    errorNotes,
    cost,
    micMuted,
    speaking,
    listening,
    /** Nivel con el que se entró, si se conocía. */
    bandaEntrada: bandaInicial,
    /** La banda con la que habla el tutor. */
    bandaPractica,
    /** true si se partió de un nivel conocido en vez de arrancar en frío. */
    nivelSembrado: bandaInicial !== undefined,
    vocabulario: vocabRef.current,
    modo,
    start,
    stop,
    sendText,
    toggleMic,
    empezarAHablar,
    terminarDeHablar,
  };
}

class ErrorParaAlumno extends Error {}

function errorVisible(e: unknown): string {
  if (e instanceof ErrorParaAlumno) return e.message;
  const t = e instanceof Error ? `${e.name} ${e.message}` : "";
  if (/NotAllowed|Permission/i.test(t)) return "Necesito permiso para usar el micrófono.";
  if (/NotFound/i.test(t)) return "No encuentro ningún micrófono conectado.";
  return "No se pudo iniciar la sesión. Inténtalo de nuevo.";
}

function mensajeDeError(codigo: string | undefined): string {
  switch (codigo) {
    case "invalid_token":
      return "Tu sesión caducó. Recarga la página para seguir.";
    case "rate_limited":
      return "Has abierto demasiadas sesiones en la última hora. Espera un poco.";
    case "ai_unavailable":
    case "bad_api_key":
      return "El asistente no está disponible ahora mismo.";
    default:
      return "No se pudo iniciar la sesión. Inténtalo de nuevo.";
  }
}
