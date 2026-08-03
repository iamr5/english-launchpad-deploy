# Test de ubicación completo (40 ítems, por bandas)

Hoy el demo arma el test con un plan fijo de 8 preguntas sueltas (`PL_PLAN = ['A1','A1','A2','A2','B1','B1','B2','C1']`) y decide el nivel con "mitad correctas por banda". Eso ignora el banco real: `placement_items.js` tiene 40 ítems (8 por banda A1–C1) y existe una lógica de puntuación pensada para él en `public/app/placement.js` (umbral 5/8 para superar una banda, corte por abandono ≤2/8, nivel = banda más alta superada con todas las anteriores también superadas).

## Qué cambia

- El test presenta las 8 preguntas de cada banda en orden A1 → A2 → B1 → B2 → C1: hasta 40 ítems si el alumno sigue acertando.
- Parada temprana: si en una banda acierta 2 o menos de 8, el test termina ahí (no tiene sentido seguir subiendo dificultad).
- Nivel final: la banda más alta con 5+ aciertos de 8, siempre que todas las bandas anteriores también llegaron a 5. Si A1 no llega a 5, el alumno queda en A1 (módulo de fundamentos).
- El resultado sigue llevando al alumno al módulo correspondiente, igual que ahora.
- Contador y textos actualizados: "Pregunta 3 de 40" con indicación de la banda en curso, y la pantalla de intro deja de prometer "8 preguntas / 2 minutos" (pasa a "hasta 40 preguntas, ~8 minutos, termina antes si ya ubicamos tu nivel").
- "No lo sé" sigue existiendo y cuenta como fallo.

## Detalle técnico

En `src/assets/democip-index.html` (y copia sincronizada a `public/democip/index.html`):

- Eliminar `PL_PLAN` y el muestreo aleatorio de un ítem por entrada. `plBuild()` pasa a ordenar todo el banco por banda (A1→C1), barajando el orden dentro de cada banda y también el orden de las opciones no es necesario tocarlo.
- `plNext()` registra el acierto y, al terminar la última pregunta de una banda, evalúa el corte de abandono (≤2 aciertos) para finalizar el test antes de tiempo.
- `plLevel()` se reescribe con el umbral 5/8 acumulativo (misma regla que `public/app/placement.js`), devolviendo el índice de nivel para `OB.lvl`.
- El contador usa el total real de ítems del banco, no `PL.items.length` fijo de 8.
