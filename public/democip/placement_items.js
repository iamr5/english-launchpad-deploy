/* ============================================================================
   placement_items.js — banco de ítems del test de ubicación (A1–C1)

   ESTE ES EL ARCHIVO QUE SE EDITA PARA CAMBIAR EL TEST.
   placement.html no contiene ninguna pregunta: solo las presenta y las puntúa.

   Estructura de cada ítem:
     id     identificador estable. NO lo cambies una vez que el ítem salió a
            producción: es la llave con la que se acumulan las respuestas para
            calibrarlo después.
     band   'A1'|'A2'|'B1'|'B2'|'C1' — nivel MCER que el ítem pretende medir.
            OJO: es la dificultad *estimada por quien lo escribió*, no medida.
            Se corrige con datos reales (ver PLACEMENT-README.md §4).
     skill  'uso'    = gramática en contexto (Use of English)
            'vocab'  = vocabulario en contexto
            'lectura'= comprensión de un texto corto
     q      enunciado. El hueco se marca con ___
     opts   4 alternativas. Siempre 4, para que el acierto al azar sea 25%.
     a      índice (0-3) de la correcta.
     tag    qué estructura mide. Sirve para el reporte diagnóstico y para
            detectar huecos cuando se amplíe el banco.

   Contextos: se usan situaciones profesionales y de oficina, apropiadas para
   el público del Colegio de Ingenieros. IMPORTANTE: ningún ítem debe requerir
   conocimiento técnico de ingeniería para responderse — se mide inglés, no
   ingeniería. Si un ítem solo lo puede responder un especialista, está mal
   escrito.

   Para ampliar el banco: agrega ítems con id nuevo manteniendo 8 por banda,
   o cambia ITEMS_POR_BANDA en placement.html si cambias la cantidad.
   ========================================================================== */

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
