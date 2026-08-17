import type { CapacitorConfig } from "@capacitor/cli";

// El envoltorio nativo para Play Store y App Store.
//
// Por qué carga el sitio en vez de empaquetarlo: la app se pinta EN EL SERVIDOR
// con la marca de la institución de quien entra (ver src/lib/org-config.server.ts).
// Un paquete estático dentro del APK sería el mismo para todos, que es
// exactamente lo que se acaba de quitar. Así que el webview abre el sitio y el
// servidor decide qué marca sirve, igual que en el navegador.
//
// La consecuencia a asumir: sin conexión no hay app. De ahí `errorPath`, que
// es una pantalla local de verdad y no el error en blanco del sistema — una
// tienda rechaza una app que no dice nada cuando falla la red.
//
// El repaso de tiendas está en MOBILE.md, incluida la pega seria: Apple rechaza
// por la norma 4.2 las apps que sólo envuelven una web. Lo que hace falta para
// pasarla está escrito allí.

const config: CapacitorConfig = {
  appId: "com.aprendoenglish.app",
  appName: "AprendoEnglish",

  // La carpeta con lo que se empaqueta dentro del binario. No es la app: es la
  // pantalla de sin conexión y poco más. Ver mobile/README.md.
  webDir: "mobile",

  server: {
    // De dónde se carga la app de verdad. Para probar contra el servidor de
    // desarrollo, cámbialo por http://TU-IP:3000 y añade
    // `cleartext: true` — pero NO subas eso a una tienda.
    url: "https://aprendoenglish.com",
    // El webview sólo navega dentro de estos dominios; lo de fuera (Google al
    // iniciar sesión, un enlace de la lección) se abre en el navegador del
    // sistema. Es lo que además exige Google para el OAuth: no acepta
    // credenciales dentro de un webview embebido.
    allowNavigation: ["aprendoenglish.com", "*.aprendoenglish.com", "*.supabase.co"],
    androidScheme: "https",
    // La pantalla que se ve si el sitio no carga. Sale de webDir.
    errorPath: "offline.html",
  },

  android: {
    // El acelerón de la depuración no va en lo que se sube a la tienda.
    webContentsDebuggingEnabled: false,
    // El curso se lee de arriba abajo; el rebote elástico del final delata que
    // esto es un webview.
    allowMixedContent: false,
  },

  ios: {
    // El teclado no debe empujar la barra inferior del curso.
    contentInset: "always",
    // limitsNavigationsToAppBoundDomains iba en true y estaba MAL para este
    // caso: encierra al webview en los dominios declarados en Info.plist, y el
    // inicio de sesión de Google tiene que salir de la app a propósito. Se
    // queda apagado. (iOS todavía no se ha empezado — por ahora sólo Play.)
  },
};

export default config;
