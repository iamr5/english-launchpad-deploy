import { createFileRoute } from "@tanstack/react-router";
import html from "../assets/cip.html?raw";

// La presentación de ventas del CIP. Vivía en /cip hasta que ese enlace pasó a
// ser el landing de preinscripción.

const headTags = `
<link rel="icon" href="/head.png" type="image/png">
<meta property="og:title" content="Todos los Ingenieros del Perú hablarán Inglés en 1 año · AprendoEnglish × CIP">
<meta property="og:description" content="El Colegio de ingenieros tendrá su propia plataforma completa de inglés, con el nombre, colores y la marca del Colegio de Ingenieros">
<meta property="og:type" content="website">
<meta property="og:image" content="https://aprendoenglish.com/social-preview.jpg">
<meta property="og:image:secure_url" content="https://aprendoenglish.com/social-preview.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:alt" content="AprendoEnglish × CIP">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Todos los Ingenieros del Perú hablarán Inglés en 1 año · AprendoEnglish × CIP">
<meta name="twitter:description" content="El Colegio de ingenieros tendrá su propia plataforma completa de inglés, con el nombre, colores y la marca del Colegio de Ingenieros">
<meta name="twitter:image" content="https://aprendoenglish.com/social-preview.jpg">
`;

const htmlWithMeta = html.replace("<head>", `<head>${headTags}`);

export const Route = createFileRoute("/cip-presentacion")({
  server: {
    handlers: {
      GET: async () =>
        new Response(htmlWithMeta, {
          headers: { "Content-Type": "text/html; charset=utf-8" },
        }),
    },
  },
});
