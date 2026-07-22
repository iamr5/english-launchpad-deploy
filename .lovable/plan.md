## Objetivo
Desplegar tres contenidos estáticos tal cual, sin modificar el HTML/JS/CSS/imágenes:

- `/` → `aprendoenglish-landing.html`
- `/presentacion` → `aprendoenglish-presentacion (5).html`
- `/demo` → contenido del zip `super_english/` (su `index.html`)

## Enfoque

Colocar los archivos en `public/` para que Vite/TanStack los sirva como estáticos, sin pasar por React. Así se preservan al 100% (fuentes Google, estilos inline, scripts, Rive WASM, imágenes).

Estructura:

```
public/
  index.html                    ← landing (copia de aprendoenglish-landing.html)
  presentacion/index.html       ← copia de aprendoenglish-presentacion (5).html
  demo/                         ← contenido descomprimido de super_english/
    index.html
    data.js, rive.js, rive_wasm.js, *.png, *.svg, ...
```

Con esta estructura:
- `https://.../` sirve la landing
- `https://.../presentacion` y `.../presentacion/` sirven la presentación
- `https://.../demo` y `.../demo/` sirven la demo Rive con todos sus assets relativos funcionando

## Pasos

1. Eliminar el placeholder de la home de TanStack:
   - Borrar `src/routes/index.tsx` y `src/routes/__root.tsx` no se toca (queda pero no interferirá porque `public/index.html` en un build estático colisiona con la SPA).

2. Reconsideración: TanStack Start es SSR. Un `public/index.html` NO se sirve automáticamente en la raíz porque la raíz la maneja el router. Solución correcta:
   - `/presentacion` y `/demo/*` → poner en `public/` funciona (rutas no capturadas por el router se sirven como estáticas desde `public/`).
   - `/` → reemplazar `src/routes/index.tsx` por una ruta que devuelva el HTML de la landing crudo. La forma más simple y sin modificar el HTML: importar el archivo como `?raw` y renderizarlo en un server route `src/routes/api/public/...` NO — la raíz debe ser `/`.

   Alternativa más limpia: mover la landing a `public/landing.html` y hacer que `src/routes/index.tsx` haga un redirect a `/landing.html`. Pero el usuario pidió que en `/` esté la landing.

   Mejor solución: usar un server route en `src/routes/index.tsx` con `server.handlers.GET` que devuelva el HTML como `Response` con `Content-Type: text/html`, importando el archivo con `?raw`. Así `/` sirve exactamente el HTML de la landing sin modificarlo.

3. Colocación de archivos:
   - Copiar `aprendoenglish-landing.html` a `src/assets/landing.html` (importado como `?raw` por la ruta `/`).
   - Copiar `aprendoenglish-presentacion (5).html` a `public/presentacion/index.html`.
   - Descomprimir `super_english.zip` a `public/demo/` (contenido de `super_english/` directamente dentro de `public/demo/`, sin `.git`).

4. Reemplazar `src/routes/index.tsx` para servir la landing como HTML crudo vía server handler.

5. Verificar en el preview: cargar `/`, `/presentacion`, `/demo` y comprobar que se ven idénticos a los HTML originales.

## Notas técnicas

- Los HTML usan fuentes de Google vía `<link>` y estilos inline — todo funciona porque los servimos tal cual.
- La demo Rive usa rutas relativas (`data.js`, `rive_wasm.js`, imágenes) — al servirla desde `/demo/` con `index.html`, todas las rutas relativas resuelven correctamente.
- No se modifica ningún archivo del zip ni de los HTML.
- No se copia `.git` (el zip no contiene metadata git).

¿Procedo así, o preferís que `/` también se sirva desde `public/` (con un pequeño ajuste de router para que no capture la raíz)?