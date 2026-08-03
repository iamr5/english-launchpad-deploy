# Pack de mascota — `boti`

**Boti**, el robot. Es la mascota que usa el demo `/democip`; se conserva como
pack propio para que ese demo siga viéndose exactamente igual que siempre.

## No lo uses como plantilla

Para crear una mascota nueva, parte de [`../ozito/`](../ozito/README.md).

Boti no se anima con CSS sino con un motor de resortes en JavaScript
(`boti.js`, `"engine": "script"`), y ese motor tiene **17 pivotes escritos a
mano en píxeles absolutos** del artboard 757.6 × 1139.5:

```js
transform(p.head, 378.8, 618, headX, headY - delight * 3.2, ...)
```

Es decir: cualquier arte de reemplazo tendría que calzar con las proporciones
exactas de Boti para que la cabeza gire donde debe. Ozzy, en cambio, usa pivotes
en porcentaje y funciona con arte de cualquier proporción.

## Estructura

| Archivo | Para qué sirve |
| --- | --- |
| `mascot.json` | Manifiesto: declara `engine: script` y el `entry` |
| `boti.js` | El personaje completo — SVG inline + motor de animación, sin dependencias |
| `boti_head.svg` | Sólo la cabeza; se usa como icono de la barra superior y en los globos |

## API

`boti.js` expone el global `Boti`:

```js
const b = Boti.mount('#slot', { interactive: true });
b.react();          // salto + guiño
b.blink(true);      // parpadeo doble
b.setIntensity(.5); // baja la amplitud de todo el movimiento
b.pause(); b.play(); b.destroy();
Boti.mountAll();    // monta todo elemento con [data-boti]
```

Mantén la proporción del contenedor en **alto = ancho × 1.504** para que no salga
aplastado.
