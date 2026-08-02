# Ubicar al alumno en el nivel que arrojó el test

Hoy el test de ubicación calcula el nivel (A1–C1) y lo guarda en el perfil, pero el curso siempre arranca en la primera lección del Módulo 1: el resultado no cambia dónde empieza el alumno. Eso se corrige.

## Qué cambia

- Al terminar el test, el nivel resultante define el **módulo de arranque** (A1→módulo 1, A2→2, B1→3, B2→4, C1→5).
- Todos los módulos por debajo de ese nivel quedan **desbloqueados y visitables**, pero **sin XP ni check de completado**: son repaso opcional, no logros regalados.
- La pantalla final del onboarding y su botón "Empezar" apuntan a la **primera lección del módulo del nivel obtenido**, no a la del módulo 1.
- El texto del resultado deja de decir "Empezarás desde el inicio…" y pasa a decir dónde arranca ("Empiezas en el nivel B1; A1 y A2 quedan abiertos por si quieres repasar").
- Boti sugiere repaso: si el alumno falla el primer mini-quiz de su nivel de arranque, aparece un mensaje con acceso directo al módulo anterior ("¿Repasamos A2 un momento?"). No bloquea nada.
- El caminito y el panel reflejan el arranque: el módulo actual pasa a ser el del nivel obtenido, y la constancia/nivel del panel muestran ese nivel.

## Detalles técnicos

- `obFinish` / `obFinishToLesson`: además de `saveProfile`, llamar a un nuevo `applyPlacement(lvl)` que marca `unlocked = true` en la primera lección de cada módulo hasta el índice del nivel (y en las lecciones de esos módulos), sin tocar `quizCompleted` ni XP.
- `isLessonCompleted` deriva de "la siguiente está desbloqueada", así que las lecciones de repaso no deben quedar encadenadas como hechas: se marcan con un flag `skipped: true` y `isLessonCompleted` lo excluye, de modo que no cuenten como completadas ni sumen XP.
- `obRender` (paso final) y `obFinishToLesson` usan `course.modules[startIdx]` en vez de `course.modules[0]`.
- `plRender` (estado `result`): copia nueva según el nivel.
- Repaso sugerido: en el fallo de un mini-quiz, si la lección pertenece al módulo de arranque y existe módulo anterior desbloqueado, mostrar el mensaje de Boti con botón a ese módulo.
- Se editan `src/assets/democip-index.html` y se copia a `public/democip/index.html`.
- Verificación con Playwright en móvil: completar el onboarding forzando respuestas correctas hasta B1 y comprobar que el caminito abre en el módulo B1 con A1/A2 abiertos y sin check.
