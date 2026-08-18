import { createFileRoute } from "@tanstack/react-router";
import { servePresentacion } from "@/lib/serve-presentacion.server";
import { mascotaDelDemo } from "@/lib/presentacion-mascota";
import asset from "../assets/autonoma-presentacion.html.asset.json";

// La presentación pesa ~14 MB (las imágenes van incrustadas), así que no vive en
// el repo: se guarda como asset y se sirve desde aquí con sus cabeceras propias.
const headTags = `
<link rel="icon" href="/head.png" type="image/png">
<meta property="og:title" content="Inglés para todos · Universidad Autónoma del Perú × AprendoEnglish">
<meta property="og:description" content="Una plataforma completa de inglés, con el nombre, colores y la marca de la Universidad Autónoma del Perú.">
<meta property="og:type" content="website">
<meta property="og:url" content="https://aprendoenglish.com/autonoma-presentacion">
<meta property="og:image" content="https://aprendoenglish.com/social-preview.jpg">
<meta property="og:image:secure_url" content="https://aprendoenglish.com/social-preview.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:alt" content="AprendoEnglish × Universidad Autónoma del Perú">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Inglés para todos · Universidad Autónoma del Perú × AprendoEnglish">
<meta name="twitter:description" content="Una plataforma completa de inglés, con el nombre, colores y la marca de la Universidad Autónoma del Perú.">
<meta name="twitter:image" content="https://aprendoenglish.com/social-preview.jpg">
`;

export const Route = createFileRoute("/autonoma-presentacion")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        // Boti se cambia por Tomito, la mascota del demo de la Autónoma.
        const mascota = await mascotaDelDemo("demoautonoma");
        return servePresentacion({
          assetUrl: asset.url,
          requestUrl: request.url,
          headTags,
          extraHead: mascota || undefined,
        });
      },
    },
  },
});
