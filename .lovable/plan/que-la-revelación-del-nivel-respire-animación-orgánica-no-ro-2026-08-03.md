# Que la revelación del nivel respire: animación orgánica, no robótica

Hoy la secuencia funciona pero se siente mecánica: todo entra con la misma curva, los tiempos son parejos (620 ms exactos entre filas), el fondo está quieto, el texto aparece letra por letra a ritmo de máquina de escribir constante, y los elementos "aparecen" en lugar de asentarse. Se cambia el *feel*, no la lógica ni los resultados del test.

## Qué se cambia

**1. El fondo deja de estar muerto**
La pantalla oscura gana vida propia: un halo de luz que late lento detrás de Boti (respiración de ~4 s), pequeñas partículas de polvo dorado flotando hacia arriba muy lentamente, y un leve movimiento del degradado. Nada llamativo — es el "aire" de la escena.

**2. Boti se comporta como un ser vivo, no como un GIF en loop**
- Mientras piensa: respiración irregular (dos curvas superpuestas de distinta duración) en vez del sube-baja idéntico actual, con micro-inclinaciones de cabeza y algún parpadeo/ladeo puntual.
- En el momento del veredicto: reacción en dos tiempos — sobresalto, luego salto de alegría que se va calmando (rebote amortiguado) en vez del loop infinito de celebración.

**3. La órbita gana peso e inercia**
Las insignias dejan de girar a velocidad rígida: arrancan lento, aceleran, y las que están "lejos" se estiran ligeramente con el movimiento. El falso frenazo se siente como un objeto pesado que se pasa de largo y vuelve, no como un corte de tiempo. Al frenar, las insignias descartadas se apagan y caen suavemente hacia afuera en lugar de desaparecer de golpe.

**4. El veredicto aterriza con física**
La insignia final cae con rebote amortiguado (varios rebotes decrecientes, no uno solo), la onda expansiva se convierte en dos ondas de distinta velocidad y grosor, el destello es más corto y cálido en vez de un blanco plano, y el confeti sale con impulso desde el centro (explosión) antes de caer, con rotaciones y velocidades distintas por pieza.

**5. El texto se escribe como alguien que habla, no como un teletipo**
El anuncio "¡A1!" pasa de un intervalo fijo por carácter a un ritmo con variación natural (pausas ligeramente distintas, respiro antes del signo final) y cada letra entra con un micro-pop. Los textos de suspenso se desvanecen y entran con cross-fade en vez de reemplazarse en seco.

**6. Las filas de módulos convalidados escalonan de forma humana**
- Ritmo escalonado con variación (no 620 ms exactos) y con leve solapamiento entre filas, así se siente cascada y no lista.
- Cada fila entra desde abajo con un ligero adelanto-y-asiento (overshoot), el check se dibuja con un trazo en vez de aparecer, y el contador de XP acelera al inicio y frena al final con un último "tirón".
- El total se enciende con un pulso de luz que se difumina.

**7. La ruta A1→C1 (caso A1) se dibuja como un trazo**
La barra deja de crecer de forma lineal: se dibuja con aceleración/desaceleración, y cada etiqueta de nivel se ilumina al pasar el trazo por encima, con la de A1 quedando encendida y latiendo.

**8. El botón final llega sin cortar la escena**
Aparece con un desliz suave hacia arriba y un brillo que barre una vez; nada se congela cuando aparece — el fondo sigue respirando.

**9. Menos movimiento (`prefers-reduced-motion`)**
Se mantiene el orden y el encadenamiento actual, pero solo con opacidades y cross-fades suaves: sin órbita, sin confeti, sin partículas, sin rebotes.

## Detalles técnicos

Todo en `src/assets/democip-index.html`, sincronizado a `public/democip/index.html`. No cambia `applyPlacement`, `placementCredits`, ni el resultado del test.

- CSS `.sort`: nuevos keyframes `sortBreathe`, `sortDust`, `sortSettle` (rebote amortiguado multi-paso), `sortWaveSoft`; sustituir la curva única `cubic-bezier(.3,.05,.25,1)` de `sortSpin` por dos fases con curvas distintas y `will-change: transform`.
- Añadir capa `.s-aura` (halo pulsante) y `.s-dust` (8–12 partículas con duraciones/delays aleatorios) dentro de `#sort-hat`, detrás del stage.
- `later()` se mantiene; añadir helper `jitter(ms, pct)` para el escalonado de filas y el tipeo, y `easeOutBack`/rebotes vía CSS, no JS.
- `tickUp`: cambiar la interpolación cúbica única por una curva con overshoot leve y snap final al valor exacto.
- Confeti: reemplazar el `top:-12px` + caída lineal por burst radial (`--dx/--dy` por pieza, keyframe con impulso y luego gravedad).
- Check de convalidado: pasar de `✓` en texto a SVG inline con `stroke-dasharray/dashoffset` animado.
- Bloque `@media (prefers-reduced-motion: reduce)`: extender la lista de selectores neutralizados a las nuevas clases (`.s-aura`, `.s-dust`, burst de confeti).
- Verificación con Playwright forzando A1 y B1: capturar ~6 fotogramas de la secuencia y confirmar que el título final sigue siendo `¡A1!` / `¡B1!` y que el botón "Empezar en …" aparece al final.
