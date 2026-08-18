# Tomito en /demoautonoma + ropa editable

Hoy pasan dos cosas:

1. **El demo de la Autónoma no usa a Tomito.** Su configuración sigue apuntando a la llamita subida a mano ("Nomi la Llamita"), así que Tomito nunca aparece.
2. **Tomito trae ropa recoloreable, pero nadie la puede tocar.** Su mascota declara polo, pantalón, zapatillas, mochila y un hueco para el logo del pecho, pero el panel `/demos` no ofrece esos controles y la página del demo no envía los colores: siempre salen los de fábrica.

## Qué se hace

### 1. Controles de vestuario en /demos (pestaña Mascota)

- Cuando la mascota elegida declara vestuario (hoy Tomito), aparece un bloque **"Ropa"** con un selector de color por prenda: polo, pantalón, zapatillas y mochila. Cada uno con botón de "volver al color original".
- Un atajo **"usar los colores de la marca"** rellena las prendas con la paleta del demo de un clic.
- Debajo, **"Estampado del polo"**: subir una imagen (PNG/SVG) que se coloca en el pecho, con control de tamaño y la opción de quitarla. Se sube igual que el resto de imágenes de marca del demo.
- Vista previa en vivo en el panel: la mascota del panel se repinta al mover cada color.

### 2. Que la ropa llegue a todas partes

Los colores y el estampado se guardan en la configuración del demo y se aplican al servir:

- la app del demo (`/demoautonoma` y cualquier otro),
- el panel de progreso,
- las presentaciones de marca (que ya leen la mascota del demo).

Cambiar el color en `/demos` se ve en el demo sin tocar código.

### 3. Asignar Tomito a la Autónoma

- `demoautonoma` pasa a usar el pack Tomito, conservando nombre y textos del personaje si la Autónoma quiere seguir llamándolo a su manera (queda editable en el panel).
- La presentación `/autonoma-presentacion` y el sílabo toman la mascota del demo, así que se actualizan solos.

### 4. Verificación

En navegador: `/demoautonoma` muestra a Tomito (portada, lecciones y globos), la boca se abre al hablar, y al cambiar el color del polo o subir un estampado en `/demos` el demo recargado lo refleja.

## Detalle técnico

- `DemoConfig.mascot` gana `wardrobe?: Record<string,string>` (clave = prenda declarada en `mascot.json`) y `chestLogo?: { url: string; size?: number }`.
- `src/lib/demo-page.ts`: junto al bloque de tema, emite variables CSS en el host de la mascota — `--m-polo`, `--m-pants`, `--m-shoes`, `--m-bag`, `--m-chest-logo: url(...)` y `--m-chest-size` — sólo para las prendas que el pack declara en `wardrobe`. Mismo bloque reutilizado en el panel de progreso y en `src/lib/presentacion-mascota.ts`.
- `public/demo-assets/mascots/tomito/mascot.css`: el `.chestlogo` ya lee `--m-chest-logo`; se le añade el tamaño configurable.
- `src/routes/_authenticated/demos.tsx`: bloque de vestuario generado a partir de `BUILT_IN_PACKS[pack].wardrobe` (con etiquetas en español) + subida del estampado con `uploadBrandFile(slug, "estampado", file)`.
- Cambio de pack de `demoautonoma` a `tomito` con una migración/actualización de su fila en `public.demos` (limpiando `baseUrl`/`manifest` del pack subido).
- Sin cambios en el runtime de mascotas: ya monta las capas en línea, así que las variables CSS de la página alcanzan al SVG.
