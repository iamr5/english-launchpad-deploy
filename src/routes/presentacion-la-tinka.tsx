import { createFileRoute } from "@tanstack/react-router";
import { servePresentacion } from "@/lib/serve-presentacion.server";
import asset from "../assets/presentacion-la-tinka.html.asset.json";
import { mascotaDelDemo } from "@/lib/presentacion-mascota";

// La presentación pesa ~25 MB (imágenes incrustadas): vive como asset y se sirve desde aquí.
const headTags = `
<link rel="icon" href="/head.png" type="image/png">
<meta property="og:title" content="Inglés para toda la organización · La Tinka × AprendoEnglish">
<meta property="og:description" content="Una plataforma completa de inglés, con el nombre, colores y la marca de La Tinka.">
<meta property="og:type" content="website">
<meta property="og:url" content="https://aprendoenglish.com/presentacion-la-tinka">
<meta property="og:image" content="https://aprendoenglish.com/social-preview.jpg">
<meta property="og:image:secure_url" content="https://aprendoenglish.com/social-preview.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:alt" content="AprendoEnglish × La Tinka">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Inglés para toda la organización · La Tinka × AprendoEnglish">
<meta name="twitter:description" content="Una plataforma completa de inglés, con el nombre, colores y la marca de La Tinka.">
<meta name="twitter:image" content="https://aprendoenglish.com/social-preview.jpg">
`;

export const Route = createFileRoute("/presentacion-la-tinka")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const mascota = await mascotaDelDemo("demolatinka");
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
