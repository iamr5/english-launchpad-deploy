# Sumar el cuy al constructor de personajes

El personaje que subiste es un cuy dibujado entero: cuerpo, patas, brazos y pechera son suyos, y **no lleva ropa**. Los nueve actuales funcionan al revés: el constructor pone un cuerpo común con polo, short y zapatillas, y cada especie sólo aporta la cabeza.

Por eso este no puede entrar como los demás. Entra como el primer personaje **sin uniforme**: se usa su dibujo completo, se le pueden poner lentes, y no aparecen polos, estampados ni ranura de logo.

## Qué voy a hacer

### 1. Meterlo completo, no sólo la cabeza

Se conserva todo su dibujo —cabeza, orejas, cuerpo, brazos, patas y pechera— y se encaja en el mismo lienzo y la misma línea de piso que los otros, para que en el mapa y en los globos se vea del mismo tamaño. Los brazos y los ojos quedan en sus propios grupos, así respira, cabecea y parpadea igual que el resto.

### 2. Que se pueda recolorear

Su pelaje naranja pasa a ser el color base, y el crema de la pechera y el rosado del hocico y las orejas se guardan como distancia respecto a ese base. Al elegir otro color, el cuy entero cambia manteniendo su contraste, como el mapachito o el zorrito. Los rosados siguen teniendo su casilla aparte.

### 3. Lentes

Le agrego los lentes del set, ajustados a su cara. La casilla «Lentes» funciona con él como con los demás.

### 4. Un constructor que se adapta

Cuando eliges este personaje, el panel esconde lo que no le aplica —variante de polo, colores de polo/short/zapatillas y toda la sección de logo— y deja pelaje, rosados, contorno, lentes y animación. Al cambiar a otra especie, esos controles vuelven con lo que tenías puesto.

### 5. Detalles

- Aparece en la parrilla con su miniatura de cabeza.
- Sin cola, como el osito.
- Nombre propuesto: **Cuycito** (`Guinea Pig` en inglés) con emoji 🐹. Dímelo si prefieres otro.
- Compruebo en el navegador: con y sin lentes, un par de colores de pelaje, y que al saltar de él a otra especie y volver no se pierda el uniforme.

## Detalle técnico

- `datos/personajes.json`: nueva entrada `chars.cuycito` con `head`, `glass`, `tail: []`, `mid: []`, más un bloque propio `propio: { back, armL, armR }` y la marca `sinUniforme: true`. Los `fill` originales se traducen a tokens (`f0` pelaje, `f1` crema, `f2` sombra, `p0` rosado, `ink`, `eye`, `eyeHi`).
- El encaje al lienzo común (`-46 118 904 1268`) se calcula midiendo su caja contra la línea de piso compartida y se hornea en los `d` con un script de una sola pasada, como se hizo con el torito.
- `src/lib/escribimos.ts`: `svgMascota` usa `propio` en vez de `body.back/armL/armR` y omite `#polo` y `#logo` cuando `sinUniforme`; `randomizar` no le sortea colores de ropa; `EMOJIS` gana `cuycito`.
- `src/components/mascot-constructor.tsx`: los controles de polo/short/zapatillas/logo se ocultan si la especie es `sinUniforme`; el estado de esos campos se conserva para cuando se vuelva a otra especie.
- No toco `ARTE_VERSION`: sumar una especie no altera las mascotas ya guardadas.
