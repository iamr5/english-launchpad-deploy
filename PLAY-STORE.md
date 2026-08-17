# Play Store — lo que falta hacer a mano

El código ya está (Step A). Esta es la lista de lo que no puedo hacer yo:
cuentas, claves y lo que sólo se comprueba en un móvil de verdad.

Sólo Play. iOS todavía no se ha empezado.

---

## 1 · Autorizar la vuelta del login en Supabase

**Sin esto, entrar con Google en la app no funciona.** Es el único paso que
bloquea todo lo demás.

En el panel de Supabase → **Authentication → URL Configuration → Redirect URLs**,
añade exactamente:

```
com.aprendoenglish.app://auth-callback
```

Por qué: Google no admite iniciar sesión dentro de un webview, así que la app lo
abre en el navegador del sistema y vuelve por esa dirección. Supabase rechaza
cualquier URL de retorno que no esté en esa lista.

---

## 2 · Aplicar las migraciones nuevas

Son tres, y el orden importa: la primera crea la columna y la institución, la
segunda mete los correos dentro y la tercera le pone la marca. Pídeselo a
Lovable:

> Aplica a Supabase, en este orden, las migraciones `supabase/migrations/20260815120000_org_roster_roles.sql`, `supabase/migrations/20260817090000_apavit_padron.sql` y `supabase/migrations/20260817100000_apavit_marca.sql`. Después regenera `src/integrations/supabase/types.ts`.

Qué hacen:

- **20260815120000** — añade `role` al padrón (las dos listas: alumnos y panel)
  y crea la institución APAVIT.
- **20260817090000** — mete las tres primeras cuentas:
  `dmalcaruiz@gmail.com` y `turuta.ai.tools@gmail.com` como alumnos,
  `feraligatr9000@gmail.com` al panel.
- **20260817100000** — APAVIT hereda la marca del demo `/apavit` y se le pone el
  nombre completo.

Al regenerar los tipos se puede quitar el apaño de `DomainRow` en
`src/lib/orgs.data.ts` (está comentado allí): `role` pasará a venir solo.

---

## 3 · La clave de firma

La genera **quien tenga la cuenta de Play**, una sola vez:

```sh
keytool -genkey -v -keystore aprendoenglish.jks -keyalg RSA \
  -keysize 2048 -validity 10000 -alias aprendoenglish
```

Déjala en `android/aprendoenglish.jks` y copia
`android/keystore.properties.example` a `android/keystore.properties`,
rellenando las contraseñas.

Los dos archivos están en `.gitignore`. **No los subas nunca.** Guarda una copia
en un gestor de contraseñas: con Play App Signing una clave de subida perdida se
puede reponer, pero es un trámite y unos días de espera.

---

## 4 · Compilar y subir a pruebas internas

```sh
npm run mobile:aab
# → android/app/build/outputs/bundle/release/app-release.aab
```

Hace falta **JDK 21 o superior** (el 17 que trae Android Studio NO vale). En esta
máquina funcionó con:

```powershell
$env:JAVA_HOME = "C:\Program Files\Java\jdk-23.0.1"
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
```

Súbelo al canal de **pruebas internas** de Play, no a producción. Añadíos como
probadores y instalad desde la app de Play.

---

## 5 · Probar en un móvil de verdad — esto es lo importante

Nada de lo de abajo se puede comprobar compilando. Son las tres cosas que toqué
y que sólo fallan en el aparato:

- [ ] **Entrar con Google.** Debe abrirse el navegador del sistema (no una
      pantalla dentro de la app), y al terminar volver solo a la app ya dentro.
      Si se queda en el navegador, es el paso 1 sin hacer.
- [ ] **Entrar con correo y contraseña.** Debe seguir funcionando igual.
- [ ] **Micrófono.** Entra a la práctica de speaking y graba: Android debe pedir
      permiso la primera vez, y el audio debe transcribirse.
      *Nota:* el reconocimiento local del navegador no existe dentro de un
      WebView, así que no habrá puntuación local instantánea — la transcripción
      por IA sí funciona, que es la que manda.
- [ ] **Sin conexión.** Pon el móvil en modo avión y abre la app: debe salir la
      pantalla de «Sin conexión», no una página en blanco.
- [ ] **Cerrar sesión** y volver a entrar.

---

## 6 · La ficha de Play

Lo de siempre, más dos cosas propias de esta app:

- **Seguridad de los datos**: hay que declarar **grabaciones de voz**, como
  recogidas *y compartidas con terceros*. La práctica de speaking sube el audio
  a Supabase y lo manda a OpenAI (vía la pasarela de Lovable) para transcribirlo
  y evaluarlo. Declararlo de menos es lo que hace que retiren una app después,
  que es peor que un rechazo ahora.
- **Política de privacidad** en una URL pública, y que mencione ese envío a
  OpenAI.

Y una decisión pendiente que conviene tomar antes de publicar: **si alguna
institución es un colegio**, estás grabando voces de menores. Eso activa la
política de Familias de Play y hay que tener preparada la respuesta sobre
consentimiento y retención. (El audio ya caduca solo: `audio_expires_at`.)

---

## Lo que ya está hecho, para que no se rehaga

- Envoltorio de Capacitor cargando `https://aprendoenglish.com`
- Pantalla de sin conexión (`mobile/offline.html`)
- Inicio de sesión de Google por el navegador del sistema + vuelta por enlace
  profundo (`src/lib/native-auth.ts`, y el filtro de intent en el manifiesto)
- Permiso de micrófono declarado, y `<queries>` para que Android 11+ encuentre
  navegador
- Firma de release leyendo de `keystore.properties` (fuera del repositorio)
- `android/` versionado, porque esas tres cosas no las reconstruye
  `npx cap add android`
- Manifiesto PWA e iconos 192/512
- APK de depuración compilando: 7,4 MB

## Ventaja que conviene recordar

La app carga el sitio, así que **un despliegue web llega al móvil sin pasar por
la tienda**. Sólo se necesita subir un binario nuevo si cambia algo nativo
(permisos, plugins, iconos). Un arreglo de contenido o un cambio de marca de un
cliente se ve en cuanto se despliega.
