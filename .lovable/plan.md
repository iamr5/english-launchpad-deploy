# Tomito, la mascota de la Autónoma

Tomito llega como dos dibujos completos (boca cerrada y boca abierta) en un solo trazo plano, sin capas. Para que respire, hable y pueda vestirse con los colores de cada institución hay que despiezarlo igual que se hizo con Martín y Arianna.

## 1. El pack `tomito`

- **Despiece por capas**, midiendo cada trazo sobre el lienzo (1936.88 × 4680.61) y repartiéndolo en: piernas y zapatillas, cuerpo (polo, mochila, brazos como capa aparte cada uno), cabeza y pelo, ojos y lentes, y boca.
- **Boca en dos piezas**: la cerrada (sonrisa) y la abierta salen del diff entre los dos archivos; el resto del dibujo es idéntico, así que solo cambia esa zona. Se apilan y se alternan por opacidad.
- **Animación propia** (`mascot.css`): respiración del torso, péndulo de brazos, cabeceo desfasado, parpadeo en su propio ciclo — la base de Martín, recalibrada a los pivotes reales de Tomito.
- **Icono de cabeza** recortado para la barra superior, los globos y la marca de agua.
- Ficha: nombre «Tomito», se le llama *Tomito*, es «tu guía educativo — un estudiante como tú» 🧑‍🎓.

## 2. Ropa con color y estampado

Los rellenos de la ropa dejan de ser colores fijos y pasan a ser variables: **polo**, **pantalón**, **zapatillas** y **mochila**, cada uno con sus sombras derivadas del color elegido (no se pinta plano: la sombra se calcula, como en el constructor de personajes). El pelaje, la piel, el pelo y los lentes no se tocan.

- **Ranura de logo en el pecho**, recortada a la curva del polo, para el estampado de la institución (mismo campo de logo que ya usa el constructor).
- Controles nuevos en **/demos → Mascota**, visibles cuando el pack los admite: color de polo, pantalón, zapatillas y mochila, más el estampado del polo, con vista previa en vivo.
- **Martín y Arianna** reciben el mismo trato: sus uniformes se tokenizan igual y comparten los mismos controles. Los demos que ya los usan mantienen su aspecto actual mientras nadie toque los controles nuevos.

## 3. Cuándo abre la boca

- **Al hablar**: mientras la mascota tiene texto en pantalla o voz sonando (globos, lectura en voz alta, mensajes de Tomito), la boca se abre y cierra al ritmo del habla y vuelve a la sonrisa al terminar.
- **Gesto cada tanto**: en reposo, una apertura breve de vez en cuando junto a la respiración, y una abierta franca en los aciertos y las celebraciones, para que no se vea congelado.
- Con «reducir movimiento» del sistema, la boca se queda quieta y el resto baja a un cuarto de amplitud, como el resto de mascotas.

## 4. Reemplazo total en la Autónoma

Tomito pasa a ser la mascota de la Universidad Autónoma en todo lo suyo:

- el demo de la Autónoma (su configuración en el panel),
- `/autonoma-presentacion` (que ya toma la mascota del demo),
- `/silabo-autonoma` y `/silabo-autonoma-1`, tanto en los demos embebidos como en cualquier imagen o mención de la mascota anterior.

Reviso los cuatro después del cambio para que no quede rastro de la mascota vieja.

## Detalle técnico

- Pack en `public/demo-assets/mascots/tomito/` (`mascot.json`, `mascot.css`, `layers/*.svg`, `head-icon.svg`, `preview.html`) y alta en `BUILT_IN_PACKS` de `src/lib/mascot-packs.ts`.
- Despiece con un script de medición en el navegador (Playwright) sobre los dos SVG subidos; los trazos se reparten por caja y se traducen los `fill` de ropa a `var(--polo)`, `var(--pantalon)`, `var(--zapatillas)`, `var(--mochila)` con derivadas por `color-mix`.
- Campos nuevos en la configuración del demo (`src/lib/demo-config.ts`): `mascot.uniform` (colores) y `mascot.chestLogo`; se aplican como variables CSS sobre la raíz del pack en `demo-page.ts`, `presentacion-mascota.ts` y el panel `src/routes/_authenticated/demos.tsx`.
- Boca: capas `mouth`/`mouthOpen` en el stack, controladas por la clase `is-talking` sobre la raíz; `mascot-runtime.js` expone `Mascot.talk(on)` y `demo-app.html` la engancha al TTS y a las celebraciones.
