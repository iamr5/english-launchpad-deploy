# Sílabo Autónoma: mascota, datos reales y menos repetición

Ajustes sobre `/silabo-autonoma` en cuatro frentes: traer a Nomi, reemplazar el campo "Versión", eliminar secciones redundantes y actualizar las cifras.

## 1. Mascota de la Autónoma (Nomi)

El demo de la Autónoma ya usa una mascota propia: **Nomi, la llamita** (polo naranja, lentes), guardada en la configuración del demo `demoautonoma`. Hoy el sílabo no la muestra en ningún lado.

- Incluir a Nomi de cuerpo completo en la portada, junto al standfirst, con la misma paleta navy/crema del documento.
- Reutilizarla en pequeño (solo la cabeza) como marca de sección en el bloque del demo, para conectar visualmente documento y producto.
- Se toma la mascota del propio demo (mismas capas y colores), no una ilustración nueva, para que coincida exactamente con lo que verá el alumno.

## 2. Campo "Versión" de la ficha de portada

Reemplazar `Versión — Sílabo vigente / Agosto de 2026` por:

- Etiqueta: **Actualización**
- Contenido: **Revisión de agosto de 2026** — "El sílabo se actualiza según los descriptores vigentes de Cambridge English / MCER y los pedidos de la Coordinación de Inglés."

Así el campo comunica un proceso vivo en lugar de un número de versión.

## 3. Redundancia: qué se elimina y qué se conserva

Hoy hay cuatro bloques que dicen variantes de "esto es serio, revisable y ya existe":

| Bloque | Decisión |
|---|---|
| 01 · Lo que la Coordinación puede poner en marcha | **Se conserva.** Es el único que habla de oportunidad institucional y de los tres actores. |
| 02 · Una estructura académica visible y revisable | **Se fusiona.** Sus seis principios pedagógicos (carga cognitiva, currículo en espiral, contraste, atención a la forma, transferencia del español, forma→función) son lo verdaderamente nuevo y se quedan; se elimina su encabezado y su bandeja de "checks" (progresión MCER, etc.), que repiten la portada. El bloque pasa a titularse por su aporte real: los criterios con los que está escrito el contenido. |
| 04 · El contenido no es una promesa: A1 a C1 ya está construido | **Se conserva** como el bloque de evidencia (el sílabo desplegable por nivel es el dato duro). |
| 05 · Un alineamiento que el equipo académico puede revisar de un vistazo | **Se conserva pero se reencuadra** como anexo de mapeo MCER ↔ Cambridge, sin volver a argumentar que "es revisable"; el argumento ya está hecho, aquí solo se muestra la tabla. |

Criterio general: cada sección debe aportar información nueva; la insistencia en la credibilidad se sostiene con datos (sílabo desplegable, tabla de mapeo, cifras), no con afirmaciones repetidas. Se eliminan también las repeticiones de la píldora "48 microlecciones · 7 200 ejercicios · ≈130 h", que hoy aparece tres veces; queda una sola vez en la ficha de portada y una vez en el bloque de volumen.

## 4. Cifras actualizadas y honestas sobre las horas

Las cifras del documento (7 200 ejercicios, 1 800 por formato, ≈130 h) quedaron congeladas y ya no coinciden con el curso actual: solo el banco de práctica creció muy por encima de esa cifra, sin contar los ejercicios dentro de las lecciones ni el vocabulario.

- Recalcular los totales reales directamente del contenido del curso: ejercicios dentro de las microlecciones, banco de práctica por formato, palabras de vocabulario y número de microlecciones/módulos.
- Actualizar con esas cifras: ficha de portada, índice, bloque de volumen, bloque de tipología (los cuatro formatos) y las etiquetas por nivel.
- Recalcular las horas con el mismo tiempo medio por ejercicio y presentarlas como **rango de práctica disponible**, no como carga obligatoria. Nota explícita junto a la cifra: es el volumen total disponible; el alumno avanza según su nivel y su meta diaria (p. ej. 20 min/día), y no necesita completar todo el banco para llegar al siguiente nivel.

## Detalle técnico

- Archivo principal: `src/assets/silabo-autonoma.html` (documento estático servido por su ruta).
- Mascota: se lee la configuración del demo `demoautonoma` y se incrusta el SVG de capas de Nomi con sus tokens de color, igual que hace `mascot-runtime.js`, para que el HTML siga siendo autocontenido e imprimible.
- Cifras: script de conteo sobre `src/content/data*.js`, `src/content/practice_bank*.js` y `src/content/vocab` para obtener los números exactos antes de escribirlos en el HTML.
- No se toca el bloque de previsualización del demo ni la sección del docente.
