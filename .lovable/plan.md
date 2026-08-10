# Marca de agua propia y colores en Hex

## 1. La marca de agua deja de depender del logo de cabecera

Hoy la marca de agua es un interruptor que solo repite `brand.logo`: si no hay logo cargado, no pinta nada, y no se puede usar otra imagen.

Cambia a un bloque con tres opciones:

- **El logo de la cabecera** (comportamiento actual, opción por defecto)
- **El icono de la barra superior** (o la cabeza de la mascota, si el icono está vacío)
- **Otra imagen** — con subida de archivo propia, igual que el resto de campos de imagen del panel

El interruptor de "Marca de agua" se mantiene para encenderla/apagarla; debajo aparece el selector de origen y, al elegir "Otra imagen", el campo de subida con miniatura.

Si la fuente elegida queda vacía, la marca de agua simplemente no se pinta (sin romper nada).

## 2. Los colores aceptan Hex escrito o pegado

Los campos de color ya tienen casilla de texto, pero solo entienden el formato exacto `#RRGGBB`. Se vuelven tolerantes:

- Se puede pegar sin `#` (`1CB0F6`)
- Se acepta el formato corto de 3 dígitos (`#1cf` → `#11CCFF`)
- Mayúsculas/minúsculas y espacios sobrantes indiferentes
- Mientras se escribe no se pierde lo tecleado; al salir del campo se normaliza a `#RRGGBB` en mayúsculas
- La muestra de color y el selector del sistema reflejan el valor en cuanto es válido

Aplica a todos los campos de color del panel: acento, botones, resaltado, ruedita, los cinco módulos y los del splash.

## Detalles técnicos

- `src/lib/demo-config.ts`: nuevo `brand.watermarkSource?: "logo" | "icon" | "custom"` y `brand.watermarkImage?: string` (URL subida), documentados junto a `logoSpots`.
- `src/routes/_authenticated/demos.tsx`:
  - En el bloque "El logo por el demo", debajo del switch `watermark`, añadir el selector de origen (botones tipo segmented, como `olaFit`) y un `FileField` (`kind="marca-agua"`) cuando el origen es `custom`.
  - `ColorField`: estado de texto local + `normalizeHex()` (acepta sin `#`, 3 o 6 dígitos), `onBlur` normaliza, `onChange` emite solo cuando el valor es interpretable.
- `src/assets/demo-app.html` (`mountBrandLogos`): resolver la fuente de `.brand-wm` según `watermarkSource` (`logo` → `brand.logo`; `icon` → `brand.appbarIcon` o cabeza de la mascota; `custom` → `brand.watermarkImage`), en lugar de usar siempre `brand.logo`. El resto de `logoSpots` no cambia.
