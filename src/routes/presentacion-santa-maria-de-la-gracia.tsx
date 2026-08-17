import { createFileRoute } from "@tanstack/react-router";
import asset from "../assets/presentacion-santa-maria-de-la-gracia.html.asset.json";
import { mascotaDelDemo } from "@/lib/presentacion-mascota";

// La presentación pesa ~28 MB (imágenes incrustadas): vive como asset y se sirve desde aquí.
const headTags = `
<link rel="icon" href="/head.png" type="image/png">
<meta property="og:title" content="Inglés para todo el colegio · Santa María de la Gracia × AprendoEnglish">
<meta property="og:description" content="Una plataforma completa de inglés, con el nombre, colores y la marca del colegio Santa María de la Gracia.">
<meta property="og:type" content="website">
<meta property="og:url" content="https://aprendoenglish.com/presentacion-santa-maria-de-la-gracia">
<meta property="og:image" content="https://aprendoenglish.com/social-preview.jpg">
<meta property="og:image:secure_url" content="https://aprendoenglish.com/social-preview.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:alt" content="AprendoEnglish × Santa María de la Gracia">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Inglés para todo el colegio · Santa María de la Gracia × AprendoEnglish">
<meta name="twitter:description" content="Una plataforma completa de inglés, con el nombre, colores y la marca del colegio Santa María de la Gracia.">
<meta name="twitter:image" content="https://aprendoenglish.com/social-preview.jpg">
`;

let cache: string | null = null;

export const Route = createFileRoute("/presentacion-santa-maria-de-la-gracia")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        if (!cache) {
          const res = await fetch(new URL(asset.url, request.url));
          if (!res.ok) return new Response("No disponible", { status: 502 });
          cache = (await res.text()).replace("<head>", `<head>${headTags}`);
        }
        const mascota = await mascotaDelDemo("santa-maria-de-la-gracia");
        const page = mascota ? cache.replace("</head>", `${mascota}</head>`) : cache;
        return new Response(page, {
          headers: { "Content-Type": "text/html; charset=utf-8" },
        });
      },
    },
  },
});
