# Segunda vuelta del banco de ejercicios

Estado confirmado tras la ronda 1: se generaron 6.474 ítems y 5.709 pasaron la validación estructural (`/tmp/qz/ronda1_valid.json`). El revisor MCER está escrito (`/tmp/qz/review.py`) pero todavía no se ha ejecutado, y aún no existe ningún archivo `src/content/practice_bank_m*.js`.

## Qué hace esta vuelta

1. **Revisión MCER de la ronda 1**
   Un profesor examinador (IA especializada) puntúa cada ítem de 1 a 5 en cinco dimensiones: corrección lingüística, fidelidad al bloque de teoría, nivel MCER, calidad de los distractores y claridad. Pasa el ítem con promedio ≥ 4 y ninguna dimensión por debajo de 3. Los rechazados guardan la dimensión más floja y una nota corta.

2. **Ronda 2: regeneración de lo rechazado**
   Se vuelven a generar solo los ítems que no pasaron, alimentando al generador con la nota del revisor y con la dimensión que falló, para que corrija ese punto concreto. También se cubre el déficit que quede por tipo respecto de la meta de 1.800.

3. **Segunda revisión**
   Los ítems de la ronda 2 pasan por el mismo revisor con el mismo listón. Lo que no pase en esta segunda pasada se descarta; no habrá tercera ronda, tal como acordamos.

4. **Escritura del banco**
   Los ítems aceptados de ambas rondas se escriben en `src/content/practice_bank_m1m2.js`, `practice_bank_m3.js`, `practice_bank_m4.js` y `practice_bank_m5.js`, indexados por id de bloque de teoría (`window.PRACTICE_BANK`).

5. **Verificación en el demo**
   Se comprueba en el navegador que la pestaña Práctica muestra la "práctica extra" por teoría, que una tanda se responde de principio a fin y que la ruta y los mini-quizzes de la lección siguen intactos.

## Reporte final

Conteo final por tipo (opción múltiple, detección de error, escucha y reconstruye, escritura libre), cuántos entraron por ronda, cuántos rechazó el revisor y por qué motivo dominante.

## Detalle técnico

- El cableado ya está hecho y no cambia: `/api/course/bundle` devuelve `practice`, el plugin `virtual:course-content` de `vite.config.ts` lee los cuatro archivos del banco, y `src/assets/demo-app.html` los cuelga de cada bloque como `practiceBank` sirviendo tandas de 10.
- Los ítems del banco no desbloquean ni bloquean la ruta: se marcan con la clave `<blockId>-bank`, aparte del mini-quiz de la lección.
- La validación estructural (duplicados, tokens vacíos, índices fuera de rango, correcciones mal formadas) se aplica también a la ronda 2 antes de la revisión.
