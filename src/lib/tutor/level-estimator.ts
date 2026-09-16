// level-estimator.ts — de lo que el alumno dice a una banda MCER.

import {
  BANDS,
  CORE_WORDS,
  STRUCTURES,
  type Band,
  bandFromScore,
  bandIndex,
  clampScore,
} from "./cefr";

export type TurnMetrics = {
  /** Palabras EN INGLÉS. */
  words: number;
  /** Tokens totales, español incluido. */
  totalTokens: number;
  sentences: number;
  /** Palabras inglesas por oración. */
  mlu: number;
  /** Proporción de palabras inglesas fuera del núcleo (0..1). */
  beyondCore: number;
  /** Índice de Guiraud: tipos / raíz(tokens). */
  guiraud: number;
  /** Proporción de tokens que parecen españoles (0..1). */
  spanish: number;
  /** Proporción de tokens que son palabras función inglesas (0..1). */
  coreShare: number;
  /** Ids de estructuras detectadas en este turno. */
  structures: string[];
};

/** Marcas de que alguien se pasó al español. */
const SPANISH_HINTS =
  /^(que|qué|como|cómo|pero|porque|entonces|cuando|donde|dónde|ahora|también|muy|más|bien|hola|gracias|sí|yo|tú|el|la|los|las|un|una|de|del|para|por|con|mi|es|está|estoy|soy|tengo|hacer|puedo|quiero|nada|algo|todo|bueno|claro|vale|oye|este|esta|eso|así|cosa|decir|saber|dice|hay|ser|estar|mucho|poco|siempre|nunca|ingles|inglés|difícil|dificil)$/i;

const ACCENTED = /[áéíóúñü¿¡]/i;

/** El alumno pidiendo que le hablen en español. */
const PIDE_ESPANOL =
  /\b(?:in|en|using|usando|use|usa|speak|habla|hablar|explain|explica|expl[íi]ca\w*|translate|traduce|teach|ense[nñ]a\w*|prefer|prefiero|prefer[íi]a)\b[^.!?]{0,70}\b(?:spanish|espa[nñ]ol)\b|\b(?:spanish|espa[nñ]ol)\b[^.!?]{0,45}\b(?:please|por favor|instead|en vez|mejor|base language|idioma base)\b/i;

export function pideEspanol(texto: string): boolean {
  return PIDE_ESPANOL.test(texto || "");
}

// Decir "no entiendo" no encajaba en NADA: PIDE_ESPANOL exige un verbo junto a la
// palabra "español", y lostRate solo lo movía el observador, tres turnos más
// tarde. Se podía repetir cinco veces seguidas sin que cambiara una coma.
const NO_ENTIENDE =
  /\bno (?:te |lo )?(?:entiendo|entend[íi]|comprendo|pillo)|\bno s[ée] qu[ée] (?:dices|significa|es)\b|\bm[áa]s despacio\b|\b(?:rep[ií]te(?:lo)?|otra vez|c[óo]mo dices)\b|\bi (?:don'?t|do not) (?:understand|get it)\b/i;

export function noEntiende(texto: string): boolean {
  return NO_ENTIENDE.test(texto || "");
}

function tokenize(text: string): string[] {
  return (text.toLowerCase().match(/[a-záéíóúñü']+/gi) || []).filter((w) => w.length > 0);
}

/** Mide un turno del alumno. */
export function measureTurn(text: string): TurnMetrics {
  const clean = (text || "").trim();
  const tokens = tokenize(clean);
  const totalTokens = tokens.length;

  if (totalTokens === 0) {
    return {
      words: 0,
      totalTokens: 0,
      sentences: 0,
      mlu: 0,
      beyondCore: 0,
      guiraud: 0,
      spanish: 0,
      coreShare: 0,
      structures: [],
    };
  }

  const english: string[] = [];
  let spanish = 0;
  for (const t of tokens) {
    if (SPANISH_HINTS.test(t) || ACCENTED.test(t)) spanish++;
    else english.push(t);
  }

  const words = english.length;

  // Las transcripciones de voz puntúan mal: sin signos, cuenta como una oración.
  const sentences = Math.max(1, (clean.match(/[.!?]+/g) || []).length);

  let beyond = 0;
  let core = 0;
  const types = new Set<string>();
  for (const t of english) {
    types.add(t);
    if (CORE_WORDS.has(t)) core++;
    else beyond++;
  }

  const structures = STRUCTURES.filter((s) => s.re.test(clean)).map((s) => s.id);

  return {
    words,
    totalTokens,
    sentences,
    mlu: words / sentences,
    beyondCore: words ? beyond / words : 0,
    guiraud: words ? types.size / Math.sqrt(words) : 0,
    spanish: spanish / totalTokens,
    coreShare: core / totalTokens,
    structures,
  };
}

export type EstimatorState = {
  /** Estimación continua en 1..5. */
  score: number;
  /** Banda que se le muestra al alumno y con la que habla el tutor. */
  band: Band;
  /** 0..1. */
  confidence: number;
  /** Repertorio gramatical demostrado en toda la sesión: id -> veces visto. */
  repertoire: Record<string, number>;
  totalWords: number;
  turns: number;
  /** Turnos desde el último cambio de banda. */
  turnsSinceChange: number;
  /** Media móvil de la tasa de error que reporta el observador (0..1). */
  errorRate: number;
  /** Media móvil de cuánto se cae al español (0..1). */
  spanishRate: number;
  /** Media móvil de cuánto le cuesta ENTENDER al tutor (0..1). */
  lostRate: number;
  /** El alumno ha pedido de forma explícita que le expliquen en español. */
  pidioEspanol: boolean;
};

/** Banda de arranque cuando no se conoce el nivel. */
export const INITIAL_BAND: Band = "A2";

export function initialState(seed: Band = INITIAL_BAND): EstimatorState {
  return {
    score: bandIndex(seed),
    band: seed,
    confidence: 0,
    repertoire: {},
    totalWords: 0,
    turns: 0,
    turnsSinceChange: 0,
    errorRate: 0,
    spanishRate: 0,
    lostRate: 0,
    pidioEspanol: false,
  };
}

/** Del repertorio acumulado a una puntuación. */
function repertoireScore(repertoire: Record<string, number>): number | null {
  const porBanda = new Map<Band, number>();
  for (const id of Object.keys(repertoire)) {
    const s = STRUCTURES.find((x) => x.id === id);
    if (!s) continue;
    porBanda.set(s.band, (porBanda.get(s.band) || 0) + 1);
  }
  if (porBanda.size === 0) return null;

  let demostrada = 0;
  let asomando = 0;
  BANDS.forEach((b, i) => {
    const n = porBanda.get(b) || 0;
    if (n >= 2) demostrada = Math.max(demostrada, i + 1);
    if (n >= 1) asomando = Math.max(asomando, i + 1);
  });

  if (demostrada === 0) return asomando > 0 ? 1 : null;
  return demostrada + (asomando > demostrada ? 0.5 : 0);
}

/** Palabras por oración → banda. */
function lengthScore(mlu: number): number {
  if (mlu < 6) return 1;
  if (mlu < 11) return 2;
  if (mlu < 16) return 3;
  return 4;
}

/** Riqueza léxica → banda. */
function lexicalScore(beyondCore: number, guiraud: number): number {
  let s: number;
  if (guiraud < 2.9) s = 1;
  else if (guiraud < 3.4) s = 2;
  else if (guiraud < 3.9) s = 3;
  else if (guiraud < 4.3) s = 4;
  else s = 5;

  // La proporción fuera del núcleo queda de corrector fino: es para lo que da.
  if (beyondCore > 0.38) s += 0.5;
  else if (beyondCore < 0.26) s -= 0.5;

  return clampScore(s);
}

const PESO = { repertorio: 0.45, extension: 0.3, lexico: 0.25 };

export type ObserverSignal = {
  /** Errores confirmados por el observador en este turno. */
  errorCount?: number;
  /** Estructuras que el observador confirma, por si el regex no las pilló. */
  confirmedStructures?: string[];
};

/** Incorpora un turno del alumno y devuelve el estado nuevo. */
export function ingestTurn(
  prev: EstimatorState,
  text: string,
  signal: ObserverSignal = {},
): EstimatorState {
  const m = measureTurn(text);
  const pidioEspanol = prev.pidioEspanol || pideEspanol(text);
  // Un "no entiendo" pesa la mitad de lo acumulado: uno hace que simplifique,
  // dos seguidos cruzan el 0.5 y pasan a explicarle en español.
  const lostRate = noEntiende(text) ? ema(prev.lostRate, 1, 0.5) : prev.lostRate;

  // Un "yes" o un "ok" no dicen nada del nivel de nadie.
  if (m.totalTokens < 3 || m.words < 3 || (m.totalTokens >= 4 && m.coreShare < 0.3)) {
    return {
      ...prev,
      pidioEspanol,
      lostRate,
      turns: prev.turns + 1,
      turnsSinceChange: prev.turnsSinceChange + 1,
    };
  }

  const repertoire = { ...prev.repertoire };
  for (const id of m.structures) repertoire[id] = (repertoire[id] || 0) + 1;
  for (const id of signal.confirmedStructures || []) {
    if (STRUCTURES.some((s) => s.id === id)) repertoire[id] = (repertoire[id] || 0) + 1;
  }

  const totalWords = prev.totalWords + m.words;
  const turns = prev.turns + 1;

  const rep = repertoireScore(repertoire);
  const len = lengthScore(m.mlu);
  const lex = lexicalScore(m.beyondCore, m.guiraud);

  // Sin repertorio aún, su peso se reparte entre las otras dos señales.
  const bruto =
    rep === null
      ? (len * PESO.extension + lex * PESO.lexico) / (PESO.extension + PESO.lexico)
      : rep * PESO.repertorio + len * PESO.extension + lex * PESO.lexico;

  const errorRate = ema(prev.errorRate, ratioErrores(signal.errorCount, m.words), 0.3);
  const spanishRate = ema(prev.spanishRate, m.spanish, 0.35);

  // Hasta medio punto por densidad de error.
  const castigo = Math.min(0.5, errorRate * 1.5);
  const objetivo = clampScore(bruto - castigo);

  const pesoTurno = Math.min(1, Math.max(0.3, m.totalTokens / 30));
  const alpha = (turns <= 3 ? 0.5 : 0.28) * pesoTurno;
  const score = clampScore(ema(prev.score, objetivo, alpha));

  // Confianza: palabras Y turnos, no solo palabras.
  const confidence = Math.min(
    1,
    0.6 * Math.min(1, totalWords / 180) + 0.4 * Math.min(1, turns / 10),
  );

  const next: EstimatorState = {
    ...prev,
    pidioEspanol,
    lostRate,
    score,
    confidence,
    repertoire,
    totalWords,
    turns,
    turnsSinceChange: prev.turnsSinceChange + 1,
    errorRate,
    spanishRate,
  };

  return aplicarHisteresis(next);
}

function ratioErrores(errorCount: number | undefined, words: number): number {
  if (typeof errorCount !== "number" || !Number.isFinite(errorCount)) return 0;
  // Errores por cada 10 palabras, acotado.
  return Math.min(1, errorCount / Math.max(1, words / 10));
}

function ema(anterior: number, nuevo: number, alpha: number): number {
  return anterior + alpha * (nuevo - anterior);
}

/** Decide si la banda mostrada se mueve. */
function aplicarHisteresis(s: EstimatorState): EstimatorState {
  if (s.confidence < 0.35) return s;

  const actual = bandIndex(s.band);
  const propuesta = bandFromScore(s.score);
  if (propuesta === s.band) return s;

  const subiendo = bandIndex(propuesta) > actual;
  const margen = Math.abs(s.score - actual);
  const margenMin = subiendo ? 0.55 : 0.6;
  const turnosMin = subiendo ? 2 : 3;

  if (margen < margenMin || s.turnsSinceChange < turnosMin) return s;

  return { ...s, band: propuesta, turnsSinceChange: 0 };
}

/** Si el tutor debe apoyarse en el español como vehículo, no solo como rescate. */
export function necesitaEspanol(s: EstimatorState): boolean {
  return s.pidioEspanol || s.band === "A1" || s.lostRate > 0.5;
}

/** Incorpora lo que el observador confirmó sobre turnos YA procesados. */
export function applyObservation(
  prev: EstimatorState,
  obs: {
    errorCount: number;
    wordsObserved: number;
    confirmedStructures: string[];
    unclearAudio?: boolean;
    /** Si el alumno pudo seguir lo que el tutor le dijo. */
    comprehension?: "followed" | "partial" | "lost";
  },
): EstimatorState {
  // Una transcripción rota no es evidencia de nada.
  if (obs.unclearAudio) return prev;

  const repertoire = { ...prev.repertoire };
  for (const id of obs.confirmedStructures) {
    if (STRUCTURES.some((s) => s.id === id)) repertoire[id] = (repertoire[id] || 0) + 1;
  }

  const errorRate = ema(
    prev.errorRate,
    ratioErrores(obs.errorCount, Math.max(1, obs.wordsObserved)),
    0.3,
  );

  // Comprensión: la señal más directa de que el tutor va por encima del alumno.
  const perdido = obs.comprehension === "lost" ? 1 : obs.comprehension === "partial" ? 0.4 : 0;
  const lostRate =
    obs.comprehension === undefined ? prev.lostRate : ema(prev.lostRate, perdido, 0.45);

  const rep = repertoireScore(repertoire);
  const castigo = Math.min(0.5, errorRate * 1.5) + Math.min(1.2, lostRate * 1.6);

  // Confirmar estructuras puede desbloquear una banda superior; decide la histéresis.
  const objetivo = rep === null ? prev.score - castigo : rep - castigo;
  const alpha = lostRate > 0.5 ? 0.35 : 0.15;
  const score = clampScore(ema(prev.score, clampScore(objetivo), alpha));

  return aplicarHisteresis({ ...prev, repertoire, errorRate, lostRate, score });
}

export type Evidence = {
  /** Estructuras demostradas, agrupadas por banda y ordenadas de alta a baja. */
  demostrado: { band: Band; labelEs: string; veces: number }[];
  /** Frase en español que resume por qué está en esa banda. */
  resumenEs: string;
};

/** Traduce el estado a algo que un alumno pueda leer. */
export function explain(s: EstimatorState): Evidence {
  const demostrado = Object.entries(s.repertoire)
    .map(([id, veces]) => {
      const def = STRUCTURES.find((x) => x.id === id);
      return def ? { band: def.band, labelEs: def.labelEs, veces } : null;
    })
    .filter((x): x is { band: Band; labelEs: string; veces: number } => x !== null)
    .sort((a, b) => bandIndex(b.band) - bandIndex(a.band) || b.veces - a.veces);

  const partes: string[] = [];
  if (s.confidence < 0.35) {
    partes.push(
      "Todavía estoy escuchando: hace falta que hables un poco más para estimar tu nivel.",
    );
  } else {
    const alto = demostrado[0];
    if (alto) partes.push(`Has usado ${alto.labelEs} (nivel ${alto.band}).`);
    partes.push(`Tu repertorio cubre ${demostrado.length} estructuras distintas.`);
    if (s.lostRate > 0.4)
      partes.push("Te está costando seguir al tutor, así que he bajado el nivel al que te habla.");
    if (s.errorRate > 0.4) partes.push("La densidad de errores sugiere consolidar lo básico.");
  }

  return { demostrado, resumenEs: partes.join(" ") };
}
