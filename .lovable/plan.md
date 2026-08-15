# Speaking: niveles reales A1–C1, costo por intento y partes ininteligibles

Tres arreglos en el piloto de Speaking (`/democip`, oculto tras debug).

## 1. Los ejercicios sí van a corresponder al nivel

Hoy el banco usa los **mismos cinco contextos para todos los niveles**, y cuatro de ellos son de ingeniería (obra, planta de energía, tablero de control, laboratorio de software). Por eso en A1 aparece "explica una regla de seguridad sobre un tablero de control". Además, cada tanda toma 5 ejercicios **al azar** del nivel, sin orden de dificultad.

Cambios:

- Contextos propios por nivel, siguiendo el sílabo Cambridge/MCER:
  - **A1**: personal y cotidiano — nombre, familia, casa, rutina, comida, números, hora, clima, un compañero de trabajo.
  - **A2**: vida diaria ampliada — viajes, compras, planes, un problema simple en el trabajo o el estudio.
  - **B1**: trabajo y estudio con opinión y experiencia; entra ingeniería en situaciones sencillas.
  - **B2**: reuniones, incidentes, propuestas; ingeniería con detalle técnico.
  - **C1**: negociación, crisis, estrategia; ingeniería completa.
- Proporción de inglés de ingeniería creciente: A1 0%, A2 ~10%, B1 ~25%, B2 ~40%, C1 ~50%. En A1–A2 solo vocabulario básico de trabajo, nunca términos técnicos.
- Longitud y exigencia por nivel: A1 frases de 5–8 palabras y solo presente simple; la escala actual (10/16/28/42/60 palabras) se recalibra para que A1 no pida párrafos.
- Modos por nivel: A1 y A2 sobre todo repetir y leer en voz alta, con poca respuesta guiada; el habla libre y el diálogo largo aparecen desde B1.
- Dentro de cada tanda, los 5 ejercicios salen **en orden de dificultad** (repetir → leer → guiado → diálogo → libre), no barajados.
- Se mantienen las 2.500 fichas (500 por nivel), con traducciones y glosa como ahora, y se revalida que no haya IDs repetidos ni campos faltantes.

## 2. Costo visible en cada transcripción/evaluación

Cada intento hace dos llamadas de IA: transcripción y evaluación. Hoy no se ve nada de gasto.

- El backend leerá el **uso real de tokens** que devuelve cada llamada (audio/entrada/salida) y calculará el costo estimado de esa toma.
- La respuesta traerá el desglose: tokens y costo de la transcripción, tokens y costo de la evaluación, y el total del intento.
- En el resultado aparecerá una línea clara del tipo **"Esta transcripción costó ≈ $0,0xx (transcripción $0,00x · evaluación $0,0xx)"**, con el detalle de tokens y latencias en el bloque desplegable del piloto.
- La tanda mostrará además el acumulado del día y cuántas evaluaciones quedan en la cuota diaria.
- Los precios se guardarán en una tabla única por modelo, fácil de actualizar; el número se presenta como **estimado**, no como cobro exacto.

## 3. Lo que no se reconoce como inglés se marca

- La evaluación devolverá, además de la transcripción, los **fragmentos que no son inglés reconocible**: palabras en español, sonidos sin sentido, relleno o audio dudoso, cada uno con su motivo.
- Esos fragmentos se resaltan dentro de la transcripción grande con un estilo bien visible (fondo ámbar rayado, subrayado ondulado y etiqueta al pasar/tocar), diferente del rojo de "palabra que faltó del modelo".
- Debajo aparece un resumen: **"No sonó a inglés: …"** con la lista y, cuando aplique, cómo se diría en inglés.
- Si la transcripción entera resulta ininteligible, se dice explícitamente y la acción principal es regrabar; nunca se aprueba.
- La leyenda de colores queda visible: verde = dicho bien, rojo = faltó, ámbar = no se reconoció como inglés.

## Detalles técnicos

- `scripts/generate_speaking_bank.py`: matrices de contextos, frames, frases modelo y traducciones separadas **por nivel**; nuevas tablas `minw`, mezcla de modos y proporción `domain` por nivel; regenera `src/content/speaking_bank.js` con las mismas 2.500 fichas y validadores ampliados (distribución por modo/dominio y tope de longitud en A1–A2).
- `src/assets/demo-app.html`, `openSpeakingRun`: selección por dificultad en vez de `shuffle(...).slice(0,5)`.
- `src/routes/api/course/speaking-eval.ts`: capturar `usage` del evento `transcript.text.done` y de `response.completed`; nueva tabla de precios y campo `cost` en la respuesta; ampliar `SCHEMA` con `unintelligible: [{ text, reason, suggestion }]` (strict: todas las propiedades requeridas, `suggestion` nullable) y ajustar el prompt para que separe transcripción de juicio.
- `showComparison`: resaltado de fragmentos no inglés sobre la transcripción IA, línea de costo, resumen y leyenda; nuevas clases CSS `.sp-unintel`, `.sp-cost`, `.sp-legend`.

## Validación

- Revisar una muestra de A1/A2 y confirmar que ningún enunciado pide temas técnicos.
- Correr una tanda por nivel y ver que la dificultad sube dentro de la tanda.
- Un intento real: confirmar que aparece el costo con tokens reales y que cuadra con el uso del gateway.
- Grabar mezclando español e inglés y confirmar que lo español queda resaltado y listado.
