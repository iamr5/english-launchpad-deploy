# Speaking A1–C1: caminos posibles y costos

## Qué ya tenemos (verificado en el código)

`src/assets/demo-app.html` ya usa la voz del navegador (`speechSynthesis`) para que el alumno **escuche** inglés: la función `speak()` y el botón de audio de los quizzes de vocabulario. Eso es 100% gratis y ya está probado. Lo que falta es la mitad contraria: que el alumno **hable** y reciba corrección.

## Los tres caminos para "hablar"

### Camino 1 — Reconocimiento del navegador (costo cero)
El navegador transcribe la voz sin salir del dispositivo (Web Speech API). Comparamos lo dicho contra la frase objetivo y damos una nota por palabra: verde / amarilla / roja.

- Costo por alumno: **0**. No pasa por ningún servidor ni consume tokens.
- Sirve para: repetir frases, leer en voz alta, responder con una frase esperada. Cubre bien A1–B1.
- Límite real: Chrome y Android van bien; Safari/iOS es irregular. No entiende respuestas libres ni juzga fluidez o entonación.

### Camino 2 — Evaluación con IA por audio (lo que recomiendo sumar)
El audio del alumno se manda a un modelo que **escucha de verdad** (Gemini acepta audio como entrada desde nuestro Gateway; no hace falta traer tokens de ChatGPT ni una cuenta aparte). El modelo devuelve: transcripción, qué palabras salieron mal, nota de pronunciación/fluidez y una corrección corta en español.

- Sirve para: respuestas abiertas, role-play profesional, tareas B2–C1 (opinar, explicar un avance de obra, presentar un proyecto).
- Costo: se paga por segundo de audio + texto de respuesta. Un intento típico de 10–15 segundos cuesta **fracciones de céntimo** (orden de USD 0,0002–0,0005 con el modelo ligero). Un alumno que hace 15 intentos al día, 20 días al mes ≈ **USD 0,05–0,15 al mes**. Mil alumnos activos ≈ **USD 50–150 al mes** en el peor caso, menos si el Camino 1 filtra los ejercicios simples.
- Se descuenta del saldo de créditos del proyecto, igual que el resto de la IA.

### Camino 3 — Conversación en vivo con IA (voz a voz, tipo llamada)
El alumno conversa en tiempo real con un tutor de IA.

- Costo: **10 a 30 veces más caro** que el Camino 2, porque se paga cada minuto de conexión abierta, hable o no. Orden de USD 0,10–0,30 por cada 10 minutos de conversación. Mil alumnos con una charla semanal ≈ **USD 400–1.200 al mes**.
- Mi recomendación: **no ahora**. Dejarlo como función premium más adelante, no como parte del curso base.

## Lo que propongo construir

Un **modelo híbrido**: el Camino 1 hace el 80% del trabajo gratis y el Camino 2 entra solo donde aporta.

1. **Ejercicios de repetición y lectura en voz alta** (A1–B1) → navegador, costo cero, feedback palabra por palabra al instante.
2. **Tareas de habla libre** (2–3 por microlección desde A2, más en B2–C1) → evaluación con IA: nota de pronunciación, fluidez, gramática y una sugerencia concreta.
3. **Tope de gasto por alumno y por día** (por ejemplo 20 evaluaciones IA diarias); pasado el tope, el ejercicio sigue funcionando con el Camino 1 en vez de bloquearse.
4. **Situaciones habladas de ingeniería** reutilizando las escenas de English for Engineering que ya existen: reportar un avance, explicar una falla, charla de seguridad.

## Cómo se reparte por nivel

| Nivel | Qué practica | Motor |
|---|---|---|
| A1 | Sonidos, palabras, frases modelo | Navegador |
| A2 | Frases propias con estructura dada | Navegador + IA de vez en cuando |
| B1 | Responder preguntas, describir | Mitad y mitad |
| B2 | Opinar, explicar un proceso | IA |
| C1 | Presentar, negociar, defender una postura | IA |

## Detalles técnicos

- **Grabación**: `MediaRecorder` en el navegador, audio corto (máximo 30 s) en formato comprimido; nunca se guarda en servidor, se manda y se descarta.
- **Reconocimiento local**: `webkitSpeechRecognition` con detección de soporte; si el navegador no lo trae (Safari), ese ejercicio cae directo al Camino 2 o se marca como "solo escuchar".
- **Evaluación IA**: server function nueva (`src/lib/speaking.functions.ts`) que recibe el audio, llama al Gateway con un modelo Gemini que acepta audio, y devuelve JSON con estructura fija (transcripción, aciertos por palabra, notas 0–100, consejo en español). Con límite por IP/alumno, igual que ya hacemos en `/api/course/*`.
- **Contenido**: banco nuevo `src/content/speaking_bank*.js` indexado por bloque de teoría, servido bajo demanda por `/api/course/speaking`, siguiendo exactamente el patrón del banco de práctica.
- **UI**: tipo de ejercicio nuevo dentro del `renderQuiz` existente en `demo-app.html` (botón de micrófono, onda de grabación, tarjeta de resultado), más una pestaña Speaking en la biblioteca de práctica.
- **Medición**: la primera semana registramos segundos de audio evaluados para tener el costo real, no estimado, antes de abrirlo a todos.

## Primera entrega sugerida

Un piloto: micrófono funcionando, Camino 1 completo en un módulo, y 10 tareas evaluadas con IA para ver el costo real medido. Con ese dato decidimos cuánta IA lleva el curso entero.
