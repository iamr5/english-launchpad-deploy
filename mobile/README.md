# mobile/

Lo que se empaqueta DENTRO del binario nativo. No es la app.

La app se carga del servidor (`server.url` en
[`capacitor.config.ts`](../capacitor.config.ts)) porque se pinta allí con la
marca de la institución de quien entra. Aquí sólo vive lo que tiene que
funcionar cuando el servidor no se puede alcanzar:

- **`offline.html`** — la pantalla de sin conexión. La enseña el webview cuando
  la carga falla (`server.errorPath`). Reintenta sola en cuanto vuelve la red.
  Existe porque una app que se queda en blanco sin datos la rechazan en las dos
  tiendas.
- **`index.html`** — Capacitor exige que `webDir` traiga uno. Casi nunca se ve;
  si algún día se quita `server.url`, esto lleva a la app en vez de dejar una
  pantalla en blanco.

Después de tocar cualquiera de los dos hay que copiarlos al proyecto nativo:

```sh
npm run mobile:sync
```
