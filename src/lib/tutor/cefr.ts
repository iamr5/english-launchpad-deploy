// cefr.ts — las bandas MCER y qué significa hablar en cada una.

export type Band = "A1" | "A2" | "B1" | "B2" | "C1";

export const BANDS = ["A1", "A2", "B1", "B2", "C1"] as const satisfies readonly Band[];

/** La banda como número 1..5, que es como la trata el estimador por dentro. */
export function bandIndex(b: Band): number {
  return BANDS.indexOf(b) + 1;
}

/** Vuelve de una puntuación continua (1..5) a la banda más cercana. */
export function bandFromScore(score: number): Band {
  const i = Math.min(BANDS.length - 1, Math.max(0, Math.round(score) - 1));
  return BANDS[i];
}

/** Recorta una puntuación al rango válido de bandas. */
export function clampScore(n: number): number {
  return Math.min(BANDS.length, Math.max(1, n));
}

export type SpeechProfile = {
  band: Band;
  /** Etiqueta corta para la UI. */
  label: string;
  /** Qué sabe hacer alguien en esta banda, en español, para el panel. */
  descriptorEs: string;
  /** Velocidad del habla del tutor (parámetro `speed` de la Realtime API). */
  speed: number;
  /** Tope de palabras en un turno normal del tutor. */
  maxWords: number;
  /** Tope cuando el tutor está EXPLICANDO algo que le han preguntado. */
  maxWordsExplicando: number;
  /** Longitud típica de frase que debe usar el tutor. */
  sentenceWords: string;
  /** Cuánto español puede usar el tutor como andamiaje. */
  spanishPolicy: string;
  /** Qué gramática puede usar el tutor sin pasarse de nivel. */
  grammar: string;
  /** Cómo corrige a esta altura. */
  correction: string;
  /** Temas que dan juego en esta banda. */
  topics: string;
  /** Cuánto espera el VAD antes de dar por terminado el turno. */
  eagerness: "low" | "medium" | "auto";
  /** Tope duro de tokens de salida. */
  maxOutputTokens: number;
  /** Silencio que se espera antes de dar por terminado su turno. */
  vadSilenceMs: number;
};

export const PROFILES: Record<Band, SpeechProfile> = {
  A1: {
    band: "A1",
    label: "A1 · Principiante",
    descriptorEs:
      "Entiende y usa frases muy básicas sobre sí mismo, su familia y su entorno inmediato. Necesita que le hablen despacio y claro.",
    speed: 0.8,
    maxWords: 25,
    maxWordsExplicando: 45,
    sentenceWords: "4 a 7 palabras",
    spanishPolicy:
      "Puedes usar español para dar una instrucción o traducir una palabra clave, pero nunca más de una frase corta seguida.",
    grammar:
      "Presente simple, verbo to be, can, there is/are, artículos, plurales, preguntas wh- simples. Nada de tiempos perfectos ni condicionales.",
    correction:
      "Corrige solo lo que impide entender. Repite la frase bien dicha de forma natural, sin dar una lección de gramática.",
    topics: "Nombre, familia, casa, comida, rutina diaria, números, colores, el clima.",
    eagerness: "low",
    maxOutputTokens: 540,
    vadSilenceMs: 2000,
  },
  A2: {
    band: "A2",
    label: "A2 · Básico",
    descriptorEs:
      "Se comunica en tareas simples y cotidianas. Describe su pasado, su entorno y necesidades inmediatas con frases sueltas.",
    speed: 0.85,
    maxWords: 40,
    maxWordsExplicando: 70,
    sentenceWords: "6 a 10 palabras",
    spanishPolicy:
      "Español solo para desbloquear una palabra que no sale. La conversación va en inglés.",
    grammar:
      "Añade pasado simple, going to, comparativos, adverbios de frecuencia, have to. Evita el perfecto y los condicionales.",
    correction:
      "Reformula lo que dijo mal dentro de tu respuesta, de modo que oiga la versión correcta sin que suene a regaño.",
    topics:
      "Trabajo, estudios, viajes cortos, compras, planes del fin de semana, experiencias recientes.",
    eagerness: "low",
    maxOutputTokens: 840,
    vadSilenceMs: 1800,
  },
  B1: {
    band: "B1",
    label: "B1 · Intermedio",
    descriptorEs:
      "Se maneja en la mayoría de situaciones de viaje o trabajo. Cuenta historias, da opiniones y explica motivos con cierta soltura.",
    speed: 0.95,
    maxWords: 60,
    maxWordsExplicando: 100,
    sentenceWords: "8 a 14 palabras",
    spanishPolicy:
      "Inglés mientras te siga. Si se pierde y no lo recuperas simplificando, explícaselo en español y vuelve al inglés enseguida.",
    grammar:
      "Añade presente perfecto, primer condicional, will, used to, oraciones de relativo y conectores de causa y contraste.",
    correction:
      "Señala un error por turno como máximo, el que más le cueste, y sigue la conversación. No interrumpas el hilo.",
    topics:
      "Opiniones, planes a futuro, anécdotas, comparar ciudades o costumbres, resolver un problema.",
    eagerness: "low",
    maxOutputTokens: 1200,
    vadSilenceMs: 1500,
  },
  B2: {
    band: "B2",
    label: "B2 · Intermedio alto",
    descriptorEs:
      "Habla con fluidez y espontaneidad. Argumenta, matiza y sostiene una conversación con nativos sin gran esfuerzo.",
    speed: 1.0,
    maxWords: 85,
    maxWordsExplicando: 145,
    sentenceWords: "12 a 20 palabras",
    spanishPolicy:
      "Solo inglés. Única excepción: desbloquear algo que no ha entendido después de dos intentos en inglés.",
    grammar:
      "Añade segundo y tercer condicional, voz pasiva, estilo indirecto, modales de deducción y perfecto continuo.",
    correction:
      "Corrige matices: colocaciones, registro, naturalidad. Ofrece una alternativa que suene más nativa.",
    topics: "Debate, ética profesional, tecnología, cultura, hipótesis, negociación.",
    eagerness: "medium",
    maxOutputTokens: 1740,
    vadSilenceMs: 1200,
  },
  C1: {
    band: "C1",
    label: "C1 · Avanzado",
    descriptorEs:
      "Se expresa con fluidez y precisión, incluso en temas complejos. Controla el registro y los matices idiomáticos.",
    speed: 1.0,
    maxWords: 120,
    maxWordsExplicando: 200,
    sentenceWords: "sin límite, habla con naturalidad",
    spanishPolicy: "Solo inglés.",
    grammar:
      "Todo el repertorio: inversión, estructuras enfáticas, subjuntivo, lenguaje idiomático.",
    correction:
      "Trabaja precisión y estilo. Señala lo que delata a un no nativo: preposiciones, colocaciones, ritmo.",
    topics:
      "Temas abstractos, argumentación densa, humor, matices culturales, lenguaje especializado.",
    eagerness: "auto",
    maxOutputTokens: 2400,
    vadSilenceMs: 1000,
  },
};

export type TurnMode = "auto" | "manual";

/** La configuración de detección de turno que va en la sesión. */
export function turnDetection(modo: TurnMode, band: Band) {
  if (modo === "manual") return null;
  return {
    type: "server_vad",
    threshold: 0.5,
    prefix_padding_ms: 300,
    silence_duration_ms: PROFILES[band].vadSilenceMs,
    interrupt_response: false,
  };
}

/** Participios irregulares frecuentes, más el patrón regular en -ed. */
const PART =
  "(?:been|had|done|made|gone|seen|taken|given|got|gotten|known|found|thought|told|become|left|felt|put|brought|begun|kept|held|written|stood|heard|let|meant|met|run|paid|sat|spoken|led|grown|lost|fallen|sent|built|understood|drawn|broken|spent|cut|risen|driven|bought|worn|chosen|eaten|forgotten|drunk|flown|read|said|come|won|taught|caught|sold|shown|slept|swum|sung|dealt|\\w+ed)";

export type Structure = {
  id: string;
  band: Band;
  /** Nombre en español, para el panel de evidencia. */
  labelEs: string;
  re: RegExp;
};

export const STRUCTURES: Structure[] = [
  {
    id: "be-present",
    band: "A1",
    labelEs: "verbo to be",
    re: /\b(i am|i'm|you are|you're|he is|she is|it is|he's|she's|it's|we are|they are|we're|they're)\b/i,
  },
  { id: "can", band: "A1", labelEs: "can / can't", re: /\b(can|can't|cannot)\s+\w+/i },
  {
    id: "there-is",
    band: "A1",
    labelEs: "there is / there are",
    re: /\bthere\s+(is|are|isn't|aren't)\b/i,
  },
  {
    id: "present-simple",
    band: "A1",
    labelEs: "presente simple",
    re: /\b(i|you|we|they)\s+(live|work|like|have|want|need|go|eat|study|speak)\b/i,
  },
  {
    id: "wh-question",
    band: "A1",
    labelEs: "pregunta wh-",
    re: /\b(what|where|when|who|how)\s+(is|are|do|does|can)\b/i,
  },

  {
    id: "past-simple",
    band: "A2",
    labelEs: "pasado simple",
    re: /\b(was|were|went|did|saw|made|took|came|got|said|told|bought|found|thought|\w+ed)\b/i,
  },
  {
    id: "going-to",
    band: "A2",
    labelEs: "going to (futuro)",
    re: /\b(am|is|are|'m|'s|'re)\s+going\s+to\s+\w+/i,
  },
  {
    id: "comparative",
    band: "A2",
    labelEs: "comparativos y superlativos",
    re: /\b(\w+er\s+than|more\s+\w+\s+than|the\s+most\s+\w+|the\s+\w+est)\b/i,
  },
  {
    id: "frequency",
    band: "A2",
    labelEs: "adverbios de frecuencia",
    re: /\b(always|usually|often|sometimes|never|rarely|hardly ever)\b/i,
  },
  {
    id: "have-to",
    band: "A2",
    labelEs: "have to / must (obligación)",
    re: /\b(have to|has to|had to|must)\s+\w+/i,
  },

  {
    id: "present-perfect",
    band: "B1",
    labelEs: "presente perfecto",
    re: new RegExp(
      "\\b(have|has|'ve|'s)\\s+(?:never\\s+|already\\s+|just\\s+|ever\\s+)?" + PART + "\\b",
      "i",
    ),
  },
  {
    id: "first-conditional",
    band: "B1",
    labelEs: "primer condicional",
    re: /\bif\s+[^.,!?]{2,40}\b(will|won't|'ll)\b/i,
  },
  { id: "used-to", band: "B1", labelEs: "used to (hábito pasado)", re: /\bused\s+to\s+\w+/i },
  {
    id: "relative-clause",
    band: "B1",
    labelEs: "oración de relativo",
    re: /\b\w+\s+(who|which|that|whose)\s+(is|are|was|were|has|have|can|\w+s)\b/i,
  },
  {
    id: "discourse-b1",
    band: "B1",
    labelEs: "conectores de causa y contraste",
    re: /\b(because of|although|even though|so that|in order to|however)\b/i,
  },

  {
    id: "second-conditional",
    band: "B2",
    labelEs: "segundo condicional",
    re: /\bif\s+[^.,!?]{2,40}\b(would|wouldn't|'d)\b|\bif\s+i\s+were\b/i,
  },
  {
    id: "third-conditional",
    band: "B2",
    labelEs: "tercer condicional",
    re: new RegExp("\\b(would|could|might)\\s+have\\s+" + PART + "\\b", "i"),
  },
  {
    id: "passive",
    band: "B2",
    labelEs: "voz pasiva",
    re: new RegExp(
      "\\b(is|are|was|were|been|being)\\s+(?:\\w+\\s+)?" +
        PART +
        "\\s+by\\b|\\b(is|are|was|were)\\s+" +
        PART +
        "\\b(?=\\s+(?:by|in|at|on|with))",
      "i",
    ),
  },
  {
    id: "perfect-continuous",
    band: "B2",
    labelEs: "perfecto continuo",
    re: /\b(have|has|had|'ve|'d)\s+been\s+\w+ing\b/i,
  },
  {
    id: "reported-speech",
    band: "B2",
    labelEs: "estilo indirecto",
    re: /\b(told me that|said that|asked me (if|whether)|wondered (if|whether))\b/i,
  },
  {
    id: "deduction",
    band: "B2",
    labelEs: "modales de deducción",
    re: new RegExp("\\b(must|might|can't|could)\\s+(?:have\\s+" + PART + "|be\\s+\\w+ing)\\b", "i"),
  },
  {
    id: "discourse-b2",
    band: "B2",
    labelEs: "conectores avanzados",
    re: /\b(nevertheless|nonetheless|despite|in spite of|whereas|on the other hand|as far as)\b/i,
  },

  {
    id: "inversion",
    band: "C1",
    labelEs: "inversión enfática",
    // El auxiliar va JUSTO detrás de "not only", no separado por el sujeto.
    re: /\b(not only\s+(do|does|did|is|was|were|has|have|can|could|will|would)\b|never before (have|has|did)|hardly had|no sooner had|rarely (do|does|did|have))\b/i,
  },
  {
    id: "cleft",
    band: "C1",
    labelEs: "oración escindida",
    re: /\b(what i (mean|want|need|find)\s+is|it (is|was) \w+ (who|that)|the (reason|thing) (why|that) [^.,!?]{2,30} is)\b/i,
  },
  {
    id: "subjunctive",
    band: "C1",
    labelEs: "subjuntivo formal",
    re: /\b(suggest|recommend|insist|demand|propose)\s+that\s+\w+\s+(be|not|have)\b|\bwere i to\b|\blest\b/i,
  },
  {
    id: "hedging",
    band: "C1",
    labelEs: "matización académica",
    re: /\b(arguably|to some extent|by and large|insofar as|albeit|notwithstanding)\b/i,
  },
];

export const CORE_WORDS = new Set<string>(
  `a about all also an and any are as at back be because been but by call can come could day did do does down
   each even first for from get give go good great had has have he her here him his how i if in into is it its
   just know like little long look made make man many may me more most much must my new no not now of off old on
   one only or other our out over people said same say see she should so some take than that the their them then
   there these they thing think this those time to two up us use very want was way we well went were what when
   where which who will with work would year you your am it's don't doesn't didn't can't won't isn't aren't
   wasn't weren't haven't hasn't we're they're you're he's she's that's there's let's i've i'll we'll they'll
   yes okay ok please thanks thank hello hi bye sorry maybe really always never sometimes usually often too
   again another around before between both country different eat end every family few find food friend
   home house keep last left life live love need next night nothing number own part place put right room school
   small still study talk tell three today together try under until walk water week while why word world write
   young name city job money morning big happy sad`
    .trim()
    .split(/\s+/)
    .filter(Boolean),
);
