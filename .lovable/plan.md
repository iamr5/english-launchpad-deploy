# Ajustes en /cip y corrección del conteo de lecciones

## 1. Banda de cifras (la imagen 1)

Hoy son cuatro números sueltos sobre fondo crema. Se rehace como cuatro fichas con icono ilustrado arriba (misma familia de Boti, ya en `public/demo-assets/`):

- Lecciones y partes → `ob-books.svg`
- Ejercicios de práctica → `ob-thunder.svg`
- Palabras de vocabulario → `ob-words.svg`
- Términos de ingeniería → `ob-work.svg`

Cada ficha: tarjeta blanca con borde suave, icono 40 px, número en Archivo Black y etiqueta debajo. En móvil, dos columnas (hoy se aprietan en una fila); en escritorio, cuatro.

Además el primer dato cambia (ver punto 5): en lugar de "45 microlecciones" pasa a mostrar las partes reales.

## 2. Chip "Incluye inglés técnico"

Pasa a decir **"Incluye inglés técnico por especialidad"** y se destaca del resto: fondo con el color de acento del CIP, texto blanco, borde más marcado, un punto/estrella delante y una animación suave de pulso. Los demás chips quedan como están.

## 3. Aviso bajo el formulario

"Sin costo y sin compromiso. Sólo usamos tu correo para avisarte si el programa se activa." deja de ser una línea gris pequeña: se convierte en una tarjeta propia, con icono de candado/escudo, texto centrado y alineado verticalmente con el icono, y un brillo (shimmer) que recorre la tarjeta cada pocos segundos. Se respeta `prefers-reduced-motion`. Aparece igual en el formulario del héroe y en el del cierre.

## 4. Punto de corrección de escritura (sin mencionar IA)

Se reemplaza por:

- **Título**: "Escritura corregida al instante"
- **Texto**: "Reconoce las distintas formas correctas de decir lo mismo: si tu frase está bien construida, cuenta como bien, aunque no sea palabra por palabra la del ejemplo."

## 5. Conteo real de lecciones (en /cip y /silabo-autonoma)

Verificado en el contenido del curso: hay 45 lecciones (A1 10, A2 12, B1 8, B2 8, C1 7) y **391 partes de lección** repartidas entre ellas (título, misión, teoría, resumen, cierre, etc.).

Cambio de redacción en ambos sitios:

- "45 microlecciones" → **"391 partes de lección"** como cifra grande, con "en 45 lecciones A1 → C1" como etiqueta.
- En `/silabo-autonoma`, donde hoy dice "45 microlecciones" (portada, índice, resumen, fichas por nivel y cierre) se usa "45 lecciones · 391 partes"; las fichas por nivel pasan a "10 lecciones" en vez de "10 microlecciones", conservando su conteo de ejercicios.
- Se actualizan también las descripciones de metadatos de ambas rutas donde aparezca la cifra.

## 6. Móvil

Revisión de toda la landing a 360–414 px: fichas de cifras en dos columnas, chips que envuelven sin cortarse, tarjeta del aviso a ancho completo, botones y campos de al menos 44 px de alto, y ningún desbordamiento horizontal. Verificación con capturas en móvil y escritorio.

## Detalle técnico

- Cambios en `src/routes/cip.tsx` (constantes `METRICS`, `BADGES`, `TECH`, componentes `EmailForm` y la banda de métricas, más CSS embebido para el chip destacado y el shimmer).
- Cambios de texto en `src/assets/silabo-autonoma.html` y en el `head()` de `src/routes/silabo-autonoma.tsx`.
- No se toca la lógica de preinscripción, el demo embebido ni `demo-app.html`.
