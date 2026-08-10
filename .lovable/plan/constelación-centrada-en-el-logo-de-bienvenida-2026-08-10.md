# Constelación centrada en el logo de bienvenida

Hoy, en el estilo "constelación", las partículas nacen y orbitan alrededor del centro exacto de la pantalla. Como la marca incluye el logo y, debajo, la frase, el logo queda algo más arriba de ese centro: la constelación parece descuadrada respecto al logo.

## Qué cambia

Las partículas pasan a girar y converger tomando como centro el propio logo de bienvenida (el archivo "Logo de la bienvenida", o el rótulo de texto cuando no hay logo). El resto del estilo —brillo, parpadeo, giro lento del campo— se mantiene igual.

El cambio se aplica tanto al demo real como al previo dentro del panel de "demos", para que lo que se ve al configurar sea exactamente lo que ve el visitante.

## Detalle técnico

- `public/demo-assets/splash.css`: en `.sp-constelacion`, mover el campo de partículas de la capa a pantalla completa (`.sp-deco`) a un contenedor anclado al logo. Las partículas quedan posicionadas en el centro de ese contenedor (`left/top: 50%`) y el giro lento (`spField`) se aplica ahí, con `z-index` por debajo del logo para no taparlo.
- `src/lib/demo-page.ts` (`splashHTML`): envolver la marca en un halo relativo, `<span class="sp-halo">…logo/rótulo…<span class="sp-stars">…partículas…</span></span>`, moviendo los 14 nodos `<i style="--i:n">` de `.sp-deco` a ese halo cuando el estilo es "constelación".
- `src/routes/_authenticated/demos.tsx` (previo del splash, ~líneas 285-300): misma estructura para que el previo coincida.
- El radio de las órbitas (`78vmin → 26vmin` en `spStar`) se ajusta a valores relativos al halo para que las partículas terminen rodeando el logo en vez de la pantalla entera; se conserva el arranque desde fuera del encuadre.
