# Presentaciones Movistar y NUAM

Mismo tratamiento que AJE, BCP, La Tinka y Repsol.

## Qué se hace

1. Subir `presentacion-movistar.html` y `presentacion-nuam.html` (~25 MB c/u) al CDN como assets, sin dejar el binario en el repo.
2. Cambiar el CTA del penúltimo slide (`<a class="hook-cta" href="#" onclick="return false;">`) para que apunte a:
   - Movistar → https://www.aprendoenglish.com/demomovistar
   - NUAM → https://www.aprendoenglish.com/demonuam
3. Crear las rutas `/presentacion-movistar` y `/presentacion-nuam`, cada una con favicon `head.png` y preview social (Open Graph + Twitter) con el nombre de la marca.
4. Reemplazar a Boti por la mascota del demo de cada marca, igual que en las otras: se lee la configuración del demo (`demomovistar`, `demonuam`) al servir la página, así que si cambias la mascota en `/demos` la presentación se actualiza sola. Si aún no existe el demo, la presentación se sirve con Boti hasta que lo crees.
5. Verificar en navegador que cargan, que el CTA lleva al demo y que la mascota aparece en portada, slide guía y cierre.

## Detalle técnico

- `lovable-assets create` → `src/assets/presentacion-movistar.html.asset.json` y `...nuam...`.
- Rutas nuevas `src/routes/presentacion-movistar.tsx` y `src/routes/presentacion-nuam.tsx`, copiando el patrón de `presentacion-aje.tsx`: fetch del asset + cache en memoria, inyección de `headTags` y del script de mascota vía `mascotaDelDemo(slug)`.
