# Arreglar "No disponible" en las presentaciones grandes

## Qué está pasando

Comprobado con peticiones reales al dominio publicado:

- El archivo en el CDN está bien: `200`, 27.866.947 bytes (~28 MB).
- La ruta `/presentacion-santa-maria-de-la-gracia` responde `502 "No disponible"` de forma intermitente (a veces sirve los 28 MB, a veces falla).
- `/apavit-presentacion` (~15 MB) falla exactamente igual, así que no es un problema de este colegio sino del patrón que usan todas las presentaciones pesadas.

Causa: el servidor descarga la presentación completa, la convierte a texto y la guarda en una variable en memoria (`cache`) para inyectarle las etiquetas sociales y la mascota. Cargar 15–28 MB de HTML en memoria dentro del runtime del servidor supera sus límites, y cuando eso ocurre la respuesta cae al mensaje de error "No disponible".

## Solución

Cambiar la forma de servir estas presentaciones: en vez de descargarlas enteras a memoria, pasarlas en streaming al navegador e insertar las etiquetas (favicon, Open Graph, Twitter y la mascota del demo) sobre la marcha, sin acumular el archivo.

Pasos:

1. Crear un helper compartido (`src/lib/serve-presentacion.server.ts`) que reciba la URL del asset, las etiquetas de `<head>` y opcionalmente el HTML de la mascota, y devuelva la respuesta en streaming.
2. Reescribir `/presentacion-santa-maria-de-la-gracia` para usarlo (incluida la inyección de la mascota del demo `santa-maria-de-la-gracia`).
3. Aplicar el mismo helper a las demás rutas de presentación que usan el patrón con `cache` en memoria: `apavit-presentacion`, `autonoma-presentacion`, `presentacion`, `presentation`, `CIP-presenta`, `cip-presentacion`, `presentacion-aje`, `-bcp`, `-la-tinka`, `-movistar`, `-nuam`, `-repsol`.
4. Eliminar las variables `cache` de módulo (son las que retienen decenas de MB por proceso).
5. Verificar con peticiones repetidas que cada ruta devuelve `200` de forma estable y que el HTML incluye las meta sociales, el favicon y, donde corresponde, la mascota.

## Detalle técnico

- Se usa `HTMLRewriter` del runtime (Cloudflare Workers) con `.on("head", { element: e => e.append(tags, { html: true }) })` sobre `res.body`, devolviendo la respuesta transformada sin `await res.text()`.
- Se conserva `Content-Type: text/html; charset=utf-8` y se añade cabecera de caché (`public, max-age=3600`) para que el CDN alivie las descargas repetidas.
- Si el fetch al asset falla, se mantiene un fallo controlado, pero con reintento único antes de rendirse.
