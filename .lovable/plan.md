# La pantalla del quiz se queda en blanco

## Qué pasa

Ya está reproducido, no es una suposición: al pintar los ejercicios del banco de práctica, **1.319 de los 5.678 fallan con un error de JavaScript** y dejan la hoja vacía (solo se ve la barrita gris de arriba, como en tu captura).

Son todos los del tipo "encuentra el error" (`tap`) del banco: se generaron sin la línea de enunciado ("Toca la palabra incorrecta:"), que los del curso sí traen. Al intentar pintar ese texto inexistente, el pintado se corta a medias y no llega a dibujarse ni la pregunta ni el contador.

Como cada tanda saca 10 ejercicios al azar, basta con que caiga uno de esos para que la tanda muera en blanco — por eso pasa tan seguido.

## El arreglo

1. **Completar el enunciado que falta** en los ejercicios de "encuentra el error" del banco, para que digan lo mismo que los del curso.
2. **Que un ejercicio roto nunca deje la pantalla en blanco.** Aunque mañana llegue otro ítem incompleto, la app debe seguir en pie: si un ejercicio no se puede pintar, se registra el fallo, se salta al siguiente de la tanda y el alumno sigue practicando. Solo si ninguno de la tanda se puede pintar se cierra la hoja con un aviso claro.
3. **Blindar el pintado del texto** para que un campo vacío se muestre en blanco en vez de tumbar la pantalla.

## Detalles técnicos

- `src/assets/demo-app.html`:
  - `escapeHtml` tolera `null`/`undefined`.
  - `renderTap` usa un enunciado por defecto ("Toca la palabra incorrecta:") cuando `q.question` no viene.
  - `renderQuiz` envuelve el pintado en `try/catch`; al fallar, `console.error` con el id del ejercicio y devuelve `false`.
  - En `openPracticeQuiz` (y el mismo criterio en el mini-quiz y el quiz final de la ruta) `step()` salta al siguiente ejercicio cuando el pintado devuelve `false`, sin contarlo como fallo del alumno; si se acaba la tanda sin poder pintar nada, se cierra la hoja con un aviso.
  - `applyTokens` / la carga del banco normaliza los ítems `tap` añadiendo el enunciado, para que también queden bien los que ya estén cacheados.
- Los archivos `src/content/practice_bank_m*.js` se corrigen en el origen: se añade `question` a los 1.319 ítems `tap`.
- Verificación en navegador: recorrer los ejercicios del banco de todas las lecciones pintándolos uno a uno y comprobar que ya no queda ninguno vacío (hoy salen 52 en la primera lección revisada), más una tanda real abierta desde la biblioteca.
