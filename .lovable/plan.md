## Diagnóstico

Los meta tags de Open Graph y la imagen (`https://aprendoenglish.com/head.png`, 144 KB, 376×333) ya están publicados y accesibles. WhatsApp no muestra la vista previa por dos razones concretas:

1. **Faltan `og:image:width`, `og:image:height` y `og:image:type`.** WhatsApp exige estas tres metaetiquetas para renderizar la tarjeta grande; sin ellas suele omitir la preview.
2. **La imagen `head.png` es cuadrada y pequeña.** Aunque cumple el mínimo (≥300×200), WhatsApp prefiere una imagen apaisada tipo 1200×630 para la tarjeta grande.

Adicionalmente, WhatsApp cachea el preview por URL — una vez que sale mal, no se refresca hasta que la URL cambia o pasan varios días.

## Plan

1. **Generar una imagen de social preview** (1200×630 JPG, <300 KB), con el oso de marca sobre un fondo con el nombre y tagline de AprendoEnglish. Se guarda en `public/social-preview.jpg`.
2. **Actualizar los 4 HTML** (`landing.html`, `presentacion.html`, `presentation.html`, `demo-index.html`) para:
   - apuntar `og:image` y `twitter:image` a `https://aprendoenglish.com/social-preview.jpg`
   - añadir `og:image:width` (1200), `og:image:height` (630), `og:image:type` (image/jpeg) y `og:image:alt`
3. **Mantener `head.png` como favicon** (sin cambios en ese uso).
4. **Instrucciones al usuario:** re-publicar y, para saltarse el caché de WhatsApp durante la prueba, compartir el link con un parámetro nuevo (p.ej. `https://aprendoenglish.com/?v=2`). En un chat nuevo con la URL limpia también reintenta el scrape.

## Detalles técnicos

- La imagen se inyecta editando el `<head>` de cada HTML servido crudo por los route handlers (mismo mecanismo usado hoy para los meta tags).
- No se toca el flujo de TanStack `head()` porque estas rutas devuelven HTML crudo por `Response`.
- No hay cambios en rutas ni en lógica de servidor.