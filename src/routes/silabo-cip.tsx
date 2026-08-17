import { createFileRoute } from "@tanstack/react-router";
import html from "../assets/silabo-cip.html?raw";

// Dosier académico del Colegio de Ingenieros del Perú. Los previsualizadores
// de la sección «cómo lo viviría el colegiado» son iframes al demo real
// (/democip y /democip/dashboard), no maquetas.
const headTags = `
<link rel="icon" href="/head.png" type="image/png">
<meta property="og:title" content="Programa de inglés A1–C1 para el ingeniero colegiado · Colegio de Ingenieros del Perú">
<meta property="og:description" content="Sílabo y dosier académico: 45 lecciones (391 microlecciones), 8 127 ejercicios y 11 040 palabras, A1–C1 sobre el MCER, con inglés técnico por especialidad.">
<meta property="og:type" content="website">
<meta property="og:url" content="https://aprendoenglish.com/silabo-cip">
<meta property="og:image" content="https://aprendoenglish.com/social-preview.jpg">
<meta property="og:image:secure_url" content="https://aprendoenglish.com/social-preview.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:alt" content="AprendoEnglish × Colegio de Ingenieros del Perú">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Programa de inglés A1–C1 para el ingeniero colegiado · Colegio de Ingenieros del Perú">
<meta name="twitter:description" content="Sílabo y dosier académico: 45 lecciones (391 microlecciones), 8 127 ejercicios y 11 040 palabras, A1–C1 sobre el MCER, con inglés técnico por especialidad.">
<meta name="twitter:image" content="https://aprendoenglish.com/social-preview.jpg">
`;

const htmlWithMeta = html.replace("<head>", `<head>${headTags}`);

export const Route = createFileRoute("/silabo-cip")({
  server: {
    handlers: {
      GET: async () =>
        new Response(htmlWithMeta, {
          headers: { "Content-Type": "text/html; charset=utf-8" },
        }),
    },
  },
});
