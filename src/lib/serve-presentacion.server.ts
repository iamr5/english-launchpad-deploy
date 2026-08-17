// Sirve las presentaciones pesadas (15–28 MB de HTML con imágenes incrustadas)
// sin cargarlas nunca en memoria.
//
// El patrón anterior hacía `await res.text()` y guardaba el string en una
// variable de módulo: en el runtime del servidor eso revienta el límite de
// memoria y la respuesta caía a "No disponible" (502) de forma intermitente.
//
// Aquí el cuerpo se pasa en streaming y las etiquetas extra (favicon, Open
// Graph, Twitter y el bloque de mascota) se inyectan al vuelo con HTMLRewriter.
// En el dev server de Node no existe HTMLRewriter, así que hay un fallback que
// sí bufferiza — solo se usa en desarrollo.

type Opts = {
  /** URL del asset .html (absoluta o relativa; se resuelve contra la request). */
  assetUrl: string;
  /** URL de la petición entrante, para resolver la ruta del asset. */
  requestUrl: string;
  /** HTML a insertar dentro del <head> (meta sociales, favicon…). */
  headTags: string;
  /** HTML extra al final del <head> (p. ej. el bloque de la mascota del demo). */
  extraHead?: string;
};

async function fetchAsset(url: URL): Promise<Response | null> {
  for (let intento = 0; intento < 2; intento++) {
    try {
      const res = await fetch(url);
      if (res.ok && res.body) return res;
    } catch {
      /* reintenta */
    }
  }
  return null;
}

export async function servePresentacion({
  assetUrl,
  requestUrl,
  headTags,
  extraHead,
}: Opts): Promise<Response> {
  const res = await fetchAsset(new URL(assetUrl, requestUrl));
  if (!res) return new Response("No disponible", { status: 502 });

  const inject = `${headTags}${extraHead ?? ""}`;
  const headers = {
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "public, max-age=3600",
  };

  const Rewriter = (globalThis as { HTMLRewriter?: unknown }).HTMLRewriter as
    | (new () => {
        on: (
          s: string,
          h: { element: (el: { append: (c: string, o: { html: boolean }) => void }) => void },
        ) => { transform: (r: Response) => Response };
      })
    | undefined;

  if (Rewriter) {
    const out = new Rewriter()
      .on("head", {
        element: (el) => el.append(inject, { html: true }),
      })
      .transform(new Response(res.body, { headers }));
    return out;
  }

  // Fallback de desarrollo (Node): sin HTMLRewriter toca bufferizar.
  const html = (await res.text()).replace("</head>", `${inject}</head>`);
  return new Response(html, { headers });
}
