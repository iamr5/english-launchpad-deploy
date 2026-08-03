// data_modulo3.js — Módulo 3 (Nivel B1, rumbo al PET).
// Self-contained: registers itself onto window.COURSE_DATA. Do NOT add these
// lessons to data.js. Helpers are redeclared locally inside the IIFE so they
// don't collide with data.js's top-level `const mc/rebuild/tap`.
(function () {
  const mc = (question, options, correctIndex) => ({ type: 'mc', question, options, correctIndex });
  const rebuild = (question, correctSentence, wordBlocks) => ({ type: 'rebuild', question, correctSentence, wordBlocks });
  const tap = (question, sentenceTokens, errorTokenIndex, correctedToken) => ({ type: 'tap', question, sentenceTokens, errorTokenIndex, correctedToken });

  const modulo3_1 = {
    id: 'modulo3-1',
    title: 'Microlección 1',
    durationMinutes: 13,
    audioCues: ['Escucha el contenido de la lección.', 'Fíjate en los puntos clave.', 'Ahora vienen tus ejercicios.'],
    contentBlocks: [
      { id: 'modulo3-1-titulo', type: 'titulo', title: '¿Ya pasó… o sigue pasando?', subtitle: 'Presente Perfecto vs. Pasado Simple', markdown: '' },
      { id: 'modulo3-1-mision', type: 'mision', markdown: `Diferenciar **cuándo usar el Presente Perfecto** (*have/has + participio pasado*) y **cuándo usar el Pasado Simple** (*verbo en pasado*) al hablar de **experiencias o acciones pasadas**. Al terminar sabrás contar lo que hiciste **ayer** ⏪ y lo que **has hecho** en la vida 🌍 sin revolverlos.` },
      { id: 'modulo3-1-intro', type: 'intro', markdown: `¡Hola, soy **{{mascot}}** {{mascotEmoji}}! En esta misión **viajaremos al pasado** ⏳ y hablaremos de cosas que **ya pasaron**.

Quiero que pienses en una **foto antigua** 📸 o en tu **día de ayer**: ¿lo contarías igual? El **Presente Perfecto** y el **Pasado Simple** son tiempos verbales muy importantes para hablar del pasado en inglés.

¡Hoy descubrirás **cuándo usar cada uno**! Manos a la obra, que arrancamos.` },
      { id: 'modulo3-1-teoria-1', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**1.** **Pasado Simple: un momento exacto**

Usamos el **Pasado Simple** para acciones **completadas en un tiempo específico** del pasado (*ayer*, *el año pasado*, etc.). El momento está **claro**. 📍

* *I visited Berlin last year.* → *Visité Berlín el año pasado.*
* *I lost my keys yesterday.* → *Perdí mis llaves ayer.* (momento claro)
* *I lived in Japan for five years.* → *Viví en Japón cinco años.* (acción concluida)

  | Español                       | Inglés                       |
  | ----------------------------- | ---------------------------- |
  | Visité Berlín el año pasado.  | I visited Berlin last year.  |
  | Perdí mis llaves ayer.        | I lost my keys yesterday.    |

> 🚏 **Pista clave:** si dices **cuándo** pasó (*yesterday, last year, in 2010*), casi siempre va **Pasado Simple**.`,
        miniQuiz: [
          mc('"Visité Berlín el año pasado." (momento exacto)', ['I have visited Berlin last year.', 'I visited Berlin last year.', 'I visit Berlin last year.', 'I was visit Berlin last year.'], 1),
          mc('¿Qué tiempo usamos con "yesterday" o "last year"?', ['Presente Perfecto', 'Pasado Simple', 'Presente Continuo', 'Futuro'], 1),
          mc('"Perdí mis llaves ayer." se dice:', ['I have lost my keys yesterday.', 'I lost my keys yesterday.', 'I lose my keys yesterday.', 'I am lost my keys yesterday.'], 1),
          mc('El Pasado Simple sirve para acciones que están:', ['en progreso ahora', 'completadas en un momento específico del pasado', 'sin fecha, con resultado actual', 'que pasarán mañana'], 1),
          mc('"Viví en Japón cinco años (ya terminó)."', ['I have lived in Japan for five years.', 'I lived in Japan for five years.', 'I live in Japan for five years.', 'I was living in Japan five years.'], 1),
          tap('Toca la palabra incorrecta:', ['Last', 'year', 'I', 'visited', 'Berlin', 'and', 'see', 'the', 'wall.'], 6, 'saw'),
          tap('Toca la palabra incorrecta:', ['In', '2010', 'I', 'live', 'in', 'Japan', 'and', 'worked', 'there.'], 3, 'lived'),
          rebuild('Escucha y reconstruye:', 'I visited Berlin last year', ['I', 'visited', 'Berlin', 'last', 'year', 'have', 'visit', 'visits', 'been']),
        ] },
      { id: 'modulo3-1-teoria-2', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**2.** **Presente Perfecto: experiencia y resultado**

El **Presente Perfecto** se usa cuando el **momento exacto no importa** o **no lo decimos**, o para acciones que **empezaron en el pasado y siguen hasta ahora**. Estructura: **have/has + participio pasado** (*have eaten* = *he comido*).

* *I have been to Spain three times.* → *He estado en España tres veces.* (no digo cuándo)
* *I have lost my keys.* → *He perdido mis llaves.* (no digo cuándo)
* *Have you ever traveled by plane?* → *¿Alguna vez has viajado en avión?*

**Truco:** el Presente Perfecto suele venir con **ever, never, already, just**, y destaca el **RESULTADO actual**:

* *I have broken my glasses.* → ahora **están rotas** (resultado).
* *I broke my glasses yesterday.* → indica **cuándo** pasó (Pasado Simple).

  | Español                     | Inglés                          |
  | --------------------------- | ------------------------------- |
  | He estado en España.        | I have been to Spain.           |
  | ¿Alguna vez has viajado?    | Have you ever traveled?         |

> 💡 **Regla práctica:** ¿señalas un **punto exacto** en la línea del tiempo? → **Pasado Simple**. ¿el marcador es **difuso** y conecta con el presente? → **Presente Perfecto**.`,
        miniQuiz: [
          mc('"He estado en España tres veces." (sin decir cuándo)', ['I was in Spain three times.', 'I have been to Spain three times.', 'I am in Spain three times.', 'I been to Spain three times.'], 1),
          mc('¿Cuál es la estructura del Presente Perfecto?', ['have/has + participio pasado', 'did + verbo base', 'am/are/is + verbo-ing', 'will + verbo base'], 0),
          mc('¿Qué palabra suele acompañar al Presente Perfecto?', ['yesterday', 'ever / already / just', 'last year', 'in 2010'], 1),
          mc('"I have broken my glasses." destaca:', ['cuándo pasó exactamente', 'el resultado actual (ahora están rotas)', 'una rutina diaria', 'un plan futuro'], 1),
          mc('"¿Alguna vez has viajado en avión?"', ['Did you ever travel by plane?', 'Have you ever traveled by plane?', 'Do you ever travel by plane?', 'Are you ever traveled by plane?'], 1),
          tap('Toca la palabra incorrecta:', ['I', 'have', 'eaten', 'sushi', 'and', 'have', 'drink', 'sake.'], 6, 'drunk'),
          tap('Toca la palabra incorrecta:', ['She', 'have', 'been', 'to', 'Paris', 'twice.'], 1, 'has'),
          rebuild('Escucha y reconstruye:', 'I have been to Spain three times', ['I', 'have', 'been', 'to', 'Spain', 'three', 'times', 'was', 'visited', 'never']),
        ] },
      { id: 'modulo3-1-errores', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `#### **🚫 Errores Comunes**

Estos son los tropiezos clásicos al mezclar los dos tiempos. ¡Cázalos antes de que te cacen a ti!

* ❌ *I have did my homework.* → ✅ *I have **done** my homework.* (usa el **participio pasado**: *done*).
* ❌ *I already ate.* (hablando del estado actual) → ✅ *I have already **eaten**.*
* ❌ *I have lived here **for** 2010.* → ✅ *I have lived here **since** 2010.* (*since* = desde un punto; *for* = por un periodo).
* ❌ *I have broken my glasses **yesterday**.* → ✅ *I **broke** my glasses yesterday.* (el *yesterday* obliga a Pasado Simple).

> 💡 **Truco de {{mascot}}:** si dices **cuándo** exacto pasó → **Pasado Simple**. Si hablas de **experiencia o resultado** sin fecha → **Presente Perfecto** con **have/has + participio**.

En los ejercicios de abajo, **toca la palabra incorrecta** y arréglala 👇.`,
        miniQuiz: [
          tap('Toca la palabra incorrecta:', ['I', 'have', 'did', 'my', 'homework.'], 2, 'done'),
          tap('Toca la palabra incorrecta:', ['I', 'have', 'already', 'ate.'], 3, 'eaten'),
          tap('Toca la palabra incorrecta:', ['I', 'have', 'lived', 'here', 'for', '2010.'], 4, 'since'),
          tap('Toca la palabra incorrecta:', ['I', 'have', 'broken', 'my', 'glasses', 'yesterday.'], 5, '(quítalo)'),
          tap('Toca la palabra incorrecta:', ['She', 'have', 'eaten', 'sushi.'], 1, 'has'),
          tap('Toca la palabra incorrecta:', ['He', 'has', 'wrote', 'a', 'book', 'and', 'has', 'sold', 'it.'], 2, 'written'),
          tap('Toca la palabra incorrecta:', ['I', 'have', 'seen', 'Rome', 'and', 'have', 'go', 'to', 'Paris.'], 6, 'gone'),
          tap('Toca la palabra incorrecta:', ['I', 'have', 'known', 'her', 'since', 'five', 'years.'], 4, 'for'),
        ] },
      { id: 'modulo3-1-resumen', type: 'resumen', markdown: `## **🎯 Resumen práctico que debes recordar**

Imagina una **línea del tiempo** 🧭:

* 📍 **Punto exacto** (tu cumpleaños pasado, *yesterday*, *last year*) → **PASADO SIMPLE** (acción terminada en ese punto): *I visited Berlin last year.*

* 🌫️ **Marcador difuso**, sin fecha o con conexión al presente → **PRESENTE PERFECTO**: *I have been to Spain three times.*

* ✅ El Presente Perfecto **siempre** usa **have/has + participio** (*have eaten* = *he comido*). Nunca *have did* → ✅ *have done*.

* ✅ Suele venir con **ever, never, already, just** y resalta el **resultado actual**.

* ✅ Ojo con **since** (desde un punto: *since 2010*) vs. **for** (por un periodo: *for five years*).

  | Cuándo                          | Tiempo             | Ejemplo                          |
  | ------------------------------- | ------------------ | -------------------------------- |
  | Momento exacto (yesterday)      | Pasado Simple      | I lost my keys yesterday.        |
  | Experiencia / sin fecha         | Presente Perfecto  | I have lost my keys.             |` },
      { id: 'modulo3-1-cierre', type: 'cierre', markdown: `#### **🌟 Cierre**

¡Excelente trabajo! 🏆 Cada vez entiendes mejor el **pasado en inglés**.

Recuerda:

* **Momento exacto** → Pasado Simple: *I visited Berlin last year.* ⏪
* **Experiencia / resultado sin fecha** → Presente Perfecto: *I have been to Spain three times.* 🌍

✅ **Misión cumplida:** ya puedes contarle a {{mascot}} lo que **hiciste ayer** y lo que **has hecho** en la vida. ¡Sigue así y descubrirás más aventuras gramaticales!

**🏅 Insignia obtenida:** 🎖 *Tiempo Viajero* (Experto en Presente Perfecto vs. Pasado Simple) ⏳🌍` },
    ],
    quizQuestions: [
      mc('Completa: "I ___ my grandparents last weekend." (visit)', ['have visited', 'visited', 'visit', 'has visited'], 1),
      mc('Completa: "She ___ sushi several times." (eat)', ['has eaten', 'ate', 'have eaten', 'is eating'], 0),
      mc('Completa: "We ___ already, right?" (meet)', ['met', 'have met', 'has met', 'meet'], 1),
      mc('"He estado en España tres veces."', ['I was in Spain three times.', 'I have been to Spain three times.', 'I am in Spain three times.', 'I been in Spain three times.'], 1),
      mc('¿Cuál es correcto?', ['I have done my homework.', 'I have did my homework.', 'I have do my homework.', 'I has done my homework.'], 0),
      mc('"¿Alguna vez has viajado en avión?"', ['Did you ever travel by plane?', 'Have you ever traveled by plane?', 'Do you ever travel by plane?', 'Are you ever travel by plane?'], 1),
      mc('"He vivido aquí ___ 2010."', ['for', 'since', 'during', 'ago'], 1),
      mc('Con "yesterday", usamos...', ['Pasado Simple', 'Presente Perfecto', 'Presente Continuo', 'Futuro'], 0),
      tap('Toca la palabra incorrecta:', ['I', 'have', 'did', 'my', 'homework.'], 2, 'done'),
      tap('Toca la palabra incorrecta:', ['I', 'have', 'broken', 'my', 'glasses', 'yesterday.'], 5, '(quítalo)'),
      tap('Toca la palabra incorrecta:', ['She', 'have', 'eaten', 'sushi', 'twice.'], 1, 'has'),
      rebuild('Escucha y reconstruye:', 'I have been to Spain three times', ['I', 'have', 'been', 'to', 'Spain', 'three', 'times', 'was', 'visited', 'yesterday']),
      rebuild('Escucha y reconstruye:', 'I visited Berlin last year', ['I', 'visited', 'Berlin', 'last', 'year', 'have', 'been', 'never', 'visit']),
      rebuild('Escucha y reconstruye:', 'Have you ever traveled by plane', ['Have', 'you', 'ever', 'traveled', 'by', 'plane', 'Did', 'did', 'yesterday']),
      rebuild('Escucha y reconstruye:', 'She has eaten sushi', ['She', 'has', 'eaten', 'sushi', 'have', 'ate', 'eat', 'eats']),
    ],
  };

  const modulo3_2 = {
    id: 'modulo3-2',
    title: 'Microlección 2',
    durationMinutes: 13,
    audioCues: ['Escucha el contenido de la lección.', 'Fíjate en los puntos clave.', 'Ahora vienen tus ejercicios.'],
    contentBlocks: [
      { id: 'modulo3-2-titulo', type: 'titulo', title: '¿Cómo cuento mis hábitos del pasado y mis costumbres de hoy?', subtitle: 'Expresiones con used to, would y be used to', markdown: '' },
      { id: 'modulo3-2-mision', type: 'mision', markdown: `Entender la diferencia entre **used to**, **would** y **be used to** para hablar de **hábitos del pasado** o de **estar acostumbrado a algo** ⚙️.` },
      { id: 'modulo3-2-intro', type: 'intro', markdown: `¡Hola de nuevo! Soy **{{mascot}}**😊. ¿Recuerdas cuándo eras niño o niña? Hoy exploraremos cómo hablar de **hábitos pasados** y de **costumbres**.

Veremos tres expresiones similares pero distintas: **used to**, **would** y **be used to**. Aunque parecen iguales, cada una tiene su truco 😏. ¡Vamos a desenredarlas juntos!` },
      { id: 'modulo3-2-teoria-1', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `#### **🔴 "Used to" + infinitivo**

Sirve para **hábitos en el pasado que ya no ocurren** (= *"solía"*). También para **estados pasados**.

  | Inglés                            | Español                          |
  | --------------------------------- | -------------------------------- |
  | I used to live in London.         | Solía vivir en Londres.          |
  | I used to be afraid of the dark.  | Solía tenerle miedo a la oscuridad. |
  | She used to be a vegetarian.      | Ella solía ser vegetariana.      |

> **Regla:** *used to* **siempre** se refiere al pasado (algo que antes hacías o eras, pero ya no).

**Ejemplo paralelo:** *"I used to have long hair, but now it's short."* – *"Solía tener el pelo largo, pero ahora lo tengo corto."*`,
        miniQuiz: [
          mc('¿Para qué sirve "used to"?', ['Para costumbres actuales', 'Para hábitos o estados del pasado que ya no ocurren', 'Para acciones futuras', 'Para acciones en progreso ahora'], 1),
          mc('Traduce: "Solía vivir en Londres."', ['I live in London.', 'I used to live in London.', 'I am used to London.', 'I would live in London.'], 1),
          mc('"I used to be afraid of the dark." expresa un...', ['estado pasado', 'plan futuro', 'hábito actual', 'acción en progreso'], 0),
          mc('"used to" siempre se refiere al...', ['presente', 'futuro', 'pasado', 'condicional'], 2),
          mc('Tras "used to" va...', ['el infinitivo (used to live)', 'gerundio (used to living)', 'verbo + -s', 'verbo en pasado'], 0),
          tap('Toca la palabra incorrecta:', ['I', 'used', 'to', 'live', 'here', 'and', 'used', 'play', 'football.'], 7, 'to play'),
          tap('Toca la palabra incorrecta:', ['She', 'use', 'to', 'have', 'long', 'hair.'], 1, 'used'),
          rebuild('🎧 Ordena: "Solía vivir en Londres."', 'I used to live in London', ['I', 'used', 'to', 'live', 'in', 'London', 'use', 'would', 'am']),
        ] },
      { id: 'modulo3-2-teoria-2', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `#### **🔵 "Would" + infinitivo**

Sirve para **acciones repetidas en el pasado**, PERO solo si **ya sabemos que la situación es pasada**. Enfatiza la **repetición**.

  | Inglés                                       | Español                                  |
  | -------------------------------------------- | ---------------------------------------- |
  | When I was a child, I would walk to school.  | Cuando era niño, caminaba a la escuela.  |
  | Every summer we would travel to the beach.   | Cada verano solíamos ir a la playa.      |

> **Diferencia clave:** *used to* sirve para hábitos **O** estados pasados; *would* **SOLO** para acciones repetidas (no estados).`,
        miniQuiz: [
          mc('"would" sirve para...', ['estados pasados', 'acciones repetidas en el pasado', 'costumbres actuales', 'planes futuros'], 1),
          mc('Completa: "Every summer we ___ travel to the beach."', ['used to be', 'would', 'are used to', 'will'], 1),
          mc('¿Para qué NO sirve "would"?', ['acciones repetidas', 'estados pasados', 'hábitos repetidos', 'rutinas del pasado'], 1),
          mc('"would" enfatiza la...', ['repetición', 'duración', 'costumbre actual', 'obligación'], 0),
          mc('"Cuando era niño, caminaba a la escuela."', ['When I was a child, I would walk to school.', 'When I was a child, I will walk to school.', 'When I was a child, I am used to walk to school.', 'When I was a child, I would to walk to school.'], 0),
          tap('Toca la palabra incorrecta:', ['When', 'young,', 'I', 'would', 'walk', 'and', 'would', 'played', 'outside.'], 7, 'play'),
          tap('Toca la palabra incorrecta:', ['Every', 'summer', 'we', 'would', 'to', 'travel.'], 4, '(quítalo)'),
          rebuild('🎧 Ordena: "Cada verano íbamos a la playa."', 'Every summer we would travel to the beach', ['Every', 'summer', 'we', 'would', 'travel', 'to', 'the', 'beach', 'used', 'will', 'beech', 'travels']),
        ] },
      { id: 'modulo3-2-teoria-2b', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `#### **🟢 "Be used to" + sustantivo o gerundio**

= **"estar acostumbrado a"** algo. **NO es pasado**; describe una costumbre o comodidad **actual**.

**Estructura:** *am / is / are + used to + doing something*

  | Inglés                              | Español                                    |
  | ----------------------------------- | ------------------------------------------ |
  | I am used to waking up early.       | Estoy acostumbrado a levantarme temprano.  |
  | Maria is used to spicy food.        | María está acostumbrada a la comida picante. |
  | They were used to standing for hours. | Estaban acostumbrados a estar de pie por horas. |

> **¡Ojo!** No confundas *"I am used to"* (estar acostumbrado) con *"I used to"* (solía).`,
        miniQuiz: [
          mc('"Be used to" significa...', ['solía', 'estar acostumbrado a algo', 'voy a acostumbrarme', 'acción repetida pasada'], 1),
          mc('¿Qué estructura es correcta para "estar acostumbrado"?', ['am used to + doing something', 'used to + infinitivo', 'would + infinitivo', 'am used to + infinitivo'], 0),
          mc('"María is used to spicy food." describe una costumbre...', ['pasada', 'actual', 'futura', 'imaginaria'], 1),
          mc('¿Con cuál NO debes confundir "I used to"?', ['I am used to', 'I would', 'I walked', 'I did'], 0),
          mc('"Estoy acostumbrado a levantarme temprano."', ['I used to wake up early.', 'I am used to waking up early.', 'I would wake up early.', 'I am used to wake up early.'], 1),
          tap('Toca la palabra incorrecta:', ['I', 'am', 'used', 'to', 'wake', 'up', 'early.'], 4, 'waking'),
          tap('Toca la palabra incorrecta:', ['She', 'used', 'to', 'spicy', 'food', 'now.'], 1, 'is used'),
          rebuild('🎧 Ordena: "Estoy acostumbrado a levantarme temprano."', 'I am used to waking up early', ['I', 'am', 'used', 'to', 'waking', 'up', 'early', 'wake', 'would', 'use']),
        ] },
      { id: 'modulo3-2-errores', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `#### **🚫 Errores Comunes**

**1. Confundir "I used to" con "I'm used to".**
No digas *"I'm used to swimming every day"* si quieres hablar de un **hábito pasado** (sería *"I used to swim every day"*).

**2. Olvidar el "to" en "used to".**
Debe ser *used to + verbo*: ✅ *"used to play"*, ❌ *"used play"*.

**3. Usar "would" para estados pasados.**
*"I would be happy as a child"* suena mal; mejor *"I used to be happy"*. (*would* no se usa con verbos de estado.)

**4. En negativas e interrogativas, "used to" cambia.**
Se vuelve *"didn't use to"* o *"Did you use to...?"*. ❌ *"She didn't used to like chocolate."* ✅ *"She didn't use to like chocolate."*`,
        miniQuiz: [
          tap('Hábito pasado: corrige el error.', ['I', "'m", 'used', 'to', 'swim', 'every', 'day'], 1, '(quítalo)'),
          tap('Falta algo. ¿Dónde está el error?', ['I', 'used', 'play', 'football', 'as', 'a', 'kid'], 2, 'to play'),
          tap('Estado pasado: encuentra el error.', ['I', 'would', 'be', 'happy', 'as', 'a', 'child'], 1, 'used to'),
          tap('Negativa con "used to": corrige el error.', ['She', "didn't", 'used', 'to', 'like', 'chocolate'], 2, 'use'),
          tap('Toca la palabra incorrecta:', ['He', 'use', 'to', 'smoke', 'a', 'lot.'], 1, 'used'),
          tap('Toca la palabra incorrecta:', ['I', 'am', 'used', 'to', 'work', 'at', 'night.'], 4, 'working'),
          tap('Toca la palabra incorrecta:', ['Did', 'you', 'used', 'to', 'play', 'soccer?'], 2, 'use'),
          tap('Toca la palabra incorrecta:', ['When', 'I', 'was', 'a', 'kid,', 'I', 'would', 'be', 'shy.'], 6, 'used to'),
        ] },
      { id: 'modulo3-2-resumen', type: 'resumen', markdown: `#### **🧳 Las tres maletas de {{mascot}}**

Imagina **tres maletas** con etiquetas de colores:

- 🔴 **Etiqueta roja "USED TO"** = **pasado** (hábitos terminados o estados que ya no son). *"I used to live in London."*
- 🔵 **Etiqueta azul "WOULD"** = **repetición** en un loop, solo acciones. *"Every summer we would travel."*
- 🟢 **Etiqueta verde "BE USED TO"** = algo que **llevas puesto ahora**, como ropa cómoda (ya te acostumbras). *"I am used to waking up early."*

> Si es pasado terminado → 🔴 *used to*. Si es repetición pasada → 🔵 *would*. Si es costumbre actual → 🟢 *be used to*.` },
      { id: 'modulo3-2-cierre', type: 'cierre', markdown: `#### **🌟 Cierre**

¡Gran desempeño! 🎉 Has dominado expresiones que suenan parecidas pero son diferentes. ¡Pronto podrás contar tus historias de infancia con precisión! ⚡

**🏅 Insignia obtenida:** *Hábito Pasado* 🎖` },
    ],
    quizQuestions: [
      mc('I ___ outside every day when I was a kid. (repetición habitual)', ['would play', 'am used to playing', 'use to play', 'will play'], 0),
      mc('She ___ New York for 10 years and speaks English fluently now. (acostumbrada)', ['used to live in', 'is used to living in', 'would live in', 'is used to live in'], 1),
      mc('They ___ three dogs, but one died last year.', ['used to have', 'are used to having', 'would have', 'use to have'], 0),
      mc('Traduce: "María está acostumbrada a la comida picante."', ['Maria used to spicy food.', 'Maria is used to spicy food.', 'Maria would eat spicy food.', 'Maria is used to eat spicy food.'], 1),
      mc('"Every summer we ___ travel to the beach." (repetido año tras año)', ['are used to', 'would', 'be used to', 'will'], 1),
      mc('¿Cuál NO se usa con verbos de estado (como "be happy")?', ['used to', 'would', 'be used to', 'was'], 1),
      mc('Tras "used to" va el verbo en...', ['infinitivo (used to play)', 'gerundio (used to playing)', 'pasado (used to played)', 'con -s'], 0),
      mc('Negativa de "used to":', ["didn't use to", "didn't used to", "don't used to", "wasn't used to"], 0),
      tap('Corrige el error (estructura de "used to"):', ['I', 'used', 'play', 'tennis', 'every', 'weekend'], 2, 'to play'),
      tap('Corrige el error (negativa con "used to"):', ['He', "didn't", 'used', 'to', 'smoke'], 2, 'use'),
      tap('Toca la palabra incorrecta:', ['I', 'am', 'used', 'to', 'wake', 'up', 'early.'], 4, 'waking'),
      rebuild('Ordena: "Solía vivir en Londres."', 'I used to live in London', ['I', 'used', 'to', 'live', 'in', 'London', 'am', 'would', 'use']),
      rebuild('Ordena: "Estoy acostumbrado a levantarme temprano."', 'I am used to waking up early', ['I', 'am', 'used', 'to', 'waking', 'up', 'early', 'use', 'would', 'wake']),
      rebuild('Ordena: "Cuando era niño caminaba a la escuela."', 'When I was a child I would walk to school', ['When', 'I', 'was', 'a', 'child', 'I', 'would', 'walk', 'to', 'school', 'used', 'will']),
      rebuild('Ordena: "Ella solía tener el pelo largo."', 'She used to have long hair', ['She', 'used', 'to', 'have', 'long', 'hair', 'would', 'use', 'is']),
    ],
  };

  const modulo3_3 = {
    id: 'modulo3-3',
    title: 'Microlección 3',
    durationMinutes: 13,
    audioCues: ['Escucha el contenido de la lección.', 'Fíjate en los puntos clave.', 'Ahora vienen tus ejercicios.'],
    contentBlocks: [
      { id: 'modulo3-3-titulo', type: 'titulo', title: '¿Qué pasaría si...? 🎲', subtitle: 'Condicionales 0, 1 y 2 (if + presente/pasado, will/would)', markdown: '' },
      { id: 'modulo3-3-mision', type: 'mision', markdown: `Aprender a usar el **condicional cero**, **primero** y **segundo** para expresar **hechos científicos**, **planes probables** e **hipótesis irreales**. 🔮 Al final dominarás la fórmula secreta de cada "**if**".` },
      { id: 'modulo3-3-intro', type: 'intro', markdown: `¡Atención, aspirante a inglés! 🤖 Soy **{{mascot}}** y hoy lanzamos los **dados de la suerte** 🎲.

Los **condicionales** nos permiten hablar de hechos reales y de posibilidades. Imagina tres portales:

* 🔵 **Reglas universales** (condicional **0**) → lo que SIEMPRE pasa.
* 1️⃣ **Planes probables** (condicional **1**) → lo que pasará si...
* 2️⃣ **Sueños hipotéticos** (condicional **2**) → lo que pasaría si fuera real.

¡Descubramos la **fórmula secreta** de cada uno! ✨` },
      { id: 'modulo3-3-teoria-1', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**1.** **Zero Conditional (Tipo 0)** 🔵

**🔵 Condicional CERO** — la condición y el resultado son **hechos generales o científicos**, **siempre verdaderos**.

> **Estructura:** *If + presente simple, presente simple.*

| Inglés | Español |
| --- | --- |
| If you **mix** red and blue, you **get** purple. | Si mezclas rojo y azul, obtienes morado. |
| Water **boils** if you **heat** it. | El agua hierve si la calientas. |
| Plants **die** if they **don't get** enough water. | Las plantas mueren si no reciben suficiente agua. |

Son **verdades universales**: presente simple en **ambas** partes. 🧪`,
        miniQuiz: [
          mc('¿Qué estructura usa el condicional CERO?', ['If + presente, presente', 'If + presente, will + verbo', 'If + pasado, would + verbo', 'If + would, presente'], 0),
          mc('Water ___ if you heat it to 100°C. (cero)', ['will boil', 'boils', 'would boil', 'boil'], 1),
          mc('If you mix red and blue, you ___ purple.', ['will get', 'get', 'got', 'would get'], 1),
          mc('El condicional CERO sirve para...', ['sueños imposibles', 'verdades universales y hechos científicos', 'planes del fin de semana', 'órdenes'], 1),
          mc('"Las plantas mueren si no reciben agua."', ["Plants die if they don't get water.", "Plants will die if they don't get water.", "Plants would die if they didn't get water.", "Plants die if they won't get water."], 0),
          tap('Toca la palabra incorrecta:', ['If', 'you', 'freeze', 'water,', 'it', 'become', 'ice.'], 5, 'becomes'),
          tap('Toca la palabra incorrecta:', ['Plants', 'die', 'if', 'they', "don't", 'gets', 'water.'], 5, 'get'),
          rebuild('🎧 Reconstruye:', 'If you mix red and blue you get purple', ['If', 'you', 'mix', 'red', 'and', 'blue', 'you', 'get', 'purple', 'will', 'gets']),
        ] },
      { id: 'modulo3-3-teoria-1b', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**2.** **First Conditional (Tipo 1)** 1️⃣

**1️⃣ Condicional PRIMERO** — situaciones **futuras reales o muy probables**.

> **Estructura:** *If + presente simple, **will** + infinitivo.*

| Inglés | Español |
| --- | --- |
| If everyone **agrees**, we **will go** to Spain next year. | Si todos están de acuerdo, iremos a España. |
| If it **rains** tomorrow, we **will cancel** the picnic. | Si llueve mañana, cancelaremos el picnic. |

> 💡 También puedes usar **may/might** en lugar de **will** para algo menos seguro: *If it rains, we **might** stay home.*`,
        miniQuiz: [
          mc('¿Qué estructura usa el condicional PRIMERO?', ['If + presente, presente', 'If + presente, will + verbo', 'If + pasado, would + verbo', 'If + will, presente'], 1),
          mc('If everyone agrees, we ___ to Spain. (primero)', ['go', 'will go', 'went', 'would go'], 1),
          mc('If it rains tomorrow, we ___ the picnic. (primero)', ['cancel', 'will cancel', 'cancelled', 'would cancel'], 1),
          mc('Para algo futuro menos seguro puedes usar...', ['was/were', 'may/might', 'would', 'did'], 1),
          mc('"Si llueve, nos quedaremos en casa."', ['If it rains, we will stay home.', 'If it will rain, we stay home.', 'If it rains, we stay home.', 'If it rained, we would stay home.'], 0),
          tap('Toca la palabra incorrecta:', ['If', 'it', 'rains,', 'we', 'cancel', 'the', 'picnic.'], 4, 'will cancel'),
          tap('Toca la palabra incorrecta:', ['If', 'you', 'study,', 'you', 'will', 'passes', 'the', 'exam.'], 5, 'pass'),
          rebuild('🎧 Reconstruye:', 'If it rains tomorrow we will cancel the picnic', ['If', 'it', 'rains', 'tomorrow', 'we', 'will', 'cancel', 'the', 'picnic', 'would', 'rained']),
        ] },
      { id: 'modulo3-3-teoria-2', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**3.** **Second Conditional (Tipo 2)** 🏰

Sirve para **situaciones hipotéticas o irreales** en presente o futuro: sueños, imaginación, cosas que NO son verdad hoy.

> **Estructura:** *If + pasado simple, **would** + infinitivo.*

| Inglés | Español |
| --- | --- |
| If I **won** the lottery, I **would buy** a house. | Si ganara la lotería, compraría una casa. |
| You **would speak** Japanese if you **lived** in Japan. | Hablarías japonés si vivieras en Japón. |
| If I **were** taller, I **would play** basketball. | Si fuera más alto, jugaría básquet. |

> 💡 **Ojito:** en el condicional 2, *I am* se convierte en **were** (no *was*) para situaciones irreales: *If I **were** rich...* 💰

**🚪 Tres portales (mnemotecnia):**

* **Portal 0** (círculo) 🔵 = laboratorio donde **todo es verdad** (hecho científico).
* **Portal 1** (uno) 🛣️ = carretera futura: si tomas una ruta (*if + presente*), llegarás a un destino seguro (*will + verbo*).
* **Portal 2** (dos) 🏰 = castillo de sueños: entras con *If + pasado* y tu realidad cambia con *would* (¡no importa que no sea real!).`,
        miniQuiz: [
          mc('If I ___ wings, I would fly. (segundo)', ['have', 'had', 'will have', 'has'], 1),
          mc('If I won the lottery, I ___ a house.', ['will buy', 'would buy', 'buy', 'bought'], 1),
          mc('If I ___ taller, I would play basketball.', ['am', 'were', 'will be', 'was'], 1),
          mc('¿Qué estructura es el condicional SEGUNDO?', ['If + presente, will + verbo', 'If + pasado, would + verbo', 'If + presente, presente', 'If + would, pasado'], 1),
          mc('Para situaciones irreales, "If I am" se convierte en...', ['If I were', 'If I was', 'If I will be', 'If I would be'], 0),
          tap('Toca la palabra incorrecta:', ['If', 'I', 'would', 'won,', 'I', 'would', 'travel.'], 2, '(quítalo)'),
          tap('Toca la palabra incorrecta:', ['If', 'I', 'was', 'rich,', 'I', 'would', 'buy', 'a', 'car.'], 2, 'were'),
          rebuild('🎧 Reconstruye:', 'If I won the lottery I would buy a house', ['If', 'I', 'won', 'the', 'lottery', 'I', 'would', 'buy', 'a', 'house', 'will', 'win']),
        ] },
      { id: 'modulo3-3-errores', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `#### **🚫 Errores Comunes**

¡Cuidado con estos resbalones al cruzar los portales! 🕵️

| ❌ Incorrecto | ✅ Correcto |
| --- | --- |
| If I **would go** there, I would see him. | If I **went** there, I would see him. |
| If you freeze water, it **will become** solid. | If you freeze water, it **becomes** solid. |
| If I **was** rich, I would travel. | If I **were** rich, I would travel. |

* **Nunca uses *would* después de *if*** en el condicional 2 → usa el **pasado simple**.
* Con **hechos científicos** (cero) usa **presente** en ambas partes, no *will*.
* En condicional 2, cambia *If I am* por **If I were** para lo irreal. 💪`,
        miniQuiz: [
          tap('Toca la palabra incorrecta:', ['If', 'I', 'would', 'went', 'there,', 'I', 'would', 'see', 'him.'], 2, '(quítalo)'),
          tap('Toca la palabra incorrecta:', ['If', 'I', 'was', 'rich,', 'I', 'would', 'travel.'], 2, 'were'),
          tap('Toca la palabra incorrecta:', ['If', 'you', 'freeze', 'water,', 'it', 'become', 'solid.'], 5, 'becomes'),
          tap('Toca la palabra incorrecta:', ['If', 'it', 'rains,', 'we', 'cancel', 'the', 'trip.'], 4, 'will cancel'),
          tap('Toca la palabra incorrecta:', ['If', 'I', 'would', 'had', 'money,', 'I', 'would', 'help', 'you.'], 2, '(quítalo)'),
          tap('Toca la palabra incorrecta:', ['If', 'you', 'heat', 'ice,', 'it', 'melt.'], 5, 'melts'),
          tap('Toca la palabra incorrecta:', ['If', 'I', 'win', 'the', 'lottery,', 'I', 'would', 'travel.'], 2, 'won'),
          tap('Toca la palabra incorrecta:', ['If', 'he', 'studies,', 'he', 'pass', 'the', 'exam.'], 4, 'will pass'),
        ] },
      { id: 'modulo3-3-resumen', type: 'resumen', markdown: `## **🎯 Resumen: Los Tres Portales**

| Tipo | Uso | Estructura |
| --- | --- | --- |
| **0** 🔵 | Hechos / ciencia (siempre verdad) | If + presente, **presente** |
| **1** 1️⃣ | Futuro real / probable | If + presente, **will** + verbo |
| **2** 2️⃣ | Hipótesis irreal | If + pasado, **would** + verbo |

* ✅ Cero: *If you heat water, it **boils**.*
* ✅ Primero: *If it rains, we **will cancel**.*
* ✅ Segundo: *If I **won**, I **would buy**...*
* 🚫 **Nunca *would* después de *if*** (en el 2 va pasado simple).
* 💰 *If I **were**...* (no *was*) para lo irreal.

**🧠 Mnemotecnia:** 0 = **laboratorio** 🔵, 1 = **carretera** 🛣️, 2 = **castillo de sueños** 🏰.` },
      { id: 'modulo3-3-cierre', type: 'cierre', markdown: `#### **🌟 Cierre**

¡Lo lograste! 👏 Ahora puedes crear **frases mágicas que dependen del "si"** 🪄. Sabes cuándo el resultado es un **hecho** (0), un **plan probable** (1) o un **sueño** (2).

✅ **Misión cumplida:** completa esta frase soñadora:

> *"If I **had** more time, I **would** learn three languages."* 🌍

**🏅 Insignia obtenida:** ✨ *Maestro de Condicionales* desbloqueada. ¡A seguir explorando! 🎲` },
    ],
    quizQuestions: [
      mc('If you ___ (study) hard, you will pass the exam.', ['study', 'studied', 'will study', 'would study'], 0),
      mc('If I ___ (have) wings, I would fly.', ['have', 'had', 'will have', 'has'], 1),
      mc('Water ___ (boil) if you heat it to 100°C.', ['will boil', 'boils', 'would boil', 'boil'], 1),
      mc('¿Cuál es el condicional CERO?', ['If + pasado, would + verbo', 'If + presente, presente', 'If + presente, will + verbo', 'If + would, presente'], 1),
      mc('If I won the lottery, I ___ a house.', ['will buy', 'would buy', 'buy', 'bought'], 1),
      mc('¿Cuál es CORRECTA (condicional 2)?', ['If I would go there, I would see him', 'If I went there, I would see him', 'If I go there, I would see him', 'If I will go there, I would see him'], 1),
      mc('If I ___ rich, I would travel the world.', ['am', 'was', 'were', 'will be'], 2),
      mc('Condicional 1: "If it rains, we ___ inside."', ['stay', 'will stay', 'would stay', 'stayed'], 1),
      tap('Toca la palabra incorrecta:', ['If', 'I', 'would', 'had', 'money,', 'I', 'would', 'help', 'you.'], 2, '(quítalo)'),
      tap('Toca la palabra incorrecta:', ['Plants', 'will', 'die', 'if', 'they', "don't", 'get', 'water.'], 1, '(quítalo)'),
      tap('Toca la palabra incorrecta:', ['If', 'it', 'rains,', 'we', 'cancel', 'the', 'trip.'], 4, 'will cancel'),
      rebuild('🎧 Reconstruye:', 'If everyone agrees we will go to Spain', ['If', 'everyone', 'agrees', 'we', 'will', 'go', 'to', 'Spain', 'would', 'agreed']),
      rebuild('🎧 Reconstruye:', 'If I won the lottery I would buy a house', ['If', 'I', 'won', 'the', 'lottery', 'I', 'would', 'buy', 'a', 'house', 'will', 'win']),
      rebuild('🎧 Reconstruye:', 'If you heat water it boils', ['If', 'you', 'heat', 'water', 'it', 'boils', 'will', 'boil', 'would']),
      rebuild('🎧 Reconstruye:', 'If it rains we will stay home', ['If', 'it', 'rains', 'we', 'will', 'stay', 'home', 'would', 'rained', 'stays']),
    ],
  };

  const modulo3_4 = {
    id: 'modulo3-4',
    title: 'Microlección 4',
    durationMinutes: 14,
    audioCues: ['Escucha el contenido de la lección.', 'Fíjate en los puntos clave.', 'Ahora vienen tus ejercicios.'],
    contentBlocks: [
      { id: 'modulo3-4-titulo', type: 'titulo', title: '¿Cómo cuento lo que otros dijeron? 🗣️', subtitle: 'Reported Speech (Estilo Indirecto)', markdown: '' },
      { id: 'modulo3-4-mision', type: 'mision', markdown: `## Practicar el **reported speech** cambiando oraciones **directas** por **indirectas**, incluyendo **afirmaciones**, **preguntas de sí/no** y **de información (wh-)**, y **mandatos/órdenes**. ⚙️` },
      { id: 'modulo3-4-intro', type: 'intro', markdown: `¡Hey, buen trabajo hasta ahora! Soy **{{mascot}}** {{mascotEmoji}}. En nuestra siguiente misión aprenderás a **contar lo que otros dijeron**, pero usando tus propias palabras.

Es como jugar al **teléfono descompuesto** 📞… pero de manera correcta. 😎

Veremos cómo transformar **declaraciones**, **preguntas** y **órdenes** del estilo **directo** al estilo **indirecto**.` },
      { id: 'modulo3-4-teoria-1', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**1.** **Afirmaciones y preguntas en estilo indirecto**

### 📢 Afirmaciones
Cambiamos los **pronombres** y **bajamos un tiempo verbal** (presente → pasado, *will* → *would*).

| Estilo directo | Estilo indirecto |
| --- | --- |
| "I am happy," she said. | She said she **was** happy. (am → was) |
| He said, "I will help you." | He said that he **would** help me. (will → would) |
| "I can't come," she told us. | She told us she **couldn't** come. (can → could) |

### ❓ Preguntas de sí/no
Tras el verbo introductor (**asked**) ponemos **if** o **whether**, y quitamos el orden de pregunta.

> "Are you coming?" He asked **if** I **was** coming.
> "Do you speak English?" she asked. → She asked **if** I spoke English.

### 🔍 Preguntas con wh- (what, where, how…)
Mantén la palabra **wh-** y cambia a **orden afirmativo** (no pongas el verbo antes del sujeto).

> "Where is the exit?" He asked **where the exit was.**
> "Where are you?" he asked. → He asked **where I was.**`,
        miniQuiz: [
          mc('"I am happy," she said. → She said she ___ happy.', ['is', 'was', 'are', 'be'], 1),
          mc('He said, "I will help you." He said he ___ help me.', ['will', 'would', 'wills', 'will to'], 1),
          mc('"Are you coming?" He asked ___ I was coming.', ['that', 'if', 'what', 'is'], 1),
          mc('En reported speech, el presente baja a...', ['pasado', 'futuro', 'presente continuo', 'condicional'], 0),
          mc('En preguntas indirectas wh-, el orden es...', ['afirmativo (sujeto + verbo)', 'de pregunta (verbo + sujeto)', 'con do/does', 'con if'], 0),
          tap('Toca la palabra incorrecta:', ['She', 'said', 'she', 'is', 'tired', 'and', 'was', 'hungry.'], 3, 'was'),
          tap('Toca la palabra incorrecta:', ['He', 'asked', 'where', 'I', 'was', 'and', 'who', 'I', 'am.'], 8, 'was.'),
          rebuild('🎧 Reconstruye:', 'She said she was happy', ['She', 'said', 'she', 'was', 'happy', 'is', 'told', 'are']),
        ] },
      { id: 'modulo3-4-teoria-2', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**2.** **Mandatos, órdenes y peticiones**

Para reportar **órdenes** o **peticiones** usamos verbos como **tell, order, ask, advise** + **to** + infinitivo. 🚦

| Estilo directo | Estilo indirecto |
| --- | --- |
| "Stop smoking!" | He **told me to** stop smoking. |
| "Get out of the car!" | The policeman **ordered him to** get out of the car. |
| "Please sit down," the teacher said. | The teacher **asked us to** sit down. |

### 🚫 En negativo
Usa **not to** + infinitivo:

> "Don't use your phone," the teacher told us. → The teacher told us **not to** use our phones.

### 🍎 Para pedir objetos
Usamos **ask for**:

> "Can I have an apple?" She **asked for** an apple.

---

🎙️ **Metáfora de {{mascot}}:** Imagina que **grabas la voz** de alguien (estilo directo) y luego la **reproduces con tu voz** (estilo indirecto). Debes **adelantar el tiempo** un poco: presente → pasado, *future* → *would*. Atención a los **discursivos mágicos**: **if** para preguntas sí/no y verbos como **told/asked + to** para órdenes. ✨`,
        miniQuiz: [
          mc('"Stop smoking!" He told me ___ stop smoking.', ['to', 'that', 'for', 'if'], 0),
          mc('"Don\'t use your phone." The teacher told us ___ use our phones.', ['to not', 'not to', 'no to', "don't"], 1),
          mc('"Can I have an apple?" She asked ___ an apple.', ['to', 'for', 'if', 'that'], 1),
          mc('"Get out!" The policeman ___ him to get out.', ['said', 'ordered', 'told that', 'asked if'], 1),
          mc('Para reportar una orden usamos tell/order/ask + ...', ['to + infinitivo', 'that + oración', 'if + oración', 'verbo + -ing'], 0),
          tap('Toca la palabra incorrecta:', ['He', 'told', 'me', 'stop', 'and', 'asked', 'me', 'to', 'wait.'], 3, 'to stop'),
          tap('Toca la palabra incorrecta:', ['She', 'told', 'me', 'not', 'use', 'it.'], 3, 'not to'),
          rebuild('🎧 Reconstruye:', 'He told me to stop smoking', ['He', 'told', 'me', 'to', 'stop', 'smoking', 'said', 'for', 'not']),
        ] },
      { id: 'modulo3-4-errores', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `#### **🚫 Errores Comunes**

1. **No cambiar el orden en preguntas indirectas.**
   ❌ "He asked where was the exit." ✅ "He asked where the exit **was**."

2. **Usar "said" con objeto.** En inglés se dice **told me / told us**, no *said me*.
   ❌ "She said me she was coming." ✅ "She **told me** she was coming."

3. **Olvidar "if" o "that".** Inserta **if** para preguntas sí/no y opcionalmente **that** para afirmaciones.

4. **Mantener los tiempos iguales.** Generalmente **atrasamos** el tiempo.
   ❌ "She said she **is** happy." ✅ "She said she **was** happy."`,
        miniQuiz: [
          tap('Toca la palabra incorrecta:', ['She', 'said', 'me', 'she', 'was', 'coming.'], 1, 'told'),
          tap('Toca la palabra incorrecta:', ['She', 'said', 'she', 'is', 'happy.'], 3, 'was'),
          tap('Toca la palabra incorrecta:', ['He', 'asked', 'where', 'the', 'exit', 'is.'], 5, 'was'),
          tap('Toca la palabra incorrecta:', ['He', 'asked', 'I', 'was', 'coming.'], 2, 'if I'),
          tap('Toca la palabra incorrecta:', ['He', 'told', 'me', 'not', 'use', 'it.'], 3, 'not to'),
          tap('Toca la palabra incorrecta:', ['He', 'said', 'us', 'to', 'wait', 'here.'], 1, 'told'),
          tap('Toca la palabra incorrecta:', ['She', 'told', 'me', 'stop', 'talking.'], 3, 'to stop'),
          tap('Toca la palabra incorrecta:', ['He', 'said', 'he', 'will', 'help', 'me.'], 3, 'would'),
        ] },
      { id: 'modulo3-4-resumen', type: 'resumen', markdown: `## **🎯 Resumen práctico que debes recordar**

| Tipo | Cómo se forma | Ejemplo |
| --- | --- | --- |
| Afirmación | baja el tiempo (+ that opcional) | She said she **was** happy. |
| Pregunta sí/no | **if / whether** + orden afirmativo | He asked **if** I was coming. |
| Pregunta wh- | wh- + **orden afirmativo** | He asked **where the exit was.** |
| Mandato | **tell/order/ask + to** + inf. | He told me **to** stop. |
| Mandato negativo | **not to** + inf. | He told me **not to** smoke. |

### 🧠 Mnemotecnia
**"Graba directo, reproduce indirecto."** 🎙️ Adelanta el tiempo: **presente → pasado**, **will → would**. Y recuerda los discursivos mágicos: **if** (sí/no) y **to** (órdenes), y di **told me**, nunca *said me*.` },
      { id: 'modulo3-4-cierre', type: 'cierre', markdown: `#### **🌟 Cierre**

¡Fantástico! 🎉 Ahora puedes **contar chismes en inglés** de forma correcta. Ya sabes adelantar el tiempo, meter **if** en las preguntas sí/no, mantener el orden afirmativo en las wh-, y usar **told/asked + to** para las órdenes.

¡A seguir practicando y viendo el mundo con otros ojos! 👀

**🏅 Insignia obtenida:** *Detective del Discurso* 🕵️‍♂️🗣️✨` },
    ],
    quizQuestions: [
      mc('"I have finished my homework," she said. → She said she ___ her homework.', ['has finished', 'had finished', 'finished', 'have finished'], 1),
      mc('"Will you help me?" he asked. → He asked if I ___ help him.', ['will', 'would', 'will to', 'would to'], 1),
      mc('"Don\'t use your phone." The teacher told us ___ use our phones.', ['to not', 'not to', "don't", 'no to'], 1),
      mc('"Are you coming?" He asked ___ I was coming.', ['that', 'if', 'where', 'is'], 1),
      mc('"I am happy," she said. → She said she ___ happy.', ['was', 'is', 'be', 'are'], 0),
      mc('"Stop smoking!" He ___ me to stop smoking.', ['told', 'said', 'said to', 'asked if'], 0),
      mc('"Can I have an apple?" She asked ___ an apple.', ['to', 'for', 'if', 'that'], 1),
      mc('"Do you speak English?" she asked. → She asked ___ I spoke English.', ['that', 'if', 'what', 'do'], 1),
      tap('Toca la palabra incorrecta:', ['She', 'said', 'me', 'she', 'was', 'coming.'], 1, 'told'),
      tap('Toca la palabra incorrecta:', ['She', 'said', 'she', 'is', 'happy.'], 3, 'was'),
      tap('Toca la palabra incorrecta:', ['He', 'told', 'me', 'not', 'use', 'it.'], 3, 'not to'),
      rebuild('🎧 Reconstruye:', 'He told me to stop smoking', ['He', 'told', 'me', 'to', 'stop', 'smoking', 'said', 'for', 'not']),
      rebuild('🎧 Reconstruye:', 'He asked where the exit was', ['He', 'asked', 'where', 'the', 'exit', 'was', 'is', 'were', 'if']),
      rebuild('🎧 Reconstruye:', 'She said she was happy', ['She', 'said', 'she', 'was', 'happy', 'is', 'told', 'are']),
      rebuild('🎧 Reconstruye:', 'He asked if I would help him', ['He', 'asked', 'if', 'I', 'would', 'help', 'him', 'will', 'that']),
    ],
  };

  const modulo3_5 = {
    id: 'modulo3-5',
    title: 'Microlección 5',
    durationMinutes: 12,
    audioCues: ['Escucha el contenido de la lección.', 'Fíjate en los puntos clave.', 'Ahora vienen tus ejercicios.'],
    contentBlocks: [
      { id: 'modulo3-5-titulo', type: 'titulo', title: '¿Listo para llenar tu maletín de palabras? 🧳', subtitle: 'Vocabulario funcional: trabajo, estudios, tecnología y relaciones', markdown: '' },
      { id: 'modulo3-5-mision', type: 'mision', markdown: `## Aprender y practicar **palabras útiles en inglés** para cuatro campos clave de tu vida real:

* 💼 **Trabajo y empleo**
* 📚 **Educación y estudios**
* 💻 **Tecnología**
* ❤️ **Relaciones personales**

Con estas palabras vas a poder describir tu profesión, tus estudios y todo lo que pasa en tu día a día digital y social. ¡Vamos a empacar, {{audience}}!` },
      { id: 'modulo3-5-intro', type: 'intro', markdown: `¡Hey, {{audience}}! Soy **{{mascot}}** {{mascotEmoji}}, y hoy seguimos avanzando en esta gran aventura.

En esta misión vamos a **llenar nuestro maletín de palabras útiles** 🧳. Aprenderemos vocabulario clave para hablar de **trabajo, estudios, tecnología y relaciones**.

Con estas palabras podrás describir tu profesión, tus estudios o lo que ocurre en tu día a día digital y social. ¡Manos a la obra, que arrancamos! ✨` },
      { id: 'modulo3-5-teoria-1', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**1.** **Cajón 1: Trabajo y Estudios 💼📚**

Empecemos con las palabras del mundo laboral y académico:

| English | Español |
| --- | --- |
| job | trabajo |
| career | carrera profesional |
| salary | salario |
| interview | entrevista |
| degree | título universitario |
| lecture | conferencia / clase |
| exam | examen |

📌 **Ejemplo:** *"She applied for a job and had an interview."* → *"Ella solicitó un trabajo y tuvo una entrevista."*`,
        miniQuiz: [
          mc('She applied for a ___ and had an interview. (trabajo)', ['job', 'salary', 'lecture', 'degree'], 0),
          mc('He earned a university ___ in engineering. (título)', ['lecture', 'degree', 'exam', 'career'], 1),
          mc('My monthly ___ is enough to pay rent. (salario)', ['interview', 'salary', 'career', 'job'], 1),
          mc('"lecture" significa…', ['lectura', 'conferencia / clase', 'examen', 'biblioteca'], 1),
          mc('I was nervous before the job ___. (entrevista)', ['interview', 'degree', 'salary', 'lecture'], 0),
          mc('I have a final ___ next week. (examen)', ['exam', 'degree', 'salary', 'career'], 0),
          tap('Toca la palabra incorrecta (falso amigo):', ['I', 'went', 'to', 'an', 'interesting', 'reading', 'at', 'the', 'university.'], 5, 'lecture'),
          rebuild('🎧 Reconstruye:', 'She had a job interview', ['She', 'had', 'a', 'job', 'interview', 'salary', 'degree', 'career']),
        ] },
      { id: 'modulo3-5-teoria-1b', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**2.** **Cajón 2: Tecnología 💻**

Ahora las palabras de tu vida digital:

| English | Español |
| --- | --- |
| computer | computadora |
| smartphone | teléfono inteligente |
| app | aplicación |
| email | correo electrónico |
| download | descargar |
| backup | copia de seguridad |
| laptop | portátil |

📌 **Ejemplo:** *"I need to backup my files and download the new software."* → *"Necesito hacer una copia de seguridad de mis archivos y descargar el nuevo software."*`,
        miniQuiz: [
          mc('I need to ___ the new app to my phone. (descargar)', ['download', 'upload', 'backup', 'email'], 0),
          mc('I work on my ___ at the café. (portátil)', ['smartphone', 'laptop', 'email', 'app'], 1),
          mc('I sent you an ___ this morning. (correo)', ['app', 'email', 'backup', 'download'], 1),
          mc('"backup" significa…', ['descargar', 'copia de seguridad', 'aplicación', 'subir'], 1),
          mc('I installed a new ___ on my phone. (aplicación)', ['app', 'email', 'backup', 'laptop'], 0),
          mc('"download" significa…', ['descargar', 'subir', 'borrar', 'guardar'], 0),
          rebuild('🎧 Reconstruye:', 'I need to download the app', ['I', 'need', 'to', 'download', 'the', 'app', 'upload', 'backup', 'email']),
          rebuild('🎧 Reconstruye:', 'I sent the email on my laptop', ['I', 'sent', 'the', 'email', 'on', 'my', 'laptop', 'app', 'download', 'phone']),
        ] },
      { id: 'modulo3-5-teoria-2', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**3.** **Cajón 3: Relaciones personales ❤️**

Estas palabras te sirven para hablar de la gente que te rodea:

| English | Español |
| --- | --- |
| friend | amigo |
| partner | pareja |
| colleague | colega |
| married | casado |
| divorced | divorciado |
| trust | confianza |
| conflict | conflicto |

📌 **Ejemplo:** *"My colleague is like a friend, I trust him."* → *"Mi colega es como un amigo, confío en él."*`,
        miniQuiz: [
          mc('My ___ at work helps me with projects. (colega)', ['colleague', 'partner', 'friend', 'conflict'], 0),
          mc('I ___ him completely; he never lies. (confío en)', ['conflict', 'trust', 'divorce', 'marry'], 1),
          mc('They got ___ last summer. (casados)', ['divorced', 'married', 'partner', 'trust'], 1),
          mc('"partner" significa…', ['amigo', 'pareja', 'colega', 'vecino'], 1),
          mc('They argue a lot; there is a lot of ___. (conflicto)', ['conflict', 'trust', 'partner', 'friend'], 0),
          mc('"divorced" significa…', ['casado', 'divorciado', 'soltero', 'comprometido'], 1),
          rebuild('🎧 Reconstruye:', 'I trust my colleague', ['I', 'trust', 'my', 'colleague', 'partner', 'friend', 'conflict']),
          rebuild('🎧 Reconstruye:', 'They are married now', ['They', 'are', 'married', 'now', 'divorced', 'partner', 'friends']),
        ] },
      { id: 'modulo3-5-teoria-2b', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**4.** **Ejemplos paralelos (un cajón abierto por tema) 🗄️**

Mira cómo se combinan las palabras en frases reales:

| Tema | Ejemplo en inglés | Traducción |
| --- | --- | --- |
| 💼 Trabajo | She works in a bank and her salary is high. | Trabaja en un banco y su salario es alto. |
| 📚 Estudios | He has a degree in engineering and goes to a university. | Tiene un título en ingeniería y va a una universidad. |
| 💻 Tecnología | I sent the email on my laptop this morning. | Envié el correo en mi portátil esta mañana. |
| ❤️ Relaciones | They are married and live with their family. | Están casados y viven con su familia. |

¿Ves cómo cada palabra encaja en su cajón? ¡Así no se te pierde ninguna! 🧦`,
        miniQuiz: [
          mc('En "her salary is high", ¿qué significa "salary"?', ['salario', 'banco', 'trabajo', 'entrevista'], 0),
          mc('En "He has a degree in engineering", "degree" es…', ['ingeniería', 'título universitario', 'universidad', 'clase'], 1),
          mc('En "I sent the email on my laptop", "laptop" es…', ['correo electrónico', 'portátil', 'teléfono', 'aplicación'], 1),
          mc('En "I sent the email", "email" es…', ['correo electrónico', 'aplicación', 'archivo', 'copia'], 0),
          mc('En "They are married", "married" es…', ['divorciados', 'casados', 'comprometidos', 'solteros'], 1),
          mc('En "I trust my colleague", "colleague" es…', ['colega', 'pareja', 'amigo', 'vecino'], 0),
          rebuild('🎧 Reconstruye:', 'She works in a bank', ['She', 'works', 'in', 'a', 'bank', 'salary', 'job', 'work']),
          rebuild('🎧 Reconstruye:', 'He has a degree in engineering', ['He', 'has', 'a', 'degree', 'in', 'engineering', 'lecture', 'exam', 'university']),
        ] },
      { id: 'modulo3-5-errores', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `#### **🚫 Errores Comunes**

¡Cuidado con estas trampas, {{audience}}! 🕳️

* **Falsos amigos 🎭:** *"lecture"* NO es *"lectura"*, sino **conferencia / clase**. (Lectura = *reading*.)
* **Pronunciación 🗣️:** *"Salary"* (salario) NO se pronuncia *"salad-ry"*. ¡No es una ensalada! 🥗
* **Palabras técnicas 🤖:** evita jergas o acrónimos sin explicar. En un correo formal *"CV"* está bien; en conversación coloquial puedes decir *"résumé"*.

Practiquemos detectando el error 👇`,
        miniQuiz: [
          tap('Toca la palabra incorrecta (falso amigo):', ['I', 'went', 'to', 'an', 'interesting', 'reading', 'at', 'the', 'university.'], 5, 'lecture'),
          tap('Toca la palabra incorrecta:', ['Her', 'salad', 'is', 'very', 'high', 'this', 'year.'], 1, 'salary'),
          tap('Toca la palabra incorrecta (falso amigo):', ['He', 'gave', 'a', 'reading', 'about', 'science', 'today.'], 3, 'lecture'),
          tap('Toca la palabra incorrecta:', ['I', 'will', 'reading', 'my', 'new', 'app', 'now.'], 2, 'download'),
          tap('Toca la palabra incorrecta (falso amigo):', ['I', 'attended', 'a', 'reading', 'on', 'history', 'yesterday.'], 3, 'lecture'),
          tap('Toca la palabra incorrecta:', ['My', 'salad', 'increased', 'last', 'month.'], 1, 'salary'),
          tap('Toca la palabra incorrecta:', ['Please', 'make', 'a', 'backup', 'and', 'reading', 'the', 'app.'], 5, 'download'),
          tap('Toca la palabra incorrecta (falso amigo):', ['The', 'professor', 'gave', 'a', 'long', 'reading', 'today.'], 5, 'lecture'),
        ] },
      { id: 'modulo3-5-resumen', type: 'resumen', markdown: `## **🎯 Resumen: Los cuatro cajones 🗄️**

Imagina **cuatro cajones en tu armario mental**, uno por tema. Cada palabra nueva va a su cajón:

| Cajón 🗄️ | Palabras clave |
| --- | --- |
| 💼 **Work** (trabajo) | job, career, **salary**, interview, **colleague** |
| 📚 **Education** (estudios) | **degree**, **lecture**, exam |
| 💻 **Tech** (tecnología) | **backup**, **download**, laptop, app |
| ❤️ **Relations** (relaciones) | friend, **partner**, **trust**, married |

🧠 **Mnemotecnia:** *"Work → salary, colleague. Education → degree, lecture. Tech → backup, download. Relations → trust, partner."*

**Lo más importante:**
* Cada palabra tiene **su cajón**: así la recuerdas más rápido.
* Ojo con los **falsos amigos** (*lecture* ≠ lectura).
* En el día a día, ¡usa estas palabras para sonar como parte de la tribu! 🌎` },
      { id: 'modulo3-5-cierre', type: 'cierre', markdown: `#### **🌟 Cierre**

¡Impresionante, {{audience}}! 🎉 Tu **maletín de vocabulario** está más lleno que nunca 🧳✨. Ya tienes palabras para hablar de **trabajo, estudios, tecnología y relaciones**.

Recuerda los **cuatro cajones**: *Work, Education, Tech, Relations*. Mete cada palabra nueva en el suyo y nunca se te perderá. 🗄️

Así que la próxima vez que alguien te pregunte por tu *career*, tu *degree* o tu *partner*… ¡tú ya sabes qué decir! 👀🗣️

✅ **Misión cumplida:** Sigue practicando estas palabras en tu día a día.

**🏅 Insignia obtenida:** *Vocabulario Funcional* 🧳✨` },
    ],
    quizQuestions: [
      mc('"Employer" significa…', ['empleado', 'empleador / jefe', 'entrevista', 'empleo'], 1),
      mc('"Scholarship" significa…', ['escuela', 'beca', 'examen', 'erudito'], 1),
      mc('"Upload" significa…', ['descargar', 'subir (archivo)', 'guardar', 'borrar'], 1),
      mc('"Neighbor" significa…', ['vecino', 'colega', 'pareja', 'amigo'], 0),
      mc('"Qualification" significa…', ['salario', 'título o diploma', 'conferencia', 'entrevista'], 1),
      mc('"Lecture" significa…', ['lectura', 'conferencia / clase', 'biblioteca', 'examen'], 1),
      mc('"copia de seguridad" en inglés es…', ['download', 'backup', 'app', 'upload'], 1),
      mc('She earns a good ___ at her new job. (salario)', ['salary', 'degree', 'lecture', 'interview'], 0),
      mc('I ___ my best friend with my secrets. (confío en)', ['trust', 'conflict', 'divorce', 'marry'], 0),
      tap('Toca la palabra incorrecta (falso amigo):', ['I', 'enjoyed', 'the', 'reading', 'at', 'the', 'university.'], 3, 'lecture'),
      tap('Toca la palabra incorrecta:', ['My', 'salad', 'is', 'higher', 'this', 'year.'], 1, 'salary'),
      tap('Toca la palabra incorrecta:', ['I', 'will', 'reading', 'the', 'new', 'app.'], 2, 'download'),
      rebuild('Escucha y reconstruye:', 'She had an interview', ['She', 'had', 'an', 'interview', 'job', 'salary', 'degree']),
      rebuild('Escucha y reconstruye:', 'I trust my colleague', ['I', 'trust', 'my', 'colleague', 'partner', 'friend', 'conflict']),
      rebuild('Escucha y reconstruye:', 'I sent the email on my laptop', ['I', 'sent', 'the', 'email', 'on', 'my', 'laptop', 'app', 'download', 'phone']),
    ],
  };

  const modulo3_6 = {
    id: 'modulo3-6',
    title: 'Microlección 6',
    durationMinutes: 13,
    audioCues: ['Escucha el contenido de la lección.', 'Fíjate en los puntos clave.', 'Ahora vienen tus ejercicios.'],
    contentBlocks: [
      { id: 'modulo3-6-titulo', type: 'titulo', title: '¿Le escribo con traje o con jeans? 🤵👕', subtitle: 'Cartas y correos formales e informales', markdown: '' },
      { id: 'modulo3-6-mision', type: 'mision', markdown: `## Aprender a **diferenciar y practicar la estructura y el lenguaje de la correspondencia formal vs informal en inglés**. Vas a descubrir cuándo usar cada estilo, qué saludos y despedidas elegir, y cómo ajustar el tono según a quién le escribes. ✍️` },
      { id: 'modulo3-6-intro', type: 'intro', markdown: `¡Nos vamos acercando a la cima, {{audience}}! 🏔️ Soy **{{mascot}}** {{mascotEmoji}}, y hoy toca poner por escrito todo lo aprendido.

En esta misión aprenderás a **redactar cartas y correos electrónicos formales e informales** en inglés. Veremos **cuándo usar cada estilo**, los **saludos**, las **despedidas** y el **tono apropiado** para cada situación.

Piénsalo así: a veces sales con **traje elegante** 🤵 y a veces con **camiseta y jeans** 👕. ¡Hoy aprendes a vestir bien tus cartas según la ocasión!` },
      { id: 'modulo3-6-teoria-1', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**1.** **Correspondencia FORMAL 🤵 (el traje elegante)**

La carta formal va **seria, ordenada y cortés**. Nada de jerga ni emojis, y **SIN contracciones** (escribe *cannot* en vez de *can't*).

**Saludos formales:**
* **"Dear Mr./Ms. [Apellido],"** → cuando conoces el nombre (Dear Ms. Smith,)
* **"Dear Sir/Madam,"** o **"To whom it may concern,"** → cuando NO conoces el nombre

**Despedidas formales:**
* **"Yours sincerely,"** → cuando sí sabes el nombre de la persona
* **"Yours faithfully,"** → especialmente cuando NO sabes el nombre
* **"Best regards,"** → opción cortés y versátil

**Estructura:** incluye **direcciones y fecha** en la cabecera, saludo formal, **párrafos organizados** con líneas en blanco entre ellos, frase de cierre y **firma**.

**Ejemplo:**

> Dear Ms. Smith,
>
> I am writing to request information about the course.
>
> Yours faithfully,
>
> Juan Pérez

Otro ejemplo educado y ordenado:

> Dear Mr. Johnson, I would like to apply for the position of assistant. Thank you for your time. Yours sincerely, María Gómez.`,
        miniQuiz: [
          mc('¿Qué saludo formal usas si NO conoces el nombre de la persona?', ['Hi there,', 'Dear Sir/Madam,', 'Hey!', 'Hello!'], 1),
          mc('¿Cuál es la forma correcta en una carta formal?', ["I can't attend.", 'I cannot attend.', "I'm not coming.", "I won't come."], 1),
          mc('¿Qué despedida formal usas cuando NO sabes el nombre?', ['Yours faithfully,', 'See you soon,', 'Love,', 'Cheers,'], 0),
          mc('¿Cómo empieza un saludo formal cuando SÍ conoces el apellido?', ['Hi Smith!', 'Dear Ms. Smith,', 'Hey Smith,', 'Hello Smith!'], 1),
          mc('En una carta formal, ¿se permiten contracciones (can\'t, I\'m)?', ['No, se escriben completas (cannot, I am)', 'Sí, siempre', 'Solo al final', 'Sí, con emojis'], 0),
          tap('Toca la palabra incorrecta (en formal no hay contracciones):', ['I', "can't", 'attend', 'the', 'formal', 'meeting.'], 1, 'cannot'),
          tap('Toca la palabra incorrecta (en formal no se abrevia "you"):', ['Thank', 'u', 'for', 'your', 'time.'], 1, 'you'),
          rebuild('🎧 Reconstruye este saludo formal:', 'Dear Sir or Madam', ['Dear', 'Sir', 'or', 'Madam', 'Hi', 'there', 'Hey']),
        ] },
      { id: 'modulo3-6-teoria-2', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**2.** **Correspondencia INFORMAL 👕 (camiseta y jeans)**

La carta informal es **relajada, cómoda y cercana**. Aquí SÍ se permiten **contracciones** (*can't, I'm*), **jerga**, **emojis** y un tono amistoso. Es para **amigos y familia**.

**Saludos informales:**
* **"Hi [nombre]!"** → Hi Carlos!
* **"Hello there,"**
* O simplemente el **nombre** de la persona

**Despedidas informales:**
* **"Love,"**
* **"See you soon!"**
* **"Take care,"**
* **"Cheers,"**

**Estructura:** mucho más **libre**, **sin encabezados formales** (no necesitas direcciones ni fecha).

**Ejemplo:**

> Hi Carlos!
>
> Thanks for your invitation. I can't wait to see you!
>
> See you soon!
>
> Mariela

Otro ejemplo relajado y amistoso:

> Hey Mike! It's been ages since we last talked. Let's catch up soon. Cheers, Ana.

**🔄 Comparación rápida:** Formal = **"usted"**, ordenado y serio. Informal = **"tú"**, casual y cercano. ¡Y nunca mezcles los dos estilos en una misma carta!`,
        miniQuiz: [
          mc('¿Qué saludo informal usarías para un amigo llamado Carlos?', ['Dear Mr. Carlos,', 'Hi Carlos!', 'To whom it may concern,', 'Dear Sir,'], 1),
          mc('¿Cuál es una despedida informal?', ['Yours faithfully,', 'See you soon!', 'Yours sincerely,', 'Respectfully,'], 1),
          mc('En una carta informal, ¿se permiten contracciones como "I can\'t"?', ['Sí, son normales', 'No, nunca', 'Solo en cartas formales', 'Solo en el saludo'], 0),
          mc('Formal equivale a "usted". ¿A qué equivale informal?', ['"usted" también', '"tú"', 'a ninguno', 'a "ellos"'], 1),
          mc('Despedida informal y cariñosa:', ['Love,', 'Yours faithfully,', 'Best regards,', 'Respectfully,'], 0),
          mc('En la carta informal, la estructura es...', ['libre, sin encabezados formales', 'con dirección y fecha obligatorias', 'siempre con "Dear Sir"', 'sin saludo'], 0),
          rebuild('🎧 Reconstruye este saludo informal:', 'Hi Carlos', ['Hi', 'Carlos', 'Dear', 'Sir', 'Madam']),
          rebuild('🎧 Reconstruye esta despedida informal:', 'See you soon', ['See', 'you', 'soon', 'Yours', 'faithfully', 'sincerely']),
        ] },
      { id: 'modulo3-6-errores', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `#### **🚫 Errores Comunes**

¡Ojo, {{audience}}! 👀 Estos son los tropiezos más frecuentes al escribir cartas:

* **Mezclar tonos** 🤵👕: empezar informal y terminar formal (o al revés). Mal: *"Dear John, I hope all is well. Sincerely, Jane."* — el saludo va con nombre suelto pero la despedida es súper formal. ¡No combines traje con sandalias!
* **Abreviaturas en cartas formales:** no uses *"u"* por *you* ni emoticonos en lo formal. Mantén el **inglés estándar**.
* **No saber el nombre:** si lo desconoces, usa **"Dear Sir/Madam,"** o **"To whom it may concern,"** en una carta formal.
* **Errores de formato:** olvidar las **líneas en blanco** entre párrafos le resta profesionalidad a la carta formal.`,
        miniQuiz: [
          tap('Toca la palabra incorrecta (carta formal, no se usan emojis ni jerga):', ['Dear', 'Ms.', 'Smith,', 'thanks', '😀'], 4, '(quítalo)'),
          tap('Toca la palabra incorrecta (en formal no se abrevia "you"):', ['I', 'will', 'send', 'u', 'the', 'report.'], 3, 'you'),
          tap('Toca la palabra incorrecta (en formal no hay contracciones):', ['I', "can't", 'attend', 'the', 'meeting.'], 1, 'cannot'),
          tap('Toca la palabra incorrecta (no sabes el nombre, debe ser formal):', ['Hey!', 'I', 'am', 'writing', 'to', 'apply.'], 0, 'Dear Sir/Madam,'),
          tap('Toca la palabra incorrecta (en formal no se abrevia "you"):', ['Thank', 'u', 'for', 'the', 'information.'], 1, 'you'),
          tap('Toca la palabra incorrecta (en formal no hay contracciones):', ['I', "won't", 'be', 'able', 'to', 'come.'], 1, 'will not'),
          tap('Toca la palabra incorrecta (en formal no hay contracciones):', ['Dear', 'Sir,', 'I', "can't", 'attend.'], 3, 'cannot'),
          tap('Toca la palabra incorrecta (en formal no se abrevia "you"):', ['Dear', 'Ms.', 'Lee,', 'I', 'will', 'send', 'u', 'it.'], 6, 'you'),
        ] },
      { id: 'modulo3-6-resumen', type: 'resumen', markdown: `## **🎯 Resumen: traje elegante vs camiseta y jeans**

| | **FORMAL 🤵** | **INFORMAL 👕** |
| --- | --- | --- |
| Saludo | Dear Mr./Ms. [Apellido], / Dear Sir/Madam, | Hi [nombre]! / Hello there, |
| Despedida | Yours sincerely, / Yours faithfully, / Best regards, | Love, / See you soon! / Take care, / Cheers, |
| Tono | Serio, cortés, "usted" | Cercano, relajado, "tú" |
| Contracciones | ❌ cannot (no can't) | ✅ can't, I'm |
| Jerga y emojis | ❌ No | ✅ Sí |
| Estructura | Direcciones, fecha, párrafos ordenados | Libre, sin encabezados |

**🧠 Mnemotecnia:** La carta **formal lleva traje elegante y maletín** 🤵💼: ordenada, sin sorpresas, sin contracciones. La **informal lleva camiseta y jeans** 👕👖: cómoda y casual. **Formal = "usted", informal = "tú"** — ¡nunca mezclar los dos!` },
      { id: 'modulo3-6-cierre', type: 'cierre', markdown: `#### **🌟 Cierre**

¡Muy bien redactado, {{audience}}! 🎉 Ahora sabes ponerle a cada carta el **vestuario correcto**: el **traje elegante** 🤵 para lo formal y la **camiseta y jeans** 👕 para lo cercano.

Recuerda:

* **Formal:** *Dear Mr./Ms.*, despedidas como *Yours sincerely/faithfully*, sin contracciones, tono serio.
* **Informal:** *Hi [nombre]!*, despedidas como *See you soon!* o *Take care*, con contracciones y emojis permitidos.
* **Nunca mezcles** los dos estilos en una misma carta. ✂️

Ahora estarás list@ para **impresionar con tus cartas y correos**. ¡Nos vemos en la próxima lección!

**🏅 Insignia obtenida:** *Escritor Formal* (Maestr@ de cartas y correos) ✍️✨` },
    ],
    quizQuestions: [
      mc('"Dear Professor Lee," es un registro…', ['Formal', 'Informal', 'de chat', 'oral'], 0),
      mc('"Hi John, what\'s up?" es un registro…', ['Formal', 'Informal', 'de negocios', 'académico'], 1),
      mc('¿Qué despedida formal usas cuando NO conoces el nombre?', ['Love,', 'Yours faithfully,', 'Cheers,', 'See you soon,'], 1),
      mc('Saludo correcto para un amigo:', ['Dear Sir/Madam,', 'Hi Carlos!', 'To whom it may concern,', 'Dear Mr. Carlos,'], 1),
      mc('En una carta formal escribes...', ["cannot (no can't)", "can't", 'u (por you)', 'emojis'], 0),
      mc('"Yours sincerely," se usa cuando...', ['SÍ conoces el nombre', 'NO conoces el nombre', 'escribes a un amigo', 'es un chat'], 0),
      mc('¿Cuál NO debe ir en una carta formal?', ['Yours faithfully,', 'Dear Sir/Madam,', 'See you soon! 😀', 'I am writing to...'], 2),
      mc('"Take care, see you soon!" es...', ['Formal', 'Informal', 'una carta de negocios', 'un saludo'], 1),
      tap('Toca la palabra incorrecta (en formal no se abrevia "you"):', ['Thank', 'u', 'for', 'your', 'time.'], 1, 'you'),
      tap('Toca la palabra incorrecta (carta formal, sin contracción):', ['I', "can't", 'wait', 'to', 'help', 'you.'], 1, 'cannot'),
      tap('Toca la palabra incorrecta (en formal no se abrevia "you"):', ['Dear', 'Sir,', 'I', 'will', 'send', 'u', 'the', 'file.'], 5, 'you'),
      rebuild('🎧 Reconstruye este saludo formal:', 'Dear Ms. Smith', ['Dear', 'Ms.', 'Smith', 'Hi', 'there', 'Hey']),
      rebuild('🎧 Reconstruye esta despedida formal:', 'Yours sincerely', ['Yours', 'sincerely', 'See', 'you', 'soon', 'faithfully']),
      rebuild('🎧 Reconstruye este saludo informal:', 'Hi Carlos', ['Hi', 'Carlos', 'Dear', 'Sir', 'Madam']),
      rebuild('🎧 Reconstruye esta despedida informal:', 'See you soon', ['See', 'you', 'soon', 'Yours', 'faithfully', 'sincerely']),
    ],
  };

  const modulo3_7 = {
    id: 'modulo3-7',
    title: 'Microlección 7',
    durationMinutes: 12,
    audioCues: ['Escucha el contenido de la lección.', 'Fíjate en los puntos clave.', 'Ahora vienen tus ejercicios.'],
    contentBlocks: [
      { id: 'modulo3-7-titulo', type: 'titulo', title: '¿Cómo uno mis ideas para que suenen fluidas? 🌉', subtitle: 'Conectores discursivos', markdown: '' },
      { id: 'modulo3-7-mision', type: 'mision', markdown: `## Usar **conectores en inglés** para dar **fluidez y coherencia** al hablar y escribir, identificando cuándo usar palabras de **adición**, **contraste** y **causa**. ⚙️💬

Al terminar, tus oraciones dejarán de sonar sueltas y separadas, y empezarán a fluir como un viaje sin baches. 🛣️✨` },
      { id: 'modulo3-7-intro', type: 'intro', markdown: `¡Hola, {{audience}}! Soy **{{mascot}}** {{mascotEmoji}}, y… ¡estamos a punto de terminar! 🎉

Para cerrar con broche de oro necesitamos **atar todas nuestras ideas con conectores**. 🪢

Son las **palabras puente** que unen oraciones, como *but*, *because*, *however*, etc. Sin ellas, hablar en inglés es como dar saltitos de piedra en piedra 🪨🪨🪨; con ellas, es un **puente sólido** que cruzas sin caerte. 🌉

Hoy aprenderás a usar conectores de **adición**, **contraste**, **causa** y más. ¡Vamos a construir! 👷‍♂️🧱` },
      { id: 'modulo3-7-teoria-1', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**1.** **Ladrillos azules y negros: añadir y contrastar 🧱**

Empecemos con dos tipos de ladrillos.

### ➕ Conectores para AÑADIR ideas (ladrillos azules 🔵)

| Conector | Uso | Ejemplo |
| --- | --- | --- |
| and | y | She likes coffee, **and** she also drinks tea. |
| also | también | She likes coffee, and she **also** drinks tea. |
| furthermore / moreover | además | She can cook well. **In addition**, she bakes delicious cakes. |

### ⚖️ Conectores de CONTRASTE / oposición (ladrillos negros ⚫)

| Conector | Uso | Ejemplo |
| --- | --- | --- |
| but | pero | He is young, **but** very responsible. |
| however | sin embargo | I like tea. **However**, I love coffee more. |
| on the other hand | por otro lado | It's cheap. **On the other hand**, it's not very good. |

🤖 **Tip de {{mascot}}:** *yet* también contrasta, como en *"He loves music, **yet** he never goes to concerts."* (Le encanta la música, **aunque** nunca va a conciertos.)`,
        miniQuiz: [
          mc('¿Qué conector usas para AÑADIR una idea?', ['but', 'however', 'and', 'because'], 2),
          mc('"He is young, ___ very responsible." (pero)', ['and', 'but', 'also', 'so'], 1),
          mc('¿Qué significa "however"?', ['además', 'sin embargo', 'porque', 'así que'], 1),
          mc('"On the other hand" significa…', ['por otro lado', 'por lo tanto', 'también', 'porque'], 0),
          mc('"I like tea. ___, I love coffee more." (sin embargo)', ['However', 'And', 'Also', 'Because'], 0),
          mc('"furthermore / moreover" se usan para...', ['añadir información', 'contrastar', 'dar la causa', 'el tiempo'], 0),
          tap('Toca la palabra incorrecta:', ['She', 'is', 'kind', 'but', 'however', 'very', 'smart.'], 4, '(quítalo)'),
          rebuild('🎧 Reconstruye:', 'He is young, but very responsible', ['He', 'is', 'young,', 'but', 'very', 'responsible', 'and', 'however', 'so']),
        ] },
      { id: 'modulo3-7-teoria-2', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**2.** **Ladrillos rojos y el orden de la obra 🧱🔴**

### 🔥 Conectores CAUSALES (razón / consecuencia – ladrillos rojos 🔴)

| Conector | Uso | Ejemplo |
| --- | --- | --- |
| because | porque | She was late **because** she missed the bus. |
| due to | debido a | The delay was **due to** the rain. |
| since | puesto que | **Since** it was raining, we stayed home. |
| therefore | por lo tanto | I studied hard; **therefore**, I passed. |
| so | así que | I studied hard, **so** I passed the exam. |

### ⏱️ Conectores de TIEMPO y ORDEN

| Conector | Uso | Ejemplo |
| --- | --- | --- |
| then / next | entonces / luego | First, we went shopping. **Then**, we had lunch. |
| first / second | primero / segundo | **First**, we went shopping. |
| finally | finalmente | **Finally**, we went home. |

📌 **Recuerda:** *because* responde *¿por qué?* (la causa 🔴) y *so* responde *¿y entonces?* (la consecuencia ➡️).`,
        miniQuiz: [
          mc('¿Qué significa "because"?', ['así que', 'porque', 'sin embargo', 'además'], 1),
          mc('"I studied hard, ___ I passed the exam." (así que)', ['so', 'but', 'and', 'because'], 0),
          mc('¿Qué conector indica ORDEN/SECUENCIA?', ['because', 'however', 'first', 'so'], 2),
          mc('"___, we went shopping. Then, we had lunch." (primero)', ['Finally', 'First', 'However', 'Because'], 1),
          mc('"therefore" significa…', ['por lo tanto', 'también', 'debido a', 'pero'], 0),
          tap('Toca la palabra incorrecta:', ['I', 'studied', 'hard,', 'but', 'I', 'passed', 'the', 'exam.'], 3, 'so'),
          tap('Toca la palabra incorrecta:', ['It', 'was', 'raining,', 'and', 'we', 'stayed', 'home.'], 3, 'so'),
          rebuild('🎧 Reconstruye:', 'She was late because she missed the bus', ['She', 'was', 'late', 'because', 'she', 'missed', 'the', 'bus', 'so', 'however']),
        ] },
      { id: 'modulo3-7-errores', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `#### **🚫 Errores Comunes**

Hasta los mejores constructores ponen ladrillos de más. 🧱😅 Cuidado con estos:

* **Redundancia de conectores:** no uses demasiados.
  * ❌ *"She is kind **and also** helpful, **and moreover** friendly."*
  * ✅ *"She is kind **and** helpful."*
* **Errores de orden:** *however* va al inicio (*"**However**, I liked it."*) o al final separado por coma (*"I liked it, **however**."*), pero no en cualquier lugar.
* **"but however" juntos:** ❌ no. Ambos significan *"pero"*. Usa **uno u otro**.
* **"Because" al inicio (informal):** en escritura formal se prefiere *because* en medio, o usar **Since / As** al inicio.

¡Toca los errores y conviértete en inspector de obra! 👷‍♀️🔍`,
        miniQuiz: [
          tap('Toca la palabra incorrecta:', ['She', 'is', 'kind', 'but', 'however', 'friendly.'], 4, '(quítalo)'),
          tap('Toca la palabra incorrecta:', ['I', 'studied', 'hard,', 'but', 'I', 'passed.'], 3, 'so'),
          tap('Toca la palabra incorrecta:', ['She', 'was', 'late', 'so', 'she', 'missed', 'the', 'bus.'], 3, 'because'),
          tap('Toca la palabra incorrecta:', ['First', 'we', 'shopped.', 'However,', 'we', 'had', 'lunch.'], 3, 'Then'),
          tap('Toca la palabra incorrecta:', ['It', 'was', 'cold,', 'and', 'we', 'stayed', 'inside.'], 3, 'so'),
          tap('Toca la palabra incorrecta:', ['He', 'is', 'rich,', 'and', 'he', 'is', 'not', 'happy.'], 3, 'but'),
          tap('Toca la palabra incorrecta:', ['She', 'is', 'smart', 'and', 'also', 'kind', 'and', 'moreover', 'funny.'], 7, '(quítalo)'),
          tap('Toca la palabra incorrecta:', ['We', 'were', 'late', 'but', 'we', 'missed', 'the', 'train.'], 3, 'so'),
        ] },
      { id: 'modulo3-7-resumen', type: 'resumen', markdown: `## **🎯 Resumen: Los ladrillos de colores 🧱**

Los conectores son **ladrillos que construyen puentes entre ideas**. 🌉 Memoriza el color:

| Color | Conectores | Para qué |
| --- | --- | --- |
| 🔵 Azul (suma) | and, also, furthermore / moreover | añadir ideas |
| ⚫ Negro (contraste) | but, however, on the other hand, yet | oponer ideas |
| 🔴 Rojo (causa-efecto) | because, due to, since, therefore, so | dar razón / consecuencia |
| 🟡 Orden | first, then / next, finally | secuencia y tiempo |

🧠 **Mnemotecnia:** *Azul suma, negro contrasta, rojo explica.* 🔵➕ ⚫⚖️ 🔴🔥

**Lo más importante:**
* Usa **un solo conector** por idea (no abuses 🚫🧱🧱🧱).
* *because* = causa 🔴 ; *so* = consecuencia ➡️.` },
      { id: 'modulo3-7-cierre', type: 'cierre', markdown: `#### **🌟 Cierre**

¡Excelente, constructor@! 👏 Tus oraciones suenan ahora más **fluidas y sofisticadas**. Ya no das saltitos sueltos: ahora tiendes **puentes** entre tus ideas. 🌉✨

Recuerda los colores de tus ladrillos:
* 🔵 **and / also** suman,
* ⚫ **but / however** contrastan,
* 🔴 **because / so** explican causa y efecto.

¡Tu inglés brilla con **lógica y orden**! Sigue construyendo, {{audience}}. ⚡

**🏅 Insignia obtenida:** *Constructor de Ideas* 👷‍♂️🧱✨` },
    ],
    quizQuestions: [
      mc('I wanted to go, ___ I was too busy.', ['and', 'but', 'so', 'because'], 1),
      mc('She is intelligent ___ works very hard.', ['and', 'but', 'however', 'so'], 0),
      mc('It was raining, ___ we stayed home.', ['but', 'so', 'and', 'however'], 1),
      mc('She was late ___ she missed the bus. (porque)', ['so', 'because', 'and', 'but'], 1),
      mc('I like tea. ___, I love coffee more. (sin embargo)', ['However', 'Because', 'Also', 'So'], 0),
      mc('First, we went shopping. ___, we had lunch.', ['However', 'Then', 'But', 'Because'], 1),
      mc('She can cook well. ___, she bakes cakes. (además)', ['In addition', 'On the other hand', 'Because', 'However'], 0),
      mc('He loves music, ___ he never goes to concerts. (aunque)', ['so', 'because', 'yet', 'and'], 2),
      tap('Toca la palabra incorrecta:', ['She', 'is', 'kind,', 'but', 'however', 'friendly.'], 4, '(quítalo)'),
      tap('Toca la palabra incorrecta:', ['It', 'was', 'raining,', 'but', 'we', 'stayed', 'home.'], 3, 'so'),
      tap('Toca la palabra incorrecta:', ['She', 'was', 'late', 'so', 'she', 'missed', 'the', 'bus.'], 3, 'because'),
      rebuild('Escucha y reconstruye:', 'He is young, but very responsible', ['He', 'is', 'young,', 'but', 'very', 'responsible', 'and', 'so', 'because']),
      rebuild('Escucha y reconstruye:', 'She was late because she missed the bus', ['She', 'was', 'late', 'because', 'she', 'missed', 'the', 'bus', 'so', 'however']),
      rebuild('Escucha y reconstruye:', 'I studied hard, so I passed the exam', ['I', 'studied', 'hard,', 'so', 'I', 'passed', 'the', 'exam', 'but', 'and', 'because']),
      rebuild('Escucha y reconstruye:', 'First, we went shopping. Then, we had lunch', ['First,', 'we', 'went', 'shopping.', 'Then,', 'we', 'had', 'lunch', 'Finally,', 'so', 'but']),
    ],
  };

  const modulo3_8 = {
    id: 'modulo3-8',
    title: 'Microlección 8',
    durationMinutes: 13,
    audioCues: ['Escucha el contenido de la lección.', 'Fíjate en los puntos clave.', 'Ahora vienen tus ejercicios.'],
    contentBlocks: [
      { id: 'modulo3-8-titulo', type: 'titulo', title: '¿Listo para correr la carrera del PET? 🏁', subtitle: 'Estrategias para el PET: reading, listening y writing', markdown: '' },
      { id: 'modulo3-8-mision', type: 'mision', markdown: `## Aprender **estrategias clave de lectura, escucha y escritura** para el examen **PET (Preliminary English Test, nivel B1)**, mejorando la comprensión y la producción escrita **bajo presión**. ⏱️⚙️` },
      { id: 'modulo3-8-intro', type: 'intro', markdown: `¡Lo hicimos hasta el final del viaje! 🥹🤖 Soy **{{mascot}}**, y hoy somos exploradores listos para el **PET**. Para una buena ruta no basta con saber inglés: necesitas **herramientas estratégicas**. 🧰

En esta misión veremos **trucos para exámenes**: cómo **leer y escuchar inteligentemente**, y cómo **escribir bien en poco tiempo**. ¡Sube, que arrancamos! 🏁` },
      { id: 'modulo3-8-teoria-1', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**1.** **Reading y Listening: escucha y lee como un detective 🕵️‍♀️**

**📖 Comprensión lectora (Reading):**

* **Antes de leer, mira las preguntas** para saber qué buscar.
* Lee **rápido** todo el texto para la **idea general**, luego **vuelve a leer con calma** para encontrar respuestas exactas (nombres, fechas).
* Marca **palabras clave** en las preguntas y busca **sinónimos** en el texto.

> 💡 Si la pregunta dice *"deadly disease"*, el texto puede decir *"fatal illness"*. ¡Es lo mismo disfrazado!

> 💡 **Scanning** (escanear) ahorra tiempo: ubica primero los datos, luego lee esa parte con calma. Pregunta: *"What did John give Sarah?"* → busca *"John"* y *"Sarah"* y lee ahí.

**🎧 Comprensión auditiva (Listening):**

* **LEE todas las preguntas antes de escuchar.**
* Escucha la grabación **dos veces** si es posible.
* Concéntrate en **palabras clave**: números, nombres, lugares.
* No te preocupes si no entiendes todo; **captura lo importante**.

> 💡 Pregunta: *"What time does the train leave?"* → enfócate en capturar *"at five o'clock"*. Si oyes *"next Tuesday"*, ¡esa es tu fecha de interés!`,
        miniQuiz: [
          mc('En Listening, ¿qué conviene hacer ANTES de que empiece el audio?', ['Leer todas las preguntas primero.', 'Cerrar los ojos y relajarse.', 'Escribir tu respuesta final.', 'Traducir el título al español.'], 0),
          mc('En Reading, el título y los subtítulos...', ['se deben ignorar', 'ayudan: dan pistas, no los ignores', 'no existen en el PET', 'hay que memorizarlos'], 1),
          mc('La pregunta dice "deadly disease" y el texto dice "fatal illness". ¿Qué pasa?', ['No tienen relación.', 'Son sinónimos: significan lo mismo.', 'El texto está mal escrito.', 'Es un error de imprenta.'], 1),
          mc('¿Cuál es la mejor primera lectura de un texto en Reading?', ['Leer rápido para la idea general.', 'Memorizar cada palabra.', 'Traducir todo al español.', 'Leer solo la última línea.'], 0),
          mc('"Scanning" (escanear) sirve para...', ['ubicar datos específicos (nombres, fechas) rápido', 'leer en voz alta', 'memorizar el texto', 'traducir palabra por palabra'], 0),
          mc('En Listening del PET, normalmente el audio...', ['solo una vez', 'se escucha dos veces', 'no se escucha', 'se escucha cinco veces'], 1),
          rebuild('🎧 Reconstruye:', 'Read the questions first', ['Read', 'the', 'questions', 'first', 'last', 'answers', 'audio']),
          rebuild('🎧 Reconstruye:', 'Listen for key words', ['Listen', 'for', 'key', 'words', 'read', 'all', 'numbers']),
        ] },
      { id: 'modulo3-8-teoria-2', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**2.** **Writing: escribe bien y a tiempo ✍️⏱️**

En el PET escribes un **correo corto** (carta informal) y otro **texto breve** (historia o artículo), en **~20-25 min cada uno**. Apunta a **~100 palabras** (80-100).

* **Primero PLANEA:** haz un **esquema rápido** (introducción, puntos clave, despedida).
* Usa **conectores**: *however*, *because*.
* Incluye **un par de frases complejas** con *which* o *because*.
* **Revisa** ortografía y tiempos verbales antes de entregar.

**🎩 Adecúa el registro:**

> 💡 **Correo informal** (a un amigo): empieza con *"Hi, Long time no see!"* y termina con *"See you soon,"* o *"Take care,"*. Útil: *"I'm really looking forward to..."*

> 💡 **Email formal:** empieza con *"Dear Sir/Madam,"* y cierra con *"Yours faithfully,"*.

  | Situación        | Saludo              | Despedida          |
  | ---------------- | ------------------- | ------------------ |
  | Amigo (informal) | Hi,                 | See you soon,      |
  | Formal           | Dear Sir/Madam,     | Yours faithfully,  |`,
        miniQuiz: [
          mc('¿Qué debes hacer PRIMERO al escribir en el PET?', ['Planear un esquema rápido.', 'Escribir sin pensar para ganar tiempo.', 'Contar las palabras del enunciado.', 'Empezar por la despedida.'], 0),
          mc('Para Writing PET, revisar gramática y ortografía es...', ['una pérdida de tiempo', 'necesario antes de entregar', 'opcional, nadie revisa', 'solo para el examen oral'], 1),
          mc('Para un email FORMAL, ¿qué despedida es la correcta?', ['See you soon,', 'Yours faithfully,', 'Long time no see!', 'Cheers,'], 1),
          mc('¿Cuántas palabras conviene apuntar en un texto del PET?', ['Alrededor de 100 (80-100).', 'Unas 300.', 'Solo 20.', 'Más de 500.'], 0),
          mc('Para conectar ideas en tu texto, usa...', ['conectores como however y because', 'solo "and" repetido', 'ningún conector', 'solo emojis'], 0),
          tap('Toca la palabra incorrecta:', ['Dear', 'Sir', 'or', 'Madam,', 'I', 'are', 'writing', 'to', 'apply.'], 5, 'am'),
          tap('Toca la palabra incorrecta:', ['I', 'looking', 'forward', 'to', 'hearing', 'from', 'you.'], 1, 'am looking'),
          rebuild('🎧 Reconstruye el cierre formal:', 'Yours faithfully', ['Yours', 'faithfully', 'sincerely', 'See', 'soon', 'Cheers']),
        ] },
      { id: 'modulo3-8-errores', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `#### **🚫 Errores Comunes**

* 🎧 **Presionar play muy rápido:** en Listening PET es normal escuchar cada parte **dos veces**; aprovecha el tiempo entre clips para leer la siguiente pregunta.
* 📝 **No responder todas las preguntas:** en Writing responde **todas las partes** (si el email pide *motivo, acciones, despedida*, ¡hazlas todas!).
* 📏 **Desconocer el formato:** se escribe **~100 palabras** (apunta 80-100), ni mucho más ni mucho menos.
* 🔀 **Tiempos verbales incorrectos:** cuida la concordancia; no mezcles pasado y presente sin motivo.

¡Vamos a cazar esos errores en frases reales! 🕵️‍♂️`,
        miniQuiz: [
          tap('Corrige el saludo de un email formal:', ['Dears', 'Sir', 'or', 'Madam,', 'I', 'am', 'writing', 'to', 'you.'], 0, 'Dear'),
          tap('Una palabra está mal. Corrígela:', ['Hi,', 'long', 'time', 'no', 'sea!'], 4, 'see'),
          tap('Hay un error de tiempo verbal. Tócalo:', ['Yesterday', 'I', 'go', 'to', 'the', 'cinema.'], 2, 'went'),
          tap('Corrige el cierre de la carta formal:', ['Yours', 'faithful,', '{{mascot}}'], 1, 'faithfully,'),
          tap('Una palabra sobra en esta frase. Tócala:', ['I', 'am', 'really', 'looking', 'very', 'forward', 'to', 'it.'], 4, '(quítalo)'),
          tap('Hay un error de tiempo verbal. Tócalo:', ['Last', 'week', 'I', 'visit', 'my', 'family.'], 3, 'visited'),
          tap('Toca la palabra incorrecta:', ['Dear', 'Sir,', 'I', 'are', 'writing', 'to', 'apply.'], 3, 'am'),
          tap('Toca la palabra incorrecta:', ['I', 'look', 'forward', 'to', 'hear', 'from', 'you.'], 4, 'hearing'),
        ] },
      { id: 'modulo3-8-resumen', type: 'resumen', markdown: `## **🎯 Resumen: la carrera contrarreloj 🏁⏱️**

El examen es una **carrera contrarreloj**. Memoriza tu estrategia de piloto:

* 🏁 **Lee la meta antes de correr:** en Reading, mira las **preguntas** antes de leer el texto.
* 🎧 **Adelanta el volante:** en Listening, lee las preguntas **antes** de oír el audio (y escucha dos veces).
* 🗺️ **Haz un mapa mental:** en Writing, planea un **esquema rápido** antes de soltar teclas, cuida el **registro** y revisa al final.

> 🧠 **Mnemotecnia – Carrera contrarreloj:** *Lee la META antes de correr, adelanta el VOLANTE leyendo, dibuja el MAPA antes de teclear.* ⚡` },
      { id: 'modulo3-8-cierre', type: 'cierre', markdown: `#### **🌟 Cierre**

¡Lo has dado todo! 💪 Con estas **estrategias de experto**, el examen **PET será pan comido** 🍞✨. Lee como detective, escucha cazando palabras clave y escribe con tu mapa mental listo.

🎉 **¡Felicidades por completar el Módulo 3!** Sigue brillando en tu camino hacia la certificación. ⚙️🌟

**🏅 Insignia obtenida:** ✨ *Maestro del PET* 🎖️` },
    ],
    quizQuestions: [
      mc('En Listening, leer las preguntas antes del audio es...', ['útil', 'inútil', 'prohibido', 'imposible'], 0),
      mc('Para Writing PET, revisar gramática y ortografía es...', ['innecesario', 'necesario', 'opcional', 'una trampa'], 1),
      mc('En Reading, el título y los subtítulos...', ['se deben ignorar', 'dan pistas útiles', 'no existen', 'están en español'], 1),
      mc('En el PET conviene escribir...', ['alrededor de 100 palabras (80-100)', 'unas 300 palabras', 'solo 20 palabras', 'más de 500'], 0),
      mc('"deadly disease" en el texto puede aparecer como...', ['"fatal illness" (sinónimo)', 'un número', 'un nombre propio', 'nada relacionado'], 0),
      mc('En Listening PET, el audio normalmente se escucha...', ['dos veces', 'una sola vez', 'nunca', 'diez veces'], 0),
      mc('Despedida correcta de un email formal:', ['See you soon!', 'Yours faithfully,', 'Cheers!', 'Bye!'], 1),
      mc('Lo PRIMERO al escribir en el PET es...', ['planear un esquema', 'escribir la despedida', 'contar palabras', 'dibujar'], 0),
      tap('Corrige el error de tiempo verbal:', ['Last', 'week', 'I', 'visit', 'my', 'family.'], 3, 'visited'),
      tap('Toca la palabra incorrecta:', ['Dear', 'Sir', 'or', 'Madam,', 'I', 'are', 'writing', 'to', 'apply.'], 5, 'am'),
      tap('Toca la palabra incorrecta:', ['I', 'look', 'forward', 'to', 'hear', 'from', 'you.'], 4, 'hearing'),
      rebuild('🎧 Reconstruye el saludo informal:', 'Hi, long time no see!', ['Hi,', 'long', 'time', 'no', 'see!', 'Dear', 'soon', 'faithfully']),
      rebuild('🎧 Reconstruye el cierre formal:', 'Yours faithfully, {{mascot}}', ['Yours', 'faithfully,', '{{mascot}}', 'See', 'soon', 'Hi']),
      rebuild('🎧 Reconstruye:', 'Read the questions before listening', ['Read', 'the', 'questions', 'before', 'listening', 'after', 'audio', 'answers']),
      rebuild('🎧 Reconstruye:', 'I am writing to apply', ['I', 'am', 'writing', 'to', 'apply', 'are', 'write', 'applying']),
    ],
  };

  const module3 = {
    id: 'modulo-3',
    title: 'Módulo 3: Rumbo al B1',
    description: 'Al completar este módulo manejarás inglés B1 camino al PET: presente perfecto vs. pasado, hábitos con used to/would, condicionales, estilo indirecto, vocabulario funcional, correspondencia formal e informal, conectores y estrategias de examen. 🎓',
    lessons: [
      modulo3_1, modulo3_2, modulo3_3, modulo3_4,
      modulo3_5, modulo3_6, modulo3_7, modulo3_8,
    ],
  };

  if (typeof window !== 'undefined' && window.COURSE_DATA) {
    window.COURSE_DATA.modules.push(module3);
  }
})();
