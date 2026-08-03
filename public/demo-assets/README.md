# demo-assets

Los assets que comparten **todos** los demos. Una sola copia: antes cada demo
(`/demo`, `/democip`, …) tenía su propia carpeta con los mismos 40 archivos
duplicados, y había que copiarlos a mano cada vez que se creaba uno nuevo.

La plantilla que los usa es [`src/assets/demo-app.html`](../../src/assets/demo-app.html),
servida por [`src/lib/demo-page.ts`](../../src/lib/demo-page.ts) con
`<base href="/demo-assets/">`.

## Qué hay aquí

| | |
| --- | --- |
| `data.js`, `data_modulo3..5.js` | El contenido del curso — los 5 módulos |
| `placement_items.js` | El banco de ítems del test de ubicación |
| `modulebg1..5.png` | Los fondos del mapa, uno por módulo |
| `star.svg`, `lock.svg`, `completed*.png/svg`, `difficulty.svg`, `language.svg` | Iconografía del caminito |
| `Logo.png`, `langles_*.png/svg` | Marca por defecto (AprendoEnglish) |
| [`mascots/`](mascots/README.md) | Las mascotas, una carpeta por personaje |

## Qué NO hay aquí

`public/app/` y `public/dashboard/` son la app **autenticada**, no demos. Tienen
su propio ciclo de vida y no se tocan desde aquí.

## Al crear un demo nuevo

No se copia nada. Un demo es una fila de configuración sobre esta misma carpeta:
colores, logos, textos y qué mascota usar. Lo que sí es propio de cada demo
—logos subidos, fondos de mapa a medida, packs de mascota— vive fuera de este
directorio, en el almacenamiento, y se inyecta por URL absoluta.
