import { createFileRoute } from "@tanstack/react-router";
import asset from "../assets/presentacion-bcp.html.asset.json";
import { mascotaDelDemo } from "@/lib/presentacion-mascota";

// La presentación pesa ~25 MB (imágenes incrustadas): vive como asset y se sirve desde aquí.
const headTags = `
<link rel="icon" href="/head.png" type="image/png">
<meta property="og:title" content="Inglés para toda la organización · BCP × AprendoEnglish">
<meta property="og:description" content="Una plataforma completa de inglés, con el nombre, colores y la marca de BCP.">
<meta property="og:type" content="website">
<meta property="og:url" content="https://aprendoenglish.com/presentacion-bcp">
<meta property="og:image" content="https://aprendoenglish.com/social-preview.jpg">
<meta property="og:image:secure_url" content="https://aprendoenglish.com/social-preview.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:alt" content="AprendoEnglish × BCP">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Inglés para toda la organización · BCP × AprendoEnglish">
<meta name="twitter:description" content="Una plataforma completa de inglés, con el nombre, colores y la marca de BCP.">
<meta name="twitter:image" content="https://aprendoenglish.com/social-preview.jpg">
`;

let cache: string | null = null;

export const Route = createFileRoute("/presentacion-bcp")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        if (!cache) {
          const res = await fetch(new URL(asset.url, request.url));
          if (!res.ok) return new Response("No disponible", { status: 502 });
          cache = (await res.text()).replace("<head>", `<head>${headTags}`);
        }
        // La mascota sale del demo de la marca, así que se resuelve en cada
        // respuesta: si cambia en /demos, la presentación la toma sola.
        const mascota = await mascotaDelDemo("demobcp");
        const page = mascota ? cache.replace("</head>", `${mascota}</head>`) : cache;
        return new Response(page, {
          headers: { "Content-Type": "text/html; charset=utf-8" },
        });
      },
    },
  },
});
