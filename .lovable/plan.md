# Convalidar niveles del test + momento "sombrero seleccionador"

Hoy el test de ubicación abre los módulos por debajo del nivel obtenido pero los marca `skipped`: sin XP y sin check. El alumno que sale B1 ve A1 y A2 vacíos, como si no supiera nada. Además el resultado aparece con la misma animación discreta que cualquier otro paso del onboarding.

## Qué cambia

**1. Los niveles superados se dan por aprobados**

- Si el test ubica al alumno en A2/B1/B2/C1, todos los módulos por debajo quedan marcados como completados (check verde) y otorgan su XP correspondiente, igual que si los hubiera hecho.
- El XP convalidado suma al total, al nivel del anillo y al leaderboard.
- Cada módulo convalidado muestra una marca discreta de "Convalidado por el test de ubicación" para que quede claro de dónde viene, y sus lecciones siguen abiertas para repasar cuando quiera.
- El alumno arranca en la primera lección de su módulo de nivel.

**2. Sugerencia de repaso (y retroceso) si le va mal**

- Si falla repetidamente en su módulo de arranque, Boti aparece y le ofrece bajar al nivel anterior: "Parece que este nivel te está costando. ¿Bajamos a A2 un momento?" con botón "Sí, repasar" / "Seguir aquí".
- Se dispara tras 2 fallos de mini-quiz o 1 fallo de examen final dentro del módulo colocado (no en cada error suelto), y como máximo una vez por sesión.
- Si acepta, el módulo anterior deja de contar como convalidado y pasa a ser su nivel activo; su progreso allí se registra normal. Nunca bloquea nada: puede volver a subir cuando quiera desde el mapa.

**3. Momento mágico de ubicación (estilo sombrero seleccionador)**

Al terminar el test, antes de mostrar el nivel, una secuencia a pantalla completa distinta de la celebración de lección:

- Oscurecimiento del fondo y Boti al centro "pensando": las insignias A1 · A2 · B1 · B2 · C1 giran alrededor en órbita, acelerando.
- Boti duda: la órbita se frena en un nivel, retrocede, vuelve a acelerar (falso suspenso, ~2.5 s en total).
- Golpe final: la insignia del nivel real se ancla al centro con un zoom + destello, halo de luz, onda expansiva y confeti dorado; Boti anuncia "¡<b>B1</b>!".
- Debajo aparecen los módulos convalidados marcándose uno a uno con su check y su XP sumando en contador ("A1 ✓ +420 XP", "A2 ✓ +560 XP").
- Botón "Empezar en B1" para continuar. La secuencia se puede saltar tocando la pantalla.
- Respeta `prefers-reduced-motion`: sin órbita ni confeti, transición simple al resultado.

## Detalle técnico

En `src/assets/democip-index.html`, con copia sincronizada a `public/democip/index.html`:

- `applyPlacement(lvl)`: en vez de `L.skipped = true`, marcar cada lección de los módulos anteriores con `unlocked`, `readingCompleted`, `quizCompleted` y todos sus mini-quizzes completados, más `placedCredit: true` para trazabilidad. Guardar `PROGRESS.__placement = { lvl, ts }`.
- `isLessonCompleted` / `isLessonSkipped`: eliminar la exclusión por `skipped`; el XP existente (`lessonXpEarned`) empieza a contar solo con marcar los flags, sin tocar la fórmula.
- Marca "Convalidado" en la cabecera de módulo cuando todas sus lecciones tengan `placedCredit`.
- `suggestReview(lesson)`: dejar de depender de `skipped`; usar `PROGRESS.__placement` + un contador de fallos por módulo (`_failCount`), umbral 2 mini-quiz o 1 final. Añadir botón secundario "Seguir aquí" y, al aceptar, limpiar `placedCredit`/completado del módulo anterior y renderizarlo.
- Nueva función `placementReveal(lvl, credits, onDone)` con su CSS propio (`.sort-*`, keyframes de órbita, destello, onda) llamada desde `plFinish()` antes de pintar `PL.state === 'result'`; independiente de `.win`/`lessonCelebration`.
