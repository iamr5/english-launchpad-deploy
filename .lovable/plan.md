# Presentación Universidad Autónoma en /autonoma-presentacion

## Qué se publica

El archivo subido (`AprendoEnglish_Universidad_Autonoma_Peru_v9.html`) se sirve tal cual en
`aprendoenglish.com/autonoma-presentacion`, igual que ya se hace con `/cip` y `/CIP-presenta`.

## Único cambio al HTML

El botón del último slide hoy no lleva a ningún lado:

```text
<a class="demo-cta" href="javascript:void(0)">Empezar demo</a>
```

Pasa a apuntar al demo:

```text
<a class="demo-cta" href="https://www.aprendoenglish.com/demoautonoma">Empezar demo</a>
```

Nada más se toca del diseño ni del contenido.

## Detalles técnicos

- Copiar el HTML a `src/assets/autonoma-presentacion.html` (con el href corregido).
- Nueva ruta `src/routes/autonoma-presentacion.tsx`, misma forma que `src/routes/CIP-presenta.tsx`:
  handler GET que devuelve el HTML con `Content-Type: text/html`.
- Inyectar en el `<head>` el favicon `/head.png` y las etiquetas Open Graph / Twitter
  (título, descripción, `og:image` a `https://aprendoenglish.com/social-preview.jpg`, ancho/alto)
  para que el enlace se vea bien al compartirlo por WhatsApp.

## Nota

El demo `/demoautonoma` no existe todavía: hay que crearlo desde `/demos` (o decirme el slug
correcto) para que el botón no caiga en la página de «demo no encontrado».
