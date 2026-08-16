# Speaking Circles funcional: salas reales con código, notas de voz y bots de relleno

Reemplazo de la maqueta simulada por un círculo que funciona de verdad: varias personas entran a la misma sala con un código, escuchan la tarea en audio, responden con nota de voz o texto, y se escuchan/comentan entre ellas. Si entras solo, un interruptor de debug rellena la sala con compañeros bot que responden y opinan, para poder testear el flujo completo.

Se elimina el matchmaking por horarios y las "próximas prácticas" agendadas: quedan el círculo, sus tareas y su conversación.

## Cómo se usa

1. En Práctica (con el modo debug de Círculos activado) aparece **Speaking con otros** con dos acciones: **Crear círculo** y **Entrar con código**.
2. Al crear: eliges nivel, tema y si se rellena con bots. Sale un código de 6 letras para compartir por WhatsApp.
3. Cada persona abre el mismo demo, pulsa **Entrar con código**, escribe el código y su apodo, y entra a la misma sala.
4. Dentro de la sala:
   - **Tarea actual** con su audio generado (botón de reproducir, texto en inglés y traducción).
   - **Conversación del círculo**: notas de voz reproducibles + mensajes de texto, en orden, con apodo y color de cada quien.
   - Grabar respuesta (tocar para empezar / tocar para parar, igual que el Speaking individual), escucharla antes de enviar, y enviarla al grupo.
   - Reaccionar y comentar la respuesta de otro ("Yo también…", "¿Por qué?"), que es lo que genera la conversación.
   - **Siguiente tarea** cuando el grupo ya respondió, con un pequeño resumen de quiénes participaron.
5. Todos ven lo mismo en pocos segundos, sin recargar.
6. Al cerrar: minutos hablados, cuántas notas de voz mandaste y qué funciones comunicativas se trabajaron.

## Bots (para testear solo)

- Interruptor al crear la sala: **Rellenar con compañeros bot**.
- Los bots entran con nombre y avatar propios, responden la tarea con su nota de voz (voz generada) y comentan lo que dicen los humanos, con ritmo natural (no todos al mismo tiempo).
- Los bots hablan al nivel del círculo (A1 suena A1) y se apagan en cualquier momento desde la misma sala.
- Se puede mezclar: humanos reales + bots en la misma sesión.

## Lo que se guarda

- Círculo (código, nivel, tema, si tiene bots, cuándo caduca), miembros (apodo, color, si es bot), tareas y mensajes (texto y/o audio).
- El audio de las notas de voz vive en almacenamiento privado, se sirve con enlaces temporales y se borra a los 30 días.
- Las salas de prueba caducan solas a las 24 horas.

## Detalles técnicos

**Base de datos** (una migración, con GRANT y RLS; sin acceso directo desde el navegador):
- `circles` (id, code único, level, topic, bots_enabled, expires_at, created_at)
- `circle_members` (circle_id, member_id, nickname, color, is_bot, last_seen_at)
- `circle_tasks` (circle_id, idx, prompt_en, prompt_es, audio_path, functions[])
- `circle_messages` (circle_id, member_id, task_idx, kind text|voice, body, audio_path, duration_ms, reply_to, created_at)
- Bucket privado `circle-audio`.
- Sin políticas para `anon`: todo el acceso pasa por el servidor, que valida el código de sala y el token de miembro. Solo `service_role`.

**API** en `src/routes/api/public/circles/` (los testers no tienen sesión):
- `POST /create` → crea círculo + primera tarea, devuelve código y token de miembro.
- `POST /join` → valida código + apodo, devuelve token de miembro y estado inicial.
- `GET /state?since=` → miembros, tarea actual y mensajes nuevos; el cliente lo consulta cada 2 s (poll corto, sin websockets) y es también el "tick" que dispara a los bots cuando les toca.
- `POST /message` → texto o `multipart` con WAV (límite 6 MB / 60 s), sube al bucket y devuelve la fila; los audios se entregan con URL firmada.
- `POST /next-task` → avanza la tarea del círculo.
- Rate limit por IP y por círculo; validación estricta de código, apodo y tamaño de audio.

**Audio y bots** (servidor, vía AI Gateway, sin timeouts artificiales):
- TTS para el enunciado de cada tarea y para las notas de voz de los bots; el archivo se cachea en el bucket y se reutiliza.
- Las respuestas y comentarios de bot se generan con el modelo por defecto del gateway, con el nivel MCER y la tarea como contexto, y se insertan con retardo escalonado.
- Banco de tareas por nivel A1–C1 reutilizando el banco de speaking ya existente como fuente de enunciados.

**Cliente** (`src/assets/demo-app.html`):
- Se sustituyen `circlesMatching()`, `circlesRoom()`, las sesiones agendadas y el chat guionado por el flujo real; se conservan los estilos `.sc-*`.
- Identidad de tester en `localStorage` (`ae_circle_v2`: código, token, apodo) para poder recargar sin perder la sala.
- Reutiliza el grabador WAV del Speaking individual y su reproductor.
- Sigue oculto tras el botón de debug de Círculos; al apagarlo desaparece de Práctica e Inicio.

## Validación

- Tres pestañas/dispositivos con el mismo código: los tres se ven en la lista de miembros y las notas de voz de uno se reproducen en los otros dentro de ~2 s.
- Entrar solo con bots activados: la sala se llena, los bots responden la tarea y comentan tu nota de voz.
- Bots apagados y sala vacía: la interfaz lo dice claramente en vez de simular gente.
- Código inválido, sala caducada, audio muy largo y micrófono denegado muestran errores explícitos.
- Nada de esto aparece sin el modo debug.
