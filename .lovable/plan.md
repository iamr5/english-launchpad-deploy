# Rediseñar /cip con el estilo de las presentaciones y acelerar la carga

La landing de preinscripción del CIP se rehace visualmente usando el mismo sistema de diseño de las presentaciones y el sílabo (`/silabo-cip`, `/silabo-autonoma`), y se corrige lo que la vuelve lenta.

## Rediseño visual

Adoptar los tokens del sílabo, tintados con la marca del CIP (color institucional, logo y frase que ya vienen de `/demos`):

- Tipografías Archivo / Archivo Black / Libre Caslon Text, cargadas con `<link>` + preconnect en la cabeza de la ruta.
- Paleta de bandas: papel crema, banda navy y banda de acento CIP, con la textura de puntos y las sombras suaves de las presentaciones.
- Portada con eyebrow ("Preinscripción abierta · Cupos limitados"), titular en Archivo Black, acento en cursiva serif, y el formulario de correo en una tarjeta blanca elevada.
- Métricas, beneficios y CTA final reconstruidos con los mismos componentes visuales (fichas numeradas, tarjetas `mini`, tabla/lista limpia) en lugar de las tarjetas genéricas actuales.
- El quiz de muestra conserva exactamente la interacción y el aspecto del quiz real de la app (no se toca su lógica), sólo se enmarca en la tarjeta del nuevo sistema.

## Velocidad de carga

Causa principal medida: el `<iframe>` de `/democip` pesa ~430 KB de HTML más sus assets y hoy se dispara solo al hacer scroll; además el script de la mascota (`boti.js`, ~45 KB) se carga siempre.

- El demo pasa a cargarse **al hacer clic**: se muestra el marco del teléfono con una portada estática y un botón "Abrir el demo"; el iframe se inserta sólo entonces.
- La mascota Boti se carga de forma diferida (sólo en pantallas medianas/grandes y cuando su sección es visible), con reserva de espacio para que no salte el layout.
- Fuentes con `display=swap` y preconnect; iconos SVG existentes con `loading="lazy"` y dimensiones explícitas.

## Detalles técnicos

- Cambios sólo en `src/routes/cip.tsx` (marcado, CSS embebido de la landing y carga diferida) y sus `head()` links de fuentes. No se toca `demo-app.html`, `/democip`, ni la lógica de preinscripción (`/api/public/preinscripcion`).
- Se mantienen los datos actuales (45 microlecciones, 8.127 ejercicios, 11.040 palabras, 779 términos) y el `og:image` existente.
- Verificación con Playwright: captura del rediseño en móvil y escritorio y comprobación de que el iframe no se solicita hasta el clic.
