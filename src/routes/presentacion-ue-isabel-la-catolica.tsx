import { createFileRoute } from "@tanstack/react-router";
import { servePresentacion } from "@/lib/serve-presentacion.server";
import asset from "../assets/presentacion-ue-isabel-la-catolica.html.asset.json";
import { mascotaDelDemo } from "@/lib/presentacion-mascota";

// La presentación pesa ~26 MB (imágenes incrustadas): vive como asset y se sirve desde aquí.
const DEMO_URL = "https://www.aprendoenglish.com/demo-isabel-la-catolica";

const headTags = `
<link rel="icon" href="/head.png" type="image/png">
<meta property="og:title" content="Inglés para todo el colegio · U.E. Isabel La Católica × AprendoEnglish">
<meta property="og:description" content="Una plataforma completa de inglés, con el nombre, colores y la marca de la U.E. Isabel La Católica.">
<meta property="og:type" content="website">
<meta property="og:url" content="https://aprendoenglish.com/presentacion-ue-isabel-la-catolica">
<meta property="og:image" content="https://aprendoenglish.com/social-preview.jpg">
<meta property="og:image:secure_url" content="https://aprendoenglish.com/social-preview.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:alt" content="AprendoEnglish × U.E. Isabel La Católica">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Inglés para todo el colegio · U.E. Isabel La Católica × AprendoEnglish">
<meta name="twitter:description" content="Una plataforma completa de inglés, con el nombre, colores y la marca de la U.E. Isabel La Católica.">
<meta name="twitter:image" content="https://aprendoenglish.com/social-preview.jpg">
<script>
// El CTA del penúltimo slide llega sin destino (href="#" y onclick que lo anula):
// se apunta al demo del colegio sin reeditar el HTML original.
(function () {
  var URL_DEMO = ${JSON.stringify(DEMO_URL)};
  function enlazar() {
    var ctas = document.querySelectorAll('a.hook-cta, a[href="#"]');
    for (var i = 0; i < ctas.length; i++) {
      var a = ctas[i];
      a.setAttribute('href', URL_DEMO);
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener');
      a.onclick = null;
      a.removeAttribute('onclick');
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enlazar);
  } else {
    enlazar();
  }
  window.addEventListener('load', enlazar);
})();
</script>
`;

export const Route = createFileRoute("/presentacion-ue-isabel-la-catolica")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const mascota = await mascotaDelDemo("demo-isabel-la-catolica");
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
