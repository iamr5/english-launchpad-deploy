# Cambiar el color de los SVG subidos, en el propio panel

Hoy un archivo subido se usa tal cual: si el logo o el icono vienen en un color que no encaja con la marca del demo, hay que volver a exportarlo fuera. Para los `.svg` eso se puede hacer aquí mismo.

## Qué aparece

Cuando el archivo del campo es un `.svg` (recién subido o ya guardado), debajo de la miniatura aparece una fila nueva: **Color del SVG**.

- Se leen los colores que realmente usa el dibujo y se muestra una muestrita por cada uno (máximo 8).
- Tocar una muestra abre el selector de color del sistema y también acepta Hex escrito o pegado, igual que el resto de campos de color del panel.
- Un botón **Todo de un color** tiñe el dibujo entero con un solo color (lo habitual en logos e iconos de una tinta).
- **Restablecer** vuelve a los colores originales del archivo subido.

Al confirmar, se genera una copia recoloreada del SVG, se sube y el campo pasa a apuntar a ella. El archivo original se conserva, así que "Restablecer" siempre funciona y los demos ya publicados no cambian solos.

Aplica a todos los campos de imagen del panel: logo de cabecera, icono de la barra, marca de agua, logo de bienvenida, iconos de racha/meta/panel, ola y fondos.

## Detalles técnicos

- `src/lib/demos.data.ts`: nuevas utilidades
  - `fetchSvgText(url)` — descarga el SVG desde `/api/brand/...` (mismo origen, sin CORS).
  - `svgColors(text)` — extrae colores únicos de atributos `fill`/`stroke`, `style="..."` y bloques `<style>`; ignora `none`, `transparent` y `currentColor`; normaliza a `#RRGGBB` (acepta nombres CSS comunes, `rgb()` y hex corto).
  - `recolorSvg(text, mapa | unicoColor)` — reemplaza esas ocurrencias respetando el resto del marcado; con un solo color, además fija `fill` en las formas que no declaran ninguno.
- `src/routes/_authenticated/demos.tsx`:
  - `FileField` gana estado local: `esSvg` (por extensión de `value` o del archivo subido), `origen` (URL del SVG sin teñir), `colores` y `mapa`.
  - Nuevo subcomponente `SvgTint` con las muestras, el campo Hex (reutiliza `normalizeHex`), "Todo de un color" y "Restablecer".
  - Al aplicar: `recolorSvg` → `new File([texto], nombre, { type: "image/svg+xml" })` → `uploadBrandFile(slug, kind + "-tint", file)` → `onChange(nuevaUrl)`; se guarda la URL original en el estado del campo para poder restablecer.
- Sin cambios de esquema: la configuración sigue guardando solo la URL de la imagen.
