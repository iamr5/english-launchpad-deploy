# Sílabo Autónoma en /silabo-autonoma

## Qué se publica

El dosier `Silabo_AprendoEnglish_Dosier_Academico_v8.html` se sirve en
`aprendoenglish.com/silabo-autonoma`, con favicon `/head.png` y tarjeta de vista previa
(Open Graph / Twitter) para que el enlace se vea bien al compartirlo por WhatsApp.

## Los previsualizadores pasan a ser demos reales

Hoy la sección «Primero, veamos cómo lo viviría el alumno» son maquetas dibujadas a mano
(una ventana de navegador y un celular de mentira, con lecciones inventadas). Se
reemplazan por el demo real de la Universidad Autónoma del Perú, que ya existe:

| Marco | Qué se carga |
| --- | --- |
| Previsualizador web (escritorio) | `/demoautonoma` — el curso real, a lo ancho |
| Previsualizador app (celular) | `/demoautonoma` — el mismo curso, en ancho de móvil |
| **Nueva sección: lo que ve el profesor** | `/demoautonoma/dashboard` — el reporte de aula real |

Se conserva el marco visual actual (barra de navegador, bisel del celular, etiquetas):
sólo cambia el contenido de adentro, que pasa a ser el demo vivo.

## Cómo se comportan

- **Interactivos**: se puede hacer clic, avanzar lecciones y navegar dentro del marco.
- **Expandibles**: botón «Ampliar» que lleva el marco a pantalla completa sobre la página,
  y se cierra con la X o con Esc.
- **Abrir en otra pestaña**: botón junto a cada etiqueta que abre el demo en una pestaña nueva.
- En celulares reales, los tres marcos se apilan y se cargan sólo cuando el lector llega a
  la sección, para que la página no pese al abrirla.

## Detalles técnicos

- Copiar el HTML a `src/assets/silabo-autonoma.html` (pesa 260 KB, cabe en el repo).
- Nueva ruta `src/routes/silabo-autonoma.tsx` con handler GET que devuelve el HTML como
  `text/html`, siguiendo la forma de `src/routes/cip.tsx`.
- Añadir `"silabo-autonoma"` a `RESERVED_SLUGS` en `src/lib/demo-config.ts` para que nadie
  cree un demo que tape esta URL.
- Dentro de la sección `#demo-preview`: sustituir los bloques `.demo-screen` y
  `.phone-content` por `<iframe loading="lazy" src="/demoautonoma">`, con el iframe del
  celular escalado al ancho del bisel. Añadir una tercera tarjeta con
  `src="/demoautonoma/dashboard"`, más el CSS y el pequeño script de ampliar/cerrar
  (unas 40 líneas, inline en el mismo archivo, sin dependencias).
- El resto del dosier —contenido académico, tipografías, colores— no se toca.
