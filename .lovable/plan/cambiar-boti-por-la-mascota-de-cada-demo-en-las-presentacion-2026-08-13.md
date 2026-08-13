# Cambiar Boti por la mascota de cada demo en las presentaciones

Cada presentación (`/presentacion-aje`, `/presentacion-bcp`, `/presentacion-la-tinka`,
`/presentacion-repsol`) muestra hoy a **Boti**, el robot, en la portada, en un slide
intermedio y en el cierre. Pasa a mostrar la mascota que ya tiene el demo de esa marca:

| Presentación | Demo | Mascota |
| --- | --- | --- |
| AJE | `/demoaje` | Ajicito 🐵 (monito) |
| BCP | `/demobcp` | Llami 🦙 (llamita) |
| La Tinka | `/demolatinka` | Tinki 🦙 (llamita) |
| Repsol | `/demorepsol` | PampiDog 🐶 (perrito) |

Si más adelante se le cambia la mascota a un demo desde `/demos`, la presentación
la toma sola: no hay que volver a subir el HTML.

## Qué se ve

- El robot desaparece de los tres momentos donde salía y en su lugar aparece la
  mascota de la marca, con su ropa, colores y logo, del mismo tamaño y en el mismo
  sitio (portada junto al logotipo, esquina del slide de beneficios, y centro del cierre).
- La proporción del hueco se ajusta a cada mascota para que no salga estirada.
- Conserva su animación de reposo (respira y se balancea), la misma del demo.
  Se pierde el seguimiento del cursor, que era exclusivo del motor de Boti.

## Cómo se hace

- No se toca el HTML subido (pesa ~25 MB y vive como asset). El reemplazo se
  inyecta al servirlo, en las rutas `src/routes/presentacion-*.tsx`.
- Cada ruta lee la configuración de su demo con `getDemoConfig(slug)` y saca de ahí
  el `baseUrl` del pack, el manifiesto y el artboard.
- Se inyecta antes de `</head>`:
  - el `mascot.css` del pack,
  - CSS que oculta `#boti-svg` y fija `.boti-slot{aspect-ratio: ancho/alto}` del pack,
  - un script corto que, al cargar, monta el markup del pack dentro de `#boti-host`
    (mismo patrón que `mascot-runtime.js`: contenedor con la clase raíz y capas del
    `stack`) y desactiva `window.BotiAnimation` si existe.
- El HTML ya mueve `#boti-host` de slot en slot, así que el reposicionamiento por
  slide sigue funcionando sin cambios.
- La caché en memoria de cada ruta pasa a guardar el HTML base sin la inyección,
  para que un cambio de mascota en `/demos` se refleje sin reiniciar.
