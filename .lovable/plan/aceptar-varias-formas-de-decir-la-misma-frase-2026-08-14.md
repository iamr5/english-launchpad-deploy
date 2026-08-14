# Aceptar varias formas de decir la misma frase

## Qué pasa hoy

En el banco hay **2.104 ejercicios de escritura**. De ellos, **491 ya aceptan más de una respuesta** y **1.613 aceptan una sola**. Por eso "Worldwide, bees are going extinct" sale mal aunque sea correcto: el corrector compara contra la lista `accepted` del ítem (ignora mayúsculas, tildes, puntuación y contracciones, y perdona un dedazo), pero si la lista trae una sola frase, cualquier otra forma legítima se marca como error.

## Qué haremos

Generar con IA **3–5 respuestas aceptadas por ítem** para los 1.613 que hoy tienen una sola, y guardarlas en el contenido. Las variantes cubren lo que un alumno diría de forma natural y correcta:

- Posición del adverbio: "Worldwide, bees are going extinct" / "Bees are going extinct worldwide".
- Contracciones y formas equivalentes ("I am" / "I'm", "do not" / "don't").
- Sinónimos naturales del mismo registro ("global idea" / "overall idea").
- Orden alternativo de complementos cuando el inglés lo permite.

Lo que **no** se acepta: variantes que rompen la regla que enseña la lección (la -s de tercera persona, el tiempo verbal, el artículo), ni nada que choque con la lista `reject` del propio ítem, que se conserva intacta.

## Control de calidad

Cada variante generada pasa tres filtros antes de guardarse:

1. **Contra el propio ítem**: se descarta si coincide con una respuesta ya rechazada (`reject`) o si sólo se diferencia de la canónica en una inflexión gramatical (`work`/`works`, `walk`/`walked`) — justo lo que la lección evalúa.
2. **Contra el corrector real**: se normaliza igual que en la app; las que quedan idénticas a otra ya aceptada se colapsan.
3. **Revisión lingüística por IA en segunda pasada**: un segundo modelo juzga cada variante como "válida / dudosa / inválida" frente al enunciado en español y al nivel MCER del módulo; sólo entran las válidas.

La respuesta canónica (la que se muestra al fallar) no cambia: sigue siendo la primera de la lista.

## Detalle técnico

- Se editan `src/content/practice_bank_m1m2.js`, `practice_bank_m3.js`, `practice_bank_m4.js`, `practice_bank_m5.js`, añadiendo entradas al array `accepted` existente. No cambia el formato ni el tamaño del bundle de forma significativa (~40 KB extra por módulo, servido igual que hoy vía `/api/course/practice`).
- Generación por lotes con el AI Gateway (mismo procedimiento que el banco de ejercicios), en tandas por módulo y con reintentos.
- No se toca `src/assets/demo-app.html`: `gradeWriting` ya recorre toda la lista `accepted`, así que basta con enriquecer el contenido.
- Verificación final con un script que recorre los 2.104 ítems y confirma que cada `accepted` es válida, sin duplicados normalizados y sin colisión con `reject`.

## Tiempo

Es un proceso largo, como el de generación del banco: varias tandas de IA más las pasadas de revisión.
