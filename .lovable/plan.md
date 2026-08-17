# Sumar al niño y la niña del uniforme como mascotas

Los dos personajes que subiste son ilustraciones completas y planas: un niño y una niña con el uniforme del colegio (polo amarillo, buzo azul, escudo bordado). No encajan en el constructor —ahí cada personaje es un animal recoloreable por tokens— así que entran como **packs de mascota incorporados**, al mismo nivel que Ozzy, Boti y Gallito: aparecen en la parrilla de «Personaje» de `/demos` y cualquier demo puede elegirlos.

## Qué voy a hacer

### 1. Separar el dibujo en capas

Cada uno viene como un solo dibujo. Lo parto en las piezas que el motor de mascotas necesita para moverlo: cabello de atrás, piernas, torso con polo, brazo izquierdo, brazo derecho, cabeza (con cara y cabello) y ojos aparte. El corte se hace por zonas del lienzo, sin retocar el arte: los colores, el escudo y el trazo quedan idénticos.

### 2. Animarlos con el mismo tratamiento

Misma animación suave que ya tienen Ozzy y Gallito, sin exagerar:

- respiración del torso (sube y baja, giro mínimo),
- brazos en péndulo lento y desfasado uno del otro,
- piernas que se estiran desde el pie plantado, sin despegarse del piso,
- cabeceo de la cabeza sobre el cuello,
- parpadeo en su propio ciclo, desacompasado del cabeceo,
- la coleta de la niña acompaña con retraso, para que se note el peso,
- sombra de piso, como los demás.

### 3. Que salgan en la lista

Los dos aparecen en la parrilla de «Personaje» con su ícono de cabeza, su nombre y su nota, junto a Ozzy, Boti y Gallito. Al elegir uno, el demo lo usa en el mapa, los globos y la barra superior, y su nombre y emoji entran en el texto del curso donde hoy dice «Ozzy».

Nombres propuestos —dime si prefieres otros—: **Mateo** 🧒 y **Luana** 👧, ambos como «compañero de clase» / «compañera de clase».

### 4. Comprobación

Abro cada pack en su `preview.html` y en un demo real, a tamaño mapa y a tamaño globo, y reviso que ninguna capa se descoloque al escalar y que el parpadeo y el cabeceo no caigan siempre en el mismo punto.

## Detalle técnico

- Nuevas carpetas `public/demo-assets/mascots/mateo/` y `.../luana/` con `mascot.json`, `mascot.css`, `head-icon.svg`, `preview.html` y `layers/*.svg`, calcadas de `gallito/`.
- El corte se hace con un script de una sola pasada: se parsean los `<path>` del SVG original, se mide la caja de cada uno y se reparten por bandas verticales/horizontales del lienzo (`0 0 1427.48 2886.26`) a `hairback`, `legs`, `body`, `armL`, `armR`, `head`, `eyes`. Cada capa conserva el `viewBox` completo, que es lo que permite apilarlas como acetatos. El bloque `<style>` de clases `.cls-*` se copia a cada capa (con prefijo por capa para que no colisionen entre archivos).
- `mascot.json`: `engine: "layers"`, `rootClass` propio (`ninio-mateo` / `ninia-luana`), `artboard { width: 1427.48, height: 2886.26 }`, `shadow: true`, `stack` con `torso` → `legs` → `torso` (body, armL, armR, `headbob`[head, eyes]).
- `mascot.css`: pivotes en porcentaje del lienzo (cuello ~48%, pie plantado ~97%, hombros ~55%), keyframes tomados de `ozito/mascot.css` con tiempos primos entre sí (3,4 s torso · 4,1 s brazos · 5,9 s parpadeo) para que no se sincronicen.
- `src/lib/mascot-packs.ts`: dos imports más y dos líneas en `BUILT_IN_PACKS` + `NOTES`. Nada más: el panel y el servidor ya leen de ahí.
- Los SVG originales entran al repo sólo como fuente de corte; en el pack quedan las capas ya recortadas y minificadas.
