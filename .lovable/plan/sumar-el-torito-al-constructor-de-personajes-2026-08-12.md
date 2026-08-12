# Sumar el torito al constructor de personajes

El personaje que subiste está dibujado en el mismo estilo que los ocho actuales —mismo trazo, mismos colores de uniforme (polo blanco, short rojo, zapatillas)— pero es un dibujo entero e independiente: su cuerpo, sus brazos y su ropa están dibujados aparte y en otro lienzo, y no comparte ni un trazo con el cuerpo común. Tampoco trae lentes.

El constructor arma cada personaje como cuerpo común + cabeza de la especie, y de ahí salen gratis el polo, los polos con y sin estampado, la ranura del logo, los lentes y la animación. Así que para que el torito se comporte como los demás hay que **quedarse con su cabeza y montarla sobre el cuerpo común**, no meter el dibujo entero.

## Qué voy a hacer

### 1. Recortar y encajar la cabeza

Me quedo con cabeza, cuernos, orejas, hocico, flequillo y ojos; descarto su cuerpo, brazos y ropa. Luego la escalo y la bajo hasta que el cuello y los hombros calcen exactamente donde calzan los de las otras especies, y quede a la misma altura de rostro. Sin esto, o le queda el polo por la barbilla o le flota la cabeza.

### 2. Que se pueda recolorear

Sus tonos se guardan como los de las demás: un color base de pelaje (el marrón) y el resto —el hocico crema, los cuernos, el flequillo oscuro, el rosado de las orejas— guardados como distancia respecto a ese base. Así al elegir otro color de pelaje el torito entero cambia manteniendo su contraste, igual que el mapachito o el zorrito.

Los ojos quedan en su propio grupo, para que parpadee.

### 3. Lentes

Le agrego los lentes del set, ajustados a su cara. La casilla «Lentes» pasa a funcionar con él como con el resto.

### 4. Polos, con y sin estampado

No hace falta arte nuevo: al ir sobre el cuerpo común hereda las dos variantes de polo (clásico y cuello redondo) y los tres modos de logo (sin logo, recuadro de color, imagen). Verifico que el escote no le deje el cuello al aire en ninguna de las dos y ajusto la subida del rostro si hiciera falta.

### 5. Detalles

- Aparece en la parrilla de especies con su miniatura de cabeza; reviso que los cuernos no salgan recortados y, si lo están, subo el encuadre de la miniatura.
- Nombre propuesto: **Torito** (`Bull` en inglés) con emoji 🐂. Dímelo si prefieres otro.
- Sin cola, como el osito o la llamita.
- Compruebo en el navegador: las dos variantes de polo, con y sin lentes, con y sin logo, y un par de colores de pelaje distintos.

## Detalle técnico

- `public/demo-assets/mascots/escribimos/datos/personajes.json`: nueva entrada `chars.torito` con `head` (grupos, cada ojo con `ojo: true`), `glass`, `tail: []`, `mid: []`, `vars` (`--f0`…`--p0`) y `tokens`, sobre el lienzo común `-46 118 904 1268`.
- La transformación de encaje (escala uniforme + traslación) se hornea en los `d` de los trazos con un script de una sola pasada, para que la data quede plana como la del resto.
- Los `fill` del archivo original (`.cls-*`) se traducen a tokens del sistema (`f0`, `f1`, `f2`, `p0`, `ink`, `eye`, `eyeHi`, `glass`).
- `src/lib/escribimos.ts`: añadir el emoji del torito al mapa `ESPECIES`. El resto del motor no cambia.
- No toco `ARTE_VERSION`: sumar una especie no altera el arte de las mascotas ya guardadas.
