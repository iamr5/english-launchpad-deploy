// COURSE_DATA — ported 1:1 from lib/elearning/data/module1_microlection*_data.dart
// Quiz types: 'mc' (multiple choice), 'rebuild' (rebuild what you heard), 'tap' (tap to highlight / error spotting),
//             'writing' (el alumno escribe la respuesta en una caja de texto)
// This file is the single source of lesson content for the web port of the Inglés feature.

const mc = (question, options, correctIndex) => ({ type: 'mc', question, options, correctIndex });
const rebuild = (question, correctSentence, wordBlocks) => ({ type: 'rebuild', question, correctSentence, wordBlocks });
const tap = (question, sentenceTokens, errorTokenIndex, correctedToken) => ({ type: 'tap', question, sentenceTokens, errorTokenIndex, correctedToken });
// writing(enunciado, aceptadas, extra)
//   aceptadas — string o array. La PRIMERA es la canónica: es la que se le
//               muestra al alumno cuando falla, así que escríbela completa y
//               bien puntuada aunque el corrector ignore mayúsculas y signos.
//   extra     — { hint, reject, strict } (todo opcional)
//       hint   texto de ayuda bajo la caja mientras escribe.
//       reject [[respuesta, motivo], …] — errores previsibles que se marcan mal
//              con una explicación concreta en vez del genérico "Casi —".
//       strict true apaga la tolerancia a dedazos (para cuando la ortografía ES
//              lo evaluado).
// El corrector ignora mayúsculas, tildes, signos y espacios de más, y expande
// contracciones ("I'm" = "I am"). Ver gradeWriting() en la app.
const writing = (question, accepted, extra) => Object.assign(
  { type: 'writing', question, accepted: [].concat(accepted) }, extra || {});

const microlection1 = {
  id: 'modulo1-1',
  title: 'Microlección 1',
  durationMinutes: 12,
  audioCues: ['Escucha el contenido de la lección.', 'Fíjate en los puntos clave.', 'Ahora vienen tus ejercicios.'],
  contentBlocks: [
    { id: 'modulo1-1-titulo', type: 'titulo', title: '¿Cómo cuento lo que hago cada día?', subtitle: 'Presente Simple', markdown: '' },
    { id: 'modulo1-1-mision', type: 'mision', markdown: `Aprender a **hablar de tu rutina diaria en inglés** usando el **Presente Simple**, describiendo lo que haces habitualmente (trabajar, estudiar, comer, etc.) y contando lo que ocurre en tu día a día.` },
    { id: 'modulo1-1-intro', type: 'intro', markdown: `¡Hola! Soy **{{mascot}}**, tu {{mascotKind}} 😊. Hoy vamos a aprender a contar lo que haces normalmente o lo que está pasando, como si le contaras a alguien tu rutina mientras das una caminata ⌚.

En inglés utilizamos el **Present Simple** (presente simple) para hablar de rutinas. Es como narrar tu vida diaria: *tú* eres el protagonista, ¡así que empezaremos hablando de ti mismo pe mascota! Luego pasaremos a los demás (porque, ¿pensabas que no te iba a enseñar a **chismear**? ¡Claro que *yes* 😁!).` },
    { id: 'modulo1-1-sneakpeek', type: 'sneakPeek', markdown: `Vamos por partes, del más cercano al más lejano en tu pequeño mundo:

**1.** **Hablar de ti mismo (I)** – Comenzamos con quien mejor conoces: *tú mismo*.

**2.** **Hablar de tu grupo (we)** – Luego incluimos a quienes te acompañan en modo grupo, o sea *nosotros*.

**3.** **Hablar directamente con alguien (you)** – Cara a cara con otra persona, *tú* o *usted* o incluso... *ustedes*.

**4.** **Hablar sobre un grupo ajeno a ti** – Hablando otros o sea de *ellos* y *ellas*.

**5.** **Chismear sobre otros (he, she, it)** – Hablar de *ese patita* que no está presente (él, ella o eso).

En presente simple **afirmativo**, la estructura es muy sencilla.` },
    { id: 'modulo1-1-teoria-1', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**1.** **Hablar de ti (I)**

Usa **I** (yo) seguido del verbo en forma base (la forma simple, sin cambios):

O sea Yo + Verbo = I + Verb

  | Español                    | Inglés            |
  | -------------------------- | ----------------- |
  | Yo estudio inglés.         | I study English.  |
  | Yo trabajo todos los días. | I work every day. |

**¿Lo ves?** Con **I** (yo), usamos el verbo en presente *tal cual*, **sin cambios**. *I study*, *I work*, *I play*, etc. Solo dices lo que haces, así de simple.`,
      miniQuiz: [
        mc('I ___ English every day. (Yo)', ['study', 'studies', 'studying', 'to study'], 0),
        mc('I ___ to work by bus.', ['goes', 'go', 'going', 'gone'], 1),
        mc('Traduce: "Yo trabajo todos los días."', ['I works every day.', 'I work every day.', 'I working every day.', 'I am work every day.'], 1),
        mc('Con "I" (yo), el verbo va en...', ['forma base, sin cambios', 'con -s al final', 'con -ing', 'con -ed'], 0),
        mc('¿Cuál es correcta?', ['I plays football.', 'I play football.', 'I playing football.', 'I to play football.'], 1),
        mc('Lee: "I study English. I work every day and I play football on Sundays." — ¿De quién habla el texto?', [
          'De quien escribe: cuenta su propia rutina.',
          'De un amigo que no está presente.',
          'De un grupo de compañeros.',
          'De la persona a la que le escribe.'], 0),
        mc('Lee: "I work every day. I study English at night." — ¿Qué quiere decir con eso?', [
          'Que son cosas que hace normalmente, su rutina.',
          'Que son cosas que hizo el año pasado.',
          'Que son planes para el próximo mes.',
          'Que son cosas que nunca hace.'], 0),
        tap('Toca la palabra incorrecta:', ['I', 'work', 'hard', 'and', 'studies', 'English.'], 4, 'study'),
        tap('Toca la palabra incorrecta:', ['I', 'play', 'football', 'and', 'watches', 'TV.'], 4, 'watch'),
        rebuild('🎧 Ordena: "Yo estudio inglés."', 'I study English', ['I', 'study', 'English', 'studies', 'studied', 'steady']),
        writing('Escríbelo en inglés: "Yo trabajo todos los días."', ['I work every day.', 'I work everyday.'],
          { hint: 'Con "I" el verbo va tal cual, sin cambios.',
            reject: [['I works every day.', 'Ojo: la -s es sólo para he/she/it.']] }),
      ] },
    { id: 'modulo1-1-teoria-1b', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**1b.** **Hablar de ti (I) – Emociones y estados**

Cuando quieres expresar cómo te sientes o cómo estás, ya no usas un verbo de acción. Aquí usas **"am"**, que viene del verbo **to be** (ser / estar).

O sea: Yo + soy/estoy = I + am

  | Español                    | Inglés              |
  | -------------------------- | ------------------- |
  | Yo estoy feliz.            | I am happy.         |
  | Yo estoy triste.           | I am sad.           |
  | Yo tengo hambre.           | I am hungry.        |
  | Yo estoy cansado/a.        | I am tired.         |
  | Yo estoy enojado/a.        | I am angry.         |
  | Yo estoy bien.             | I am fine.          |
  | Yo soy alto/a.             | I am tall.          |

**¿Lo ves?** Con **I am** describes lo que sientes o lo que eres. No necesitas nada más: **I am + emoción/estado** y listo.`,
      miniQuiz: [
        mc('"Yo estoy feliz."', ['I happy.', 'I am happy.', 'I happy am.', 'I is happy.'], 1),
        mc('Para decir cómo te sientes, usas...', ['I + verbo de acción', 'I + am + emoción/estado', 'I + verbo + -ing', 'I + have + emoción'], 1),
        mc('Lee: "I am tired. I work ten hours and I study at night." — ¿Qué parte dice cómo SE SIENTE y cuál dice lo que HACE?', [
          '"I am tired" dice cómo se siente; "I work" y "I study" dicen lo que hace.',
          '"I am tired" dice lo que hace; las otras dos dicen cómo se siente.',
          'Las tres dicen cómo se siente.',
          'Las tres dicen lo que hace.'], 0),
        mc('"I ___ angry." (Yo estoy enojado)', ['am', 'is', 'are', 'be'], 0),
        mc('¿Cuál es correcta?', ['I hungry.', 'I have hungry.', 'I am hungry.', 'I is hungry.'], 2),
        mc('Lee: "I am hungry. I work all morning and I eat at 3 p.m." — ¿Por qué tiene hambre?', [
          'Porque trabaja toda la mañana y recién come a las 3.',
          'Porque come temprano en la mañana.',
          'Porque hoy no trabaja.',
          'Porque está cansado y duerme mucho.'], 0),
        tap('Toca la palabra incorrecta:', ['I', 'is', 'happy', 'and', 'work', 'hard.'], 1, 'am'),
        tap('Toca la palabra incorrecta:', ['I', 'am', 'tired', 'and', 'studies', 'a', 'lot.'], 4, 'study'),
        rebuild('Escucha y reconstruye:', 'I am tired', ['I', 'am', 'tired', 'tied', 'hired', 'fired']),
        rebuild('🎧 Ordena: "Yo estoy bien."', 'I am fine', ['I', 'am', 'fine', 'five', 'find', 'wine']),
        writing('Escríbelo en inglés: "Yo estoy cansado."', ['I am tired.', "I'm tired."],
          { hint: 'Para un estado no uses verbo de acción.',
            reject: [['I tired.', 'Falta el "am": I am tired.'], ['I have tired.', 'No es "have": los estados van con am.']] }),
      ] },
    { id: 'modulo1-1-teoria-2', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**2.** **Hablar de tu grupo (we)**

Usa **we** (nosotros) con el mismo verbo sin cambios:

  | Español                    | Inglés           |
  | -------------------------- | ---------------- |
  | Nosotros vivimos en Lima.  | We live in Lima. |
  | Nosotros comemos temprano. | We eat early.    |

Hablar de **nosotros** (**we**) es igual de sencillo que con "I". Tú y tu grupo usan el mismo formato: *We live*, *We eat*, *We go*... el verbo **tampoco cambia**. Solo dices lo que hacen todos ustedes juntos.`,
      miniQuiz: [
        mc('"Nosotros vivimos en Lima."', ['We lives in Lima.', 'We live in Lima.', 'We living in Lima.', 'We to live in Lima.'], 1),
        mc('We ___ early.', ['eats', 'eat', 'eating', 'to eat'], 1),
        mc('Con "we" (nosotros), el verbo...', ['lleva -s', 'no cambia (forma base)', 'lleva -ing', 'lleva -ed'], 1),
        mc('¿Cuál es correcta?', ['We studies English.', 'We study English.', 'We studying English.', 'We to study English.'], 1),
        mc('Lee: "My brother and I live in Lima. We eat early and we work downtown." — ¿A quiénes incluye "we"?', [
          'A quien escribe y a su hermano.',
          'Solo al hermano.',
          'Solo a quien escribe.',
          'A un grupo ajeno, del que solo está hablando.'], 0),
        mc('Lee: "I work in the morning. We study English at night." — ¿Qué diferencia hay entre las dos oraciones?', [
          'La primera habla solo de quien escribe; la segunda, de él y su grupo.',
          'La primera habla del grupo; la segunda, de una sola persona.',
          'Las dos hablan exactamente de las mismas personas.',
          'Las dos hablan de otras personas ausentes.'], 0),
        mc('"Nosotros comemos temprano."', ['We eats early.', 'We are eat early.', 'We eat early.', 'We eating early.'], 2),
        tap('Toca la palabra incorrecta:', ['We', 'live', 'in', 'Lima', 'and', 'works', 'downtown.'], 5, 'work'),
        tap('Toca la palabra incorrecta:', ['We', 'study', 'English', 'and', 'plays', 'football.'], 4, 'play'),
        rebuild('🎧 Ordena: "Nosotros trabajamos juntos."', 'We work together', ['We', 'work', 'together', 'walk', 'word', 'works', 'he']),
        writing('Escríbelo en inglés: "Nosotros vivimos en Lima."', ['We live in Lima.'],
          { reject: [['We lives in Lima.', 'Con "we" el verbo no cambia: live.']] }),
      ] },
    { id: 'modulo1-1-teoria-3', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**3.** **Hablar directamente con alguien (you)**

Usa **you** (tú/ustedes) y, nuevamente, el verbo sin cambio:

  | Español                | Inglés              |
  | ---------------------- | ------------------- |
  | Tú estudias medicina.  | You study medicine. |
  | Ustedes trabajan aquí. | You work here.      |

En inglés **"you"** sirve tanto para **tú** *como* **ustedes** 😮. Es decir, **you** puede ser una persona o muchas. El verbo se mantiene igual: *You study*, *you work*. (Si quieres aclarar que son varios, puedes decir **"you all"**, pero gramaticalmente sigue siendo el mismo *you* con el verbo sin cambio).`,
      miniQuiz: [
        mc('"Tú estudias medicina."', ['You studies medicine.', 'You study medicine.', 'You studying medicine.', 'You to study medicine.'], 1),
        mc('You ___ here.', ['works', 'work', 'working', 'to work'], 1),
        mc('En inglés, "you" sirve para...', ['solo "tú"', 'solo "ustedes"', 'tanto "tú" como "ustedes"', 'solo para animales'], 2),
        mc('Con "you", el verbo...', ['no cambia', 'lleva -s', 'lleva -ing', 'lleva -ed'], 0),
        mc('¿Cuál es correcta?', ['You plays football.', 'You play football.', 'You playing football.', 'You to play football.'], 1),
        mc('Un aviso para TODO el equipo del hospital dice: "You work here on weekends. You start at 8." — ¿A quién se dirige?', [
          'A todos ellos: aquí "you" significa "ustedes".',
          'A una sola persona, porque "you" solo significa "tú".',
          'A quien escribió el aviso.',
          'A un grupo del que se habla, pero que no lee el aviso.'], 0),
        mc('Un profesor le dice a UN alumno: "You study medicine and you work here on Saturdays." — ¿Qué significa "you" aquí?', [
          '"Tú": una sola persona, el alumno.',
          '"Ustedes": todo el salón.',
          '"Nosotros": el profesor y el alumno.',
          '"Ellos": otros alumnos que no están.'], 0),
        tap('Toca la palabra incorrecta:', ['You', 'work', 'here', 'and', 'studies', 'medicine.'], 4, 'study'),
        tap('Toca la palabra incorrecta:', ['You', 'play', 'well', 'and', 'sings', 'nicely.'], 4, 'sing'),
        rebuild('🎧 Ordena: "Ustedes trabajan aquí."', 'You work here', ['You', 'work', 'here', 'walk', 'word', 'works', 'hair']),
      ] },
    { id: 'modulo1-1-teoria-4', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**4.** **Hablar de un grupo ajeno**

Usa **they** (Ell@s) y, nuevamente, el verbo sin cambio:

  | Español                | Inglés              |
  | ---------------------- | ------------------- |
  | Ellos cantan bonito.  | They sing nicely. |
  | Ellas juegan futbol. | They play football. |

Eso sí, como puedes haber notado en inglés no importa el género del grupo ajeno, siempre se usa **they**.`,
      miniQuiz: [
        mc('"Ellos cantan bonito."', ['They sings nicely.', 'They sing nicely.', 'They singing nicely.', 'They to sing nicely.'], 1),
        mc('They ___ football.', ['plays', 'play', 'playing', 'to play'], 1),
        mc('Para un grupo (ellos o ellas), en inglés usas...', ['he', 'she', 'they', 'it'], 2),
        mc('Con "they", el verbo...', ['lleva -s', 'no cambia (forma base)', 'lleva -ing', 'lleva -ed'], 1),
        mc('¿Cuál es correcta?', ['They sings nicely.', 'They are sing nicely.', 'They sing nicely.', 'They singing nicely.'], 2),
        mc('Lee: "My cousins live in Trujillo. They sing nicely and they play football." — ¿De quiénes habla el texto?', [
          'De un grupo ajeno a quien escribe: sus primos.',
          'Del grupo al que pertenece quien escribe.',
          'De la persona que está leyendo el texto.',
          'De una sola persona que no está presente.'], 0),
        mc('Lee: "Rosa and Carmen sing nicely. They play football on Sundays." — ¿Por qué se usa "they" y no otra palabra?', [
          'Porque "they" vale para cualquier grupo, sean hombres o mujeres.',
          'Porque son mujeres y "they" es solo femenino.',
          'Porque están presentes en la conversación.',
          'Porque son exactamente dos personas.'], 0),
        tap('Toca la palabra incorrecta:', ['They', 'sing', 'nicely', 'and', 'plays', 'football.'], 4, 'play'),
        tap('Toca la palabra incorrecta:', ['They', 'work', 'late', 'and', 'studies', 'at', 'night.'], 4, 'study'),
        rebuild('🎧 Ordena: "Ellas juegan fútbol."', 'They play football', ['They', 'play', 'football', 'pray', 'plays', 'place', 'day']),
        writing('Escríbelo en inglés: "Ellos cantan bonito."', ['They sing nicely.'],
          { reject: [['They sings nicely.', 'Con "they" el verbo va en forma base: sing.']] }),
      ] },
    { id: 'modulo1-1-teoria-5', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**5.** **Chismear sobre otros (he, she, it)**

Ahora sí empieza el **chisme** 😏. Cuando hablas **de alguien más** que **no está presente** o sea (él, ella, o de algo/animal = it), ya **no estás cara a cara**; estás hablando en **tercera persona** de **ese patita** ausente.

  > 💡 **Regla de oro del presente simple:** si hablas de *él*, *ella* o *eso* (tercera persona singular), hablas de ESE patita, entonces **el verbo cambia un poquito**: **se le agrega una *-S*** al final (o *-ES* en algunos casos especiales).

  * Si el verbo es regular y no termina en sonidos difíciles, agrégale **-S**: *He works*, *She sings*, *It rains*.
  * Si el verbo termina en **o, sh, ch, ss, x,** o **z** (que suenan medio difícil con "s"), agrégale **-ES**: *go → goes*, *watch → watches*, *kiss → kisses*.
  * Si termina en **-y** tras consonante, cambia *y* a **-ies** (ej: *study → studies*).

  | Español            | Inglés              |
  | ------------------ | ------------------- |
  | Él estudia inglés. | He studies English. |
  | Ella come pizza.   | She eats pizza.     |


Ahora, nos falta aclarar **"it"**. **It** significa "eso/esta/o" y se usa para cosas o animales. En inglés, en vez de decir "él/ella" para objetos o bichitos, decimos *"it"*.

  * **Objetos:** Si quiero decir "El teléfono es rojo", en inglés puedo decir **"It is red."** (Eso es rojo). *It* reemplaza a "el teléfono" una vez que ya sabemos de qué hablamos.

  * **Animales:** Por ejemplo, conocí a un perrito llamado Firulais 🐕. En español puedo decir "Él es un perro peruano" o simplemente "Es un perro peruano". En inglés, aunque Firulais es un machito lindo, igual usaría *it* si no quiero repetir su nombre: **"It is a Peruvian dog."**

  > 💡 **Ojito:** Puede ser confuso pero ¿Me creerías que esto es así para distinguir a los perritos 🐶 de aquellos hombres que son bien perros 👹? (¡Bromita! jeje Pero si quieres no es broma... es truco de memoria 😜): *los animales son tan especiales que tienen su propio pronombre*.`,
      miniQuiz: [
        mc('Con "he", "she" o "it" (tercera persona), al verbo le agregas...', ['nada, va igual', '-s o -es al final', '-ing al final', '-ed al final'], 1),
        mc('He ___ to work by bus.', ['go', 'goes', 'going', 'to go'], 1),
        mc('Lee: "In my house, my sister cooks and my brothers wash the dishes." — ¿Por qué "cooks" lleva -s y "wash" no?', [
          'Porque "my sister" es una sola persona y "my brothers" son varios.',
          'Porque cocinar es una tarea más importante que lavar.',
          'Porque "cooks" habla del pasado y "wash" del presente.',
          'Porque "wash" es irregular y nunca acepta -s.'], 0),
        mc('Lee: "My sister buys a new phone. It is red and it works very well." — Según el texto, ¿qué es rojo?', [
          'El teléfono: "it" se usa para cosas, no para personas.',
          'La hermana, porque es lo primero que se menciona.',
          'Los dos: la hermana y el teléfono.',
          'No se puede saber con este texto.'], 0),
        tap('Toca la palabra incorrecta:', ['She', 'works', 'hard', 'and', 'study', 'English.'], 4, 'studies'),
        tap('Toca la palabra incorrecta:', ['He', 'goes', 'home', 'early', 'and', 'watch', 'TV.'], 5, 'watches'),
        tap('Toca la palabra incorrecta:', ['We', 'study', 'English', 'and', 'he', 'play', 'football.'], 5, 'plays'),
        tap('Toca la palabra incorrecta:', ['The', 'dog', 'eats', 'fast', 'and', 'it', 'run', 'a', 'lot.'], 6, 'runs'),
        tap('Toca la palabra incorrecta:', ['They', 'sing', 'nicely', 'and', 'she', 'play', 'the', 'guitar.'], 5, 'plays'),
        tap('Toca la palabra incorrecta:', ['The', 'phone', 'are', 'red', 'and', 'it', 'works', 'well.'], 2, 'is'),
        tap('Toca la palabra incorrecta:', ['He', 'watch', 'movies', 'and', 'she', 'reads', 'books.'], 1, 'watches'),
        rebuild('🎧 Ordena: "Él estudia inglés."', 'He studies English', ['He', 'studies', 'English', 'study', 'studied', 'She', 'eats']),
        writing('Escríbelo en inglés: "Ella estudia inglés."', ['She studies English.'],
          { hint: 'Tercera persona: al verbo le toca -s o -es.',
            reject: [['She study English.', 'Con "she" el verbo lleva -es: studies.'], ['She studys English.', 'Termina en -y tras consonante: study → studies.']] }),
        writing('Escríbelo en inglés: "Él va al trabajo en bus."', ['He goes to work by bus.'],
          { hint: 'go es de los que llevan -ES.',
            reject: [['He go to work by bus.', 'Falta la -es: go → goes.']] }),
      ] },
    { id: 'modulo1-1-resumen', type: 'resumen', markdown: `## **🎯 Resumen práctico que debes recordar**

* ✅ Si hablas de **ti** (I/Yo), **de tu grupo** (We/Nosotros), **de otro grupo** (They/Ellos) o **cara a cara** con alguien (You/Tú/Ustedes): **el verbo NO cambia**. Usas la forma básica.

* ✅ Si hablas **de ESE patita ajeno** (He/Él, She/Ella, It/Eso): **el verbo SÍ CAMBIA**. Agregas **-S** (o **-ES**) al final del verbo.

¡Así de simple! 😉 En resumen: **Yo, tú, ustedes, nosotros, ellos = sin S**; **él, ella, eso = con S, porque hablas de ESE patita**.


*(Spoiler gramático: esa **-S** extra es tan importante que nuestra agente Do-ménica luego la usará para ayudar a formar preguntas. Pero no nos adelantemos... 🔎)*` },
    { id: 'modulo1-1-cierre', type: 'cierre', markdown: `#### **🌟 Cierre**

¡Y ya está! 🏆 Ahora sabes **cómo contar tu día a día en inglés** con el presente simple.

Recuerda la secuencia:

* Primero hablas de **ti** (I).
* Luego de **tu grupo** (we).
* Luego directamente con **otra persona** (you).
* Y cuando **chismeas de otro** que no está (he, she, it), ¡no olvides poner **-S** o **-ES** al verbo!

✅ **Misión cumplida:** ahora puedes contar tu rutina en inglés mientras vas en el bus. Practica contándosela a alguien (¡o a tu agente Do-ménica imaginaria 😜!) todos los días para afianzar.

**🏅 Insignia obtenida:** ✨ *Primeros Pasos en Inglés* (Rutina Diaria) 🎖️` },
  ],
  quizQuestions: [
    mc('She ___ English every night.', ['studies', 'study', 'studying', 'to study'], 0),
    mc('They ___ football on Sundays.', ['plays', 'play', 'playing', 'to play'], 1),
    mc('¿A qué sujetos les agregas -s al verbo?', ['I, we, you', 'he, she, it', 'you, they', 'I, they'], 1),
    mc('We ___ from home twice a week.', ['works', 'work', 'working', 'to work'], 1),
    mc('The dog ___ every morning.', ['eat', 'eating', 'to eat', 'eats'], 3),
    mc('It ___ a lot in winter.', ['rains', 'rain', 'raining', 'to rain'], 0),
    rebuild('Escucha y reconstruye:', 'I work from home twice a week', ['I', 'work', 'from', 'home', 'twice', 'a', 'week', 'walk', 'office', 'three', 'day']),
    rebuild('Escucha y reconstruye:', 'She studies English at night', ['English', 'at', 'She', 'studies', 'night', 'He', 'morning', 'works', 'day']),
    rebuild('Escucha y reconstruye:', 'They play football after school', ['after', 'play', 'They', 'football', 'school', 'before', 'games', 'We', 'work']),
    rebuild('Escucha y reconstruye:', 'He watches TV every day', ['TV', 'every', 'watches', 'He', 'day', 'plays', 'morning', 'She', 'night']),
    tap('Toca la palabra incorrecta:', ['She', 'works', 'on', 'weekends', 'and', 'study', 'at', 'home.'], 5, 'studies'),
    tap('Toca la palabra incorrecta:', ['They', 'study', 'English', 'and', 'he', 'play', 'football.'], 5, 'plays'),
    tap('Toca la palabra incorrecta:', ['He', 'goes', 'to', 'school', 'early', 'and', 'eat', 'fast.'], 6, 'eats'),
    tap('Toca la palabra incorrecta:', ['It', 'rains', 'a', 'lot', 'and', 'the', 'dog', 'run', 'outside.'], 7, 'runs'),
    tap('Toca la palabra incorrecta:', ['She', 'watch', 'us', 'and', 'we', 'play', 'football.'], 1, 'watches'),
  ],
};

const microlection2 = {
  id: 'modulo1-2',
  title: 'Microlección 2',
  durationMinutes: 12,
  audioCues: ['Escucha el contenido de la lección.', 'Fíjate en los puntos clave.', 'Ahora vienen tus ejercicios.'],
  contentBlocks: [
    { id: 'modulo2-titulo', type: 'titulo', title: '¿Quién soy yo?', subtitle: 'Verbo "to be" – ser/estar', markdown: '' },
    { id: 'modulo2-mision', type: 'mision', markdown: `Aprender a **presentarte a ti mismo y a otros en inglés** utilizando el verbo **"to be" (ser/estar)**. Incluiremos cómo decir tu nombre, edad, origen y ocupación, tanto en afirmaciones como en preguntas básicas con *to be*.` },
    { id: 'modulo2-intro', type: 'intro', markdown: `¡Hola de nuevo! Soy **{{mascot}}** {{mascotEmoji}}💬, listo para otra aventura. Hoy aprenderemos a hablar de **quién eres**: cómo decir tu nombre, tu edad, de dónde eres, cómo estás, etc. En español usamos dos verbos diferentes (**ser** y **estar**) para todo eso. ¿Sabías que en inglés se usa **un solo verbo** para ambos? 😲

Ese verbo mágico es **"to be"**, que significa *ser* y *estar* a la vez.` },
    { id: 'modulo2-sneakpeek', type: 'sneakPeek', markdown: `El verbo **"to be"** es donde conocemos a **Is-abella** 🕵🏽‍♀️.

Su nombre clave es **"Is"** porque le encaaaanta chismear sobre otros. ¿Y eso qué tiene que ver? Pues porque el verbo *is* se usa para hablar del patita ESE, o sea para decir *He is*, *She is*, *It is*.

Is-abella tiene diferentes **alias** dependiendo de quién está hablando:

* **I** (yo) 👉 **am** - *Am-abella*
* **you / we / they** (tú, ustedes / nosotros / ellos) 👉 **are** - *Are-abella*
* **he / she / it** (él, ella, eso) 👉 **is** - *Isa-abella*` },
    { id: 'modulo2-teoria-1', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**1.** **Hablar de ti mismo – I am…**

Para **presentarte**, en inglés dices **"I am ..."**:

| Español (ser/estar) | Inglés |
| --- | --- |
| Yo soy Juan. | I am Juan. |
| (Yo) estoy feliz hoy. | I am happy today. |
| (Yo) estoy en el bus. | I am on the bus. |

Usamos **I am** para varias cosas:

* Decir **quién eres**: *I am Juan.* (Yo soy Juan)
* Decir **cómo estás** (estado de ánimo): *I am happy* (Estoy feliz)
* Decir **dónde estás**: *I am on the bus* (Estoy en el bus)

👉 **Curiosidad sobre edad:** En inglés también usamos *to be* para la **edad**. Aunque en español decimos "Yo **tengo** 25 años", en inglés se dice **I am 25 years old**. ¡Ojo!`,
      miniQuiz: [
        mc('Para presentarte y decir tu nombre, ¿cuál es correcta?', ['I is Juan', 'I are Juan', 'I am Juan', 'I Juan'], 2),
        mc('Para hablar de cómo estás hoy, ¿cuál es correcta?', ['I am happy today', 'I are happy today', 'I is happy today', 'I happy today'], 0),
        mc('Con el sujeto "I" (yo), siempre usamos la forma...', ['are', 'is', 'am', 'be'], 2),
        mc('En inglés, la edad se dice con el verbo "to be". ¿Cómo se dice "Tengo 25 años"?', ['I have 25 years old', 'I am 25 years', 'I am 25 years old', 'I have 25 years'], 2),
        mc('Para decir dónde estás, ¿cuál es correcta?', ['I on the bus', 'I am on the bus', 'I is on the bus', 'I are on the bus'], 1),
        tap('Toca la palabra incorrecta:', ['I', 'are', 'Juan', 'and', 'I', 'am', 'happy.'], 1, 'am'),
        tap('Toca la palabra incorrecta:', ['I', 'am', 'on', 'the', 'bus', 'and', 'I', 'is', 'tired.'], 7, 'am'),
        rebuild('🎧 Reconstruye lo que escuchas:', 'I am 25 years old', ['I', 'am', '25', 'years', 'old', 'are', 'is', 'happy', 'today']),
      ] },
    { id: 'modulo2-teoria-2', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**2.** **Hablar de tu grupo – We are…**

Cuando hablas de **tu grupo** (tú + otros), usas **we are** (nosotros somos/estamos):

| Español | Inglés |
| --- | --- |
| Nosotros somos amigos. | We are friends. |
| Nosotros estamos en casa. | We are at home. |
| Nosotros somos peruanos. | We are Peruvian. |

**We are** significa *"nosotros somos/estamos"*. Sirve tanto para características permanentes (*friends* – amigos, *Peruvian* – peruanos) como para estados o ubicaciones temporales (*at home* – en casa).

En inglés no diferenciamos ser vs estar: todo es *are* aquí.`,
      miniQuiz: [
        mc('Para hablar de tu grupo (tú + otros), ¿cuál es correcta?', ['We am friends', 'We is friends', 'We are friends', 'We friends'], 2),
        mc('Para decir dónde están tú y tu grupo, ¿cuál es correcta?', ['We are at home', 'We is at home', 'We am at home', 'We at home'], 0),
        mc('Con el sujeto "we" (nosotros), usamos la forma...', ['am', 'are', 'is', 'be'], 1),
        mc('"Yo soy peruano." ¿Cuál es correcta?', ['I are Peruvian', 'I am Peruvian', 'We am Peruvian', 'I is Peruvian'], 1),
        mc('"Nosotros somos estudiantes." ¿Cuál es correcta?', ['We is students', 'We am students', 'We are students', 'We students'], 2),
        tap('Toca la palabra incorrecta:', ['I', 'am', 'a', 'student', 'and', 'we', 'is', 'friends.'], 6, 'are'),
        tap('Toca la palabra incorrecta:', ['We', 'am', 'at', 'home', 'and', 'I', 'am', 'tired.'], 1, 'are'),
        rebuild('🎧 Reconstruye lo que escuchas:', 'We are friends', ['We', 'are', 'friends', 'am', 'is', 'I', 'happy', 'students']),
      ] },
    { id: 'modulo2-teoria-3', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**3.** **Hablar con alguien directamente – You are…**

En inglés **you are** significa **"tú eres/estás"** **y también** **"ustedes son/están"**. Usa **you are** tanto si hablas con una persona como con varias.

| Español | Inglés |
| --- | --- |
| Tú eres muy amable. | You are very kind. |
| Ustedes están listos. | You are ready. |
| ¿Tú eres de Lima? | Are you from Lima? |

**You are** se aplica a todos los "you" – singular o plural. En inglés moderno, esto es universal. Así que no hay confusión: siempre es **you are**.`,
      miniQuiz: [
        mc('Para hablar directamente con alguien (tú/ustedes), ¿cuál es correcta?', ['You is very kind', 'You am very kind', 'You are very kind', 'You very kind'], 2),
        mc('En inglés, "you" sirve para "tú" y para "ustedes". ¿Qué forma del verbo usa?', ['am', 'is', 'are', 'be'], 2),
        mc('"¿Ustedes están listos?" ¿Cuál es correcta?', ['Are you ready?', 'Is you ready?', 'Am you ready?', 'You ready?'], 0),
        mc('"Nosotros somos amigos." ¿Cuál es correcta?', ['We is friends', 'We are friends', 'You are friends', 'We am friends'], 1),
        mc('"Tú eres de Lima." ¿Cuál es correcta?', ['You is from Lima', 'You am from Lima', 'You are from Lima', 'You from Lima'], 2),
        tap('Toca la palabra incorrecta:', ['You', 'are', 'very', 'kind', 'and', 'we', 'is', 'friends.'], 6, 'are'),
        tap('Toca la palabra incorrecta:', ['I', 'am', 'ready', 'and', 'you', 'is', 'ready', 'too.'], 5, 'are'),
        rebuild('🎧 Reconstruye lo que escuchas:', 'You are my friend', ['You', 'are', 'my', 'friend', 'is', 'am', 'we', 'teacher']),
      ] },
    { id: 'modulo2-teoria-4', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**4.** **Hablar de otros en plural – They are…**

Cuando hablas de **un grupo de gente** que no está presente, usas **they are** (ellos/ellas son/están):

| Español | Inglés |
| --- | --- |
| Ellos son maestros. | They are teachers. |
| Ellas están en el parque. | They are in the park. |
| Ellos son mexicanos. | They are Mexican. |

**They are** se usa para cualquier grupo. En inglés, **"they"** es universal – no importa el género. Un grupo mixto, solo mujeres, solo hombres – todo es **they are**.`,
      miniQuiz: [
        mc('Para hablar de un grupo que no está presente, ¿cuál es correcta?', ['They is teachers', 'They am teachers', 'They are teachers', 'They teachers'], 2),
        mc('Con el sujeto "they" (ellos/ellas), usamos la forma...', ['is', 'am', 'are', 'be'], 2),
        mc('"Ellas están en el parque." ¿Cuál es correcta?', ['They are in the park', 'They is in the park', 'They am in the park', 'They in the park'], 0),
        mc('"Ustedes son amables." ¿Cuál es correcta?', ['You is kind', 'You are kind', 'They are kind', 'You am kind'], 1),
        mc('"Ellos son mexicanos." ¿Cuál es correcta?', ['They is Mexican', 'They am Mexican', 'They are Mexican', 'They Mexican'], 2),
        tap('Toca la palabra incorrecta:', ['We', 'are', 'friends', 'and', 'they', 'is', 'teachers.'], 5, 'are'),
        tap('Toca la palabra incorrecta:', ['They', 'am', 'in', 'the', 'park', 'and', 'I', 'am', 'happy.'], 1, 'are'),
        rebuild('🎧 Reconstruye lo que escuchas:', 'They are my friends', ['They', 'are', 'my', 'friends', 'is', 'am', 'we', 'teachers']),
      ] },
    { id: 'modulo2-teoria-5', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**5.** **Hablar de otro en singular – He/She is…; It is…**

Para hablar de **una sola persona o cosa** (no presente), usas **he/she/it is**:

| Español | Inglés |
| --- | --- |
| Él es mi hermano. | He is my brother. |
| Ella es doctora. | She is a doctor. |
| Eso es importante. | It is important. |

**He is** – para un hombre o niño.
**She is** – para una mujer o niña.
**It is** – para cosas, animales (cuando no conocemos el género), objetos, conceptos.

La regla de oro: En **tercera persona singular** (he, she, it), SIEMPRE usamos **IS**, no *are* ni *am*.`,
      miniQuiz: [
        mc('Para hablar de UNA sola persona que no está presente (él/ella), ¿cuál es correcta?', ['He are my brother', 'He am my brother', 'He is my brother', 'He my brother'], 2),
        mc('Con "he", "she" o "it" (tercera persona singular), SIEMPRE usamos...', ['am', 'are', 'is', 'be'], 2),
        mc('"Ella es doctora." ¿Cuál es correcta?', ['She am a doctor', 'She are a doctor', 'She is a doctor', 'She a doctor'], 2),
        mc('"Eso es importante." ¿Cuál es correcta?', ['It is important', 'It are important', 'It am important', 'It important'], 0),
        mc('"Ellos son maestros, pero ella es doctora." ¿Cuál completa bien?', ['They are teachers, but she are a doctor', 'They is teachers, but she is a doctor', 'They are teachers, but she is a doctor', 'They are teachers, but she am a doctor'], 2),
        tap('Toca la palabra incorrecta:', ['She', 'is', 'a', 'doctor', 'and', 'they', 'is', 'happy.'], 6, 'are'),
        tap('Toca la palabra incorrecta:', ['I', 'am', 'tired', 'but', 'he', 'are', 'fine.'], 5, 'is'),
        rebuild('🎧 Reconstruye lo que escuchas:', 'She is my friend', ['She', 'is', 'my', 'friend', 'He', 'are', 'am', 'teacher']),
      ] },
    { id: 'modulo2-resumen', type: 'resumen', markdown: `## **🎯 Resumen: Is-abella y sus alias**

| Sujeto | Verbo | Ejemplo |
| --- | --- | --- |
| I | am | I am Juan |
| You | are | You are happy |
| We | are | We are friends |
| They | are | They are teachers |
| He | is | He is my brother |
| She | is | She is a doctor |
| It | is | It is cold |

**Recuerda:**
* **I am** (yo soy/estoy)
* **You/We/They are** (tú, nosotros, ellos son/están)
* **He/She/It is** (él, ella, eso es/está)

**No hay excepciones.** Es la regla de oro del verbo **to be**.` },
    { id: 'modulo2-cierre', type: 'cierre', markdown: `#### **🌟 Cierre**

¡Bravazo! 🎉 Ahora dominas **Is-abella y todas sus identidades secretas**: *am, are, is*. Sabes presentarte, describir a otros, hablar de tu grupo y preguntar a otros quiénes son.

> 💡 **Recuerda:** El verbo **to be** (*am, are, is*) es tu **comodín universal** en inglés. Úsalo para:
> * Presentarte: *I am Juan*
> * Hablar de estado: *I am happy*
> * Hablar de ubicación: *I am on the bus*
> * Hablar de nacionalidad: *I am Peruvian*
> * Hablar de edad: *I am 25 years old*

**¡Misión cumplida!** Ya no necesitas pensar en ser vs estar – en inglés es todo **to be**.

**🏅 Insignia obtenida:** *Conocedor de Is-abella* (Maestr@ del verbo **to be**) 🕵️‍♀️✨` },
  ],
  quizQuestions: [
    mc('"Tú eres de Lima." ¿Cuál es correcta?', ['You am from Lima', 'You is from Lima', 'You are from Lima', 'You from Lima'], 2),
    mc('Con el sujeto "I" (yo), siempre usamos la forma...', ['are', 'am', 'is', 'be'], 1),
    mc('Con "he", "she" o "it", siempre usamos la forma...', ['am', 'are', 'is', 'be'], 2),
    mc('"Tengo 25 años" en inglés se dice...', ['I have 25 years old', 'I am 25 years old', 'I am 25 years', 'I have 25 years'], 1),
    mc('"Nosotros somos amigos." ¿Cuál es correcta?', ['We is friends', 'We am friends', 'We are friends', 'We friends'], 2),
    mc('"Ella es doctora." ¿Cuál es correcta?', ['She is a doctor', 'She are a doctor', 'She am a doctor', 'She a doctor'], 0),
    tap('Toca la palabra incorrecta:', ['I', 'are', 'happy', 'and', 'you', 'are', 'kind.'], 1, 'am'),
    tap('Toca la palabra incorrecta:', ['We', 'are', 'friends', 'and', 'they', 'is', 'students.'], 5, 'are'),
    tap('Toca la palabra incorrecta:', ['He', 'are', 'my', 'brother', 'and', 'she', 'is', 'kind.'], 1, 'is'),
    tap('Toca la palabra incorrecta:', ['You', 'is', 'ready', 'and', 'we', 'are', 'ready', 'too.'], 1, 'are'),
    tap('Toca la palabra incorrecta:', ['She', 'is', 'a', 'doctor', 'but', 'it', 'are', 'cold.'], 6, 'is'),
    rebuild('🎧 Reconstruye lo que escuchas:', 'He is my friend', ['He', 'is', 'my', 'friend', 'She', 'are', 'am', 'teacher']),
    rebuild('🎧 Reconstruye lo que escuchas:', 'We are from Peru', ['We', 'are', 'from', 'Peru', 'They', 'is', 'am', 'Mexico']),
    rebuild('🎧 Reconstruye lo que escuchas:', 'I am 25 years old', ['I', 'am', '25', 'years', 'old', 'are', 'is', 'You', 'four']),
    rebuild('🎧 Reconstruye lo que escuchas:', 'They are very happy', ['They', 'are', 'very', 'happy', 'We', 'is', 'am', 'sad']),
  ],
};

const microlection3 = {
  id: 'modulo1-3',
  title: 'Microlección 3',
  durationMinutes: 12,
  audioCues: ['Escucha el contenido de la lección.', 'Fíjate en los puntos clave.', 'Ahora vienen tus ejercicios.'],
  contentBlocks: [
    { id: 'modulo3-titulo', type: 'titulo', title: 'El arte del camuflaje 🕵️‍♀️', subtitle: 'Contracciones con to be', markdown: '' },
    { id: 'modulo3-mision', type: 'mision', markdown: `Aprender a **entender y usar las formas abreviadas del verbo mágico *to be*** con la ayuda de nuestra agente secreta favorita: **Is-abella**. Vas a descubrir cómo *"is"* (y sus amigas *"are"* y *"am"*) se **camuflan** en la conversación real.` },
    { id: 'modulo3-intro', type: 'intro', markdown: `¡Hey, {{audience}}! Soy **{{mascot}}** {{mascotEmoji}}, y hoy te presento el *superpoder* favorito de Is-abella:

🕵️‍♀️ **La Contracción Ninja**.

Verás, **Is-abella** es una agente encubierta. Le encanta meterse en las frases sin que la noten. Para lograrlo, se **pega al sujeto** y crea una forma más rápida y fluida de hablar. ¡Así suena el inglés real!` },
    { id: 'modulo3-sneakpeek', type: 'sneakPeek', markdown: `💬 Por ejemplo:

* En lugar de decir *"She is happy"*, Is-abella se pega y dice: **"She's happy."**
* En vez de *"It is a good idea"*, suena mejor: **"It's a good idea."**

¿Suena más natural, no? Pues sí, porque así habla la tribu. Hoy verás cómo Is-abella se transforma según el sujeto que la acompaña.` },
    { id: 'modulo3-teoria-1', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**1.** **Is-abella se pega: She's, He's, It's**

Mira cómo **"is"** se contrae cuando se pega al sujeto:

| Forma larga | Contracción | Ejemplo |
| --- | --- | --- |
| She is | She's | She's my friend. |
| He is | He's | He's tired. |
| It is | It's | It's cold today. |

**¿Notas cómo "is" se esconde dentro de *she's, he's, it's*?** Ese es el **camuflaje perfecto de Is-abella**. Ella no desaparece, solo se pega al sujeto y se vuelve más ligera. ¡Por eso nadie la pilla en la calle!

En contextos reales, **siempre usarás la forma contraída**. Por ejemplo:
* *"She's happy"* (no *"She is happy"*)
* *"It's cold"* (no *"It is cold"*)`,
      miniQuiz: [
        mc('¿Cómo se contrae "She is" en una conversación natural?', ["She're", "She's", "She'm", "Shes'"], 1),
        mc("\"It's cold today\" significa lo mismo que...", ['It are cold today', 'It am cold today', 'It is cold today', 'It be cold today'], 2),
        mc('¿Cuál es la contracción correcta de "He is"?', ["He's", "He're", "He'm", "His'"], 0),
        mc('¿Cuál de estas contracciones está MAL escrita?', ["She's", "It's", "He's", "It're"], 3),
        mc('En el habla cotidiana, ¿qué suena más natural?', ['He is tired.', "He's tired.", 'He are tired.', 'He am tired.'], 1),
        tap('Toca la palabra incorrecta:', ["It's", 'cold', 'and', "she're", 'sick.'], 3, "she's"),
        tap('Toca la palabra incorrecta:', ["He's", 'my', 'friend', 'and', "it're", 'easy.'], 4, "it's"),
        rebuild('Escucha y reconstruye:', "She's very happy", ["She's", 'very', 'happy', "He's", "She're", 'sad']),
        rebuild('Escucha y reconstruye:', "It's cold today", ["It's", 'cold', 'today', "He's", "It're", 'hot']),
      ] },
    { id: 'modulo3-teoria-2', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**2.** **Las amigas de Is-abella: I'm, You're, We're, They're**

Ahora vamos con sus aliadas:

| Forma larga | Contracción | Pronunciación |
| --- | --- | --- |
| I am | I'm | aím |
| You are | You're | yur |
| We are | We're | wir |
| They are | They're | der |

Estas contracciones son incluso **más pequeñas** que la de Is-abella. Aquí, la aliada se disfraza tanto que casi no la ves:

* **"I'm happy"** (no *"I am happy"*)
* **"You're amazing"** (no *"You are amazing"*)
* **"We're late"** (no *"We are late"*)
* **"They're at school"** (no *"They are at school"*)`,
      miniQuiz: [
        mc('¿Cómo se contrae "I am" en el habla natural?', ["I're", "Im'", "I'm", "I's"], 2),
        mc("\"You're amazing\" significa lo mismo que...", ['You am amazing', 'You are amazing', 'You is amazing', 'You be amazing'], 1),
        mc('¿Cuál es la contracción correcta de "They are"?', ["They's", "They'm", "They're", "Their'"], 2),
        mc('¿Cuál de estas contracciones está MAL escrita?', ["We're", "You're", "I'm", "They's"], 3),
        mc('¿Cómo se contrae "We are" correctamente?', ["We're", "We's", "We'm", "Wer'e"], 0),
        tap('Toca la palabra incorrecta:', ["I'm", 'happy', 'and', "you's", 'amazing.'], 3, "you're"),
        tap('Toca la palabra incorrecta:', ["We're", 'late', 'but', "they'm", 'early.'], 3, "they're"),
        rebuild('Escucha y reconstruye:', "I'm from Lima", ["I'm", 'from', 'Lima', "You're", "I're", 'Cusco']),
        rebuild('Escucha y reconstruye:', "They're at school", ["They're", 'at', 'school', "We're", "They's", 'home']),
      ] },
    { id: 'modulo3-teoria-3', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**3.** **Las negaciones: isn't y aren't**

Y cuando están en modo negativo, Is-abella y sus amigas también se contraen:

| Forma larga | Contracción | Ejemplo |
| --- | --- | --- |
| is not | isn't | She isn't ready. |
| are not | aren't | They aren't here. |
| am not | am not | I am not ready. (No se contrae) |

**Nota:** Con "I am not" NO usamos *"I'm not"*, sino que decimos *"I'm not"* (el "not" sí se pega). Es decir:
* ✅ *I'm not happy* (correcto)
* ❌ *I ain't happy* (coloquial, no es correcto en inglés estándar)

Ejemplos:
* *"She isn't ready"* (Ella no está lista)
* *"They aren't here"* (Ellos no están aquí)
* *"I'm not happy"* (No estoy feliz)`,
      miniQuiz: [
        mc("\"isn't\" es la contracción de...", ['am not', 'is not', 'are not', "isn't not"], 1),
        mc("\"They aren't here\" significa...", ['They is not here', 'They am not here', 'They are not here', 'They not are here'], 2),
        mc('"I am not" se contrae como...', ["I amn't", "I'm not", "I isn't", "I aren't"], 1),
        mc('¿Cuál es la negación correcta de "She is ready"?', ["She aren't ready", "She amn't ready", "She isn't ready", 'She not is ready'], 2),
        mc('¿Cuál de estas negaciones está MAL?', ["isn't", "aren't", "amn't", "I'm not"], 2),
        tap('Toca la palabra incorrecta:', ['She', "isn't", 'ready', 'and', 'they', "isn't", 'here.'], 5, "aren't"),
        tap('Toca la palabra incorrecta:', ["I'm", 'happy', 'but', 'she', "amn't", 'tired.'], 4, "isn't"),
        rebuild('Escucha y reconstruye:', "She isn't ready", ['She', "isn't", 'ready', 'They', "aren't", "amn't"]),
        rebuild('Escucha y reconstruye:', "I'm not happy", ["I'm", 'not', 'happy', "You're", "amn't", 'sad']),
      ] },
    { id: 'modulo3-teoria-4', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**4.** **¿Cuándo usar contracciones?**

Las contracciones son **la forma natural** de hablar en inglés en contextos cotidianos:

✅ **Usa contracciones en:**
* Conversaciones informales
* TikTok, redes sociales
* Mensajes de texto
* Películas y series
* Cualquier contexto casual o amistoso

❌ **Evita contracciones en:**
* Documentos formales (cartas oficiales, solicitudes)
* Escritura académica formal
* Presentaciones profesionales muy serias
* Contextos muy formales

**Pero recuerda:** En el día a día, **casi nadie dice "It is"**; todos dicen **"It's"**. Las contracciones son la norma, no la excepción.`,
      miniQuiz: [
        mc('En una conversación informal por chat, ¿qué es más natural?', ['She is my friend.', "She's my friend.", 'She be my friend.', 'She am my friend.'], 1),
        mc('En una carta oficial muy formal, ¿qué forma usarías?', ["They're not available.", "They aren't available.", 'They are not available.', "They ain't available."], 2),
        mc('¿Dónde se usan MÁS las contracciones?', ['En un ensayo académico', 'En un video de TikTok', 'En una solicitud formal de empleo', 'En un documento legal'], 1),
        mc('En el día a día hablado, ¿qué pasa con "It is"?', ["Casi siempre se dice \"It's\"", 'Casi siempre se dice "It is"', 'Nunca se contrae', 'Se dice "It be"'], 0),
        mc('Un amigo te escribe por mensaje de texto. ¿Qué esperarías leer?', ['We are running late.', "We're running late.", 'We am running late.', 'We is running late.'], 1),
        mc('¿Cuál afirmación sobre las contracciones es CORRECTA?', ['Son obligatorias en contextos formales', 'Son la norma en el habla cotidiana', 'Solo se usan al escribir', 'Son incorrectas en inglés real'], 1),
        tap('Toca la palabra incorrecta:', ["We're", 'late', 'and', "they's", 'tired.'], 3, "they're"),
        rebuild('Escucha y reconstruye (habla natural):', "It's nice to meet you", ["It's", 'nice', 'to', 'meet', 'you', 'It', 'is', 'her']),
      ] },
    { id: 'modulo3-resumen', type: 'resumen', markdown: `## **🎯 Resumen: Los disfraces de Is-abella**

| Original | Contracción | Uso |
| --- | --- | --- |
| She is | She's | She's happy |
| He is | He's | He's tired |
| It is | It's | It's cold |
| I am | I'm | I'm ready |
| You are | You're | You're amazing |
| We are | We're | We're late |
| They are | They're | They're here |
| is not | isn't | She isn't ready |
| are not | aren't | They aren't here |
| am not | I'm not | I'm not happy |

**Lo más importante:**
* **Contrae en conversaciones casuales** (casi siempre)
* **No contraigas en escritura formal** (cartas, ensayos)
* **Las contracciones son la forma NATURAL de hablar inglés**` },
    { id: 'modulo3-cierre', type: 'cierre', markdown: `#### **🌟 Cierre**

¡Bravazo, agente! 🎉 Ahora sabes cómo Is-abella se esconde entre las palabras para sonar más natural. Ya no solo la reconoces en su forma original (*is*) o sus otras formas (*are* y *am*), sino también cuando se pega con estilo a **She's, He's, It's...** , **I'm** y **They're, We're, You're**.

Recuerda:

* En contextos cotidianos y orales, las **contracciones son lo normal**.
* En situaciones muy formales o documentos, puedes usar las formas completas (*She is, They are...*), pero el día a día es más relajado, más chill.

Así que la próxima vez que alguien te diga en inglés:

**"It's nice to meet you!"**

… ¡tú ya sabes quién está ahí adentro! 👀 Es **Is-abella**, siempre lista para ayudarte a sonar como parte de la tribu.

✅ **Misión cumplida:** Ahora puedes hablar con soltura y sonar natural. Tu inglés ya no suena como texto de examen… ¡sino como conversación de calle, café o fiesta! 🎉

**🏅 Insignia obtenida:** *Hablante Naturalito* (Agente encubiert@ de las Contracciones) 🕵️‍♀️🗣️✨` },
  ],
  quizQuestions: [
    mc("\"She's my best friend\" significa...", ['She has my best friend', 'She is my best friend', 'She are my best friend', 'She am my best friend'], 1),
    mc('¿Cómo se contrae "They are" correctamente?', ["They's", "They'm", "They're", "Theyr'e"], 2),
    mc('"I am not" se contrae como...', ["I amn't", "I aren't", "I'm not", "I isn't"], 2),
    mc('¿Cuál de estas contracciones está MAL escrita?', ["He's", "We're", "I'm", "She're"], 3),
    mc('En un documento académico formal, ¿qué forma usarías?', ["It's important.", 'It is important.', 'Its important.', "It're important."], 1),
    mc('La negación correcta de "They are here" es...', ["They isn't here", "They aren't here", "They amn't here", 'They not here'], 1),
    tap('Toca la palabra incorrecta:', ["He's", 'my', 'friend', 'and', "they's", 'here.'], 4, "they're"),
    tap('Toca la palabra incorrecta:', ["I'm", 'ready', 'but', 'she', "amn't", 'ready.'], 4, "isn't"),
    tap('Toca la palabra incorrecta:', ["You're", 'early', 'and', "we're", 'late', 'but', "they's", 'here.'], 6, "they're"),
    tap('Toca la palabra incorrecta:', ['She', "isn't", 'tired', 'and', 'he', "aren't", 'tired.'], 5, "isn't"),
    tap('Toca la palabra incorrecta:', ["It's", 'cold', 'and', "you're", 'sick', 'but', "I'm", 'ok.', "She're", 'fine.'], 8, "She's"),
    rebuild('Escucha y reconstruye:', "She's from Colombia", ["She's", 'from', 'Colombia', "He's", "She're", 'Peru']),
    rebuild('Escucha y reconstruye:', "We're late and they aren't here", ["We're", 'late', 'and', 'they', "aren't", 'here', "amn't", "she's", 'ready']),
    rebuild('Escucha y reconstruye:', "I'm not ready yet", ["I'm", 'not', 'ready', 'yet', "You're", "amn't", 'soon']),
    rebuild('Escucha y reconstruye:', "They're at the bus station", ["They're", 'at', 'the', 'bus', 'station', "We're", "They's", 'school']),
  ],
};

const microlection4 = {
  id: 'modulo1-4',
  title: 'Microlección 4',
  durationMinutes: 12,
  audioCues: ['Escucha el contenido de la lección.', 'Fíjate en los puntos clave.', 'Ahora vienen tus ejercicios.'],
  contentBlocks: [
    { id: 'modulo4-titulo', type: 'titulo', title: 'Esto es un gato 🐈', subtitle: 'Demostrativos "this/that" + Artículos', markdown: '' },
    { id: 'modulo4-mision', type: 'mision', markdown: `Aprender a **identificar y presentar objetos en inglés**, usando **"this is"** para decir *"esto es…"*, **"that is"** para *"eso (que está allá) es…"*. Además, aprender a usar **"it is"** para describir algo ya mencionado sin repetir su nombre, y aplicar correctamente los **artículos "a/an"** (un/una) y **"the"** (el/la/los/las) en estas frases.` },
    { id: 'modulo4-intro', type: 'intro', markdown: `Hello, **it's {{mascot}} de nuevo** 👋. ¿List@ para señalar cosas y decir sus nombres en inglés? En español solemos decir *"esto es un X"* o simplemente *"es un X"*. En inglés usamos **"this is"** para presentar algo cercano por primera vez, y luego usamos **"it is"** para seguir hablando de eso sin repetir su nombre. Si algo está más lejos, usamos **"that is"** (*"ese/esa es…"*).

Además, en inglés **siempre** usamos **artículos** (*a, an, the*) para acompañar a los sustantivos en singular. ¡No podemos dejar una palabra solita sin artículo si va en singular!` },
    { id: 'modulo4-sneakpeek', type: 'sneakPeek', markdown: `**Los artículos son como la ropa de las palabras**: si los sustantivos no se *"visten"* con *a/an/the*, la frase se escucha incompleta, como salir a la calle **calat@** (desnudo) 🩲. Hoy veremos cómo armar frases tipo: *"Esto es un gato. Es azul. El gato es grande."* en inglés correctamente.` },
    { id: 'modulo4-teoria-1', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**🛠️ Presentando e identificando objetos**

Imagina que tienes algo frente a ti y quieres decir qué es. Sigue estos pasos:

**1.** Di **"Esto es ___"** con **This is ___** – para presentar algo cercano por primera vez.

**2.** Después, usa **It is ___** – para dar más detalles sobre eso sin repetir su nombre.

**3.** Usa **a/an** cuando hables de *"un/una [cosa]"* en general por primera vez. Usa **the** cuando ya es algo específico o ya mencionado.`,
      miniQuiz: [
        mc('Tienes un libro en tu mano y lo presentas por primera vez. ¿Cómo empiezas?', ['It is a book', 'That is a book', 'This is a book', 'Is a book'], 2),
        mc('Ya dijiste "This is a phone". Ahora quieres añadir un detalle sin repetir "phone". ¿Qué usas?', ['This is new', 'It is new', 'That is new', 'The is new'], 1),
        mc('¿Para qué sirve "it is" después de presentar algo?', ['Para presentar algo por primera vez', 'Para dar más detalles sin repetir el nombre', 'Para señalar algo lejano', 'Para hacer una pregunta'], 1),
        mc('¿Cuál es el orden correcto al presentar y luego describir?', ['It is a dog. This is small.', 'This is a dog. It is small.', 'This is a dog. This is small.', 'It is a dog. It is a small.'], 1),
        mc('Para presentar algo que tienes cerca por primera vez usas...', ['It is', 'That is', 'This is', 'The is'], 2),
        tap('Toca la palabra incorrecta:', ['This', 'is', 'a', 'phone', 'and', 'it', 'are', 'new.'], 6, 'is'),
        tap('Toca la palabra incorrecta:', ['This', 'is', 'a', 'book.', 'That', 'is', 'blue.'], 4, 'It'),
        rebuild('🎧 Presenta algo cercano y descríbelo:', 'This is a cat. It is small.', ['This', 'is', 'a', 'cat.', 'It', 'is', 'small.', 'That', 'These', 'are', 'the']),
      ] },
    { id: 'modulo4-teoria-2', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**📌 ¿Cuándo usar "a" y cuándo "an"?**

Ambos significan *"un/una"*, pero se eligen según el **sonido** con el que empieza la siguiente palabra:

* **a** → antes de sonido de **consonante**: *a cat, a table, a bus.*
* **an** → antes de sonido de **vocal**: *an apple, an egg, an old model.*

⚠️ **Ojo:** lo que importa es el **sonido**, no la letra escrita. Por ejemplo, *"university"* se escribe con U pero suena */yu/* (consonante), así que decimos **a university**. Y *"hour"* se escribe con H pero la H es muda y suena */our/* (vocal), así que decimos **an hour**.`,
      miniQuiz: [
        mc('¿Qué artículo usas antes de "apple"?', ['a', 'an', 'the', 'ninguno'], 1),
        mc('Para elegir entre "a" o "an" te fijas en...', ['la primera letra escrita', 'el sonido inicial de la palabra', 'la longitud de la palabra', 'el género de la palabra'], 1),
        mc('"University" se escribe con U pero suena /yu/ (consonante). ¿Cuál es correcto?', ['an university', 'a university', 'the university', 'university'], 1),
        mc('"Hour" tiene H muda y suena con vocal. ¿Cuál es correcto?', ['a hour', 'an hour', 'the hour', 'hour'], 1),
        mc('¿Cuál de estas combinaciones es correcta?', ['a egg', 'an cat', 'an old bus', 'a apple'], 2),
        tap('Toca la palabra incorrecta:', ['an', 'old', 'bus', 'and', 'a', 'egg'], 4, 'an'),
        tap('Toca la palabra incorrecta:', ['a', 'table', 'and', 'a', 'apple'], 3, 'an'),
        rebuild('🎧 Arma el artículo correcto:', 'an apple and a cat', ['an', 'apple', 'and', 'a', 'cat', 'the', 'egg', 'an', 'bus']),
      ] },
    { id: 'modulo4-teoria-3', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**🎯 Poniéndolo todo junto: this/that/it + artículos**

Ahora combinamos todo en frases reales. Fíjate cómo cambia **this/that**, aparece **it** y se eligen los artículos.

**Algo cercano** — en español *"Esto es un gato. Es azul. El gato es grande."*:

* *This is a cat.* (Esto es un gato). – Lo introducimos por primera vez: **this is** + **a** (porque *cat* empieza con sonido de consonante).
* *It is blue.* (Es azul). – Ya sabemos que es el gato, así que usamos **it** en lugar de repetir *cat*. No lleva artículo porque *blue* es un adjetivo, no un sustantivo.
* *The cat is big.* (El gato es grande). – Ahora el gato ya es conocido, por eso **the cat**.

**Algo más lejos (con "that")**:

* *That is a bus.* (Ese/aquel es un bus). – Está a distancia, usamos **that is**.
* *It is yellow.* (Es amarillo). – Seguimos hablando de eso con **it**.
* *The bus is an old model.* (El bus es un modelo antiguo). – Usamos **an** porque *old* empieza con sonido de vocal.

**🎯 Resumen rápido:**

* **This is…** = Esto/esta es… (cerca de ti).
* **That is…** = Eso/esa es… (un poco más lejos).
* **It is…** = Es… (para referirte a lo ya mencionado).
* **a** = un/una (antes de sonido de consonante, primera mención).
* **an** = un/una (antes de sonido de vocal, primera mención).
* **the** = el / la / los / las (cuando ya es algo específico o conocido).

*(Nuestra agente Is-abella se pasea aquí como **is** en *this is / that is / it is*, siempre al servicio de identificar cosas 😉.)*`,
      miniQuiz: [
        mc('"This is a cat" presenta el gato. ¿Cómo das más detalles sin repetir "cat"?', ['The cat is', 'This is more', 'It is', 'That is'], 2),
        mc('¿Cuándo usas "the" en lugar de "a"?', ['En la primera mención', 'Cuando ya es algo mencionado o conocido', 'Antes de sonido de vocal', 'Nunca con sustantivos'], 1),
        mc('"That is a bus". ¿Dónde está el bus?', ['Cerca de ti', 'Lejos de ti', 'No se sabe', 'En tu mano'], 1),
        mc('¿Por qué decimos "an old model" y no "a old model"?', ['"old" empieza con consonante', '"old" empieza con sonido de vocal', 'es lo mismo', 'porque va con "the"'], 1),
        mc('Algo está lejos y lo presentas por primera vez. ¿Cuál es correcto?', ['This is the bus', 'That is a bus', 'It is a bus', 'That is an bus'], 1),
        tap('Toca la palabra incorrecta:', ['This', 'is', 'an', 'cat', 'and', 'it', 'is', 'blue.'], 2, 'a'),
        tap('Toca la palabra incorrecta:', ['That', 'is', 'a', 'old', 'bus', 'and', 'it', 'is', 'yellow.'], 2, 'an'),
        rebuild('🎧 Presenta lejos y describe con "the":', 'That is a bus. The bus is yellow.', ['That', 'is', 'a', 'bus.', 'The', 'bus', 'is', 'yellow.', 'This', 'an', 'it', 'old']),
      ] },
    { id: 'modulo4-resumen', type: 'resumen', markdown: `**📌 Puntos clave:**

✅ Usa **"This is…"** para presentar algo cercano.
✅ Usa **"That is…"** para algo más lejos.
✅ Usa **"It is…"** para hablar de algo ya mencionado sin repetir su nombre.
✅ Elige **"a"** antes de sonido de consonante.
✅ Elige **"an"** antes de sonido de vocal.
✅ Usa **"the"** cuando ya es algo conocido o específico en la conversación.

¡Los artículos son la ropa de las palabras! Sin ellos, las frases suenan incompletas.` },
    { id: 'modulo4-cierre', type: 'cierre', markdown: `¡Buen trabajo! 👏 Ahora puedes **señalar objetos o personas y presentarlos en inglés**: *this is…*, *that is…*, *it is…* ya no son misterios para ti.

> 💡 **Recuerda:** usa **a** (antes de sonido de consonante) o **an** (antes de sonido de vocal) la primera vez que mencionas algo singular: *This is a phone*, *This is an umbrella*. Usa **the** las siguientes veces o si ya es algo específico: *The phone is new*. Y si no quieres repetir el sustantivo (*phone*), ponle un **it** y listo: *It is new*.

**{{mascot}} tip:** la próxima vez que vayas por la calle, intenta pensar en inglés lo que ves. Por ejemplo: *"This is a tree. It is tall. That is a bus. It is old. The bus is yellow."* – Estarás practicando demostrativos y artículos en tu mente. ¡Paja, no! 😎

✅ **Misión cumplida:** Ya puedes presentar cosas y personas a tu alrededor como un guía turístico bilingüe. Tus frases tendrán la *"ropa"* adecuada (artículos) y sonarás más natural al no repetir innecesariamente los nombres.

**🏅 Insignia obtenida:** *Identificador Experto* (Maestr@ de **this/that/it** y **artículos**) 📖✨` },
  ],
  quizQuestions: [
    mc('___ is a tree. (está cerca de ti)', ['That', 'This', 'It', 'The'], 1),
    mc('This is a phone. ___ is new. (sin repetir "phone")', ['The phone', 'It', 'This', 'An'], 1),
    mc('I see a dog. ___ dog is big. (ya mencionado)', ['A', 'An', 'The', 'It'], 2),
    mc('Para elegir entre "a" o "an" te fijas en...', ['la primera letra escrita', 'el sonido inicial de la palabra', 'la longitud de la palabra', 'si es masculino o femenino'], 1),
    mc('___ is an umbrella. It is blue. (está lejos de ti)', ['This', 'That', 'The', 'It'], 1),
    mc('¿Cuál de estas frases es correcta?', ['It is a yellow', 'This is an cat', 'That is an old car', 'It is the blue'], 2),
    tap('Toca la palabra incorrecta:', ['This', 'is', 'an', 'cat', 'and', 'it', 'is', 'small.'], 2, 'a'),
    tap('Toca la palabra incorrecta:', ['This', 'is', 'an', 'old', 'phone', 'and', 'that', 'is', 'a', 'egg.'], 8, 'an'),
    tap('Toca la palabra incorrecta:', ['That', 'is', 'a', 'old', 'car', 'and', 'it', 'is', 'big.'], 2, 'an'),
    tap('Toca la palabra incorrecta:', ['That', 'is', 'an', 'old', 'bus', 'and', 'this', 'is', 'a', 'apple.'], 8, 'an'),
    tap('Toca la palabra incorrecta:', ['This', 'is', 'a', 'phone', 'and', 'it', 'are', 'new.'], 6, 'is'),
    rebuild('🎧 Presenta cerca y describe:', 'This is a cat. It is blue.', ['This', 'is', 'a', 'cat.', 'It', 'is', 'blue.', 'That', 'an', 'these', 'the']),
    rebuild('🎧 Presenta lejos por primera vez:', 'That is an apple.', ['That', 'is', 'an', 'apple.', 'This', 'a', 'it', 'banana.']),
    rebuild('🎧 Usa el artículo definido:', 'The bus is yellow.', ['The', 'bus', 'is', 'yellow.', 'A', 'an', 'it', 'old']),
    rebuild('🎧 Frase completa con "an":', 'That is an old model.', ['That', 'is', 'an', 'old', 'model.', 'This', 'a', 'the', 'new']),
  ],
};

const microlection5 = {
  id: 'modulo1-5',
  title: 'Microlección 5',
  durationMinutes: 12,
  audioCues: ['Escucha el contenido de la lección.', 'Fíjate en los puntos clave.', 'Ahora vienen tus ejercicios.'],
  contentBlocks: [
    { id: 'modulo5-titulo', type: 'titulo', title: 'Un poquito de Ubicaína ¿Dónde estoy?', subtitle: 'There is/are + Preposiciones de lugar', markdown: '' },
    { id: 'modulo5-mision', type: 'mision', markdown: `Aprender a **describir lo que hay en tu entorno y ubicarlo** es clave para ubicarte (Casi tanto como leer bien un plano 😉). Usaremos **"There is / There are"** para decir *"hay"* en singular y plural, y practicaremos algunas **preposiciones de lugar** básicas (on, in, under, next to, in front of, etc.) para indicar dónde están las cosas.` },
    { id: 'modulo5-intro', type: 'intro', markdown: `¡Hola! Soy {{mascot}} 🗺️, tu {{mascotKind}} viajero. Imagina que vas en el bus, miras por la ventana y te preguntas *"¿Dónde estoy?"*. Hoy aprenderemos a responder eso describiendo lo que **hay** a tu alrededor y **dónde** está cada cosa.

En inglés, para decir **"hay (algo)"**, usamos **"There is"** (cuando es *una* cosa) y **"There are"** (cuando son *varias*). Es como decir "Ahí está..." o "Ahí están..." en sentido de existencia.

Además, repasaremos vocabulario de lugares comunes (station, park, store, etc.) y usaremos preposiciones como **on** (sobre/en), **in** (en/dentro), **under** (debajo), **next to** (al costado de), **in front of** (en frente de) para ubicar todo.` },
    { id: 'modulo5-sneakpeek', type: 'sneakPeek', markdown: `¡Así que vamos a pintar el mapa verbal de nuestros alrededores! 🗺️✨

Hoy aprenderás a decir exactamente qué hay en lugares específicos y dónde están las cosas, como si fueras un guía turístico verbal de tu ciudad.` },
    { id: 'modulo5-teoria-1', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**🛠️ Describiendo lo que hay**

**There is + singular** / **There are + plural** son expresiones fijas para decir "*hay*". No importa quién o qué puso eso ahí, simplemente afirmas existencia:

* *There is a bus stop on this street.* – Hay una parada de bus en esta calle.
* *There are many people at the park.* – Hay mucha gente en el parque.

Fíjate: no traducimos palabra por palabra "hay". En lugar de eso, decimos "*there is/are*".`,
      miniQuiz: [
        mc('Para varias cosas (plural) usas...', ['There is', 'There are', 'There have', 'There be'], 1),
        mc('Para una sola cosa (singular) usas...', ['There are', 'There is', 'There has', 'There many'], 1),
        mc('¿Cuál es correcta? (Hay un parque)', ['There are a park', 'There have a park', 'There is a park', 'There a park'], 2),
        mc('¿Cuál es correcta? (Hay muchas personas)', ['There is many people', 'There are many people', 'There have many people', 'There are a people'], 1),
        mc('¿Cuál es correcta? (Hay tres libros)', ['There are three books', 'There is three books', 'There be three books', 'There has three books'], 0),
        tap('Toca la palabra incorrecta:', ['There', 'is', 'a', 'store', 'and', 'there', 'is', 'many', 'buses.'], 6, 'are'),
        tap('Toca la palabra incorrecta:', ['There', 'are', 'many', 'shops', 'and', 'there', 'is', 'two', 'parks.'], 6, 'are'),
        rebuild('Existe en plural:', 'There are many people here', ['There', 'are', 'many', 'people', 'here', 'is', 'their', 'a', 'one']),
      ] },
    { id: 'modulo5-teoria-2', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**📍 Preposiciones de lugar**

Ahora agreguemos **preposiciones de lugar** para detalles:

* *The bus stop is **in front of** a bakery.* – La parada de bus **está en frente de** una panadería.
* *The park is **next to** the school.* – El parque **está al lado de** la escuela.

Unas preposiciones útiles:

* **on** = en/sobre (contacto con superficie): *on the table* (sobre la mesa).
* **in** = en/dentro: *in the box* (dentro de la caja), *in Lima* (en Lima).
* **under** = debajo: *under the seat* (debajo del asiento).
* **next to** = al lado de: *next to the bank* (junto al banco).
* **in front of** = en frente de: *in front of the building* (frente al edificio).
* **behind** = detrás de: *behind you* (detrás de ti).`,
      miniQuiz: [
        mc('¿Qué preposición significa "sobre/en contacto con una superficie"?', ['in', 'on', 'under', 'behind'], 1),
        mc('¿Qué preposición significa "debajo"?', ['on', 'in', 'under', 'next to'], 2),
        mc('¿Qué preposición significa "al lado de"?', ['next to', 'in front of', 'behind', 'under'], 0),
        mc('Completa: "The cat is ___ the box." (dentro)', ['on', 'in', 'under', 'behind'], 1),
        mc('Completa: "The park is ___ the school." (detrás de)', ['in front of', 'next to', 'behind', 'on'], 2),
        tap('Toca la palabra incorrecta:', ['There', 'is', 'a', 'book', 'in', 'the', 'table.'], 4, 'on'),
        tap('Toca la palabra incorrecta:', ['The', 'bank', 'is', 'next', 'to', 'the', 'school', 'and', 'the', 'park', 'is', 'under', 'the', 'store.'], 11, 'behind'),
        rebuild('🎧 Ubicación con under:', 'There is a cat under the seat', ['There', 'is', 'a', 'cat', 'under', 'the', 'seat', 'are', 'on', 'in', 'their']),
      ] },
    { id: 'modulo5-teoria-3', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**🗺️ Combinando existencia y ubicación**

*There is a cat on the bus!* (¡Hay un gato en el bus!)
*It is under a seat.* (Está debajo de un asiento.)
*The driver is next to the door.* (El chofer está al lado de la puerta.)
*There are 3 people in front of the bus.* (Hay 3 personas al frente del bus.)

Como ves, combinando **there is/are** con ubicaciones, puedes dibujar con palabras dónde están las cosas.

*(¿Notas algo? "hay" no distingue singular/plural en español, pero en inglés sí: **is** vs **are**. Nuestra agente Is-abella aparece en **there is** 😉 y en **there are** ¡disfrazadita de Are-abella! 🤭. Is-abella y sus múltiples alias siempre lista para enfrentar una situación en singular o en plural.)*`,
      miniQuiz: [
        mc('¿Cómo dices "Hay un gato en la mesa"?', ['There are a cat on the table', 'There is a cat on the table', 'There is a cat in the table', 'The cat is on table'], 1),
        mc('¿Cómo preguntas "¿Hay un parque por aquí?"?', ['Are there a park here?', 'There is a park here?', 'Is there a park here?', 'Is there parks here?'], 2),
        mc('¿Cómo preguntas "¿Hay tiendas cerca?"?', ['Is there stores nearby?', 'Are there stores nearby?', 'There are stores nearby?', 'Are there a store nearby?'], 1),
        mc('Para preguntar por varias cosas empiezas con...', ['Is there', 'Are there', 'There are', 'Have there'], 1),
        mc('Completa: "___ three people in front of the bus."', ['There is', 'There are', 'Is there', 'There have'], 1),
        tap('Toca la palabra incorrecta:', ['There', 'is', 'a', 'dog', 'and', 'there', 'is', 'two', 'cats', 'under', 'the', 'seat.'], 6, 'are'),
        tap('Toca la palabra incorrecta:', ['Are', 'there', 'a', 'bus', 'stop', 'in', 'front', 'of', 'the', 'bank?'], 0, 'Is'),
        rebuild('🎧 Pregunta con preposición:', 'Are there any shops next to the park', ['Are', 'there', 'any', 'shops', 'next', 'to', 'the', 'park', 'Is', 'is', 'in', 'their']),
      ] },
    { id: 'modulo5-resumen', type: 'resumen', markdown: `**📌 Puntos clave:**

✅ **"There is"** = hay (singular)
✅ **"There are"** = hay (plural)
✅ **"on"** = sobre/en (contacto con superficie)
✅ **"in"** = en/dentro
✅ **"under"** = debajo
✅ **"next to"** = al lado de
✅ **"in front of"** = en frente de
✅ **"behind"** = detrás de

Combina "There is/are" con preposiciones para describir exactamente qué hay y dónde.` },
    { id: 'modulo5-cierre', type: 'cierre', markdown: `¡Genial! 🌆 Ahora puedes **ubicarte** y describir lugares en inglés sin perderte. Sabes decir qué **hay** en tu entorno con *there is/are*, puedes preguntar **dónde está** algo importante (*Where is the...?*), y usar las **preposiciones** correctas para dar indicaciones precisas.

Así que la próxima vez que vayas en el bus y quieras contar lo que ves: *"There are many buildings. The park is next to a school. The bus stop is in front of a bakery."* podrás hacerlo como todo un guía turístico bilingüe 😎.

Y si te pierdes, no temas preguntar: *"Excuse me, where is the bus stop?"* – con esa frase mágica, cualquier buen samaritano te ayudará a encontrar la parada de bus más cercana.

✅ **Misión cumplida:** Tus habilidades de **navegación en inglés** están en marcha. ¡Ya nada de andar perdid@ por el mundo! Sigue con este buen rumbo hacia el dominio del idioma.

**🏅 Insignia obtenida:** *Explorador Urbano* (Maestría en **there is/are** y direcciones) 🗺️🌟` },
  ],
  quizQuestions: [
    mc('Para varias cosas (plural) usas...', ['There is', 'There are', 'There have', 'There be'], 1),
    mc('¿Cuál es correcta? (Hay una parada de bus)', ['There are a bus stop', 'There is a bus stop', 'There is bus stop', 'There have a bus stop'], 1),
    mc('¿Cuál es correcta? (Hay muchas personas)', ['There is many people', 'There have many people', 'There are a people', 'There are many people'], 3),
    mc('Completa: "The book is ___ the table." (sobre)', ['on', 'in', 'under', 'behind'], 0),
    mc('Completa: "The pen is ___ the box." (dentro)', ['on', 'in', 'next to', 'behind'], 1),
    mc('¿Cómo preguntas "¿Hay tiendas cerca?"?', ['Is there stores nearby?', 'Are there stores nearby?', 'There are stores nearby?', 'Are there a store nearby?'], 1),
    tap('Toca la palabra incorrecta:', ['There', 'are', 'a', 'book', 'on', 'the', 'desk.'], 1, 'is'),
    tap('Toca la palabra incorrecta:', ['There', 'is', 'a', 'park', 'and', 'there', 'is', 'many', 'shops.'], 6, 'are'),
    tap('Toca la palabra incorrecta:', ['The', 'cat', 'is', 'in', 'the', 'couch', 'next', 'to', 'the', 'lamp.'], 3, 'on'),
    tap('Toca la palabra incorrecta:', ['The', 'store', 'is', 'in', 'front', 'the', 'bank', 'and', 'next', 'to', 'the', 'park.'], 4, 'front of'),
    tap('Toca la palabra incorrecta:', ['Are', 'there', 'a', 'coffee', 'shop', 'behind', 'the', 'station?'], 0, 'Is'),
    rebuild('Existe en singular:', 'There is a bus stop here', ['There', 'is', 'a', 'bus', 'stop', 'here', 'are', 'their', 'many', 'people']),
    rebuild('🎧 Ubicación con preposición:', 'The bank is next to the school', ['The', 'bank', 'is', 'next', 'to', 'the', 'school', 'in', 'front', 'on', 'under']),
    rebuild('🎧 Pregunta sobre existencia:', 'Is there a park near my house', ['Is', 'there', 'a', 'park', 'near', 'my', 'house', 'Are', 'their', 'is', 'shops']),
    rebuild('🎧 Descripción completa:', 'There are shops in front of the station', ['There', 'are', 'shops', 'in', 'front', 'of', 'the', 'station', 'is', 'on', 'next', 'their', 'under', 'behind']),
  ],
};

const microlection6 = {
  id: 'modulo1-6',
  title: 'Microlección 6',
  durationMinutes: 12,
  audioCues: ['Escucha el contenido de la lección.', 'Fíjate en los puntos clave.', 'Ahora vienen tus ejercicios.'],
  contentBlocks: [
    { id: 'modulo6-titulo', type: 'titulo', title: '¿Quién eres tú?', subtitle: 'Palabras WH-atsapp en presente', markdown: '' },
    { id: 'modulo6-mision', type: 'mision', markdown: `Aprender a **hacer y responder preguntas básicas en inglés** utilizando las palabras **WH-atsapp** (**Who, What, Where, When, Why, How**). Practicaremos cómo formular preguntas abiertas tanto con el verbo **to be** como con el auxiliar **do/does**.` },
    { id: 'modulo6-intro', type: 'intro', markdown: `¡Hola de nuevo! {{mascot}} está de regreso, más curioso que nunca 🕵️‍♂️. Ya sabes hacer afirmaciones sobre personas y cosas, y ubicarlas; ¡ahora toca **preguntar**! Las **palabras Wh-atsapp** son las preguntas abiertas que te permiten pedir TODO tipo de información.

En esta microlección, descubrirás la **fórmula secreta** para construir estas preguntas y practicaremos con las más comunes: **Who, What, Where, When, Why, How**.` },
    { id: 'modulo6-sneakpeek', type: 'sneakPeek', markdown: `Nuestras agentes gramaticales **Is-abella** y **Do-ménica** estarán en esta misión de espionaje lingüístico para ayudarte a armar bien las preguntas.

Aprenderás a preguntar "¿Quién? ¿Qué? ¿Dónde? ¿Cuándo? ¿Por qué? ¿Cómo?" como un verdadero detective del inglés.` },
    { id: 'modulo6-teoria-1', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**🛠️ La fórmula para preguntar (Palabras Wh-atsapp + verbo)**

Construir preguntas en inglés es como armar un rompecabezas en orden correcto. La estructura es:

**Wh-** + **Agente (is/are o do/does)** + **sujeto** + **verbo principal...?**

**Caso 1 (con to be):** *"¿Quién es la chica bonita?"*
Si tomamos nuestras piezas: **Who + is + sujeto**, probemos: **"Who is the pretty girl?"**
✅ ¡Sí funciona!

**Caso 2 (con otros verbos):** *"¿Dónde vives?"*
**"Where you live?"** suena raro como Tarzán hablando.
❌ Lo correcto es: **"Where do you live?"** ✅

Necesitamos a los agentes especiales **Is-abella** (para *to be*) y **Do-ménica** (para acciones).`,
      miniQuiz: [
        mc('¿Cuál es el orden correcto de la fórmula para preguntar?', ['Sujeto + Wh- + verbo', 'Wh- + (is/are o do/does) + sujeto + verbo', 'Wh- + sujeto + verbo + auxiliar', 'Verbo + Wh- + sujeto'], 1),
        mc('¿Cuál pregunta está bien formada (con un verbo de acción)?', ['Where you live?', 'Where do you live?', 'Where live you?', 'You where live?'], 1),
        mc('En una pregunta con el verbo to be, ¿qué va justo después de la palabra Wh-?', ['el sujeto', 'do o does', 'is o are', 'el verbo principal'], 2),
        mc('¿Por qué "Where you live?" está mal?', ['Le falta el auxiliar do/does', 'Sobra la palabra Where', 'El sujeto está mal ubicado', 'Le falta el verbo to be'], 0),
        mc('¿Cuál pregunta usa correctamente el verbo to be?', ['Who do the pretty girl?', 'Who the pretty girl is?', 'Who is the pretty girl?', 'Who does the pretty girl?'], 2),
        tap('Toca la palabra incorrecta:', ['Where', 'does', 'you', 'live', 'and', 'what', 'do', 'they', 'do?'], 1, 'do'),
        tap('Toca la palabra incorrecta:', ['What', 'do', 'you', 'study', 'and', 'where', 'do', 'you', 'works?'], 8, 'work?'),
        rebuild('🎧 Una pregunta con verbo de acción:', 'Where do you live', ['Where', 'do', 'you', 'live', 'does', 'were', 'lives', 'leave']),
      ] },
    { id: 'modulo6-teoria-2', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**🕵️ Los agentes especiales: Is-abella y Do-ménica**

**Is-abella** (nombre clave: *Is/Are*) nos ayuda en preguntas que usan el verbo *to be*:
* *Who is that?* – ¿Quién es ese?
* *Where is the bathroom?* – ¿Dónde está el baño?

**Do-ménica** (nombre clave: *Do/Does*) nos ayuda en preguntas sobre acciones normales (verbos distintos de *to be*):
* *Where do you live?* – ¿Dónde vives?
* *What does she study?* – ¿Qué estudia ella?

Recuerda: con **he/she/it**, Do-ménica se disfraza de **does**, y al aparecer **does**, el verbo principal pierde la **-s**.
Do-ménica se llevó esa **s** como evidencia 🔍.`,
      miniQuiz: [
        mc('Con he/she/it en una pregunta de acción usamos...', ['do + verbo', 'does + verbo sin -s', 'does + verbo con -s', 'is + verbo'], 1),
        mc('¿Cuál pregunta es correcta?', ['Where does she lives?', 'Where do she live?', 'Where does she live?', 'Where she does live?'], 2),
        mc('"Where is the bathroom?" usa al agente...', ['Do-ménica (do/does)', 'Is-abella (is/are)', 'Ambas a la vez', 'Ninguna'], 1),
        mc('"What ___ she study?" (acción, sujeto she). Completa:', ['do', 'is', 'does', 'are'], 2),
        mc('¿Cuál pregunta es correcta?', ['What do he do?', 'What does he does?', 'What is he do?', 'What does he do?'], 3),
        tap('Toca la palabra incorrecta:', ['Where', 'does', 'she', 'lives', 'and', 'what', 'does', 'he', 'do?'], 3, 'live'),
        tap('Toca la palabra incorrecta:', ['What', 'do', 'you', 'study', 'and', 'where', 'do', 'she', 'work?'], 6, 'does'),
        rebuild('🎧 Una pregunta con he/she:', 'Where does she live', ['Where', 'does', 'she', 'live', 'do', 'lives', 'were', 'leave']),
      ] },
    { id: 'modulo6-teoria-3', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**🎤 Palabras Wh-atsapp comunes:**

**1. Who – ¿Quién...?**
* *Who is that pretty girl?* – ¿Quién es esa chica linda?
* *Who are they?* – ¿Quiénes son ellos?
* *Who lives here?* – ¿Quién vive aquí?

**2. What – ¿Qué...? / ¿Cuál...?**
* *What is your name?* – ¿Cuál es tu nombre?
* *What do you study?* – ¿Qué estudias?
* *What is your favorite color?* – ¿Cuál es tu color favorito?

**3. Where – ¿Dónde...?**
* *Where are you from?* – ¿De dónde eres?
* *Where do you live?* – ¿Dónde vives?
* *Where is the bathroom?* – ¿Dónde está el baño?

**4. When – ¿Cuándo...?**
* *When is the party?* – ¿Cuándo es la fiesta?
* *When do you arrive?* – ¿Cuándo llegas?`,
      miniQuiz: [
        mc('¿Cuál pregunta es correcta para pedir el nombre?', ['What is your name?', 'Who is your name?', 'What are your name?', 'Where is your name?'], 0),
        mc('¿Cuál pregunta es correcta para preguntar dónde vive ella?', ['Where does she lives?', 'Where do she live?', 'Where does she live?', 'Where she lives?'], 2),
        mc('Para preguntar quién vive aquí, ¿cuál es correcta?', ['Who lives here?', 'Who do live here?', 'Where lives here?', 'Who are live here?'], 0),
        mc('"___ is the party?" (preguntas por el momento). Completa con la palabra Wh-:', ['Who', 'What', 'When', 'Where'], 2),
        mc('¿Cuál pregunta está bien formada?', ['Where do you live?', 'Where you do live?', 'Where you live?', 'Where does you live?'], 0),
        tap('Toca la palabra incorrecta:', ['What', 'is', 'your', 'name', 'and', 'where', 'do', 'you', 'lives?'], 8, 'live?'),
        tap('Toca la palabra incorrecta:', ['Who', 'are', 'that', 'girl', 'and', 'what', 'is', 'her', 'name?'], 1, 'is'),
        rebuild('🎧 Una pregunta con When:', 'When do you arrive', ['When', 'do', 'you', 'arrive', 'does', 'where', 'arrives', 'were']),
      ] },
    { id: 'modulo6-teoria-4', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**🤔 Más palabras Wh-atsapp:**

**5. Why – ¿Por qué...?**
* *Why do you study English?* – ¿Por qué estudias inglés?
* *Why is she happy?* – ¿Por qué está feliz ella?

**6. How – ¿Cómo...?**
* *How do you go to work?* – ¿Cómo vas al trabajo?
* *How are you?* – ¿Cómo estás?
* *How old are you?* – ¿Cuántos años tienes?

**Otros:**
* *How many...?* – ¿Cuántos...?
* *How much...?* – ¿Cuánto...?
* *Which...?* – ¿Cuál...? (cuando hay opciones específicas)`,
      miniQuiz: [
        mc('¿Cuál pregunta es correcta para pedir la razón?', ['Where do you study English?', 'Why do you study English?', 'Why you study English?', 'Why does you study English?'], 1),
        mc('¿Cuál pregunta es correcta para pedir la manera?', ['How do you go to work?', 'What do you go to work?', 'How you go to work?', 'How does you go to work?'], 0),
        mc('Con he/she/it y un verbo de acción, ¿cuál es correcta?', ['Why does she works late?', 'Why do she work late?', 'Why does she work late?', 'Why she works late?'], 2),
        mc('"___ many brothers do you have?" Completa para preguntar cantidad:', ['How much', 'Which', 'How many', 'What'], 2),
        mc('¿Cuál pregunta usa correctamente el verbo to be?', ['Why does she happy?', 'Why do she happy?', 'Why is she happy?', 'Why she is happy?'], 2),
        tap('Toca la palabra incorrecta:', ['Why', 'do', 'you', 'study', 'and', 'how', 'does', 'she', 'works?'], 8, 'work?'),
        tap('Toca la palabra incorrecta:', ['How', 'do', 'you', 'go', 'to', 'work', 'and', 'why', 'does', 'you', 'study?'], 8, 'do'),
        rebuild('🎧 Una pregunta con Why:', 'Why do you study English', ['Why', 'do', 'you', 'study', 'English', 'does', 'were', 'studies', 'why']),
      ] },
    { id: 'modulo6-resumen', type: 'resumen', markdown: `**📌 Resumen de la fórmula:**

✅ **Con "to be":** Wh- + is/are + sujeto...?
  - *Who is that?* / *Where is he?*

✅ **Con otros verbos:** Wh- + do/does + sujeto + verbo...?
  - *What do you do?* / *Where does she live?*

✅ **Palabras Wh-atsapp principales:**
  - **Who** = ¿Quién?
  - **What** = ¿Qué? / ¿Cuál?
  - **Where** = ¿Dónde?
  - **When** = ¿Cuándo?
  - **Why** = ¿Por qué?
  - **How** = ¿Cómo?

Domina esta fórmula y podrás hacer cualquier pregunta en inglés.` },
    { id: 'modulo6-cierre', type: 'cierre', markdown: `¡Excelente! 🕵️‍♂️ Ahora eres un verdadero detective del inglés. Dominas la **fórmula secreta** para hacer preguntas: combinando palabras Wh-atsapp con Is-abella o Do-ménica.

> 💡 **Recuerda la estructura:**
> * **¿Quién? / ¿Qué? / ¿Dónde? / ¿Cuándo? / ¿Por qué? / ¿Cómo?**
> * **+ is/are (para "to be")**
> * **+ do/does (para otros verbos)**
> * **+ sujeto + verbo**

Ya puedes:
✅ Hacer preguntas básicas en inglés
✅ Obtener información de otras personas
✅ Responder preguntas sobre ti mismo
✅ Formular preguntas correctas con la estructura adecuada

✅ **Misión cumplida:** ¡Eres un agente secreto del inglés! Con Is-abella y Do-ménica de tu lado, nada podrá detenerte.

**🏅 Insignia obtenida:** *Agente Interrogador* (Maestr@ de las preguntas Wh-atsapp) 🕵️‍♀️✨` },
  ],
  quizQuestions: [
    mc('¿Cuál es el orden correcto de la fórmula para preguntar?', ['Sujeto + Wh- + verbo', 'Wh- + (is/are o do/does) + sujeto + verbo', 'Wh- + sujeto + verbo + auxiliar', 'Verbo + Wh- + sujeto'], 1),
    mc('Con he/she/it en una pregunta de acción usamos...', ['do + verbo', 'does + verbo con -s', 'does + verbo sin -s', 'is + verbo'], 2),
    mc('¿Cuál pregunta es correcta?', ['Where does she lives?', 'Where do she live?', 'Where she lives?', 'Where does she live?'], 3),
    mc('¿Cuál pregunta es correcta para pedir el nombre?', ['Who is your name?', 'What are your name?', 'What is your name?', 'Where is your name?'], 2),
    mc('"___ is the party?" Completa con la palabra Wh- para preguntar el momento:', ['Who', 'When', 'Where', 'What'], 1),
    mc('¿Cuál pregunta usa correctamente el verbo to be?', ['Why does she happy?', 'Why do she happy?', 'Why she is happy?', 'Why is she happy?'], 3),
    tap('Toca la palabra incorrecta:', ['Where', 'does', 'she', 'lives', 'and', 'what', 'does', 'he', 'do?'], 3, 'live'),
    tap('Toca la palabra incorrecta:', ['What', 'do', 'you', 'study', 'and', 'where', 'do', 'she', 'work?'], 6, 'does'),
    tap('Toca la palabra incorrecta:', ['What', 'is', 'your', 'name', 'and', 'where', 'do', 'you', 'lives?'], 8, 'live?'),
    tap('Toca la palabra incorrecta:', ['Why', 'do', 'you', 'study', 'and', 'how', 'does', 'she', 'works?'], 8, 'work?'),
    tap('Toca la palabra incorrecta:', ['Who', 'are', 'that', 'girl', 'and', 'what', 'is', 'her', 'name?'], 1, 'is'),
    rebuild('🎧 Una pregunta con verbo de acción:', 'Where do you live', ['Where', 'do', 'you', 'live', 'does', 'were', 'lives', 'leave']),
    rebuild('🎧 Una pregunta con he/she:', 'Where does she live', ['Where', 'does', 'she', 'live', 'do', 'lives', 'were', 'leave']),
    rebuild('🎧 Una pregunta con When:', 'When do you arrive', ['When', 'do', 'you', 'arrive', 'does', 'where', 'arrives', 'were']),
    rebuild('🎧 Una pregunta con Why:', 'Why do you study English', ['Why', 'do', 'you', 'study', 'English', 'does', 'were', 'studies', 'why']),
  ],
};

const microlection7 = {
  id: 'modulo1-7',
  title: 'Microlección 7',
  durationMinutes: 12,
  audioCues: ['Escucha el contenido de la lección.', 'Fíjate en los puntos clave.', 'Ahora vienen tus ejercicios.'],
  contentBlocks: [
    { id: 'modulo7-titulo', type: 'titulo', title: 'Supervivencia en el camino', subtitle: 'Saludos y frases útiles', markdown: '' },
    { id: 'modulo7-mision', type: 'mision', markdown: `Aprender las frases básicas de cortesía y supervivencia en inglés para el día a día. Esto incluye saludar apropiadamente según la hora, agradecer, disculparse, pedir algo de forma amable y otras expresiones útiles cuando estás por la ciudad o en el bus.` },
    { id: 'modulo7-intro', type: 'intro', markdown: `¡Hello! 👋 Soy {{mascot}}, tu guía, y hoy armaremos un kit de supervivencia lingüística. Cuando viajas en bus o caminas por la ciudad, hay frases básicas que necesitas para ser amable y hacerte entender con la gente. Cosas como saludar al subir, dar las gracias, pedir permiso para bajar, o disculparte si empujas sin querer.

No se trata de gramática complicada esta vez, sino de saber qué decir en el momento justo. Estas frases son cortas pero poderosas. ¡Vamos a aprenderlas y practicarlas! 😃

(Nuestras agentes secretas estarán de apoyo moral, pero hoy el protagonismo es de la buena educación en inglés.)` },
    { id: 'modulo7-sneakpeek', type: 'sneakPeek', markdown: `En esta microlección aprenderás a saludar según la hora del día, presentarte, despedirte con estilo, agradecer como se debe, pedir cosas con educación, disculparte sin drama y sobrevivir en el bus o en la calle con frases clave.

¡Al final serás un verdadero **Viajero Cortés**! 🤝` },
    { id: 'modulo7-teoria-1', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**🛠️ Saludos (Greetings)**

* **Hello / Hi** – Hola (formal/informal).
* **Good morning** – Buenos días.
* **Good afternoon** – Buenas tardes.
* **Good evening** – Buenas noches (al saludar, temprano en la noche de 5–6 pm en adelante).

> 💡 Recuerda: **Good night** es buenas noches solo para **despedirse**, no para saludar.`,
      miniQuiz: [
        mc('Son las 9 de la mañana y subes al bus. ¿Cómo saludas al conductor?', ['Good night', 'Good morning', 'Good afternoon', 'Good evening'], 1),
        mc('Son las 4 de la tarde. ¿Qué saludo usas?', ['Good evening', 'Good morning', 'Good afternoon', 'Good night'], 2),
        mc('Es de noche (8 pm) y llegas a una reunión. ¿Cómo SALUDAS al entrar?', ['Good night', 'Good afternoon', 'Good morning', 'Good evening'], 3),
        mc('"Good night" se usa para...', ['saludar en la noche', 'despedirse', 'agradecer', 'pedir algo'], 1),
        mc('¿Cuál de estos saludos sirve a cualquier hora y es informal?', ['Good morning', 'Good night', 'Hi', 'Good evening'], 2),
        tap('Toca la palabra incorrecta:', ['Good', 'night,', 'how', 'are', 'you?'], 1, 'evening,'),
        tap('Toca la palabra incorrecta:', ['Hi!', 'Good', 'night,', 'how', 'are', 'you?'], 2, 'afternoon,'),
        rebuild('Escucha y reconstruye:', 'Good morning', ['Good', 'morning', 'evening', 'night', 'afternoon', 'hello']),
      ] },
    { id: 'modulo7-teoria-2', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**🤝 Presentaciones**

* **Nice to meet you.** – Encantado de conocerte. (Se dice al conocer a alguien por primera vez).
* **Nice to meet you, too.** – Igualmente (respuesta al anterior).`,
      miniQuiz: [
        mc('Conoces a alguien por primera vez. ¿Qué frase dices?', ['Nice to meet you', 'Good night', 'Thank you so much', 'See you later'], 0),
        mc('Alguien te dice "Nice to meet you." ¿Qué respondes?', ['Thank you', 'Good morning', 'Nice to meet you, too', "You're welcome"], 2),
        mc('¿Cuándo se usa "Nice to meet you"?', ['al despedirte de noche', 'al conocer a alguien por primera vez', 'al pedir un favor', 'al agradecer'], 1),
        mc('Es de noche y conoces a alguien nuevo. ¿Cuál es la combinación correcta?', ['Good night. Nice to meet you.', 'Good evening. Nice to meet you.', 'Good night, too.', 'Good afternoon. See you later.'], 1),
        mc('Un amigo te presenta a su hermana. Ella dice "Nice to meet you." Para responder con "igualmente" dices:', ['Nice to meet you, too', 'Thanks a lot', 'Good evening', 'No problem'], 0),
        tap('Toca la palabra incorrecta:', ['Nice', 'to', 'meet', 'your.'], 3, 'you.'),
        tap('Toca la palabra incorrecta:', ['Nice', 'to', 'meet', 'you,', 'two.'], 4, 'too.'),
        rebuild('Escucha y reconstruye:', 'Nice to meet you too', ['Nice', 'to', 'meet', 'you', 'too', 'meat', 'two', 'see', 'hello']),
      ] },
    { id: 'modulo7-teoria-3', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**👋 Despedidas (Farewells)**

* **Bye / Goodbye** – Adiós.
* **See you later / See you soon** – Nos vemos luego/pronto.
* **Take care** – Cuídate.
* **Good night** – Buenas noches (despedida al final del día/noche).

> 💡 **Good night** solo se usa para **despedirse**. Para **saludar** por la noche usamos **Good evening**.`,
      miniQuiz: [
        mc('Te despides de un amigo que verás pronto. ¿Qué dices?', ['Good morning', 'See you later', 'Nice to meet you', 'Excuse me'], 1),
        mc('Es medianoche y te vas a dormir. ¿Qué dices para despedirte?', ['Good evening', 'Good morning', 'Good night', 'Good afternoon'], 2),
        mc('Quieres decirle a alguien "cuídate" al despedirte. ¿Qué frase usas?', ['Take care', 'Nice to meet you', 'Good evening', 'Could you repeat that?'], 0),
        mc('¿Cuál de estas frases NO es una despedida?', ['Goodbye', 'Take care', 'Good evening', 'See you soon'], 2),
        mc('Llegas a una fiesta a las 8 pm. NO te despides, recién llegas. ¿Qué dices?', ['Good night', 'Good evening', 'Take care', 'See you later'], 1),
        tap('Toca la palabra incorrecta:', ['Good', 'night,', 'welcome', 'to', 'the', 'party!'], 1, 'evening,'),
        tap('Toca la palabra incorrecta:', ['See', 'you', 'letter,', 'take', 'care!'], 2, 'later,'),
        rebuild('Escucha y reconstruye:', 'See you later take care', ['See', 'you', 'later', 'take', 'care', 'soon', 'sea', 'letter', 'bye']),
      ] },
    { id: 'modulo7-teoria-4', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**🙏 Agradecimientos**

* **Thank you** – Gracias.
* **Thanks a lot** – Muchas gracias.
* **Thank you so much** – Muchísimas gracias.

**Responder a gracias:**

* **You're welcome** – De nada.
* **No problem** – No hay problema.
* **My pleasure** – El gusto es mío.`,
      miniQuiz: [
        mc('Alguien te ayuda a cargar tus bolsas. ¿Qué le dices?', ["You're welcome", 'Thank you', 'My pleasure', 'No problem'], 1),
        mc('Alguien te dice "Thank you." ¿Qué respondes para decir "de nada"?', ['Thank you so much', 'Thanks a lot', "You're welcome", 'Good evening'], 2),
        mc('Alguien te dice "Thank you." ¿Cuál NO es una respuesta válida?', ["You're welcome", 'No problem', 'Thank you so much', 'My pleasure'], 2),
        mc('Quieres dar las gracias con MUCHO énfasis. ¿Cuál usas?', ['Thank you so much', "You're welcome", 'No problem', 'Excuse me'], 0),
        mc('"My pleasure" se usa para...', ['agradecer', 'responder a un agradecimiento', 'saludar', 'disculparte'], 1),
        tap('Toca la palabra incorrecta:', ['Your', 'welcome,', 'no', 'problem.'], 0, "You're"),
        tap('Toca la palabra incorrecta:', ['Thank', 'a', 'lot', 'for', 'helping!'], 0, 'Thanks'),
        rebuild('Escucha y reconstruye:', 'Thank you so much', ['Thank', 'you', 'so', 'much', 'a', 'lot', 'welcome', 'please']),
      ] },
    { id: 'modulo7-teoria-5', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**🙋 Por favor y pedir algo**

* **Please** – Por favor (siempre al pedir algo: no lo olvides).
* **Excuse me** – Disculpe... (para llamar la atención de alguien de forma educada, o para interrumpir).
* **Could you... please?** – ¿Podría(s)... por favor? (para pedir ayuda u objetos).

> 💡 Es más educado que solo decir "Open the window" (que sonaría como una orden). Piénsalo como el "¿podrías...?" del español: técnicamente es una pregunta, pero en realidad es una petición amable. Úsalo siempre que quieras pedir algo sin sonar mandón 😉.`,
      miniQuiz: [
        mc('¿Cuál es la forma más educada de pedir que abran la ventana?', ['Open the window.', 'Could you open the window, please?', 'The window. Now.', 'Window!'], 1),
        mc('Quieres llamar la atención de alguien de forma educada para preguntarle algo. ¿Qué dices primero?', ['Thank you', 'Excuse me', 'Good night', 'My bad'], 1),
        mc('¿Por qué "Could you... please?" es mejor que solo "Open the window"?', ['porque es más corto', 'porque suena como una orden mandona', 'porque es una petición amable, no una orden', 'porque se usa solo de noche'], 2),
        mc('¿Qué palabra NUNCA debe faltar cuando pides algo de forma educada?', ['Sorry', 'Please', 'Hello', 'Bye'], 1),
        mc('Necesitas que alguien te ayude. ¿Cuál es la petición más amable?', ['Help me.', 'Could you help me, please?', 'I need help now.', 'Help!'], 1),
        tap('Toca la palabra incorrecta:', ['Could', 'you', 'passes', 'the', 'salt,', 'please?'], 2, 'pass'),
        tap('Toca la palabra incorrecta:', ['Excuse', 'you,', 'could', 'you', 'help', 'me?'], 1, 'me,'),
        rebuild('Escucha y reconstruye:', 'Could you help me please', ['Could', 'you', 'help', 'me', 'please', 'can', 'do', 'excuse', 'sorry']),
      ] },
    { id: 'modulo7-teoria-6', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**😅 Disculpas**

* **I'm sorry** – Lo siento / Perdón. (Para disculparse por alguna molestia o error).
* **Sorry** a secas también se usa, pero **I'm sorry** suena un poco más formal/sincero.
* **Excuse me** – Perdón (también funciona para disculparte leve, ej. al rozar a alguien, y como vimos, para llamar la atención).
* **My bad** (informal) – Culpa mía, fue mi error (coloquial, entre amigos).`,
      miniQuiz: [
        mc('Empujas a alguien sin querer en el bus. ¿Qué dices para disculparte?', ['My pleasure', "I'm sorry", 'Thank you', 'Good evening'], 1),
        mc('¿Cuál es la forma MÁS informal de disculparse, entre amigos?', ["I'm sorry", 'Excuse me', 'My bad', 'I apologize'], 2),
        mc('Necesitas pasar entre dos personas que bloquean el camino. ¿Qué dices?', ['My bad', 'Excuse me', 'Thank you so much', 'Good night'], 1),
        mc('¿Cuál de estas suena un poco más formal y sincera al disculparte?', ['My bad', 'Sorry', "I'm sorry", 'No problem'], 2),
        mc('Tu jefe te llama la atención por un error en el trabajo. ¿Qué disculpa es la MÁS apropiada?', ['My bad', "I'm sorry", "You're welcome", 'See you later'], 1),
        tap('Toca la palabra incorrecta:', ['Sorry,', 'that', 'was', 'my', 'bat.'], 4, 'bad.'),
        tap('Toca la palabra incorrecta:', ['Excuse', 'me,', "I'm", 'sorry', 'for', 'the', 'noises.'], 6, 'noise.'),
        rebuild('Escucha y reconstruye:', "I'm sorry about that", ["I'm", 'sorry', 'about', 'that', 'my', 'bad', 'excuse', 'please']),
      ] },
    { id: 'modulo7-teoria-7', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**🚍 Frases en el bus o calle**

* **Could you repeat that, please?** – ¿Podrías repetir eso, por favor? (Úsala si no entendiste algo).
* **I don't understand.** – No entiendo.
* **Can I get off here, please?** – ¿Puedo bajar aquí, por favor? (al hablar con el conductor o cobrador).
* **Does this bus go to Miraflores?** – ¿Este bus va a Miraflores?
* **How much is the fare?** – ¿Cuánto es el pasaje?

Estas frases te sacarán de apuros en la mayoría de situaciones cotidianas. Fíjate que la cortesía es clave: un "please", un "excuse me", un "thank you" pueden hacer maravillas en cómo te responde la gente.`,
      miniQuiz: [
        mc('No entendiste lo que alguien dijo. ¿Cuál es la forma más educada de pedir que repita?', ['What?', 'Could you repeat that, please?', "I don't understand.", 'Say again.'], 1),
        mc('Quieres bajar del bus en la próxima parada. ¿Qué le dices al conductor?', ['Stop the bus!', 'Can I get off here, please?', 'I get off here.', 'Does this bus go?'], 1),
        mc('Quieres saber si el bus va a Miraflores. ¿Cómo preguntas correctamente?', ['Do this bus go to Miraflores?', 'Does this bus go to Miraflores?', 'This bus Miraflores?', 'Go to Miraflores bus?'], 1),
        mc('Quieres saber el precio del pasaje. ¿Qué preguntas?', ['How many is the fare?', 'How much is the fare?', 'What fare?', 'How much fare cost?'], 1),
        mc('Para decir simplemente que NO entiendes, dices:', ['Could you repeat that?', "I don't understand.", 'How much is the fare?', 'Take care.'], 1),
        tap('Toca la palabra incorrecta:', ['Do', 'this', 'bus', 'go', 'to', 'Lima?'], 0, 'Does'),
        tap('Toca la palabra incorrecta:', ['Can', 'I', 'get', 'on', 'here,', 'please?'], 3, 'off'),
        tap('Toca la palabra incorrecta:', ['How', 'many', 'is', 'the', 'fare?'], 1, 'much'),
        rebuild('Escucha y reconstruye:', 'Can I get off here please?', ['Can', 'I', 'get', 'off', 'here', 'please?', 'on', 'the', 'bus', 'do']),
      ] },
    { id: 'modulo7-resumen', type: 'resumen', markdown: `## **🎯 Resumen práctico que debes recordar**

* ✅ **Saludos:** Good morning / Good afternoon / Good evening (para saludar). Good night solo para despedirte.
* ✅ **Presentarte:** Hi, I'm [nombre]. Nice to meet you.
* ✅ **Despedirte:** Bye, See you later, Take care.
* ✅ **Agradecer:** Thank you / Thanks a lot. Responder: You're welcome / No problem.
* ✅ **Pedir algo:** Could you... please? / Excuse me...
* ✅ **Disculparte:** I'm sorry / Excuse me / My bad.
* ✅ **En el bus:** Can I get off here, please? / Does this bus go to...? / How much is the fare?

¡La cortesía es tu superpoder! Un "please" y un "thank you" abren muchas puertas. 🚪✨` },
    { id: 'modulo7-cierre', type: 'cierre', markdown: `#### **🌟 Cierre**

Ya tienes tu kit básico de supervivencia en inglés 🌟. Con estos saludos, despedidas y expresiones de cortesía, podrás moverte por la ciudad con confianza.

Recuerda: la cortesía abre caminos. Un "please", "thank you" o "excuse me" dicho a tiempo puede hacer la diferencia en cómo te tratan. Son palabras mágicas que nunca sobran.

Ahora, cada vez que subas al bus saluda con un alegre "Good morning", sonríe y si necesitas algo, no temas decir "Excuse me..." para preguntar. Verás que la gente responde bien a la amabilidad.

✅ **Misión cumplida:** Tu yo bilingüe cortés está listo para el mundo. Sigue practicando estas frases hasta que te salgan naturalitas, sin pensar.

**🏅 Insignia obtenida:** ✨ *Viajero Cortés* (Maestr@ de la Supervivencia Urbana en inglés) 🌟🤝` },
  ],
  quizQuestions: [
    mc('Al subir al bus por la mañana, saludas diciendo:', ['Good night', 'Good morning', 'Good evening', 'Take care'], 1),
    mc('Es de noche (8 pm) y llegas a una reunión. ¿Cómo SALUDAS?', ['Good night', 'Good evening', 'Good afternoon', 'Good morning'], 1),
    mc('Alguien te dice "Thank you." ¿Qué respondes?', ['Thank you', "You're welcome", 'Excuse me', "I'm sorry"], 1),
    mc('¿Cuál es la forma educada de pedir que abran la puerta?', ['Open the door.', 'The door. Now.', 'Could you open the door, please?', 'Door!'], 2),
    mc('Pisas a alguien sin querer. ¿Qué dices para disculparte?', ["You're welcome", 'Thank you', "I'm sorry", 'Good night'], 2),
    mc('Conoces a alguien por primera vez y te dice "Nice to meet you." Respondes:', ['Nice to meet you, too', 'Thank you so much', 'Good evening', 'No problem'], 0),
    tap('Toca la palabra incorrecta:', ['Good', 'night,', 'how', 'are', 'you?'], 1, 'morning,'),
    tap('Toca la palabra incorrecta:', ['Do', 'this', 'bus', 'go', 'to', 'Lima?'], 0, 'Does'),
    tap('Toca la palabra incorrecta:', ['Nice', 'to', 'meet', 'your.'], 3, 'you.'),
    tap('Toca la palabra incorrecta:', ['Can', 'I', 'get', 'on', 'here,', 'please?'], 3, 'off'),
    tap('Toca la palabra incorrecta:', ['How', 'many', 'is', 'the', 'fare?'], 1, 'much'),
    rebuild('Escucha y reconstruye:', 'Good morning nice to meet you', ['Good', 'morning', 'nice', 'to', 'meet', 'you', 'night', 'evening', 'too', 'meat']),
    rebuild('Escucha y reconstruye:', 'Does this bus go to Miraflores?', ['Does', 'this', 'bus', 'go', 'to', 'Miraflores?', 'Do', 'train', 'from', 'the']),
    rebuild('Escucha y reconstruye:', 'Could you repeat that please?', ['Could', 'you', 'repeat', 'that', 'please?', 'can', 'say', 'again', 'sorry']),
    rebuild('Escucha y reconstruye:', 'See you later take care', ['See', 'you', 'later', 'take', 'care', 'soon', 'letter', 'bye', 'good']),
  ],
};

const microlection8 = {
  id: 'modulo1-8',
  title: 'Microlección 8',
  durationMinutes: 12,
  audioCues: ['Escucha el contenido de la lección.', 'Fíjate en los puntos clave.', 'Ahora vienen tus ejercicios.'],
  contentBlocks: [
    { id: 'modulo8-titulo', type: 'titulo', title: 'El arte de usar bien la lengua', subtitle: 'Pronunciando como se debe', markdown: '' },
    { id: 'modulo8-mision', type: 'mision', markdown: `Entrenar tu oído y tu boca en algunos sonidos clave del inglés que suelen ser difíciles para hispanohablantes. Practicaremos la pronunciación de "th", la diferencia entre b y v, entre ch y sh, y otros sonidos donde a veces metemos la pata, para que empieces a sonar más cool 😎 al hablar.` },
    { id: 'modulo8-intro', type: 'intro', markdown: `¡Hola, hola! 🎤 Soy {{mascot}}, tu coach de pronunciación por hoy. Sabemos que el inglés escrito a veces no suena como se ve. Y para nosotros hispanohablantes, hay ciertos sonidos que son como los "jefes finales" del videojuego de la pronunciación: un poco tricky (complicados) 😅.

No te asustes: con práctica y algunos tips, podrás dominarlos. Vamos a enfocarnos en unos sonidos específicos que, si los pronuncias bien, tu inglés dará un salto de calidad. ¡A calentar la lengua! 👅🔥

(Is-abella y Do-ménica están practicando la pronunciación a tu lado, haciendo muecas graciosas con tal de sacar bien el sonido th. No estás sol@ en esto 😜.)` },
    { id: 'modulo8-sneakpeek', type: 'sneakPeek', markdown: `En esta microlección dominarás los 5 sonidos que más nos cuestan a los hispanohablantes:

**1.** El famoso sonido **"TH"** (lengua entre los dientes).
**2.** La diferencia entre **B** y **V** (sí, en inglés son distintas).
**3.** La terminación **"-ED"** en verbos en pasado (no siempre suena igual).
**4.** **CH** vs **SH** (chocolate vs silencio).
**5.** La **R** gringa (sin vibrar la lengua).

¡Al final serás un verdadero **Domador de la Lengua Gringa**! 🎙️` },
    { id: 'modulo8-teoria-1', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**🛠️ Sonido "TH" – Esa combinación traviesa**

**Thanks**, **Thursday**, **three**... Se saca sacando la lengua un poquito entre los dientes y soplando. Suena como una z suave española o parecido a cuando dices "zzz" con la lengua fuera.

Practica: *"Thank you, Th-th-Thursday, three, thirteen, thirty-three"*.

**Ejemplo:** *Thanks* (gracias) no suena "tanks", sino *zzz*anks o como escribirían los especialistas **θanks**. (El símbolo θ representa el sonido de th con lengua afuera.)`,
      miniQuiz: [
        mc('¿Cómo se pronuncia el "th" de "thanks"?', ['Como una T fuerte: "tanks"', 'Sacando la lengua entre los dientes: "θanks"', 'Como una F: "fanks"', 'Como una S: "sanks"'], 1),
        mc('Para hacer el sonido TH (thanks), la lengua...', ['queda detrás de los dientes', 'sale un poco entre los dientes', 'toca el paladar', 'no se mueve'], 1),
        mc('¿Qué símbolo usan los especialistas para el sonido "th"?', ['θ (theta)', 'φ (phi)', 'δ (delta)', 'ʃ (esh)'], 0),
        mc('¿Cuál es la pronunciación correcta de "three"?', ['"tree" (como T)', '"free" (como F)', '"θree" (lengua entre los dientes)', '"sree" (como S)'], 2),
        mc('Al pronunciar bien el TH de "Thursday", además de sacar la lengua debes...', ['morder fuerte', 'soplar suavemente el aire', 'vibrar la garganta', 'cerrar los labios'], 1),
        tap('Toca la pronunciación INCORRECTA de la palabra:', ['"Thanks"', 'suena', '"tanks".'], 2, '"θanks".'),
        tap('Toca la palabra escrita con el sonido TH MAL imitado:', ['θanks', 'θree', 'fanks', 'θirteen'], 2, 'θanks'),
        rebuild('Escucha y reconstruye:', 'Thanks for three things', ['Thanks', 'for', 'three', 'things', 'tanks', 'tree', 'fanks', 'free']),
      ] },
    { id: 'modulo8-teoria-2', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**🔤 B vs V – En inglés sí se diferencian**

**B:** suena fuerte como "be" – *bus*, *baby*, *Cuba*. (Igual que nuestra B normal).

**V:** suena colocando los dientes superiores sobre el labio inferior y vibrando, una especie de "f" con vibración. *very*, *video*, *love*. (No es exactamente "bery", hay que hacer la vibración).

Practica: **Berry** (baya) vs **Very** (muy). **Boat** vs **Vote**. Siente la vibración en la V.`,
      miniQuiz: [
        mc('¿Cómo se pronuncia la V de "very"?', ['Igual que la B: "bery"', 'Dientes superiores sobre el labio inferior, con vibración', 'Como una F sin vibración', 'Como una P suave'], 1),
        mc('Para hacer el sonido V (very), los dientes superiores...', ['se apoyan sobre el labio inferior', 'muerden la lengua', 'no tocan nada', 'se juntan con los de abajo'], 0),
        mc('¿Qué par de palabras muestra la diferencia entre B y V?', ['Bus / Buzz', 'Baby / Maybe', 'Berry / Very', 'Big / Pig'], 2),
        mc('La B de "baby" se pronuncia...', ['con los dientes en el labio', 'fuerte, igual que la B del español', 'con vibración como la V', 'soplando aire'], 1),
        mc('Si dices "I berry like it" en vez de "very", el error es que...', ['sacaste la lengua', 'pronunciaste la V como una B', 'soplaste de más', 'usaste una F'], 1),
        tap('Toca la pronunciación INCORRECTA de la palabra:', ['"Very"', 'suena', '"bery".'], 2, '"vvvery" (con vibración).'),
        tap('Toca la palabra que se pronuncia con V (no con B):', ['boat', 'baby', 'vote', 'bus'], 2, 'vote'),
        rebuild('Escucha y reconstruye:', 'Very good video', ['Very', 'good', 'video', 'berry', 'boat', 'vote', 'bad', 'bus']),
      ] },
    { id: 'modulo8-teoria-3', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**🔊 "ED" al final de verbos regulares en pasado**

A veces suena /t/, a veces /d/, a veces /ɪd/:

* **I worked** (sonido /t/, suena "workt").
* **I played** (sonido /d/, suena "pleid").
* **I wanted** (sonido /ɪd/, suena "wántid").

> 💡 **Tip:** No siempre pronunciamos "ed" como "ed" completo; depende del sonido anterior. Esto es más avanzado, pero no está de más saberlo.`,
      miniQuiz: [
        mc('¿Cómo suena la terminación "-ed" en "worked"?', ['/d/ como "workd"', '/ɪd/ como "wórked"', '/t/ como "workt"', 'no se pronuncia'], 2),
        mc('¿Cómo suena la terminación "-ed" en "played"?', ['/d/ como "pleid"', '/t/ como "playt"', '/ɪd/ como "pléyed"', '/s/ como "plays"'], 0),
        mc('¿En cuál de estas palabras la "-ed" suena /ɪd/ (una sílaba extra)?', ['played', 'worked', 'wanted', 'loved'], 2),
        mc('¿Cuántos sonidos distintos puede tener la terminación "-ed" del pasado?', ['Uno solo', 'Dos', 'Tres: /t/, /d/ y /ɪd/', 'Cuatro'], 2),
        mc('Decir "wanted" como "want-ed" (con sílaba extra) es...', ['un error grave', 'correcto, porque "wanted" lleva /ɪd/', 'incorrecto, debería sonar /t/', 'incorrecto, debería sonar /d/'], 1),
        tap('Toca la pronunciación INCORRECTA de la palabra:', ['"Worked"', 'suena', '"work-ed".'], 2, '"workt" (sonido /t/).'),
        tap('Toca la palabra cuya "-ed" suena /ɪd/ (sílaba extra), distinta de las demás:', ['worked', 'played', 'wanted', 'loved'], 2, 'wanted'),
        rebuild('Escucha y reconstruye:', 'I worked and played yesterday', ['I', 'worked', 'and', 'played', 'yesterday', 'wanted', 'walked', 'today', 'we']),
      ] },
    { id: 'modulo8-teoria-4', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**🍫 CH vs SH – Diferencia sutil**

**CH:** como "ch" en "chocolate". Fuerte y con un pequeño golpe. *Chile*, *beach*.

**SH:** es un sonido continuado, como pedir silencio "shhh". *she*, *ocean*.

Practica: **cheap** (barato, "ch") vs **sheep** (oveja, "sh"). **Chip** vs **Ship**. ¿Sientes la diferencia?`,
      miniQuiz: [
        mc('¿Cuál palabra tiene sonido SH (como pedir silencio "shhh")?', ['chip', 'chocolate', 'ship', 'cheap'], 2),
        mc('El sonido CH (chocolate) se produce con...', ['un sonido continuo como "shhh"', 'un pequeño golpe fuerte', 'los dientes sobre el labio', 'la lengua entre los dientes'], 1),
        mc('"Cheap" (barato) y "sheep" (oveja) se diferencian en...', ['la vocal', 'el sonido inicial: CH con golpe vs SH continuo', 'nada, suenan igual', 'el acento'], 1),
        mc('El sonido SH es...', ['un golpe seco', 'un sonido continuo, como pedir silencio', 'una S normal', 'igual que la CH'], 1),
        mc('Si quieres decir "ship" (barco) pero te sale "chip", el error es que...', ['usaste SH en vez de CH', 'usaste CH (con golpe) en vez de SH (continuo)', 'cambiaste la vocal', 'sacaste la lengua'], 1),
        tap('Toca la palabra con sonido SH (no CH):', ['chip', 'chocolate', 'cheap', 'ship'], 3, 'ship'),
        tap('Toca la palabra con sonido CH (no SH):', ['she', 'ship', 'cheap', 'sheep'], 2, 'cheap'),
        rebuild('Escucha y reconstruye:', 'She sells cheap ships', ['She', 'sells', 'cheap', 'ships', 'chips', 'sheep', 'beach', 'fish']),
      ] },
    { id: 'modulo8-teoria-5', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**🗣️ R en inglés – No es nuestra R**

No es ni nuestra R fuerte ni débil. Es más suave, con la lengua sin vibrar, casi en la garganta.

**Red**, **run**, **arrive**. Intenta decir una R sin hacer "rrr" vibrante. Es como un sonido entre la R y una "sch". Piensa en cómo un gringo dice "pero" – suena diferente.

> 💡 Otros sonidos clave son la **L** en final de palabra (*call*, *people*), la **T** glotal a veces (*water* a lo gringo suena "uárer"), pero por ahora nos centraremos en la R.`,
      miniQuiz: [
        mc('La R en inglés ("red") se pronuncia...', ['vibrando la lengua como en "rr" español', 'sin vibrar, suave, desde más atrás', 'igual que en español', 'como una L'], 1),
        mc('Para la R gringa, la lengua...', ['vibra contra el paladar', 'no vibra; el sonido viene de atrás', 'toca los dientes', 'sale entre los dientes'], 1),
        mc('Si pronuncias "red" con la "rr" fuerte del español, suena...', ['perfecto, igual que un gringo', 'demasiado vibrante, no es la R inglesa', 'como una L', 'como TH'], 1),
        mc('¿Cuál es la clave de la R inglesa de "run"?', ['hacerla bien vibrante', 'es suave y no vibra la lengua', 'pronunciarla como una D', 'sacar la lengua'], 1),
        mc('La R inglesa se parece más a...', ['la "rr" de "perro"', 'un sonido suave, casi entre R y "sch"', 'una T', 'una V'], 1),
        tap('Toca la pronunciación INCORRECTA de la frase:', ['La', 'R', 'en', '"red"', 'vibra.'], 4, 'no vibra.'),
        tap('Toca la palabra que NO lleva el sonido de la R inglesa:', ['red', 'run', 'love', 'arrive'], 2, 'love'),
        rebuild('Escucha y reconstruye:', 'Red car runs really fast', ['Red', 'car', 'runs', 'really', 'fast', 'blue', 'walks', 'very', 'slow']),
      ] },
    { id: 'modulo8-resumen', type: 'resumen', markdown: `## **🎯 Resumen práctico que debes recordar**

* ✅ **TH:** Saca la lengua entre los dientes y sopla. *Thanks* = θanks, no "tanks".
* ✅ **B vs V:** La V se hace con dientes en labio inferior + vibración. *Very* ≠ *Berry*.
* ✅ **-ED:** Tres sonidos posibles: /t/ (worked), /d/ (played), /ɪd/ (wanted).
* ✅ **CH vs SH:** CH es golpe fuerte (chip), SH es continuo como "shhh" (ship).
* ✅ **R gringa:** Sin vibrar la lengua, sonido suave desde la garganta.

¡La pronunciación mejora con la práctica diaria! Imita, repite, canta. 🎶` },
    { id: 'modulo8-cierre', type: 'cierre', markdown: `#### **🌟 Cierre**

¡Felicidades! 🥳 Has enfrentado a los "jefes" de la pronunciación y ya sabes sus trucos secretos. Ahora, cuando escuches inglés, presta atención a esos detalles: ¿sacan la lengua para thanks?, ¿muerden el labio en very?, ¿cómo suena la R gringa?

Diviértete con el idioma, juega con los sonidos. Ya no son enemigos, ¡son desafíos superados! Si alguna vez dices "I berry berry like English" en lugar de "very very", al menos sabrás reírte y corregirlo en el momento.

Recuerda: la pronunciación es como bailar, al inicio piensas cada paso, luego ya sale natural. 💃🕺 Keep practicing!

✅ **Misión cumplida:** Tus oídos y tu pronunciación están a otro nivel. La próxima vez que digas "three very big ships" te saldrá más auténtico.

**🏅 Insignia obtenida:** ✨ *Domador de la Lengua Gringa* (has conquistado los Sounds of English) 🎙️🎖️` },
  ],
  quizQuestions: [
    mc('¿Cómo se pronuncia el "th" de "three"?', ['Como una T: "tree"', 'Como una F: "free"', 'Sacando la lengua entre los dientes: "θree"', 'Como una S: "sree"'], 2),
    mc('La V de "very" se pronuncia...', ['igual que la B: "bery"', 'con los dientes superiores sobre el labio inferior y vibración', 'como una F sin vibración', 'como una P'], 1),
    mc('¿En cuál palabra la terminación "-ed" suena /ɪd/ (sílaba extra)?', ['wanted', 'played', 'worked', 'loved'], 0),
    mc('El sonido SH (como "shhh") es...', ['un golpe fuerte', 'un sonido continuo', 'una S normal', 'igual que CH'], 1),
    mc('La R inglesa de "red" se pronuncia...', ['vibrando la lengua como "rr"', 'suave, sin vibrar, desde más atrás', 'igual que en español', 'como una L'], 1),
    mc('Para el sonido TH de "thanks", la lengua...', ['queda detrás de los dientes', 'toca el paladar', 'sale un poco entre los dientes', 'no se mueve'], 2),
    tap('Toca la pronunciación INCORRECTA de la palabra:', ['"Thanks"', 'suena', '"tanks".'], 2, '"θanks".'),
    tap('Toca la pronunciación INCORRECTA de la palabra:', ['"Very"', 'suena', '"bery".'], 2, '"vvvery" (con vibración).'),
    tap('Toca la palabra con sonido SH (no CH):', ['chip', 'cheap', 'chocolate', 'ship'], 3, 'ship'),
    tap('Toca la palabra cuya "-ed" suena /ɪd/ (sílaba extra):', ['worked', 'played', 'wanted', 'loved'], 2, 'wanted'),
    tap('Toca la pronunciación INCORRECTA de la frase:', ['La', 'R', 'en', '"red"', 'vibra.'], 4, 'no vibra.'),
    rebuild('Escucha y reconstruye:', 'Thank you very much', ['Thank', 'you', 'very', 'much', 'tanks', 'berry', 'so', 'a']),
    rebuild('Escucha y reconstruye:', 'She sells cheap chips', ['She', 'sells', 'cheap', 'chips', 'ships', 'sheep', 'beach', 'fish']),
    rebuild('Escucha y reconstruye:', 'I worked and played yesterday', ['I', 'worked', 'and', 'played', 'yesterday', 'wanted', 'walked', 'today']),
    rebuild('Escucha y reconstruye:', 'Three very big red ships', ['Three', 'very', 'big', 'red', 'ships', 'tree', 'berry', 'chips', 'blue']),
  ],
};

const microlection9 = {
  id: 'modulo1-9',
  title: 'Microlección 9',
  durationMinutes: 15,
  audioCues: ['Escucha el contenido de la lección.', 'Fíjate en los puntos clave.', 'Ahora vienen tus ejercicios.'],
  contentBlocks: [
    { id: 'modulo9-titulo', type: 'titulo', title: 'Mini Simulacro A1', subtitle: 'Evaluación Final del Módulo 1', markdown: '' },
    { id: 'modulo9-mision', type: 'mision', markdown: `¡Llegaste al gran momento! 📋✨ En este simulacro de fin de módulo pondrás a prueba todo lo aprendido. {{mascot}}, Is-abella y Do-ménica están aquí contigo, ¡animándote desde la primera fila! 🤖🎉` },
    { id: 'modulo9-intro', type: 'intro', markdown: `Este mini examen recopila puntos clave de todas las microlecciones anteriores (presentaciones, rutinas, ubicaciones, preguntas, vocabulario básico, pronunciación). Te ayudará a medir cuánto has avanzado. Encontrarás preguntas de opción múltiple y pequeñas traducciones.

**Consejos antes de empezar:**

* Lee con calma cada pregunta. Identifica qué te pide: ¿traducción?, ¿escoger la forma correcta?, ¿responder algo?
* Recuerda las reglas que aprendiste: tercera persona lleva -s (ESE patita), usamos do/does para preguntas en presente (excepto con to be), to be para ser/estar, artículos a/an para uno solo, etc.
* Si fallas alguna, no te preocupes: cada error es una oportunidad para repasar. Te daremos la respuesta correcta y una breve explicación para reforzar ese punto.

Respira profundo, suéltate y... good luck! 🍀📚 Sabemos que lo harás genial. Al final de este simulacro te espera un merecido reconocimiento. 🎖️` },
    { id: 'modulo9-sneakpeek', type: 'sneakPeek', markdown: `Antes de lanzarte al simulacro final, repasemos brevemente los temas clave que cubrimos en el módulo:

**1.** **To Be** – ser/estar (I am, she is, they are).
**2.** **Presente Simple** – rutinas y acciones (I work, she studies).
**3.** **There is/are** – "hay" en inglés + artículos.
**4.** **Preguntas WH** – Who, What, Where, When, Why, How.
**5.** **Pronunciación y cortesía** – sonidos clave y frases de supervivencia.

¡Cada sección tiene un mini repaso con quiz para que llegues al simulacro final con todo fresco! 💪` },
    { id: 'modulo9-teoria-1', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**Repaso: To Be (ser/estar)**

Recuerda las conjugaciones clave:
* **I am** – Yo soy/estoy
* **You are** – Tú eres/estás
* **He/She/It is** – Él/Ella/Eso es/está
* **We/They are** – Nosotros/Ellos son/están

> 💡 En inglés, la edad se dice con **to be**: "I **am** 20 years old" (no "I have 20").`,
      miniQuiz: [
        mc('"Ella es de Perú." She ___ from Peru.', ['am', 'are', 'is', 'be'], 2),
        mc('"Ellos están cansados." They ___ tired.', ['are', 'is', 'am', 'be'], 0),
        mc('"Tengo 25 años." en inglés es:', ['I have 25 years.', 'I am 25 years old.', 'I am 25 years.', 'I do 25 years old.'], 1),
        mc('Completa: "I ___ a student and he ___ a teacher."', ['am / is', 'is / am', 'are / is', 'am / are'], 0),
        mc('¿Cuál usa to be correctamente con la edad?', ['She has 30 years old.', 'She is 30 years old.', 'She are 30 years.', 'She have 30 years.'], 1),
        tap('Toca la palabra incorrecta:', ['She', 'is', 'tired', 'and', 'they', 'is', 'happy.'], 5, 'are'),
        tap('Toca la palabra incorrecta:', ['I', 'are', 'a', 'doctor', 'and', 'you', 'are', 'a', 'nurse.'], 1, 'am'),
        rebuild('Escucha y reconstruye:', 'She is at home right now', ['She', 'is', 'at', 'home', 'right', 'now', 'are', 'am', 'he', 'the']),
      ] },
    { id: 'modulo9-teoria-2', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**Repaso: Presente Simple**

* **I/You/We/They** + verbo sin cambio: *I study*, *They play*.
* **He/She/It** + verbo con **-s/-es**: *She studies*, *He goes*.

> 💡 Recuerda a ESE patita: si hablas de él, ella o eso → **agrega -S** al verbo.`,
      miniQuiz: [
        mc('"Yo nunca como carne."', ['I never eats meat.', 'I never eat meat.', 'I never eating meat.', 'I never to eat meat.'], 1),
        mc('"Ella estudia medicina."', ['She study medicine.', 'She studys medicine.', 'She studies medicine.', 'She studying medicine.'], 2),
        mc('"Él va al trabajo en bus."', ['He go to work by bus.', 'He goes to work by bus.', 'He gos to work by bus.', 'He going to work by bus.'], 1),
        mc('¿Cuál oración lleva -s en el verbo correctamente?', ['They works every day.', 'I works every day.', 'He work every day.', 'She works every day.'], 3),
        mc('Completa: "My brother ___ English and I ___ Spanish."', ['speak / speaks', 'speaks / speak', 'speaks / speaks', 'speak / speak'], 1),
        tap('Toca la palabra incorrecta:', ['My', 'friends', 'study', 'English', 'and', 'she', 'study', 'too.'], 6, 'studies'),
        tap('Toca la palabra incorrecta:', ['He', 'goes', 'to', 'school', 'but', 'they', 'goes', 'home.'], 6, 'go'),
        rebuild('Escucha y reconstruye:', 'She studies English every day', ['She', 'studies', 'English', 'every', 'day', 'study', 'he', 'studys', 'speaks', 'the']),
      ] },
    { id: 'modulo9-teoria-3', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**Repaso: There is / There are**

* **There is** + singular: *There is a book on the table.*
* **There are** + plural: *There are two books on the table.*

> 💡 "Hay" en inglés cambia según si es uno solo o varios.`,
      miniQuiz: [
        mc('"Hay dos libros en la mesa."', ['There is two books on the table.', 'There are two books on the table.', 'There have two books on the table.', 'There be two books on the table.'], 1),
        mc('"Hay un gato en la casa."', ['There are a cat in the house.', 'There is a cat in the house.', 'There have a cat in the house.', 'There a cat in the house.'], 1),
        mc('Completa: "___ three chairs in the room."', ['There is', 'There are', 'There be', 'There has'], 1),
        mc('¿Cuál usa correctamente "There is"?', ['There is many people here.', 'There is a dog in the garden.', 'There is two cars outside.', 'There is some apples.'], 1),
        mc('"No hay leche en la nevera."', ['There are no milk in the fridge.', 'There is no milk in the fridge.', 'There have no milk in the fridge.', 'There no milk in the fridge.'], 1),
        tap('Toca la palabra incorrecta:', ['There', 'is', 'a', 'book', 'and', 'there', 'is', 'two', 'pens.'], 6, 'are'),
        tap('Toca la palabra incorrecta:', ['There', 'are', 'three', 'dogs', 'and', 'there', 'are', 'one', 'cat.'], 6, 'is'),
        rebuild('Escucha y reconstruye:', 'There are two books on the table', ['There', 'are', 'two', 'books', 'on', 'the', 'table', 'is', 'a', 'three', 'in']),
      ] },
    { id: 'modulo9-teoria-4', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**Repaso: Preguntas WH**

La fórmula para preguntas:
* **Con to be:** Wh- + **is/are** + sujeto? → *What is your name?*
* **Con otros verbos:** Wh- + **do/does** + sujeto + verbo? → *Where do you work?*

> 💡 Recuerda: con **he/she/it** usamos **does** (y el verbo SIN -s): *Where does he work?* (no "works").`,
      miniQuiz: [
        mc('¿Cuál es la pregunta correcta para "My name is Carlos"?', ['How is your name?', 'What is your name?', 'Who is your name?', 'Where is your name?'], 1),
        mc('"¿Dónde trabajas?" (a tu amigo)', ['Where are you work?', 'Where you work?', 'Where do you work?', 'Where does you work?'], 2),
        mc('"¿Dónde trabaja él?"', ['Where do he work?', 'Where does he work?', 'Where does he works?', 'Where he works?'], 1),
        mc('¿Cuál pregunta WH es correcta con he/she?', ['What does she studies?', 'What do she study?', 'What does she study?', 'What is she study?'], 2),
        mc('Completa: "___ do you live?" (preguntando el lugar)', ['Who', 'Where', 'What', 'When'], 1),
        tap('Toca la palabra incorrecta:', ['Where', 'does', 'he', 'work', 'and', 'what', 'do', 'he', 'do?'], 6, 'does'),
        tap('Toca la palabra incorrecta:', ['What', 'does', 'she', 'studies', 'at', 'the', 'university?'], 3, 'study'),
        rebuild('Escucha y reconstruye:', 'Where does he work every day', ['Where', 'does', 'he', 'work', 'every', 'day', 'do', 'she', 'works', 'is']),
      ] },
    { id: 'modulo9-teoria-5', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**Repaso: Pronunciación y Cortesía**

* **TH** en "thanks" lengua entre dientes, suena **θanks** (no "tanks").
* **Please / Thank you / Excuse me** → tus palabras mágicas de cortesía.
* **Could you... please?** → la forma educada de pedir algo.

> 💡 La cortesía abre puertas. Un "please" y un "thank you" hacen maravillas.`,
      miniQuiz: [
        mc('¿Cómo se pronuncia "thanks" correctamente?', ['/tanks/', '/θanks/ (lengua entre dientes)', '/fanks/', '/sanks/'], 1),
        mc('¿Cuál es la forma educada de pedir algo?', ['Give me water.', 'Water now.', 'Could you give me water, please?', 'You water me.'], 2),
        mc('Alguien te ayuda. ¿Qué dices?', ['Excuse me.', 'Thank you.', 'Please.', 'Sorry.'], 1),
        mc('Quieres pasar entre la gente. Dices:', ['Thank you.', 'Please.', 'Excuse me.', 'You are welcome.'], 2),
        mc('¿Cuál palabra empieza con el sonido θ (TH, lengua entre dientes)?', ['tank', 'sank', 'thank', 'rank'], 2),
        tap('Toca la palabra incorrecta:', ['We', 'say', 'please', 'and', 'we', 'say', 'tanks', 'too.'], 6, 'thanks'),
        tap('Toca la palabra incorrecta:', ['Could', 'you', 'help', 'me', 'tanks?'], 4, 'please?'),
        rebuild('Escucha y reconstruye:', 'Could you help me please', ['Could', 'you', 'help', 'me', 'please', 'can', 'do', 'sorry', 'excuse', 'thanks']),
      ] },
    { id: 'modulo9-resumen', type: 'resumen', markdown: `## **🎯 ¡Estás listo para el simulacro!**

Has repasado los 5 pilares del Módulo 1:

* ✅ **To Be** – I am, She is, They are.
* ✅ **Presente Simple** – I work, She studies (ESE patita lleva -S).
* ✅ **There is/are** – Singular vs plural.
* ✅ **Preguntas WH** – What, Where, Who + do/does o is/are.
* ✅ **Pronunciación y Cortesía** – θanks, please, excuse me.

Ahora sí, ¡a por el simulacro final! 🚀` },
    { id: 'modulo9-cierre', type: 'cierre', markdown: `#### **🌟 Cierre del Módulo 1**

¡Enhorabuena! 🎉 Has completado el módulo 1 de AprendoEnglish.

Mira hacia atrás un momento: en este módulo aprendiste a presentarte, describir tu rutina diaria, hablar de lugares, hacer preguntas clave, usar vocabulario esencial y hasta a pronunciar mejor ciertos sonidos. ¡Eso es un montón de progreso! 🤩 Cada rato que aprovechaste estudiando te trajo hasta aquí.

Ahora, {{mascot}}, Is-abella, Do-ménica y todo el equipo de AprendoEnglish te otorgamos la ¡Insignia Final de Módulo 1! 🏅

Has ganado el ✨ **Certificado Interno AprendoEnglish – Nivel A1**.

¿Qué sigue? El nivel A2 aguarda con nuevos desafíos (¡como hablar en pasado y futuro!). Pero por hoy, celebra tu logro. Tómate una selfie mental con {{mascot}} y nuestras agentes secretas y di "I did it!" 🥳📸.

¡Nos vemos en el siguiente tramo de aprendizaje, {{audience}}! 💙 Sigue así, que tu camino hacia el inglés avanzado ya empezó con el pie derecho.

**🏅 Insignia obtenida:** ✨ *Certificado AprendoEnglish A1* – Has completado el Módulo 1 🎖️🏆` },
  ],
  quizQuestions: [
    mc('"Ella ___ de Perú." (usa to be)', ['am', 'are', 'is', 'be'], 2),
    mc('Completa: "___ name is John and ___ 20 years old."', ['My / I am', 'Me / I have', 'Mine / I do', 'My / I have'], 0),
    mc('"Yo nunca como carne."', ['I never eats meat.', 'I never eat meat.', 'I never eating meat.', 'I never to eat meat.'], 1),
    mc('"Hay dos libros en la mesa."', ['There is two books on the table.', 'There are two books on the table.', 'There have two books on the table.', 'There be two books on the table.'], 1),
    mc('"¿Dónde trabaja él?"', ['Where do he work?', 'Where does he work?', 'Where does he works?', 'Where he works?'], 1),
    mc('¿Cómo se pronuncia "thanks" correctamente?', ['/tanks/', '/sanks/', '/θanks/ (lengua entre dientes)', '/fanks/'], 2),
    tap('Toca la palabra incorrecta:', ['She', 'is', 'from', 'Peru', 'and', 'they', 'is', 'from', 'Chile.'], 6, 'are'),
    tap('Toca la palabra incorrecta:', ['My', 'friends', 'study', 'English', 'and', 'she', 'study', 'too.'], 6, 'studies'),
    tap('Toca la palabra incorrecta:', ['There', 'is', 'a', 'chair', 'and', 'there', 'is', 'two', 'tables.'], 6, 'are'),
    tap('Toca la palabra incorrecta:', ['Where', 'do', 'you', 'work', 'and', 'where', 'do', 'he', 'work?'], 6, 'does'),
    tap('Toca la palabra incorrecta:', ['We', 'say', 'please', 'and', 'we', 'say', 'tanks.'], 6, 'thanks'),
    rebuild('Escucha y reconstruye:', 'My name is John and I am twenty', ['My', 'name', 'is', 'John', 'and', 'I', 'am', 'twenty', 'have', 'your', 'he', 'are']),
    rebuild('Escucha y reconstruye:', 'There are two books on the table', ['There', 'are', 'two', 'books', 'on', 'the', 'table', 'is', 'a', 'three', 'in']),
    rebuild('Escucha y reconstruye:', 'Where does he work every day', ['Where', 'does', 'he', 'work', 'every', 'day', 'do', 'she', 'works', 'live']),
    rebuild('Escucha y reconstruye:', 'She studies Spanish and works here', ['She', 'studies', 'Spanish', 'and', 'works', 'here', 'study', 'he', 'work', 'English']),
  ],
};

const microlection10 = {
  id: 'modulo1-10',
  title: 'Microlección Extra',
  durationMinutes: 15,
  audioCues: ['Escucha el contenido de la lección.', 'Fíjate en los puntos clave.', 'Ahora vienen tus ejercicios.'],
  contentBlocks: [
    { id: 'modulo10-titulo', type: 'titulo', title: 'Bricher@ Bilingüe', subtitle: 'Coqueteando como un Pro en Inglés', markdown: '' },
    { id: 'modulo10-mision', type: 'mision', markdown: `Aprender a flirtear con naturalidad, respeto y "flow" en inglés, usando frases auténticas, preguntas casuales y un toque de humor cultural. Este módulo te da herramientas para entablar conversaciones con potencial romántico — o simplemente romper el hielo con confianza — ya sea con angloparlantes nativos o ese gring@ limeñ@ de intercambio que te llama la atención 😉.

Al final, si completas todos los retos y quizzes, recibirás un título especial:

🏅 **Certificación Honoraria: Bricher@ Bilingüe – Nivel 1.**

("Brichero/a" en jerga peruana se refiere a la persona que coquetea con turistas o extranjeros. Aquí lo usamos en plan divertido, ¡sin estereotipos ofensivos, solo buena onda y práctica real!)` },
    { id: 'modulo10-intro', type: 'intro', markdown: `Hi there! Soy {{mascot}} 💘, tu wingman salvaje. En esta microlección extra nos ponemos en modo conquistador@. Vamos a aprender frases y expresiones útiles para coquetear en inglés con humor y claridad, sin pasarnos de confianzudos.

Y porque no podía ser de otra forma, nos acompañan nuestras agentes secretas favoritas: **Is-abella** y **Do-ménica** 😎. Ellas te soplarán cómo hablar de ti con seguridad (Is-abella, *I am...*) y cómo hacer buenas preguntas sin sonar robot ni stalker (Do-ménica, *Do you ...?*).

El plan: te daremos **icebreakers** (frases para iniciar conversación), **cumplidos** que no dan cringe, **preguntas casuales**, y hasta cómo usar referencias de **memes o música** para conectar. Al final, pondremos todo junto en un mini juego de simulación social para que practiques tus encantos bilingües. ¡Let's flirt... I mean, let's start! 😏💕` },
    { id: 'modulo10-sneakpeek', type: 'sneakPeek', markdown: `En esta microlección dominarás el arte de la conversación social en inglés:

**1.** **Icebreakers** – Frases para romper el hielo con estilo.
**2.** **Preguntas casuales** – Sin parecer stalker 😅.
**3.** **Halagos** – Cumplidos que no dan cringe.
**4.** **Memes, música y emojis** – Conexión cultural moderna.
**5.** **Invitar, rechazar y salir** – Con elegancia y respeto.
**6.** **Simulacro Social** – ¡Ponlo en práctica!

¡Al final serás un verdadero **Bricher@ Bilingüe**! 💘` },
    { id: 'modulo10-teoria-1', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**🛠️ 1. Icebreakers con Flow**

Comenzar una conversación es la mitad de la batalla. Aquí tienes algunas frases rompehielo:

* **"Hi, I'm not from here... what about you?"** – Hola, no soy de aquí... ¿y tú? *(Is-abella tip: Usa I'm para presentarte rápidamente.)*

* **"Is this seat taken?"** – ¿Está ocupado este asiento? *(Clásica y educada. Sonríe al decirla 😇.)*

* **"Nice ____!"** – ¡Qué ____ tan chévere! Completa con algo que notes: "Nice jacket!", "Nice tattoo, what does it mean?" *(Muestra interés genuino.)*

* **"I like the vibe here, mind if I join?"** – Me gusta la onda aquí, ¿te molesta si me sumo? *(Vibe = onda/ambiente.)*

> 💡 El tono y la sonrisa cuentan. Un "Is this seat taken?" amable abre puertas. Entiende la respuesta: "Sure, go ahead" = sí, adelante; "Actually, I'm waiting for someone" = mejor no.`,
      miniQuiz: [
        mc('Estás en un café, hay una silla libre junto a alguien. ¿Qué dices para sentarte con educación?', ['Is this seat taken?', 'Move, I need this seat.', 'You. Sit. Me. Here.', 'Give me that chair.'], 0),
        mc('Notas la chaqueta de alguien y quieres romper el hielo. ¿Cuál es la mejor opción?', ['Take off that jacket.', 'Why are you wearing that?', "Nice jacket! Where's it from?", 'Your jacket is ugly.'], 2),
        mc('Te gusta el ambiente del lugar y quieres unirte al grupo. ¿Qué dices?', ["I'm sitting here whether you like it or not.", 'I like the vibe here, mind if I join?', 'Let me in, now.', "Move over, I'm joining."], 1),
        mc("Preguntas \"Is this seat taken?\" y responden \"Actually, I'm waiting for someone.\" ¿Qué significa?", ['Adelante, siéntate', 'Está esperando a alguien, mejor busca otro sitio', 'Quiere que te quedes', 'No entiende tu pregunta'], 1),
        mc('En "I like the vibe here", ¿qué significa "vibe"?', ['La cuenta', 'La onda / el ambiente', 'La música a todo volumen', 'La salida'], 1),
        tap('Toca la palabra incorrecta:', ['Is', 'this', 'seat', 'took?'], 3, 'taken?'),
        tap('Toca la opción grosera; debería ser educada:', ['Move,', 'I', 'need', 'this', 'seat.'], 0, 'Is this seat taken?'),
        rebuild('Escucha y reconstruye:', 'Is this seat taken', ['Is', 'this', 'seat', 'taken', 'sit', 'your', 'free', 'place', 'the']),
      ] },
    { id: 'modulo10-teoria-2', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**🛠️ 2. Preguntas casuales (sin parecer stalker 😅)**

Ya rompiste el hielo, ahora ¿de qué hablas? Manténlas ligeras:

* **"Where are you from?"** – ¿De dónde eres? *(Mejor que "Where do you live?" al inicio.)*

* **"What do you do for fun?"** – ¿Qué haces para divertirte? *(Más interesante que "¿Qué estudias?")*

* **"Do you come here often?"** – ¿Vienes seguido por aquí? *(Un clásico de clásicos 😜, úsalo con tono ligero.)*

* **"Who are you here with?"** – ¿Con quién has venido? *(Para saber si está acompañad@ sin preguntar "¿Tienes pareja?")*

* **"Have you tried the [drink/food] here?"** – ¿Has probado la [bebida/comida] de aquí?

> 💡 Do-ménica recuerda: usa **do/does** para preguntar acciones y **have** en "Have you tried...?". Evita preguntas demasiado personales de inmediato (edad, dirección, ingresos 😆).`,
      miniQuiz: [
        mc('Llevas 5 minutos conversando. ¿Cuál pregunta es MÁS apropiada y ligera?', ['Where do you live exactly?', 'How much money do you make?', 'What do you do for fun?', "What's your home address?"], 2),
        mc('Quieres saber si vino acompañad@ sin preguntar directamente "¿tienes pareja?". ¿Qué dices?', ['Do you have a boyfriend?', 'Who are you here with?', 'Are you single?', "Where's your partner?"], 1),
        mc('Quieres recomendar la bebida del lugar y conocer su gusto. ¿Cuál es la forma correcta?', ['Have you tried the lemonade here?', 'Did you tried the lemonade here?', 'Do you tried the lemonade here?', 'You tried lemonade?'], 0),
        mc('Quieres saber sus intereses sin sonar a entrevista de trabajo. ¿Cuál es mejor?', ["What's your salary?", 'What do you do for fun?', 'What do you study and why?', 'How old are you?'], 1),
        mc('En "What do you do for fun?", la primera palabra "do" sirve para...', ['formar la pregunta (auxiliar)', 'decir "hacer" dos veces seguidas por error', 'saludar', 'negar la acción'], 0),
        tap('Toca la palabra incorrecta:', ['Where', 'do', 'you', 'from?'], 1, 'are'),
        tap('Toca la palabra incorrecta:', ['What', 'do', 'you', 'do', 'for', 'funs?'], 5, 'fun?'),
        rebuild('Escucha y reconstruye:', 'Where are you from', ['Where', 'are', 'you', 'from', 'do', 'live', 'come', 'here', 'how']),
      ] },
    { id: 'modulo10-teoria-3', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**🛠️ 3. Halagos que no dan cringe**

Un cumplido bien dicho puede subir la química, pero debe ser respetuoso y auténtico:

* **"You have a great laugh."** – Tienes una risa genial. *(Muestra que disfrutas conversando.)*

* **"I love your accent."** – Me encanta tu acento. *(Solo si suena genuino, no como burla.)*

* **"You're really easy to talk to."** – Eres muy fácil de conversar. *(¡Halago a su personalidad!)*

* **"You speak Spanish better than I speak English!"** – ¡Hablas español mejor de lo que yo hablo inglés! *(Auto-humillarte un poco para hacerlo reír.)*

* **"I like your vibe, it's chill."** – Me gusta tu vibra, es tranquila. *(Vibe = vibra, chill = relajada.)*

> 💡 Evita cumplidos muy físicos de entrada. Destaca algo particular y real. Nada vulgar u obvio – eso sí da cringe, or worse, ofende.`,
      miniQuiz: [
        mc('Acabas de conocer a alguien. ¿Cuál cumplido es MÁS apropiado y no da cringe?', ['Nice body!', "You're really easy to talk to.", 'You look hot.', 'Give me a kiss.'], 1),
        mc('Quieres halagar su forma de hablar de manera genuina. ¿Qué dices?', ['You talk too much.', 'I love your accent.', 'Your accent is funny, ha!', 'Why do you sound like that?'], 1),
        mc('Disfrutaste la conversación y quieres decírselo. ¿Cuál es el mejor cumplido?', ['You have a great laugh.', 'Your laugh is annoying.', 'Stop laughing so loud.', "You're so loud."], 0),
        mc("En \"I like your vibe, it's chill\", ¿qué significa \"chill\"?", ['Frío / helado', 'Relajada / tranquila', 'Aburrida', 'Nerviosa'], 1),
        mc('¿Cuál de estos cumplidos es el MENOS apropiado al recién conocer a alguien?', ["You're easy to talk to.", 'You have a great laugh.', 'Nice body!', 'I love your accent.'], 2),
        tap('Toca la palabra incorrecta:', ['You', 'have', 'a', 'great', 'laughs.'], 4, 'laugh.'),
        tap('Toca la palabra que hace este cumplido vulgar; debería destacar la personalidad:', ['You', 'have', 'a', 'great', 'body.'], 4, 'laugh.'),
        rebuild('Escucha y reconstruye:', 'You have a great laugh', ['You', 'have', 'a', 'great', 'laugh', 'are', 'smile', 'good', 'nice', 'really']),
      ] },
    { id: 'modulo10-teoria-4', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**🛠️ 4. Coqueteo con memes, música y emojis**

Una forma moderna de conectar es a través de referencias culturales:

* **Memes:** "Have you seen that meme where...?" – ¿Has visto ese meme donde…? Un meme bien traído puede hacerlos reír juntos.

* **Música:** "Do you like salsa? I can teach you some moves 😏." – ¿Te gusta la salsa? Puedo enseñarte unos pasos.

* **Series/Películas:** "Have you watched [serie]?" – ¿Has visto X? Discutan su parte favorita o propongan verla juntos.

* **Emojis y chat:** Un 😜 o 😏 en el contexto correcto transmite picardía sin palabras. Pero ojo, ¡no saturar de emojis de corazón de una! ❤️😂

> 💡 *Is-abella comenta: usar referencias que ambos entiendan es como tener un chiste interno al instante. Crea complicidad.* Adáptate al tipo de persona.`,
      miniQuiz: [
        mc('Quieres seguir la conversación por chat después de conocer a alguien. ¿Qué haces?', ['Mandar 50 emojis de corazón ❤️❤️❤️', 'Compartir un meme gracioso sobre algo que hablaron', 'No escribir nunca y esperar que te escriba', 'Mandar solo "hola" cada hora'], 1),
        mc('En "I can teach you some moves", ¿qué significa "moves"?', ['Mudanzas', 'Pasos / movimientos (de baile)', 'Películas', 'Mensajes'], 1),
        mc('Quieres invitar a ver una serie juntos. ¿Cuál es la forma correcta?', ['Have you watched that new series?', 'Do you watched that new series?', 'Did you watch series the new?', 'You watch series new?'], 0),
        mc('Quieres conectar a través de la música. ¿Cuál suena natural y ligero?', ['Dance with me right now.', 'Do you like salsa? I can teach you some moves 😏', 'You must learn salsa.', 'Salsa is the only good music.'], 1),
        mc('Según la lección, ¿para qué sirve usar referencias culturales que ambos entienden?', ['Para presumir cuánto sabes', 'Para crear complicidad, como un chiste interno', 'Para terminar la conversación rápido', 'Para evitar hablar'], 1),
        tap('Toca la palabra incorrecta:', ['Have', 'you', 'watch', 'that', 'series?'], 2, 'watched'),
        tap('Toca la palabra incorrecta:', ['Do', 'you', 'likes', 'salsa?'], 2, 'like'),
        rebuild('Escucha y reconstruye:', 'Have you watched that new series', ['Have', 'you', 'watched', 'that', 'new', 'series', 'seen', 'the', 'old', 'movie', 'do']),
      ] },
    { id: 'modulo10-teoria-5', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**🛠️ 5. No roche: Cómo invitar, rechazar o salir elegantemente**

**Para invitar:**
* **"Wanna grab a coffee sometime?"** – ¿Quieres tomar un café algún día? *(Wanna = want to. Casual, sin presión.)*
* **"There's this great burger place nearby, shall we go?"** – Hay una hamburguesería genial cerca, ¿vamos?

**Para seguir en contacto:**
* **"Are you on Instagram?"** – ¿Tienes Instagram?
* **"Can I get your number?"** – ¿Me pasas tu número?

**Para rechazar educadamente:**
* **"I'm flattered, but I'm seeing someone."** – Me halagas, pero estoy saliendo con alguien.
* **"You're very nice, but I have to go."** – Eres muy amable, pero tengo que irme.
* **"Let's just be friends."** – Quedemos como amigos nomás.

**Para despedirte dejando puerta abierta:**
* **"I gotta go, but it was great meeting you!"** – Me tengo que ir, ¡pero fue genial conocerte!
* **"Text me later!"** – ¡Escríbeme luego!
* **"See you around, hopefully."** – Nos vemos por ahí, ojalá.

> 💡 *Do-ménica recuerda: la comunicación clara es sexy. "Do you mind if...?" o "I'd rather..." muestra confianza y respeto.* Observa el lenguaje corporal y respeta el espacio personal.`,
      miniQuiz: [
        mc('¿Cuál es la forma más casual de invitar a tomar un café algún día?', ['You will have coffee with me.', 'Wanna grab a coffee sometime?', 'Give me your time for coffee.', 'Coffee. You. Now.'], 1),
        mc('"Wanna" es la forma casual de...', ['"want to"', '"want a"', '"wanna be"', '"will not"'], 0),
        mc('Alguien te invita a salir pero no te interesa. ¿Cuál es la forma más educada de rechazar?', ['No. Go away.', 'Ew, no thanks.', "I'm flattered, but I'm seeing someone.", 'Why would I say yes?'], 2),
        mc('Quieres pedir su número con respeto. ¿Cuál es la mejor opción?', ['Give me your number.', 'Can I get your number?', 'Your number. Now.', 'I need your number.'], 1),
        mc('Te tienes que ir pero quieres dejar la puerta abierta. ¿Qué dices?', ["Bye, that's it.", 'It was great meeting you!', 'Finally, I can leave.', "I'm bored, leaving."], 1),
        tap('Toca la palabra incorrecta:', ['Can', 'I', 'get', 'you', 'number?'], 3, 'your'),
        tap('Toca la palabra incorrecta:', ['Wanna', 'grab', 'a', 'coffees', 'sometime?'], 3, 'coffee'),
        rebuild('Escucha y reconstruye:', 'Wanna grab a coffee sometime', ['Wanna', 'grab', 'a', 'coffee', 'sometime', 'want', 'get', 'tea', 'now', 'later', 'drink']),
      ] },
    { id: 'modulo10-teoria-6', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**🎉 6. Mini Simulacro Social: ¿Bricher@ o solo buena onda?**

¡Hora de poner en práctica lo aprendido! A continuación, 3 situaciones sociales. Elige la mejor frase en inglés para cada una.

Recuerda lo que aprendiste:
* **Icebreakers** para romper el hielo con educación.
* **Preguntas casuales** para conocer sin invadir.
* **Invitaciones casuales** sin presión.

¡Demuestra tu nivel de Bricher@ Bilingüe! 😏💪`,
      miniQuiz: [
        mc('Situación 1: Te presentan a Alex, estudiante de intercambio. ¿Qué dices primero?', ['Do you have a girlfriend?', "Hi, I'm [tu nombre]. Nice to meet you!", 'You. Me. Dance. Now?', 'Are you single?'], 1),
        mc('Situación 2: Llevas 10 minutos conversando con Alex. ¿Qué preguntas?', ['Where do you live exactly?', 'How much money do you make?', 'What do you do for fun?', "What's your address?"], 2),
        mc('Situación 3: La conversación va genial y quieres juntarte otro día. ¿Qué dices?', ['Wanna grab a coffee sometime?', 'Give me your number.', 'You will see me tomorrow.', 'Be at my place at 8.'], 0),
        mc('Situación 4: Alex te invita a salir pero estás saliendo con alguien. ¿Cómo rechazas con respeto?', ['No way!', "I'm flattered, but I'm seeing someone.", 'Ew, no.', 'Stop bothering me.'], 1),
        mc('Situación 5: Te tienes que ir pero la pasaste bien. ¿Qué dices al despedirte?', ['It was great meeting you!', 'Finally, bye.', "Don't text me.", 'Leave me alone now.'], 0),
        tap('Situación: querías sentarte. Toca la palabra incorrecta:', ['Is', 'this', 'seat', 'took?'], 3, 'taken?'),
        tap('Toca la palabra incorrecta:', ['Can', 'I', 'gets', 'your', 'number?'], 2, 'get'),
        rebuild('Escucha y reconstruye:', 'It was great meeting you', ['It', 'was', 'great', 'meeting', 'you', 'nice', 'good', 'see', 'is', 'to']),
      ] },
    { id: 'modulo10-resumen', type: 'resumen', markdown: `## **🎯 Resumen del Bricher@ Bilingüe**

* ✅ **Icebreakers:** "Is this seat taken?", "Nice ___!", "I like the vibe here."
* ✅ **Preguntas casuales:** "Where are you from?", "What do you do for fun?"
* ✅ **Halagos:** "You have a great laugh.", "You're easy to talk to."
* ✅ **Referencias culturales:** Memes, música, series – crean complicidad.
* ✅ **Invitar:** "Wanna grab a coffee sometime?"
* ✅ **Rechazar:** "I'm flattered, but I'm seeing someone."
* ✅ **Despedirte:** "It was great meeting you!"

La clave: **ser tú mismo, mostrar interés genuino y respetar a la otra persona.** El idioma es solo el medio; tú pones la chispa. ✨` },
    { id: 'modulo10-cierre', type: 'cierre', markdown: `#### **🌟 Cierre Brichero**

Y así, con humor, respeto y tu estilo único, puedes mezclar culturas y quizá hasta corazones ❤️‍🔥. Lo más importante al coquetear en cualquier idioma es ser tú mismo, demostrar interés genuino y respetar a la otra persona. El idioma es solo el medio: tú pones la chispa.

Ahora ya tienes en tu repertorio frases para cada etapa: desde "Hi, I'm ___" hasta "See you soon?". Tómalas, practícalas en voz alta (sí, aunque suene raro, ensayar te da confianza) y úsalas cuando llegue la oportunidad.

Recuerda, un verdadero Bricher@ Bilingüe no es un jugador en serie, sino alguien que tiende puentes culturales con carisma y respeto. 😉✨

¡Mucha suerte en tus próximas aventuras internacionales del amor o la amistad! Y como siempre: have fun and be respectful. Quién sabe, ¿quizá tu próxima historia digna de película romántica empieza con "Is this seat taken?" en un bus de Lima?💖

**🏅 Insignia obtenida:** ✨ *Bricher@ Bilingüe – Nivel 1* (Maestría en coqueteo intercultural) 🎊💘` },
  ],
  quizQuestions: [
    mc('Quieres iniciar conversación con alguien en un café. ¿Cuál es el mejor icebreaker?', ['Hey, are you single?', 'Is this seat taken?', 'I need to sit here.', 'Move, please.'], 1),
    mc('¿Cuál pregunta es mejor para conocer los intereses de alguien sin invadir?', ['How old are you?', 'Where do you live?', 'What do you do for fun?', 'How much do you earn?'], 2),
    mc('¿Cuál es un cumplido apropiado y no cringe al recién conocer a alguien?', ['Nice body!', 'You look hot.', "You're really easy to talk to.", 'Give me a hug.'], 2),
    mc('"Wanna grab a coffee sometime?" significa:', ['¿Quieres agarrar un café ahora mismo?', '¿Quieres tomar un café algún día?', '¿Quieres comprarme un café?', '¿Dónde está el café?'], 1),
    mc('No te interesa la invitación de alguien. ¿Cuál es la forma más educada de rechazar?', ['No way!', "I'm flattered, but I'm seeing someone.", 'Ew, no.', 'Leave me alone.'], 1),
    mc("En \"I like your vibe, it's chill\", ¿qué significan \"vibe\" y \"chill\"?", ['enojo y frío', 'onda/ambiente y relajada/tranquila', 'música y baile', 'comida y bebida'], 1),
    tap('Toca la palabra incorrecta:', ['Can', 'I', 'get', 'you', 'number?'], 3, 'your'),
    tap('Toca la palabra incorrecta:', ['Do', 'you', 'comes', 'here', 'often?'], 2, 'come'),
    tap('Toca la palabra incorrecta:', ['Where', 'do', 'you', 'from?'], 1, 'are'),
    tap('Toca la palabra incorrecta:', ['Have', 'you', 'watch', 'that', 'series?'], 2, 'watched'),
    tap('Toca la palabra incorrecta:', ['You', 'have', 'a', 'great', 'laughs.'], 4, 'laugh.'),
    rebuild('Escucha y reconstruye:', 'Is this seat taken', ['Is', 'this', 'seat', 'taken', 'that', 'place', 'free', 'your', 'sit']),
    rebuild('Escucha y reconstruye:', 'What do you do for fun', ['What', 'do', 'you', 'do', 'for', 'fun', 'how', 'work', 'where', 'like', 'have']),
    rebuild('Escucha y reconstruye:', 'Wanna grab a coffee sometime', ['Wanna', 'grab', 'a', 'coffee', 'sometime', 'want', 'get', 'tea', 'now', 'later', 'drink']),
    rebuild('Escucha y reconstruye:', 'It was great meeting you', ['It', 'was', 'great', 'meeting', 'you', 'nice', 'good', 'hear', 'is', 'to']),
  ],
};

const modulo2_1 = {
  id: 'modulo2-1',
  title: 'Microlección 1',
  durationMinutes: 12,
  audioCues: ['Escucha el contenido de la lección.', 'Fíjate en los puntos clave.', 'Ahora vienen tus ejercicios.'],
  contentBlocks: [
    { id: 'modulo2-1-titulo', type: 'titulo', title: '¿Qué está pasando ahora?', subtitle: 'Presente Continuo vs. Presente Simple', markdown: '' },
    { id: 'modulo2-1-mision', type: 'mision', markdown: `Aprender a **describir acciones que ocurren en este momento** (Presente Continuo) y a distinguirlas de las **rutinas habituales** (Presente Simple). Al finalizar podrás decir **qué estás haciendo ahorita** 📹 y diferenciarlo de lo que **sueles hacer** siempre.` },
    { id: 'modulo2-1-intro', type: 'intro', markdown: `¡Hola otra vez! Soy **{{mascot}}** {{mascotEmoji}}, tu {{mascotKind}}. En la micro anterior aprendiste a hablar de **rutinas** con el **Presente Simple** (lo que haces *siempre*).

Pero ahora, mientras vamos rodando en el bus, **cosas pasan en este instante** ⌚: gente subiendo, alguien hablando por teléfono, un perro correteando 🐕. Para describir lo que ocurre **AHORITA**, usamos el **Presente Continuo**.

Hoy somos **reporteros del momento** 📹: narramos en vivo lo que está sucediendo. ¡Vamos!` },
    { id: 'modulo2-1-teoria-1', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**1.** **Estructura y uso: Simple vs. Continuo**

Hay dos tiempos que a veces se confunden, pero cumplen funciones distintas:

* **Presente Simple** = rutina / hábito (lo que haces *generalmente*).
  > *I eat breakfast at 7.* (Desayuno a las 7, todos los días.)
  > Estructura: **sujeto + verbo** (con **-s** en tercera persona).

* **Presente Continuo** = acción **en progreso ahora** (lo que pasa *en este momento*).
  > *I am eating breakfast right now.* (Estoy desayunando justo ahora.)
  > Estructura: **sujeto + am/are/is + verbo+-ing**.

  | Español                       | Inglés                |
  | ----------------------------- | --------------------- |
  | Él trabaja todos los días.    | He works every day.   |
  | (Ahora) él está trabajando.   | He is working now.    |

**¡Ojo clave!** En el continuo **siempre** va **am/are/is** + **verbo-ing**. Sin el *to be*, la frase cojea:

* ❌ *she working* → ✅ *she is working*
* Y nunca *she is work*: **falta el -ing**. ✅ *she is working*.`,
      miniQuiz: [
        mc('Acción en progreso AHORA: "Él está trabajando ahora."', ['He is working now.', 'He works now.', 'He working now.', 'He is work now.'], 0),
        mc('Rutina / hábito: "Yo desayuno a las 7 todos los días."', ['I am eating breakfast at 7.', 'I eat breakfast at 7.', 'I eating breakfast at 7.', 'I am eat breakfast at 7.'], 1),
        mc('Estructura del Presente Continuo:', ['sujeto + verbo + -s', 'sujeto + verbo base', 'sujeto + am/are/is + verbo+-ing', 'sujeto + verbo + -ed'], 2),
        mc('¿Qué le falta a "She ___ working now"?', ['nada, está bien', 'la terminación -ed', 'el verbo to be (is)', 'la palabra do'], 2),
        mc('¿Qué error tiene "She is work now"?', ['está perfecta', 'le falta -ing en el verbo', 'le sobra el is', 'le falta -s'], 1),
        mc('"(Ahora) ellos están corriendo."', ['They run now.', 'They running now.', 'They is running now.', 'They are running now.'], 3),
        tap('Toca la palabra incorrecta:', ['She', 'is', 'cooking', 'and', 'he', 'is', 'eat', 'now.'], 6, 'eating'),
        tap('Toca la palabra incorrecta:', ['They', 'are', 'playing', 'and', 'she', 'walking', 'home.'], 5, 'is walking'),
        rebuild('Escucha y reconstruye:', 'He is working now', ['He', 'is', 'working', 'now', 'works', 'work', 'walking', 'walks']),
      ] },
    { id: 'modulo2-1-teoria-2', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**2.** **Verbos de estado (stative verbs)**

No todos los verbos pueden ir en continuo 🚫. Los **verbos de estado** o de emoción casi **nunca** se usan con **-ing**:

> *know, love, want, need, like, believe*

Suena raro decir *I am knowing* o *She is needing*. Con estos verbos usamos el **simple**:

* ✅ *I know* (no *I am knowing*)
* ✅ *she needs* (no *she is needing*)

  | Español                | Inglés              |
  | ---------------------- | ------------------- |
  | Quiero un helado.      | I want ice cream.   |
  | Ella necesita ayuda.   | She needs help.     |

* ✅ *I want ice cream.*
* ❌ *I am wanting ice cream.* (salvo el chiste de McDonald's: *"I'm lovin' it"* 🍟).

  > 💡 **Regla práctica:** usa **continuo** para acciones **en progreso**; con **verbos de estado** usa el **simple**. Pregúntate: *"¿se puede ver la acción, o es un estado interno?"* Si es algo que sientes o sabes por dentro → **simple**.`,
      miniQuiz: [
        mc('¿Cuál es correcto? (verbo de estado)', ['He is wanting a new phone.', 'He wants a new phone.', 'He is want a new phone.', 'He wanting a new phone.'], 1),
        mc('"Yo sé la respuesta." se dice:', ['I am knowing the answer.', 'I knowing the answer.', 'I know the answer.', 'I am know the answer.'], 2),
        mc('¿Qué verbo NO suele usarse con -ing?', ['run', 'eat', 'love', 'walk'], 2),
        mc('Con un verbo de estado (need, want, know) usamos:', ['Presente Continuo (am/are/is + -ing)', 'Presente Simple', 'verbo + -ed', 'verbo + to'], 1),
        mc('"Ella necesita ayuda." se dice:', ['She is needing help.', 'She needs help.', 'She needing help.', 'She is need help.'], 1),
        mc('¿Cuál es un verbo de estado?', ['run', 'jump', 'believe', 'cook'], 2),
        tap('Toca la palabra incorrecta:', ['I', 'know', 'her', 'and', 'she', 'helping', 'me.'], 5, 'is helping'),
        rebuild('Escucha y reconstruye:', 'She needs help', ['She', 'needs', 'help', 'needing', 'is', 'helps', 'need', 'want']),
      ] },
    { id: 'modulo2-1-errores', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `#### **🚫 Errores Comunes**

Estos son los tropiezos clásicos cuando mezclamos los dos tiempos. ¡Cázalos antes de que te cacen a ti!

* ❌ *She walking to work.* → ✅ *She **is** walking to work.* (faltaba el *is*).
* ❌ *I am study English now.* → ✅ *I am **studying** English now.* (faltaba el *-ing*).
* ❌ *Do you watching TV?* → ✅ ***Are** you watching TV?* (en preguntas continuas se usa *are*, no *do*).
* ❌ *He is knowing the answer.* → ✅ *He **knows** the answer.* (*know* es verbo de estado → simple).

  > 💡 **Truco de {{mascot}}:** si la acción **está pasando ahorita** y **se puede ver**, asegúrate de tener **am/are/is + verbo-ing** completos. Si es un **estado interno** (saber, querer, necesitar), vuelve al **simple**.

En los ejercicios de abajo, **toca la palabra incorrecta** y arréglala 👇.`,
      miniQuiz: [
        tap('Toca la palabra incorrecta:', ['She', 'is', 'cooking', 'and', 'I', 'am', 'eat', 'too.'], 6, 'eating'),
        tap('Toca la palabra incorrecta:', ['He', 'running', 'fast', 'and', 'they', 'are', 'playing.'], 1, 'is running'),
        tap('Toca la palabra incorrecta:', ['We', 'are', 'working', 'and', 'they', 'is', 'studying.'], 5, 'are'),
        tap('Toca la palabra incorrecta:', ['Do', 'you', 'watching', 'TV', 'right', 'now?'], 0, 'Are'),
        tap('Toca la palabra incorrecta:', ['He', 'knows', 'the', 'answer', 'and', 'she', 'study', 'now.'], 6, 'is studying'),
        tap('Toca la palabra incorrecta:', ['I', 'am', 'sleep', 'and', 'you', 'are', 'reading.'], 2, 'sleeping'),
        tap('Toca la palabra incorrecta:', ['My', 'mom', 'is', 'cooking', 'and', 'dad', 'reading.'], 6, 'is reading.'),
        tap('Toca la palabra incorrecta:', ['You', 'are', 'eating', 'and', 'we', 'watches', 'TV.'], 5, 'are watching'),
      ] },
    { id: 'modulo2-1-resumen', type: 'resumen', markdown: `## **🎯 Resumen práctico que debes recordar**

* ✅ **Rutina / hábito** → **Presente Simple**: *I drive to work every day.* (sujeto + verbo, con **-s** en 3a persona).

* ✅ **Acción en progreso AHORA** → **Presente Continuo**: *I am driving to work right now.* (**am/are/is + verbo-ing**).

* ✅ En el continuo **nunca olvides el to be** (*am/are/is*) **ni el -ing**: ❌ *she working* / ❌ *she is work* → ✅ *she is working*.

* ✅ **Verbos de estado** (*know, love, want, need, like, believe*) van en **simple**, no en *-ing*: ✅ *I want* / ❌ *I am wanting*.

* ✅ Para **preguntar** en continuo: ***Are** you working?* (no *Do you working?*).

  | Cuándo                | Tiempo            | Ejemplo                          |
  | --------------------- | ----------------- | -------------------------------- |
  | Siempre / rutina      | Presente Simple   | He works every day.              |
  | Justo ahora           | Presente Continuo | He is working now.               |` },
    { id: 'modulo2-1-cierre', type: 'cierre', markdown: `#### **🌟 Cierre**

¡Buen trabajo! 🏆 Ahora distingues lo que haces **siempre** de lo que pasa **ahorita**.

Recuerda:

* **Rutina / habitual** → Presente Simple: *I drive to work every day.* 🚗
* **Algo que pasa ahorita** → Presente Continuo: *I am driving to work right now.* 📹

✅ **Misión cumplida:** ya puedes contarle a {{mascot}} qué estás haciendo en tiempo real: *"I am sitting on the bus and looking out the window."*

**🏅 Insignia obtenida:** ✨ *Reportero del Momento* (Experto en Presente Continuo) 📸🕐` },
  ],
  quizQuestions: [
    mc('"Estoy leyendo un libro ahora."', ['I read a book now.', 'I am reading a book now.', 'I reading a book now.', 'I am read a book now.'], 1),
    mc('Para preguntar "¿Estás trabajando?":', ['Do you working?', 'Are you working?', 'You working?', 'Are you work?'], 1),
    mc('¿Cuál es correcto? (verbo de estado)', ['He is wanting a new phone.', 'He wanting a new phone.', 'He wants a new phone.', 'He is want a new phone.'], 2),
    mc('Acción en progreso ahora: "Ellos están corriendo."', ['They run now.', 'They is running now.', 'They are running now.', 'They running now.'], 2),
    mc('Rutina / hábito: "Yo manejo al trabajo todos los días."', ['I am driving to work every day.', 'I driving to work every day.', 'I drive to work every day.', 'I am drive to work every day.'], 2),
    mc('En el Presente Continuo nunca debe faltar...', ['el -ed', 'am/are/is + verbo-ing', 'la palabra do', 'el -s de tercera persona'], 1),
    mc('"Yo sé la respuesta." se dice:', ['I am knowing the answer.', 'I know the answer.', 'I knowing the answer.', 'I am know the answer.'], 1),
    mc('¿Qué error tiene "She is work now"?', ['le falta el -ing (working)', 'le sobra is', 'le falta -s', 'ninguno'], 0),
    mc('"Ella está caminando a la escuela."', ['She walking to school.', 'She walks to school.', 'She is walking to school.', 'She is walk to school.'], 2),
    tap('Toca la palabra incorrecta:', ['She', 'is', 'cooking', 'and', 'he', 'is', 'eat', 'now.'], 6, 'eating'),
    tap('Toca la palabra incorrecta:', ['They', 'are', 'playing', 'and', 'she', 'walking', 'home.'], 5, 'is walking'),
    tap('Toca la palabra incorrecta:', ['Do', 'you', 'watching', 'TV', 'right', 'now?'], 0, 'Are'),
    rebuild('Escucha y reconstruye:', 'I am eating breakfast now', ['I', 'am', 'eating', 'breakfast', 'now', 'eat', 'every', 'day', 'walking']),
    rebuild('Escucha y reconstruye:', 'She is working today', ['She', 'is', 'working', 'today', 'works', 'walking', 'work', 'now']),
    rebuild('Escucha y reconstruye:', 'Are you watching TV', ['Are', 'you', 'watching', 'TV', 'Do', 'watch', 'watches', 'now']),
  ],
};

const modulo2_2 = {
  id: 'modulo2-2',
  title: 'Microlección 2',
  durationMinutes: 13,
  audioCues: ['Escucha el contenido de la lección.', 'Fíjate en los puntos clave.', 'Ahora vienen tus ejercicios.'],
  contentBlocks: [
    { id: 'modulo2-2-titulo', type: 'titulo', title: 'Historias del pasado', subtitle: 'Pasado Simple', markdown: '' },
    { id: 'modulo2-2-mision', type: 'mision', markdown: `¡Hoy te conviertes en narrador del ayer! 🕒\n\nVas a aprender a:\n\n- 🗣️ **Hablar de cosas que ya ocurrieron** usando el **Pasado Simple**.\n- ✅ Describir eventos pasados con verbos **regulares e irregulares**.\n- 🚫 Formar **negativos** (didn't) y **preguntas** (did) en pasado.\n\n> Al final podrás contar tu finde, tu anécdota de ayer y cualquier historia que se te ocurra.💨` },
    { id: 'modulo2-2-intro', type: 'intro', markdown: `#### **🕰️ ¡Sube a la Máquina del Tiempo!**\n\nBoti es un **viajero del tiempo** 🕒. Hoy viajamos al **ayer** para contar historias: qué hiciste el finde, esa anécdota graciosa de ayer...\n\nEn español ya lo haces sin pensar: **fui**, **hice**, **comí**. 🍽️\n\nEn inglés eso se llama el **Past Simple** (Pasado Simple).\n\nY adivina quién reaparece... 🥁 ¡La agente **Do-ménica**! 🕵️‍♀️ La misma que usaba **do/does** en presente, ahora se pone el traje de **"did"** para las preguntas del pasado. Misma agente, nuevo disfraz. 😎` },
    { id: 'modulo2-2-teoria-1', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `#### **✅ Afirmativos: Verbos regulares (+ ed)**\n\n**1️⃣ Verbos regulares → + ed**\n\nLa mayoría de los verbos solo necesitan un **-ed** al final. ¡Fácil! ✨\n\n| Verbo | Pasado | Ejemplo |\n|---|---|---|\n| work | work**ed** | I **worked** yesterday. |\n| play | play**ed** | She **played** football last Saturday. |\n| wait | wait**ed** | We **waited** for the bus. |\n\n**🔤 Reglas de ortografía:**\n\n| Si termina en... | Regla | Ejemplo |\n|---|---|---|\n| **-e** | solo + d | live → liv**ed** |\n| consonante + **y** | -y → **ied** | study → stud**ied** |\n| **CVC** tónica | duplica consonante | stop → sto**pped** |`, miniQuiz: [
      mc('¿Cómo se forma el pasado de la mayoría de verbos regulares?', ['Añadiendo -ed', 'Añadiendo -ing', 'Cambiando toda la palabra', 'No cambian'], 0),
      mc('El pasado de "study" es...', ['studyed', 'studied', 'studyied', 'studed'], 1),
      mc('"Ella jugó fútbol el sábado pasado."', ['She play football last Saturday.', 'She plays football last Saturday.', 'She played football last Saturday.', 'She playing football last Saturday.'], 2),
      mc('Si el verbo termina en "-e" (live), el pasado es...', ['liveed', 'livied', 'lived', 'livd'], 2),
      mc('¿Cuál es el pasado de "stop" (CVC tónica)?', ['stopped', 'stoped', 'stopd', 'stoping'], 0),
      tap('Toca la palabra incorrecta:', ['Yesterday', 'I', 'worked', 'and', 'study', 'a', 'lot.'], 4, 'studied'),
      tap('Toca la palabra incorrecta:', ['We', 'play', 'and', 'watched', 'TV', 'last', 'night.'], 1, 'played'),
      rebuild('Escucha y reconstruye:', 'I worked yesterday', ['I', 'worked', 'yesterday', 'work', 'walked', 'works', 'worker']),
    ] },
    { id: 'modulo2-2-teoria-1b', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `#### **🧠 Afirmativos: Verbos irregulares**\n\n**2️⃣ Verbos irregulares → ¡a memorizar! 🧠**\n\nEstos van por libre, no siguen reglas. Los más comunes:\n\n| Inglés | Pasado | Español |\n|---|---|---|\n| go | **went** | fui |\n| eat | **ate** | comí |\n| see | **saw** | vi |\n| make | **made** | hice |\n| take | **took** | tomé |\n| get | **got** | obtuve |\n| say | **said** | dije |\n| come | **came** | vine |\n| give | **gave** | di |\n| have | **had** | tuve |\n\n> 💡 No hay atajo: estos se aprenden de memoria. ¡Pero son los que más se usan! 💪`, miniQuiz: [
      mc('¿Cuál es el pasado de "go"?', ['went', 'goed', 'gone', 'goes'], 0),
      mc('¿Cuál es el pasado de "eat"?', ['eated', 'ate', 'eaten', 'eats'], 1),
      mc('¿Por qué los verbos irregulares son especiales?', ['Se les añade -ed', 'Solo se usan en preguntas', 'No siguen reglas y se memorizan', 'Nunca cambian'], 2),
      mc('¿Cuál es el pasado de "see"?', ['seed', 'sees', 'saw', 'seen'], 2),
      mc('"Hice un pastel ayer."', ['I maked a cake yesterday.', 'I make a cake yesterday.', 'I made a cake yesterday.', 'I making a cake yesterday.'], 2),
      tap('Toca la palabra incorrecta:', ['Yesterday', 'I', 'went', 'home', 'and', 'eat', 'dinner.'], 5, 'ate'),
      tap('Toca la palabra incorrecta:', ['He', 'taked', 'the', 'bus', 'and', 'came', 'late.'], 1, 'took'),
      rebuild('Escucha y reconstruye:', 'I saw a movie', ['I', 'saw', 'a', 'movie', 'see', 'saws', 'sow', 'seen']),
    ] },
    { id: 'modulo2-2-teoria-1c', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `#### **⭐ El verbo "to be" en pasado**\n\n**3️⃣ El verbo to be en pasado → was / were**\n\n| Sujeto | to be |\n|---|---|\n| I / he / she / it | **was** |\n| you / we / they | **were** |\n\n- I **was** at home last night. 🏠\n- They **were** happy together. 😊\n\n> 💡 Ojo: el to be es especial, no usa "did". ¡Tiene su propia forma!`, miniQuiz: [
      mc('¿Qué forma de "to be" en pasado usamos con "they"?', ['were', 'was', 'is', 'are'], 0),
      mc('¿Qué forma de "to be" en pasado usamos con "I"?', ['was', 'were', 'am', 'is'], 0),
      mc('Completa: "You ___ happy together."', ['was', 'were', 'are', 'is'], 1),
      mc('"Él estaba en casa anoche."', ['He were at home last night.', 'He is at home last night.', 'He was at home last night.', 'He been at home last night.'], 2),
      mc('¿Con qué sujetos se usa "was"?', ['you, we, they', 'I, he, she, it', 'solo they', 'todos'], 1),
      tap('Toca la palabra incorrecta:', ['I', 'was', 'happy', 'but', 'they', 'was', 'sad.'], 5, 'were'),
      tap('Toca la palabra incorrecta:', ['We', 'was', 'at', 'home', 'and', 'she', 'was', 'out.'], 1, 'were'),
      rebuild('Escucha y reconstruye:', 'They were at school', ['They', 'were', 'at', 'school', 'was', 'where', 'wear', 'are']),
    ] },
    { id: 'modulo2-2-teoria-2', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `#### **🚫 Negativos: Lo que NO pasó**\n\nAquí viene el truco más importante del Pasado Simple. 🎩✨\n\n**Regla de oro:** NO conjugamos el verbo principal. Usamos **didn't + verbo base**.\n\n> El **"did"** ya carga el pasado, así que el verbo principal se queda en su forma base (sin -ed, sin cambios). 🙌\n\n| Afirmativo | Negativo |\n|---|---|\n| I **went** | I **didn't go** |\n| She **studied** | She **didn't study** |\n| We **had** | We **didn't have** |\n\n**Ejemplos:**\n\n- I **didn't go** to the party. 🎉❌\n- She **didn't study** yesterday. 📚❌\n- We **didn't have** time. ⏰❌\n\n**⚠️ Excepción: el to be**\n\nEl verbo to be NO usa "didn't". Tiene su propio negativo:\n\n| Forma | Contracción |\n|---|---|\n| was not | **wasn't** |\n| were not | **weren't** |\n\n- I **wasn't** at work on Monday. 💼❌\n\n> 🚨 Error típico: decir "I didn't went". ¡NO! Es **I didn't go**. El "did" ya tiene el pasado.`, miniQuiz: [
      mc('Para hacer negativo en pasado (verbos normales) usamos...', ['not + verbo', "didn't + verbo en pasado", "didn't + verbo base", 'no + verbo'], 2),
      mc('"Ella no estudió ayer."', ["She didn't study yesterday.", "She didn't studied yesterday.", 'She not studied yesterday.', "She don't study yesterday."], 0),
      mc('¿Cuál es la contracción de "were not"?', ["weren't", "wasn't", "didn't", "don't"], 0),
      mc('Completa: "We ___ time." (no tener)', ["didn't had", "didn't have", 'not have', "doesn't have"], 1),
      mc('"Yo no estaba en el trabajo el lunes."', ['I not was at work on Monday.', "I weren't at work on Monday.", "I wasn't at work on Monday.", "I didn't at work on Monday."], 2),
      tap('Toca la palabra incorrecta:', ['He', "didn't", 'came', 'to', 'the', 'meeting.'], 2, 'come'),
      tap('Toca la palabra incorrecta:', ['I', "wasn't", 'tired', 'but', 'they', "wasn't", 'happy.'], 5, "weren't"),
      rebuild('Escucha y reconstruye:', "I didn't go", ['I', "didn't", 'go', 'went', 'not', 'do', 'goes', 'no']),
    ] },
    { id: 'modulo2-2-teoria-3', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `#### **❓ Preguntas: Investigando el pasado**\n\n¡La agente **Do-ménica** entra en acción con su traje "did"! 🕵️‍♀️\n\n**Estructura:** **Did + sujeto + verbo base + ?**\n\n> Igual que en negativos: el "did" lleva el pasado, el verbo se queda **base**. 🎯\n\n- **Did** you **go** to the concert? 🎶\n- **Did** she **study** for the exam? 📖\n- What **did** they **say**? 🗣️\n\n> 🚨 ¡Cuidado! NO se dice "Went you?" ni "Did you went?". Solo **Did you go?**\n\n**✅ Respuestas cortas (short answers):**\n\n| Pregunta | Sí | No |\n|---|---|---|\n| Did you...? | Yes, I **did**. | No, I **didn't**. |\n\n**⚠️ Con el verbo to be → usa was/were (sin "did")**\n\n| Pregunta | Sí | No |\n|---|---|---|\n| **Were** they at home? | Yes, they **were**. | No, they **weren't**. |\n| **Was** he sick? | Yes, he **was**. | No, he **wasn't**. |\n\n> 💡 Resumen: verbos normales → **did**. El to be → **was/were** directamente.`, miniQuiz: [
      mc('¿Cuál es la estructura correcta de pregunta en pasado?', ['Did + sujeto + verbo base?', 'Did + sujeto + verbo en pasado?', 'Sujeto + did + verbo?', 'Verbo en pasado + sujeto?'], 0),
      mc('"¿Estudiaste para el examen?"', ['Did you studied for the exam?', 'Did you study for the exam?', 'Studied you for the exam?', 'Do you study for the exam?'], 1),
      mc('Respuesta corta negativa a "Did you go?"', ["No, I wasn't.", "No, I didn't.", "No, I don't.", 'No, I not.'], 1),
      mc('"¿Estaban ellos en casa?" (usar to be)', ['Did they at home?', 'Was they at home?', 'Were they at home?', 'Did they were at home?'], 2),
      mc('Completa la respuesta: "Was he sick? Yes, he ___."', ['did', 'was', 'were', "didn't"], 1),
      tap('Toca la palabra incorrecta:', ['Did', 'you', 'went', 'to', 'the', 'gym?'], 2, 'go'),
      tap('Toca la palabra incorrecta:', ['Where', 'did', 'you', 'bought', 'that?'], 3, 'buy'),
      rebuild('Escucha y reconstruye:', 'Did you eat lunch', ['Did', 'you', 'eat', 'lunch', 'ate', 'did', 'eaten', 'launch']),
    ] },
    { id: 'modulo2-2-errores', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `#### **🚫 Errores Comunes**\n\nBoti ha visto estos errores mil veces... ¡no caigas en ellos!🛑\n\n| ❌ Incorrecto | ✅ Correcto | ¿Por qué? |\n|---|---|---|\n| I **no went** to class. | I **didn't go** to class. | El negativo se forma con **didn't + base**. |\n| Did you **went** to the gym? | Did you **go** to the gym? | Tras "did", el verbo va en **base**. |\n| She **not studied**. | She **didn't study**. | Falta el **didn't**; el verbo va en base. |\n| He **didn't went** either. | He **didn't go** either. | Doble pasado: "did" ya lo lleva. |\n| **Was you** at the office? | **Were you** at the office? | Con "you" **were**, no "was". |\n\n**🧠 Dos reglas que lo salvan todo:**\n\n1. 🙅‍♂️ Nada de **"goed"** → es **went** (irregular).\n2. 🙅‍♀️ Nada de **"didn't went"** → es **didn't go** (¡un solo pasado!).\n\n> 👉 En negativos y preguntas, el "did/didn't" carga el pasado. El verbo principal descansa en su forma base. 😴`, miniQuiz: [
      tap('Toca la palabra incorrecta:', ['Yesterday', 'I', 'worked', 'and', 'study', 'a', 'lot.'], 4, 'studied'),
      tap('Toca la palabra incorrecta:', ['She', "didn't", 'studied', 'for', 'the', 'test.'], 2, 'study'),
      tap('Toca la palabra incorrecta:', ['Did', 'you', 'went', 'to', 'the', 'gym?'], 2, 'go'),
      tap('Toca la palabra incorrecta:', ['He', "didn't", 'went', 'to', 'work', 'today.'], 2, 'go'),
      tap('Toca la palabra incorrecta:', ['Was', 'you', 'at', 'the', 'office', 'yesterday?'], 0, 'Were'),
      tap('Toca la palabra incorrecta:', ['We', 'goed', 'home', 'and', 'ate', 'dinner.'], 1, 'went'),
      tap('Toca la palabra incorrecta:', ['They', 'was', 'happy', 'and', 'we', 'were', 'tired.'], 1, 'were'),
      tap('Toca la palabra incorrecta:', ['Where', 'did', 'she', 'bought', 'the', 'tickets?'], 3, 'buy'),
    ] },
    { id: 'modulo2-2-resumen', type: 'resumen', markdown: `#### **📝 Resumen Express**\n\n¡Lo dominas, agente del tiempo! ⏳ Recuerda:\n\n- ✅ **Afirmativo:** verbo regular + **ed** (worked) o irregular (go → **went**).\n- 🚫 **Negativo:** **didn't + verbo base** (I didn't go). To be → **wasn't / weren't**.\n- ❓ **Pregunta:** **Did + sujeto + verbo base?** (Did you go?). To be → **Was/Were...?**\n\n| Tipo | Verbos normales | Verbo to be |\n|---|---|---|\n| ✅ | I went | I was |\n| 🚫 | I didn't go | I wasn't |\n| ❓ | Did I go? | Was I? |\n\n> 🔑 La clave: en negativos y preguntas, **el "did" lleva el pasado** y el verbo se queda en **base**. ¡Nunca dos pasados juntos!` },
    { id: 'modulo2-2-cierre', type: 'cierre', markdown: `#### **🏅 ¡Misión Cumplida!**\n\nExcelente trabajo, **agente del tiempo** ⏳. Ya dominas el **Pasado Simple**. 🎉\n\n**🗣️ Práctica para ti:** cuenta **3 cosas que hiciste el finde**:\n\n> I **went** to... 🚶\n> I **saw**... 👀\n> I **ate**... 🍕\n\n**🎯 Misión final:** responde a "**What did you do yesterday?**" con algo como:\n\n> *"Yesterday I **studied**, **cooked** dinner, and **watched** a movie."* 🎬\n\n🏅 **Insignia obtenida:** *Cronista del Ayer* (Maestr@ del Past Simple) ⏱️✨\n\n¡Nos vemos en la siguiente etapa, {{mascot}} ya calienta motores! 🤖⚡` },
  ],
  quizQuestions: [
    mc('"Ellos viajaron el año pasado."', ['They traveled last year.', 'They travel last year.', 'They travels last year.', 'They traveling last year.'], 0),
    mc('"¿Comiste ceviche ayer?"', ['Ate you ceviche yesterday?', 'Did you eat ceviche yesterday?', 'Did you ate ceviche yesterday?', 'Do you eat ceviche yesterday?'], 1),
    mc('Completa: "She ___ to the party." (not / go)', ["didn't went", "didn't go", 'not went', 'no go'], 1),
    mc('"¿Dónde estuviste anoche?"', ['Where you were last night?', 'Where was you last night?', 'Where were you last night?', 'Where did you were last night?'], 2),
    mc('Elige la frase correcta:', ['I not had time.', "I didn't have time.", "I didn't had time.", "I don't had time."], 1),
    mc('"Did it rain? – No, ___."', ["it wasn't", "it didn't", 'no rain', 'it not'], 1),
    mc('¿Cuál es el pasado de "see"?', ['seed', 'saw', 'seen', 'sees'], 1),
    mc('"Nosotros estábamos cansados."', ['We were tired.', 'We was tired.', 'We are tired.', 'We been tired.'], 0),
    mc('El pasado de "study" es...', ['studyied', 'studied', 'studyed', 'studed'], 1),
    tap('Toca la palabra incorrecta:', ['He', "didn't", 'went', 'to', 'school.'], 2, 'go'),
    tap('Toca la palabra incorrecta:', ['Yesterday', 'I', 'worked', 'and', 'study', 'a', 'lot.'], 4, 'studied'),
    tap('Toca la palabra incorrecta:', ['Was', 'you', 'at', 'home', 'yesterday?'], 0, 'Were'),
    rebuild('Ordena: "Yo no fui a la fiesta."', "I didn't go to the party", ['I', "didn't", 'go', 'to', 'the', 'party', 'went', 'not', 'did']),
    rebuild('Ordena: "Ayer ella vio una película."', 'Yesterday she saw a movie', ['Yesterday', 'she', 'saw', 'a', 'movie', 'see', 'seen', 'watched', 'sow']),
    rebuild('Escucha y reconstruye:', 'They were at home', ['They', 'were', 'at', 'home', 'was', 'wear', 'where', 'are']),
  ],
};

const modulo2_3 = {
  id: 'modulo2-3',
  title: 'Microlección 3',
  durationMinutes: 12,
  audioCues: ['Escucha el contenido de la lección.', 'Fíjate en los puntos clave.', 'Ahora vienen tus ejercicios.'],
  contentBlocks: [
    { id: 'modulo2-3-titulo', type: 'titulo', title: '¿Cómo hablo del futuro?', subtitle: 'Futuro con "going to" y "will"', markdown: '' },
    { id: 'modulo2-3-mision', type: 'mision', markdown: `🎯 **Tu misión de hoy**\n\nVas a aprender a hablar del **futuro** con las dos formas básicas del inglés: **"be going to"** y **"will"**. 🚀\n\nAl terminar podrás:\n\n- 📅 Expresar **planes e intenciones** ya decididas.\n- 🔮 Hacer **predicciones** sobre lo que va a pasar.\n- 🤝 Reaccionar con **ofertas y promesas** en el momento.\n- ⚖️ Saber **cuándo usar cada una** sin dudar.\n\n¡Vamos a viajar al futuro! 🌟` },
    { id: 'modulo2-3-intro', type: 'intro', markdown: `Bienvenido al futuro 🚀\n\nQuieres decir cosas como *"voy a estudiar más inglés el próximo mes"* o *"te ayudaré con tu tarea"*. Para eso necesitas dos aliados.\n\n> 🤖 **El Agente Will** (clave: **will**) aparece para **promesas** o **decisiones en el acto**.\n>\n> 👩 **Is-abella** (el verbo *to be*) te ayuda con **"going to"** para tus **planes**.\n\nDos rutas al futuro:\n\n| Ruta | Forma | Significado |\n|---|---|---|\n| 📅 Planes | be **going to** | voy a… |\n| ⚡ Ocurrencias | **will** | …ré |\n\n¡Elige tu camino! 🔮⚙️` },
    { id: 'modulo2-3-teoria-1', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `#### **📅 Camino 1: "be going to"**\n\nEsta es la ruta de los **planes** e **intenciones** que ya decidiste. Equivale a *"voy a…"*.\n\n**Estructura:**\n\n> **am / is / are** + **going to** + verbo base\n\n| Sujeto | Forma |\n|---|---|\n| I | **am** going to |\n| He / She / It | **is** going to |\n| You / We / They | **are** going to |\n\n**¿Cuándo lo uso?** 🤔\n\n- 🗓️ **Plan o intención ya decidida:**\n  - *I **am going to** travel next year.*\n  - *She **is going to** learn French.*\n- 👀 **Predicción con evidencia visible:**\n  - *Look at those clouds! It **is going to** rain.* ☁️\n  - *Be careful! You**'re going to** fall!*\n\n**Preguntas y negaciones:**\n\n- ❓ *Are you **going to** eat that?*\n- 🚫 *I'm **not going to** attend the meeting.*` , miniQuiz: [
      mc('¿Qué estructura sigue "be going to"?', ['will + verbo base', 'am/is/are + going to + verbo base', 'do + going to + verbo', 'going to + verbo + -s'], 1),
      mc('"Mira esas nubes" — hay evidencia visible. ¿Cómo lo dices?', ['It is going to rain.', 'It rains going to.', 'It will rain maybe.', 'It going to rain.'], 0),
      mc('¿Cuál es la forma negativa correcta de un plan?', ["I'm not going to attend the meeting.", 'I not going to attend the meeting.', "I'm going not to attend the meeting.", "I don't going to attend the meeting."], 0),
      mc('"She ___ going to learn French." Completa el verbo to be.', ['is', 'are', 'am', 'be'], 0),
      mc('"Voy a viajar el próximo año."', ['I going to travel next year.', 'I am going to travel next year.', 'I am going travel next year.', 'I will going to travel next year.'], 1),
      tap('Toca la palabra incorrecta:', ['She', 'is', 'going', 'to', 'studies', 'medicine.'], 4, 'study'),
      tap('Toca la palabra incorrecta:', ['I', 'going', 'to', 'visit', 'my', 'family.'], 1, 'am going'),
      rebuild('🎧 Ordena: "Vamos a viajar a Cusco."', 'We are going to travel to Cusco', ['We', 'are', 'going', 'to', 'travel', 'to', 'Cusco', 'will', 'traveling', 'goes']),
    ] },
    { id: 'modulo2-3-teoria-2', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `#### **⚡ Camino 2: "will"**\n\nEsta es la ruta de lo **espontáneo**: decisiones del momento, promesas y predicciones sin evidencia.\n\n**Estructura:**\n\n> **will** + verbo base\n\n¡Es igual para **todos** los sujetos, **sin "to"**! Se contrae a **'ll** y el negativo *will not* = **won't**. 🤖\n\n| | Ejemplo |\n|---|---|\n| ⚡ Decisión espontánea | *The phone is ringing — I **will** answer it!* |\n| 🤝 Ofrecimiento / promesa | *I **will** help you with your homework.* |\n| 🔮 Predicción sin evidencia | *I think it **will** be a difficult exam.* |\n\n**⚖️ ¿Cuál y cuándo?**\n\n| Situación | Forma |\n|---|---|\n| Ya planeado o hay indicios | **going to** |\n| Lo decides al momento / al vuelo | **will** |\n\nCompara:\n\n- 📅 *I **am going to** start a business.* (ya planeado)\n- ⚡ *OK, I **will** start a business!* (repentino)\n\n> ⚠️ **Recuerda:** *will* **no cambia**, va **sin "to"** (nunca *"will to"*) y con *he/she* **no** agregues *-s* (nada de *"wills"*).\n\n💡 **Extra:** a veces se usa el Presente Continuo para planes con hora y lugar fijos: *I'm meeting my friend tomorrow at 8.* ¡Solo tenlo oído! 👂` , miniQuiz: [
      mc('¿Cuál es la estructura correcta de "will"?', ['will + to + verbo', 'will + verbo base (sin "to")', 'will + verbo + s', 'will + verbo + -ing'], 1),
      mc('El teléfono suena y decides contestar ahora. ¿Qué dices?', ['I am going to answer it.', "I'll answer it!", 'I answer it will.', 'I will to answer it.'], 1),
      mc('¿Cuál es la contracción de "will not"?', ["willn't", "won't", 'wont will', 'willnot'], 1),
      mc('Tu amigo carga algo pesado y decides ayudarlo en el momento. Mejor:', ["I'll help you.", "I'm going to help you.", 'I help going to you.', 'I will helps you.'], 0),
      mc('Con "he/she", "will" lleva...', ['nada, no cambia', '-s (wills)', 'to', '-ing'], 0),
      tap('Toca la palabra incorrecta:', ['I', 'will', 'call', 'you', 'and', 'she', 'will', 'helps', 'too.'], 7, 'help'),
      tap('Toca la palabra incorrecta:', ['We', 'will', 'to', 'win', 'the', 'game.'], 2, '(quítalo)'),
      rebuild('🎧 Ordena: "Te ayudaré con tu tarea."', 'I will help you', ['I', 'will', 'help', 'you', 'helps', 'going', 'to', 'well']),
    ] },
    { id: 'modulo2-3-errores', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `#### **🚫 Errores Comunes**\n\nEstos son los tropiezos clásicos del futuro. ¡Detéctalos y esquívalos! 🕵️\n\n| ❌ Incorrecto | ✅ Correcto | Por qué |\n|---|---|---|\n| I will **to** call you later. | I **will call** you later. | *will* va sin "to" |\n| She will **helps** me. | She will **help** me. | tras *will* va verbo base, sin -s |\n| We **don't will** win. | We **won't** win. | el negativo es *won't*, no *don't will* |\n| Are you going to **coming**? | Are you going to **come**? | tras *going to* va verbo base |\n\n> 💡 **Truco:** después de **will** o **going to**, el verbo siempre va en su **forma base**: *call, help, come, win*. ¡Sin adornos! ✨\n\nAhora toca cazar los errores. 🎯` , miniQuiz: [
      tap('Toca la palabra incorrecta:', ['I', 'will', 'to', 'call', 'you', 'later.'], 2, '(quítalo)'),
      tap('Toca la palabra incorrecta:', ['She', 'will', 'helps', 'me', 'tomorrow.'], 2, 'help'),
      tap('Toca la palabra incorrecta:', ['Are', 'you', 'going', 'to', 'coming', 'tonight?'], 4, 'come'),
      tap('Toca la palabra incorrecta:', ['He', 'is', 'going', 'to', 'plays', 'football.'], 4, 'play'),
      tap('Toca la palabra incorrecta:', ['They', 'will', 'arrives', 'at', 'noon.'], 2, 'arrive'),
      tap('Toca la palabra incorrecta:', ['I', 'am', 'going', 'visit', 'my', 'aunt.'], 3, 'to visit'),
      tap('Toca la palabra incorrecta:', ['She', 'is', 'going', 'to', 'study', 'and', 'he', 'will', 'helps.'], 8, 'help'),
      tap('Toca la palabra incorrecta:', ['You', 'will', 'to', 'win', 'if', 'you', 'practice.'], 2, '(quítalo)'),
    ] },
    { id: 'modulo2-3-resumen', type: 'resumen', markdown: `#### **📌 Resumen rápido**\n\n| Forma | Úsala para | Ejemplo |\n|---|---|---|\n| 📅 **going to** | planes, intenciones, evidencia visible | *I'm going to travel.* |\n| ⚡ **will** | decisiones del momento, promesas, predicciones | *I'll help you!* |\n\n**Las tres reglas de oro de *will*:** 🥇\n\n1. No cambia con *he/she/it* (nada de *wills*).\n2. Nunca lleva *"to"* (nada de *will to*).\n3. El verbo va en **forma base**.\n\n> 🧭 **Decisión rápida:** ¿Ya lo tenías planeado o ves indicios? → **going to**. ¿Lo decides al vuelo? → **will**.` },
    { id: 'modulo2-3-cierre', type: 'cierre', markdown: `🔮 **¡Ahora dominas el futuro!**\n\nUsa **going to** para tus planes (*I'm going to visit a mis papás este fin*) y **will** para promesas u ocurrencias (*I'll bring you a souvenir!*).\n\n🎯 **Misión cumplida:** responde *"What are you going to do tomorrow?"* con tus planes; y si surge algo de repente, llama al Agente Will: *"I'll handle it!"*.\n\n🏅 **Insignia obtenida:** **Vidente Viajero** — Planificador del Futuro con *going to* y *will*. 🔮🚀` },
  ],
  quizQuestions: [
    mc('(Plan fijo) "Ella va a estudiar medicina." Mejor opción:', ['She will study medicine.', 'She is going to study medicine.', 'She is going to studies medicine.', 'She going to study medicine.'], 1),
    mc('(Decisión espontánea) Ves a tu amigo cargando algo y decides ayudar. Mejor:', ["I'm going to help you.", "I'll help you.", 'I help you will.', 'I will to help you.'], 1),
    mc('(Predicción con evidencia) No queda comida. "I think people ___ soon."', ['are going to leave', 'will leave', 'leaves', 'going to leave'], 0),
    mc('(Promesa) "No le diré a nadie." Mejor opción:', ["I won't tell anyone.", "I'm not going to tell anyone.", "I don't will tell anyone.", "I willn't tell anyone."], 0),
    mc('¿Cuál NO lleva "to" después?', ['will', 'going to', 'have to', 'want to'], 0),
    mc('"Look at those clouds! It ___ rain." (evidencia visible)', ['is going to', 'will', 'rains', 'going'], 0),
    mc('¿Cuál es correcta con "will"?', ['He will helps us.', 'He will help us.', 'He will to help us.', 'He wills help us.'], 1),
    mc('La contracción de "will not" es...', ["willn't", "won't", 'wont', 'wonot'], 1),
    mc('"Voy a empezar un negocio." (plan)', ['I will start a business.', 'I am going to start a business.', 'I am going to starts a business.', 'I going to start a business.'], 1),
    tap('Toca la palabra incorrecta:', ['He', 'will', 'helps', 'us', 'tomorrow.'], 2, 'help'),
    tap('Toca la palabra incorrecta:', ['Are', 'you', 'going', 'to', 'coming', 'tonight?'], 4, 'come'),
    tap('Toca la palabra incorrecta:', ['I', 'will', 'to', 'call', 'you', 'later.'], 2, '(quítalo)'),
    rebuild('Ordena: "Vamos a viajar a Cusco en junio."', 'We are going to travel to Cusco in June', ['We', 'are', 'going', 'to', 'travel', 'to', 'Cusco', 'in', 'June', 'will', 'goes', 'traveling']),
    rebuild('Ordena: "Te ayudaré con tu tarea."', 'I will help you with your homework', ['I', 'will', 'help', 'you', 'with', 'your', 'homework', 'going', 'helps', 'to']),
    rebuild('🎧 Ordena: "Lloverá mañana."', 'It will rain tomorrow', ['It', 'will', 'rain', 'tomorrow', 'rains', 'well', 'going', 'to']),
  ],
};

const modulo2_4 = {
  id: 'modulo2-4',
  title: 'Microlección 4',
  durationMinutes: 13,
  audioCues: ['Escucha el contenido de la lección.', 'Fíjate en los puntos clave.', 'Ahora vienen tus ejercicios.'],
  contentBlocks: [
    { id: 'modulo2-4-titulo', type: 'titulo', title: '¡Qué diferente!', subtitle: 'Comparativos y Superlativos', markdown: '' },
    { id: 'modulo2-4-mision', type: 'mision', markdown: `Aprender a **comparar cosas en inglés** 🆚: decir si algo es *más grande que* otra cosa, o *el más grande de todos*. Vas a dominar los **comparativos** (\`-er\` / \`more\`) y los **superlativos** (\`-est\` / \`the most\`), sus reglas de ortografía y los irregulares básicos. 💪` },
    { id: 'modulo2-4-intro', type: 'intro', markdown: `¡Hola otra vez! Soy **{{mascot}}** {{mascotEmoji}}💬. Hoy suben al bus dos pasajeros bien competitivos: uno grita *"I am taller!"* 🙋 y el otro *"No, I'm faster!"* 🏃. ¡Y me toca arbitrar la pelea de "**más que**" y "**el más**"! ⚖️

En inglés, a veces agregamos **\`+er\`** para decir "más" y **\`+est\`** para decir "el más"... pero ojo, **depende del largo del adjetivo** 📏. Desde *"Mi bus es más rápido que tu combi"* 😎 hasta *"Este es el mejor ceviche del mundo"* 🦐. ¡Vamos a comparar todo!` },
    { id: 'modulo2-4-teoria-1', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `#### **1️⃣ Comparativos (más... que)**

**Adjetivos cortos** (1 sílaba, o de 2 sílabas terminadas en \`-y\`) → agrega **\`-er\`**:

  | Adjetivo | Comparativo | Ejemplo                          |
  | -------- | ----------- | -------------------------------- |
  | small    | smaller     | This room is **smaller** than the other one. |
  | fast     | faster      | My car is **faster** than yours. |

> 💡 **Ortografía:**
> - Termina en \`-y\` → cambia a \`-ier\`: *happy → happier* 😊
> - Vocal+consonante tónica (CVC) → duplica: *big → bigger* 🔡

**Adjetivos largos** (2+ sílabas que NO terminan en \`-y\`, o de 3+) → usa **\`more\` / \`less\` + adjetivo**:

  | Adjetivo    | Comparativo       | Ejemplo                                |
  | ----------- | ----------------- | -------------------------------------- |
  | expensive   | more expensive    | Lima is **more crowded** than Arequipa. |
  | difficult   | less difficult    | This exercise is **less difficult** than the previous one. |

📌 **\`than\` = "que"** y siempre va *después* del comparativo: *My brother is older **than** me.*

📌 **Igualdad** → \`as ... as\` ("tan... como"): *He is **as tall as** his father.* / *The bus isn't **as new as** the car.*`,
      miniQuiz: [
        mc('My car is ___ than yours. (fast)', ['more fast', 'faster', 'fastest', 'most fast'], 1),
        mc('She is happy. → She is ___ than before.', ['more happy', 'happier', 'happyer', 'happiest'], 1),
        mc('"Tan fuerte como" se dice:', ['as strong as', 'so strong as', 'than strong', 'more strong as'], 0),
        mc('My brother is older ___ me.', ['that', 'then', 'than', 'as'], 2),
        mc('Un adjetivo corto (1 sílaba) en comparativo lleva...', ['-er', 'more', 'the most', '-est'], 0),
        tap('Toca la palabra incorrecta:', ['This', 'phone', 'is', 'faster', 'but', 'expensiver', 'than', 'that', 'one.'], 5, 'more expensive'),
        tap('Toca la palabra incorrecta:', ['She', 'is', 'taller', 'and', 'smarter', 'but', 'lazyer', 'than', 'me.'], 6, 'lazier'),
        rebuild('Escucha y reconstruye:', 'He is taller than me', ['He', 'is', 'taller', 'than', 'me', 'tall', 'more', 'then', 'as']),
      ] },
    { id: 'modulo2-4-teoria-2', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `#### **2️⃣ Superlativos (el más... de todos)**

**Adjetivos cortos** → agrega **\`-est\`** y pon **\`the\`** delante:

  | Adjetivo | Superlativo   | Ejemplo                                  |
  | -------- | ------------- | ---------------------------------------- |
  | fast     | the fastest   | {{mascot}} is **the fastest** robot in the city. 🤖 |
  | high     | the highest   | Mount Everest is **the highest** mountain in the world. 🏔️ |

> 💡 **Ortografía** (igual que antes): *happy → the happiest* 😄 / *big → the biggest* 🔡

**Adjetivos largos** → usa **\`the most\` / \`the least\`**:

  | Adjetivo   | Superlativo          | Ejemplo                          |
  | ---------- | -------------------- | -------------------------------- |
  | important  | the most important   | This is **the most important** lesson. |
  | nervous    | the least nervous    | He was **the least nervous** speaker. |

📌 **\`in\`** para lugares/grupos, **\`of\`** para periodos:
- She is the smartest **in** the class. 🏫
- It was the coldest day **of** the year. ❄️`,
      miniQuiz: [
        mc('{{mascot}} is ___ robot in the city. (fast)', ['the fastest', 'the most fast', 'fastest', 'the faster'], 0),
        mc('This is ___ lesson. (important)', ['the importantest', 'the most important', 'most important', 'the more important'], 1),
        mc('She is the smartest ___ the class.', ['of', 'in', 'on', 'at'], 1),
        mc('It was the coldest day ___ the year.', ['in', 'on', 'of', 'at'], 2),
        mc('Un adjetivo largo en superlativo lleva...', ['the most', '-est', 'more', 'the -er'], 0),
        tap('Toca la palabra incorrecta:', ['This', 'is', 'the', 'easyest', 'exercise', 'in', 'the', 'book.'], 3, 'easiest'),
        tap('Toca la palabra incorrecta:', ['Mount', 'Everest', 'is', 'highest', 'mountain', 'here.'], 3, 'the highest'),
        rebuild('Escucha y reconstruye:', 'She is the smartest in the class', ['She', 'is', 'the', 'smartest', 'in', 'the', 'class', 'most', 'smart', 'smarter']),
      ] },
    { id: 'modulo2-4-teoria-3', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `#### **3️⃣ Irregulares (los rebeldes 😏)**

Algunos adjetivos **no siguen las reglas**. Hay que memorizarlos, ¡pero son poquitos y muy usados!

  | Adjetivo | Comparativo          | Superlativo              |
  | -------- | -------------------- | ------------------------ |
  | good 👍  | better (than)        | the best                 |
  | bad 👎   | worse (than)         | the worst                |
  | far 🛣️   | farther / further    | the farthest / furthest  |

**Ejemplos:**
- Ceviche is **better** than pizza. 🦐 → Ceviche is **the best**! 🏆
- This exam was bad, but that one was **worse**. → It was **the worst** of my life! 😱

> 🚫 **¡Nunca!** No existen *gooder*, *more good*, *goodest* ni *baddest*. Son *good → better → the best* y *bad → worse → the worst*. ¡Apréndetelos de memoria! 🧠`,
      miniQuiz: [
        mc('Ceviche is ___ than pizza. (good)', ['gooder', 'more good', 'better', 'the best'], 2),
        mc('Ceviche is ___! (good, superlativo)', ['the goodest', 'the best', 'the most good', 'the better'], 1),
        mc('That exam was ___ than this one. (bad)', ['worse', 'badder', 'more bad', 'the worst'], 0),
        mc('It was ___ exam of my life! (bad, superlativo)', ['the baddest', 'the worst', 'the most bad', 'worse'], 1),
        mc('¿Cuál NO existe en inglés?', ['better', 'the best', 'gooder', 'worse'], 2),
        tap('Toca la palabra incorrecta:', ['This', 'pizza', 'is', 'good', 'but', 'ceviche', 'is', 'gooder.'], 7, 'better'),
        tap('Toca la palabra incorrecta:', ['Today', 'was', 'bad', 'but', 'yesterday', 'was', 'worser.'], 6, 'worse'),
        rebuild('Escucha y reconstruye:', 'This is the best ceviche', ['This', 'is', 'the', 'best', 'ceviche', 'goodest', 'better', 'good', 'most']),
      ] },
    { id: 'modulo2-4-errores', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `#### **🚫 Errores Comunes**

Estos son los resbalones más típicos. ¡Caza al intruso! 🕵️

- ❌ My sister is *more tall* than me. → ✅ **taller** (corto = \`-er\`, no \`more\`)
- ❌ Your phone is *expensiver* than mine. → ✅ **more expensive** (largo = \`more\`, no \`-er\`)
- ❌ This is *the most easy* exercise. → ✅ **the easiest**
- ❌ He is *the most smart* in the team. → ✅ **the smartest**
- ❌ Mount Everest is *highest* mountain. → ✅ **the highest** (¡no olvides el \`the\`!)
- ❌ The Amazon is *the longer* river in the world. → ✅ **the longest** (superlativo, no comparativo)
- ❌ This is *the goodest* / *more good*. → ✅ **the best** / **better** (¡irregular!)

> 💡 **Truco:** corto → \`-er\`/\`-est\`; largo → \`more\`/\`most\`. Y en superlativo, ¡siempre \`the\`! ⚖️`,
      miniQuiz: [
        tap('Toca la palabra incorrecta:', ['Your', 'new', 'phone', 'is', 'expensiver', 'than', 'mine.'], 4, 'more expensive'),
        tap('Toca la palabra incorrecta:', ['This', 'is', 'the', 'easyest', 'exercise', 'here.'], 3, 'easiest'),
        tap('Toca la palabra incorrecta:', ['He', 'is', 'smarter', 'but', 'she', 'is', 'smartest.'], 6, 'the smartest'),
        tap('Toca la palabra incorrecta:', ['The', 'Amazon', 'is', 'the', 'longer', 'river', 'in', 'the', 'world.'], 4, 'longest'),
        tap('Toca la palabra incorrecta:', ['Ceviche', 'is', 'the', 'goodest', 'food', 'ever.'], 3, 'best'),
        tap('Toca la palabra incorrecta:', ['I', 'think', 'Everest', 'is', 'highest', 'mountain', 'here.'], 4, 'the highest'),
        tap('Toca la palabra incorrecta:', ['Today', 'she', 'is', 'happyer', 'than', 'yesterday.'], 3, 'happier'),
        tap('Toca la palabra incorrecta:', ['This', 'exam', 'was', 'worser', 'than', 'the', 'last', 'one.'], 3, 'worse'),
      ] },
    { id: 'modulo2-4-resumen', type: 'resumen', markdown: `## **🎯 Resumen práctico que debes recordar**

* ✅ **Cortos** (1 sílaba o \`-y\`) → comparativo \`-er\`, superlativo \`the ... -est\`. *(fast → faster → the fastest)* 🏃
* ✅ **Largos** (2+ sílabas) → comparativo \`more\`, superlativo \`the most\`. *(expensive → more expensive → the most expensive)* 💸
* ✅ Comparativo **siempre con \`than\`** (que). Superlativo **siempre con \`the\`**. ⚖️
* ✅ Igualdad → \`as ... as\` (tan... como). 🤝
* ✅ Lugares/grupos → \`in\`; periodos → \`of\`. 📍
* ✅ **Irregulares:** *good → better → the best* 🏆; *bad → worse → the worst* 😱; *far → farther → the farthest* 🛣️.

¡Así de fácil! 😉 Corto suma letras, largo suma palabras. 📏` },
    { id: 'modulo2-4-cierre', type: 'cierre', markdown: `#### **🌟 Cierre**

¡Y listo! 🏅 Ya puedes hacer **batallas de comparaciones** como todo un experto. 🥊

Recuerda:
* \`-er\`/\`-est\` con los **cortos**.
* \`more\`/\`most\` con los **largos**.
* Siempre \`than\` en comparativos y \`the\` en superlativos.
* Y los irregulares: *good, better, the best*; *bad, worse, the worst*. 🧠

✅ **Misión cumplida:** ahora arbitra esta pelea → *"Juan is smart, but Carlos is **smarter than** Juan. However, Lucy is **the smartest** of all."* 😎

**🏅 Insignia obtenida:** ⚖️ *Juez de las Comparaciones* 📏` },
  ],
  quizQuestions: [
    mc('She is ___ than before. (happy)', ['more happy', 'happier', 'happyer', 'the happiest'], 1),
    mc('Your house is ___ in the neighborhood. (big)', ['the biggest', 'the most big', 'biggest', 'the bigger'], 0),
    mc('This puzzle is ___ than that one. (difficult)', ['difficulter', 'less difficult', 'the difficult', 'more difficulter'], 1),
    mc('Ceviche is ___ than pizza. (good)', ['gooder', 'better', 'more good', 'the best'], 1),
    mc('That exam was bad, but this one was ___. It was ___ of my life!', ['worse / the worst', 'worst / the worse', 'badder / the baddest', 'more bad / the most bad'], 0),
    mc('"Tan alto como su padre."', ['as tall as his father', 'so tall as his father', 'tall than his father', 'more tall as his father'], 0),
    mc('Mount Everest is ___ mountain in the world. (high)', ['highest', 'the highest', 'the most high', 'the higher'], 1),
    mc('Adjetivo largo (expensive) en comparativo:', ['expensiver', 'more expensive', 'the most expensive', 'expensivest'], 1),
    mc('She is the smartest ___ the class.', ['of', 'in', 'on', 'at'], 1),
    tap('Toca la palabra incorrecta:', ['Your', 'phone', 'is', 'expensiver', 'than', 'mine.'], 3, 'more expensive'),
    tap('Toca la palabra incorrecta:', ['The', 'Amazon', 'is', 'the', 'longer', 'river', 'here.'], 4, 'longest'),
    tap('Toca la palabra incorrecta:', ['Ceviche', 'is', 'the', 'goodest', 'food', 'ever.'], 3, 'best'),
    rebuild('Escucha y reconstruye:', 'María is the youngest of her siblings', ['María', 'is', 'the', 'youngest', 'of', 'her', 'siblings', 'oldest', 'than', 'more']),
    rebuild('Escucha y reconstruye:', 'He is as strong as his brother', ['He', 'is', 'as', 'strong', 'as', 'his', 'brother', 'than', 'more', 'the']),
    rebuild('Escucha y reconstruye:', 'This book is better than that one', ['This', 'book', 'is', 'better', 'than', 'that', 'one', 'gooder', 'more', 'then']),
  ],
};

const modulo2_5 = {
  id: 'modulo2-5',
  title: 'Microlección 5',
  durationMinutes: 12,
  audioCues: ['Escucha el contenido de la lección.', 'Fíjate en los puntos clave.', 'Ahora vienen tus ejercicios.'],
  contentBlocks: [
    { id: 'modulo2-5-titulo', type: 'titulo', title: '¿Qué puedo hacer?', subtitle: 'Modal can / can\'t (habilidad y permiso)', markdown: '' },
    { id: 'modulo2-5-mision', type: 'mision', markdown: `Aprender a usar **can** (poder) para dos cosas geniales: expresar tus **habilidades** (lo que sabes hacer 💪) y **pedir o dar permiso** (¿Puedo…?). Verás la forma **afirmativa**, **negativa** (*can't*) e **interrogativa**, y descubrirás cuándo usar **could** para sonar más cortés. 🎩` },
    { id: 'modulo2-5-intro', type: 'intro', markdown: `¡Hola! Soy **{{mascot}}**😊. Hoy subes un mago al bus 🎩… ¡y ese mago eres **tú** con **can**!

Con **can** dices lo que **sabes hacer**, lo que **puedes** o **no puedes**, y hasta pides **permiso**. Mira qué fácil:

> *"I can swim."* 🏊
> *"Can I open the window?"* 🪟

🤓 **Secreto {{mascot}}:** en situaciones formales, **could** es tu as bajo la manga para pedir permiso con **más cortesía**. ¡Guárdalo para impresionar! ✨` },
    { id: 'modulo2-5-teoria-1', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**1.** **Habilidad y permiso con can**

**can** es un **verbo modal**. Esto significa tres reglas de oro 🥇:

- **Nunca** lleva **"to"** después.
- **Nunca** lleva **"s"** en el verbo siguiente.
- **can nunca cambia** (no existe *cans*).

La estructura es siempre: **sujeto + can + verbo base**.

**💪 Habilidad** (saber hacer algo):

  | Español                    | Inglés                    |
  | -------------------------- | ------------------------- |
  | Yo sé conducir.            | I can drive.              |
  | Mi hermana habla francés.  | My sister can speak French. |
  | Él no sabe nadar.          | He can't swim.            |

> **Ojo:** *can't = cannot* → expresa **incapacidad**. 🚫

**🙋 Permiso** (pedir o dar):

> *"Can I open the window?"* → *"Yes, you can."* / *"No, you can't."*
> *"Mom, can I go out?"* 🧒`,
      miniQuiz: [
        mc('"Ella sabe conducir."', ['She can drives.', 'She can drive.', 'She cans drive.', 'She can to drive.'], 1),
        mc('"Él no sabe nadar."', ["He can't swim.", "He can't swims.", 'He no can swim.', "He doesn't can swim."], 0),
        mc('"Mamá, ¿puedo salir?"', ['Mom, can I go out?', 'Mom, can I to go out?', 'Mom, do I can go out?', 'Mom, can I going out?'], 0),
        mc('¿Cuál es correcta?', ['My sister can speaks French.', 'My sister cans speak French.', 'My sister can speak French.', 'My sister can to speak French.'], 2),
        mc('Después de "can", el verbo va...', ['en forma base (sin to, sin s)', 'con -s', 'con to', 'con -ing'], 0),
        tap('Toca la palabra incorrecta:', ['She', 'can', 'sing', 'and', 'she', 'can', 'dances.'], 6, 'dance'),
        tap('Toca la palabra incorrecta:', ['He', 'can', 'cook', 'and', 'cans', 'drive.'], 4, 'can'),
        rebuild('Escucha y reconstruye:', 'I can swim well', ['I', 'can', 'swim', 'well', 'cans', 'swims', "can't", 'will']),
      ] },
    { id: 'modulo2-5-teoria-2', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**2.** **Preguntas, negativas y el cortés could**

**❓ Interrogativa:** **Can + sujeto + verbo** (¡sin *do*!):

> *"Can you play the guitar?"* 🎸
> *"Can he come in?"*

**🚫 Negativa:** **cannot / can't** + verbo base:

> *"I can't swim."*
> *"She can't come to the party."*

**🎩 could (más cortés):** *could = podría*, suaviza la pregunta y suena más elegante:

> *"Could I open the window, please?"*
> *"Could you help me?"*

En contextos formales: **Could I…? > Can I…?** 🤝

  | Forma         | Cortesía          |
  | ------------- | ----------------- |
  | Can I…?       | Normal / informal |
  | Could I…?     | Más cortés ✅      |
  | May I…?       | Muy formal        |

**✅ Respuestas cortas:**

> *"Can you drive?"* → *"Yes, I can."* / *"No, I can't."*`,
      miniQuiz: [
        mc('"¿Puedo sentarme aquí?"', ['Do I can sit here?', 'Can I sit here?', 'Can I to sit here?', 'Can I sitting here?'], 1),
        mc('"¿Podría usar su teléfono?" (cortés)', ['Could I use your phone?', 'Could I to use your phone?', 'Can I uses your phone?', 'Could I using your phone?'], 0),
        mc("Can Maria speak Japanese? – No, ___.", ["she can't", "she don't", "she cans't", "she not can"], 0),
        mc('(muy cortés, a un desconocido) "¿Podrías tomarme una foto?"', ['Can you take a photo of me, please?', 'Could you take a photo of me, please?', 'Do you can take a photo of me?', 'Could you to take a photo of me?'], 1),
        mc('Para preguntar con "can", el orden es...', ['Can + sujeto + verbo', 'Do + sujeto + can', 'Sujeto + can + ?', 'Can + verbo + sujeto'], 0),
        tap('Toca la palabra incorrecta:', ['Can', 'you', 'swim', 'and', 'can', 'you', 'drives?'], 6, 'drive'),
        tap('Toca la palabra incorrecta:', ['She', 'can', 'sing', 'but', 'she', "can't", 'dances.'], 6, 'dance'),
        rebuild('Escucha y reconstruye:', "We can't come tomorrow", ['We', "can't", 'come', 'tomorrow', 'cans', 'can', 'comes', 'go']),
      ] },
    { id: 'modulo2-5-errores', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `#### **🚫 Errores Comunes**

¡Cuidado con estas trampas! Toca la palabra **incorrecta** para corregirla. 👇

  | ❌ Incorrecto                | ✅ Correcto                |
  | --------------------------- | ------------------------- |
  | He can **to** sing well.    | He can sing well.         |
  | She **cans** speak Italian. | She can speak Italian.    |
  | **Do** you can drive?       | Can you drive?            |
  | I **no** can go.            | I can't go.               |
  | Could I **to** have a pen?  | Could I have a pen?       |

> **Recuerda:** después de **can** va el **verbo base** solito: sin *to*, sin *s*, sin *do*. ¡can es independiente! 💪`,
      miniQuiz: [
        tap('Toca la palabra incorrecta:', ['He', 'can', 'to', 'sing', 'very', 'well.'], 2, '(quítalo)'),
        tap('Toca la palabra incorrecta:', ['She', 'cans', 'speak', 'Italian', 'and', 'French.'], 1, 'can'),
        tap('Toca la palabra incorrecta:', ['He', 'can', 'swim', 'but', 'he', 'cant', 'dive.'], 5, "can't"),
        tap('Toca la palabra incorrecta:', ['Could', 'I', 'to', 'have', 'a', 'pen?'], 2, '(quítalo)'),
        tap('Toca la palabra incorrecta:', ['Can', 'you', 'drive', 'and', 'cans', 'you', 'cook?'], 4, 'can'),
        tap('Toca la palabra incorrecta:', ['She', 'can', 'to', 'play', 'the', 'guitar.'], 2, '(quítalo)'),
        tap('Toca la palabra incorrecta:', ['They', 'can', 'sings', 'and', 'dance', 'well.'], 2, 'sing'),
        tap('Toca la palabra incorrecta:', ['I', 'can', 'help', 'and', 'she', 'cans', 'cook.'], 5, 'can'),
      ] },
    { id: 'modulo2-5-resumen', type: 'resumen', markdown: `**🎩 Resumen mágico de can / can't:**

- **can** = poder / saber hacer algo (habilidad) y pedir permiso.
- Estructura: **sujeto + can + verbo base** (sin *to*, sin *s*).
- **Negativa:** *can't (cannot)* → *I can't swim.*
- **Pregunta:** *Can + sujeto + verbo* → *Can you drive?* (¡sin *do*!).
- **could** = más cortés → *Could you help me?*

  | Función     | Ejemplo                    |
  | ----------- | -------------------------- |
  | Habilidad   | I can cook. 🍳             |
  | Negativa    | I can't dance. 💃          |
  | Permiso     | Can I go out?              |
  | Cortesía    | Could I have a pen?        |` },
    { id: 'modulo2-5-cierre', type: 'cierre', markdown: `¡Ya usas **can** como campeón 💫! Puedes contar qué puedes hacer (*I can cook, I can sing, but I can't dance*) y pedir con **Can I…?** / **Could I…?** con toda la elegancia. 🎩

✅ **Misión cumplida:** responde *"What can you do that's unique?"* con *"I can…"*; y cuando practiques conmigo *"Can I get off here?"*, yo te responderé *"Yes, you can!"* 😄

🏅 **Insignia obtenida:** **Superhabilidos@** (Dominio de can / can't). ¡A volar! 🦸` },
  ],
  quizQuestions: [
    mc('"Ella sabe conducir."', ['She can drives.', 'She can drive.', 'She cans drive.', 'She can to drive.'], 1),
    mc('"¿Puedo sentarme aquí?"', ['Can I sit here?', 'Can I to sit here?', 'Do I can sit here?', 'Can I sitting here?'], 0),
    mc('"¿Podría usar su teléfono?" (cortés)', ['Can I uses your phone?', 'Could I use your phone?', 'Could I to use your phone?', 'Do I could use your phone?'], 1),
    mc('"¿Puedes hablar más fuerte, por favor?"', ['Can you speak louder, please?', 'Do you can speak louder?', 'Can you to speak louder?', 'Can you speaks louder?'], 0),
    mc("Can Maria speak Japanese? – No, ___.", ["she can't", "she don't", 'she no can', "she cans't"], 0),
    mc('(muy cortés, a un desconocido) "¿Podrías tomarme una foto?"', ['Can you take a photo of me, please?', 'Could you take a photo of me, please?', 'Do you can take a photo of me?', 'Could you to take a photo of me?'], 1),
    mc('¿Cuál es correcta?', ['My sister cans speak French.', 'My sister can speak French.', 'My sister can speaks French.', 'My sister can to speak French.'], 1),
    mc('Después de "can", el verbo va...', ['en forma base', 'con -s', 'con to', 'con -ing'], 0),
    mc('"Él no puede levantar esa caja."', ["He can't lift that box.", "He cans't lift that box.", 'He no can lift that box.', "He doesn't can lift that box."], 0),
    tap('Toca la palabra incorrecta:', ['He', 'can', 'to', 'sing', 'very', 'well.'], 2, '(quítalo)'),
    tap('Toca la palabra incorrecta:', ['She', 'cans', 'speak', 'Italian', 'and', 'French.'], 1, 'can'),
    tap('Toca la palabra incorrecta:', ['Could', 'I', 'to', 'have', 'a', 'pen?'], 2, '(quítalo)'),
    rebuild('Escucha y reconstruye:', "We can't come tomorrow", ['We', "can't", 'come', 'tomorrow', 'cans', 'can', 'comes', 'go']),
    rebuild('Escucha y reconstruye:', "He can't lift that box", ['He', "can't", 'lift', 'that', 'box', 'cans', 'can', 'lifts']),
    rebuild('Escucha y reconstruye:', 'Can you help me', ['Can', 'you', 'help', 'me', 'cans', 'helps', 'do', 'can']),
  ],
};

const modulo2_6 = {
  id: 'modulo2-6',
  title: 'Microlección 6',
  durationMinutes: 13,
  audioCues: ['Escucha el contenido de la lección.', 'Fíjate en los puntos clave.', 'Ahora vienen tus ejercicios.'],
  contentBlocks: [
    { id: 'modulo2-6-titulo', type: 'titulo', title: '¿Debo o tengo que?', subtitle: 'Modales should vs. must', markdown: '' },
    { id: 'modulo2-6-mision', type: 'mision', markdown: `Aprender a **diferenciar y usar should y must** (ambos se traducen como "deber") 😇😈. Con **should** das **consejos y recomendaciones**; con **must** expresas **obligaciones firmes y reglas**. También verás **have to** ("tener que") y, lo más importante, **cómo negar cada uno** sin meter la pata.` },
    { id: 'modulo2-6-intro', type: 'intro', markdown: `¡Hola otra vez! Soy **{{mascot}}** {{mascotEmoji}}💬 y hoy entran dos invitados muy peleados: la **Agente Should** 😇 y el **Agente Must** 😈, como el angelito y el diablito de tu hombro.

* La **Agente Should** 😇 te **susurra consejos**: "deberías estudiar" 📚, "deberías descansar". Son **sugerencias**, no te obliga a nada.
* El **Agente Must** 😈 **impone reglas**: "debes hacerlo, sí o sí" 💼. Es una **obligación fuerte**.

Y aparece su primo **Have to** 👮 ("tener que"), que muchas veces es una obligación que viene **de afuera** (el jefe, la ley, las reglas).

  > 💡 **Resumen relámpago:** **should** = deberías (sugerencia); **must** = debes (obligación fuerte); **have to** = tener que (a veces externa).` },
    { id: 'modulo2-6-teoria-1', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**1.** **Should y Must (forma + uso)** 😇😈

Tanto **should** como **must** son **modales**, y los modales tienen reglas riquísimas porque son **bien flojitos** 😴:

  * Van **+ verbo base sin "to"**: ✅ *You should study.* / ✅ *You must wear a mask.*
  * **NO cambian** con he/she/it (¡nada de "musts" ni "shoulds"!): ✅ *He must finish.*
  * La **negación** es **+ not**: *shouldn't*, *mustn't*.
  * Para **preguntas** se **invierten**: *Should I…?*, *Must we…?* (sin "do").

**🟢 should (consejo / sería buena idea):**

  | Español                          | Inglés                          |
  | -------------------------------- | ------------------------------- |
  | Deberías estudiar más.           | You should study harder.        |
  | Él debería ver a un doctor.      | He should see a doctor.         |
  | ¿Debería disculparme?            | Should I apologize?             |

**🔴 must (obligación fuerte / regla):**

  | Español                              | Inglés                          |
  | ------------------------------------ | ------------------------------- |
  | Los pasajeros deben usar mascarilla. | Passengers must wear a mask.    |
  | Debo terminar este reporte a las 5.  | I must finish this report by 5. |
  | No debes fumar aquí. (prohibición)   | You mustn't smoke here.         |

En letreros lo verás muchísimo: **Visitors must present ID** 🪪.`, miniQuiz: [
        mc('Los modales should/must van seguidos de…', ['verbo base sin "to"', 'verbo + to', 'verbo con -ing', 'verbo + -s'], 0),
        mc('¿Cuál es correcta para dar un consejo?', ['You should studies harder.', 'You should study harder.', 'You should to study harder.', 'You shoulds study harder.'], 1),
        mc('Para una obligación fuerte (regla del lugar):', ['Passengers must wear a mask.', 'Passengers musts wear a mask.', 'Passengers must to wear a mask.', 'Passengers must wears a mask.'], 0),
        mc('¿Cómo preguntas "¿Debería disculparme?" con un modal?', ['Do I should apologize?', 'Should I apologize?', 'I should apologize?', 'Should I to apologize?'], 1),
        mc('La negación de "should" es...', ["shouldn't", "don't should", "doesn't should", "should not to"], 0),
        tap('Toca la palabra incorrecta:', ['You', 'should', 'rest', 'and', 'you', 'should', 'drinks', 'water.'], 6, 'drink'),
        tap('Toca la palabra incorrecta:', ['He', 'must', 'finish', 'and', 'he', 'must', 'to', 'leave.'], 6, '(quítalo)'),
        rebuild('Escucha y reconstruye:', 'He should see a doctor', ['He', 'should', 'see', 'a', 'doctor', 'must', 'sees', 'to', 'shouldnt']),
      ] },
    { id: 'modulo2-6-teoria-2', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**2.** **Have to y las negaciones clave** 👮⚠️

**have to = tener que.** A diferencia de los modales flojitos, **have to SÍ se conjuga normal**: *has to* (he/she/it), *had to* (pasado).

  > 💡 **Ojito con el pasado:** **must NO tiene pasado**. Para el pasado de la obligación, usas **had to**.

**must vs. have to (matiz):**

  * *I **must** call my mom.* → me nace a mí, es algo que yo siento 💚.
  * *I **have to** call my mom.* → obligación más **externa** (me toca, me lo pidieron).
  * En nivel A2, en **presente** son casi **intercambiables** 🤝.

**¡Y aquí el error que separa a los pros! 🚨 La negación es DISTINTA:**

  | Negación          | Significado                     | Ejemplo                                     |
  | ----------------- | ------------------------------- | ------------------------------------------- |
  | **mustn't**       | NO debes (prohibido) 🚫         | You mustn't use the phone while driving.    |
  | **don't have to** | NO tienes que (no es necesario) | You don't have to call me "Sir".            |

  > 🎯 **Resumen:** **should** = consejo (*You should rest*); **must / have to** = obligación (*You must / have to come on time*). **shouldn't** = no deberías; **mustn't** = prohibido; **don't have to** = opcional.`, miniQuiz: [
        mc('"Tenemos que usar uniforme, es política de la empresa."', ['We should wear a uniform.', 'We have to wear a uniform.', "We mustn't wear a uniform.", 'We have wear a uniform.'], 1),
        mc('Algo que está PROHIBIDO: "No debes usar el celular manejando."', ["You don't have to use the phone while driving.", "You mustn't use the phone while driving.", 'You should use the phone while driving.', 'You have to use the phone while driving.'], 1),
        mc('Algo que NO es necesario (no es obligatorio):', ["You mustn't call me Sir.", "You don't have to call me Sir.", "You must call me Sir.", "You should call me Sir."], 1),
        mc('El pasado de "must" (obligación) se dice con…', ['musted', 'must', 'had to', 'have to'], 2),
        mc('Tercera persona de "have to" (he/she):', ['have to', 'has to', 'haves to', 'must to'], 1),
        tap('Toca la palabra incorrecta:', ['She', 'has', 'to', 'work', 'and', 'he', 'have', 'to', 'study.'], 6, 'has'),
        tap('Toca la palabra incorrecta:', ['You', 'must', 'wear', 'a', 'helmet', 'and', 'you', 'mustnt', 'speed.'], 7, "mustn't"),
        rebuild('Escucha y reconstruye:', 'I have to help my mom today', ['I', 'have', 'to', 'help', 'my', 'mom', 'today', 'should', 'must', 'has']),
      ] },
    { id: 'modulo2-6-errores', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `#### **🚫 Errores Comunes**

Estos son los resbalones clásicos con should y must. ¡Detéctalos antes de que te traicionen! 😈

  * ❌ *He should **to** exercise more.* → ✅ *He should exercise more.* (modal sin "to")
  * ❌ *You must **to** wear a helmet.* → ✅ *You must wear a helmet.*
  * ❌ *She **musts** finish her work.* → ✅ *She must finish her work.* (modales NO llevan -s)
  * ❌ *We **don't must** forget.* → ✅ *We mustn't forget.* (modal se niega con not)
  * ❌ *You shouldn't **to** be late.* → ✅ *You shouldn't be late.*
  * ❌ ***Do I must** attend the meeting?* → ✅ *Must I attend the meeting?* / *Do I have to attend the meeting?*

  > 💡 **Truco:** los modales (should/must) son flojitos: **sin "to", sin "-s", y se niegan/preguntan solitos** (sin "do").`, miniQuiz: [
        tap('Toca la palabra incorrecta:', ['He', 'should', 'to', 'exercise', 'more.'], 2, '(quítalo)'),
        tap('Toca la palabra incorrecta:', ['You', 'must', 'to', 'wear', 'a', 'helmet.'], 2, '(quítalo)'),
        tap('Toca la palabra incorrecta:', ['She', 'musts', 'finish', 'her', 'work.'], 1, 'must'),
        tap('Toca la palabra incorrecta:', ['You', "shouldn't", 'to', 'be', 'late.'], 2, '(quítalo)'),
        tap('Toca la palabra incorrecta:', ['You', 'should', 'rest', 'and', 'shoulds', 'sleep.'], 4, 'should'),
        tap('Toca la palabra incorrecta:', ['He', 'must', 'study', 'and', 'he', 'musts', 'practice.'], 5, 'must'),
        tap('Toca la palabra incorrecta:', ['We', 'should', 'go', 'and', 'we', 'should', 'to', 'hurry.'], 6, '(quítalo)'),
        tap('Toca la palabra incorrecta:', ['She', 'has', 'to', 'work', 'and', 'he', 'have', 'to', 'help.'], 6, 'has'),
      ] },
    { id: 'modulo2-6-resumen', type: 'resumen', markdown: `## **🎯 Resumen práctico que debes recordar**

* ✅ **should** = **consejo / sugerencia** 😇 → *You should rest.* ("deberías")
* ✅ **must / have to** = **obligación** 😈👮 → *You must / have to come on time.* ("debes / tienes que")
* ✅ Modales (should/must): **+ verbo base, sin "to", sin "-s"**, y se niegan/preguntan **sin "do"**.
* ✅ **have to** sí se conjuga: *has to*, *had to* (y **had to** es el pasado de *must*).

**¡La negación es lo más importante!** 🚨

  | shouldn't  | no deberías (mal consejo) |
  | ---------- | ------------------------- |
  | mustn't    | prohibido 🚫              |
  | don't have to | opcional, no es necesario |` },
    { id: 'modulo2-6-cierre', type: 'cierre', markdown: `#### **🌟 Cierre**

¡Lo lograste! 🎖 Ahora manejas a la **Agente Should** 😇, al **Agente Must** 😈 y a su primo **Have to** 👮.

Ya sabes **dar consejos** (*You should practice English every day*) y **poner reglas** (*You must follow safety rules*), y sobre todo **suavizar** la diferencia entre *don't have to* (opcional) y *mustn't* (prohibido).

✅ **Misión cumplida:** *"You should take a break"*; *"You mustn't jump off a moving bus!"*; y si alguien pregunta *"Should I bring snacks for the trip?"*, ya sabes responder: **"Yes, you should!"** 😋

**🏅 Insignia obtenida:** ✨ *Consejer@ & Capataz* (Maestría en Should vs Must) 🎖️📜` },
  ],
  quizQuestions: [
    mc('Drivers ___ stop at a red light. (es la ley)', ['should', 'must', 'would', 'have'], 1),
    mc("We ___ wear a uniform at work, it's company policy.", ['should', 'have to', "mustn't", 'must to'], 1),
    mc('(Prohibición) You ___ use your phone during the exam.', ["don't have to", "shouldn't", "mustn't", 'should'], 2),
    mc("(No es necesario) You ___ come if you don't want.", ["mustn't", "don't have to", 'must', 'should'], 1),
    mc('"¿Debo abrir la tienda mañana temprano?" (consejo)', ['Should I open the shop early tomorrow?', 'Must I open the shop early tomorrow?', 'Do I should open the shop early tomorrow?', 'Should I to open the shop early tomorrow?'], 0),
    mc('Los modales (should/must) van seguidos de...', ['verbo base sin "to"', 'verbo + to', 'verbo + -ing', 'verbo + -s'], 0),
    mc('El pasado de "must" es...', ['musted', 'had to', 'must', 'haved to'], 1),
    mc('"Deberías ver a un doctor."', ['You should to see a doctor.', 'You should see a doctor.', 'You shoulds see a doctor.', 'You should sees a doctor.'], 1),
    tap('Toca la palabra incorrecta:', ['He', 'should', 'to', 'exercise', 'more.'], 2, '(quítalo)'),
    tap('Toca la palabra incorrecta:', ['She', 'musts', 'finish', 'her', 'work.'], 1, 'must'),
    tap('Toca la palabra incorrecta:', ['You', 'must', 'to', 'wear', 'a', 'helmet.'], 2, '(quítalo)'),
    rebuild('Escucha y reconstruye:', 'You should drink more water', ['You', 'should', 'drink', 'more', 'water', 'must', 'have', 'to']),
    rebuild('Escucha y reconstruye:', "We shouldn't spend so much money", ['We', "shouldn't", 'spend', 'so', 'much', 'money', "mustn't", 'have']),
    rebuild('Escucha y reconstruye:', 'I have to help my mom today', ['I', 'have', 'to', 'help', 'my', 'mom', 'today', 'should', 'must']),
    rebuild('Escucha y reconstruye:', 'You must wear a helmet', ['You', 'must', 'wear', 'a', 'helmet', 'should', 'to', 'wears']),
  ],
};

const modulo2_7 = {
  id: 'modulo2-7',
  title: 'Microlección 7',
  durationMinutes: 12,
  audioCues: ['Escucha el contenido de la lección.', 'Fíjate en los puntos clave.', 'Ahora vienen tus ejercicios.'],
  contentBlocks: [
    { id: 'modulo2-7-titulo', type: 'titulo', title: 'Me gusta o no me gusta', subtitle: 'Expresar gustos con like/love/hate + -ing', markdown: '' },
    { id: 'modulo2-7-mision', type: 'mision', markdown: `Aprender a **expresar tus gustos, pasiones y disgustos en inglés** usando **like, love, don't like, hate** (y el nuevo **enjoy**) seguidos del verbo en **-ing**. Además, darás **razones** con **because** (porque) para sonar como todo un nativo 😎.` },
    { id: 'modulo2-7-intro', type: 'intro', markdown: `¡Hora de hablar de gustos! 😁 Soy **{{mascot}}** {{mascotEmoji}} y hoy te voy a chismear sobre lo que *te encanta* y lo que *no soportas*.

En español decimos "Me gusta **bailar**" (infinitivo). Pero en inglés, después de **I like** ¡el verbo se pone en **gerundio (-ing)**! 👉 *I like dancing* suena mucho más natural que *I like to dance*.

Y para dar razones usamos **because** (porque): *"I hate waiting **because** it's boring."* ⏳

Ah, y te presento una **palabra nueva**: **enjoy** (disfrutar). Funciona igualito que *like*: *I enjoy reading* 📚.` },
    { id: 'modulo2-7-teoria-1', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**1.** **like / love / hate / enjoy + verbo en -ing**

Cuando quieres decir lo que te gusta hacer, usas estos verbos seguidos del **verbo en -ing**:

| Español | Inglés |
| --- | --- |
| Me gusta cocinar. | I like **cooking**. |
| A ella le encanta bailar. | She loves **dancing**. |
| Odiamos esperar en la fila. | We hate **waiting** in line. |
| ¿Disfrutas leyendo? | Do you enjoy **reading**? |

> 💡 **Ojito:** Con *like/love/hate* también es válido *to + verbo* (*I like to cook*), pero en este nivel enseñamos **-ing** porque suena más natural. **enjoy** SOLO va con **-ing** (nunca *enjoy to* ❌).

Estos verbos se comportan como **verbos normales** en presente:

* **Afirmativo:** *I like cooking.*
* **Negativo** (don't/doesn't): *I don't like cooking.* / *She doesn't like driving at night.*
* **Pregunta** (Do/Does): *Do you like dancing?* / *Does he enjoy hiking?*
* **Respuestas cortas:** *Yes, I do / No, I don't*; *Yes, she does / No, she doesn't.*`,
      miniQuiz: [
        mc('I like ___. (cocinar)', ['cook', 'cooking', 'to cooking', 'cooks'], 1),
        mc("She doesn't like ___ at night. (manejar)", ['drives', 'driving', 'to driving', 'drive'], 1),
        mc('___ you enjoy reading?', ['Does', 'Do', 'Are', 'Is'], 1),
        mc('Después de like/love/hate/enjoy, el verbo va en...', ['-ing', 'forma base', 'con to obligatorio', '-ed'], 0),
        mc('"enjoy" va SIEMPRE con...', ['-ing (nunca "enjoy to")', 'to + verbo', 'verbo base', '-ed'], 0),
        tap('Toca la palabra incorrecta:', ['I', 'like', 'cooking', 'and', 'I', 'love', 'dance.'], 6, 'dancing'),
        tap('Toca la palabra incorrecta:', ['She', 'enjoys', 'reading', 'and', 'hates', 'wait.'], 5, 'waiting'),
        rebuild('🎧 Reconstruye:', 'She loves dancing', ['She', 'loves', 'dancing', 'hates', 'dance', 'loving', 'love', 'dances']),
      ] },
    { id: 'modulo2-7-teoria-2', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**2.** **because (porque) + vocabulario de gustos**

**because** = *porque*. Conecta lo que te gusta con la **razón**:

| Inglés | Español |
| --- | --- |
| I like learning English **because** it's fun. | Me gusta aprender inglés porque es divertido. |
| He doesn't like cats **because** he's allergic. | No le gustan los gatos porque es alérgico. |
| I hate running **because** it's tiring. | Odio correr porque es cansado. |

**Vocabulario de gustos** (de menos a más intenso):

| Inglés | Español |
| --- | --- |
| like | gustar |
| love | encantar / amar |
| enjoy | disfrutar |
| don't like / dislike | no gustar |
| hate | odiar |

> 💡 Para **graduar** la intensidad: *I like it* < *I really like it* < *I love it!* 👉 Se dice **really** like, NUNCA *very like* ❌.

Más ejemplos: *I love listening to music.* / *My friend **enjoys** going to the gym* (¡ojo, *enjoys* con **-s** en tercera persona!). / *We don't like watching horror movies because they scare us.* 🎃`,
      miniQuiz: [
        mc("I like learning English ___ it's fun.", ['why', 'because', 'so', 'but'], 1),
        mc('¿Cuál es CORRECTA?', ['I very like sports', 'I really like sports', 'I like very sports', 'I am like sports'], 1),
        mc('My friend ___ going to the gym.', ['enjoy', 'enjoys', 'enjoying', 'to enjoy'], 1),
        mc('Para intensificar un gusto se usa...', ['really (no "very like")', 'very like', 'much like', 'so much like'], 0),
        mc('"because" significa...', ['porque', 'pero', 'aunque', 'entonces'], 0),
        tap('Toca la palabra incorrecta:', ['He', 'enjoys', 'cooking', 'and', 'she', 'enjoy', 'baking.'], 5, 'enjoys'),
        tap('Toca la palabra incorrecta:', ['I', 'really', 'like', 'tea', 'and', 'I', 'very', 'like', 'coffee.'], 6, 'really'),
        rebuild('🎧 Reconstruye:', 'I love listening to music', ['I', 'love', 'listening', 'to', 'music', 'hate', 'listen', 'loves']),
      ] },
    { id: 'modulo2-7-errores', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `#### **🚫 Errores Comunes**

Estos son los resbalones típicos con los gustos. ¡Cázalos! 🕵️

| ❌ Incorrecto | ✅ Correcto |
| --- | --- |
| I like **dance**. | I like **dancing**. |
| She enjoys **to cook**. | She enjoys **cooking**. |
| Do you like **sing**? | Do you like **singing**? |
| He **doesn't likes** to swim. | He **doesn't like** to swim. |
| **I very like** sports. | **I really like** sports. |
| We hate **wait** for the bus. | We hate **waiting** for the bus. |

Recuerda: tras *like/love/hate/enjoy* va **-ing**; en negativo **doesn't** + verbo base; y para intensificar usa **really**, no *very*. 💪`,
      miniQuiz: [
        tap('Toca la palabra incorrecta:', ['I', 'like', 'cooking', 'and', 'I', 'hate', 'wait.'], 6, 'waiting'),
        tap('Toca la palabra incorrecta:', ['She', 'enjoys', 'reading', 'and', 'cook', 'at', 'home.'], 4, 'cooking'),
        tap('Toca la palabra incorrecta:', ['Do', 'you', 'like', 'dancing', 'and', 'sing?'], 5, 'singing'),
        tap('Toca la palabra incorrecta:', ['I', 'really', 'like', 'tea', 'and', 'very', 'like', 'coffee.'], 5, 'really'),
        tap('Toca la palabra incorrecta:', ['We', 'love', 'swimming', 'but', 'hate', 'run.'], 5, 'running'),
        tap('Toca la palabra incorrecta:', ['He', "doesn't", 'likes', 'swimming.'], 2, 'like'),
        tap('Toca la palabra incorrecta:', ['She', "doesn't", 'enjoys', 'reading.'], 2, 'enjoy'),
        tap('Toca la palabra incorrecta:', ['They', 'enjoy', 'hiking', 'and', 'she', 'enjoy', 'biking.'], 5, 'enjoys'),
      ] },
    { id: 'modulo2-7-resumen', type: 'resumen', markdown: `## **🎯 Resumen: Gustos & Disgustos**

* ✅ Después de **like / love / hate / enjoy** → verbo en **-ing**: *I like cooking.*
* ✅ **enjoy** SIEMPRE con **-ing** (nunca *enjoy to* ❌).
* ✅ **Negativo:** don't / doesn't + verbo base: *She doesn't like driving.*
* ✅ **Pregunta:** Do / Does + sujeto + verbo: *Do you like dancing?*
* ✅ **because** = *porque*, para dar razones: *I hate running because it's tiring.*
* ✅ Para intensificar: *I **really** like it* (¡NUNCA *very like*! ❌).

| Sujeto | Negativo | Pregunta |
| --- | --- | --- |
| I / you / we / they | don't like | Do you like…? |
| he / she / it | doesn't like | Does he enjoy…? |` },
    { id: 'modulo2-7-cierre', type: 'cierre', markdown: `#### **🌟 Cierre**

¡Excelente! 👏 Ya dices **qué te gusta y qué no** con *like / love / hate / enjoy + -ing*, y le sumas el **because** para explicar tus razones 😃.

✅ **Misión cumplida:** responde a *"What do you like to do?"* con algo como:

> *"I like listening to rock music **because** it energizes me."* 🎸

**🏅 Insignia obtenida:** ✨ *Entusiasta Express* (Especialista en Gustos & Disgustos) 💖🤢` },
  ],
  quizQuestions: [
    mc('"Ella ama cantar."', ['She love sing', 'She loves singing', 'She loves to singing', 'She loves sings'], 1),
    mc('Do they like ___? (cocinar)', ['cook', 'cooking', 'to cooking', 'cooks'], 1),
    mc('¿Cuál es CORRECTA?', ['I like very much travel', 'I really enjoy traveling', 'I enjoy very much to travel', 'I very like traveling'], 1),
    mc('¿Cuál suena más natural?', ['I like to watch TV', 'I like watching TV', 'I like watch TV', 'I am like watching TV'], 1),
    mc('"No me gusta la comida picante."', ["I don't like spicy food", 'I no like spicy food', "I don't likes spicy food", "I doesn't like spicy food"], 0),
    mc('"because" significa...', ['porque', 'pero', 'entonces', 'aunque'], 0),
    mc('My friend ___ going to the gym.', ['enjoy', 'enjoys', 'enjoying', 'to enjoy'], 1),
    mc('Después de "hate", el verbo va en...', ['-ing', 'forma base', 'con to', '-ed'], 0),
    tap('Toca la palabra incorrecta:', ['He', "doesn't", 'likes', 'swimming.'], 2, 'like'),
    tap('Toca la palabra incorrecta:', ['She', 'enjoys', 'reading', 'and', 'cook', 'at', 'home.'], 4, 'cooking'),
    tap('Toca la palabra incorrecta:', ['I', 'really', 'like', 'tea', 'and', 'very', 'like', 'coffee.'], 5, 'really'),
    rebuild('🎧 Reconstruye:', "We don't enjoy waiting", ['We', "don't", 'enjoy', 'waiting', 'like', 'wait', 'to', 'enjoys']),
    rebuild('🎧 Reconstruye:', 'I hate getting up early because it is cold', ['I', 'hate', 'getting', 'up', 'early', 'because', 'it', 'is', 'cold', 'love', 'get']),
    rebuild('🎧 Reconstruye:', 'She loves dancing', ['She', 'loves', 'dancing', 'love', 'dance', 'hates', 'dances', 'loving']),
    rebuild('🎧 Reconstruye:', 'I love listening to music', ['I', 'love', 'listening', 'to', 'music', 'hate', 'listen', 'loves']),
  ],
};

const modulo2_8 = {
  id: 'modulo2-8',
  title: 'Microlección 8',
  durationMinutes: 13,
  audioCues: ['Escucha el contenido de la lección.', 'Fíjate en los puntos clave.', 'Ahora vienen tus ejercicios.'],
  contentBlocks: [
    { id: 'modulo2-8-titulo', type: 'titulo', title: '¿Quién, cómo, cuándo?', subtitle: 'Preguntas WH (presente y pasado)', markdown: '' },
    { id: 'modulo2-8-mision', type: 'mision', markdown: `Hacer **preguntas informativas (Wh-)** en **presente** y **pasado simple**. 🕵 Vas a consolidar la fórmula con auxiliares (**do/does**, **did**) y con **to be**, usando *who, what, where, when, why, how, which*.` },
    { id: 'modulo2-8-intro', type: 'intro', markdown: `¡Hola, agente! Soy **{{mascot}}** {{mascotEmoji}}💬 y hoy eres **detective lingüístico** 🕵.

En el **Módulo 1** ya preguntaste en presente:
- *What do you study?*
- *Where are you from?*

Ahora sumamos el **pasado** 🔙:
- *Where did you go?*
- *When was it?*

Tienes dos agentes infiltrados 🥸:
- **Is-abella** (to be) va siempre al frente. 💃
- **Do-ménica** (do/does/did) entra en todas las demás. 🦸‍♀️

¡A resolver el caso de las preguntas Wh-! 🔍` },
    { id: 'modulo2-8-teoria-1', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `#### **🧩 La fórmula universal (presente)**

Todas las preguntas Wh- siguen el mismo orden:

> **Wh- + auxiliar + sujeto + verbo …?**

El secreto: el **auxiliar va ANTES del sujeto**. 🔑 Empecemos por el **presente**.

**🅰 Con "to be" (Is-abella):** *Wh- + am/is/are + sujeto*
- *Where **is** Juan?*
- *Who **are** they?*
- *Why **am** I here?*

👉 Aquí NO hay otro verbo: el *to be* es el verbo, y se va al frente justo después del Wh-.

**🅱 Presente sin to be (Do-ménica):** *Wh- + do/does + sujeto + verbo base*
- *What **do** you study?*
- *When **does** she work?*
- *Where **do** they live?*

👉 *does* se lleva la -s (he/she/it), así que el verbo principal queda en **base**: *does she work*, nunca *does she works*.

| Tiempo | Auxiliar | Ejemplo |
|---|---|---|
| Presente (to be) | am/is/are | *Where **is** she?* |
| Presente | do/does | *What **do** you want?* |`, miniQuiz: [
      mc('Completa: "___ does she work?" (¿Cuándo trabaja ella?)', ['When', 'Are', 'Did', 'Is'], 0),
      mc('Con "does" (he/she/it), el verbo principal va en…', ['forma base', 'pasado (-ed)', '3ª persona (-s)', '-ing'], 0),
      mc('Elige la pregunta correcta en presente:', ['What do you study?', 'What you study?', 'What does you study?', 'What you do study?'], 0),
      mc('Con "to be", la pregunta correcta es:', ['Where is she?', 'Where does she?', 'Where do she is?', 'Where she is?'], 0),
      mc('"¿Dónde viven ellos?"', ['Where they live?', 'Where do they live?', 'Where does they live?', 'Where do they lives?'], 1),
      tap('Toca la palabra incorrecta:', ['Where', 'do', 'you', 'live', 'and', 'works?'], 5, 'work'),
      tap('Toca la palabra incorrecta:', ['What', 'does', 'she', 'wants?'], 3, 'want'),
      rebuild('🎧 Ordena: "¿Dónde trabajas?"', 'Where do you work', ['Where', 'do', 'you', 'work', 'does', 'works', 'are', 'walk']),
    ] },
    { id: 'modulo2-8-teoria-1b', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `#### **🧩 La fórmula universal (pasado)**

Mismo orden, ahora en **pasado** 🔙:

> **Wh- + auxiliar + sujeto + verbo …?**

**🅲 Pasado sin to be (Do-ménica viaja al pasado):** *Wh- + did + sujeto + verbo base*
- *Where **did** you go?*
- *What **did** he say?*
- *Why **did** she leave?*

👉 Con *did* el verbo SIEMPRE va en **base** (nada de *went/said/left*). El *did* ya carga el pasado por todos.

**🅳 Pasado con to be (Is-abella en pasado):** *Wh- + was/were + sujeto*
- *Who **was** at the meeting?*
- *How **were** the exams?*
- *Where **were** you yesterday?*

👉 *was* para I/he/she/it; *were* para you/we/they. Igual que en presente, el *to be* es el verbo y va al frente.

| Tiempo | Auxiliar | Ejemplo |
|---|---|---|
| Pasado | did | *When **did** you arrive?* |
| Pasado (to be) | was/were | *Who **was** there?* |`, miniQuiz: [
      mc('Con "did", el verbo va en…', ['forma base', 'pasado (-ed)', '3ª persona (-s)', '-ing'], 0),
      mc('Elige la pregunta correcta en pasado:', ['Where did you went?', 'Where did you go?', 'Where you went?', 'Where did you goed?'], 1),
      mc('Pasado con "to be": "How ___ the exams?"', ['did', 'were', 'do', 'are'], 1),
      mc('"Who ___ at the meeting?" (una persona, pasado)', ['were', 'was', 'did', 'is'], 1),
      mc('"¿Cuándo llegaste?"', ['When did you arrived?', 'When did you arrive?', 'When you arrived?', 'When did you to arrive?'], 1),
      tap('Toca la palabra incorrecta:', ['Where', 'did', 'you', 'go', 'and', 'bought', 'food?'], 5, 'buy'),
      tap('Toca la palabra incorrecta:', ['When', 'did', 'she', 'left?'], 3, 'leave'),
      rebuild('🎧 Ordena: "¿Dónde fuiste?"', 'Where did you go', ['Where', 'did', 'you', 'go', 'went', 'do', 'goes', 'gone']),
    ] },
    { id: 'modulo2-8-teoria-2a', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `#### **🎯 Cuando el Wh- ES el sujeto**

A veces la palabra Wh- no pregunta por un dato externo: **ella misma es el sujeto** de la oración. En ese caso pasa algo especial 👉 **NO usamos auxiliar** (do/does/did desaparecen) y el verbo va **directo**, en 3ª persona (presente) o en pasado:

- *Who **wrote** this letter?* ✅ (no *Who did write…*)
- *What **happened**?* ✅ (no *What did happen…*)
- *Who **lives** here?* ✅ (presente, con -s)

Truco para detectarlo 🕵: si puedes responder *"**Maria** wrote it"* (el Wh- ocupa el lugar del sujeto), entonces **no lleva auxiliar**.

| Pregunta | ¿Quién/qué es el sujeto? | Respuesta |
|---|---|---|
| *Who **called** you?* | Who = sujeto | *Maria called me.* |
| *What **broke**?* | What = sujeto | *The glass broke.* |
| *Who **knows** the answer?* | Who = sujeto | *He knows it.* |`, miniQuiz: [
      mc('"___ wrote this letter?" (el Wh- es el sujeto)', ['Who', 'Who did', 'Who does', 'Who was'], 0),
      mc('Cuando el Wh- es el sujeto, el auxiliar…', ['siempre es do', 'desaparece', 'siempre es did', 'es was'], 1),
      mc('Elige la correcta:', ['What did happened?', 'What happened?', 'What does happen it?', 'What did happen it?'], 1),
      mc('Presente, Wh- sujeto: "Who ___ here?"', ['do live', 'lives', 'live', 'does live'], 1),
      mc('"¿Quién te llamó?" (Who = sujeto, pasado)', ['Who did call you?', 'Who called you?', 'Who did called you?', 'Who calls you?'], 1),
      tap('Toca la palabra incorrecta:', ['Who', 'did', 'wrote', 'this', 'letter?'], 1, '(quítalo)'),
      tap('Toca la palabra incorrecta:', ['I', 'know', 'who', 'does', 'lives', 'here.'], 3, '(quítalo)'),
      rebuild('🎧 Ordena: "¿Quién escribió esto?"', 'Who wrote this', ['Who', 'wrote', 'this', 'did', 'write', 'writes', 'does', 'rode']),
    ] },
    { id: 'modulo2-8-teoria-2b', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `#### **🔀 Which vs What**

Las dos pueden traducirse como *"¿qué/cuál?"*, pero eligen escenarios distintos:

- **Which** = *¿cuál?* → cuando hay **opciones limitadas o visibles** (eliges de un grupo conocido).
  - *Which bus should I take?* (entre estos buses)
  - *Which one do you prefer, the red or the blue?*
- **What** = *¿qué?* → pregunta **general o abierta**, sin lista cerrada.
  - *What bus goes downtown?* (cualquier bus posible)
  - *What's your favorite color?*

Regla rápida 🔑: si puedes señalar las opciones con el dedo, usa **Which**; si el abanico es ilimitado, usa **What**.

| Situación | Usa | Ejemplo |
|---|---|---|
| Opciones limitadas | Which | *Which size do you want, S or M?* |
| Pregunta general | What | *What size do you wear?* |`, miniQuiz: [
      mc('Para elegir entre opciones limitadas usas…', ['What', 'Which', 'How', 'Who'], 1),
      mc('"___ is your favorite color?" (abierta, general)', ['What', 'Which', 'Who', 'How'], 0),
      mc('"___ one do you prefer, the red or the blue?"', ['What', 'Which', 'How', 'When'], 1),
      mc('"What" se usa para preguntas…', ['solo con dos opciones', 'generales / abiertas', 'solo de edad', 'solo de lugar'], 1),
      mc('"___ size do you want, S or M?" (opciones dadas)', ['Which', 'What', 'How', 'Who'], 0),
      mc('"___ do you do for work?" (pregunta abierta)', ['Which', 'What', 'How', 'When'], 1),
      mc('Si puedes señalar las opciones con el dedo, usas…', ['What', 'Which', 'How much', 'Who'], 1),
      rebuild('🎧 Ordena: "¿Cuál bus va al museo?"', 'Which bus goes to the museum', ['Which', 'bus', 'goes', 'to', 'the', 'museum', 'What', 'go', 'witch', 'does']),
    ] },
    { id: 'modulo2-8-teoria-2c', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `#### **🔢 "How" combinado**

*How* casi nunca viaja sola: se combina con otra palabra para preguntar **cantidad, tiempo, frecuencia o edad**. Cada combinación tiene su uso fijo 👇

| Expresión | Sirve para | Ejemplo |
|---|---|---|
| How much | dinero / incontables | *How much is this?* |
| How many | contables | *How many siblings do you have?* |
| How long | tiempo (duración) | *How long is the trip?* |
| How often | frecuencia | *How often does it rain here?* |
| How old | edad | *How old are you?* |

Clave para *much* vs *many* 🔑: si lo puedes **contar** uno por uno (apples, books, siblings) → *how many*; si es masa o dinero que no cuentas en unidades (water, money, time) → *how much*.

**Resumen de palabras Wh-:** *Who, What, Where, When, Why, How, Which.*

> 🔑 Recuerda: **auxiliar antes del sujeto**; con **do/does/did** el verbo va en **base**.`, miniQuiz: [
      mc('"How ___ siblings do you have?" (contables)', ['many', 'much', 'long', 'old'], 0),
      mc('Para preguntar la edad usas…', ['How much', 'How old', 'How long', 'How many'], 1),
      mc('"How often does it rain?" pregunta por…', ['cantidad de dinero', 'frecuencia', 'duración', 'edad'], 1),
      mc('Para preguntar el precio (dinero) usas…', ['How many', 'How much', 'How old', 'How long'], 1),
      mc('"How ___ is the trip?" (duración en el tiempo)', ['long', 'many', 'old', 'much'], 0),
      mc('"How ___ water do you drink?" (incontable)', ['many', 'much', 'old', 'long'], 1),
      mc('Con cosas contables (books, apples) usas…', ['how much', 'how many', 'how long', 'how old'], 1),
      rebuild('🎧 Ordena: "¿Cuántos hermanos tienes?"', 'How many siblings do you have', ['How', 'many', 'siblings', 'do', 'you', 'have', 'much', 'has', 'old']),
    ] },
    { id: 'modulo2-8-errores', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `#### **🚫 Errores Comunes**

¡Cuidado, detective! Estos sospechosos se repiten 🔎:

| ❌ Incorrecto | ✅ Correcto | Por qué |
|---|---|---|
| *What he want?* | *What **does** he want?* | falta el auxiliar |
| *Where you are?* | *Where **are** you?* | con to be, el verbo va antes del sujeto |
| *When did she went?* | *When did she **go**?* | con *did* el verbo va en base |
| *Who does came?* | *Who **came**?* | el Wh- es el sujeto → sin auxiliar |
| *Why you study English?* | *Why **do** you study English?* | falta *do* |
| *Where she works?* | *Where **does** she work?* | falta *does* y el verbo va en base |

> 🕵 Toca la palabra equivocada en cada caso y resuelve el misterio.` , miniQuiz: [
      tap('Toca la palabra incorrecta:', ['Where', 'does', 'she', 'works?'], 3, 'work'),
      tap('Toca la palabra incorrecta:', ['When', 'did', 'you', 'went', 'home?'], 3, 'go'),
      tap('Toca la palabra incorrecta:', ['Who', 'does', 'came', 'late?'], 1, '(quítalo)'),
      tap('Toca la palabra incorrecta:', ['What', 'time', 'does', 'the', 'class', 'starts?'], 5, 'start'),
      tap('Toca la palabra incorrecta:', ['How', 'many', 'people', 'was', 'there?'], 3, 'were'),
      tap('Toca la palabra incorrecta:', ['Where', 'did', 'he', 'bought', 'it?'], 3, 'buy'),
      tap('Toca la palabra incorrecta:', ['Why', 'does', 'she', 'studies', 'English?'], 3, 'study'),
      tap('Toca la palabra incorrecta:', ['Who', 'did', 'wrote', 'the', 'book?'], 1, '(quítalo)'),
    ] },
    { id: 'modulo2-8-resumen', type: 'resumen', markdown: `## **🎯 Resumen: el ABC del detective Wh-**

> **Wh- + auxiliar + sujeto + verbo …?**

- **to be** 💃 *Is-abella*: *Wh- + am/is/are/was/were + sujeto.* → *Where **is** she? / Who **was** there?*
- **do/does/did** 🦸‍♀️ *Do-ménica*: *Wh- + do/does/did + sujeto + verbo **base**.* → *What **do** you want? / Where **did** you go?*
- **Wh- = sujeto** 🎯 → sin auxiliar. → *Who **called**? / What **happened**?*

| Palabra | Pregunta por |
|---|---|
| Who | persona |
| What | cosa / general |
| Where | lugar |
| When | tiempo |
| Why | razón |
| How | modo / cantidad |
| Which | opción limitada |

> 🔑 Recuerda: **auxiliar antes del sujeto**; con *did* el verbo SIEMPRE en base.` },
    { id: 'modulo2-8-cierre', type: 'cierre', markdown: `#### **🔍 Cierre**

¡Inspector, lo lograste! 🕵✨ Ahora formulas preguntas en **presente** y **pasado**: palabra **Wh-**, **auxiliar** correcto, **sujeto** y **verbo**.

**🧠 Práctica detective:** mira una respuesta en español e **inventa la pregunta en inglés**.
- *Respuesta:* "Fui ayer." *When did you go?*

✅ **Misión cumplida en la ciudad:**
> *"Excuse me, what time does the museum open? How can I get to Trafalgar Square?"*

🏅 **Insignia obtenida:** *Detective Lingüístico* — Maestr@ de las Preguntas Wh- 🕵✨` },
  ],
  quizQuestions: [
    mc('Elige la pregunta correcta:', ['Where does he live?', 'Where he lives?', 'Where does he lives?', 'Where do he live?'], 0),
    mc('Corrige: "What time starts the class?"', ['What time the class starts?', 'What time does the class start?', 'What time did starts the class?', 'What time does the class starts?'], 1),
    mc('Completa: "How many people ___ in the meeting?" (pasado)', ['was', 'were', 'did', 'are'], 1),
    mc('"___ did it happen?" – It happened yesterday.', ['Who', 'When', 'Which', 'What'], 1),
    mc('¿Cuál es la pregunta correcta?', ['What you did?', 'What did you do?', 'What did you did?', 'What you do did?'], 1),
    mc('Para elegir entre dos opciones (rojo o azul) usas…', ['What', 'Which', 'How', 'Who'], 1),
    mc('Cuando el Wh- es el sujeto ("¿Quién llamó?"):', ['Who did call?', 'Who called?', 'Who did called?', 'Who does call?'], 1),
    mc('Para preguntar la edad usas…', ['How much', 'How old', 'How many', 'How long'], 1),
    tap('Toca la palabra incorrecta:', ['Where', 'does', 'she', 'works?'], 3, 'work'),
    tap('Toca la palabra incorrecta:', ['How', 'many', 'people', 'was', 'there?'], 3, 'were'),
    tap('Toca la palabra incorrecta:', ['When', 'did', 'you', 'went', 'home?'], 3, 'go'),
    rebuild('Ordena: ¿Cuándo viniste?', 'When did you come', ['When', 'did', 'you', 'come', 'came', 'were', 'do']),
    rebuild('Ordena: ¿Por qué no te gustó la película?', "Why didn't you like the movie", ['Why', "didn't", 'you', 'like', 'the', 'movie', 'liked', 'do']),
    rebuild('Ordena: ¿Quién te llamó anoche?', 'Who called you last night', ['Who', 'called', 'you', 'last', 'night', 'did', 'call', 'calls']),
    rebuild('Ordena: ¿Dónde trabajas?', 'Where do you work', ['Where', 'do', 'you', 'work', 'does', 'works', 'walk', 'are']),
  ],
};

const modulo2_9 = {
  id: 'modulo2-9',
  title: 'Microlección 9',
  durationMinutes: 12,
  audioCues: ['Escucha el contenido de la lección.', 'Fíjate en los puntos clave.', 'Ahora vienen tus ejercicios.'],
  contentBlocks: [
    { id: 'modulo2-9-titulo', type: 'titulo', title: '¡Vamos de compras!', subtitle: 'Vocabulario funcional: compras', markdown: '' },
    { id: 'modulo2-9-mision', type: 'mision', markdown: `Aprender las **frases útiles para ir de compras en inglés** 🛍: responder a *"Can I help you?"*, **preguntar precios**, pedir **tallas** y manejar las **formas de pago**. El objetivo es que te desenvuelvas como **cliente** en cualquier tienda de habla inglesa sin morir en el intento. 💪` },
    { id: 'modulo2-9-intro', type: 'intro', markdown: `¡Hola de nuevo! Soy **{{mascot}}** {{mascotEmoji}}💬 y hoy nos vamos de *shopping* 🛍.

Imagina **Gamarra** pero todos hablan inglés 😱. ¿Cómo dices *"¿Cuánto cuesta?"*, *"¿Tiene talla M?"*, *"Solo estoy mirando"*?

> 💡 Tranqui, no necesitas ser un experto. Con un puñado de frases sales del paso como todo un **caserit@ internacional**. {{mascot}} te acompaña a cada vitrina. 👀` },
    { id: 'modulo2-9-teoria-1', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**1.** **Entrar y buscar** 🏬

Apenas entras, el vendedor te dispara: **"Can I help you?"** (¿Te ayudo?). La **frase de oro** para que te dejen mirar tranqui:

> 🥇 **I'm just looking, thanks.** (Solo estoy mirando, gracias.)

Si **sí** buscas algo, usa **I'm looking for…**:

| Español | Inglés |
| --- | --- |
| Busco una casaca negra. | I'm looking for a black jacket. |
| ¿Tienen esto en talla M? | Do you have this in size M? |
| ¿Qué talla eres? – Soy talla 6. | What size are you? – I'm a size 6. |

Las tallas suelen ser **S / M / L / XL**.`,
      miniQuiz: [
        mc('El vendedor dice "Can I help you?" y solo quieres mirar. Respondes:', ['Yes, I help you.', "I'm just looking, thanks.", 'No, you help me.', 'I help just looking.'], 1),
        mc('¿Cómo dices "Busco una casaca negra"?', ["I'm looking a black jacket.", "I'm looking for a black jacket.", 'I look for a jacket black.', "I'm looking for a jacket black."], 1),
        mc('¿Cómo preguntas la talla de alguien?', ['What size are you?', 'How much are you?', 'Are you looking for size?', 'What size do you?'], 0),
        mc('"¿Tienen esto en talla M?"', ['Do you have in size M this?', 'Do you have this in size M?', 'Have you this size M?', 'Do you has this in size M?'], 1),
        mc('Las tallas suelen ser...', ['S / M / L / XL', '1 / 2 / 3', 'A / B / C', 'big / small only'], 0),
        mc('"Solo estoy mirando, gracias."', ["I just look, thanks.", "I'm looking just, thanks.", "I'm just looking, thanks.", "Just I'm looking, thanks."], 2),
        rebuild('🎧 Reconstruye:', 'Do you have this in size M', ['Do', 'you', 'have', 'this', 'in', 'size', 'M', 'color', 'price', 'has']),
        rebuild('🎧 Reconstruye:', "I'm looking for a black jacket", ["I'm", 'looking', 'for', 'a', 'black', 'jacket', 'look', 'at', 'size']),
      ] },
    { id: 'modulo2-9-teoria-1b', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**2.** **Preguntar precios** 💵

Para **preguntar el precio**:

* **How much is this?** (¿Cuánto cuesta esto?) – para **uno**.
* **How much are these?** (¿Cuánto cuestan estos?) – para **varios**.
* **Is it on sale?** (¿Está en oferta?) / **Do you have any discounts?** (¿Tienen descuentos?)
* **That's a bit expensive.** (Está un poco caro.) 😅`,
      miniQuiz: [
        mc('Quieres saber el precio de UNA cosa. ¿Qué preguntas?', ['How much is this?', 'How much are these?', 'Is this looking?', 'How many is this?'], 0),
        mc('Precio de VARIAS cosas:', ['How much is this?', 'How much are these?', 'How many are these?', 'How much is these?'], 1),
        mc('¿Cómo preguntas si algo está en oferta?', ['Is it on price?', 'Is it on sale?', 'Are it cheap?', 'Is it sale?'], 1),
        mc('Te parece caro. ¿Cómo lo dices con tacto?', ["That's a bit expensive.", "That's on sale.", 'Do you have discounts?', "That's a bit cheap."], 0),
        mc('¿Cómo preguntas si tienen descuentos?', ['Do you have any discounts?', 'Is it a bit expensive?', 'How much are discounts?', 'Do you have any sale?'], 0),
        mc('Para UNA cosa usas "is"; para VARIAS usas...', ['are', 'is', 'has', 'be'], 0),
        tap('Toca la palabra incorrecta:', ['How', 'much', 'cost', 'these', 'shoes?'], 2, 'are'),
        rebuild('🎧 Reconstruye:', 'How much are these', ['How', 'much', 'are', 'these', 'is', 'this', 'many', 'cost']),
      ] },
    { id: 'modulo2-9-teoria-2', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**2.** **Probar, decidir y pagar** 💳

Antes de comprar, querrás **probártelo**:

* **Can I try it on?** (¿Me lo puedo probar?)
* **It fits well.** (Me queda bien.) / **It doesn't fit.** (No me queda.)
* **It's too tight.** (Muy ajustado.) / **It's too loose.** (Muy flojo.)
* **Do you have a larger size?** / **Do you have this in another color?**

Cuando te decides:

| Español | Inglés |
| --- | --- |
| Me lo llevo. | I'll take it. |
| Me llevo dos. | I'll take two. |
| No estoy segur@… lo pensaré. | I'm not sure… I'll think about it. |

A la hora de **pagar** 💰:

* **How much is it altogether?** (¿Cuánto es en total?)
* **Can I pay by card?** / **Do you accept credit cards?** / **Can I pay in cash?**
* **Here you go.** (Aquí tiene.) / **Could I have a receipt, please?** (¿Me da un recibo?)
* **Have a nice day!** (¡Que tenga buen día!)

> 🌟 **Frases especiales:** *Excuse me! Where is the fitting room?* (¿Dónde está el probador?) · *It's a gift. Could you gift-wrap it?* (Es un regalo, ¿lo envuelve?) · *What's your return policy?* (¿Cuál es su política de devoluciones?)

**Vocab clave:** *size* (talla), *price* (precio), *receipt* (recibo), *fitting room* (probador), *cash* (efectivo), *credit card* (tarjeta).`,
      miniQuiz: [
        mc('¿Cómo pides probarte un abrigo?', ['Can I try it on?', 'Can I try on it?', 'Can I prove it?', 'Can I to try it on?'], 0),
        mc('Te decides a comprarlo. Dices:', ['I take it.', "I'll take it.", 'I am take it.', 'I take will it.'], 1),
        mc('¿Cómo preguntas si aceptan tarjeta?', ['Do you accept credit cards?', 'Do you take card money?', 'Do you have credit cards?', 'Do you accept card?'], 0),
        mc('"Where is the fitting room?" significa:', ['¿Dónde está la caja?', '¿Dónde está el probador?', '¿Dónde está la salida?', '¿Dónde está la talla?'], 1),
        mc('"¿Puedo pagar con tarjeta?"', ['Can I pay by card?', 'Can I pay with card?', 'Can I pay card?', 'Can I to pay by card?'], 0),
        tap('Toca la palabra incorrecta:', ['Can', 'I', 'pay', 'with', 'card?'], 3, 'by'),
        tap('Toca la palabra incorrecta:', ['I', 'take', 'this', 'jacket.'], 1, "I'll take"),
        rebuild('🎧 Reconstruye:', 'How much is it altogether', ['How', 'much', 'is', 'it', 'altogether', 'are', 'these', 'cost']),
      ] },
    { id: 'modulo2-9-errores', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `#### **🚫 Errores Comunes**

Ojito con estos resbalones clásicos de caserit@ novat@ 😅:

* ❌ *How much cost this?* → ✅ **How much is this?** / **How much does this cost?**
* ❌ *Do you have in size M this?* → ✅ **Do you have this in size M?** (el orden importa)
* ❌ *Can I pay with card?* → ✅ **Can I pay by card?** (es *by card*, no *with card*)
* ❌ *I take this.* → ✅ **I'll take this.** (decisión del momento = *I'll*)
* ❌ *Call to a taxi* → ✅ **Call a taxi.** (sin *to*)

> 💡 **Bonus:** no confundas **price** (precio) con **prize** (premio). ¡Una letra cambia todo! 🏆`,
      miniQuiz: [
        tap('Toca la palabra incorrecta:', ['How', 'much', 'cost', 'this?'], 2, 'is'),
        tap('Toca la palabra incorrecta:', ['How', 'much', 'cost', 'these', 'shoes?'], 2, 'are'),
        tap('Toca la palabra incorrecta:', ['Can', 'I', 'pay', 'with', 'card?'], 3, 'by'),
        tap('Toca la palabra incorrecta:', ['I', 'take', 'this', 'jacket.'], 1, "I'll take"),
        tap('Toca la palabra incorrecta:', ['Call', 'to', 'a', 'taxi.'], 1, '(quítalo)'),
        tap('Toca la palabra incorrecta:', ['Can', 'I', 'pay', 'in', 'cash', 'or', 'with', 'card?'], 6, 'by'),
        tap('Toca la palabra incorrecta:', ['Do', 'you', 'have', 'this', 'in', 'size', 'L', 'this?'], 7, '(quítalo)'),
        tap('Toca la palabra incorrecta:', ['How', 'much', 'are', 'this', 'pants?'], 3, 'these'),
      ] },
    { id: 'modulo2-9-resumen', type: 'resumen', markdown: `## **🎯 Resumen práctico que debes recordar**

| Situación | Frase clave |
| --- | --- |
| Te ofrecen ayuda | I'm just looking, thanks. |
| Buscas algo | I'm looking for… |
| Preguntar precio (uno / varios) | How much is this? / How much are these? |
| Pedir talla | Do you have this in size M? |
| Probarte | Can I try it on? |
| Decidir comprar | I'll take it. |
| Pagar | Can I pay by card? / in cash? |
| Pedir recibo | Could I have a receipt, please? |

* ✅ Precio: **How much IS this?** (no *how much cost this*).
* ✅ Pago con tarjeta: **by card** (no *with card*).
* ✅ Me lo llevo: **I'll take it** (con *I'll*).` },
    { id: 'modulo2-9-cierre', type: 'cierre', markdown: `#### **🌟 Cierre**

¡Listo para ir de *shopping*! 🛒 Ya sabes entrar, preguntar precios y tallas, probarte la ropa y pagar como todo un pro. Repasa estas frases **antes de viajar**. ✈️

✅ **Misión cumplida:** en el mercado de Cusco una turista pregunta *"How much is this llama figurine?"* y tú respondes con toda confianza *"It's 50 soles."* 🦙

**🏅 Insignia obtenida:** ✨ *Caserit@ Internacional* (Experto en Shopping en inglés) 🛍💳` },
  ],
  quizQuestions: [
    mc('"Can I help you?" Solo quieres mirar. Respondes:', ['No, thanks. I help you.', "No, thanks. I'm just looking.", 'No, thanks. I look.', "No, thanks. I'm looking just."], 1),
    mc('Tienes unos pantalones en la mano. ¿Cómo preguntas el precio?', ['How much are this?', 'How much are these pants?', 'How much it cost?', 'How much is these pants?'], 1),
    mc('¿Cómo dices "¿Podría envolverlo para regalo?"', ['Could you gift-wrap it, please?', 'Could you wrap gift it, please?', 'Can you make a gift, please?', 'Could you to gift-wrap it?'], 0),
    mc('Do you have this in size L? – Yes, we ___.', ['have', 'do', 'are', 'has'], 1),
    mc('¿Cómo preguntas "¿Aceptan tarjeta de crédito?"', ['Do you accept credit cards?', 'Do you have credit cards?', 'Do you pay credit cards?', 'Do you accept card money?'], 0),
    mc("How much ___ this book? – ___ $15.", ["are; They're", "is; It's", 'cost; Is', 'is; They are'], 1),
    mc('"I\'ll take it." significa:', ['Lo devolveré', 'Me lo llevo', 'Lo pensaré', 'No lo quiero'], 1),
    mc('¿Cómo pides probarte un abrigo?', ['Can I try it on?', 'Can I prove a coat?', 'Can I try on it?', 'Can I to try it on?'], 0),
    mc('El vendedor dice "Have a great day!" Tú respondes:', ['You too!', 'Me too!', 'Thank you day!', 'You day too!'], 0),
    tap('Toca la palabra incorrecta:', ['How', 'much', 'cost', 'this?'], 2, 'is'),
    tap('Toca la palabra incorrecta:', ['Can', 'I', 'pay', 'with', 'card?'], 3, 'by'),
    tap('Toca la palabra incorrecta:', ['Call', 'to', 'a', 'taxi.'], 1, '(quítalo)'),
    rebuild('🎧 Reconstruye:', "I'll take it", ["I'll", 'take', 'it', 'have', 'this', 'buy', 'takes']),
    rebuild('🎧 Reconstruye:', 'Can I pay by card', ['Can', 'I', 'pay', 'by', 'card', 'with', 'cash', 'pays']),
    rebuild('🎧 Reconstruye:', 'How much are these', ['How', 'much', 'are', 'these', 'is', 'this', 'many', 'cost']),
  ],
};

const modulo2_10 = {
  id: 'modulo2-10',
  title: 'Microlección 10',
  durationMinutes: 12,
  audioCues: ['Escucha el contenido de la lección.', 'Fíjate en los puntos clave.', 'Ahora vienen tus ejercicios.'],
  contentBlocks: [
    { id: 'modulo2-10-titulo', type: 'titulo', title: '¡Me siento mal!', subtitle: 'Inglés para situaciones de salud', markdown: '' },
    { id: 'modulo2-10-mision', type: 'mision', markdown: `Aprender el **vocabulario y las frases para hablar de enfermedades y atención médica básica** 🤒. Vas a poder **describir síntomas** (*I have a headache*), **entender las preguntas del doctor** (*How long have you had…?*) y **seguir recomendaciones** (*You should rest*). ¡Inglés de supervivencia para cuando el cuerpo dice "no más"! 🩺` },
    { id: 'modulo2-10-intro', type: 'intro', markdown: `¡Hey, {{audience}}! Soy **{{mascot}}** {{mascotEmoji}}💬 y hoy te veo con **mala cara** 🤒. ¿Te sientes mal? ¡Tranqui! Hoy jugamos a **doctor y paciente**.

Saber expresar tus molestias en inglés es **vital** 🩹. Aprenderás a decir *"me duele X"*, *"me siento Y"*, a entender al médico y hasta a gritar *"¡Llamen a una ambulancia!"* en caso de emergencia.

> 🩺 Hoy me convierto en **Dr. {{mascot}}** y paso consulta. ¡Abre la boca y di *"ahh"*! 😷` },
    { id: 'modulo2-10-teoria-1', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**1.** **Describir síntomas – ¿Qué te duele? 🤕**

Para decir que tienes un malestar, el inglés usa mucho **"I have a…"** (tengo un/una…) o **"My ___ hurts"** (me duele mi…).

| Español | Inglés |
| --- | --- |
| Me duele la cabeza | I have a **headache** |
| Me duele el estómago | I have a **stomachache** |
| Me duele una muela | I have a **toothache** |
| Tengo fiebre | I have a **fever** |
| Estoy resfriado | I have a **cold** |
| Tengo gripe | I have **the flu** |
| Tengo tos | I have a **cough** |
| Me duele la garganta | I have a **sore throat** |
| Tengo la nariz tapada | I have a **stuffy nose** |
| Tengo la nariz mocosa | I have a **runny nose** |

También puedes usar **"hurts"** para señalar la parte que duele:
* **My back hurts.** (Me duele la espalda)
* **My throat hurts.** (Me duele la garganta)
* **It hurts here.** (Me duele aquí 👉)

Y para el **malestar general**:
* **I feel dizzy.** (Me siento mareado)
* **I feel sick / nauseous.** (Tengo náuseas)
* **I don't feel well.** (No me siento bien)
* **I feel weak.** (Me siento débil)
* **I'm having trouble breathing.** (Me cuesta respirar)
* **I'm allergic to penicillin.** (Soy alérgico a la penicilina)`,
      miniQuiz: [
        mc('¿Cómo dices "Me duele la cabeza"?', ['I have a stomachache.', 'I have a headache.', 'I have a toothache.', 'I have a backache.'], 1),
        mc('"I feel dizzy" significa…', ['Me siento débil.', 'Tengo fiebre.', 'Me siento mareado.', 'Tengo tos.'], 2),
        mc('¿Cómo dices "Me duele la espalda"?', ['My back hurts.', 'My throat hurts.', 'It hurts here.', 'My back hurt.'], 0),
        mc('"Tengo tos."', ['I have a cough.', 'I have a fever.', 'I have a cold.', 'I have a cough hurts.'], 0),
        mc('"Me duele la garganta."', ['I have a sore throat.', 'I have a runny nose.', 'I have a stuffy nose.', 'I have a sore back.'], 0),
        mc('Con "I have a..." NO se dice:', ['I have a fever.', 'I have a headache.', 'I have a dizzy.', 'I have a cough.'], 2),
        tap('Toca la palabra incorrecta:', ['My', 'back', 'hurt', 'and', 'my', 'legs', 'hurt.'], 2, 'hurts'),
        rebuild('🎧 Reconstruye:', 'I have a sore throat', ['I', 'have', 'a', 'sore', 'throat', 'My', 'back', 'hurts', 'fever']),
      ] },
    { id: 'modulo2-10-teoria-2', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**2.** **El doctor y las recomendaciones 🩺**

Cuando llegues a la consulta, el médico te hará preguntas. ¡Apréndelas para no quedarte en blanco!

| Pregunta del doctor | Significado |
| --- | --- |
| What's the matter? / What's wrong? | ¿Qué te pasa? |
| How do you feel? | ¿Cómo te sientes? |
| Where does it hurt? | ¿Dónde te duele? |
| How long have you had this? | ¿Desde cuándo tienes esto? |
| On a scale of 1 to 10, how bad is the pain? | Del 1 al 10, ¿qué tan fuerte es el dolor? |

Para responder *"How long…?"* usa:
* **For two days.** (Desde hace dos días)
* **Since yesterday.** (Desde ayer)

Otras frases del doctor: *Let me take your temperature* (déjame tomar tu temperatura), *Open your mouth and say "ahh"*, *Breathe in… breathe out* (inhala… exhala).

**Recomendaciones que escucharás:**
* **You should rest.** (Deberías descansar)
* **You should take these pills.** (Deberías tomar estas pastillas)
* **You must drink a lot of fluids.** (Debes beber muchos líquidos)
* **Get plenty of rest.** (Descansa bastante)
* **Here's a prescription.** (Aquí tienes una receta)
* **Take one pill every 8 hours.** (Toma una pastilla cada 8 horas)

**🚨 Urgencias:**
* **Call an ambulance!** (¡Llamen a una ambulancia!)
* **I need a doctor! It's an emergency.** (¡Necesito un doctor! Es una emergencia)
* **Help! He's unconscious.** (¡Ayuda! Está inconsciente)
* **She's choking. / He fainted.** (Se está ahogando. / Se desmayó)`,
      miniQuiz: [
        mc('El doctor pregunta "Where does it hurt?". ¿Qué quiere saber?', ['Cómo te sientes', 'Dónde te duele', 'Desde cuándo', 'Qué comiste'], 1),
        mc('Respuesta a "How long have you had this?"', ['It hurts here.', 'Since yesterday.', 'I need a doctor.', 'My head hurts.'], 1),
        mc('¿Cómo dices "Deberías descansar"?', ['You must rest.', 'You should rest.', 'You take a rest.', 'You should to rest.'], 1),
        mc('"Take one pill every 8 hours" significa…', ['Toma una pastilla cada 8 horas.', 'Toma ocho pastillas hoy.', 'Bebe muchos líquidos.', 'Descansa 8 horas.'], 0),
        mc('"Debes beber muchos líquidos."', ['You must drink a lot of fluids.', 'You must to drink a lot of fluids.', 'You drink must a lot of fluids.', 'You musts drink fluids.'], 0),
        mc('"¡Llamen a una ambulancia!"', ['Call an ambulance!', 'Call to an ambulance!', 'Call a ambulance!', 'Call the ambulance to!'], 0),
        tap('Toca la palabra incorrecta:', ['You', 'should', 'rest', 'and', 'you', 'must', 'to', 'drink', 'water.'], 6, '(quítalo)'),
        rebuild('🎧 Reconstruye:', 'Call an ambulance', ['Call', 'an', 'ambulance', 'doctor', 'to', 'emergency', 'a']),
      ] },
    { id: 'modulo2-10-errores', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `#### **🚫 Errores Comunes**

Estos resbalones son **clásicos** al traducir del español. ¡Dr. {{mascot}} te los cura! 💊

| ❌ Incorrecto | ✅ Correcto |
| --- | --- |
| My head aches me. | **I have a headache.** / My head hurts. |
| I feel myself bad. | **I feel bad.** |
| You must to take this syrup. | **You must take this syrup.** |
| Take a rest. | **Get some rest.** |
| Call to an ambulance! | **Call an ambulance!** |

> 💡 **Recuerda:**
> * No traduzcas el "me" reflexivo: es *I feel bad*, **no** *I feel myself bad*.
> * Después de **must** va el verbo directo, **sin "to"**: *You must take*, **no** *You must to take*.
> * **Call** no lleva *"to"*: *Call an ambulance*, **no** *Call to an ambulance*.

Toca la palabra incorrecta en cada frase 👇`,
      miniQuiz: [
        tap('Toca la palabra incorrecta:', ['I', 'feel', 'myself', 'bad.'], 2, '(quítalo)'),
        tap('Toca la palabra incorrecta:', ['You', 'must', 'to', 'take', 'this', 'syrup.'], 2, '(quítalo)'),
        tap('Toca la palabra incorrecta:', ['Call', 'to', 'an', 'ambulance!'], 1, '(quítalo)'),
        tap('Toca la palabra incorrecta:', ['She', 'feel', 'dizzy', 'and', 'weak.'], 1, 'feels'),
        tap('Toca la palabra incorrecta:', ['Today', 'my', 'back', 'hurt', 'a', 'lot.'], 3, 'hurts'),
        tap('Toca la palabra incorrecta:', ['You', 'should', 'to', 'rest', 'today.'], 2, '(quítalo)'),
        tap('Toca la palabra incorrecta:', ['He', 'have', 'a', 'fever', 'and', 'a', 'cough.'], 1, 'has'),
        tap('Toca la palabra incorrecta:', ['After', 'lunch', 'I', 'feel', 'myself', 'sick.'], 4, '(quítalo)'),
      ] },
    { id: 'modulo2-10-resumen', type: 'resumen', markdown: `## **🎯 Resumen: Inglés para la salud 🩹**

| Situación | Frase clave |
| --- | --- |
| Describir síntoma | I have a **headache** / My back **hurts** |
| Sentirse mal | I feel **dizzy** / I don't feel **well** |
| Pregunta del doctor | **Where does it hurt?** / **How long…?** |
| Responder duración | **Since yesterday** / **For two days** |
| Recomendación | You **should** rest / You **must** drink fluids |
| Emergencia | **Call an ambulance!** / **It's an emergency.** |

**Recuerda:**
* **I have a…** + síntoma (*headache, fever, cough*).
* **My ___ hurts** para señalar la parte del cuerpo.
* Después de **must / should** va el verbo **sin "to"**.
* **Call an ambulance** — ¡sin *"to"*!` },
    { id: 'modulo2-10-cierre', type: 'cierre', markdown: `#### **🌟 Cierre**

¡Bravazo! 🎉 Ahora manejas las **frases de supervivencia médica** 🩹. Sabes **describir tus síntomas**, **entender al doctor** y **lidiar con una urgencia** sin entrar en pánico.

> **Misión cumplida:** {{mascot}} te mira y dice *"You look much better now!"* y tú respondes con seguridad: *"Yes, I am. Thank you for asking!"* 😊

**🏅 Insignia obtenida:** *Paramédic@ Políglota* (Inglés para la Salud) 🚑💊` },
  ],
  quizQuestions: [
    mc('Doctor: "How long have you had this cough?"', ['It hurts here.', 'Since yesterday.', 'Call an ambulance.', 'My head hurts.'], 1),
    mc('"¿Cada cuánto debo tomarlo?" Two pills ___ day.', ['per', 'for', 'on', 'at'], 0),
    mc('"¡Él no puede respirar!"', ['He must breathe!', "He can't breathe!", 'He feels breathe!', "He doesn't can breathe!"], 1),
    mc('"Debe guardar cama y no salir."', ['You have to save bed and no exit.', 'You should stay in bed and not go out.', 'You must to stay bed.', 'You should to stay in bed.'], 1),
    mc('Doc: "What\'s wrong?" – Tú: "I feel ___" (mareado)', ['weak', 'dizzy', 'tired', 'strong'], 1),
    mc('Para una recomendación médica suave, lo mejor es...', ["You mustn't rest.", 'You should rest.', 'You rest must.', 'You should to rest.'], 1),
    mc('"Me duele la garganta."', ['I have a sore throat.', 'My throat hurt.', 'I feel a sore throat.', 'I have sore throat.'], 0),
    mc('"¡Es una emergencia!"', ["It's an emergency!", "It's a emergency!", "It's emergency!", "There's an emergency to!"], 0),
    tap('Toca la palabra incorrecta:', ['You', 'must', 'to', 'take', 'these', 'pills.'], 2, '(quítalo)'),
    tap('Toca la palabra incorrecta:', ['I', 'feel', 'myself', 'sick.'], 2, '(quítalo)'),
    tap('Toca la palabra incorrecta:', ['Today', 'my', 'back', 'hurt', 'a', 'lot.'], 3, 'hurts'),
    rebuild('🎧 "Me duele la espalda":', 'My back hurts', ['My', 'back', 'hurts', 'throat', 'headache', 'hurt']),
    rebuild('🎧 "Creo que tengo gripe. Me siento muy débil":', 'I think I have the flu I feel very weak', ['I', 'think', 'I', 'have', 'the', 'flu', 'I', 'feel', 'very', 'weak', 'cold', 'strong']),
    rebuild('🎧 "¿Dónde te duele?":', 'Where does it hurt', ['Where', 'does', 'it', 'hurt', 'How', 'long', 'feel', 'hurts']),
    rebuild('🎧 "Llama a una ambulancia, rápido":', 'Call an ambulance quick', ['Call', 'an', 'ambulance', 'quick', 'doctor', 'to', 'a']),
  ],
};

const modulo2_11 = {
  id: 'modulo2-11',
  title: 'Microlección 11',
  durationMinutes: 14,
  audioCues: ['Escucha el contenido de la lección.', 'Fíjate en los puntos clave.', 'Ahora vienen tus ejercicios.'],
  contentBlocks: [
    { id: 'modulo2-11-titulo', type: 'titulo', title: '¡A viajar!', subtitle: 'Inglés para viajes y direcciones', markdown: '' },
    { id: 'modulo2-11-mision', type: 'mision', markdown: `Aprender **inglés para viajes** ✈️: moverte por el **aeropuerto** (check-in, seguridad, aduana), **preguntar direcciones** en la ciudad y resolver **situaciones en el hotel** (check-in, problemas en la habitación y check-out). ¡Que el idioma nunca te deje varado! 🧳` },
    { id: 'modulo2-11-intro', type: 'intro', markdown: `¡Hola, viajero! Soy **{{mascot}}**, tu guía de viaje internacional 🌍😎. Hoy nos vamos de aventura y te preparo para todo lo que viene en el camino.

Vamos a dividir el viaje en **tres paradas**:

**1.** **El aeropuerto** 🛫 — check-in, seguridad e inmigración.

**2.** **La ciudad** — transporte y cómo preguntar direcciones sin perderte.

**3.** **El hotel** 🏨 — registrarte, pedir cosas y hacer check-out.

Sube, abróchate el cinturón y... ¡a despegar! 🚀` },
    { id: 'modulo2-11-teoria-1', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `#### **🛫 Parada 1: El Aeropuerto**

Lo primero al llegar es el **check-in** (registro). Lleva tu **passport** (pasaporte) y tu **ID** (documento) listos.

  | Español                          | Inglés                                          |
  | -------------------------------- | ----------------------------------------------- |
  | ¿Dónde está el mostrador de check-in? | Where is the check-in counter?             |
  | Quisiera registrarme.            | I'd like to check in.                            |
  | Aquí está mi pasaporte.          | Here is my passport.                             |
  | Tengo una maleta y un equipaje de mano. | I have one suitcase and one carry-on.    |
  | ¿Ventana o pasillo? – Ventana, por favor. | Window or aisle seat? – Window, please. |

Tu **boarding pass** (pase de abordar) te dirá la **gate** (puerta): *Your flight is boarding at Gate 15.*

> 🛂 **En seguridad:** *Take off your shoes and belt.* (Quítate los zapatos y el cinturón.) *Any liquids or electronics?* (¿Líquidos o electrónicos?)

> 🌎 **En inmigración:** *Purpose of your visit? – Tourism.* (¿Motivo de tu visita? – Turismo.) *How long will you be staying? – I'll be here for two weeks.* *Do you have anything to declare? – No, nothing to declare.*

**Frases salvavidas:** *Where is baggage claim?* (¿Dónde está la entrega de equipaje?) · *My suitcase is missing.* (Mi maleta se perdió.) · *I missed my flight.* (Perdí mi vuelo.)`,
      miniQuiz: [
        mc('"¿Motivo de tu visita?" – Vas de turismo:', ['Business.', 'Tourism.', 'Working.', 'Window.'], 1),
        mc('Pides un asiento de pasillo:', ['A window seat, please.', 'An aisle seat, please.', 'A boarding pass, please.', 'A gate seat, please.'], 1),
        mc('Tu maleta no aparece. Dices:', ['My suitcase is window.', 'My suitcase is missing.', 'I check my suitcase.', 'My suitcase is gate.'], 1),
        mc('"Quisiera registrarme."', ["I'd like to check in.", 'I like check in.', 'I want check-in now.', "I'd like to check-in counter."], 0),
        mc('"boarding pass" significa...', ['pase de abordar', 'pasaporte', 'maleta', 'puerta'], 0),
        mc('"¿Tiene algo que declarar?" – No tienes nada:', ['Nothing to declare.', 'No declare nothing.', 'I have nothing declare.', 'Not declare.'], 0),
        rebuild('Escucha y reconstruye:', 'Where is the check-in counter', ['Where', 'is', 'the', 'check-in', 'counter', 'gate', 'baggage', 'my']),
        rebuild('Escucha y reconstruye:', 'My suitcase is missing', ['My', 'suitcase', 'is', 'missing', 'gate', 'window', 'are', 'lost']),
      ] },
    { id: 'modulo2-11-teoria-2', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `#### **🚍 Parada 2: La Ciudad (Transporte y Direcciones)**

Ya saliste del aeropuerto. Ahora hay que **moverse** y, sobre todo, **no perderse**.

  | Español                              | Inglés                                  |
  | ------------------------------------ | --------------------------------------- |
  | ¿Cómo llego a [lugar]?               | How do I get to [place]?                 |
  | ¿Cuál bus va al museo?               | Which bus goes to the museum?            |
  | ¿Dónde está la parada del bus?       | Where is the bus stop?                   |
  | ¿Este tren va al aeropuerto?         | Does this train go to the airport?       |
  | ¿Cuánto cuesta un boleto?            | How much is a ticket?                    |

**Pidiendo direcciones** (¡con educación, empieza con *Excuse me*!):

  > 🧭 *Excuse me, can you tell me how to get to the train station?*
  > – *Go straight ahead for two blocks.* (Sigue derecho dos cuadras.)
  > – *Then turn left at the traffic light.* (Luego dobla a la izquierda en el semáforo.)
  > – *The museum will be on your right.* (El museo estará a tu derecha.)
  > – *It's across from the park. You can't miss it!* (Está frente al parque. ¡No tiene pierde!)

**Útiles:** *It's two blocks away.* (Está a dos cuadras.) · *It's next to the bank.* (Está junto al banco.) · *Is it far? – It's about a 5-minute walk.* (¿Está lejos? – Es como 5 minutos a pie.)

Direcciones: **north** (norte), **south** (sur), **east** (este), **west** (oeste).`,
      miniQuiz: [
        mc('Preguntas cuál bus va al museo:', ['Which bus goes to the museum?', 'Where is the museum bus?', 'How is the museum bus?', 'What bus go to museum?'], 0),
        mc('"¿Dónde queda la estación de tren?" (con educación):', ['Where train station?', 'Excuse me, where is the train station?', 'I want the train station.', 'Where is train station?'], 1),
        mc('"Sigue derecho dos cuadras" en inglés es:', ['Turn left two blocks.', 'Go straight ahead for two blocks.', 'The bank is two blocks.', 'Go right two blocks.'], 1),
        mc('"Está frente al parque."', ["It's across from the park.", "It's cross the park.", "It's in front the park.", "It's next the park."], 0),
        mc('Para llegar a un lugar usas...', ['How do I get to...?', 'How I arrive to...?', 'How I go to...?', 'Where I get...?'], 0),
        tap('Toca la palabra incorrecta:', ['Turn', 'left', 'at', 'the', 'traffic', 'lights.'], 5, 'light.'),
        tap('Toca la palabra incorrecta:', ['How', 'I', 'get', 'to', 'the', 'station?'], 1, 'do I'),
        rebuild('Escucha y reconstruye:', 'Does this train go to the airport', ['Does', 'this', 'train', 'go', 'to', 'the', 'airport', 'bus', 'museum', 'how']),
      ] },
    { id: 'modulo2-11-teoria-3', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `#### **🏨 Parada 3: El Hotel**

Llegaste cansado pero feliz. Hora de **check-in** en el hotel.

  | Español                              | Inglés                                   |
  | ------------------------------------ | ---------------------------------------- |
  | Hola, tengo una reserva.             | Hello, I have a reservation.             |
  | Está a nombre de [tu nombre].        | It's under [Your Name].                  |
  | ¿A qué hora es el desayuno?          | What time is breakfast?                  |
  | ¿Hay Wi-Fi?                          | Is there Wi-Fi?                          |

Tu habitación: *Your room is on the 3rd floor, room 305. Here is your key card.* (3er piso, habitación 305. Aquí está tu tarjeta.)

> 🔧 **Si algo falla:** *The air conditioner doesn't work.* (El aire no funciona.) *There's no hot water.* (No hay agua caliente.) *Could you send someone to fix it?* (¿Pueden mandar a alguien a arreglarlo?) *Can I have another pillow?* (¿Me da otra almohada?)

**Check-out** (al irte):

  | Español                              | Inglés                                   |
  | ------------------------------------ | ---------------------------------------- |
  | Quisiera hacer el check-out.         | I'd like to check out, please.           |
  | ¿Puedo pagar con tarjeta?            | Can I pay by credit card?                |
  | ¿Me da un recibo, por favor?         | Could I have a receipt, please?          |
  | ¿A qué hora es el check-out?         | What time is check-out?                  |`,
      miniQuiz: [
        mc('Llegas al hotel con reserva. Dices:', ['I want a room now.', 'I have a reservation under [Name].', 'Give me a key card.', 'I have a room reservation now.'], 1),
        mc('"No hay agua caliente" se dice:', ['There is no hot water.', 'The water is no hot.', 'Hot water no there.', 'There no hot water.'], 0),
        mc('Quieres irte y pagar. Dices:', ['I have a reservation.', "I'd like to check out, please.", 'What time is breakfast?', 'Give me the bill now.'], 1),
        mc('"¿A qué hora es el desayuno?"', ['What time is breakfast?', 'What hour breakfast?', 'When is breakfast time?', 'What time breakfast is?'], 0),
        mc('"Está a nombre de Ana."', ["It's under Ana.", "It's name Ana.", "It's for the name Ana.", "It's at Ana."], 0),
        mc('El aire no funciona. Dices:', ["The air conditioner doesn't work.", 'The air conditioner no work.', "The air conditioner don't work.", 'The air conditioner not works.'], 0),
        rebuild('Escucha y reconstruye:', 'What time is check-out', ['What', 'time', 'is', 'check-out', 'breakfast', 'the', 'room', 'now']),
        rebuild('Escucha y reconstruye:', 'There is no hot water', ['There', 'is', 'no', 'hot', 'water', 'cold', 'the', 'are']),
      ] },
    { id: 'modulo2-11-errores', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `#### **🚫 Errores Comunes**

Ojito con estos tropiezos clásicos del viajero 👀:

* ❌ *How I arrive to the hotel?* → ✅ **How do I get to the hotel?** (Usamos *get to* + el auxiliar *do* para preguntar.)

* ❌ *Call to a taxi.* → ✅ **Could you call me a taxi?** (Nada de *call to*; pide con educación.)

* ⚠️ *I'm constipated* **NO** significa "estoy estreñido"... significa que tienes **congestión nasal** 🤧. ¡Cuidado en la farmacia!

> 💡 **Truco de transporte:** se dice **take** a taxi/bus/train (tomar), **get on/off** (subir/bajar) y **get to** (llegar a un lugar). *I take the bus, I get on at the station, and I get off downtown.*`,
      miniQuiz: [
        tap('Toca la palabra incorrecta:', ['How', 'I', 'get', 'to', 'the', 'hotel?'], 1, 'do I'),
        tap('Toca la palabra incorrecta:', ['Could', 'you', 'call', 'to', 'me', 'a', 'taxi?'], 3, '(quítalo)'),
        tap('Toca la palabra incorrecta:', ['I', 'want', 'to', 'take', 'on', 'the', 'bus.'], 4, '(quítalo)'),
        tap('Toca la palabra incorrecta:', ['How', 'do', 'I', 'arrive', 'to', 'the', 'museum?'], 3, 'get'),
        tap('Toca la palabra incorrecta:', ['Where', 'I', 'get', 'the', 'train?'], 1, 'do I'),
        tap('Toca la palabra incorrecta:', ['Call', 'to', 'a', 'taxi', 'now.'], 1, '(quítalo)'),
        tap('Toca la palabra incorrecta:', ['We', 'take', 'on', 'the', 'train', 'here.'], 2, '(quítalo)'),
        tap('Toca la palabra incorrecta:', ['How', 'do', 'I', 'arrive', 'to', 'the', 'airport?'], 3, 'get'),
      ] },
    { id: 'modulo2-11-resumen', type: 'resumen', markdown: `## **🎯 Resumen práctico que debes recordar**

* ✈️ **Aeropuerto:** *I'd like to check in. Here is my passport. Window or aisle seat?* Y si algo pasa: *My suitcase is missing.*

* **Ciudad:** pregunta siempre con **Excuse me** y usa **How do I get to...?** La respuesta vendrá con *go straight*, *turn left/right* y *it's next to / across from*.

* 🏨 **Hotel:** *I have a reservation under [Name]* al llegar, *There's no hot water* si algo falla, y *I'd like to check out, please* al irte.

* 🚫 **No olvides:** *get to* (no *arrive to*), *call me a taxi* (no *call to a taxi*), y *take / get on / get off* para el transporte.` },
    { id: 'modulo2-11-cierre', type: 'cierre', markdown: `#### **🌟 Cierre**

¡Y listo! 🎒 Ahora tienes un **kit de viaje en inglés** completo: te mueves por el **aeropuerto**, preguntas **direcciones** sin perderte y resuelves cualquier situación en el **hotel**.

✅ **Misión cumplida:** cuando vuelvas y te pregunten *"How was your trip?"* podrás responder con orgullo: *"It was amazing! I had no problems communicating."* 🏅

**🏅 Insignia obtenida:** ✨ *Trotamundos Preparado* (Inglés de Viajes A2) 🌍✈️🏨` },
  ],
  quizQuestions: [
    mc('"¿Motivo de tu visita?" – Respondes:', ['Tourism.', 'Window, please.', 'Nothing to declare.', 'An aisle seat.'], 0),
    mc('Pides un asiento de pasillo:', ['A window seat, please.', 'An aisle seat, please.', 'A gate seat, please.', 'A boarding seat, please.'], 1),
    mc('Tu maleta se perdió. Dices:', ['My suitcase is missing.', 'My suitcase is boarding.', 'I have a suitcase.', 'My suitcase is gate.'], 0),
    mc('¿Cuál bus va al museo?', ['Where the museum bus?', 'Which bus goes to the museum?', 'How bus to museum?', 'What bus go to museum?'], 1),
    mc('Llegas al hotel con reserva:', ['I want a room.', 'I have a reservation under [Name].', 'Give me room 305.', 'I want reservation now.'], 1),
    mc('Quieres hacer check-out:', ["I'd like to check out, please.", 'I have a reservation.', 'Is there Wi-Fi?', 'I want check out now.'], 0),
    mc('"¿Cómo llego a la estación?"', ['How do I get to the station?', 'How I arrive to the station?', 'Where I get the station?', 'How do I arrive the station?'], 0),
    mc('"No hay agua caliente."', ['There is no hot water.', 'The water is no hot.', 'There no hot water.', 'Hot water is not there.'], 0),
    tap('Toca la palabra incorrecta:', ['How', 'I', 'get', 'to', 'the', 'station?'], 1, 'do I'),
    tap('Toca la palabra incorrecta:', ['Could', 'you', 'call', 'to', 'me', 'a', 'taxi?'], 3, '(quítalo)'),
    tap('Toca la palabra incorrecta:', ['How', 'do', 'I', 'arrive', 'to', 'the', 'airport?'], 3, 'get'),
    rebuild('Escucha y reconstruye:', 'There is no hot water', ['There', 'is', 'no', 'hot', 'water', 'cold', 'the', 'pillow']),
    rebuild('Escucha y reconstruye:', 'Does this train go to the airport', ['Does', 'this', 'train', 'go', 'to', 'the', 'airport', 'bus', 'hotel', 'museum']),
    rebuild('Escucha y reconstruye:', 'Excuse me where is the train station', ['Excuse', 'me', 'where', 'is', 'the', 'train', 'station', 'bus', 'how', 'far']),
    rebuild('Escucha y reconstruye:', 'What time is check-out', ['What', 'time', 'is', 'check-out', 'breakfast', 'the', 'room', 'now']),
  ],
};

const modulo2_12 = {
  id: 'modulo2-12',
  title: 'Microlección 12',
  durationMinutes: 13,
  audioCues: ['Escucha el contenido de la lección.', 'Fíjate en los puntos clave.', 'Ahora vienen tus ejercicios.'],
  contentBlocks: [
    { id: 'modulo2-12-titulo', type: 'titulo', title: 'Mensajes que conectan', subtitle: 'Escritura básica de correos y notas', markdown: '' },
    { id: 'modulo2-12-mision', type: 'mision', markdown: `Aprender a **escribir mensajes básicos en inglés**, sobre todo **emails y notitas** ✉️. Vas a **saludar y despedirte** en registro **informal** (a un amigo) vs **formal** (profesor o trabajo), conocer los **atajos de chat** y redactar un **email corto estilo KET**.` },
    { id: 'modulo2-12-intro', type: 'intro', markdown: `En la era digital escribimos **todo el día**: mensajes, correos, notitas. 📱💻

Pero no se le escribe igual a tu mejor amigo que al jefe, ¿cierto? 😅 Por eso vas a distinguir el **registro informal** vs el **formal**, armar un email con **saludo, cuerpo y despedida**, y de paso aprender abreviaturas de chat (OMG, LOL) por **cultura general** 😜.

¡Saca tu pluma digital que {{mascot}} te enseña a sonar bien en cualquier mensaje! 🖋` },
    { id: 'modulo2-12-teoria-1', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**1.** **Informal vs Formal: las partes del mensaje**

Todo mensaje tiene piezas. Cambian según a **quién** le escribes. 👇

**👋 Saludo**
* Informal: *Hi Alex,* / *Hello Alex,*
* Formal: *Dear Mr. Smith,* / *Dear Sir or Madam,*

**🚪 Apertura**
* Informal: *How are you?* / *I hope you're doing well.*
* Formal: *I am writing to inquire about…* / *I am writing regarding…*

**✍️ Cuerpo**
* Informal: usa **contracciones** (*I'm, don't*), tono relajado.
* Formal: **profesional**, sin jerga ni emoticones.

**🙏 Cierre**
* Informal: *Talk soon!* / *Thanks!*
* Formal: *Thank you for your time. I look forward to your reply.*

**👋 Despedida**
* Informal: *Best,* / *Cheers,* / *Take care,*
* Formal: *Sincerely,* / *Best regards,*

**✒️ Firma:** informal = solo tu **nombre de pila**; formal = tu **nombre completo**.

| Pieza | Informal | Formal |
|---|---|---|
| Saludo | Hi Alex, | Dear Mr. Smith, |
| Despedida | Cheers, | Sincerely, |
| Tono | Relajado, con contracciones | Profesional, sin jerga |`,
      miniQuiz: [
        mc('¿Qué saludo es **formal**?', ['Hi Alex,', 'Dear Mr. Smith,', 'Hey!', 'Hello Alex,'], 1),
        mc('¿Qué despedida es **informal**?', ['Cheers,', 'Sincerely,', 'Best regards,', 'Yours faithfully,'], 0),
        mc('En un email **formal** debes…', ['evitar la jerga y los emoticones', 'usar emojis 😜', 'usar muchas abreviaturas', 'usar LOL y OMG'], 0),
        mc('Una apertura **formal** correcta es:', ['How are you?', 'I am writing to inquire about…', "What's up?", 'Hey, long time!'], 1),
        mc('Saludo **informal** para un amigo:', ['Dear Sir or Madam,', 'Hi Alex,', 'Dear Mr. Smith,', 'To whom it may concern,'], 1),
        mc('La firma **formal** lleva...', ['tu nombre completo', 'solo tu nombre de pila', 'un emoji', 'un apodo'], 0),
        rebuild('🎧 Reconstruye (saludo formal):', 'Dear Mr. Smith', ['Dear', 'Mr.', 'Smith', 'Hi', 'Alex', 'Hey', 'Hello']),
        rebuild('🎧 Reconstruye (apertura formal):', 'I am writing to inquire', ['I', 'am', 'writing', 'to', 'inquire', 'inquiry', 'write', 'about']),
      ] },
    { id: 'modulo2-12-teoria-2', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**2.** **Ejemplos reales y abreviaturas de chat**

**📩 Email informal (a un amigo):**
> Hi Alex,
> How's it going? I finally passed my English exam! Thank you for your help. Next week I'm going to Lima. Are you free to hang out?
> Thanks,
> María

**📨 Email formal (a un hotel):**
> Dear Sir or Madam,
> I am writing to inquire about room availability. Could you please inform me of the rates? Thank you for your time. I look forward to your reply.
> Sincerely,
> Ana González

**💬 Abreviaturas de chat (¡solo informal!):**

| Atajo | Significado |
|---|---|
| LOL | laughing out loud |
| OMG | oh my god |
| FYI | for your information |
| ASAP | as soon as possible |
| BTW | by the way |
| IDK | I don't know |
| THX | thanks |
| BRB | be right back |

🚫 **NUNCA** las uses en emails formales.

**💡 Consejos KET:**
* No dejes el **subject (asunto) vacío**.
* Meses y días **con mayúscula** (*Monday, July*).
* Tras *look forward to* va **-ing**: *I look forward to hearing from you.*
* Sé breve: **4-6 líneas** bastan. ✂️`,
      miniQuiz: [
        mc('¿Dónde puedes usar "BTW" o "LOL"?', ['En un email formal de trabajo', 'En un mensaje informal a un amigo', 'En el asunto de un email al hotel', 'En una carta al banco'], 1),
        mc('"ASAP" significa…', ['as slow as possible', 'as soon as possible', 'a smallap', 'and so a person'], 1),
        mc('La forma correcta es:', ['I look forward to hear from you.', 'I look forward to hearing from you.', 'I look forward hear from you.', 'I look forward to hears from you.'], 1),
        mc('Para un email KET, lo ideal es escribir…', ['4-6 líneas breves', '1 sola palabra', '3 páginas completas', 'solo emojis'], 0),
        mc('Los días y meses en inglés se escriben…', ['siempre en minúscula', 'con mayúscula inicial', 'sin importar', 'solo con números'], 1),
        mc('"OMG" es una abreviatura de...', ['oh my god', 'on my game', 'over my goal', 'oh my great'], 0),
        tap('Toca la palabra incorrecta:', ['I', 'look', 'forward', 'to', 'hear', 'from', 'you.'], 4, 'hearing'),
        rebuild('🎧 Reconstruye:', 'I look forward to hearing from you', ['I', 'look', 'forward', 'to', 'hearing', 'from', 'you', 'hear', 'hears', 'soon']),
      ] },
    { id: 'modulo2-12-errores', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `#### **🚫 Errores Comunes**

¡Ojo con estos resbalones clásicos! 😬

* ❌ *Dear friend,* (a un amigo) → ✅ *Hi Alex,*
* ❌ *I hope you are fine.* → ✅ *I hope you're doing well.*
* ❌ *Esteemed Mr. Lopez:* → ✅ *Dear Mr. Lopez,*
* ❌ *I look forward to hear from you.* → ✅ *I look forward to hearing from you.*
* ❌ *LOL see u l8r* (en correo de trabajo) → ✅ *See you later.*

Toca la palabra incorrecta y corrígela en los ejercicios. 👇`,
      miniQuiz: [
        tap('Toca la palabra incorrecta (email a un amigo):', ['Dear', 'Alex,', 'how', 'are', 'you?'], 0, 'Hi'),
        tap('Toca la palabra incorrecta:', ['I', 'look', 'forward', 'to', 'hear', 'from', 'you.'], 4, 'hearing'),
        tap('Toca la palabra incorrecta (saludo formal):', ['Esteemed', 'Mr.', 'Lopez,'], 0, 'Dear'),
        tap('Toca la palabra incorrecta (correo de trabajo):', ['LOL', 'see', 'you', 'later.'], 0, '(quítalo)'),
        tap('Toca la palabra incorrecta (saludo formal):', ['Hello', 'Mr.', 'Smith,', 'how', 'are', 'you?'], 0, 'Dear'),
        tap('Toca la palabra incorrecta:', ['I', 'look', 'forward', 'to', 'meet', 'you.'], 4, 'meeting'),
        tap('Toca la palabra incorrecta (correo de trabajo):', ['THX', 'for', 'your', 'help,', 'Mr.', 'Lopez.'], 0, 'Thanks'),
        tap('Toca la palabra incorrecta:', ['I', 'am', 'writing', 'to', 'inquire', 'to', 'a', 'room.'], 5, 'about'),
      ] },
    { id: 'modulo2-12-resumen', type: 'resumen', markdown: `## **🎯 Resumen práctico que debes recordar**

* ✅ **Identifica a quién escribes:** amigo = **informal**; profesor/trabajo = **formal**.
* ✅ Un email tiene **saludo + cuerpo + despedida**. *Hi [Name],* y *Cheers,* para informal; *Dear Mr. Smith,* y *Sincerely,* para formal.
* ✅ Las **abreviaturas de chat** (LOL, OMG, BTW) son **solo informales**. 🚫 fuera de los emails formales.
* ✅ Tras *look forward to* siempre va **-ing**: *I look forward to **hearing** from you.*
* ✅ No olvides el **asunto**, escribe días/meses con **mayúscula** y sé **breve** (4-6 líneas). ✂️` },
    { id: 'modulo2-12-cierre', type: 'cierre', markdown: `#### **🌟 Cierre**

¡Llegaste al final del módulo con la **pluma digital afilada** 🖋! Ahora escribes desde un **WhatsApp casual** hasta un **email formalito** (¡súper útil para el KET!). ✅

✅ **Misión cumplida:** {{mascot}} te entrega tu diploma 🎓: *"Ahora hablas, escuchas, lees y escribes en inglés A2 con confianza."*

**🏅 Insignia obtenida:** 💌🌐 *Escritor@ Global* (Maestría en Emails & Notas en inglés)` },
  ],
  quizQuestions: [
    mc('¿Cuál es un saludo FORMAL?', ['Dear Professor Smith,', 'Hey bro!', 'Hi there,', "What's up?"], 0),
    mc('¿Cuál es INFORMAL?', ['Dear Sir or Madam,', 'Hey, long time no see!', 'I am writing to inquire…', 'Yours faithfully,'], 1),
    mc('Despedida FORMAL:', ['Cheers,', 'Sincerely,', 'Talk soon!', 'Later!'], 1),
    mc('"Please find attached my resume." es un registro…', ['Informal', 'Formal', 'de chat', 'de amigos'], 1),
    mc('Saludo formal para un desconocido:', ['Dear Sir or Madam,', 'Hi there,', 'Hey!', 'Yo!'], 0),
    mc('"BTW, did you watch the game?" es...', ['formal', 'informal', 'una carta de trabajo', 'un email al banco'], 1),
    mc('La forma correcta es:', ['I look forward to hear from you.', 'I look forward to hearing from you.', 'I look forward hearing from you.', 'I look forward to hears from you.'], 1),
    mc('"ASAP" significa…', ['as soon as possible', 'as slow as possible', 'a small app', 'at school after practice'], 0),
    tap('Toca la palabra incorrecta:', ['I', 'look', 'forward', 'to', 'hear', 'from', 'you.'], 4, 'hearing'),
    tap('Toca la palabra incorrecta (a un amigo):', ['Dear', 'Alex,', 'how', 'are', 'you?'], 0, 'Hi'),
    tap('Toca la palabra incorrecta (saludo formal):', ['Esteemed', 'Mr.', 'Lopez,'], 0, 'Dear'),
    rebuild('🎧 Reconstruye la despedida formal:', 'I look forward to your reply', ['I', 'look', 'forward', 'to', 'your', 'reply', 'hear', 'soon', 'Cheers']),
    rebuild('🎧 Reconstruye el saludo a un amigo:', 'Hi Alex how are you', ['Hi', 'Alex', 'how', 'are', 'you', 'Dear', 'Sir', 'Esteemed']),
    rebuild('🎧 Reconstruye (formal):', 'Dear Sir or Madam', ['Dear', 'Sir', 'or', 'Madam', 'Hi', 'Hey', 'Alex', 'Mr.']),
    rebuild('🎧 Reconstruye:', 'I am writing to inquire about a room', ['I', 'am', 'writing', 'to', 'inquire', 'about', 'a', 'room', 'write', 'inquiry']),
  ],
};

const COURSE_DATA = {
  id: 'ingles-basico',
  title: 'AprendoEnglish.com',
  subtitle: 'Microlecciones prácticas',
  description: 'Aprende inglés paso a paso con microlecciones, misiones y quizzes pensados para practicar en tu día a día.',
  modules: [
    {
      id: 'modulo-1',
      title: 'Módulo 1: Primeros pasos',
      description: 'Al completar este módulo podrás presentarte, describir tu rutina diaria, hablar de tu entorno y sostener conversaciones básicas en inglés. 🚀',
      lessons: [
        microlection1, microlection2, microlection3, microlection4, microlection5,
        microlection6, microlection7, microlection8, microlection9, microlection10,
      ],
    },
    {
      id: 'modulo-2',
      title: 'Módulo 2: A2 en acción',
      description: 'Al completar este módulo te comunicarás en inglés A2 en situaciones cotidianas y de viaje: presente continuo, pasado, futuro, comparativos, modales, gustos, preguntas, compras, salud, viajes y escritura. ✈️',
      lessons: [
        modulo2_1, modulo2_2, modulo2_3, modulo2_4, modulo2_5, modulo2_6,
        modulo2_7, modulo2_8, modulo2_9, modulo2_10, modulo2_11, modulo2_12,
      ],
    },
  ],
};

if (typeof window !== 'undefined') { window.COURSE_DATA = COURSE_DATA; }
