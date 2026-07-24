import { createFileRoute } from "@tanstack/react-router";
import html from "../assets/cip.html?raw";

const headTags = `
<link rel="icon" href="/head.png" type="image/png">
<meta property="og:title" content="Inglés para todos los ingenieros del Perú · AprendoEnglish × CIP">
<meta property="og:description" content="Presentación especial para ingenieros del CIP — AprendoEnglish">
<meta property="og:type" content="website">
<meta property="og:image" content="https://aprendoenglish.com/social-preview.jpg">
<meta property="og:image:secure_url" content="https://aprendoenglish.com/social-preview.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:alt" content="AprendoEnglish × CIP">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Inglés para todos los ingenieros del Perú · AprendoEnglish × CIP">
<meta name="twitter:description" content="Presentación especial para ingenieros del CIP — AprendoEnglish">
<meta name="twitter:image" content="https://aprendoenglish.com/social-preview.jpg">
`;

const htmlWithMeta = html.replace("<head>", `<head>${headTags}`);

export const Route = createFileRoute("/cip")({
  server: {
    handlers: {
      GET: async () =>
        new Response(htmlWithMeta, {
          headers: { "Content-Type": "text/html; charset=utf-8" },
        }),
    },
  },
});
