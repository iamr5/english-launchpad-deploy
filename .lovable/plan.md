# Tipografía y color de letra en el panel de demos

En `/demos` aparece un bloque nuevo, **Tipografía**, junto al de colores. Ahí se elige la fuente del demo y el color del texto.

## Fuentes

Dos desplegables, cada uno con la misma lista curada de Google Fonts:

- **Fuente de la interfaz** — títulos, botones, mapa, cabecera (hoy es la redondeada del sistema).
- **Fuente de lectura** — párrafos y tablas dentro de las lecciones (hoy Inter).

Lista: Sistema (por defecto, sin descarga), Nunito, Baloo 2, Quicksand, Poppins, Montserrat, Inter, Rubik, Fredoka, Outfit, Work Sans, Lora, Merriweather.

Cada opción se previsualiza con su propia letra en el desplegable. Si se deja "Sistema", el demo se comporta exactamente como hoy y no carga nada externo.

## Color de letra

Tres campos de color (con Hex, igual que el resto del panel):

- **Texto principal** — títulos y párrafos.
- **Texto secundario** — subtítulos y textos apagados.
- **Texto de la cabecera** — el rótulo/marca de la barra superior, que va sobre el color de acento y a veces necesita su propio tono.

Cualquiera vacío conserva el valor actual del demo, así que los demos ya publicados no cambian.

Todo esto se refleja en el previo del panel al instante y en el demo publicado al guardar.

## Detalles técnicos

- `src/lib/demo-config.ts`: nuevo bloque `type.uiFont?`, `type.bodyFont?` (ids de la lista) y colores `colors.ink?`, `colors.muted?`, `colors.header?`. Se exporta `DEMO_FONTS` (id, nombre, familia CSS, `googleFamily`) para que panel y plantilla usen la misma lista.
- `src/lib/demo-page.ts`:
  - `themeCSS()` añade `--font-round`, `--font-body`, `--ink`, `--muted`/`--muted2` y `--brand-ink` cuando estén definidos.
  - Nueva función que emite el `<link rel="stylesheet">` a `fonts.googleapis.com` con las familias elegidas (una sola petición combinada, `display=swap`), inyectada en el `<head>` antes del `<style id="demo-theme">`. Sin fuentes elegidas no se emite nada.
- `src/assets/demo-app.html`: la cabecera usa hoy color fijo; se cambia a `var(--brand-ink, currentColor)` en `.brand`/appbar. El resto ya lee `--ink`, `--muted`, `--muted2`, `--font-round`, `--font-body`.
- `src/routes/_authenticated/demos.tsx`:
  - Nueva sección "Tipografía" con dos `select` (opciones renderizadas con su propia `font-family`) y tres `ColorField`.
  - El previo embebido carga las mismas fuentes vía `<link>` en el documento del panel y aplica las mismas variables, para que lo que se ve coincida con el demo.
