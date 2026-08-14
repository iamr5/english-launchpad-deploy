# Banco de quizzes: llegar a 1.800 por tipo

## Los cuatro tipos (confirmados en el código)

| Tipo | Constructor | Qué hace el alumno | Hoy | Faltan |
|---|---|---|---|---|
| Opción múltiple (`mc`) | `mc(pregunta, opciones, correcta, skill)` | Elige 1 de 4 (incluye los de *reading*, `skill:'reading'`) | 1.399 | +401 |
| Detección de error (`tap`) | `tap(pregunta, tokens, índiceError, corrección)` | Toca la palabra incorrecta | 638 | +1.162 |
| Escucha y reconstruye (`rebuild`) | `rebuild(pregunta, frase, bloques)` | Rearma la frase con bloques + distractores fonéticos | 320 | +1.480 |
| Escritura libre (`writing`) | `writing(pregunta, aceptadas, {hint, reject, strict})` | Escribe la respuesta; corrector tolerante | 162 | +1.638 |

Total nuevo objetivo: **4.681 ítems**, repartidos sobre los 166 bloques de teoría de los módulos 1-5.

## Dónde viven (banco + rotación)

Los ítems nuevos NO se meten al `miniQuiz` de cada bloque (alargaría las lecciones a ~44 ejercicios). Van a un **banco por bloque**:

- Archivos nuevos `src/content/practice_bank*.js`, un objeto `{ [blockId]: { mc:[], tap:[], rebuild:[], writing:[] } }`, cargados por el mismo plugin `virtual:course-content` de `vite.config.ts`.
- La lección sigue mostrando un `miniQuiz` corto: los ítems fijos actuales + N tomados al azar del banco de ese bloque (semilla por intento, así el repaso no repite).
- La pestaña **Práctica** (workbook abierto) consume el banco completo, filtrable por tipo y por módulo.

## Cómo se generan (calidad)

Cada ítem se genera **desde el bloque de teoría inmediatamente superior**, no del tema en general, siguiendo `src/content/AUTHORING-reading-writing.md`:

- Distractores plausibles = errores reales del hispanohablante (calco, 3.ª persona, orden adjetivo-sustantivo, *do/does*), nunca opciones absurdas.
- Vocabulario limitado al nivel MCER del módulo (A1→C1) y al registro profesional del curso.
- `writing`: `accepted[0]` canónico y bien puntuado, variantes reales solo donde el corrector no expande la contracción (`won't`, `she'll`, …), y `reject` con motivo concreto.
- `rebuild`: distractores fonéticos, no aleatorios (*tired / tied / hired*).
- `tap`: una sola palabra errónea, índice correcto, corrección exacta.
- Nada de preguntas metalingüísticas largas en español (prohibido por §5.0 del spec).

Generación con el AI Gateway en lotes por microlección (prompt que incluye el markdown del bloque, el nivel, los ítems ya existentes para evitar duplicados y las reglas del spec).

## Ciclo de revisión (2 rondas, como pediste)

1. **Ronda 1** — Genero los 4.681 candidatos a un archivo de revisión (`/mnt/documents/quizzes-ronda1.json`): un ítem por línea con su `blockId`, tipo, nivel y el texto del bloque fuente.
2. **Revisor** — Un subagente con rol de *profesor especialista en enseñanza de inglés para hispanohablantes según el MCER* puntúa cada ítem 1-5 en: corrección lingüística, alineación con el bloque fuente, nivel MCER adecuado, calidad de distractores y claridad del enunciado. Devuelve feedback agregado (patrones de error) además de la nota por ítem.
3. **Corte** — Pasan los de **nota media ≥ 4 sin ninguna dimensión en 1-2**. Los aprobados se escriben al banco.
4. **Ronda 2** — Con el feedback del revisor incorporado al prompt, regenero solo los rechazados y el faltante para llegar a 1.800 por tipo; el revisor los evalúa igual y los aprobados se suman.
5. Te reporto **cuántos pasaron el umbral en cada ronda y el total final por tipo**. Sin tercera ronda: si queda déficit, te digo cuánto y por qué.

## Validación automática (antes del revisor)

Script que descarta candidatos rotos sin gastar revisión: sintaxis JS válida, `correctIndex` en rango, 4 opciones únicas, `errorTokenIndex` dentro de los tokens, `correctSentence` reconstruible con los `wordBlocks`, frase no duplicada en todo el curso, y longitud dentro de rango.

## Archivos que se tocan

- Nuevos: `src/content/practice_bank_m1m2.js`, `_m3.js`, `_m4.js`, `_m5.js`.
- `vite.config.ts`: el plugin `virtual:course-content` evalúa también los bancos.
- `src/lib/course-data.server.ts`: expone `getPracticeBank()` / lo adjunta al índice.
- `src/assets/demo-app.html`: el `miniQuiz` muestrea del banco y la pestaña Práctica lista el banco completo con filtro por tipo.
- Scripts de generación/validación bajo `/tmp` (no entran al repo).

## Nota

No se toca ningún ítem existente ni `placement_items.js`; solo se agrega.
