# Sílabo v9: reemplazo en /silabo-autonoma y nueva versión /silabo-cip

## Qué se hace

1. **/silabo-autonoma** pasa a servir el documento v9 que subiste, limpio (sin la barra roja de "control de cambios" ni los resaltados de revisión interna).
2. Se vuelven a colocar los **demos reales embebidos** donde el v9 trae maquetas estáticas: web del alumno, móvil del alumno y panel docente, cada uno cargando sólo al llegar con el scroll (para que el splash se vea ahí y no antes) y con botón para abrirlo en grande.
3. Se **corrigen las cifras** del documento con los datos reales del producto actual.
4. Se crea **/silabo-cip**, el mismo dosier con identidad e información del Colegio de Ingenieros del Perú y con los demos `/democip` y `/demo-dashboard`.

## Cifras que se corrigen

Las que hoy aparecen en el documento son estimados antiguos (7 200 ejercicios, 1 800 por formato, 8 000 palabras, conteos por nivel). Se reemplazan por los reales, recontados desde el contenido del curso antes de escribirlos:

- Ejercicios de la ruta y del banco de práctica: total real y desglose por los cuatro formatos (opción múltiple, detección de error, reconstrucción/escucha, escritura).
- Microlecciones por nivel y ejercicios por nivel: recuento real A1–C1, con el total de microlecciones ajustado.
- Banco de vocabulario: 7 550 palabras del banco general y 11 040 sumando los packs especializados, organizadas en temas con examen propio cada diez palabras.
- Frases derivadas ("ejercicios por microlección", "ejercicios por tramo", horas de práctica por ciclo) se recalculan para que sean coherentes con los totales nuevos.

Si algún número real queda por debajo de lo que promete el texto, se ajusta la redacción en vez de inflar la cifra.

## Versión CIP

- Textos: "Universidad Autónoma del Perú" → "Colegio de Ingenieros del Perú", coordinación académica → el área que corresponda al Colegio, y los ejemplos de uso pasan de ciclo universitario a colegiados/capítulos.
- Identidad visual tomada del demo `/democip`: paleta, logo y mascota del CIP en portada, cabeceras y bloques destacados.
- Se destaca el **pack de vocabulario de ingeniería** (términos de matemáticas, programación, construcción, etc.) como contenido incluido, con su recuento real de palabras.
- Demos embebidos: `/democip` (web y móvil del alumno) y `/demo-dashboard` (panel docente).
- CTA final apuntando al demo del CIP.

## Detalles técnicos

- `src/assets/silabo-autonoma.html` se reemplaza por el v9 subido, con la vista de control de cambios eliminada (barra `.chg-bar`, bloques `.chg` y marcas `.chg-i`) y con el bloque de previsualización cambiado a `iframe.live[data-src]` + `IntersectionObserver`, reutilizando el CSS `.live-embed` y el modal de expansión que ya funcionaban en la versión anterior.
- Nuevo `src/assets/silabo-cip.html` derivado del mismo v9 con la copia y los tokens de color/logo del CIP.
- Nueva ruta `src/routes/silabo-cip.tsx` con el mismo patrón que `silabo-autonoma.tsx`: handler `GET` que devuelve el HTML con favicon `head.png` y meta de Open Graph/Twitter propias del CIP.
- Verificación con navegador headless en ambas rutas: que los tres iframes carguen al hacer scroll, sin recortes, y captura de las secciones de cifras.
