# Práctica independiente y banco sin preguntas que exigen la teoría

Dos cambios sobre la pestaña Práctica de la app demo (`/democip` y todas las demos, que comparten la misma app).

## 1. Ocultar las preguntas que dependen del contenido consumido

Hay ejercicios en el banco que no practican inglés, sino que preguntan por lo que decía el bloque de teoría ("¿Qué estructura sigue una carta del Task 1?", "Según la teoría, ¿cuántas veces se escucha cada parte...?"). Fuera de la lección no tienen contexto y se sienten injustos.

Qué se hará:

- Revisar los candidatos del banco (los 487 ejercicios de tipo conceptual más los que mencionan teoría/bloque/lección explícitamente) y clasificar cada uno como autocontenido o dependiente del bloque.
- Marcar los dependientes en los archivos del banco con una bandera y dejar de servirlos en Práctica. No se borran: quedan marcados, por si algún día se usan dentro de la lección.
- Los conteos visibles ("X quizzes · Y ejercicios", progreso por libro) se recalculan con los ejercicios realmente servibles, para que el número que ves sea el número que puedes hacer.
- No se generan reemplazos: el banco baja de tamaño (estimado: unos pocos cientos de ejercicios sobre 5.678, el resto intacto).

## 2. La práctica deja de convalidar la ruta

Hoy aprobar un mini-quiz o el quiz final desde Práctica desbloquea la siguiente sección o completa la lección. Eso convierte el cuaderno en un atajo de la ruta.

Qué se hará:

- Los mini-quizzes y el quiz final se siguen viendo y se pueden responder desde Práctica, pero responderlos ahí ya no marca la lección como superada, ni desbloquea la siguiente sección, ni suma XP de ruta.
- Práctica lleva su propio registro: qué has practicado y cuántos ejercicios has superado, sin tocar el progreso del curso.
- El texto de la biblioteca se corrige (hoy dice "lo que aciertes suma en tu ruta") y pasa a explicar que es un cuaderno libre: practicas lo que quieras, cuando quieras, sin nota ni efecto en tu avance.
- Al cerrar una tanda ya no hace falta repintar la ruta: se vuelve a la misma posición de la lista.

## Detalle técnico

- Contenido: `src/content/practice_bank_m*.js` — se añade `"needsContext": true` a los ítems dependientes mediante un script de marcado; la clasificación se hace por lote con el gateway de IA sobre los candidatos, no a mano.
- Servido: el filtro de `needsContext` se aplica en `src/lib/course-data.server.ts` / la ruta `/api/course/practice`, de modo que esos ítems nunca llegan al cliente, y en el índice que alimenta `bankN`.
- App (`src/assets/demo-app.html`):
  - `openPracticeQuiz` gana un modo "sin efectos": para mini-quiz y quiz final abiertos desde Práctica no se llaman las funciones que marcan completado/desbloqueo; solo se guarda el registro propio de práctica.
  - `practiceItems`/`practiceStats` usan estado de práctica en vez de `isMiniQuizCompleted` / `isQuizCompleted` para las etiquetas de esas filas.
  - `practiceRefresh` deja de invocar `renderCourse`.
  - Copy de `pr-intro` actualizado.
- Verificación con Playwright: abrir Práctica, completar un mini-quiz desde ahí y confirmar en la ruta que la lección sigue bloqueada/pendiente; y recorrer tandas del banco comprobando que no aparecen preguntas dependientes.
