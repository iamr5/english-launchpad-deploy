# Presentación Santa María de la Gracia

Mismo tratamiento que AJE, BCP, La Tinka, Repsol, Movistar y NUAM.

## Qué se hace

1. Subir `presentacion-santa-maria-de-la-gracia-entregable.html` (~28 MB) al CDN como asset, sin dejar el binario en el repo.
2. Crear la ruta `/presentacion-santa-maria-de-la-gracia`, con favicon `head.png` y preview social (Open Graph + Twitter) con el nombre del colegio.
3. Reemplazar a Boti por la mascota del demo `santa-maria-de-la-gracia` (que ya existe y tiene mascota propia). Se lee la configuración del demo al servir la página, así que si cambias la mascota en `/demos` la presentación se actualiza sola.
4. El CTA del penúltimo slide hoy es `href="#"` sin destino: apuntarlo a `https://www.aprendoenglish.com/santa-maria-de-la-gracia`.
5. Verificar en navegador que carga, que el CTA lleva al demo y que la mascota aparece en portada, slide guía y cierre (el HTML tiene los tres huecos `#boti-host`).

## Detalle técnico

- `lovable-assets create` → `src/assets/presentacion-santa-maria-de-la-gracia.html.asset.json`.
- Nueva ruta `src/routes/presentacion-santa-maria-de-la-gracia.tsx`, copiando `presentacion-nuam.tsx`: fetch del asset + caché en memoria, inyección de `headTags` y de `mascotaDelDemo("santa-maria-de-la-gracia")`.
