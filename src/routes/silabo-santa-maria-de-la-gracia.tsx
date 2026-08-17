import { createFileRoute } from "@tanstack/react-router";
import html from "../assets/silabo-santa-maria.html?raw";

// Dosier académico del Colegio Santa María de la Gracia. Mismos criterios que
// /silabo-autonoma: cifras reales del curso y demos embebidos del colegio.
const headTags = `
<link rel="icon" href="/head.png" type="image/png">
<meta property="og:title" content="Propuesta de e-learning institucional de inglés · Colegio Santa María de la Gracia">
<meta property="og:description" content="Dosier académico: 45 lecciones (391 microlecciones), 8 127 ejercicios, 11 040 palabras, A1–C1 en formato Cambridge con el MCER como marco.">
<meta property="og:type" content="website">
<meta property="og:url" content="https://aprendoenglish.com/silabo-santa-maria-de-la-gracia">
<meta property="og:image" content="https://aprendoenglish.com/social-preview.jpg">
<meta property="og:image:secure_url" content="https://aprendoenglish.com/social-preview.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:alt" content="AprendoEnglish × Colegio Santa María de la Gracia">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Propuesta de e-learning institucional de inglés · Colegio Santa María de la Gracia">
<meta name="twitter:description" content="Dosier académico: 45 lecciones (391 microlecciones), 8 127 ejercicios, 11 040 palabras, A1–C1 en formato Cambridge con el MCER como marco.">
<meta name="twitter:image" content="https://aprendoenglish.com/social-preview.jpg">
`;

const htmlWithMeta = html.replace("<head>", `<head>${headTags}`);

export const Route = createFileRoute("/silabo-santa-maria-de-la-gracia")({
  server: {
    handlers: {
      GET: async () =>
        new Response(htmlWithMeta, {
          headers: { "Content-Type": "text/html; charset=utf-8" },
        }),
    },
  },
});
