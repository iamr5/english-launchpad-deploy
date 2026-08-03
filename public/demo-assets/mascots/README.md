# Mascotas

Cada mascota vive en su propia carpeta y se describe por completo en su
`mascot.json`. Nada de la mascota está escrito dentro de la app: se cambia
eligiendo otro pack, sin tocar código.

| Pack | Personaje | Motor | Sirve de plantilla |
| --- | --- | --- | --- |
| [`ozito/`](ozito/README.md) | Ozzy el Osito 🐻 | capas SVG + CSS | **Sí — empieza aquí** |
| [`boti/`](boti/README.md) | Boti 🤖 | script (`boti.js`) | No |

`mascot-runtime.js` es el cargador común: lee un manifiesto y arma el DOM de la
mascota. Para packs de capas construye el stack; para packs de script carga el
`entry` y delega en su global.

## Crear una mascota

Copia `ozito/`, cambia el arte y los pivotes, compruébalo con su `preview.html`,
súbelo como `.zip` desde el panel de demos. El paso a paso está en
[`ozito/README.md`](ozito/README.md).

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
