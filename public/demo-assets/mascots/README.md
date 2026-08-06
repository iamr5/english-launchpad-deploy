# Mascotas

Cada mascota vive en su propia carpeta y se describe por completo en su
`mascot.json`. Nada de la mascota está escrito dentro de la app: se cambia
eligiendo otro pack, sin tocar código.

| Pack | Personaje | Motor | Sirve de plantilla |
| --- | --- | --- | --- |
| [`ozito/`](ozito/README.md) | Ozzy el Osito 🐻 | capas SVG + CSS | **Sí — empieza aquí** |
| [`boti/`](boti/README.md) | Boti 🤖 | script (`boti.js`) | No |
| [`gallito/`](gallito/README.md) | Gallito el Tumi ✨ | capas SVG + CSS | Sí, igual que ozito |

[`escribimos/`](escribimos/README.md) no es un pack: es la data de ocho personajes
—conejito, gatito, llamita, mapachito, monito, osito, perrito y zorrito— y el
constructor que los arma. No sale en la lista de mascotas incorporadas porque no hay
una mascota que elegir, sino ocho que colorear; el pack se genera al usarla.

`mascot-runtime.js` es el cargador común: lee un manifiesto y arma el DOM de la
mascota. Para packs de capas construye el stack; para packs de script carga el
`entry` y delega en su global.

## Crear una mascota

Desde **`/demos` → pestaña Mascota**, sin dibujar nada:

**Diseñar una mascota** — ocho personajes ya dibujados a los que se les elige el
pelaje, el uniforme y el logo del polo. *Usar esta mascota* arma el pack y lo guarda
como mascota propia del demo. Es el camino corto, y para la mayoría de instituciones
es suficiente. Los personajes y el porqué del cálculo de color, en
[`escribimos/README.md`](escribimos/README.md).

Y dibujando el personaje entero:

1. **Descargar plantilla** — el andamiaje completo (capas, pivotes, animación,
   `preview.html`) con siluetas de relleno en vez del arte. También está
   *Descargar Ozito completo* si prefieres partir del oso ya dibujado.
2. Redibuja los SVG y ajusta los pivotes. El paso a paso, en
   [`ozito/README.md`](ozito/README.md).
3. Compruébalo abriendo `preview.html` desde un servidor local.
4. **Subir pack .zip**. Se valida antes de guardar nada y, si algo falla, dice
   exactamente qué archivo y por qué.

Un pack subido no vive en esta carpeta: sus archivos van al almacenamiento y su
manifiesto se copia dentro de la configuración del demo, para que el servidor
pueda pintar la página sin ir a buscarlo.

Las carpetas de aquí son los packs **incorporados**, disponibles para todos los
demos sin subir nada.

## El manifiesto, campo por campo

| Campo | Obligatorio | Qué es |
| --- | --- | --- |
| `id` | sí | Identificador en minúsculas, sin espacios. Debe coincidir con el nombre de la carpeta. |
| `name` | sí | Nombre visible: «Ozzy el Osito» |
| `shortName` | sí | Cómo se le llama dentro de las lecciones: «Ozzy» |
| `kind` | sí | Qué es, para el texto del curso: «osito guía», «robot guía» |
| `emoji` | sí | El emoji que lo acompaña en el texto |
| `engine` | sí | `layers` (capas + CSS) o `script` (JS propio) |
| `artboard` | sí | `{ width, height }` del SVG. De aquí sale la proporción. |
| `headIcon` | sí | Icono de sólo la cabeza, para la barra superior y los globos |
| `css` | capas | Hoja con la animación |
| `rootClass` | capas | Clase raíz bajo la que cuelga todo el CSS |
| `layers` | capas | Nombre de capa → archivo |
| `stack` | capas | Árbol de apilado, de atrás hacia adelante |
| `shadow` | capas | Si se dibuja la sombra de piso |
| `entry` | script | Archivo JS a cargar |
| `global` | script | Nombre del global que expone ese archivo |

`shortName`, `kind` y `emoji` no son decorativos: el texto del curso menciona a la
mascota por su nombre unas 100 veces por lección, y esos tres campos son los que
se sustituyen en las plantillas del contenido.
