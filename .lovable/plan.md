# Corregir la sombra de Tomito

## Problema

La sombra de Tomito está dibujada al fondo del lienzo, pero sus pies no llegan hasta ahí: en el arte original los zapatos terminan en y≈4407 de un lienzo de 4680.61 de alto, es decir al 94.2% de la altura. La sombra actual está en `bottom: 1.2%`, unos 4-5% por debajo de los pies, y por eso el personaje parece flotar.

Las otras mascotas (Martín, Arianna) usan los mismos valores de sombra, pero en sus lienzos los pies sí llegan casi al borde, así que ahí sí calza.

## Solución

Reposicionar la sombra de Tomito para que quede justo bajo sus zapatos y ligarla al ritmo de la animación:

- Subir la elipse hasta la línea del suelo real de Tomito (bottom ≈ 4.4%, centrada bajo los pies) y ajustar su tamaño (ancho ≈ 40%, alto ≈ 2.2%) para que sea proporcional a la base del personaje.
- Mantener la sombra fuera del grupo que hace el "bob" (ya lo está), y añadirle una pulsación sutil sincronizada con el balanceo: cuando el torso sube, la sombra se encoge y aclara levemente; cuando baja, crece y se oscurece. Eso elimina la sensación de flotar.
- Verificar el resultado en `/demoautonoma` con una captura antes/después.

## Detalles técnicos

Archivo único: `public/demo-assets/mascots/tomito/mascot.css`

- Regla `.tomito .shadow`: nuevos valores de `bottom`, `width`, `height`.
- Nueva `@keyframes tomito-shadow` (3.8s, mismo tempo que `tomito-bob`) aplicada a `.tomito .shadow`, con `scale` y `opacity` variando ~6%.

No se tocan otras mascotas ni el runtime.
