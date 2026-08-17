// Entrar con Google desde la app empaquetada.
//
// EL PROBLEMA: Google rechaza a propósito el OAuth dentro de un webview
// embebido («disallowed_useragent»). Es una defensa contra el phishing —en un
// webview la app anfitriona puede leer lo que escribes—, y no se puede sortear
// ni conviene intentarlo. Como /login es Google primero, la app empaquetada tal
// cual sería una puerta cerrada: nadie podría entrar.
//
// LA SALIDA, que es la que Google admite: el inicio de sesión NO ocurre dentro
// de la app. Se abre en el navegador del sistema (una Custom Tab en Android),
// que es un navegador de verdad con su barra de direcciones, y al terminar
// vuelve a la app por un enlace profundo con la sesión.
//
//   1. Se le pide a Supabase la URL de Google, sin navegar (skipBrowserRedirect).
//   2. Se abre en la Custom Tab.
//   3. Google devuelve a com.aprendoenglish.app://auth-callback, que Android
//      entrega a la app (el esquema lo registra Capacitor: está en
//      android/app/src/main/res/values/strings.xml como custom_url_scheme).
//   4. Se saca la sesión de esa URL, se guarda y se cierra la pestaña.
//
// En el navegador normal nada de esto se usa: isNativeApp() da false y /login
// sigue redirigiendo como siempre.

import { supabase } from "@/integrations/supabase/client";

/**
 * El esquema tiene que coincidir con `custom_url_scheme` del proyecto Android.
 * Si se cambia el appId de Capacitor hay que cambiarlo aquí — y volver a
 * autorizarlo en Supabase, porque una URL de retorno no permitida se rechaza.
 */
export const NATIVE_AUTH_CALLBACK = "com.aprendoenglish.app://auth-callback";

type CapacitorGlobal = { isNativePlatform?: () => boolean };

/**
 * Si esto corre dentro de la app empaquetada.
 *
 * Se comprueba en caliente en vez de con una variable de compilación porque el
 * MISMO sitio se sirve a las dos: el navegador y el webview cargan
 * aprendoenglish.com. Lo único que los distingue es que Capacitor inyecta su
 * puente en el segundo.
 */
export function isNativeApp(): boolean {
  if (typeof window === "undefined") return false;
  const cap = (window as unknown as { Capacitor?: CapacitorGlobal }).Capacitor;
  return !!cap?.isNativePlatform?.();
}

/**
 * Saca la sesión de la URL de vuelta.
 *
 * Se aceptan las DOS formas a propósito. supabase-js viene hoy en flujo
 * «implicit», que devuelve los tokens en el fragmento (#access_token=…), pero
 * basta con que alguien ponga `flowType: 'pkce'` en el cliente para que pase a
 * devolver `?code=…`. Atender sólo a una dejaría el inicio de sesión de la app
 * roto por un cambio de una línea en otro archivo, y encima sin ruido.
 */
async function consumeAuthUrl(rawUrl: string): Promise<boolean> {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return false;
  }

  // PKCE: ?code=…
  const code = url.searchParams.get("code");
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) throw error;
    return true;
  }

  // Implicit: #access_token=…&refresh_token=…
  const hash = new URLSearchParams(url.hash.replace(/^#/, ""));
  const access_token = hash.get("access_token");
  const refresh_token = hash.get("refresh_token");
  if (access_token && refresh_token) {
    const { error } = await supabase.auth.setSession({ access_token, refresh_token });
    if (error) throw error;
    return true;
  }

  // Google puede devolver un error en vez de una sesión (permiso denegado).
  const err = url.searchParams.get("error_description") || hash.get("error_description");
  if (err) throw new Error(err);

  return false;
}

/**
 * Abre el inicio de sesión de Google en el navegador del sistema.
 *
 * Sólo tiene sentido dentro de la app; en el navegador se usa el camino de
 * siempre. Los import son dinámicos para que los plugins de Capacitor no entren
 * en el paquete que se sirve a la web.
 */
export async function signInWithGoogleNative(): Promise<void> {
  const { Browser } = await import("@capacitor/browser");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: NATIVE_AUTH_CALLBACK,
      // Que no navegue el webview: la URL la queremos para abrirla FUERA.
      skipBrowserRedirect: true,
    },
  });
  if (error) throw error;
  if (!data?.url) throw new Error("Supabase no devolvió la URL de Google.");

  await Browser.open({ url: data.url, presentationStyle: "popover" });
}

/**
 * Queda a la espera de la vuelta desde el navegador.
 *
 * Devuelve la función para dejar de escuchar; hay que llamarla al desmontar, o
 * cada visita a /login dejaría un oyente más y la sesión se procesaría varias
 * veces.
 */
export function listenForAuthDeepLink(onSession: (err?: Error) => void): () => void {
  if (!isNativeApp()) return () => {};

  let quitar: (() => void) | null = null;
  let vivo = true;

  (async () => {
    const [{ App }, { Browser }] = await Promise.all([
      import("@capacitor/app"),
      import("@capacitor/browser"),
    ]);
    const handle = await App.addListener("appUrlOpen", async ({ url }) => {
      if (!url || !url.startsWith(NATIVE_AUTH_CALLBACK.split("://")[0] + "://")) return;
      try {
        const ok = await consumeAuthUrl(url);
        // La pestaña del navegador sigue abierta encima de la app: si no se
        // cierra, el alumno se queda mirando la página de Google ya usada sin
        // entender que por detrás ya ha entrado.
        await Browser.close().catch(() => {});
        if (ok) onSession();
      } catch (e) {
        await Browser.close().catch(() => {});
        onSession(e instanceof Error ? e : new Error(String(e)));
      }
    });

    // Si el componente se desmontó mientras se resolvían los import, se quita ya.
    if (!vivo) handle.remove();
    else quitar = () => handle.remove();
  })();

  return () => {
    vivo = false;
    quitar?.();
  };
}
