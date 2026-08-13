# Presentaciones AJE, BCP, La Tinka y Repsol

## Qué se publica

Cada HTML subido se sirve tal cual, en la ruta que corresponde a su nombre:

- `aprendoenglish.com/presentacion-aje` → `presentacion-aje.html`
- `aprendoenglish.com/presentacion-bcp` → `presentacion-bcp.html`
- `aprendoenglish.com/presentacion-la-tinka` → `presentacion-la-tinka.html`
- `aprendoenglish.com/presentacion-repsol` → `presentacion-repsol.html`

(Rutas sin tilde, para que el enlace no se rompa al compartirlo.)

## Único cambio al HTML

El CTA del penúltimo slide hoy no lleva a ningún lado:

```text
<a class="hook-cta" href="#" onclick="return false;">VER PLATAFORMA</a>
```

Pasa a apuntar al demo de cada marca:

- AJE → `https://www.aprendoenglish.com/demoaje`
- BCP → `https://www.aprendoenglish.com/demobcp`
- La Tinka → `https://www.aprendoenglish.com/demolatinka`
- Repsol → `https://www.aprendoenglish.com/demorepsol`

Nada más se toca del diseño ni del contenido.

## Detalles técnicos

- Cada archivo pesa ~25 MB (imágenes incrustadas), así que va como asset externo
  (`src/assets/presentacion-<marca>.html.asset.json`), igual que `/apavit-presentacion`.
- Una ruta por marca (`src/routes/presentacion-aje.tsx`, etc.) con handler GET que
  devuelve el HTML con `Content-Type: text/html` y caché en memoria.
- Se inyecta en el `<head>` el favicon `/head.png` y las etiquetas Open Graph / Twitter
  (título con el nombre de la marca, descripción, `og:image` a
  `https://aprendoenglish.com/social-preview.jpg`) para que el enlace se vea bien en WhatsApp.

## Notas

- Movistar y NUAM: no llegaron sus HTML en esta subida, así que quedan pendientes.
- Los demos `/demoaje`, `/demobcp`, `/demolatinka` y `/demorepsol` aún no existen: hay que
  crearlos desde `/demos` para que el botón no caiga en «demo no encontrado».
