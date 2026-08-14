# Ajustar el claim de /cip y cambiar los íconos

## 1. El claim del héroe

Hoy el titular dice "Habla inglés en 1 año, quince minutos al día" sin nada que lo sustente.

- Se calcula el tiempo real del curso a partir del contenido que ya existe (45 microlecciones A1–C1, 377 quizzes, 8.127 ejercicios, 11.040 palabras con 779 de ingeniería), usando tiempos por ítem medidos en la propia app (lectura de lección, respuesta de ejercicio, tanda de vocabulario).
- Se mantiene "1 año" y se ajustan los minutos diarios al número que sale de ese cálculo, redondeado a un valor honesto y fácil de decir (p. ej. 20, 25 o 30 min/día según el resultado).
- Debajo del titular se añade una línea corta que sostiene la promesa, con la cuenta explícita: horas totales del curso ÷ días de estudio al año.
- Si el mismo claim aparece en otras partes de la landing (bloque de beneficios "15 minutos al día", cierre, metadatos/og:description), se actualiza al mismo número para que no haya dos cifras distintas.

## 2. Íconos con el estilo de la app

Los cuatro beneficios usan íconos genéricos (reloj, engranaje, diana, barras). Se reemplazan por los íconos ilustrados del onboarding, de la misma familia visual que Boti:

- Tiempo diario → `ob-thunder.svg`
- Inglés técnico → `ob-words.svg`
- Empiezas en tu nivel → `ob-goal.svg`
- Progreso medible → `streak.svg`

Mismo tamaño y encuadre en todas las fichas, con espacio reservado para que no salte el layout.

## Detalles técnicos

- Cambios sólo en `src/routes/cip.tsx`: constantes `BENEFITS`/`METRICS`, el bloque `Hero` y el `head()` si la descripción menciona los minutos.
- Los SVG ya están en `public/demo-assets/`; no se crean assets nuevos.
- No se toca la lógica de preinscripción ni el demo embebido.
