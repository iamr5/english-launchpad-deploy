# Práctica: el contador cuenta secciones, no ejercicios

## Qué está pasando

Dos cosas distintas, y ninguna es que falten ejercicios.

**1. El número que ves no cuenta ejercicios, cuenta filas.** La línea "X de Y ejercicios superados" suma las tarjetas de la lista (cada "Teoría 3", cada "Quiz final"), no las preguntas que hay dentro de ellas. Sin el banco de práctica esas filas son exactamente 211 — el número que estás viendo. Con el banco ya cargado, la misma cuenta da 377. Ninguno de los dos es la cantidad de ejercicios.

**2. Los ejercicios sí están.** Comprobado en el demo en vivo: el curso entrega los 5.678 ejercicios del banco repartidos en 166 bloques de teoría, y las 166 filas de "práctica extra" aparecen en la lista.

Las cifras reales del cuaderno:

| | Preguntas |
|---|---|
| Quizzes de las lecciones (mini-quiz + quiz final) | 2.519 |
| Banco de práctica extra | 5.678 |
| **Total** | **8.197** |

Si estabas mirando aprendoenglish.com y no el preview, ahí además falta publicar: el sitio en vivo sigue con la versión anterior al banco, que es justo la de 211 filas.

## Qué voy a hacer

- Cambiar el contador para que sume **preguntas**, no filas: pasará a decir "0 de 8.197 ejercicios superados".
- Contar como superado lo que de verdad se respondió: las preguntas de cada quiz aprobado, y en las filas de práctica extra las preguntas efectivamente contestadas, no la fila entera. Hoy una fila de 39 ejercicios cuenta lo mismo que un quiz de 10.
- El contador de cada lección ("3/13") pasa a la misma lógica, para que no diga una cosa arriba y otra abajo.
- Dejar el subtítulo de cada fila como está (número de preguntas, y "tandas de 10" en las de práctica extra), que eso ya era correcto.
- Publicar al terminar, para que el sitio en vivo tenga el banco y el contador nuevo.

## Detalle técnico

- `src/assets/demo-app.html`: `practiceItems()` ya devuelve `qs` por fila; `renderPractice()` cambia de `items.length` a la suma de `qs`, y de `items.filter(q => q.done).length` a la suma de preguntas superadas.
- El progreso de las filas de banco hoy se guarda como un único flag `<blockId>-bank`. Para contar preguntas respondidas guardaré el número de ítems del banco completados por bloque en el mismo almacén de progreso, y la fila seguirá marcándose "Superado" con el mismo criterio de ahora.
- Sin cambios en `src/content/practice_bank_m*.js`, en el bundle del curso ni en la ruta de aprendizaje.
