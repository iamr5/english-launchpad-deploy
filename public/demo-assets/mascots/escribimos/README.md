# Constructor de mascotas — entrega técnica

## Dónde se usa esto

El constructor está montado dentro del panel: **`/demos` → pestaña Mascota → «Diseñar
una mascota»**. Ahí se elige especie y colores y, al pulsar *Usar esta mascota*, se
arma un pack normal —manifiesto, hoja y arte— y se sube por el mismo camino que
cualquier pack hecho a mano.

El motor de esa pantalla es [`src/lib/escribimos.ts`](../../../../src/lib/escribimos.ts):
el mismo cálculo de color y el mismo armado de SVG que `constructor.html`, portado a
TypeScript. Lee `datos/personajes.json` de esta carpeta, así que **la data manda**:
redibujar aquí cambia lo que ofrece el panel, sin tocar código.

Lo que sale es un pack de una sola capa —el personaje entero, con su animación dentro
del propio SVG— porque estas especies se animan por grupos internos, no apilando
archivos. El resto de la app no nota la diferencia: sigue siendo `engine: "layers"`.

**El pack no usa el lienzo común, sino uno recortado a la especie.** El lienzo de
`datos/personajes.json` va justo para la más ancha, así que a las estrechas les sobra
aire a los lados: como la app fija el ANCHO del hueco y deriva el alto, un conejito
que ocupa el 68 % de su lienzo se veía un tercio más chico que un oso que ocupa el
83 % del suyo. El constructor mide el dibujo en el navegador —nadie más sabe dónde
acaba un trazo— y encuadra cada especie a su caja más 24 px de aire, que es lo que
barren la cola y las orejas al moverse. Así crecen entre un 7 % y un 25 % y todas
llenan su hueco igual.

Todos los packs salen con la misma proporción, 1,5 (la de Boti), porque las
posiciones de la mascota en el mapa están calibradas con ella. Lo que falte para esa
proporción se añade por arriba, nunca por abajo: la línea de piso no se mueve. El
tope y el aire están en `ENCUADRE`, en `src/lib/escribimos.ts`.

Un detalle de la data, por si alguien compara: la manga aparece dos veces, en
`body.armL`/`body.armR` y otra vez dentro de `body.shirt`. El constructor las dibuja
las dos —la del brazo se mueve, la del polo tapa— y el port hace lo mismo para no
cambiar el aspecto. Los `svg/*.svg` sueltos, que no se animan, sólo traen una.

## El cuycito

El cuycito llegó como dibujo entero y **no usa el cuerpo común**: trae su propio torso,
brazos y patas, y va sin ropa. En la data eso es `sinUniforme: true` más un bloque
`propio` con `back`, `armL` y `armR`; el motor lo dibuja en lugar del cuerpo compartido
y se salta el polo y la ranura del logo, y el panel esconde esos controles. Se encajó
escalando su dibujo a la altura y la línea de piso del resto (×0,6903), y los lentes son
los del set reducidos a la separación de sus ojos. No tiene cola.

## El torito

El torito llegó después, como dibujo entero y en su propio lienzo. De él sólo se
guardó la cabeza —cuernos, orejas, flequillo, hocico y ojos—: su cuerpo, sus brazos y
su ropa se descartaron, porque el constructor los pone. El dibujo original resultó ser
el mismo cuerpo compartido, sólo movido, así que encajarlo fue una traslación exacta
(`-20,8` en X y `+257,4` en Y), horneada en los trazos. Los lentes son los del set,
bajados 26,5 px para que se apoyen en sus ojos. No tiene cola.

Si aparece otro personaje dibujado así, el camino es el mismo: medir su polo contra el
polo compartido para sacar la traslación, quedarse con la cabeza y traducir sus `fill`
a tokens (`f0` el pelaje base, `f1`… los derivados, `p0` el rosado, `ink`, `eye`,
`eyeHi`).

## Archivos


| Archivo | Para qué sirve |
|---|---|
| `constructor.html` | App autocontenida. Ábrela con doble clic, sin servidor ni instalación. |
| `svg/*.svg` | Versión con variables CSS. Para integrar en web o app. |
| `svg-plano/*.svg` | Todos los colores como atributos `fill`. Para Illustrator, Figma o Inkscape. |
| `datos/personajes.json` | La misma data que usa la app: cuerpo compartido, capas por especie y paletas. La lee el constructor del panel. |

## Qué cambió respecto a los originales

Los 8 archivos traían el mismo cuerpo repetido y unos 104 KB de trazos invisibles. Al deduplicar y limpiar, la data de trazos bajó de **518 KB a 137 KB**, y los 8 personajes ahora comparten:

- un solo polo (250 trazos)
- un solo par de brazos, short y zapatillas
- una sola montura de lentes

Todos quedaron alineados al mismo lienzo (`viewBox="-46 118 904 1268"`), con la misma línea de piso y los lentes a la misma altura. Cambiar el polo o las zapatillas ahora se hace en un solo lugar y se refleja en las 8 especies.

## Capas con nombre

Cada SVG está ordenado en grupos que puedes ocultar, animar o intercambiar:

```
#personaje
  #cola          solo gatito, mapachito y monito
  #cuerpo        short y zapatillas
  #brazo-izq  #brazo-der
  #pecho         pelaje que asoma del cuello (gatito y perrito)
  #polo
  #logo          ranura del logo
  #cabeza        rostro, con cada ojo en un <g class="ojo">
  #lentes
```

## Sistema de color

Los colores de uniforme son fijos y se cambian directo:

`--shirt` `--pants` `--shoe` `--shoeInk` `--glass` `--logo` `--ink` `--eye` `--eyeHi` `--shirtShade`

Ojo con `--shoeInk`: el contorno del pantalón y el de las zapatillas son **un solo trazo compuesto**, separado del contorno del cuerpo (`--ink`). Si cambias `--ink` por tu cuenta y olvidas `--shoeInk`, esas líneas se quedan atrás. En la app el control de contorno mueve los dos, dejando `--shoeInk` un 71 % más oscuro, que es la relación del dibujo original.

Los del pelaje son por especie y se llaman `--f0`, `--f1`, `--f2`… (`--f0` es el color base) y `--p0`, `--p1` para rosados de mejillas y orejas.

Para recolorear una especie completa basta con cambiar `--f0`: la app recalcula los demás guardando la relación original de cada uno con el base. Así el antifaz del mapache sigue siendo más oscuro que su cara, y la pechera del zorro sigue siendo más clara que su lomo, sin importar el color que elijas.

**El color viaja en el atributo `fill` de cada figura, nunca en clases CSS.** Un bloque `<style>` dentro de un SVG en línea no está aislado: aplica a todo el documento. Con nueve SVG en la misma página (la vista previa más las ocho miniaturas), todos definiendo `.f0`, ganaba el último y el personaje se pintaba con los colores de otra especie. El `<style>` de cada SVG ahora solo lleva animación, y va acotado a su propia raíz.

Por lo mismo, los archivos de `svg/` acotan sus reglas a un id propio (`#mascota-gatito .f0`). Puedes incrustar los ocho en una misma página sin que se pisen.

Tres reglas del cálculo, por si necesitas replicarlo fuera de la app:

- **El base sale exacto.** El color que eliges se aplica tal cual, sin recalcular. Antes se atenuaba en especies de pelaje grisáceo y el cambio casi no se notaba.
- **Luminosidad proporcional, no aditiva.** Cada tono guarda qué proporción del espacio disponible ocupa por encima o por debajo del base. Con una resta fija, un base oscuro mandaba todas las bandas a negro.
- **Saturación proporcional, no aditiva.** Si el base nuevo es más apagado que el original, los derivados bajan en la misma proporción en vez de quedarse en gris plano.
- **El matiz propio de un tono solo pesa si ese tono es de verdad colorido.** Cremas y grises adoptan el matiz del base. Es la diferencia entre un hocico crema que se vuelve crema rosado y uno que se vuelve verde menta.

La cola sale del mismo tono base en gatito y monito. En el mapachito conserva sus bandas, porque son parte del dibujo, pero las dos siguen al color elegido.

Los rosados van aparte a propósito: un gato rosado con mejillas rosadas se ve bien, uno con mejillas verdes no. En la app hay una casilla para vincularlos al pelaje cuando sí convenga.

## Ranura del logo

Rectángulo de 86,35 × 68,7 px en `x=452,2  y=945,5`. Tres modos: sin logo, recuadro de color, o imagen. La imagen se recorta al rectángulo con `preserveAspectRatio="xMidYMid meet"`, así que entra completa sin deformarse. Usa PNG o SVG con fondo transparente.

El control de tamaño va de 30 % a 220 % y escala desde el centro de la ranura, así que el logo crece sin moverse de sitio. La escala se mantiene al cambiar de especie.

## Animación

CSS puro, sin JavaScript: respiración del cuerpo, cabeceo, brazos, cola y parpadeo. Los ciclos son de duración distinta (3,4 s / 5,1 s / 4,3 s / 4,7 s / 5,6 s) para que nunca coincidan y el movimiento no se sienta mecánico.

Respeta `prefers-reduced-motion`. La app tiene además una casilla para apagarla, y el PNG siempre se exporta en pose estática.

## Elegir colores

Cada control tiene tres formas de uso: paleta de muestras visible, campo hex escribible y selector nativo del sistema. Las muestras y el campo hex funcionan en cualquier contexto, incluso donde el selector nativo del sistema no abre.

## Pendiente para v1

- El contorno del brazo derecho no era idéntico entre archivos (603 vs 604 caracteres). Tomé el del conejito para los 8; la diferencia es de décimas de píxel.
- Falta ranura de logo en la espalda y variantes de prenda (casaca, chaleco).
- Las miniaturas del selector recortan solo la cabeza. Si agregas especies con orejas más altas que las del conejito, ajusta el `viewBox` de `miniatura()`.
