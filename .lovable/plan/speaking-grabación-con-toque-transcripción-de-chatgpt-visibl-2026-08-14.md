# Speaking: grabación con toque, transcripción de ChatGPT visible y audio comparable

Dos cambios en la tarjeta de speaking del demo (`/democip`, sección oculta tras el debug).

## 1. Volver al botón de toque (no mantener pulsado)

- Toque 1: empieza a grabar. Toque 2: para y evalúa. Nada de mantener el dedo.
- Se conserva lo bueno del cambio anterior: el permiso del micrófono se pide **antes** de grabar (nunca más un 0% falso) y la grabación no se corta sola — el navegador ya no decide cuándo terminaste.
- Mientras grabas: botón en rojo, contador de segundos visible y onda animada, con el texto "Toca otra vez cuando termines".
- Corte de seguridad a los 60 s para no perder la toma si alguien olvida parar.

## 2. La transcripción de ChatGPT, completa y comparable con el audio

- El resultado pasa a mostrar **la transcripción de ChatGPT como protagonista**: bloque grande, texto completo, seleccionable, sin recortes ni comillas apretadas.
- Debajo, el reproductor del audio grabado con el modelo al lado ("Escuchar mi grabación" / "Escuchar el modelo"), para comparar de oído mientras se lee la transcripción.
- En los ejercicios de repetir/leer: comparación palabra por palabra contra la frase modelo, marcando en verde lo que se entendió y en rojo lo que faltó o salió distinto — hecha sobre la transcripción de ChatGPT, no sobre la del navegador.
- La transcripción del navegador (motor local) queda como dato secundario del piloto, en una línea colapsable "Ver comparación local vs IA" junto con las latencias.
- Si ChatGPT no devuelve texto, se dice explícitamente y se ofrece regrabar, en vez de mostrar un resultado vacío.

## Detalles técnicos

- `src/assets/demo-app.html`, `renderSpeaking`: se sustituyen los listeners `pointerdown`/`pointerup` por un `click` con máquina de estados (`idle → grabando → procesando → resultado`), manteniendo `spMicReady()` (permiso previo, stream reutilizado) y `recog.continuous = true`.
- `showComparison`: nueva jerarquía visual — transcripción IA completa arriba, audio + modelo, diff de palabras contra `q.target` calculado con `spCompare(q.target, ai.transcript)`, y bloque `<details>` con el resultado local.
- CSS nuevo: `.sp-transcript`, `.sp-audio-row`, `.sp-timer`, `.sp-details`.
- Sin cambios en el backend: `/api/course/speaking-eval` ya transcribe con `openai/gpt-4o-transcribe` a través del Gateway; solo se aprovecha mejor su respuesta en la interfaz.
