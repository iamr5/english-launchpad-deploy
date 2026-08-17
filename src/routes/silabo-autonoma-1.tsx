import { createFileRoute } from "@tanstack/react-router";
import html from "../assets/silabo-autonoma-1.html?raw";

// Versión corta del dosier de la Autónoma: mismas cifras y demos reales,
// pero con las secciones repetitivas fusionadas.
const headTags = `
<link rel="icon" href="/head.png" type="image/png">
<meta property="og:title" content="Sílabo de inglés (versión breve) · Universidad Autónoma del Perú">
<meta property="og:description" content="Versión resumida del dosier: 45 lecciones (391 microlecciones), 8 127 ejercicios, A1–C1 alineado al MCER, con demos reales de la plataforma.">
<meta property="og:type" content="website">
<meta property="og:url" content="https://aprendoenglish.com/silabo-autonoma-1">
<meta property="og:image" content="https://aprendoenglish.com/social-preview.jpg">
<meta property="og:image:secure_url" content="https://aprendoenglish.com/social-preview.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:alt" content="AprendoEnglish × Universidad Autónoma del Perú">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Sílabo de inglés (versión breve) · Universidad Autónoma del Perú">
<meta name="twitter:description" content="Versión resumida del dosier: 45 lecciones (391 microlecciones), 8 127 ejercicios, A1–C1 alineado al MCER, con demos reales de la plataforma.">
<meta name="twitter:image" content="https://aprendoenglish.com/social-preview.jpg">
`;

const htmlWithMeta = html.replace("<head>", `<head>${headTags}`);

export const Route = createFileRoute("/silabo-autonoma-1")({
  server: {
    handlers: {
      GET: async () =>
        new Response(htmlWithMeta, {
          headers: { "Content-Type": "text/html; charset=utf-8" },
        }),
    },
  },
});
