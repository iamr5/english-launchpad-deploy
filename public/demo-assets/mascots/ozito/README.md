# Pack de mascota — `ozito`

**Ozzy el Osito**, la mascota por defecto de AprendoEnglish. Este pack es también
la **plantilla**: para crear otra mascota, copia esta carpeta, cambia el arte y
sube el resultado desde el panel de demos.

## Qué hay aquí

| Archivo | Para qué sirve | ¿Lo tocas? |
| --- | --- | --- |
| `mascot.json` | El manifiesto: nombre, artboard, capas y en qué orden se apilan | **Sí** |
| `mascot.css` | La animación (respiración, cabeceo, brazos, piernas) | **Sí** |
| `layers/*.svg` | El arte, una capa por archivo | **Sí** |
| `preview.html` | Ábrelo para ver la mascota animada antes de subirla | No |

## Cómo hacer tu propia mascota

### 1. Dibuja las capas

Una capa = un archivo SVG. **Todas las capas se dibujan del mismo tamaño y
superpuestas**, como acetatos: cada SVG ocupa el lienzo completo y dentro de él
la pieza va en su sitio. No recortes los SVG al contorno de la pieza — si lo
haces, se descolocan.

Las capas de Ozzy son:

```
body      el cuerpo                 leftarm    brazo izquierdo
div       el detalle del pecho      rightarm   brazo derecho
head      la cabeza                 leftleg    pierna izquierda
glasses   los lentes                rightleg   pierna derecha
bowtie    el moño
tummy     la panza
```

No estás obligado a usar estos nombres ni esta cantidad: son los que declara
`mascot.json`. Si tu personaje no tiene lentes, borra esa capa del manifiesto y
del CSS. Si tiene cola, agrégala.

### 2. Ajusta `mascot.json`

```json
"artboard": { "width": 416.52, "height": 613.16 }
```

El `viewBox` de tus SVG. De aquí sale la proporción alto/ancho: la app fija el
**ancho** de la mascota y deriva el alto, para que nunca salga aplastada.

```json
"layers": { "head": "layers/head.svg" }
```

Nombre de capa → archivo.

```json
"stack": [ { "group": "torso", "children": [ { "layer": "body" } ] } ]
```

El orden de apilado, de atrás hacia adelante. Tres tipos de nodo:

- `{ "layer": "head" }` — una capa
- `{ "group": "torso", "children": [...] }` — un grupo que se anima junto
- `{ "wrapper": "glassesfollow", "children": [...] }` — un envoltorio para que
  una pieza siga a otra (los lentes siguen a la cabeza)

### 3. Ajusta `mascot.css`

Cada capa se anima por su nombre de clase. Lo único que casi siempre hay que
cambiar es el **pivote** de cada pieza:

```css
.tr-bear .head { transform-origin: 49.9% 47.3%; animation: ozito-head 3.6s ease-in-out infinite; }
```

Los pivotes van en **porcentaje** del lienzo, no en píxeles: así la mascota se ve
igual a cualquier tamaño. `49.9% 47.3%` es el punto del cuello de Ozzy — el sitio
donde una cabeza real gira. Busca el equivalente en tu personaje.

Si renombras los `@keyframes`, mantén un prefijo propio (`ozito-`, `gatito-`, …).
Sin prefijo, dos mascotas instaladas a la vez se pisan las animaciones.

### 4. Pruébalo

```sh
# desde esta carpeta
python -m http.server 8000
# abre http://localhost:8000/preview.html
```

El panel lateral lista cada capa como `ok` o `falta`, y el deslizador cambia el
tamaño — así verificas que nada se descoloca al escalar. Es el mismo criterio que
aplica el validador cuando subes el pack.

### 5. Súbelo

Comprime la carpeta en un `.zip` y súbela desde el panel de demos. El validador
rechaza el pack si:

- falta `mascot.json` o no cumple el esquema;
- alguna capa declarada no tiene archivo;
- un SVG trae `<script>` o referencias a dominios externos;
- el CSS trae `@import` o `url()` remoto.

## Detalle técnico

`mascot-runtime.js` (una carpeta más arriba) lee el manifiesto y construye el DOM.
Para `ozito` produce exactamente el mismo markup que generaba el antiguo
`mascotHTML()` escrito a mano, así que la animación calza sin cambios.

Las mascotas basadas en script en vez de capas (como `boti`) declaran
`"engine": "script"` y su propio `entry`. Ver `../boti/mascot.json`.
