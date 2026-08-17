import { createFileRoute } from "@tanstack/react-router";
import { servePresentacion } from "@/lib/serve-presentacion.server";
import asset from "../assets/apavit-presentacion.html.asset.json";

// La presentación pesa ~15 MB (imágenes incrustadas): vive como asset y se sirve desde aquí.
const headTags = `
<link rel="icon" href="/head.png" type="image/png">
<meta property="og:title" content="Inglés para todos los agremiados · APAVIT × AprendoEnglish">
<meta property="og:description" content="Una plataforma completa de inglés, con el nombre, colores y la marca de APAVIT.">
<meta property="og:type" content="website">
<meta property="og:url" content="https://aprendoenglish.com/apavit-presentacion">
<meta property="og:image" content="https://aprendoenglish.com/social-preview.jpg">
<meta property="og:image:secure_url" content="https://aprendoenglish.com/social-preview.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:alt" content="AprendoEnglish × APAVIT">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Inglés para todos los agremiados · APAVIT × AprendoEnglish">
<meta name="twitter:description" content="Una plataforma completa de inglés, con el nombre, colores y la marca de APAVIT.">
<meta name="twitter:image" content="https://aprendoenglish.com/social-preview.jpg">
`;

export const Route = createFileRoute("/apavit-presentacion")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        return servePresentacion({
          assetUrl: asset.url,
          requestUrl: request.url,
          headTags,
        });
      },
    },
  },
});
