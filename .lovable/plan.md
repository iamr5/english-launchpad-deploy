# Práctica: carga bajo demanda, biblioteca de quizzes y corrector con variantes

Tres problemas, tres arreglos, aplicados a todos los demos (comparten `demo-app.html`).

## 1. La pantalla se queda en blanco: se descarga todo el banco de golpe

Hoy la app pide en el primer arranque el curso + el test de ubicación + **los 5.678 ejercicios del banco** en una sola respuesta (~2 MB). Eso es lo que congela/blanquea la pantalla.

Cambio: el banco deja de viajar al inicio.

- El arranque trae sólo curso, test y un **índice ligero** del banco (id de teoría → cuántos ejercicios tiene). Con eso ya se pintan los totales sin descargar nada.
- Los ejercicios de un grupo se piden cuando el usuario abre esa tanda, no antes; una vez pedidos quedan en memoria para esa sesión.
- Mientras llega la tanda se muestra un estado de carga corto, nunca una pantalla en blanco.

## 2. El contador y la navegación de la pestaña Práctica

- Texto corregido: **"377 quizzes · 8.197 ejercicios para practicar cuanto quieras"**, y debajo el avance real ("llevas X ejercicios superados").
- La lista larga de todas las lecciones se reemplaza por una **biblioteca**: una rejilla de tarjetas tipo "libro", una por lección/nivel, con su color de módulo, nombre, nivel (A1, A2, B1…), número de quizzes y ejercicios, y un anillo o barra de progreso.
- Al tocar una tarjeta se abre esa "estantería": progreso del grupo arriba (ejercicios superados / totales, quizzes completados) y la lista de sus quizzes con botón para practicar. Volver atrás regresa a la biblioteca.
- Filtro rápido por nivel/módulo y una fila de "Continuar donde ibas" arriba.

## 3. El corrector rechaza formas correctas de decir lo mismo

Los ejercicios de escritura hoy suelen tener **una sola** respuesta aceptada (952 de 1.161 en el primer archivo del banco), por eso "worldwide bees are going extinct" salió mal.

- Se amplía cada ejercicio de escritura del banco y del curso a **mínimo 3 respuestas aceptadas** (orden del adverbio, sinónimos naturales, contracciones, variantes GB/US), generadas con el mismo proceso de IA + revisión que se usó para crear el banco, y validadas para que ninguna variante cambie el punto gramatical que la lección enseña.
- El corrector, además, acepta reordenar el adverbio inicial/final cuando ambas posiciones son válidas.
- Cuando la respuesta es correcta pero distinta a la principal, en vez de marcarla mal se aprueba y se muestra "también válido: …".

## Detalles técnicos

- `src/routes/api/course/bundle.ts`: devuelve `practiceIndex` (conteos) en lugar de `practice`.
- Nuevo `src/routes/api/course/practice.ts`: mismo pase/token y límite por IP, recibe uno o varios ids de bloque y devuelve sólo esos ejercicios.
- `src/lib/course-data.server.ts`: añade `getPracticeIndex()` y `getPracticeFor(ids)`.
- `src/assets/demo-app.html`: `attachPracticeBank` pasa a trabajar con conteos; `openPracticeQuiz` hace `await` de la tanda; `renderPractice` se reescribe como biblioteca + vista de grupo; contadores con el formato nuevo.
- Script de generación de variantes bajo `/tmp` que reescribe `accepted` en `src/content/practice_bank_m*.js` y en los ejercicios de escritura de `src/content/data*.js`.
- Verificación en navegador: tiempo hasta pintar la pestaña Práctica, tanda que carga bajo demanda, y un caso de escritura con variante alternativa aceptada.
