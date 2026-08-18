# Presentación UE Isabel La Católica

Mismo tratamiento que AJE, BCP, La Tinka, Repsol, Movistar y NUAM.

## Qué se hace

1. **Subir la presentación al CDN** (~26 MB). El binario no queda en el repo: solo el puntero `src/assets/presentacion-ue-isabel-la-catolica.html.asset.json`.
2. **Nueva ruta `/presentacion-ue-isabel-la-catolica`** que sirve ese archivo en streaming, con favicon `head.png` y preview social (Open Graph + Twitter) con el nombre del colegio.
3. **Mascota del demo en vez de Boti.** El demo `demo-isabel-la-catolica` ya existe y usa la mascota "arianna"; se lee su configuración al servir la página, así que si la cambias en `/demos` la presentación se actualiza sola. El HTML tiene los tres huecos `#boti-host` (portada, slide guía y cierre).
4. **CTA del penúltimo slide.** Hoy es el único `href="#"` del archivo; se apunta a `https://www.aprendoenglish.com/demo-isabel-la-catolica` sin reeditar ni volver a subir el HTML.
5. **Verificación en navegador**: la página carga, el CTA lleva al demo y la mascota aparece en los tres slides.

## Detalle técnico

- `lovable-assets create --file /mnt/user-uploads/presentacion-ue-isabel-la-catolica-entregable.html --filename presentacion-ue-isabel-la-catolica.html` → puntero en `src/assets/`.
- `src/routes/presentacion-ue-isabel-la-catolica.tsx`, copiando `presentacion-nuam.tsx`: `servePresentacion({ assetUrl, requestUrl, headTags, extraHead: await mascotaDelDemo("demo-isabel-la-catolica") })`.
- `headTags`: `link rel=icon /head.png`, `og:title/description/type/url/image` (+ `social-preview.jpg`, 1200x630) y `twitter:card summary_large_image`, con el nombre del colegio.
- CTA: script corto dentro de `headTags` que, al cargar, reemplaza el `href="#"` del CTA por la URL del demo (el archivo se sirve en streaming, no se modifica en disco).
- Añadir `presentacion-ue-isabel-la-catolica` a `RESERVED_SLUGS` en `src/lib/demo-config.ts` para que nadie cree un demo con ese slug.
