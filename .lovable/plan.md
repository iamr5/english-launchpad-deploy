# Más magia: revelación de nivel y llegada al mapa

La revelación tipo "sombrero seleccionador" ya existe y se dispara al terminar el test (verificado en el navegador: órbita de insignias → destello con el nivel → módulos convalidados con su XP). Lo que falta es que se sienta como un momento y que la **llegada al mapa** no sea un salto seco a un mapa ya lleno.

## 1. La revelación se siente corta y plana

Se refuerza la secuencia sin cambiar la lógica de colocación:

- **Suspenso real**: la órbita acelera, se frena en un nivel equivocado, retrocede y vuelve a girar antes del golpe final (hoy solo gira y para).
- **Golpe final más contundente**: destello a pantalla completa, onda expansiva doble, rebote de la insignia y vibración corta en móvil.
- **Boti reacciona**: cambia de "pensando" a celebración (salto + brillo) y anuncia el nivel con texto que entra letra por letra.
- **Contador de XP animado**: en vez de aparecer "+1460 XP" de golpe, cada módulo convalidado entra con su check dibujándose y el número subiendo desde 0, con un sonido/pulso visual por fila.
- **Total acumulado**: al final, una línea "Total convalidado: X XP" que suma en vivo, y recién ahí aparece el botón "Empezar en B1".
- Se mantiene "Saltar" y el respeto a `prefers-reduced-motion`.

## 2. Al llegar al mapa por primera vez, todo debe llenarse en vivo

Hoy, tras la revelación, el mapa aparece ya completo. Cambio: la primera vez que se entra al mapa después de la colocación, arranca **vacío/gris** y se llena delante del alumno:

- Los módulos convalidados se pintan de arriba hacia abajo: cada nodo pasa de gris a su color con un rebote y su check apareciendo, en cascada rápida (~90 ms entre nodos).
- El anillo de progreso de cada módulo se rellena de 0% a 100% mientras sus nodos se marcan, y al cerrarse suelta un pequeño destello + la etiqueta "Convalidado".
- El contador de XP de la cabecera sube en vivo hasta el total mientras avanza la cascada.
- Al terminar, la vista hace scroll suave hasta el módulo actual, el nodo activo pulsa y Boti aparece con "Aquí empiezas: <nivel>".
- La animación corre **una sola vez** (bandera guardada); en visitas posteriores el mapa se pinta normal e instantáneo. Con `prefers-reduced-motion`, estado final directo.

## Detalles técnicos

Todo en `src/assets/democip-index.html`, copiado a `public/democip/index.html`.

- `placementReveal()`: reescribir la línea de tiempo (fake-stop en un nivel erróneo, `navigator.vibrate`, flash overlay, `tickUp()` para los contadores de XP, fila total). CSS nuevo bajo `.sort` (keyframes `sortFake`, `sortBoom`, `sortFlash`).
- Nueva bandera `PROGRESS.__placement.revealPending = true` al aplicar la colocación en `applyPlacement`.
- Nueva función `playPlacementFillIn(scope)` invocada tras `renderCourse()`/`renderModule()` cuando la bandera está activa: recorre nodos convalidados en orden, alterna clases (`.fill-pending` → `.fill-in`) con `setTimeout` escalonado, anima el `stroke-dashoffset` del `.ring .prog` y el XP de la cabecera; al terminar limpia la bandera y hace `scrollIntoView` al módulo activo.
- CSS: estado `.lpath .node.fill-pending` (gris, sin check) y keyframe `nodePop` para la entrada.
- Verificación con Playwright en viewport móvil: completar el test forzando nivel B1, capturar la revelación y la cascada del mapa, y confirmar que al recargar ya no se repite.
