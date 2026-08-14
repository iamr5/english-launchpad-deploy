# Speaking: grabación por pulsación y comprensión de lo que dices

Dos problemas reales en el piloto de Speaking (`/democip`, oculto tras debug):

1. La grabación se corta sola. El motor de reconocimiento del navegador termina por su cuenta al detectar silencio, y el estado visual queda desincronizado del audio que sigue capturándose. Se siente arbitrario.
2. Te pedimos leer una frase en inglés sin decirte qué significa. No hay traducción, ni glosa de palabras clave, ni ayuda de pronunciación.

## Qué se hace

### 1. Grabar mientras mantengo apretado
- El botón de micrófono pasa a **mantener pulsado para hablar**: suelto = paro. Funciona con mouse, táctil, y barra espaciadora (accesibilidad); también se soporta `pointercancel`/salida de ventana como "soltar".
- El reconocimiento local se configura como continuo y, si el navegador lo corta antes de que sueltes, se reinicia solo por debajo. Nunca más el corte fantasma.
- Al mantener pulsado: contador de segundos y ondas en vivo, con el texto "suelta para terminar". Corte de seguridad a 60 s con aviso, no silencioso.
- Si sueltas antes de ~0,7 s, se descarta como toque accidental y se te invita a mantener pulsado, sin puntuar 0%.
- El permiso del micrófono se pide **una sola vez** antes del primer intento, con una pantalla previa clara ("vamos a pedir permiso al micrófono"); mientras el navegador muestra el diálogo no se graba ni se puntúa.

### 2. Entender lo que estoy diciendo
- Cada ejercicio muestra la frase modelo en inglés + su **traducción al español**, con opción de ocultarla para autoexigirse.
- **Glosa de palabras clave**: toca una palabra de la frase y ves su significado y puedes escucharla suelta.
- Ayuda de pronunciación: reproducir el modelo a velocidad normal y lenta, y escuchar solo la palabra que fallaste.
- En modos de habla libre (`free`, `guided`, `dialogue`) la consigna se muestra en español, con la frase de apoyo en inglés y ejemplos de respuesta esperada.
- Contenido: el banco (2.500 ítems, 500 por nivel) se regenera con campos nuevos `es` (traducción), `promptEs`/`taskEs` y `gloss` (palabras clave con significado). Sólo hay 247 frases modelo únicas y 500 consignas únicas, así que las traducciones se escriben y revisan sobre ese conjunto reducido y se propagan al banco completo — nada de traducción automática sin revisar.

### 3. Limpieza del UX de la tarjeta
- Tres estados claros y separados: **Preparar** (frase + traducción + escuchar modelo) → **Grabar** (mantener pulsado) → **Resultado**.
- El resultado deja de ser un volcado técnico: primero el veredicto y qué mejorar, luego tu audio para escucharte junto al modelo, y las métricas local/IA plegadas en un bloque "detalle del piloto" (visible sólo con debug activo).
- Botón de reintento siempre presente y en el mismo lugar; al reintentar no se pierde el intento anterior (queda en historial).

## Detalles técnicos
- `src/assets/demo-app.html`: reescribir `renderSpeaking` con máquina de estados (`idle | prep | recording | scoring | result`), handlers `pointerdown/pointerup/pointercancel` + teclado, y `spRecognizer()` con `continuous = true`, `interimResults = true` y auto-reinicio hasta el `stop()` explícito.
- Mantener la captura WAV actual (`spRecorder`/`spWav`) y la evaluación paralela local + IA; sólo cambia cuándo empieza y termina.
- `src/content/speaking_bank.js`: regenerar con los campos `es`, `promptEs`, `taskEs`, `gloss`. Sin cambios de esquema en API ni base de datos; `src/routes/api/course/speaking.ts` sirve los campos nuevos tal cual.
- Speaking sigue oculto tras el toggle de debug y fuera de la ruta de aprendizaje, como pediste.
