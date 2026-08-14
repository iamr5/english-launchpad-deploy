# Vocabulario: 8.000+ palabras, carga bajo demanda y bancos por carrera

Hoy la pestaña Vocabulario trae ~1.580 palabras en 62 temas, todas dentro de un único archivo (`vocab.js`) que el navegador descarga entero al abrir el demo. Con 8.000+ palabras ese archivo pesaría varios MB y congelaría la pantalla igual que pasó con el banco de práctica. Así que el crecimiento va junto con el mismo tratamiento que ya le dimos a Práctica: índice ligero al arrancar y palabras sólo cuando se abre el tema.

## 1. Banco general: de 1.580 a 8.000+ palabras

- Se amplían las secciones actuales y se suman nuevas (casa, ciudad, trabajo, tecnología, salud, emociones, naturaleza, deporte, comida, verbos frasales, conectores, expresiones) hasta pasar de 8.000 palabras generales.
- Cada palabra respeta las reglas que ya rigen el archivo: cero repetidas en toda la biblioteca, español latino neutro, y lado inglés pronunciable por el lector de voz.
- Cada palabra lleva su nivel (A1–C2) para que los temas se ordenen de fácil a difícil.
- Generación con el mismo proceso de IA + doble revisión que usamos para el banco de quizzes (traducción correcta, registro neutro, sin duplicados, uso real).

## 2. Que no se congele

- Al abrir el demo sólo viaja un **índice**: secciones, temas, emoji, nivel y cuántas palabras tiene cada uno. Con eso se pinta toda la pantalla y los contadores sin bajar nada más.
- Las palabras de un tema se piden al tocar la ficha, y quedan en memoria para esa sesión. Mientras llegan se ve un estado de carga corto, nunca pantalla en blanco.
- La rejilla de temas se pinta en tandas para que una biblioteca de cientos de fichas no bloquee el desplazamiento.
- La barra de progreso ("escuchadas") se calcula desde el índice y el progreso guardado, sin necesidad de tener las palabras cargadas.

## 3. Bancos especializados por carrera

Seis bancos nuevos, independientes del general (~600–800 palabras cada uno, con sus quizzes):

- **Ingeniería** — matemáticas, programación y datos, construcción/obra, eléctrica y mecánica, seguridad, gestión de proyectos.
- **Turismo y hotelería** — recepción, tours, transporte, gastronomía, atención al cliente.
- **Salud** — cuerpo, síntomas, enfermería, farmacia, emergencias.
- **Negocios y finanzas** — contabilidad, marketing, reuniones, correos, contratos.
- **Derecho** — juzgados, contratos, delitos, procedimiento.
- **Educación** — aula, evaluación, didáctica, gestión escolar.

En la pestaña Vocabulario aparecen como secciones propias, marcadas como especializadas, sólo si el demo las tiene activadas. `/democip` arranca con **Ingeniería** encendido.

## 4. Todo lleva quiz

Cada tema, general o especializado, tiene su examen con los tres tipos que ya existen: escuchar y elegir el español, escuchar y escribirla en inglés, y "¿para qué se usa?". Para los bancos especializados se escriben también los ítems de "¿para qué se usa?" (uso correcto + tres usos falsos creíbles del mismo campo), y para el banco general se completan los que falten. Los distractores salen de palabras del mismo tema, así que un examen de ingeniería no mezcla con saludos.

## 5. En el constructor de demos (`/demos`)

Nueva tarjeta **Vocabulario** dentro de la configuración del demo:

- Interruptores para cada banco especializado (se pueden activar varios a la vez).
- Muestra cuántas palabras y temas suma cada uno.
- Opción de decidir si el banco general se ve completo o filtrado por nivel.

## Detalles técnicos

- El contenido pasa de `public/demo-assets/vocab.js` a `src/content/vocab/*.js` (general por secciones + un archivo por pack), evaluados en build por `courseContentPlugin` en `vite.config.ts`, igual que el curso y el banco de práctica. Deja de ser descargable de golpe desde `public/`.
- `src/lib/vocab-data.server.ts`: `getVocabIndex(packs)` (secciones/temas + conteos) y `getVocabTopics(ids)` (palabras + ítems de uso de unos pocos temas).
- `src/routes/api/course/vocab.ts`: mismo pase y límite por IP que `/api/course/practice`; recibe ids de tema y devuelve sólo esos.
- El índice viaja en `/api/course/bundle` como `vocabIndex`, filtrado por los packs activos del demo.
- `src/lib/demo-config.ts`: nueva rama `vocab: { packs: string[], nivelMax?: string }` en `DEFAULTS`; `src/demos/democip.json` añade `"vocab": { "packs": ["ingenieria"] }`.
- `src/routes/_authenticated/demos.tsx`: pestaña/tarjeta con los interruptores de packs.
- `src/assets/demo-app.html`: `renderVocab` trabaja con el índice; `openVocabChip` y `startVocabExam` hacen `await` del tema; render por tandas; `VOCAB_USE` se recibe junto con las palabras del tema en lugar de cargarse entero.
- Scripts de generación y revisión bajo `/tmp` (mismo patrón que `/tmp/qz`), con verificación automática de duplicados y de que cada tema tenga suficientes palabras para armar distractores.
- Verificación en navegador: tiempo hasta pintar Vocabulario, tema que carga bajo demanda, examen de un tema de ingeniería en `/democip`, y un demo sin packs para confirmar que no ve las secciones especializadas.
