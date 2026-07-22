## Problema

La ruta `/demo` sirve `src/assets/demo-index.html`, pero ese HTML referencia assets con rutas relativas (`src="body.svg"`, `src="data.js"`, etc.). Como la URL es `/demo` (sin barra final), el navegador resuelve esas rutas contra la raíz (`/body.svg`) en lugar de contra `/demo/…` donde viven los archivos en `public/demo/`. Resultado: todos los assets dan 404 y la pantalla queda en blanco.

## Solución

Inyectar `<base href="/demo/">` en el `<head>` del HTML servido por `src/routes/demo.tsx`, para que todas las rutas relativas resuelvan contra `/demo/`, que es donde están los assets estáticos.

### Cambio

- `src/routes/demo.tsx`: antes de devolver el HTML, insertar `<base href="/demo/">` justo después de la etiqueta `<head>` (con un simple `.replace('<head>', '<head><base href="/demo/">')`). No se toca el HTML original en `src/assets/` ni los assets en `public/demo/`.

Con esto, `/demo` carga la demo completa igual que si se abriera `/demo/index.html` estático, sin modificar el contenido del zip.
