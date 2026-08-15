# Dosier del Colegio de Ingenieros en /silabo-cip

Publicar el dosier recién subido en `aprendoenglish.com/silabo-cip`, con las cifras reales del curso y con los demos reales del CIP incrustados (mismas reglas que `/silabo-autonoma`).

## 1. Publicación

- Guardar el HTML subido como asset del proyecto (`src/assets/silabo-cip.html`).
- Crear la ruta `/silabo-cip` con el mismo patrón que `/silabo-autonoma`: favicon `head.png` y metadatos de vista previa social (Open Graph + Twitter) con título/descripción propios del CIP.

## 2. Corrección de datos

El dosier subido trae cifras antiguas que hay que reemplazar por las reales del curso (las mismas verificadas para `/silabo-autonoma`). Antes de escribir, se recuentan contra el contenido real (`src/content/*`) para confirmar:

| Dice el dosier | Debe decir |
| --- | --- |
| 48 microlecciones | 45 lecciones (391 partes) |
| 7 200 ejercicios | 8 127 ejercicios |
| 8 000 palabras | 11 040 palabras (+ 779 términos de ingeniería) |
| 150 ejercicios por microlección / 1 800 por formato | valores recalculados sobre las cifras reales |
| sin dato de horas | ≈145 h de volumen disponible |

Se revisan todas las apariciones: badge del hero, píldora de prueba, índice, ficha de "Extensión", muro de métricas y cualquier texto corrido que repita esos números. También se ajusta la fecha de "Actualización" a agosto de 2026.

## 3. Demos reales (regla de /silabo-autonoma)

La sección de previsualización actual es una maqueta dibujada en HTML/CSS. Se reemplaza por los demos reales, igual que en el sílabo de la Autónoma:

- Previsualizador web: iframe a `/democip`.
- Previsualizador app (marco de teléfono): iframe a `/democip`.
- Panel del profesor: iframe a `/democip/dashboard`.
- Cada uno con botones "Ampliar" (modal a pantalla completa) y "Abrir ↗" (pestaña nueva), y la barra de navegador mostrando la URL real.
- Carga diferida con IntersectionObserver: el iframe solo se carga al entrar en pantalla, para que la bienvenida de marca del CIP se vea al llegar ahí y no antes.
- Alturas y comportamiento responsive copiados del sílabo de la Autónoma (recorte corregido, sin scroll interno cortado).

## Detalle técnico

- `src/assets/silabo-cip.html` (asset editable, no pointer de CDN, porque hay que transformarlo).
- `src/routes/silabo-cip.tsx`: handler `GET` que inyecta `headTags` en `<head>` y devuelve `text/html`.
- Se reutilizan las clases `.device-stage`, `.device-shell`, `.demo-screen.live-embed`, `.phone-bezel`, `.demo-modal` y el script de modal + IntersectionObserver del sílabo de la Autónoma.
- Verificación final con capturas en móvil y escritorio, comprobando que los tres iframes cargan al hacer scroll.
