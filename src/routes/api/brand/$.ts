import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

// Sirve los archivos que sube cada demo (logos, fondos de mapa, iconos).
//
// El bucket `demo-brand` es privado —la plataforma no permite buckets públicos—
// así que su endpoint /object/public/ no funciona. La política de lectura sí deja
// entrar a anon, de modo que esta ruta descarga con la clave publicable y
// reemite el archivo. Ventaja sobre las URLs firmadas: la dirección no caduca,
// que es lo que hace falta en un enlace que se le pasa a una institución.

const BUCKET = "demo-brand";

export const Route = createFileRoute("/api/brand/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const path = (params as { _splat?: string })._splat ?? "";
        if (!path || path.includes("..")) {
          return new Response("Not found", { status: 404 });
        }

        const { data, error } = await supabase.storage.from(BUCKET).download(path);
        if (error || !data) {
          return new Response("Not found", { status: 404 });
        }

        return new Response(data, {
          headers: {
            "Content-Type": data.type || "application/octet-stream",
            // El nombre lleva marca de tiempo, así que el contenido de una ruta
            // dada nunca cambia: se puede cachear para siempre.
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      },
    },
  },
});
