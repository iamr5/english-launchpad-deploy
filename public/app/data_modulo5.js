// data_modulo5.js — Módulo 5 (Nivel C1, rumbo a IELTS/TOEFL).
// Self-contained: registers itself onto window.COURSE_DATA. Do NOT add these
// lessons to data.js. Helpers are redeclared locally inside the IIFE so they
// don't collide with data.js's top-level `const mc/rebuild/tap`.
(function () {
  const mc = (question, options, correctIndex, skill) => ({ type: 'mc', question, options, correctIndex,
  // 'reading' = trae pasaje en inglés y hay que leerlo; 'teoria' = pregunta de
  // una línea sobre la regla. Se puede forzar con el 4º argumento; si no, se
  // deduce del enunciado, que en los ítems de lectura siempre abre con 'Lee:'.
  // Los ítems nuevos deberían pasarlo explícito (ver AUTHORING-reading-writing.md).
  skill: skill || (/^Lee\b/.test(question) ? 'reading' : 'teoria') });
  const rebuild = (question, correctSentence, wordBlocks) => ({ type: 'rebuild', question, correctSentence, wordBlocks });
  const tap = (question, sentenceTokens, errorTokenIndex, correctedToken) => ({ type: 'tap', question, sentenceTokens, errorTokenIndex, correctedToken });
  // writing(enunciado, aceptadas, extra) — ver el docblock en data.js y
  // src/content/AUTHORING-reading-writing.md. Redeclarado aquí como los demás
  // helpers, para no chocar con el const de nivel superior de data.js.
  const writing = (question, accepted, extra) => Object.assign(
    { type: 'writing', question, accepted: [].concat(accepted) }, extra || {});

  const modulo5_1 = {
    id: 'modulo5-1',
    title: 'Microlección 1',
    durationMinutes: 13,
    audioCues: ['Escucha el contenido de la lección.', 'Fíjate en los puntos clave.', 'Ahora vienen tus ejercicios.'],
    contentBlocks: [
      { id: 'modulo5-1-titulo', type: 'titulo', title: '¿Puedes encontrar lo esencial sin leer cada palabra? 🧐', subtitle: 'Lectura crítica y escaneo de textos académicos', markdown: '' },
      { id: 'modulo5-1-mision', type: 'mision', markdown: `Desarrollar habilidades de lectura avanzada: **escanear** textos académicos, **extraer ideas principales** y detalles relevantes rápidamente. 📚⚡` },
      { id: 'modulo5-1-intro', type: 'intro', markdown: `#### **✨ Introducción**

¡Hola! Ozzy aquí, listo para leer entre líneas 📚💬.

En el nivel **C1** leerás artículos y textos complejos, como informes universitarios o noticias científicas. La clave es usar estrategias: **lectura crítica** (entender la idea general) y **escaneo** (buscar información específica).

Hoy practicaremos cómo identificar lo esencial sin perdernos en cada palabra. 🚀` },
      { id: 'modulo5-1-teoria-1', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `#### **🛠 ¿Cómo leer eficazmente?**

No necesitas leer cada palabra. Usa estas estrategias:

- **Skimming (lectura rápida):** Lee primero títulos, subtítulos y primeros/últimos párrafos para captar la idea global.
- **Scanning (escaneo):** Busca datos concretos (nombres, cifras, fechas) pasando la vista rápidamente por el texto.
- **Palabras clave:** Identifica términos importantes o recurrentes: *trend, research, challenge, outcome...*
- **Preguntas antes de leer:** Si sabes lo que buscas (p.ej. "¿Cuál fue la conclusión?"), lee con ese objetivo.
- **Resumir mentalmente:** Al terminar un párrafo, parafrasea la idea en tu mente para asegurar comprensión.

> 💡 **Skimming** = idea global. **Scanning** = dato específico. ¡No los confundas!`,
        miniQuiz: [
          mc('¿Qué estrategia usas para captar la idea GLOBAL de un texto?', ['Scanning (escaneo)', 'Skimming (lectura rápida)', 'Leer palabra por palabra', 'Parafrasear cada frase'], 1),
          mc('Quieres encontrar una fecha concreta en un informe. ¿Qué haces?', ['Skimming para la idea general', 'Scanning para localizar el dato', 'Resumir mentalmente el texto', 'Buscar la tesis del autor'], 1),
          mc('¿Para qué sirve hacerte preguntas ANTES de leer?', ['Para leer más despacio cada palabra', 'Para leer con un objetivo claro y buscar eso', 'Para evitar usar el diccionario', 'Para memorizar el vocabulario nuevo'], 1),
          mc('Al terminar un párrafo, ¿qué te recomienda Ozzy?', ['Memorizar cada palabra del párrafo', 'Parafrasear la idea en tu mente', 'Saltar directo a la conclusión', 'Traducir el párrafo al español'], 1),
          mc('Leerás primero títulos, subtítulos y el primer y último párrafo. Eso es...', ['scanning', 'skimming', 'parafraseo', 'inferencia'], 1),
          mc('¿Cuál de estas es una "palabra clave" típica que buscarías al escanear un texto académico?', ['the, of, and', 'research, trend, outcome', 'hello, please, thanks', 'maybe, perhaps, somehow'], 1),
          rebuild('Ordena este consejo de lectura.', 'Scan the text for key words.', ['Scan', 'the', 'text', 'for', 'key', 'words.', 'slowly', 'every', 'word', 'skim']),
          rebuild('Ordena esta frase sobre la idea global.', 'Skim the article to get the main idea.', ['Skim', 'the', 'article', 'to', 'get', 'the', 'main', 'idea.', 'scan', 'detail', 'number']),
          mc('Lee: "Rosa skims the article first to get the main idea. Then she scans the text for key words: research, trend and outcome. Luis scans the text for key words every day, but he does not skim the article first. Rosa gets the main idea and the key words too. Luis gets the key words, but he does not get the main idea. Milagros skims the article on Sunday and gets the main idea." — ¿quiénes terminan con la visión de conjunto del artículo?', [
            'Rosa y Milagros, que sí hacen la lectura global.',
            'Solo Luis, que revisa el texto todos los días.',
            'Los tres, cada uno por su propio camino.',
            'Solo Milagros, que lee los domingos.'], 0),
          mc('Lee: "Rosa skims the article first to get the main idea. Then she scans the text for key words: research, trend and outcome. Luis scans the text for key words every day, but he does not skim the article first. Rosa gets the main idea and the key words too. Luis gets the key words, but he does not get the main idea. Milagros skims the article on Sunday and gets the main idea." — ¿qué da a entender el texto sobre la rutina diaria de Luis?', [
            'Que repetirla no le da la visión de conjunto.',
            'Que le basta para resumir el artículo completo.',
            'Que le da la idea global más rápido que a Rosa.',
            'Que encuentra menos palabras clave que las otras dos.'], 0),
          writing('Escríbelo en inglés: "Escanea el texto en busca de palabras clave."', ['Scan the text for key words.'],
            { hint: 'Buscar datos sueltos = scan; captar la idea global = skim.',
              reject: [['Skim the text for key words.', 'Para datos concretos va "scan"; "skim" es para la idea global.'], ['Scan the text for every word.', 'Escanear es lo contrario de leer cada palabra: for key words.'], ['Scan the text for key word.', 'Van varias, así que en plural: for key words.']] }),
        ] },
      { id: 'modulo5-1-teoria-2', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `#### **📑 Del texto a la estrategia**

Mira cómo aplicar las estrategias a ejemplos reales:

| Texto académico (ejemplo) | Estrategia |
|---|---|
| *"In recent years, climate research has intensified. A 2018 study in Nature found that sea levels are rising faster than predicted..."* | Reconoce **año y fuente**: apunta "2018, Nature, niveles del mar". |
| *"The author argues that education is key to development. To illustrate, she cites examples from rural schools."* | Busca **conectores**: "To illustrate" indica ejemplo. Extrae la tesis: "educación es clave". |

> 🧐 **Consejo C1:** Usa diccionarios contextuales (como *Oxford Learner's Dictionary*) solo si es necesario; intenta deducir por contexto primero.`,
        miniQuiz: [
          mc('En "A 2018 study in Nature...", ¿qué datos clave debes apuntar?', ['El año (2018) y la fuente (Nature)', 'Todas las palabras de la frase', 'Solo el verbo "found"', 'El número de páginas del estudio'], 0),
          mc('El conector "To illustrate" en un texto te indica que viene...', ['Una conclusión final', 'Un ejemplo', 'Una contradicción', 'Una causa'], 1),
          mc('Según el consejo C1, ¿cuándo deberías usar el diccionario?', ['Siempre, en cada palabra nueva', 'Solo si es necesario, tras intentar deducir por contexto', 'Nunca, está prohibido', 'Solo al final de la lectura'], 1),
          mc('En la frase sobre educación, ¿cuál es la tesis del autor?', ['Que las escuelas rurales son malas', 'Que la educación es clave para el desarrollo', 'Que hay que ilustrar con ejemplos', 'Que la investigación es difícil'], 1),
          mc('Lees: "Sea levels are rising faster than predicted." Esto significa que suben...', ['más lento de lo esperado', 'más rápido de lo previsto', 'exactamente lo previsto', 'sin relación con las predicciones'], 1),
          mc('"To illustrate, she cites examples from rural schools." ¿Qué función cumplen las escuelas rurales?', ['Son la tesis principal', 'Son ejemplos que respaldan la tesis', 'Contradicen al autor', 'Son la fuente del estudio'], 1),
          tap('Corrige el conector mal escrito.', ['To', 'ilustrate', ',', 'the', 'author', 'cites', 'two', 'studies.'], 1, 'illustrate'),
          rebuild('Ordena esta frase sobre deducir por contexto.', 'Try to guess the meaning from context first.', ['Try', 'to', 'guess', 'the', 'meaning', 'from', 'context', 'first.', 'dictionary', 'word', 'always']),
          mc('Lee: "The author argues that education is key to development. To illustrate, she cites examples from rural schools in Trujillo. To illustrate, she also cites two studies from Lima. In recent years, climate research has intensified. A 2018 study in Nature found that sea levels are rising faster than predicted. She cites the rural schools twice, but she cites that 2018 study only once." — ¿cuál es la afirmación central y qué está ahí solo para respaldarla?', [
            'Central: la educación; respaldo: las escuelas rurales.',
            'Central: las escuelas rurales; respaldo: la educación.',
            'Central: el estudio del mar; respaldo: la educación.',
            'Central: la investigación climática; respaldo: los estudios de Lima.'], 0),
          mc('Lee: "The author argues that education is key to development. To illustrate, she cites examples from rural schools in Trujillo. To illustrate, she also cites two studies from Lima. In recent years, climate research has intensified. A 2018 study in Nature found that sea levels are rising faster than predicted. She cites the rural schools twice, but she cites that 2018 study only once." — ¿qué postura de quien escribe sugiere que el estudio del mar aparezca una sola vez?', [
            'Que el clima no es su tema de fondo.',
            'Que el clima es su prueba más importante.',
            'Que desconfía de lo que publicó Nature.',
            'Que las escuelas rurales le interesan poco.'], 0),
          writing('Escríbelo en inglés: "Intenta deducir el significado por el contexto primero."', ['Try to guess the meaning from context first.', 'Try to guess the meaning from the context first.'],
            { hint: 'Primero el contexto y solo después el diccionario.',
              reject: [['Use the dictionary first.', 'El consejo C1 es al revés: Try to guess the meaning from context first.'], ['Try to guessing the meaning from context first.', 'Tras "to" va el verbo base: Try to guess the meaning from context first.'], ['Try to guess the meaning from context.', 'Te falta "first": el orden importa, primero el contexto.']] }),
        ] },
      { id: 'modulo5-1-errores', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `#### **🚫 Errores Comunes**

- ❌ Leer **palabra por palabra** un texto largo.
  ✅ **Escanear** buscando fechas, nombres o conectores. (No te atasques en palabras desconocidas sin mirar antes el contexto.)
- ❌ **No relacionar** ideas entre párrafos.
  ✅ Busca **conexiones**: si en un párrafo se mencionó "study", en el siguiente tal vez dicen sus resultados.

> 🐶 Ozzy dice: ¡lee con estrategia, no con lupa! Encuentra las pistas y conéctalas. 🔍`,
        miniQuiz: [
          tap('Corrige el plural en esta estrategia de escaneo:', ['Scan', 'the', 'text', 'for', 'key', 'word.'], 5, 'words.'),
          tap('Esta frase tiene un conector mal escrito. Arréglalo.', ['To', 'ilustrate', ',', 'she', 'cites', 'examples', 'from', 'rural', 'schools.'], 1, 'illustrate'),
          tap('Ozzy busca el dato clave. Corrige el error.', ['The', '2018', 'study', 'was', 'publish', 'in', 'Nature.'], 4, 'published'),
          tap('Corrige el verbo para conectar ideas entre párrafos.', ['We', 'should', 'connecting', 'ideas', 'between', 'paragraphs.'], 2, 'connect'),
          tap('Corrige la forma verbal de esta estrategia.', ['Always', 'skiming', 'the', 'first', 'paragraph', 'for', 'the', 'main', 'idea.'], 1, 'skim'),
          tap('Corrige el error en esta frase de escaneo.', ['Scan', 'the', 'report', 'for', 'specifics', 'dates', 'and', 'names.'], 4, 'specific'),
          tap('Corrige el verbo en esta frase sobre resumir.', ['After', 'each', 'paragraph,', 'paraphrasing', 'the', 'idea.'], 3, 'paraphrase'),
          tap('Corrige el error en esta frase sobre la fuente.', ['The', 'study', 'was', 'finded', 'in', 'a', '2020', 'journal.'], 3, 'found'),
          mc('Lee: "Paragraph 1: In recent years, climate research has intensified. The 2018 study was published in Nature. The 2020 study was published in Trujillo, and it cites examples from rural schools. Paragraph 2: The Nature study found that sea levels are rising faster than predicted. To illustrate, it cites two studies from Lima. The Trujillo study was found in a 2020 journal too." — ¿de cuál de los dos estudios no llegamos a saber qué encontró?', [
            'Del de Trujillo: solo sabemos dónde salió.',
            'Del de Nature: solo sabemos el año.',
            'De los dos: el texto solo da fechas.',
            'De ninguno: el texto da los dos hallazgos.'], 0),
          mc('Lee: "In recent years, climate research has intensified. A 2018 study in Nature found that sea levels are rising faster than predicted. This trend was found in a 2020 journal too. To illustrate, the author cites two studies from Lima and Trujillo. The 2018 study was published in Nature, and the 2020 study was published in Lima. It also cites examples from rural schools." — ¿a qué se refiere "this trend" según el contexto?', [
            'A que el mar sube más rápido de lo previsto.',
            'A que la investigación climática ha aumentado.',
            'A que el estudio salió en dos revistas distintas.',
            'A que quien escribe cita dos estudios de Lima.'], 0),
          writing('Escríbelo en inglés: "Deberíamos conectar las ideas entre párrafos."', ['We should connect ideas between paragraphs.', 'We should connect the ideas between the paragraphs.'],
            { reject: [['We should connecting ideas between paragraphs.', 'Tras "should" va el verbo base: We should connect ideas between paragraphs.'], ['We should to connect ideas between paragraphs.', 'Tras un modal no va "to": We should connect ideas between paragraphs.'], ['We should connect ideas between paragraph.', 'Son varios los que conectas, así que en plural: between paragraphs.']] }),
        ] },
      { id: 'modulo5-1-resumen', type: 'resumen', markdown: `#### **📝 Resumen**

- **Skimming** → idea global (títulos, subtítulos, primeros/últimos párrafos).
- **Scanning** → datos concretos (nombres, cifras, fechas).
- **Palabras clave** → *trend, research, challenge, outcome...*
- **Pregunta antes de leer** y **parafrasea** al terminar cada párrafo.
- **Conecta** ideas entre párrafos y deduce por **contexto** antes de usar el diccionario.` },
      { id: 'modulo5-1-cierre', type: 'cierre', markdown: `#### **🌟 Cierre**

¡Bien leído! 📖 Ahora sabes extraer información clave de textos académicos. Esto te ayudará a comprender informes y estudiar de manera eficiente.

¡Siguiente nivel, sigamos leyendo! 🚀

**🏅 Insignia obtenida:** *Lector Crítico* (¡Maestr@ de la lectura estratégica!) 🧐📚` },
    ],
    quizQuestions: [
      mc('Texto: "The city council report (2021) highlights a significant drop in pollution. Specifically, \'PM2.5 levels decreased by 20% since 2015\'." Según el informe, ¿qué pasó con la contaminación?', ['Aumentó un 20%.', 'Disminuyó un 20%.', 'Se mantuvo igual.', 'Se duplicó.'], 1),
      mc('En el mismo texto, ¿desde qué año se midió la reducción de PM2.5?', ['2015', '2021', '2000', '2018'], 0),
      mc('¿Qué estrategia usarías para captar la idea general de un artículo largo?', ['Scanning (escaneo)', 'Skimming (lectura rápida)', 'Leer palabra por palabra', 'Traducir todo el texto'], 1),
      mc('Buscas una cifra específica dentro de un informe. ¿Qué haces?', ['Skimming general', 'Scanning para localizar la cifra', 'Resumir el texto entero', 'Memorizar cada párrafo'], 1),
      mc('El conector "To illustrate" anuncia que viene...', ['una conclusión', 'un ejemplo', 'un contraste', 'una causa'], 1),
      mc('¿Por qué conviene hacerse preguntas antes de leer?', ['Para leer más lento', 'Para leer con un objetivo y localizar lo que buscas', 'Para no usar el diccionario nunca', 'Para memorizar el texto'], 1),
      mc('Si una palabra es desconocida en medio del texto, lo mejor es...', ['pararte y buscarla siempre', 'deducir su significado por el contexto primero', 'saltarte el párrafo entero', 'traducir palabra por palabra'], 1),
      mc('"Palabras clave" útiles al escanear un texto académico serían...', ['the, a, of', 'research, trend, outcome', 'hello, bye, please', 'big, nice, good'], 1),
      mc('Al terminar cada párrafo, una buena estrategia es...', ['copiarlo entero', 'parafrasear su idea mentalmente', 'olvidarlo y seguir', 'subrayar cada palabra'], 1),
      rebuild('Ordena este consejo de lectura en inglés.', 'Scan the report for key dates and names.', ['Scan', 'the', 'report', 'for', 'key', 'dates', 'and', 'names.', 'slowly', 'every', 'skim']),
      rebuild('Ordena esta frase sobre conectar ideas.', 'Connect the ideas between the paragraphs.', ['Connect', 'the', 'ideas', 'between', 'the', 'paragraphs.', 'word', 'each', 'split']),
      rebuild('Ordena esta frase sobre la idea principal.', 'Skim the first paragraph for the main idea.', ['Skim', 'the', 'first', 'paragraph', 'for', 'the', 'main', 'idea.', 'scan', 'detail', 'last']),
      tap('Corrige el conector mal escrito en esta frase.', ['To', 'ilustrate', ',', 'the', 'author', 'cites', 'a', 'study.'], 1, 'illustrate'),
      tap('Corrige el verbo en esta frase sobre el estudio.', ['The', '2018', 'study', 'was', 'publish', 'in', 'Nature.'], 4, 'published'),
      tap('Corrige el plural en esta frase de escaneo.', ['Look', 'for', 'the', 'key', 'word', 'in', 'each', 'section.'], 4, 'words'),
    ],
  };

  const modulo5_2 = {
    id: 'modulo5-2',
    title: 'Microlección 2',
    durationMinutes: 13,
    audioCues: ['Escucha el contenido de la lección.', 'Fíjate en los puntos clave.', 'Ahora vienen tus ejercicios.'],
    contentBlocks: [
      { id: 'modulo5-2-titulo', type: 'titulo', title: '¿Cómo escribir como un académico de verdad? 🎓', subtitle: 'Producción académica avanzada (ensayos y reportes)', markdown: '' },
      { id: 'modulo5-2-mision', type: 'mision', markdown: `Aprender a redactar textos académicos avanzados: **ensayos y reportes formales** con vocabulario académico, **citas** y **tono objetivo**. 🎓` },
      { id: 'modulo5-2-intro', type: 'intro', markdown: `#### **✨ Introducción**

¡Hola de nuevo, crack! 👋 En este nivel escribiremos como **profesionales y académicos**. Necesitas **respaldar ideas con datos**, usar **lenguaje formal** y estructurar bien tus escritos largos (ensayos, reportes). 📄

Hoy veremos cómo usar **conectores complejos** y **vocabulario técnico** para que tu escritura sea de nivel **C1**. ¡Vamos con todo! 🚀` },
      { id: 'modulo5-2-teoria-1', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `#### **🏗 Estructura de un ensayo o reporte**

Un buen texto académico tiene tres partes bien definidas. ¡Como una tesis de maestría! 🎓

| Parte | Qué hace |
|---|---|
| **Introducción** | Presenta el tema y la tesis |
| **Desarrollo** | Varios párrafos, cada uno con idea principal y ejemplos/citas |
| **Conclusión** | Resume hallazgos y sugiere implicaciones o acciones futuras |

En el desarrollo, usa **referencias** para respaldar tus ideas:

> *"According to Smith (2020), the data reveal a clear trend."*

🧱 **Metáfora:** Imagina que tu ensayo es una tesis de maestría: cada argumento es un ladrillo bien fundamentado en datos, y los conectores son el cemento que los une. 🏛`,
        miniQuiz: [
          mc('¿Qué parte del ensayo presenta el tema y la tesis?', ['La conclusión', 'La introducción', 'El desarrollo', 'La bibliografía'], 1),
          mc('¿Dónde colocas ejemplos y citas que respaldan tus ideas?', ['En el desarrollo', 'En el título', 'En la introducción', 'En el saludo'], 0),
          mc('¿Cómo se cita una fuente correctamente en inglés académico?', ['"Someone said that..."', '"According to Smith (2020),..."', '"I read somewhere that..."', '"Everybody knows that..."'], 1),
          mc('La conclusión de un ensayo debería...', ['introducir un tema nuevo', 'resumir hallazgos y sugerir implicaciones', 'dar tu opinión personal informal', 'incluir la primera cita'], 1),
          mc('Cada párrafo del desarrollo debería tener...', ['solo una cita y nada más', 'una idea principal con ejemplos o citas', 'la tesis completa repetida', 'una pregunta sin responder'], 1),
          mc('Según la metáfora, los conectores en tu ensayo son como...', ['los ladrillos', 'el cemento que une los argumentos', 'el techo final', 'la decoración'], 1),
          rebuild('Reconstruye esta cita académica.', 'According to Smith (2020), the data reveal a clear trend.', ['According', 'to', 'Smith', '(2020),', 'the', 'data', 'reveal', 'a', 'clear', 'trend.', 'someone', 'said', 'maybe']),
          rebuild('Ordena esta frase sobre la estructura.', 'A good essay has an introduction, body and conclusion.', ['A', 'good', 'essay', 'has', 'an', 'introduction,', 'body', 'and', 'conclusion.', 'title', 'opinion', 'only']),
          mc('Lee: "Rosa: A good essay has an introduction, body and conclusion. According to Smith (2020), the data reveal a clear trend. Luis: Everybody knows that the data reveal a clear trend. Someone said that a good essay has an introduction, body and conclusion. Milagros: I read somewhere that the data reveal a clear trend. According to Smith (2020), a good essay has an introduction, body and conclusion." — ¿quién respalda con una fuente el dato sobre la tendencia?', [
            'Rosa: para ese dato nombra al autor y el año.',
            'Milagros: ella también nombra a Smith y el 2020.',
            'Luis: para él ese dato ya lo sabe todo el mundo.',
            'Los tres: los tres mencionan la misma tendencia.'], 0),
          mc('Lee: "Rosa: A good essay has an introduction, body and conclusion. According to Smith (2020), the data reveal a clear trend. Luis: Everybody knows that the data reveal a clear trend. Someone said that a good essay has an introduction, body and conclusion. Milagros: I read somewhere that the data reveal a clear trend. According to Smith (2020), a good essay has an introduction, body and conclusion." — ¿qué es lo que Milagros respalda con la cita de Smith?', [
            'Cómo se organiza un ensayo, no la tendencia.',
            'La tendencia clara que muestran los datos.',
            'Lo que Luis dice que todo el mundo ya sabe.',
            'Lo mismo que Rosa respalda con esa cita.'], 0),
          writing('Escríbelo en inglés — con la cita bien puesta: "Según Smith (2020), los datos revelan una tendencia clara."', ['According to Smith (2020), the data reveal a clear trend.'],
            { hint: 'La cita académica va "According to" + autor + año entre paréntesis.',
              reject: [['Someone said that the data reveal a clear trend.', 'Una cita necesita autor y año: According to Smith (2020), the data reveal a clear trend.'], ['I read somewhere that the data reveal a clear trend.', 'Eso no es una fuente: nombra al autor y el año, According to Smith (2020), ...'], ['According to Smith (2020), the data reveals a clear trend.', 'En registro académico "data" es plural: the data reveal, no reveals.']] }),
        ] },
      { id: 'modulo5-2-teoria-2', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `#### **🎩 Lenguaje formal y conectores avanzados**

El tono académico es **objetivo** e **impersonal**. Evita expresiones personales como *"I think"*. 🙅

**Usa tercera persona o voz pasiva:**

> *"It is believed that..."*
> *"Researchers suggest..."*
> *"It can be argued that..."*

**Vocabulario académico** que suma puntos: 💎 *significant, methodology, hypothesis, outcomes, evidence.*

**Conectores avanzados** para enlazar ideas complejas: 🔗 *Furthermore, however, nevertheless, consequently, despite, whereas.*

**Ejemplo de transformación:**

| 🇪🇸 Español | 🇬🇧 Inglés académico |
|---|---|
| La investigación muestra resultados contradictorios. Además, hay limitaciones. | *The research yields contradictory findings. Furthermore, notable limitations must be considered.* |`,
        miniQuiz: [
          mc('¿Cuál es la versión más formal y objetiva?', ['"I think the results are good."', '"It can be argued that the results are positive."', '"The results are awesome, honestly."', '"The results are kinda cool."'], 1),
          mc('¿Qué conector usarías para AÑADIR información en un texto académico?', ['Furthermore', 'because of', 'so', 'anyway'], 0),
          mc('¿Cuál de estas es vocabulario académico apropiado?', ['stuff', 'methodology', 'things', 'a lot of'], 1),
          mc('Para sonar impersonal y objetivo, conviene usar...', ['primera persona y opiniones', 'tercera persona o voz pasiva', 'jerga y abreviaturas', 'signos de exclamación'], 1),
          mc('¿Qué conector marca un CONTRASTE entre dos ideas?', ['Furthermore', 'Nevertheless', 'Consequently', 'In addition'], 1),
          mc('"Consequently" se usa para introducir...', ['un ejemplo', 'una consecuencia o resultado', 'una adición', 'una contradicción'], 1),
          tap('Corrige el conector para que suene académico.', ['The', 'sample', 'was', 'small;', 'furthermor,', 'it', 'was', 'biased.'], 4, 'furthermore,'),
          rebuild('Reconstruye esta oración académica.', 'The research yields contradictory findings.', ['The', 'research', 'yields', 'contradictory', 'findings.', 'stuff', 'kids', 'awesome', 'things']),
          mc('Lee: "According to Smith (2020), the data reveal a clear trend. It can be argued that the results are positive. Nevertheless, the research yields contradictory findings. The sample was small; furthermore, it was biased. Researchers suggest that notable limitations must be considered. It is believed that the outcomes are not significant. Consequently, the hypothesis must be considered. Whereas the data reveal a clear trend, the evidence is contradictory." — ¿con cuál de estas afirmaciones estaría de acuerdo quien escribe?', [
            'Que la tendencia existe, pero aún no está bien probada.',
            'Que la tendencia existe y los datos ya la prueban.',
            'Que no hay ninguna tendencia y que Smith se equivoca.',
            'Que la muestra fue amplia y por eso el dato vale.'], 0),
          mc('Lee: "According to Smith (2020), the data reveal a clear trend. It can be argued that the results are positive. Nevertheless, the research yields contradictory findings. The sample was small; furthermore, it was biased. Researchers suggest that notable limitations must be considered. It is believed that the outcomes are not significant. Consequently, the hypothesis must be considered. Whereas the data reveal a clear trend, the evidence is contradictory." — ¿qué concede el autor y qué sostiene en realidad?', [
            'Concede que el resultado parece positivo; sostiene que hay limitaciones.',
            'Concede que hay limitaciones; sostiene que el resultado es positivo.',
            'Concede que la muestra fue sesgada; sostiene que eso no importa.',
            'Concede que Smith acierta; sostiene que no existe tal tendencia.'], 0),
          writing('Escríbelo en inglés — registro académico: "La investigación muestra resultados contradictorios. Además, deben considerarse limitaciones notables."', ['The research yields contradictory findings. Furthermore, notable limitations must be considered.'],
            { hint: 'El verbo académico es "yields" (no "shows") y la adición va con "Furthermore,".',
              reject: [['The research shows contradictory findings. And there are notable limitations.', 'Registro académico: "yields" en vez de "shows" y "Furthermore," en vez de "and".'], ['The research yields contradictory findings. And notable limitations must be considered.', 'La adición académica se marca con "Furthermore,", no con "and".'], ['I think the research yields contradictory findings. Furthermore, notable limitations must be considered.', 'El tono académico es impersonal: fuera el "I think".']] }),
        ] },
      { id: 'modulo5-2-errores', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `#### **🚫 Errores Comunes**

Vamos a pulir esos detalles que delatan a un escritor poco formal. ✍️

- ❌ **Lenguaje informal:** *"Kids in rural area got no money."*
  ✅ **Formal:** *"Children in rural areas do not receive sufficient funding."*
- ❌ **Citas sin referencia:** *"Un estudio dijo X."*
  ✅ **Con fuente:** *"A study by Johnson (2019) demonstrates X."*
- ❌ **Frases demasiado largas sin pausas.**
  ✅ **Divide en oraciones claras** y usa puntuación correcta.

¡Corrijamos juntos en los ejercicios! 💪`,
        miniQuiz: [
          tap('Corrige el verbo informal por uno formal:', ['Children', 'in', 'rural', 'areas', 'got', 'no', 'funding.'], 4, 'receive'),
          tap('Toca la palabra informal y hazla formal:', ['Kids', 'in', 'rural', 'areas', 'do', 'not', 'receive', 'sufficient', 'funding.'], 0, 'Children'),
          tap('Esta cita necesita una fuente; toca la palabra vaga:', ['A', 'study', 'somewhere', 'demonstrates', 'this', 'finding.'], 2, 'by Johnson (2019)'),
          tap('Corrige el conector para que suene académico:', ['The', 'evidence', 'is', 'limited;', 'plus', 'the', 'sample', 'is', 'small.'], 4, 'furthermore,'),
          tap('Toca el verbo informal y hazlo formal:', ['The', 'data', 'shows', 'a', 'big', 'change', 'in', 'behaviour.'], 4, 'significant'),
          tap('Corrige la palabra informal por una académica.', ['The', 'researchers', 'got', 'considerable', 'evidence.'], 2, 'obtained'),
          tap('Corrige el conector informal por uno formal.', ['The', 'theory', 'is', 'old;', 'so,', 'it', 'has', 'been', 'revised.'], 4, 'consequently,'),
          tap('Corrige el verbo para un tono impersonal/formal.', ['It', 'is', 'belief', 'that', 'the', 'method', 'is', 'flawed.'], 2, 'believed'),
          mc('Lee: "Luis: Kids in rural areas got no money. A study somewhere demonstrates this finding. The evidence is limited; plus the sample is small. Rosa: Children in rural areas do not receive sufficient funding. A study by Johnson (2019) demonstrates this finding. The evidence is limited; furthermore, the sample is small. The data shows a significant change in behaviour. It is believed that the method is flawed." — ¿con cuál de estas afirmaciones estaría de acuerdo Rosa?', [
            'Que el hallazgo importa, aunque la prueba todavía es débil.',
            'Que la prueba es sólida y el método está bien planteado.',
            'Que no hubo ningún cambio en el comportamiento estudiado.',
            'Que las zonas rurales sí reciben fondos suficientes.'], 0),
          mc('Lee: "Luis: Kids in rural areas got no money. A study somewhere demonstrates this finding. The evidence is limited; plus the sample is small. Rosa: Children in rural areas do not receive sufficient funding. A study by Johnson (2019) demonstrates this finding. The evidence is limited; furthermore, the sample is small. The data shows a significant change in behaviour. It is believed that the method is flawed." — ¿en qué se diferencian de verdad los dos textos?', [
            'Afirman lo mismo, pero solo uno dice de dónde sale.',
            'Afirman lo contrario: uno dice que sí hay fondos.',
            'Los dos citan el mismo estudio de Johnson de 2019.',
            'Solo el primero admite que la evidencia es limitada.'], 0),
          writing('Escríbelo en inglés — registro de informe: "Los niños de zonas rurales no reciben fondos suficientes."', ['Children in rural areas do not receive sufficient funding.'],
            { reject: [['Kids in rural areas got no funding.', 'Ese es el registro de la calle: en un informe va "Children in rural areas do not receive sufficient funding."'], ['Kids in rural areas do not receive sufficient funding.', '"Kids" es coloquial; el término académico es "children".'], ['Children in rural areas got no funding.', '"Got no" es coloquial; en registro formal: do not receive sufficient funding.']] }),
        ] },
      { id: 'modulo5-2-resumen', type: 'resumen', markdown: `#### **📌 Resumen**

- 🏗 **Estructura:** introducción (tema + tesis) → desarrollo (ideas + citas) → conclusión (hallazgos + implicaciones).
- 🎩 **Tono formal:** tercera persona o voz pasiva; nada de *"I think"*.
- 💎 **Vocabulario:** *significant, methodology, hypothesis, outcomes, evidence*.
- 🔗 **Conectores:** *Furthermore, however, nevertheless, consequently, despite, whereas*.
- 📚 **Citas:** siempre con fuente → *"According to Smith (2020),..."*` },
      { id: 'modulo5-2-cierre', type: 'cierre', markdown: `#### **🌟 Cierre**

¡Excelente trabajo! 🏅 Ahora puedes escribir textos académicos de nivel **C1**: claros, formales y bien organizados. Tu próximo ensayo será impresionante. 📄✨

**🏅 Insignia obtenida:** *Académico Pro* (¡Tu escritura es de postgrado!) 🖋🎓` },
    ],
    quizQuestions: [
      mc('Versión académica de "The experiment was a big success; it\'s results are good."', ['"The experiment proved successful; its results were satisfactory."', '"The experiment was really very successful, and the results are good."', '"The experiment was awesome and the results rock."', '"It worked great, the results are nice."'], 0),
      mc('Versión académica de "Scientists find that climate change is bad."', ['"Scientists find climate change bad."', '"Scientists have found that climate change has serious impacts."', '"Scientists say climate change is super bad."', '"Climate change is a really big problem, scientists think."'], 1),
      mc('¿Qué expresión es propia del tono académico objetivo?', ['"I think this is true."', '"It can be argued that this is true."', '"This is totally true, trust me."', '"Honestly, this is just true."'], 1),
      mc('¿Cuál es un conector avanzado para mostrar contraste?', ['and', 'nevertheless', 'also', 'plus'], 1),
      mc('¿Cómo se introduce correctamente una cita?', ['"Someone said X."', '"According to Smith (2020), X."', '"They say X."', '"I read somewhere X."'], 1),
      mc('¿Qué parte del ensayo presenta el tema y la tesis?', ['La conclusión', 'La introducción', 'El desarrollo', 'La cita'], 1),
      mc('"Consequently" introduce...', ['un ejemplo', 'una consecuencia', 'un contraste', 'una adición'], 1),
      mc('¿Cuál es el vocabulario más académico?', ['big and important', 'significant', 'a lot', 'pretty key'], 1),
      mc('La conclusión de un ensayo debe...', ['presentar un tema nuevo', 'resumir hallazgos y sugerir implicaciones', 'incluir la primera cita', 'usar lenguaje informal'], 1),
      rebuild('Reconstruye la oración académica:', 'The research yields contradictory findings.', ['The', 'research', 'yields', 'contradictory', 'findings.', 'kids', 'stuff', 'awesome', 'things']),
      rebuild('Reconstruye la versión formal de "Kids got no money":', 'Children in rural areas do not receive sufficient funding.', ['Children', 'in', 'rural', 'areas', 'do', 'not', 'receive', 'sufficient', 'funding.', 'kids', 'cash', 'got']),
      rebuild('Reconstruye esta cita académica.', 'According to Smith (2020), the data reveal a clear trend.', ['According', 'to', 'Smith', '(2020),', 'the', 'data', 'reveal', 'a', 'clear', 'trend.', 'someone', 'said', 'maybe']),
      tap('Corrige el verbo para un tono formal/objetivo:', ['It', 'is', 'belief', 'that', 'the', 'method', 'is', 'flawed.'], 2, 'believed'),
      tap('Toca la palabra informal y conviértela en formal:', ['The', 'study', 'shows', 'kids', 'lack', 'sufficient', 'support.'], 3, 'children'),
      tap('Corrige la cita para que incluya una fuente:', ['A', 'study', 'somewhere', 'demonstrates', 'this', 'point.'], 2, 'by Johnson (2019)'),
    ],
  };

  const modulo5_3 = {
    id: 'modulo5-3',
    title: 'Microlección 3',
    durationMinutes: 13,
    audioCues: ['Escucha el contenido de la lección.', 'Fíjate en los puntos clave.', 'Ahora vienen tus ejercicios.'],
    contentBlocks: [
      { id: 'modulo5-3-titulo', type: 'titulo', title: '¿Entiendes lo que NO se dice? 🎧', subtitle: 'Listening avanzado (C1): inferencia, tono y acentos', markdown: '' },
      { id: 'modulo5-3-mision', type: 'mision', markdown: `Mejorar tu **comprensión auditiva** En entornos **académicos y profesionales**: entender **conferencias**, **entrevistas** y distintos **acentos**, infiriendo la **información implícita** que no se dice de forma literal.` },
      { id: 'modulo5-3-intro', type: 'intro', markdown: `#### **✨ Introducción**

¡**Ozzy** al habla otra vez! En este nivel, los audios son **más complejos**: seminarios, profesores nativos con **acentos distintos**, debates.

Necesitamos **escuchar con atención** y **leer entre líneas**. Hoy practicaremos estrategias de **listening avanzado**: enfocarte en el **significado**, identificar el **tono** y la **actitud** del hablante. ¡Súbete!` },
      { id: 'modulo5-3-teoria-1', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `#### **🛠 ¿Cómo entender audios difíciles?**

* **Atención al contexto:** sabe de qué va el tema (¿ciencia, historia, tecnología?). Esto ayuda a **anticipar vocabulario**. 🧭
* **Claves de habla:** tonos de voz (ánimo, enfado) y **palabras de enlace** (*however, actually, basically*) que **estructuran** el discurso. 🔗
* **Inferencia:** muchas veces no se dice todo literal. *"It's getting a bit chilly in here."* podría implicar *"Please, can we close the window?"*. Detecta las **intenciones**. 🤔

> 🚏 **Ejemplo de inferencia:** si alguien dice *"You're going to love this lecture, it's fascinating!"*, podemos inferir que **está emocionada por la presentación**.`,
        miniQuiz: [
          mc('Para anticipar el vocabulario de un audio, primero conviene fijarte en:', ['la velocidad del hablante', 'el contexto y el tema del que va', 'el número de palabras', 'el volumen del audio'], 1),
          mc('¿Qué función tienen palabras como "however", "actually" o "basically"?', ['son nombres propios', 'estructuran y conectan el discurso', 'no significan nada', 'son saludos'], 1),
          mc('*"It\'s getting a bit chilly in here."* probablemente implica:', ['que hace mucho calor', 'un deseo indirecto de cerrar la ventana', 'que el audio terminó', 'que el hablante tiene fiebre'], 1),
          mc('*"You\'re going to love this lecture, it\'s fascinating!"* sugiere que el hablante está:', ['aburrido', 'emocionado por la presentación', 'enfadado', 'confundido'], 1),
          mc('Inferir en un audio significa...', ['repetir cada palabra literal', 'captar lo que se da a entender sin decirse explícitamente', 'subir el volumen', 'traducir todo al español'], 1),
          mc('Si conoces el tema (ciencia, historia, tecnología) antes de escuchar, podrás...', ['hablar más rápido', 'anticipar el vocabulario probable', 'evitar tomar apuntes', 'ignorar al hablante'], 1),
          rebuild('🎧 Reconstruye este consejo de inferencia.', 'Try to read between the lines.', ['Try', 'to', 'read', 'between', 'the', 'lines.', 'word', 'every', 'literal', 'fast']),
          rebuild('🎧 Reconstruye esta frase sobre el tono.', 'Listen for the speaker\'s tone and attitude.', ['Listen', 'for', 'the', "speaker's", 'tone', 'and', 'attitude.', 'speed', 'volume', 'name']),
          mc('Lee: "Rosa: You\'re going to love this lecture, it\'s fascinating! Luis: Actually, it\'s getting a bit chilly in here. Milagros: However, you\'re going to love this lecture too. Luis: Basically, it\'s getting a bit chilly in here today. Rosa: Try to read between the lines. Milagros: Listen for the speaker\'s tone and attitude. Rosa: You\'re going to love this lecture, it\'s fascinating! Milagros: Basically, listen for the speaker\'s tone and attitude." — ¿Quién está pidiendo algo sin llegar a pedirlo?', [
            'Luis, que insiste dos veces en el frío que hace.',
            'Rosa, que repite dos veces lo fascinante de la charla.',
            'Milagros, que aconseja fijarse en el tono del ponente.',
            'Los tres, que se turnan para quejarse del frío.'], 0),
          mc('Lee: "Rosa: You\'re going to love this lecture, it\'s fascinating! Luis: Actually, it\'s getting a bit chilly in here. Milagros: However, you\'re going to love this lecture too. Luis: Basically, it\'s getting a bit chilly in here today. Rosa: Try to read between the lines. Milagros: Listen for the speaker\'s tone and attitude. Rosa: You\'re going to love this lecture, it\'s fascinating! Milagros: Basically, listen for the speaker\'s tone and attitude." — ¿Qué da a entender Milagros al arrancar con "However"?', [
            'Que mantiene el entusiasmo por la charla pese al reparo de Luis.',
            'Que le da la razón a Luis: ella también siente frío ahí.',
            'Que corrige a Rosa, que había exagerado sobre la charla.',
            'Que anuncia que ella se fijará solo en el tono del ponente.'], 0),
          writing('Escríbelo en inglés: "Intenta leer entre líneas."', ['Try to read between the lines.'],
            { hint: 'Consejo en imperativo: Try to + verbo en base (read).',
              reject: [['Try read between the lines.', 'Tras "try" va el infinitivo con to: Try to read between the lines.'], ['Try to reading between the lines.', 'Después de "to" el verbo va en base: Try to read between the lines.'], ['Try to read every literal word.', 'Leer entre líneas no es cazar cada palabra literal: Try to read between the lines.']] }),
        ] },
      { id: 'modulo5-3-teoria-2', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `#### **🛠 Apuntes y acentos**

* **Toma de apuntes:** escribe brevemente **nombres, fechas, cifras** o palabras clave mientras escuchas. ✍️
* **Variedad de acentos:** británico, americano, escocés, neozelandés, etc. Conoce algunas diferencias.

  | Palabra      | Británico        | Americano        |
  | ------------ | ---------------- | ---------------- |
  | *schedule*   | /ˈʃɛdjuːl/        | /ˈskɛdʒuːl/       |

> 🚏 **Estrategia clave:** no intentes escribir **todo**. Captura solo lo **esencial** (datos y palabras de enlace) para no perder el hilo del audio.`,
        miniQuiz: [
          mc('Al tomar apuntes durante un audio avanzado, lo ideal es anotar:', ['cada palabra que escuches', 'nombres, fechas, cifras y palabras clave', 'solo el saludo inicial', 'la opinión que tú tienes'], 1),
          mc('La palabra *schedule* suena distinta en inglés:', ['no, suena igual en todo el mundo', 'sí, varía entre el acento británico y el americano', 'solo cambia su significado', 'solo se escribe distinto'], 1),
          mc('Conocer diferencias de acento te ayuda principalmente a:', ['hablar más rápido', 'reconocer las mismas palabras pese a su pronunciación', 'escribir mejor', 'leer más rápido'], 1),
          mc('¿Por qué NO conviene intentar escribir todo lo que oyes?', ['porque es de mala educación', 'porque pierdes el hilo del audio', 'porque está prohibido', 'porque el audio se detiene'], 1),
          mc('Si escuchas un acento neozelandés muy distinto, lo mejor es...', ['rendirte de inmediato', 'centrarte en las ideas clave y el contexto', 'pedir que cambien de acento', 'traducir letra por letra'], 1),
          mc('¿Cuál sería una buena abreviatura para tomar apuntes rápido?', ['escribir "government" entero', 'usar "govt" en lugar de "government"', 'no escribir consonantes', 'escribir en mayúsculas todo'], 1),
          tap('Corrige la palabra clave de toma de apuntes.', ['Write', 'down', 'the', 'key', 'word', 'and', 'dates.'], 4, 'words'),
          rebuild('🎧 Reconstruye este consejo sobre apuntes.', 'Note down only the essential facts.', ['Note', 'down', 'only', 'the', 'essential', 'facts.', 'every', 'word', 'whole', 'sentence']),
          writing('Escríbelo en inglés (empieza con "Note"): "Anota solo los datos esenciales."', ['Note down only the essential facts.'],
            { hint: 'Imperativo: Note down + only + the essential facts, en plural.',
              reject: [['Note down only the essential fact.', 'Los datos son varios: en plural va facts.'], ['Note down all the essential facts.', 'La idea es justo no anotarlo todo: only the essential facts.'], ['Note down every word.', 'No se escribe todo lo que oyes: Note down only the essential facts.']] }),
        ] },
      { id: 'modulo5-3-errores', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `#### **🚫 Errores Comunes**

* ❌ **Pausar todo** al oír una palabra desconocida. ✅ **Sigue adelante**; el contexto puede aclararla después.
* ❌ Enfocarte **solo en la palabra exacta**. ✅ Entiende las **ideas generales** y las **actitudes**.

> 🚏 Recuerda: el objetivo no es entender cada palabra, sino **captar el mensaje** y la **intención** del hablante. 🎯`,
        miniQuiz: [
          tap('Corrige el consejo: no debemos detenernos por una sola palabra.', ['Stop', 'everything', 'when', 'you', 'hear', 'an', 'unknown', 'word.'], 0, "Don't stop"),
          tap('Corrige: hay que seguir, no quedarse trabado.', ['Keep', 'stopping', 'and', 'the', 'context', 'will', 'help', 'you.'], 1, 'going'),
          tap('Corrige: entendemos el mensaje general.', ['Understand', 'the', 'speed', 'ideas', 'and', 'attitudes.'], 2, 'general'),
          tap('Corrige el verbo de este consejo.', ['Always', 'inferring', 'the', 'speaker\'s', 'intention.'], 1, 'infer'),
          tap('Corrige la palabra clave de este consejo.', ['Focus', 'on', 'the', 'mean', 'not', 'every', 'word.'], 3, 'meaning'),
          tap('Corrige el error sobre los acentos.', ['The', 'word', 'schedule', 'sounds', 'difference', 'in', 'British', 'English.'], 4, 'different'),
          tap('Corrige el verbo de este consejo.', ['Keep', 'go', 'when', 'a', 'word', 'is', 'unknown.'], 1, 'going'),
          tap('Corrige esta frase sobre captar el mensaje.', ['Catch', 'the', 'message', 'and', 'the', 'speaker', 'intention.'], 5, "speaker's"),
          mc('Lee: "Luis: The word schedule sounds different in British English. Rosa: Don\'t stop everything when you hear an unknown word. Keep going and the context will help you. Milagros: Focus on the meaning, not every word. Understand the general ideas and attitudes. Rosa: Always infer the speaker\'s intention. Luis: Keep going when a word is unknown. Milagros: Catch the message and the speaker\'s intention. Rosa: Don\'t stop everything when you hear an unknown word." — ¿A qué situación responde el consejo que Rosa da justo después de hablar Luis?', [
            'A que una palabra le sonó rara por venir en otro acento.',
            'A que Luis no logra anotar los datos de la charla.',
            'A que Luis se adelantó a juzgar la intención del ponente.',
            'A que Milagros insiste en entender cada palabra exacta.'], 0),
          mc('Lee: "Luis: The word schedule sounds different in British English. Rosa: Don\'t stop everything when you hear an unknown word. Keep going and the context will help you. Milagros: Focus on the meaning, not every word. Understand the general ideas and attitudes. Rosa: Always infer the speaker\'s intention. Luis: Keep going when a word is unknown. Milagros: Catch the message and the speaker\'s intention. Rosa: Don\'t stop everything when you hear an unknown word." — ¿Qué muestra la segunda intervención de Luis?', [
            'Que ya hizo suyo el consejo que Rosa acababa de darle.',
            'Que sigue trabado con la palabra que le sonó distinta.',
            'Que prefiere anotar cada palabra antes de seguir oyendo.',
            'Que pone en duda lo que Milagros dice del ponente.'], 0),
          writing('Escríbelo en inglés: "Sigue adelante y el contexto te ayudará."', ['Keep going and the context will help you.'],
            { reject: [['Keep go and the context will help you.', 'Después de "keep" el verbo va en -ing: keep going.'], ['Keep going and the context helps you.', 'Es una promesa a futuro: the context will help you.'], ['Stop and the context will help you.', 'El consejo es justo no detenerte: Keep going and the context will help you.']] }),
        ] },
      { id: 'modulo5-3-resumen', type: 'resumen', markdown: `#### **📋 Resumen**

* **Contexto primero:** anticipa el vocabulario sabiendo de qué va el tema. 🧭
* **Inferir:** lee entre líneas; capta **intenciones** y **actitudes**, no solo palabras. 🤔
* **Apuntes breves:** anota nombres, fechas y cifras; no escribas todo. ✍️
* **Acentos:** la misma palabra puede sonar distinta (*schedule*). 🌍
* **No te trabes:** sigue adelante ante palabras desconocidas. 🚀` },
      { id: 'modulo5-3-cierre', type: 'cierre', markdown: `#### **🌟 Cierre**

¡Genial! 🎙 Ahora sabes interpretar audios complejos de forma más efectiva. Con cada escucha estarás **más preparado** para charlas avanzadas. ¡Sigue **afinando ese oído**! 👂✨

**🏅 Insignia obtenida:** *Oído Avanzado* (¡Nada se te escapa!) 🎧🌟` },
    ],
    quizQuestions: [
      mc('Un profesor con acento americano dice: *"That\'s quite an undertaking; it\'ll be a steep learning curve."* ¿Qué significa *"steep learning curve"*?', ['Un camino empinado real.', 'Aprender rápido, pero con dificultad inicial.', 'Una pendiente de verdad.', 'Una tarea muy fácil.'], 1),
      mc('En una reunión: *"Let\'s table this discussion for now."* ¿Qué quiere decir?', ['Continuar discutiendo.', 'Dejar el tema para después.', 'Terminar la reunión.', 'Poner una mesa nueva.'], 1),
      mc('Si no entiendes una palabra en mitad de un audio, lo mejor es:', ['pausar y buscarla de inmediato', 'seguir adelante y usar el contexto', 'apagar el audio', 'anotarla y abandonar'], 1),
      mc('Palabras de enlace como *however* o *actually* sirven para:', ['rellenar silencios', 'estructurar y conectar el discurso', 'cambiar de idioma', 'indicar el final del audio'], 1),
      mc('*"It\'s getting a bit chilly in here."* es un ejemplo de:', ['una orden directa', 'una inferencia o petición indirecta', 'un error gramatical', 'una pregunta literal'], 1),
      mc('Al tomar apuntes de un audio, deberías anotar sobre todo...', ['cada palabra exacta', 'nombres, fechas, cifras y palabras clave', 'tu opinión personal', 'el saludo inicial'], 1),
      mc('Antes de escuchar, conocer el tema te ayuda a...', ['hablar más rápido', 'anticipar el vocabulario', 'no tomar apuntes', 'ignorar el contexto'], 1),
      mc('*"You\'re going to love this lecture!"* sugiere que el hablante está...', ['aburrido', 'entusiasmado', 'molesto', 'confundido'], 1),
      mc('El objetivo de escuchar en C1 no es entender cada palabra, sino...', ['memorizar el audio', 'captar el mensaje y la intención', 'corregir al hablante', 'escribir todo literal'], 1),
      rebuild('🎧 Ordena el consejo sobre apuntes.', 'Take quick notes while you listen.', ['Take', 'quick', 'notes', 'while', 'you', 'listen.', 'slowly', 'and', 'every']),
      rebuild('🎧 Ordena: enfócate en el significado.', 'Focus on the general meaning.', ['Focus', 'on', 'the', 'general', 'meaning.', 'word', 'exact', 'speed']),
      rebuild('🎧 Reconstruye este consejo de inferencia.', 'Read between the lines and infer the intention.', ['Read', 'between', 'the', 'lines', 'and', 'infer', 'the', 'intention.', 'literal', 'word', 'speed']),
      tap('Corrige la frase sobre los acentos.', ['The', 'word', 'schedule', 'sounds', 'same', 'in', 'every', 'accent.'], 4, 'different'),
      tap('Corrige el verbo de este consejo.', ['Always', 'inferring', 'the', 'real', 'intention.'], 1, 'infer'),
      tap('Corrige la palabra clave de este consejo.', ['Take', 'short', 'note', 'about', 'dates', 'and', 'names.'], 2, 'notes'),
    ],
  };

  const modulo5_4 = {
    id: 'modulo5-4',
    title: 'Microlección 4',
    durationMinutes: 13,
    audioCues: ['Escucha el contenido de la lección.', 'Fíjate en los puntos clave.', 'Ahora vienen tus ejercicios.'],
    contentBlocks: [
      { id: 'modulo5-4-titulo', type: 'titulo', title: '¿Listo para tu presentación final? 📢', subtitle: 'Speaking de nivel académico: presentaciones, debates y entrevistas', markdown: '' },
      { id: 'modulo5-4-mision', type: 'mision', markdown: `## Desarrollar **fluidez y confianza** al hablar en contextos académicos: **presentaciones, debates y entrevistas formales**. 🎤🚌` },
      { id: 'modulo5-4-intro', type: 'intro', markdown: `Soy **Ozzy**, y estoy listo para tu presentación final. 📢 Cuando llegues al **nivel C1**, te pedirán **exponer ideas complejas** y **debatir con especialistas**. Necesitas dominar un **speaking académico** claro y persuasivo. 🎓

Hoy repasaremos frases para **comenzar exposiciones**, **concluir**, **responder preguntas** y **mantener la conversación** en contextos formales. ¡Sube, que arrancamos! 🚌` },
      { id: 'modulo5-4-teoria-1', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**1.** **¿Cómo hablar académico? 🔬**

Piensa en ti mismo como un **profesor presentando un descubrimiento**: explica **paso a paso**, atiende curiosidades (preguntas) y cierra con las **ideas principales**.

* **🎬 Iniciar presentaciones:** *"Good afternoon, everyone. Today I will present…"*, *"Let's begin with…"*. Contextualiza el tema brevemente.
* **🔗 Conectores de discurso:** *"Moreover"*, *"in addition"*, *"therefore"*, *"on the contrary"*, *"in conclusion"* para unir partes de tu discurso.
* **💬 Opinión y argumentos:** *"I firmly believe that…"*, *"It is widely accepted that…"*, *"This evidence suggests…"*.

> 💡 Para **responder preguntas**: *"That's an interesting question. Based on the data, I would say…"*

> 💡 Para **citar datos**: *"According to the World Bank, …"*`,
        miniQuiz: [
          mc('¿Qué frase sirve para INICIAR una presentación académica?', ['"Today I will present…"', '"In conclusion, these findings…"', '"Thank you for the question."', '"That brings me to the end."'], 0),
          mc('¿Cuál de estos es un conector de discurso para unir partes?', ['Hello', 'Moreover', 'Nice', 'Bye'], 1),
          mc('¿Qué frase expresa una opinión firme con tono académico?', ['"I dunno, maybe…"', '"Whatever you say."', '"I firmly believe that…"', '"It\'s kinda true."'], 2),
          mc('Para citar una fuente de datos, ¿qué frase usarías?', ['"According to the World Bank, …"', '"My friend told me…"', '"I think so."', '"Someone somewhere said…"'], 0),
          mc('Para RESPONDER una pregunta apoyándote en datos dices:', ['"I have no idea."', '"That\'s an interesting question. Based on the data, I would say…"', '"Let\'s begin with…"', '"Goodbye, everyone."'], 1),
          mc('"On the contrary" es un conector para...', ['añadir información', 'mostrar contraste', 'concluir', 'saludar'], 1),
          rebuild('🎤 Reconstruye el inicio de una presentación.', 'Good afternoon, everyone. Today I will present.', ['Good', 'afternoon,', 'everyone.', 'Today', 'I', 'will', 'present.', 'conclusion', 'question', 'goodbye']),
          rebuild('🎤 Reconstruye esta opinión académica.', 'This evidence suggests a clear trend.', ['This', 'evidence', 'suggests', 'a', 'clear', 'trend.', 'maybe', 'dunno', 'whatever', 'thing']),
          mc('Lee: "Rosa: Good afternoon, everyone. Today I will present. Let\'s begin with the data. According to the World Bank, this evidence suggests a clear trend. Milagros: Moreover, it is widely accepted that the data is clear. Luis: On the contrary, I firmly believe that the trend is not clear. Rosa: That\'s an interesting question. Based on the data, I would say the trend is clear. In conclusion, these findings indicate a clear pattern." — ¿Quién no está convencido de que la tendencia sea clara?', [
            'Luis, que sostiene justo lo contrario.',
            'Milagros, que apela a lo que todos aceptan.',
            'Rosa, que abre y cierra la exposición.',
            'El Banco Mundial, que aporta la evidencia.'], 0),
          mc('Lee: "Rosa: Good afternoon, everyone. Today I will present. Let\'s begin with the data. According to the World Bank, this evidence suggests a clear trend. Milagros: Moreover, it is widely accepted that the data is clear. Luis: On the contrary, I firmly believe that the trend is not clear. Rosa: That\'s an interesting question. Based on the data, I would say the trend is clear. In conclusion, these findings indicate a clear pattern." — ¿Cuál de estas ideas se presenta como algo que ya se da por sentado, y no como convicción de quien la dice?', [
            'Que los datos son claros, según todos.',
            'Que la tendencia no es clara, según Luis.',
            'Que la tendencia es clara, según los datos.',
            'Que estos hallazgos indican un patrón claro.'], 0),
          writing('Escríbelo en inglés: "Buenas tardes a todos. Hoy presentaré."', ['Good afternoon, everyone. Today I will present.'],
            { hint: 'Fórmula fija de apertura: saludo + "everyone", y después "Today I will" + verbo base.',
              reject: [['Good afternoon, everyone. Today I present.', 'La fórmula de apertura anuncia lo que viene, así que lleva "will": Today I will present.'], ['Good afternoon, everyone. Today I will to present.', 'Después de "will" el verbo va sin "to": Today I will present.'], ['Good afternoon, everyone. Today I will presentation.', 'Después de "will" va el verbo "present", no el sustantivo "presentation".']] }),
        ] },
      { id: 'modulo5-4-teoria-2', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**2.** **Frases útiles según el propósito 🎯**

Como un profesor que explica un hallazgo 🔬, ten lista la frase exacta para cada momento:

  | Propósito              | Ejemplo en inglés                                              |
  | ---------------------- | ------------------------------------------------------------- |
  | Saludo e introducción  | Good morning. Let me start by giving some background…         |
  | Aceptar pregunta       | Thank you for the question. As I mentioned earlier…           |
  | Acuerdo parcial        | I agree with X to some extent, however…                       |
  | Terminar discurso      | In conclusion, these findings indicate that…                  |

* **👋 Saludo e introducción:** *"Good morning. Let me start by giving some background on the topic…"*
* **🙋 Aceptar pregunta:** *"Thank you for the question. As I mentioned earlier…"*
* **⚖️ Acuerdo parcial:** *"I agree with X to some extent, however…"*

> 💡 Para **terminar** con elegancia: *"In conclusion, these findings indicate that…"*`,
        miniQuiz: [
          mc('¿Qué frase usarías para ACEPTAR una pregunta del público?', ['"Thank you for the question. As I mentioned earlier…"', '"In conclusion…"', '"Good morning, everyone."', '"That\'s the end of my talk."'], 0),
          mc('¿Cómo expresas un ACUERDO PARCIAL?', ['"I totally disagree with everything."', '"You are completely right."', '"I agree with X to some extent, however…"', '"I have no opinion at all."'], 2),
          mc('¿Qué frase sirve para TERMINAR tu discurso?', ['"Let me start by…"', '"Thank you for the question."', '"Good morning, everyone."', '"In conclusion, these findings indicate that…"'], 3),
          mc('En tu introducción quieres dar contexto. ¿Qué dices?', ['"Let me start by giving some background…"', '"Goodbye and good luck."', '"I have no idea about this."', '"In conclusion, to sum up…"'], 0),
          mc('"As I mentioned earlier…" sirve para...', ['saludar al público', 'retomar un punto que ya dijiste al responder', 'cerrar el discurso', 'citar una fuente externa'], 1),
          mc('¿Cuál es la frase más adecuada para un acuerdo PARCIAL (no total)?', ['"I completely agree with everything you said."', '"I agree to some extent, however, there are exceptions."', '"You are absolutely wrong."', '"I don\'t care about that."'], 1),
          rebuild('🎤 Reconstruye la frase para dar contexto.', 'Let me start by giving some background.', ['Let', 'me', 'start', 'by', 'giving', 'some', 'background.', 'conclusion', 'question', 'goodbye', 'thank']),
          rebuild('🎤 Reconstruye la frase para concluir.', 'In conclusion, these findings indicate a clear pattern.', ['In', 'conclusion,', 'these', 'findings', 'indicate', 'a', 'clear', 'pattern.', 'start', 'question', 'morning', 'hello']),
          mc('Lee: "Milagros: Good morning. Let me start by giving some background on the topic. The pattern is clear in Lima. Rosa: I agree with Milagros to some extent, however, there are exceptions. Milagros: Thank you for the question, Rosa. As I mentioned earlier, the pattern is clear. Luis: I agree with Rosa to some extent, however, the background is clear. Milagros: In conclusion, these findings indicate a clear pattern. That\'s the end of my talk." — ¿Quién le concede algo a Rosa sin renunciar a su propio punto?', [
            'Luis, que igual sostiene que el contexto está claro.',
            'Milagros, que acepta las excepciones que Rosa señala.',
            'Luis, que le da la razón a Rosa sin reservas.',
            'Milagros, que le cede a Rosa el cierre de la charla.'], 0),
          mc('Lee: "Milagros: Good morning. Let me start by giving some background on the topic. The pattern is clear in Lima. Rosa: I agree with Milagros to some extent, however, there are exceptions. Milagros: Thank you for the question, Rosa. As I mentioned earlier, the pattern is clear. Luis: I agree with Rosa to some extent, however, the background is clear. Milagros: In conclusion, these findings indicate a clear pattern. That\'s the end of my talk." — ¿Cuál de estas dos lecturas sostiene el texto sobre Rosa y Luis?', [
            'Cada uno concede una parte y objeta otra.',
            'Cada uno acepta sin reservas lo que oyó.',
            'Cada uno rechaza de plano lo que oyó.',
            'Cada uno pide que le repitan el dato.'], 0),
          writing('Escríbelo en inglés: "En conclusión, estos hallazgos indican un patrón claro."', ['In conclusion, these findings indicate a clear pattern.'],
            { hint: 'Fórmula fija de cierre: "In conclusion," + sujeto plural + verbo sin -s.',
              reject: [['In the conclusion, these findings indicate a clear pattern.', 'La fórmula fija de cierre no lleva artículo: In conclusion, …'], ['In conclusion, these findings indicates a clear pattern.', 'El sujeto "findings" es plural, así que el verbo no lleva -s: indicate.'], ['In conclude, these findings indicate a clear pattern.', 'Va el sustantivo "conclusion", no el verbo "conclude": In conclusion, …']] }),
        ] },
      { id: 'modulo5-4-errores', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `#### **🚫 Errores Comunes**

* 😬 **Decir "uh" y "um" constantemente:** mejor haz **pequeñas pausas silenciosas** o usa *"Let me see…"*.
* 🙊 **Monopolizar o cortar abruptamente:** escucha al interlocutor y responde con cortesía: *"That's a great point."*
* 🧩 **Hablar sin estructurar:** planea cada respuesta: **introduce, desarrolla y concluye**.

🤔 **Mini reto:** en una entrevista académica, evita *"Oh, I didn't know that."* y prefiere *"I'm sorry, I wasn't aware of that study."* — ¡es más formal y respetuoso!

¡Vamos a cazar esos errores en frases reales! 🕵️‍♂️`,
        miniQuiz: [
          tap('Una muletilla sobra en esta frase. Tócala:', ['So,', 'um,', 'today', 'I', 'will', 'present', 'my', 'research.'], 1, '(quítalo)'),
          tap('Corrige el saludo para que suene académico:', ['Good', 'aftornoon,', 'everyone.'], 1, 'afternoon,'),
          tap('Corrige para sonar cortés ante una buena idea:', ["That's", 'a', 'great', 'pointy.'], 3, 'point.'),
          tap('Hay un error en esta frase para terminar. Tócalo:', ['In', 'conclude,', 'these', 'findings', 'are', 'clear.'], 1, 'conclusion,'),
          tap('Una muletilla sobra. Tócala:', ['Thank', 'you', 'uh', 'for', 'the', 'question.'], 2, '(quítalo)'),
          tap('Corrige la preposición de esta cita.', ['According', 'at', 'the', 'World', 'Bank,', 'poverty', 'fell.'], 1, 'to'),
          tap('Corrige el verbo de esta frase para responder.', ['Based', 'on', 'the', 'data,', 'I', 'would', 'says', 'yes.'], 6, 'say'),
          tap('Corrige la respuesta formal y respetuosa.', ['I', 'was', 'not', 'awere', 'of', 'that', 'study.'], 3, 'aware'),
          mc('Lee: "Rosa: Good afternoon, everyone. So, today I will present my research in Lima. According to the World Bank, poverty fell in Trujillo last year. Luis: Oh, I didn\'t know that. Milagros: I\'m sorry, I wasn\'t aware of that study. Rosa: That\'s a great point, Milagros. Let me see. Based on the data, I would say yes. In conclusion, these findings are clear." — ¿Quién admite el mismo vacío que Luis, pero de forma más formal?', [
            'Milagros, que se disculpa por no conocer el estudio.',
            'Rosa, que se disculpa por no tener datos de Trujillo.',
            'Milagros, que corrige el dato del Banco Mundial.',
            'Rosa, que agradece el aporte y cambia de tema.'], 0),
          mc('Lee: "Rosa: Good afternoon, everyone. So, today I will present my research in Lima. According to the World Bank, poverty fell in Trujillo last year. Luis: Oh, I didn\'t know that. Milagros: I\'m sorry, I wasn\'t aware of that study. Rosa: That\'s a great point, Milagros. Let me see. Based on the data, I would say yes. In conclusion, these findings are clear." — ¿Cuál de estas dos lecturas sostiene el texto sobre el "sí" de Rosa?', [
            'Afirma que sí, pero anclándolo a los datos.',
            'Afirma que sí por convicción propia, sin datos.',
            'Deja la pregunta sin responder por falta de datos.',
            'Corrige a Milagros y descarta el estudio citado.'], 0),
          writing('Escríbelo en inglés: "Según el Banco Mundial, la pobreza cayó."', ['According to the World Bank, poverty fell.'],
            { reject: [['According at the World Bank, poverty fell.', 'La fórmula para citar una fuente lleva "to": According to the World Bank, …'], ['According with the World Bank, poverty fell.', 'No es "with": la fórmula fija es "according to".'], ['According to the World Bank, poverty fall.', 'Falta el pasado: "cayó" es fell, no fall.']] }),
        ] },
      { id: 'modulo5-4-resumen', type: 'resumen', markdown: `## **🎯 Resumen: el profesor con un descubrimiento 🔬🎓**

Habla como un **profesor que presenta un hallazgo**: claro, estructurado y persuasivo.

* **🎬 Abre con fuerza:** *"Good afternoon, everyone. Today I will present…"*
* **🔗 Une tus ideas:** usa conectores *moreover*, *therefore*, *on the contrary*.
* **🙋 Atiende preguntas con calma:** *"That's an interesting question. Based on the data…"*
* **🎯 Cierra con las ideas clave:** *"In conclusion, these findings indicate that…"*

> 🧠 **Mnemotecnia – Profesor C1:** *Abre, conecta, responde y concluye.* Pausas silenciosas en vez de "uh/um". 🚌💨` },
      { id: 'modulo5-4-cierre', type: 'cierre', markdown: `#### **🌟 Cierre**

¡Bravo! 🎓 Ahora sabes comunicarte en inglés con un **tono profesional y académico**. Estás listo para **cualquier presentación o discusión de alto nivel**. ¡Sigue practicando ese **speaking brillante**! ✨

**🏅 Insignia obtenida:** 🗣️ *Orador C1* — ¡Tu voz deja huella! 🏅` },
    ],
    quizQuestions: [
      mc('¿Qué frase sirve para INICIAR una presentación académica?', ['"Today I will present…"', '"In conclusion…"', '"Thank you for the question."', '"That concludes my talk."'], 0),
      mc('Para responder una pregunta apoyándote en datos, ¿qué dices?', ['"Based on the data, I would say…"', '"I have no idea."', '"Let\'s begin with…"', '"My friend told me so."'], 0),
      mc('En una entrevista académica, ¿qué respuesta es más formal y respetuosa?', ['"Oh, I didn\'t know that."', '"Whatever, it doesn\'t matter."', '"I\'m sorry, I wasn\'t aware of that study."', '"That\'s not my problem."'], 2),
      mc('¿Qué debes hacer en lugar de decir "uh" y "um" constantemente?', ['hablar más rápido', 'hacer pequeñas pausas silenciosas o usar "Let me see…"', 'repetir la pregunta varias veces', 'cambiar de tema'], 1),
      mc('¿Cuál de estos es un conector de discurso para concluir?', ['In conclusion', 'Hello there', 'By the way', 'Moreover'], 0),
      mc('Planear introduce-desarrolla-concluye sirve para...', ['hablar sin parar', 'estructurar tu respuesta con orden', 'evitar responder', 'memorizar todo'], 1),
      mc('Para mostrar un acuerdo PARCIAL dices...', ['"I totally agree."', '"I agree to some extent, however…"', '"You are completely wrong."', '"I don\'t care."'], 1),
      mc('Para citar una fuente de datos usas...', ['"According to the World Bank,…"', '"Someone said…"', '"I guess…"', '"My cousin thinks…"'], 0),
      mc('"On the contrary" sirve para...', ['añadir info', 'mostrar contraste', 'saludar', 'concluir'], 1),
      rebuild('🎤 Reconstruye el inicio de la presentación:', 'Today I will present my research.', ['Today', 'I', 'will', 'present', 'my', 'research.', 'conclusion', 'question', 'however']),
      rebuild('🎤 Reconstruye la frase para terminar:', 'In conclusion, these findings indicate that.', ['In', 'conclusion,', 'these', 'findings', 'indicate', 'that.', 'present', 'moreover', 'data']),
      rebuild('🎤 Reconstruye la frase para aceptar una pregunta.', 'Thank you for the question.', ['Thank', 'you', 'for', 'the', 'question.', 'goodbye', 'conclusion', 'morning']),
      rebuild('🎤 Reconstruye esta opinión firme.', 'I firmly believe that this is true.', ['I', 'firmly', 'believe', 'that', 'this', 'is', 'true.', 'maybe', 'dunno', 'whatever']),
      tap('Una muletilla sobra. Tócala:', ['Thank', 'you', 'um', 'for', 'the', 'question.'], 2, '(quítalo)'),
      tap('Corrige la preposición para que la frase suene académica:', ['According', 'at', 'the', 'World', 'Bank,', 'poverty', 'fell.'], 1, 'to'),
    ],
  };

  const modulo5_5 = {
    id: 'modulo5-5',
    title: 'Microlección 5',
    durationMinutes: 13,
    audioCues: ['Escucha el contenido de la lección.', 'Fíjate en los puntos clave.', 'Ahora vienen tus ejercicios.'],
    contentBlocks: [
      { id: 'modulo5-5-titulo', type: 'titulo', title: '¿Cómo combinar leer, escuchar y responder? 🎧📝', subtitle: 'Estrategias TOEFL iBT: tareas integradas', markdown: '' },
      { id: 'modulo5-5-mision', type: 'mision', markdown: `Conocer las **técnicas clave** para el **TOEFL iBT**: las **tareas integradas** que combinan **listening**, **speaking** y **writing** con **toma de apuntes**. 🎓

Al terminar sabrás **coordinar** lo que lees y escuchas para responder con orden y precisión. 🚀` },
      { id: 'modulo5-5-intro', type: 'intro', markdown: `¡Hola, soy **Ozzy**! ¡Seguimos avanzando! 🎓

En el **TOEFL iBT** te pedirán **leer**, **escuchar** y luego **hablar** o **escribir** sobre lo escuchado. Necesitas **coordinar** las dos fuentes sin perderte. 🧭

Hoy te mostraré **estrategias** para manejar estas **tareas integradas** de forma **eficiente**. ¡Súbete, que arrancamos! 🚌💨` },
      { id: 'modulo5-5-teoria-1', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**1.** **🛠 Escuchar, leer y tomar apuntes** 📝

En las tareas integradas, el **orden** lo es todo:

* **Lee el texto primero (rápido):** subraya las **ideas principales**.
* **Luego escucha el audio:** toma **notas** sobre los **puntos clave** (autoridades, fechas, **contrastes**).
* **Toma buenas notas:** dibuja **flechas** ➡️, usa **abreviaturas**: p.ej. *"govt, econ, -"* para resumir. **No intentes escribir todo.**

  | Paso | Qué haces |
  | --- | --- |
  | Leer primero | Subrayas las **ideas principales** del texto |
  | Escuchar después | Anotas **puntos clave** (datos, contrastes) |
  | Apuntes | **Flechas y abreviaturas**, no frases completas |

> 🚏 **Pista clave:** la **lectura** te da el contexto; el **audio** suele **contrastar** o **matizar** lo leído. ¡Captura ambos!`,
        miniQuiz: [
          mc('En una tarea integrada, ¿qué haces PRIMERO?', ['Escuchar el audio y luego nada más', 'Leer el texto rápido y subrayar las ideas principales', 'Escribir la respuesta sin leer ni escuchar', 'Hablar antes de leer o escuchar'], 1),
          mc('Al tomar apuntes del audio, lo mejor es:', ['Escribir cada palabra que oyes', 'Usar abreviaturas y flechas para los puntos clave', 'No anotar nada y confiar en la memoria', 'Copiar el texto leído'], 1),
          mc('¿Qué tipo de información conviene anotar del audio?', ['Solo saludos del orador', 'Autoridades, fechas y contrastes', 'El color de la sala', 'El nombre del examinador'], 1),
          mc('"govt, econ, -" es un ejemplo de:', ['Una frase completa', 'Abreviaturas para resumir', 'Una conclusión final', 'Una cita textual'], 1),
          mc('Según la pista clave, el audio suele... respecto al texto leído.', ['repetir exactamente lo mismo', 'contrastar o matizar lo leído', 'ignorar el tema por completo', 'cambiar de idioma'], 1),
          mc('Después de leer el texto rápido, ¿qué haces?', ['Escribir la respuesta ya', 'Escuchar el audio y anotar puntos clave', 'Volver a leer cinco veces', 'Borrar tus apuntes'], 1),
          rebuild('Reconstruye este consejo de apuntes.', 'Use arrows and abbreviations, not full sentences.', ['Use', 'arrows', 'and', 'abbreviations,', 'not', 'full', 'sentences.', 'every', 'word', 'copy', 'whole']),
          rebuild('Reconstruye esta frase sobre el orden.', 'Read the text first and then listen.', ['Read', 'the', 'text', 'first', 'and', 'then', 'listen.', 'write', 'speak', 'last', 'before']),
          writing('Escríbelo en inglés: "Lee el texto primero y luego escucha."', ['Read the text first and then listen.'],
            { reject: [['Read first the text and then listen.', 'En inglés "first" va después del objeto: Read the text first and then listen.'], ['You read the text first and then listen.', 'El imperativo en inglés no lleva sujeto: Read the text first and then listen.']] }),
        ] },
      { id: 'modulo5-5-teoria-2', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**2.** **🛠 Estructurar tu respuesta (speaking y writing)** 🗣️✍️

Una respuesta integrada bien armada **conecta** lectura y audio:

* **Speaking (2 minutos):** resumen organizado → **introducción** (*"In the lecture / professor's view…"*), **cuerpo** (puntos 1 y 2) y **conclusión corta**. Practica una **pronunciación clara**; sé **breve y conciso**.
* **Writing (20 min):** ensayo → introduce el **tema**, luego párrafos **comparando** lectura y audio, y **concluye**. Usa frases como *"On the one hand… On the other hand…"*.

**Frase modelo para integrar:** *"The reading states X; however, the lecture challenges this by saying Y."*

  | Tarea | Tiempo | Estructura |
  | --- | --- | --- |
  | Speaking | 2 min | Intro + cuerpo (1, 2) + conclusión corta |
  | Writing | 20 min | Intro + párrafos comparativos + conclusión |

> 💡 **Mnemotecnia:** piensa en un **puente** 🌉 entre dos orillas: el **texto** y la **charla**. Tu respuesta es el puente que las **conecta**.`,
        miniQuiz: [
          mc('En el speaking integrado, ¿cuánto tiempo sueles tener?', ['10 minutos', '2 minutos', '20 minutos', '1 minuto'], 1),
          mc('¿Qué frase es útil para integrar lectura y audio?', ['"In my opinion, mushrooms are healthy."', '"The reading states X; however, the lecture challenges this by saying Y."', '"I like English a lot."', '"Once upon a time…"'], 1),
          mc('Para contrastar dos ideas en el writing, usas:', ['"On the one hand… On the other hand…"', '"Once upon a time…"', '"Thank you very much."', '"See you soon!"'], 0),
          mc('En el speaking, tu pronunciación debe ser:', ['Rápida y confusa', 'Clara, breve y concisa', 'Muy larga y detallada', 'En voz muy baja'], 1),
          mc('El writing integrado dura aproximadamente:', ['2 minutos', '5 minutos', '20 minutos', '1 hora'], 2),
          mc('Según la mnemotecnia, tu respuesta es un "puente" entre:', ['dos exámenes distintos', 'el texto leído y la charla escuchada', 'el inglés y el español', 'el examinador y tú'], 1),
          rebuild('Reconstruye la frase modelo para integrar fuentes.', 'The reading states X; however, the lecture challenges this.', ['The', 'reading', 'states', 'X;', 'however,', 'the', 'lecture', 'challenges', 'this.', 'agrees', 'because', 'although']),
          rebuild('Reconstruye esta frase de contraste.', 'On the one hand, it helps; on the other, it distracts.', ['On', 'the', 'one', 'hand,', 'it', 'helps;', 'on', 'the', 'other,', 'it', 'distracts.', 'foot,', 'side,', 'because']),
          writing('Escríbelo en inglés (sujeto "it"): "Por un lado ayuda; por el otro, distrae."', ['On the one hand, it helps; on the other, it distracts.', 'On one hand, it helps; on the other, it distracts.', 'On the one hand, it helps; on the other hand, it distracts.'],
            { hint: 'La fórmula del contraste es "On the one hand…; on the other…", con "hand".',
              reject: [['On the one foot, it helps; on the other, it distracts.', 'La expresión lleva "hand", no "foot": On the one hand, it helps; on the other, it distracts.'], ['In the one hand, it helps; on the other, it distracts.', 'La preposición es "on": On the one hand, it helps; on the other, it distracts.']] }),
        ] },
      { id: 'modulo5-5-errores', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `#### **🚫 Errores Comunes**

Estos tropiezos te restan puntos en las tareas integradas. ¡Cázalos! 🎯

* ❌ **Olvidar el texto al escuchar.** → ✅ **Integra ambas fuentes:** menciona puntos tanto del **texto** como de la **charla**.
* ❌ **Tomar apuntes desordenados.** → ✅ Usa **listas o columnas** para separar **texto vs. audio**.

> 🚏 **Recuerda:** una respuesta que solo usa **una fuente** queda incompleta. El examinador quiere ver cómo **conectas** lectura y audio. 🌉

En los ejercicios de abajo, **toca la palabra incorrecta** y arréglala 👇.`,
        miniQuiz: [
          tap('Toca la palabra incorrecta:', ['The', 'reading', 'state', 'that', 'climate', 'is', 'a', 'concern.'], 2, 'states'),
          tap('Toca la palabra incorrecta:', ['Use', 'list', 'or', 'columns', 'for', 'your', 'notes.'], 1, 'lists'),
          tap('Toca la palabra incorrecta:', ['However,', 'the', 'lecture', 'challenge', 'this', 'idea.'], 3, 'challenges'),
          tap('Toca la palabra incorrecta:', ['On', 'the', 'one', 'foot,', 'the', 'author', 'agrees.'], 3, 'hand,'),
          tap('Toca la palabra incorrecta:', ['Always', 'integrate', 'both', 'source', 'in', 'your', 'answer.'], 3, 'sources'),
          tap('Toca la palabra incorrecta:', ['The', 'professor', 'mention', 'two', 'key', 'points.'], 2, 'mentions'),
          tap('Toca la palabra incorrecta:', ['Take', 'note', 'in', 'separate', 'columns', 'for', 'each', 'source.'], 1, 'notes'),
          tap('Toca la palabra incorrecta:', ['On', 'the', 'other', 'foot,', 'the', 'lecture', 'disagrees.'], 3, 'hand,'),
          mc('Dos estudiantes entregan su respuesta integrada sobre el mismo texto y la misma charla: "Milagros: The reading states that climate is a concern. However, the lecture challenges this idea. The professor mentions two key points. On the one hand, the author agrees. On the other hand, the lecture disagrees. Rosa: The professor mentions two key points. However, the lecture challenges this idea. On the other hand, the lecture disagrees." — ¿A qué se refiere "this idea" en la respuesta de Milagros?', [
            'A lo que sostiene el texto leído sobre el clima.',
            'A los dos puntos clave que expone el profesor.',
            'A la postura que defiende la charla del profesor.',
            'A lo que Rosa escribió en su propia respuesta.'], 0),
          mc('Dos estudiantes entregan su respuesta integrada sobre el mismo texto y la misma charla: "Milagros: The reading states that climate is a concern. However, the lecture challenges this idea. The professor mentions two key points. On the one hand, the author agrees. On the other hand, the lecture disagrees. Rosa: The professor mentions two key points. However, the lecture challenges this idea. On the other hand, the lecture disagrees." — ¿Cuál de las dos respuestas deja fuera una de las dos fuentes?', [
            'La de Rosa: solo habla de la charla del profesor.',
            'La de Milagros: solo habla del texto y del autor.',
            'Ninguna: las dos nombran el texto y la charla.',
            'Las dos: ninguna llega a nombrar al profesor.'], 0),
          writing('Escríbelo en inglés (usa "lecture"): "Sin embargo, la charla cuestiona esta idea."', ['However, the lecture challenges this idea.'],
            { reject: [['However, the lecture challenge this idea.', 'Con "the lecture" el verbo lleva -s: challenges.'], ['However, the lectures challenges this idea.', 'Es una sola charla: the lecture challenges, en singular.']] }),
        ] },
      { id: 'modulo5-5-resumen', type: 'resumen', markdown: `## **🎯 Resumen práctico que debes recordar**

Para las **tareas integradas** del **TOEFL iBT** 🎓:

* 📖 **Lee primero**, subraya ideas principales; luego **escucha** y anota puntos clave (autoridades, fechas, contrastes).
* 📝 **Buenos apuntes:** flechas y abreviaturas (*"govt, econ, -"*). **No escribas todo.**
* 🗣️ **Speaking (2 min):** intro + cuerpo (1, 2) + conclusión corta, con pronunciación **clara**.
* ✍️ **Writing (20 min):** intro + párrafos comparativos + conclusión. Usa *"On the one hand… On the other hand…"*.
* 🌉 **Integra ambas fuentes:** *"The reading states X; however, the lecture challenges this by saying Y."*

  | Habilidad | Clave |
  | --- | --- |
  | Listening + Reading | Captar y contrastar las dos fuentes |
  | Apuntes | Abreviaturas, listas y columnas |
  | Speaking / Writing | Estructura clara y conexión de ideas |` },
      { id: 'modulo5-5-cierre', type: 'cierre', markdown: `#### **🌟 Cierre**

¡Objetivo TOEFL desbloqueado! 🚀 Con estas **estrategias integradas**, manejarás mejor las **tareas del examen**: leer, escuchar, hablar y escribir, todo **conectado**. 🌉

Sigue practicando con **textos y audios reales** 📚🎧 y verás cómo tu coordinación mejora parada tras parada.💨

**🏅 Insignia obtenida:** *Estratega iBT* (¡Multi-habilidades en acción!) 📚🎧📝` },
    ],
    quizQuestions: [
      mc('Se le pide al estudiante escribir una respuesta integrando lectura y audio. ¿Qué frase es útil?', ['"In my opinion, mushrooms are healthy."', '"According to the professor, climate change is a concern that should be addressed."', '"I really enjoy this nice topic."', '"Once upon a time there was a lecture."'], 1),
      mc('En las tareas integradas, ¿qué haces PRIMERO?', ['Escribes la respuesta de inmediato', 'Lees el texto rápido y subrayas las ideas principales', 'Ignoras el texto y solo escuchas', 'Hablas antes de leer'], 1),
      mc('La mejor forma de tomar apuntes del audio es:', ['Copiar cada palabra textualmente', 'Usar abreviaturas y flechas para los puntos clave', 'No tomar ninguna nota', 'Escribir solo el saludo'], 1),
      mc('Para contrastar lectura y audio en el writing, usas:', ['"On the one hand… On the other hand…"', '"Once upon a time…"', '"See you later!"', '"Thanks a lot!"'], 0),
      mc('El speaking integrado suele durar:', ['2 minutos', '20 minutos', '1 hora', '10 segundos'], 0),
      mc('Una respuesta que solo usa UNA fuente (texto o audio) queda...', ['perfecta', 'incompleta para el examinador', 'más corta pero igual de buena', 'mejor valorada'], 1),
      mc('¿Qué tipo de datos conviene anotar del audio?', ['el color de la sala', 'autoridades, fechas y contrastes', 'solo el saludo', 'tu opinión personal'], 1),
      mc('El writing integrado suele durar:', ['2 minutos', '20 minutos', '1 hora', '30 segundos'], 1),
      mc('Para mantener orden en los apuntes, conviene...', ['mezclar texto y audio en una línea', 'usar listas o columnas separadas para texto y audio', 'no usar estructura', 'borrar lo del texto'], 1),
      rebuild('Ordena la frase modelo para integrar fuentes:', 'The reading states X; however, the lecture challenges this by saying Y.', ['The', 'reading', 'states', 'X;', 'however,', 'the', 'lecture', 'challenges', 'this', 'by', 'saying', 'Y.', 'although', 'agrees', 'because']),
      rebuild('Ordena esta frase de contraste:', 'On the one hand, the author agrees with the idea.', ['On', 'the', 'one', 'hand,', 'the', 'author', 'agrees', 'with', 'the', 'idea.', 'foot,', 'disagree', 'however']),
      rebuild('Ordena este consejo de apuntes.', 'Use abbreviations and arrows for the key points.', ['Use', 'abbreviations', 'and', 'arrows', 'for', 'the', 'key', 'points.', 'every', 'word', 'whole']),
      tap('Toca la palabra incorrecta:', ['The', 'reading', 'state', 'that', 'climate', 'is', 'a', 'concern.'], 2, 'states'),
      tap('Toca la palabra incorrecta:', ['However,', 'the', 'lecture', 'challenge', 'this', 'idea.'], 3, 'challenges'),
      tap('Toca la palabra incorrecta:', ['Always', 'integrate', 'both', 'source', 'in', 'your', 'answer.'], 3, 'sources'),
    ],
  };

  const modulo5_6 = {
    id: 'modulo5-6',
    title: 'Microlección 6',
    durationMinutes: 13,
    audioCues: ['Escucha el contenido de la lección.', 'Fíjate en los puntos clave.', 'Ahora vienen tus ejercicios.'],
    contentBlocks: [
      { id: 'modulo5-6-titulo', type: 'titulo', title: '¿Carta, ensayo y entrevista? ¡Ozzy te prepara! 🎓', subtitle: 'Estrategias IELTS General: Writing y Speaking', markdown: '' },
      { id: 'modulo5-6-mision', type: 'mision', markdown: `Prepararte para el **IELTS General** 🌍: dominar las tareas de **escritura** (una **carta** ✉️ y un **ensayo** 📝) y la prueba **oral** (*speaking test* 🎤) con técnicas eficaces. Al terminar, enfrentarás cada parte del examen con un **plan claro** y mucha **confianza**. 💪` },
      { id: 'modulo5-6-intro', type: 'intro', markdown: `¡Hola, soy **Ozzy** 🚌! Hoy te cuento un secreto: el **IELTS General** se enfoca en la **vida real**. 😊

En la **escritura**, deberás redactar una **carta** y un **ensayo**. En *speaking*, tendrás una charla en **tres partes** con un examinador. 🎤

Vamos a repasar los **consejos clave** para cada parte, paso a paso. ¡Súbete, que arrancamos rumbo a tu certificación!` },
      { id: 'modulo5-6-teoria-1', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**1.** **Writing: Carta (Task 1) y Ensayo (Task 2)** ✍️

En la sección de **escritura** tienes **dos tareas**. ¡Cada una con su estrategia!

**Writing Task 1 — La carta** (formal o informal):

* **Lee bien el prompt** y cubre **todos los puntos** solicitados.
* Saludo: usa **"Dear Sir/Madam"** para formal, **"Hi [Name]"** para informal.
* Estructura: **saludo → propósito → cuerpo → cierre**.
* Cierre: **"Yours sincerely"** o **"Best regards"** (formal).

**Writing Task 2 — El ensayo:**

* **Planifica** antes de escribir. 🗺️
* **Introducción clara**: parafrasea la pregunta con tus palabras.
* Desarrolla **2-3 ideas** con **ejemplos**.
* **Concluye** reafirmando tu opinión.

  | Parte         | Inglés clave                  |
  | ------------- | ----------------------------- |
  | Saludo formal | Dear Sir/Madam,               |
  | Cierre formal | Yours sincerely / Best regards |

> 🚏 **Pista clave:** una carta sin **cierre** y un ensayo sin **conclusión** pierden puntos. ¡Siempre **cierra** tus ideas!`,
        miniQuiz: [
          mc('Para una carta FORMAL, ¿qué saludo usas?', ['Hi John,', 'Dear Sir/Madam,', 'Hey there!', 'What\'s up?'], 1),
          mc('En el ensayo (Task 2), la introducción debe:', ['copiar la pregunta tal cual', 'parafrasear la pregunta con tus palabras', 'dar ya la conclusión', 'omitir el tema'], 1),
          mc('¿Cuántas ideas conviene desarrollar en el ensayo?', ['una sola idea', '2-3 ideas con ejemplos', 'ninguna, solo opinión', 'diez ideas sin ejemplos'], 1),
          mc('Un cierre formal correcto para la carta es:', ['Bye bye.', 'Best regards,', 'See you!', 'Later!'], 1),
          mc('¿Qué estructura sigue una carta del Task 1?', ['solo el cuerpo', 'saludo → propósito → cuerpo → cierre', 'solo el cierre', 'conclusión → introducción'], 1),
          mc('La conclusión de tu ensayo (Task 2) debe...', ['introducir una idea nueva', 'reafirmar tu opinión', 'copiar la introducción', 'incluir el saludo'], 1),
          rebuild('Reconstruye el cierre formal de una carta.', 'I look forward to your reply.', ['I', 'look', 'forward', 'to', 'your', 'reply.', 'bye', 'see', 'later', 'soon']),
          rebuild('Reconstruye esta frase sobre el ensayo.', 'Develop two or three ideas with examples.', ['Develop', 'two', 'or', 'three', 'ideas', 'with', 'examples.', 'one', 'opinion', 'only', 'none']),
          mc('Milagros revisa tres mensajes del mismo día: "1) Dear Sir/Madam, I look forward to your reply on Monday. Yours sincerely, Milagros. 2) Hi Rosa, I look forward to your reply too. Best regards, Milagros. 3) Hi Milagros, Develop two or three ideas with examples. Best regards, Luis." — ¿Cuál de los tres va dirigido a alguien a quien no conoce?', [
            'El primero, que no nombra a nadie al saludar.',
            'El segundo, el que va dirigido a Rosa.',
            'El tercero, el que Luis le escribe a ella.',
            'Ninguno: los tres saludan a alguien por su nombre.'], 0),
          mc('Milagros revisa tres mensajes del mismo día: "1) Dear Sir/Madam, I look forward to your reply on Monday. Yours sincerely, Milagros. 2) Hi Rosa, I look forward to your reply too. Best regards, Milagros. 3) Hi Milagros, Develop two or three ideas with examples. Best regards, Luis." — ¿Qué pide de verdad cada mensaje?', [
            'Milagros insinúa que espera respuesta; Luis encarga una tarea.',
            'Milagros encarga una tarea; Luis insinúa que espera respuesta.',
            'Los tres encargan directamente una tarea a quien lee.',
            'Los tres se limitan a saludar y a despedirse.'], 0),
          writing('Escríbelo en inglés: "Quedo a la espera de su respuesta."', ['I look forward to your reply.', 'I am looking forward to your reply.'],
            { hint: 'Es el cierre fijo de la carta: look forward TO + sustantivo (your reply).',
              reject: [['I look forward your reply.', 'Falta el "to": look forward TO your reply.'], ['I look forward to receive your reply.', 'Tras "look forward to" no va un infinitivo: I look forward to your reply.'], ['I wait your reply.', 'La fórmula fija de la carta es "look forward to": I look forward to your reply.']] }),
        ] },
      { id: 'modulo5-6-teoria-2', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**2.** **Speaking: las tres partes** 🎤

La prueba oral tiene **tres partes**. ¡Cada una pide un estilo distinto!

**Speaking Part 1 — Preguntas personales:**

* Responde con **naturalidad**, no memorices.
* *Well, I usually spend my weekends reading or hiking.* → *Bueno, suelo pasar mis fines de semana leyendo o haciendo senderismo.*

**Speaking Part 2 — Monólogo (2 minutos):**

* Habla sobre un **tema dado**. Estructura: **introduce → añade detalles → concluye**.
* Cierra con *In conclusion...*
* Usa *fillers* (*well, you know*) con **moderación**.

**Speaking Part 3 — Discusión:**

* Debate preguntas más **abstractas**.
* Da opiniones con frases **avanzadas**: *From my perspective, this raises the issue of...* → *Desde mi perspectiva, esto plantea el tema de...*

**Consejos generales:** administra bien el **tiempo** ⏱️, **revisa** tu carta antes de entregarla y **pide aclaración** si no entiendes una pregunta en el speaking (*Could you repeat that, please?*).

> 💡 **Regla práctica:** en Part 2, **estructura** tu monólogo (intro–detalles–conclusión); en Part 3, suena **avanzado** con frases como *From my perspective...*.`,
        miniQuiz: [
          mc('En Speaking Part 1 conviene:', ['recitar respuestas memorizadas', 'responder con naturalidad', 'hablar 2 minutos seguidos', 'no responder nada'], 1),
          mc('El monólogo de Part 2 dura aproximadamente:', ['30 segundos', '2 minutos', '10 minutos', '20 minutos'], 1),
          mc('¿Qué frase es ideal para CERRAR el monólogo?', ['In conclusion...', 'Dear Sir/Madam,', 'Hi there!', 'Let me start by...'], 0),
          mc('Para dar una opinión avanzada en Part 3 dirías:', ['I like it, yes.', 'From my perspective, this raises the issue of...', 'See you later!', 'I dunno, maybe.'], 1),
          mc('Si no entiendes una pregunta en el speaking, debes:', ['quedarte callado', 'pedir aclaración (Could you repeat that?)', 'inventar la respuesta', 'cambiar de tema'], 1),
          mc('¿Cómo conviene estructurar el monólogo de Part 2?', ['sin orden, saltando ideas', 'introduce → añade detalles → concluye', 'solo la conclusión', 'repitiendo la pregunta'], 1),
          mc('Los "fillers" (well, you know) deberían usarse:', ['en cada frase', 'con moderación', 'nunca jamás', 'solo al inicio y final'], 1),
          rebuild('Reconstruye esta opinión avanzada de Part 3.', 'From my perspective, this raises an important issue.', ['From', 'my', 'perspective,', 'this', 'raises', 'an', 'important', 'issue.', 'rises', 'like', 'yes', 'maybe']),
          mc('En un simulacro del speaking, Milagros y Rosa se turnan: "Milagros: Well, I usually spend my weekends reading or hiking. Rosa: Could you repeat that, please? Well, you know, I usually spend my weekends reading. Milagros: In conclusion, I usually spend my weekends hiking here in Lima. Rosa: Well, you know, from my perspective, this raises an important issue. Milagros: From my perspective, this raises an important issue too." — ¿Cuál de las dos deja ver que no entendió lo que le preguntaron?', [
            'Rosa, que necesitó oír la pregunta otra vez.',
            'Milagros, que repitió su respuesta más de una vez.',
            'Las dos, porque usaron las mismas frases hechas.',
            'Ninguna: las dos contestaron a la primera.'], 0),
          mc('En un simulacro del speaking, Milagros y Rosa se turnan: "Milagros: Well, I usually spend my weekends reading or hiking. Rosa: Could you repeat that, please? Well, you know, I usually spend my weekends reading. Milagros: In conclusion, I usually spend my weekends hiking here in Lima. Rosa: Well, you know, from my perspective, this raises an important issue. Milagros: From my perspective, this raises an important issue too." — ¿Cuál abusa más de las muletillas que conviene dosificar?', [
            'Rosa, que las mete en dos intervenciones seguidas.',
            'Milagros, que arranca su primera respuesta con "Well".',
            'Las dos por igual, en todas y cada una de sus frases.',
            'Ninguna: las dos hablan sin ninguna muletilla.'], 0),
          writing('Escríbelo en inglés: "Desde mi perspectiva, esto plantea un tema importante."', ['From my perspective, this raises an important issue.'],
            { hint: 'Fórmula fija de opinión avanzada: From my perspective, + this raises (con -s).',
              reject: [['From my perspective, this rises an important issue.', 'Plantear un tema es "raises", no "rises": From my perspective, this raises an important issue.'], ['From my perspective, this raise an important issue.', 'Con "this" el verbo lleva -s: this raises an important issue.'], ['In my perspective, this raises an important issue.', 'La fórmula empieza con "From": From my perspective, this raises an important issue.']] }),
        ] },
      { id: 'modulo5-6-errores', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `#### **🚫 Errores Comunes**

Estos son los tropiezos clásicos del IELTS General. ¡Cázalos antes de que te resten puntos!

* ❌ **No responder a todos los puntos** de la carta. ✅ Organiza tu escrito con **encabezados mentales**: saludo, motivo, petición, cierre.
* ❌ **Monólogo sin estructura** (saltar entre ideas). ✅ Usa **"Firstly… Additionally… In conclusion…"** para mantener el hilo.
* ❌ Cerrar un **email formal** con *"Bye bye."* ✅ Usa **"Best regards,"** o **"Yours sincerely,"**.
* ❌ Olvidar **revisar** tu carta. ✅ **Revisa** antes de entregar y corrige errores.

> 💡 **Truco de Ozzy:** en la carta, cubre **todos** los puntos; en el monólogo, **estructura** con conectores. ¡Orden = puntos! 📈

En los ejercicios de abajo, **toca la palabra incorrecta** y arréglala 👇.`,
        miniQuiz: [
          tap('Corrige el cierre formal del email:', ['Best', 'regard,', 'and', 'thank', 'you', 'for', 'your', 'time.'], 1, 'regards,'),
          tap('Toca la palabra incorrecta (saludo formal):', ['Hey', 'Sir', 'or', 'Madam,', 'I', 'am', 'writing', 'to', 'apply.'], 0, 'Dear'),
          tap('Toca la palabra incorrecta (conector de cierre):', ['In', 'conclude,', 'I', 'fully', 'agree', 'with', 'this', 'view.'], 1, 'conclusion,'),
          tap('Toca la palabra incorrecta (opinión avanzada):', ['From', 'my', 'perspective,', 'this', 'rises', 'the', 'issue', 'of', 'cost.'], 4, 'raises'),
          tap('Toca la palabra incorrecta (verbo de la carta formal):', ['I', 'are', 'writing', 'to', 'request', 'more', 'information.'], 1, 'am'),
          tap('Toca la palabra incorrecta (conector de orden):', ['Firstly,', 'I', 'will', 'discuss', 'the', 'causes;', 'additional,', 'the', 'effects.'], 6, 'additionally,'),
          tap('Toca la palabra incorrecta (cierre formal):', ['Yours', 'sincerely', 'Ozzy', 'Turuta'], 1, 'sincerely,'),
          tap('Toca la palabra incorrecta (pedir aclaración):', ['Could', 'you', 'repeats', 'that', 'question,', 'please?'], 2, 'repeat'),
          mc('Milagros repasa dos cartas suyas y una respuesta oral: "1) Dear Sir or Madam, I am writing to apply. Firstly, I will discuss the causes; additionally, the effects. Best regards, and thank you for your time. 2) Dear Sir or Madam, I am writing to request more information. From my perspective, this raises the issue of cost. Yours sincerely, Milagros. 3) Could you repeat that question, please? In conclusion, I fully agree with this view." — ¿Qué distingue el propósito de la primera carta del de la segunda?', [
            'La primera se ofrece; la segunda pide que le informen.',
            'La primera pide datos; la segunda se ofrece para el puesto.',
            'Las dos se postulan exactamente al mismo puesto.',
            'Las dos piden que les manden más información.'], 0),
          mc('Milagros repasa dos cartas suyas y una respuesta oral: "1) Dear Sir or Madam, I am writing to apply. Firstly, I will discuss the causes; additionally, the effects. Best regards, and thank you for your time. 2) Dear Sir or Madam, I am writing to request more information. From my perspective, this raises the issue of cost. Yours sincerely, Milagros. 3) Could you repeat that question, please? In conclusion, I fully agree with this view." — ¿Qué deja entrever la segunda carta que la primera no menciona?', [
            'Que el precio le preocupa antes de decidirse.',
            'Que ya se decidió y solo le falta pagar.',
            'Que quiere exponer causas y después efectos.',
            'Que agradece de antemano el tiempo que le dieron.'], 0),
          writing('Escríbelo en inglés: "Escribo para solicitar más información."', ['I am writing to request more information.'],
            { reject: [['I are writing to request more information.', 'Con "I" el verbo be es "am": I am writing to request more information.'], ['I writing to request more information.', 'Falta el verbo be: I am writing to request more information.'], ['I am writing for request more information.', 'El propósito va con "to" + verbo: to request more information.'], ['I am writing to request more informations.', '"Information" es incontable y no lleva -s: more information.']] }),
        ] },
      { id: 'modulo5-6-resumen', type: 'resumen', markdown: `## **🎯 Resumen práctico que debes recordar**

Imagina tu **plan IELTS General** 🗺️:

* ✉️ **Writing Task 1 (carta):** lee el prompt, cubre **todos los puntos**, saludo correcto (*Dear Sir/Madam* / *Hi [Name]*) y cierre (*Yours sincerely* / *Best regards*).
* 📝 **Writing Task 2 (ensayo):** **introducción** parafraseada → **2-3 ideas** con ejemplos → **conclusión** que reafirma tu opinión.
* 🎤 **Speaking Part 1:** respuestas **naturales** a preguntas personales.
* 🎤 **Speaking Part 2:** monólogo de **2 minutos** con estructura *introduce → detalles → In conclusion...*.
* 🎤 **Speaking Part 3:** debate **abstracto** con frases avanzadas (*From my perspective...*).
* ⏱️ **General:** administra el **tiempo**, **revisa** la carta y **pide aclaración** si hace falta.

  | Sección          | Estrategia clave                       |
  | ---------------- | -------------------------------------- |
  | Carta (Task 1)   | Cubre todos los puntos + cierre formal |
  | Ensayo (Task 2)  | Intro + 2-3 ideas + conclusión         |
  | Speaking Part 2  | Estructura el monólogo de 2 minutos    |` },
      { id: 'modulo5-6-cierre', type: 'cierre', markdown: `#### **🌟 Cierre**

¡Estás listo para el **IELTS General**! 📈 Con estas técnicas, enfrentarás el examen con **confianza**.

Recuerda:

* ✉️ **Carta:** cubre **todos** los puntos y cierra con *Best regards* o *Yours sincerely*.
* 📝 **Ensayo:** intro parafraseada → 2-3 ideas → conclusión.
* 🎤 **Speaking:** natural en Part 1, **estructurado** en Part 2, **avanzado** en Part 3.

¡**Éxitos** en tu camino hacia la **certificación internacional**! 🌍 Ozzy confía en ti.

**🏅 Insignia obtenida:** 🎖 *Políglota Global* (¡Listo para el mundo!) 🌐🏅` },
    ],
    quizQuestions: [
      mc('Para un email formal de trabajo, ¿cómo lo terminarías?', ['"See you!"', '"Best regards,"', '"Bye bye."', '"Later!"'], 1),
      mc('En el ensayo (Writing Task 2), la introducción debe…', ['parafrasear la pregunta con tus palabras', 'copiarla literal', 'omitir el tema', 'dar ya la conclusión'], 0),
      mc('El monólogo de Speaking Part 2 dura aproximadamente…', ['2 minutos', '10 segundos', '15 minutos', '1 hora'], 0),
      mc('Para dar una opinión avanzada en Part 3 dices…', ['"From my perspective, this raises the issue of…"', '"I dunno."', '"See you later!"', '"I like it, yes."'], 0),
      mc('¿Qué saludo es correcto para una carta formal?', ['"Hi John,"', '"Dear Sir/Madam,"', '"Hey!"', '"What\'s up?"'], 1),
      mc('En Speaking Part 1, lo mejor es…', ['recitar respuestas memorizadas', 'responder con naturalidad', 'hablar 2 minutos seguidos', 'no responder'], 1),
      mc('Si no entiendes una pregunta en el speaking, deberías…', ['quedarte callado', 'pedir aclaración ("Could you repeat that?")', 'inventar la respuesta', 'cambiar de tema'], 1),
      mc('¿Cuántas ideas conviene desarrollar en el ensayo (Task 2)?', ['una sola', '2-3 con ejemplos', 'diez sin ejemplos', 'ninguna'], 1),
      mc('La estructura de una carta del Task 1 es…', ['solo el cuerpo', 'saludo → propósito → cuerpo → cierre', 'conclusión primero', 'solo el cierre'], 1),
      rebuild('Reconstruye el cierre formal:', 'Yours sincerely, Ozzy', ['Yours', 'sincerely,', 'Ozzy', 'Hi', 'regards', 'soon']),
      rebuild('Reconstruye la frase de opinión:', 'From my perspective, this raises an issue.', ['From', 'my', 'perspective,', 'this', 'raises', 'an', 'issue.', 'rises', 'your', 'because']),
      rebuild('Reconstruye el cierre del monólogo (Part 2).', 'In conclusion, I believe this is essential.', ['In', 'conclusion,', 'I', 'believe', 'this', 'is', 'essential.', 'start', 'hello', 'dear']),
      rebuild('Reconstruye esta frase de la carta formal.', 'I am writing to apply for the position.', ['I', 'am', 'writing', 'to', 'apply', 'for', 'the', 'position.', 'are', 'hey', 'bye']),
      tap('Toca la palabra incorrecta (carta formal):', ['Dear', 'Sir', 'or', 'Madam,', 'I', 'are', 'writing', 'to', 'apply.'], 5, 'am'),
      tap('Toca la palabra incorrecta (opinión avanzada):', ['From', 'my', 'perspective,', 'this', 'rises', 'the', 'main', 'issue.'], 4, 'raises'),
    ],
  };

  const modulo5_7 = {
    id: 'modulo5-7',
    title: 'Microlección 7',
    durationMinutes: 14,
    audioCues: ['Escucha el contenido de la lección.', 'Fíjate en los puntos clave.', 'Ahora vienen tus ejercicios.'],
    contentBlocks: [
      { id: 'modulo5-7-titulo', type: 'titulo', title: '¿Listo para tu examen final de C1? 🎓', subtitle: 'Simulador C1 TuRuta (IELTS/TOEFL)', markdown: '' },
      { id: 'modulo5-7-mision', type: 'mision', markdown: `## Realizar una **evaluación integradora de nivel C1**, simulando tareas tipo **IELTS / TOEFL** para medir tu **progreso general**. 🚌🏁

Pondrás a prueba las **cuatro habilidades**: *reading*, *writing*, *listening* y *speaking*. ¡Es tu gran simulacro final! 💪✨` },
      { id: 'modulo5-7-intro', type: 'intro', markdown: `¡Has llegado lejos, ruter@! 🎓 Soy **Ozzy** 🚌, y hoy te acompaño en tu **simulacro comprensivo de C1**.

Este recorrido contempla ejercicios tipo **IELTS / TOEFL**:
* 📖 **Lectura crítica**
* ✍️ **Redacción de ensayo**
* 🎧 **Comprensión auditiva avanzada**
* 🗣️ **Preguntas orales**

⚠️ ¡No es un examen real, sino un **repaso de todo lo aprendido**! Respira, confía en ti y demuestra cuánto has crecido. 🌟` },
      { id: 'modulo5-7-teoria-1', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**1.** **Simulador escrito: Reading + Writing 📖✍️**

### 📖 Reading (comprensión)

Lee con atención y responde con precisión. Busca la **idea clave** y la **evidencia** en el texto.

> **Texto:** *"Scientific studies indicate a decline in bee populations worldwide due to pesticide use."*

**Pregunta:** ¿Por qué disminuyen las abejas? → *Because of pesticide use.* (Por el uso de pesticidas.) ✅

🚌 **Tip:** localiza la causa señalada por *due to* / *because of*.

### ✍️ Writing (ensayo breve)

Escribe **4-5 líneas** discutiendo una postura. Estructura: **idea central → evidencia → conclusión**.

> **Tarea:** *"Should governments invest more in public transportation?"*

> **Ejemplo:** *"Yes, governments should invest more in public transportation. This reduces traffic and pollution. For example, in cities like Tokyo, efficient transit has lowered car usage…"*

🚌 **Recuerda:** una buena respuesta escrita **toma posición**, la **justifica** y la **cierra**.`,
        miniQuiz: [
          mc('Según el texto, ¿por qué disminuyen las poblaciones de abejas?', ['Due to pesticide use.', 'Due to cold weather.', 'Due to too much honey.', 'Due to fewer flowers.'], 0),
          mc('En el ensayo "Should governments invest…?", ¿qué debes hacer primero?', ['Tomar una postura clara.', 'Escribir sin opinar.', 'Copiar la pregunta.', 'Dar la conclusión sin argumentos.'], 0),
          mc('¿Qué estructura sigue una buena respuesta escrita?', ['Idea central, evidencia y conclusión.', 'Solo una opinión suelta.', 'Una lista sin orden.', 'Solo preguntas sin respuesta.'], 0),
          mc('En Reading, "due to" señala…', ['una causa o razón.', 'una despedida.', 'una pregunta.', 'un ejemplo.'], 0),
          mc('En el ejemplo de Writing sobre Tokio, ¿qué función cumple "for example"?', ['Cierra el ensayo.', 'Introduce evidencia que apoya la postura.', 'Saluda al lector.', 'Plantea una nueva pregunta.'], 1),
          mc('Una buena respuesta escrita, además de tomar postura, debe…', ['dejarla sin justificar.', 'justificarla y cerrarla.', 'cambiar de opinión al final.', 'copiar el enunciado.'], 1),
          rebuild('Reconstruye esta frase de Reading.', 'Bees are declining due to pesticide use.', ['Bees', 'are', 'declining', 'due', 'to', 'pesticide', 'use.', 'because', 'of', 'honey', 'cold']),
          rebuild('Reconstruye esta postura de Writing.', 'Governments should invest more in public transportation.', ['Governments', 'should', 'invest', 'more', 'in', 'public', 'transportation.', 'invests', 'less', 'cars', 'maybe']),
          mc('Lee: "Scientific studies indicate a decline in bee populations worldwide due to pesticide use. According to Smith (2020), the data reveal a clear trend. Nevertheless, the research yields contradictory findings. Furthermore, notable limitations must be considered. It is believed that governments should invest more in public transportation. This reduces traffic and pollution. For example, in cities like Tokyo, efficient transit has lowered car usage. A 2018 study in Nature found that sea levels are rising faster than predicted. It can be argued that the evidence is limited." — ¿Con cuál de estas afirmaciones estaría de acuerdo quien escribe?', [
            'Que la tendencia es clara, pero la evidencia todavía no cierra.',
            'Que los estudios ya zanjaron el caso de las abejas.',
            'Que los hallazgos contradictorios descartan el efecto de los pesticidas.',
            'Que el transporte público es la única causa de la contaminación.'], 0),
          mc('Lee: "Scientific studies indicate a decline in bee populations worldwide due to pesticide use. According to Smith (2020), the data reveal a clear trend. Nevertheless, the research yields contradictory findings. Furthermore, notable limitations must be considered. It is believed that governments should invest more in public transportation. This reduces traffic and pollution. For example, in cities like Tokyo, efficient transit has lowered car usage. A 2018 study in Nature found that sea levels are rising faster than predicted. It can be argued that the evidence is limited." — ¿Qué papel cumple en el texto lo que se cuenta sobre Tokio?', [
            'Es el ejemplo que respalda la propuesta de transporte.',
            'Es la tesis principal que defiende todo el texto.',
            'Es la objeción que debilita la propuesta de transporte.',
            'Es la fuente citada para el dato de las abejas.'], 0),
          writing('Escríbelo en inglés: "Las abejas están disminuyendo debido al uso de pesticidas."', ['Bees are declining due to pesticide use.', 'Bees are declining because of pesticide use.'],
            { reject: [['Bees are declining because to pesticide use.', 'La causa va con "due to" o "because of": Bees are declining due to pesticide use.'], ['Bees are declining due of pesticide use.', 'Se dice "due to", nunca "due of": Bees are declining due to pesticide use.'], ['Bees is declining due to pesticide use.', 'El sujeto es plural y pide "are": Bees are declining due to pesticide use.']] }),
        ] },
      { id: 'modulo5-7-teoria-2', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `**2.** **Simulador oral: Listening + Speaking 🎧🗣️**

### 🎧 Listening (avanzado)

Imagina un **audio de debate** con datos clave. Captura **números** y **hechos**.

> **Puntos clave:** *"Economy grew 3%. Inflation remained low."*

**Pregunta:** Según el audio, ¿qué pasó con la economía y la inflación? → *The economy grew 3% and inflation remained low.* (La economía creció 3% y la inflación se mantuvo baja.) ✅

### 🗣️ Speaking (respuestas)

Responde con una **opinión estructurada**: presenta ambos lados y concluye.

> **Pregunta:** *"Do you think social media affects learning?"*

> **Respuesta ejemplo:** *"In my view, social media can both help and hinder learning. On one hand, it provides access to educational resources. On the other, it can be distracting. Therefore, moderation is key."*

🚌 **Tip:** usa **conectores de C1** (*on one hand*, *on the other*, *therefore*) para sonar fluido y formal.`,
        miniQuiz: [
          mc('Según el audio, ¿qué pasó con la economía?', ['It grew 3%.', 'It fell 3%.', 'It stayed the same.', 'It doubled.'], 0),
          mc('Según el audio, ¿qué pasó con la inflación?', ['It remained low.', 'It rose sharply.', 'It disappeared.', 'It tripled.'], 0),
          mc('En Speaking, ¿cómo conviene estructurar una opinión C1?', ['Presentar ambos lados y concluir.', 'Decir solo "yes" o "no".', 'Cambiar de tema.', 'Repetir la pregunta.'], 0),
          mc('¿Qué conector ayuda a cerrar tu respuesta oral?', ['Therefore', 'Banana', 'Hello', 'Maybe'], 0),
          mc('En la respuesta modelo, "On one hand… On the other…" sirve para…', ['saludar al examinador.', 'presentar dos lados de la cuestión.', 'pedir más tiempo.', 'concluir bruscamente.'], 1),
          mc('Al escuchar un audio con datos, ¿qué conviene capturar?', ['solo el tono del hablante.', 'números y hechos clave.', 'el saludo inicial.', 'tu opinión personal.'], 1),
          rebuild('🎧 Reconstruye los puntos clave del audio.', 'The economy grew 3% and inflation remained low.', ['The', 'economy', 'grew', '3%', 'and', 'inflation', 'remained', 'low.', 'fell', 'high', 'rose']),
          rebuild('🎧 Reconstruye esta opinión estructurada.', 'On one hand it helps; on the other, it distracts.', ['On', 'one', 'hand', 'it', 'helps;', 'on', 'the', 'other,', 'it', 'distracts.', 'foot', 'side', 'because']),
          mc('Lee: "Rosa: According to the World Bank, the economy grew 3% and inflation remained low. Luis: Based on the data, I would say this evidence suggests a clear trend. Milagros: I agree with Luis to some extent, however, the evidence is limited. Rosa: Do you think social media affects learning? Luis: In my view, social media can both help and hinder learning. On one hand, it provides access to educational resources. On the other, it can be distracting. Milagros: Therefore, moderation is key. Rosa: It\'s getting a bit chilly in here." — ¿Quién respalda lo dicho solo en parte?', [
            'Milagros, que acepta el punto pero le pone reparos.',
            'Luis, que se apoya en los datos para sostenerlo.',
            'Rosa, que cita la fuente de las cifras.',
            'Los tres, que coinciden sin ninguna reserva.'], 0),
          mc('Lee: "Rosa: According to the World Bank, the economy grew 3% and inflation remained low. Luis: Based on the data, I would say this evidence suggests a clear trend. Milagros: I agree with Luis to some extent, however, the evidence is limited. Rosa: Do you think social media affects learning? Luis: In my view, social media can both help and hinder learning. On one hand, it provides access to educational resources. On the other, it can be distracting. Milagros: Therefore, moderation is key. Rosa: It\'s getting a bit chilly in here." — ¿Con cuál de estas afirmaciones estaría de acuerdo Luis?', [
            'Que las redes ayudan y estorban el aprendizaje a la vez.',
            'Que las redes solo distraen a quien estudia.',
            'Que las redes no tienen ningún efecto en el aprendizaje.',
            'Que las redes reemplazan a los recursos educativos.'], 0),
          writing('Escríbelo en inglés: "Las redes sociales pueden tanto ayudar como estorbar el aprendizaje."', ['Social media can both help and hinder learning.'],
            { reject: [['Social media can both help and hinder learn.', 'Tras "hinder" va el sustantivo verbal: hinder learning.'], ['Social media can both to help and to hinder learning.', 'Después de "can" va el verbo base sin "to": can both help and hinder learning.'], ['Social media can both helps and hinders learning.', 'Después de "can" el verbo no lleva -s: can both help and hinder learning.']] }),
        ] },
      { id: 'modulo5-7-errores', type: 'teoria', requiresQuizToUnlockNext: true, markdown: `#### **🚫 Errores Comunes**

En un simulacro C1, los tropiezos suelen ser de **estrategia**, no de inglés. Cuidado con estos:

* 🔤 **Confundir vocabulario:** revisa los **términos del enunciado** si no estás seguro **antes** de responder.
* 🧱 **No estructurar la respuesta:** asegúrate de presentar **idea central, evidencia y conclusión** en los ejercicios escritos.
* 😌 **Perder la calma:** lee/escucha **varias veces** si es posible, y contesta con **confianza** lo que sabes.

¡Toca los errores y conviértete en tu propio examinador! 🕵️‍♀️🔍`,
        miniQuiz: [
          tap('Toca la palabra incorrecta:', ['Bees', 'are', 'declining', 'because', 'to', 'pesticides.'], 4, 'of'),
          tap('Toca la palabra incorrecta:', ['The', 'economy', 'grow', '3%', 'last', 'year.'], 2, 'grew'),
          tap('Toca la palabra incorrecta:', ['In', 'my', 'view,', 'social', 'media', 'maybe', 'can', 'help', 'learning.'], 5, '(quítalo)'),
          tap('Toca la palabra incorrecta:', ['Governments', 'should', 'invests', 'in', 'public', 'transportation.'], 2, 'invest'),
          tap('Toca la palabra incorrecta:', ['On', 'the', 'other', 'side,', 'it', 'can', 'be', 'distracting.'], 3, 'hand,'),
          tap('Toca la palabra incorrecta:', ['Social', 'media', 'can', 'both', 'help', 'and', 'hinder', 'learn.'], 7, 'learning.'),
          tap('Toca la palabra incorrecta:', ['Therefore,', 'moderation', 'are', 'the', 'key', 'point.'], 2, 'is'),
          tap('Toca la palabra incorrecta:', ['Inflation', 'remain', 'low', 'during', 'the', 'year.'], 1, 'remained'),
          mc('Lee: "Rosa: In my view, governments should invest more in public transportation. This reduces traffic and pollution. For example, in cities like Tokyo, efficient transit has lowered car usage. In conclusion, these findings indicate a clear pattern. Luis: Governments should invest more in public transportation. I firmly believe that this is true. Milagros: The reading states this; however, the lecture challenges this by saying the evidence is limited." — ¿Cuál de las tres respuestas llega hasta el cierre de su estructura?', [
            'La de Rosa, que da postura, ejemplo y conclusión.',
            'La de Luis, que repite su postura sin sustentarla.',
            'La de Milagros, que contrasta dos fuentes sin cerrar.',
            'Las tres, porque todas hablan del transporte público.'], 0),
          mc('Lee: "Rosa: In my view, governments should invest more in public transportation. This reduces traffic and pollution. For example, in cities like Tokyo, efficient transit has lowered car usage. In conclusion, these findings indicate a clear pattern. Luis: Governments should invest more in public transportation. I firmly believe that this is true. Milagros: The reading states this; however, the lecture challenges this by saying the evidence is limited." — ¿Con cuál de estas afirmaciones estaría de acuerdo Milagros?', [
            'Que lo leído y lo escuchado no coinciden del todo.',
            'Que la charla confirma punto por punto lo leído.',
            'Que la evidencia del texto ya basta para decidir.',
            'Que Rosa cerró mal su respuesta sobre el transporte.'], 0),
          writing('Escríbelo en inglés: "Por lo tanto, la moderación es la clave."', ['Therefore, moderation is key.'],
            { reject: [['Therefore, moderation are key.', '"Moderation" es singular: Therefore, moderation is key.'], ['Therefore, the moderation is the key.', 'La fórmula va sin artículos: Therefore, moderation is key.'], ['Therefore, moderation is the key.', 'Va sin artículo delante de "key": Therefore, moderation is key.'], ['However, moderation is key.', '"Por lo tanto" marca consecuencia: va "Therefore", no "However".']] }),
        ] },
      { id: 'modulo5-7-resumen', type: 'resumen', markdown: `## **🎯 Resumen: tu simulacro de las 4 habilidades 🏁**

Repasaste un examen **integrador tipo IELTS / TOEFL**. Memoriza tu estrategia para cada parte:

| Habilidad | Qué hacer | Clave |
| --- | --- | --- |
| 📖 Reading | Buscar idea y evidencia | Localiza la causa (*due to*) |
| ✍️ Writing | Idea central → evidencia → conclusión | Toma postura y justifícala |
| 🎧 Listening | Capturar números y hechos | Atento a datos (*3%*, *low*) |
| 🗣️ Speaking | Presentar ambos lados y concluir | Usa *therefore* / *on the other hand* |

🧠 **Mnemotecnia:** *Lee con evidencia, escribe con estructura, escucha los datos, habla con conectores.* 🚌💨

**Lo más importante:**
* Revisa el **vocabulario del enunciado** antes de contestar.
* Mantén la **calma** y responde con **confianza** lo que sabes.` },
      { id: 'modulo5-7-cierre', type: 'cierre', markdown: `#### **🌟 Cierre Final (Nivel C1)**

¡Felicitaciones, ruter@! 🎉 **Has completado todo el nivel C1.** 🎓

Ahora eres capaz de **entender y producir inglés a nivel académico y profesional**: desde la **lectura crítica** hasta **expresarte con fluidez** y **escribir formalmente**. Este es un **gran logro** en tu camino hacia la **certificación internacional**. 🌍

Sigue practicando, ¡el mundo te espera! 🌟🚌💨

**🏅 Insignia obtenida:** *Certificado TuRuta – Nivel C1* 📘🎊 (¡Logrado, Profesional C1!)` },
    ],
    quizQuestions: [
      mc('1️⃣ "Bees are declining ___ pesticide use." (debido a)', ['due to', 'so that', 'in case', 'whereas'], 0),
      mc('2️⃣ En Reading, lo primero es buscar…', ['la idea y la evidencia.', 'el final del texto.', 'palabras en español.', 'el número de párrafos.'], 0),
      mc('3️⃣ Una buena respuesta de Writing incluye…', ['idea central, evidencia y conclusión.', 'solo una palabra.', 'una pregunta sin responder.', 'una lista sin orden.'], 0),
      mc('4️⃣ Según el audio: "Economy grew 3%. Inflation remained ___."', ['low', 'high', 'gone', 'double'], 0),
      mc('5️⃣ Para una opinión C1 sólida en Speaking, usa…', ['on one hand / on the other.', 'um, yeah, no.', 'silencio total.', 'solo "yes" o "no".'], 0),
      mc('6️⃣ "___, moderation is key." (por lo tanto)', ['Therefore', 'However', 'Because', 'Although'], 0),
      mc('7️⃣ Si dudas de una palabra del enunciado, debes…', ['revisar el término antes de responder.', 'ignorarla y adivinar.', 'borrar la pregunta.', 'responder en español.'], 0),
      mc('8️⃣ En Reading, "due to" / "because of" señalan…', ['una causa.', 'una despedida.', 'un ejemplo.', 'una conclusión.'], 0),
      mc('9️⃣ En Writing, una buena respuesta sobre una postura debe…', ['tomar postura, justificarla y cerrarla.', 'no opinar nunca.', 'copiar el enunciado.', 'cambiar de tema al final.'], 0),
      mc('🔟 En Listening avanzado conviene capturar sobre todo…', ['números y hechos clave.', 'el saludo del orador.', 'tu opinión personal.', 'el color de la sala.'], 0),
      rebuild('1️⃣1️⃣ Escucha y reconstruye:', 'The economy grew 3% and inflation remained low', ['The', 'economy', 'grew', '3%', 'and', 'inflation', 'remained', 'low', 'high', 'fell', 'because']),
      rebuild('1️⃣2️⃣ Escucha y reconstruye:', 'Governments should invest more in public transportation', ['Governments', 'should', 'invest', 'more', 'in', 'public', 'transportation', 'invests', 'less', 'cars']),
      rebuild('1️⃣3️⃣ Escucha y reconstruye:', 'Social media can both help and hinder learning', ['Social', 'media', 'can', 'both', 'help', 'and', 'hinder', 'learning', 'learn', 'distract', 'because']),
      tap('1️⃣4️⃣ Toca la palabra incorrecta:', ['Social', 'media', 'can', 'both', 'help', 'and', 'hinder', 'learn.'], 7, 'learning.'),
      tap('1️⃣5️⃣ Toca la palabra incorrecta:', ['Bees', 'are', 'declining', 'due', 'of', 'pesticides.'], 4, 'to'),
    ],
  };

  const module5 = {
    id: 'modulo-5',
    title: 'Módulo 5: Nivel C1 (rumbo a IELTS/TOEFL)',
    description: 'Al completar este módulo manejarás inglés C1 académico y profesional: lectura crítica y escaneo, producción académica avanzada, listening de inferencia, speaking de alto nivel, estrategias TOEFL iBT e IELTS General y un simulador integrador de las cuatro habilidades. 🎓',
    lessons: [
      modulo5_1, modulo5_2, modulo5_3, modulo5_4,
      modulo5_5, modulo5_6, modulo5_7,
    ],
  };

  if (typeof window !== 'undefined' && window.COURSE_DATA) {
    window.COURSE_DATA.modules.push(module5);
  }
})();
