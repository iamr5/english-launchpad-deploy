# Fuente y color para los textos de marca del demo

Hoy la tipografía es global (fuente de interfaz y de lectura) y el color de cabecera es un color suelto. Falta lo concreto: poder darle su propia letra y su propio color a los textos que se escriben en **Marca** y en **Bienvenida**.

## Marca

Junto al campo **Texto de la cabecera** aparecen dos controles nuevos:

- **Fuente del rótulo** — la misma lista curada de fuentes, con vista previa de cada letra. Vacío = hereda la fuente de interfaz (comportamiento actual).
- **Color del rótulo** — ya existe como "Texto de la cabecera" en Colores; se muestra también aquí para tenerlo al lado del texto que afecta. Es el mismo valor, no uno nuevo.

Sólo afecta al texto escrito de la cabecera; si el demo usa logo en vez de texto, no cambia nada.

## Bienvenida

Dos bloques nuevos, cada uno con su fuente y su color:

- **Rótulo** (el texto grande que sale cuando no hay logo de bienvenida): fuente + color. Hoy es siempre blanco con la fuente de interfaz.
- **Frase**: fuente + color. Hoy es siempre blanco al 90%.

Cualquiera vacío mantiene exactamente el aspecto de hoy, así que los demos ya publicados no cambian.

Todo se ve al instante en el previo del panel y en el demo al guardar.

## Detalles técnicos

- `src/lib/demo-config.ts`: nuevos campos `brand.headerFont?`, `splash.titleFont?`, `splash.titleColor?`, `splash.phraseFont?`, `splash.phraseColor?` (ids de `DEMO_FONTS` y hex).
- `src/lib/demo-page.ts`:
  - `themeCSS()` emite `--brand-font`, `--sp-word-font`, `--sp-word-ink`, `--sp-phrase-font`, `--sp-phrase-ink` sólo cuando están definidos.
  - `fontsHref()` recibe además `brand.headerFont`, `splash.titleFont` y `splash.phraseFont` para que la petición combinada a Google Fonts las incluya.
- `public/demo-assets/splash.css`: `.sp-word` usa `font-family: var(--sp-word-font, var(--font-round))` y `color: var(--sp-word-ink, #fff)`; `.sp-phrase` usa `var(--sp-phrase-font, inherit)` y `var(--sp-phrase-ink, rgba(255,255,255,.9))`.
- `src/assets/demo-app.html`: `.brand` pasa a `font-family: var(--brand-font, var(--font-round))`; el color ya sale de `--brand-ink`.
- `src/routes/_authenticated/demos.tsx`:
  - Pestaña **Marca**: `FontField` + `ColorField` (enlazado a `colors.header`) debajo de "Texto de la cabecera".
  - Pestaña **Bienvenida**: `FontField`+`ColorField` para rótulo y para frase, junto a los campos existentes.
  - El previo embebido añade estas fuentes a su `<link>` de Google Fonts y aplica las mismas variables CSS al contenedor del previo.
