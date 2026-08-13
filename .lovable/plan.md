# Arreglar los demos del sílabo: recorte y splash

Dos problemas en `/silabo-autonoma`, ambos en `src/assets/silabo-autonoma.html`.

## 1. Los demos salen recortados

La maqueta antigua del previsualizador sigue viva: más abajo en la hoja de estilos hay una regla que convierte `.demo-screen` en una rejilla de dos columnas (`190px 1fr`), pensada para el mockup dibujado a mano. Como esa regla va después de la que se añadió para los demos reales, gana: el iframe queda metido en la columna de 190 px y el resto del ancho se ve como fondo gris vacío. Lo mismo le pasa al panel del profesor.

Arreglo: mover el bloque de estilos de los demos embebidos después de las reglas del mockup (y anular ahí la rejilla y el `min-height` heredados), de modo que cada iframe ocupe el 100 % del ancho de su marco. Se ajustan también las alturas para que la app quepa sin cortes:
- web del alumno y panel del profesor: iframe a ancho completo, altura acorde al marco;
- móvil: iframe a ancho completo del bezel.

No se toca el mockup estático de otras secciones: las reglas nuevas quedan limitadas a los contenedores que llevan un iframe `.live`.

## 2. El splash debe verse al llegar, no antes

Hoy los iframes traen `src` fijo; el navegador los carga pronto y la bienvenida de la marca se reproduce mientras el usuario todavía está en las primeras secciones, así que al bajar ya no queda nada que ver.

Arreglo: los tres iframes pasan a llevar `data-src` en lugar de `src`, y un pequeño `IntersectionObserver` en el script del final asigna el `src` la primera vez que cada marco entra en pantalla (con un margen pequeño, para que empiece justo al aparecer). Cada demo se carga una sola vez; al salir de pantalla no se descarga.

El modal "Ampliar" no cambia: ahí el iframe se crea al abrirlo, así que el splash ya se ve desde el inicio.

## Detalle técnico

- Archivo único: `src/assets/silabo-autonoma.html`.
- CSS: reubicar/duplicar el bloque `/* demos reales embebidos */` tras `.demo-screen{...grid-template-columns:190px 1fr}` y añadir `.demo-screen:has(iframe.live){display:block;grid-template-columns:none;min-height:0;padding:0}` con respaldo mediante una clase explícita `.demo-screen.live-embed` en los tres contenedores, por si `:has()` no aplica.
- JS: observador que hace `el.src = el.dataset.src` una vez por iframe y deja de observarlo.
