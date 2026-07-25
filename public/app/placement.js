// placement.js — Test de ubicación MCER (A1–C1), forma fija.
// Portado del standalone "Test de ubicación · AprendoEnglish.html".
// Este archivo trae SOLO el banco de ítems + el scoring; la UI vive en
// index.html (#screen-placement) con la mascota Ozzy y el estilo de la app.
// Los puntos de corte son PROVISIONALES (fijados por juicio, no medidos).

window.PLACEMENT_ITEMS = [

  /* ══════════════════ A1 ══════════════════
     Presente simple, verbo to be, artículos, there is/are, can,
     preposiciones básicas de lugar, preguntas wh-. */

  { id: 'a1-01', band: 'A1', skill: 'uso', tag: 'verbo to be',
    q: 'My name ___ Carlos and I work in Lima.',
    opts: ['is', 'am', 'are', 'be'], a: 0 },

  { id: 'a1-02', band: 'A1', skill: 'uso', tag: 'presente simple 3.ª persona',
    q: 'My sister ___ in an office downtown.',
    opts: ['work', 'works', 'working', 'is work'], a: 1 },

  { id: 'a1-03', band: 'A1', skill: 'uso', tag: 'there is / there are',
    q: 'There ___ three computers in the room.',
    opts: ['is', 'are', 'has', 'have'], a: 1 },

  { id: 'a1-04', band: 'A1', skill: 'uso', tag: 'can (habilidad)',
    q: 'I ___ speak a little English.',
    opts: ['can to', 'am can', 'can', 'cans'], a: 2 },

  { id: 'a1-05', band: 'A1', skill: 'uso', tag: 'pregunta wh-',
    q: '"___ is your phone number?" "It\u2019s 987 654 321."',
    opts: ['Who', 'What', 'When', 'Where'], a: 1 },

  { id: 'a1-06', band: 'A1', skill: 'uso', tag: 'preposición de lugar',
    q: 'The report is ___ the desk.',
    opts: ['in', 'on', 'to', 'of'], a: 1 },

  { id: 'a1-07', band: 'A1', skill: 'uso', tag: 'artículo a / an',
    q: 'She is ___ engineer.',
    opts: ['a', 'an', 'the', '\u2014 (nada)'], a: 1 },

  { id: 'a1-08', band: 'A1', skill: 'vocab', tag: 'from ... to (tiempo)',
    q: 'We work from Monday ___ Friday.',
    opts: ['to', 'at', 'in', 'for'], a: 0 },

  /* ══════════════════ A2 ══════════════════
     Pasado simple, comparativos, going to, presente continuo,
     some/any, adverbios de frecuencia, have to. */

  { id: 'a2-01', band: 'A2', skill: 'uso', tag: 'pasado simple irregular',
    q: 'We ___ the drawings to the client yesterday.',
    opts: ['send', 'sended', 'sent', 'sending'], a: 2 },

  { id: 'a2-02', band: 'A2', skill: 'uso', tag: 'comparativo',
    q: 'This machine is ___ than the old one.',
    opts: ['more fast', 'faster', 'fastest', 'the fastest'], a: 1 },

  { id: 'a2-03', band: 'A2', skill: 'uso', tag: 'be going to (plan)',
    q: 'Tomorrow we ___ visit the construction site.',
    opts: ['go to', 'are going to', 'will going', 'are go to'], a: 1 },

  { id: 'a2-04', band: 'A2', skill: 'uso', tag: 'presente continuo',
    q: 'Please be quiet \u2014 I ___ on the phone with a supplier.',
    opts: ['talk', 'am talking', 'talks', 'was talk'], a: 1 },

  { id: 'a2-05', band: 'A2', skill: 'uso', tag: 'some / any',
    q: 'Is there ___ water in the tank?',
    opts: ['some', 'any', 'a', 'much of'], a: 1 },

  { id: 'a2-06', band: 'A2', skill: 'uso', tag: 'adverbio de frecuencia',
    q: 'I ___ go to the office by bus.',
    opts: ['usually', 'use', 'using', 'usual'], a: 0 },

  { id: 'a2-07', band: 'A2', skill: 'uso', tag: 'have to (obligación)',
    q: 'You ___ wear a helmet on site. It\u2019s a rule.',
    opts: ['have to', 'have', 'having to', 'has to'], a: 0 },

  { id: 'a2-08', band: 'A2', skill: 'vocab', tag: 'verbo frecuente',
    q: 'The meeting was ___ because the manager was ill.',
    opts: ['cancelled', 'closed', 'finished', 'stopped'], a: 0 },

  /* ══════════════════ B1 ══════════════════
     Presente perfecto vs pasado simple, condicionales 1 y 2, pasiva,
     relativos, used to, estilo indirecto, phrasal verbs frecuentes. */

  { id: 'b1-01', band: 'B1', skill: 'uso', tag: 'presente perfecto + since',
    q: 'I ___ this software since 2020.',
    opts: ['use', 'used', 'have used', 'am using'], a: 2 },

  { id: 'b1-02', band: 'B1', skill: 'uso', tag: 'primer condicional',
    q: 'If the budget ___ approved, we will start in May.',
    opts: ['is', 'will be', 'would be', 'was'], a: 0 },

  { id: 'b1-03', band: 'B1', skill: 'uso', tag: 'pasiva en pasado',
    q: 'The bridge ___ in 1998.',
    opts: ['built', 'was built', 'is built', 'has built'], a: 1 },

  { id: 'b1-04', band: 'B1', skill: 'uso', tag: 'pronombre relativo',
    q: 'The engineer ___ designed the system works in our office.',
    opts: ['which', 'what', 'who', 'whose'], a: 2 },

  { id: 'b1-05', band: 'B1', skill: 'uso', tag: 'used to',
    q: 'I ___ work in Cusco, but now I live in Lima.',
    opts: ['use to', 'used to', 'am used to', 'was used'], a: 1 },

  { id: 'b1-06', band: 'B1', skill: 'uso', tag: 'segundo condicional',
    q: 'If I had more time, I ___ take an evening course.',
    opts: ['will', 'would', 'had', 'am going to'], a: 1 },

  { id: 'b1-07', band: 'B1', skill: 'vocab', tag: 'phrasal verb',
    q: 'We need to ___ the meeting until next week.',
    opts: ['put off', 'put on', 'put up', 'put out'], a: 0 },

  { id: 'b1-08', band: 'B1', skill: 'lectura', tag: 'inferencia en texto corto',
    q: 'Lee: "The site visit is on Thursday. If it rains, we will go on Friday instead." \u2014 ¿Qué es cierto?',
    opts: [
      'The visit is definitely on Friday.',
      'The visit may change to Friday.',
      'The visit was cancelled.',
      'The visit happens on both days.'
    ], a: 1 },

  /* ══════════════════ B2 ══════════════════
     Tercer condicional, modales perfectos, wish, pasiva de reporte,
     cláusulas de participio, conectores de contraste, colocaciones. */

  { id: 'b2-01', band: 'B2', skill: 'uso', tag: 'tercer condicional',
    q: 'If we ___ the fault earlier, the machine wouldn\u2019t have failed.',
    opts: ['noticed', 'had noticed', 'would notice', 'have noticed'], a: 1 },

  { id: 'b2-02', band: 'B2', skill: 'uso', tag: 'modal perfecto (deducción)',
    q: 'She isn\u2019t answering her phone. She ___ already left the office.',
    opts: ['must have', 'must', 'should', 'can have'], a: 0 },

  { id: 'b2-03', band: 'B2', skill: 'uso', tag: 'wish + pasado',
    q: 'I wish I ___ more about structural design.',
    opts: ['know', 'knew', 'have known', 'would know'], a: 1 },

  { id: 'b2-04', band: 'B2', skill: 'uso', tag: 'pasiva de reporte',
    q: 'The project ___ to be completed next month.',
    opts: ['expects', 'is expected', 'has expected', 'is expecting'], a: 1 },

  { id: 'b2-05', band: 'B2', skill: 'uso', tag: 'conector de contraste',
    q: 'The design is elegant; ___, it is too expensive to build.',
    opts: ['therefore', 'moreover', 'however', 'besides'], a: 2 },

  { id: 'b2-06', band: 'B2', skill: 'uso', tag: 'cláusula de participio',
    q: '___ the report, she sent it straight to the client.',
    opts: ['Having finished', 'Finish', 'She finished', 'To finish'], a: 0 },

  { id: 'b2-07', band: 'B2', skill: 'vocab', tag: 'colocación formal',
    q: 'The team ___ a thorough analysis of the risks.',
    opts: ['made', 'did', 'carried out', 'took out'], a: 2 },

  { id: 'b2-08', band: 'B2', skill: 'lectura', tag: 'actitud del autor',
    q: 'Lee: "While the new method is undeniably faster, its long-term reliability remains unproven." \u2014 La postura del autor es:',
    opts: [
      'Totalmente a favor del método.',
      'Totalmente en contra del método.',
      'Reconoce una ventaja pero mantiene reservas.',
      'No tiene opinión sobre el método.'
    ], a: 2 },

  /* ══════════════════ C1 ══════════════════
     Inversión, estructuras enfáticas, subjuntivo formal, matices de
     modalidad, colocación avanzada, registro académico. */

  { id: 'c1-01', band: 'C1', skill: 'uso', tag: 'inversión tras not only',
    q: 'Not only ___ the deadline, but they also reduced costs.',
    opts: ['they met', 'did they meet', 'met they', 'they did meet'], a: 1 },

  { id: 'c1-02', band: 'C1', skill: 'uso', tag: 'estructura enfática (cleft)',
    q: 'It was the safety report ___ finally changed their minds.',
    opts: ['what', 'which it', 'that', 'who'], a: 2 },

  { id: 'c1-03', band: 'C1', skill: 'uso', tag: 'inversión tras adverbio negativo',
    q: 'Rarely ___ such a well-documented proposal.',
    opts: ['we have seen', 'have we seen', 'we saw', 'did we saw'], a: 1 },

  { id: 'c1-04', band: 'C1', skill: 'uso', tag: 'subjuntivo formal',
    q: 'The committee recommended that the design ___ revised before approval.',
    opts: ['is', 'be', 'was', 'will be'], a: 1 },

  { id: 'c1-05', band: 'C1', skill: 'vocab', tag: 'colocación avanzada',
    q: 'The new regulation has far-reaching ___ for the whole industry.',
    opts: ['implications', 'meanings', 'reasons', 'affects'], a: 0 },

  { id: 'c1-06', band: 'C1', skill: 'vocab', tag: 'expresión idiomática',
    q: 'The proposal was rejected out of ___, without any discussion.',
    opts: ['hand', 'place', 'order', 'reach'], a: 0 },

  { id: 'c1-07', band: 'C1', skill: 'uso', tag: 'conector de matiz',
    q: 'The method is robust. ___, it is not without limitations.',
    opts: ['That said', 'So that', 'Even so much', 'By the way'], a: 0 },

  { id: 'c1-08', band: 'C1', skill: 'lectura', tag: 'matiz de cobertura (hedging)',
    q: 'Lee: "The data would seem to suggest a correlation, albeit a tentative one." \u2014 ¿Qué grado de certeza expresa el autor?',
    opts: [
      'Certeza total: la correlación está probada.',
      'Certeza baja y cautelosa: la correlación es provisional.',
      'Rechazo: no existe ninguna correlación.',
      'Sorpresa ante un resultado inesperado.'
    ], a: 1 },

];


// ── Scoring / ubicación ─────────────────────────────────────────────────────
window.PLACEMENT = (function () {
  const BANDS = ['A1', 'A2', 'B1', 'B2', 'C1'];
  const UMBRAL = 5;          // aciertos (de 8) para superar una banda
  const CORTE_ABANDONO = 2;  // si una banda saca esto o menos, se detiene el test
  // Nivel estimado (escalera de dominio) → módulo del curso donde arranca.
  // Conservador: "quedarse corto cuesta menos que pasarse". Pre-A1 y A1 → módulo A1.
  const LVL_TO_MODULE = { 'Pre-A1': 0, 'A1': 0, 'A2': 1, 'B1': 2, 'B2': 3, 'C1': 4 };
  const DESC = {
    'Pre-A1': 'Empiezas desde cero. El curso arranca justo desde aquí.',
    'A1': 'Entiendes y usas frases muy básicas del día a día.',
    'A2': 'Te manejas en situaciones simples y rutinarias.',
    'B1': 'Te desenvuelves en la mayoría de situaciones de trabajo y viaje.',
    'B2': 'Te comunicas con fluidez y discutes temas de tu especialidad.',
    'C1': 'Usas el idioma con flexibilidad para fines profesionales y académicos.'
  };

  // Ítems en orden A1→C1.
  function order() {
    const o = [];
    BANDS.forEach(b => (window.PLACEMENT_ITEMS || []).filter(it => it.band === b).forEach(it => o.push(it)));
    return o;
  }
  // Baraja índices 0..n-1 (para que la posición de la respuesta no sea adivinable).
  function shuffle(n) {
    const a = Array.from({ length: n }, (_, i) => i);
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  // ¿la banda recién terminada dispara el abandono? answers: [{band, ok}]
  function shouldStop(answers, band) {
    return answers.filter(r => r.band === band && r.ok).length <= CORTE_ABANDONO;
  }
  // Nivel = banda más alta tal que ella y TODAS las anteriores llegaron al umbral.
  function level(answers) {
    const porBanda = {};
    BANDS.forEach(b => { const rs = answers.filter(r => r.band === b); if (rs.length) porBanda[b] = { ok: rs.filter(r => r.ok).length, n: rs.length }; });
    let nivel = 'Pre-A1';
    for (const b of BANDS) { if ((porBanda[b] ? porBanda[b].ok : 0) >= UMBRAL) nivel = b; else break; }
    return { nivel, porBanda, module: LVL_TO_MODULE[nivel], desc: DESC[nivel] || '' };
  }
  return { BANDS, UMBRAL, CORTE_ABANDONO, LVL_TO_MODULE, DESC, order, shuffle, shouldStop, level };
})();
