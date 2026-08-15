import { createFileRoute } from "@tanstack/react-router";
import html from "../assets/silabo-autonoma.html?raw";

// Dosier académico de la Universidad Autónoma del Perú. Los previsualizadores
// de la sección «cómo lo viviría el alumno» son iframes al demo real
// (/demoautonoma y /demoautonoma/dashboard), no maquetas.
const headTags = `
<link rel="icon" href="/head.png" type="image/png">
<meta property="og:title" content="Propuesta de e-learning institucional de inglés · Universidad Autónoma del Perú">
<meta property="og:description" content="Sílabo y dosier académico: 45 lecciones (391 microlecciones), 8 127 ejercicios, A1–C1 alineado al MCER, con la marca de la Universidad Autónoma del Perú.">
<meta property="og:type" content="website">
<meta property="og:url" content="https://aprendoenglish.com/silabo-autonoma">
<meta property="og:image" content="https://aprendoenglish.com/social-preview.jpg">
<meta property="og:image:secure_url" content="https://aprendoenglish.com/social-preview.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:alt" content="AprendoEnglish × Universidad Autónoma del Perú">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Propuesta de e-learning institucional de inglés · Universidad Autónoma del Perú">
<meta name="twitter:description" content="Sílabo y dosier académico: 45 lecciones (391 microlecciones), 8 127 ejercicios, A1–C1 alineado al MCER, con la marca de la Universidad Autónoma del Perú.">
<meta name="twitter:image" content="https://aprendoenglish.com/social-preview.jpg">
`;

const htmlWithMeta = html.replace("<head>", `<head>${headTags}`);

export const Route = createFileRoute("/silabo-autonoma")({
  server: {
    handlers: {
      GET: async () =>
        new Response(htmlWithMeta, {
          headers: { "Content-Type": "text/html; charset=utf-8" },
        }),
    },
  },
});
