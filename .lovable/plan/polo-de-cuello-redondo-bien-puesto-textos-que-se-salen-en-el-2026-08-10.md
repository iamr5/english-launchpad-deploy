# Polo de cuello redondo bien puesto + textos que se salen en el constructor

## Qué encontré en los dos SVG de ejemplo

Comparé `Gatitov0.svg` y `Perritov0.svg` con los datos actuales del constructor:

- El cuerpo, los brazos, las piernas y la cola son **exactamente el mismo arte** que ya está en los datos (coinciden trazo a trazo una vez alineado el lienzo). No hay que redibujar nada de eso.
- El **rostro sí está más arriba**: 19,5 unidades en el gatito y 21 en el perrito respecto al cuerpo. La variante actual ya sube 20, así que la altura estaba bien encaminada; lo que está mal es otra cosa.
- Lo que de verdad cambia es **el polo**: los ejemplos traen un polo nuevo (un trazo blanco grande, su sombra/contorno oscuro y una pieza de pelaje que asoma por el cuello redondo, teñida con el color de la especie). Ese polo **no es el que está cargado hoy** en la variante del constructor: hoy se usa una pieza distinta, y por eso la mascota se ve mal armada.

## Qué voy a hacer

### 1. Reemplazar el polo de la variante de cuello redondo

- Sacar del SVG de ejemplo las piezas del polo nuevo y meterlas en los datos del constructor, alineadas al lienzo que ya usan las ocho mascotas.
- El trazo del cuello, que deja ver el pelaje, se pinta con el color de pelaje de cada especie, no con un color fijo: así funciona igual en las ocho, no sólo en el gatito y el perrito.
- El polo blanco y su sombra siguen respondiendo a los colores de "Polo" del panel, como el polo clásico.
- Descartar las piezas invisibles del archivo (van sin relleno) para no engordar el pack.

### 2. Rostro y lentes, en las ocho mascotas

- Fijar el desplazamiento del rostro con la medida de los ejemplos y comprobarlo mascota por mascota con el polo nuevo puesto y con el clásico.
- Los lentes ya se mueven junto al rostro con el mismo desplazamiento, así que quedan en su sitio automáticamente; lo verifico en las ocho.
- Si alguna especie queda descuadrada con la medida común, le pongo su propio ajuste fino.

### 3. La ranura del logo del polo

Con el polo nuevo, el hueco del pecho cambia de sitio y de tamaño. Vuelvo a medirlo sobre el arte nuevo para que el logo caiga centrado en el pecho y no encima del cuello o del borde.

### 4. Textos que se salen del contenedor en el constructor

Repaso el constructor a ancho angosto y arreglo los desbordes:

- Los nombres de las especies en la parrilla de ocho (nombre en español e inglés debajo de cada miniatura).
- Las etiquetas de color junto al campo hex y a las muestras.
- Las tarjetas de tipo de polo, con su nombre y su descripción.
- Los textos de ayuda del logo del polo y los avisos.

La regla que aplico: los bloques dejan de forzar su ancho mínimo, los textos largos parten de línea en vez de escaparse, y la parrilla de especies pasa a menos columnas cuando el panel es angosto.

## Verificación

Genero las ocho mascotas con el polo nuevo y con el clásico y las reviso: cabeza, lentes, cuello y logo en su sitio. Y reviso el panel a varios anchos para confirmar que ningún texto se sale.

## Detalle técnico

- Datos: `public/demo-assets/mascots/escribimos/datos/personajes.json` → `cuerpos.estampado` (la variante de cuello redondo): sustituir `shirt`, ajustar `subeCabeza` y `logoRect`.
- Las piezas nuevas se transportan al sistema de coordenadas de los datos con el desplazamiento medido por especie (gatito +70,2/−211,6; perrito +22,3/−225,4) y se guardan una sola vez, ya que el torso es común.
- El motor (`src/lib/escribimos.ts`) ya soporta polo propio por variante y ya aplica `subeCabeza` a `#cabeza` y `#lentes`; sólo se toca si hace falta el ajuste fino por especie o pintar la pieza del cuello con `var(--f0)`.
- UI: `src/components/mascot-constructor.tsx` (parrilla de especies, `CampoColor`, tarjetas de polo, ayudas del logo).
