# Arreglar la revelación: se ve congelada en "No, esperen…"

La captura muestra el estado final y el texto intermedio a la vez: la insignia A1 ya fija, el título en "No, esperen…", el subtítulo y el botón "Empezar en A1" todos visibles al mismo tiempo. Eso no es la animación: es la secuencia colapsada.

## Qué está pasando

En `placementReveal` todos los pasos se programan con un helper que, cuando el sistema pide "menos movimiento", ejecuta **todo con 0 ms**. Resultado: los mensajes de suspenso, el veredicto letra por letra, los contadores y el botón se disparan a la vez y el último texto que gana es el del falso frenazo ("No, esperen…"), no "¡A1!". Además, en ese modo no se pintan ni la órbita, ni el destello, ni la onda.

Segundo detalle: con nivel **A1 no hay módulos convalidados**, así que no hay filas de XP en la revelación ni cascada al llegar al mapa — la pantalla queda casi vacía y se siente como "no pasó nada".

## Qué se cambia

1. **La animación deja de depender de "reduced motion" para existir.** Se separa en dos caminos reales:
   - Modo normal: la secuencia completa (órbita girando, falso frenazo, destello, veredicto letra por letra, contadores, botón).
   - Modo reducido: misma secuencia pero **sin movimiento**, con transiciones cortas y encadenadas en orden (nada de 0 ms simultáneo). El veredicto siempre queda como texto final.
2. **Orden garantizado**: los textos de suspenso se cancelan al llegar el veredicto, para que "¡A1!" nunca sea sobrescrito.
3. **A1 también tiene su momento**: cuando no hay módulos convalidados, la revelación muestra una línea propia ("Empiezas desde cero: todo el camino es tuyo") con Boti celebrando y una barra de ruta que se dibuja de A1 a C1, en vez de saltar directo al botón.
4. **Llegada al mapa con A1**: si no hay nada que convalidar, la cascada anima igualmente la aparición de los módulos y el nodo inicial pulsa con "Aquí empiezas", para que la primera entrada al mapa siempre tenga vida.
5. El botón "Empezar en …" aparece solo al terminar la secuencia (o inmediatamente al pulsar "Saltar").

## Detalles técnicos

Todo en `src/assets/democip-index.html`, sincronizado a `public/democip/index.html`.

- Reescribir el helper `later()` para que en modo reducido use un factor de tiempo reducido (p. ej. 0.35x) en lugar de 0, y limpiar los temporizadores de suspenso al entrar en `reveal()`.
- Añadir una bandera `verdictShown` que bloquee cualquier escritura tardía sobre `#s-t`.
- Rama `credits.length === 0`: nueva fila `.s-credit.zero` + mini barra de ruta A1→C1 con `stroke-dashoffset` animado.
- En `playPlacementFillIn`, quitar el corte temprano por reduced-motion y permitir la cascada aunque no haya módulos acreditados (solo entrada de tarjetas + pulso del nodo activo).
- Verificación con Playwright forzando A1 y B1, capturando 4 fotogramas de la secuencia y confirmando que el título final es "¡A1!" / "¡B1!".
