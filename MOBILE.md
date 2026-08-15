# La app en Play Store y App Store

Respuesta corta: **Android sí, y ya está montado. iOS se puede, pero hay una
pega de revisión que hay que resolver antes de subirlo.**

El APK de depuración ya compila en esta máquina (4,1 MB).

El proyecto nativo **no está en el repositorio**: hoy todo lo que contiene sale
de [`capacitor.config.ts`](capacitor.config.ts) y de [`mobile/`](mobile/), así
que se regenera entero cuando haga falta:

```sh
npx cap add android
```

En cuanto se toque a mano —iconos de lanzador propios, permisos, un plugin
nativo— hay que quitar `android/` del `.gitignore` y versionarlo, porque a
partir de ahí regenerarlo perdería trabajo.

---

## Cómo está montado

Un envoltorio de [Capacitor](https://capacitorjs.com) que abre
`https://aprendoenglish.com` en un webview. La configuración está en
[`capacitor.config.ts`](capacitor.config.ts).

**Por qué carga el sitio y no lo empaqueta.** La app se pinta EN EL SERVIDOR con
la marca de la institución de quien entra (ver
[`src/lib/org-config.server.ts`](src/lib/org-config.server.ts)). Un paquete
estático dentro del APK sería el mismo para todos — justo lo que se acaba de
quitar. Además, así una corrección se publica desplegando el sitio, sin pasar
otra vez por revisión de la tienda.

**Lo que se paga a cambio:** sin conexión no hay app. Por eso `server.errorPath`
apunta a [`mobile/offline.html`](mobile/offline.html), una pantalla de verdad
que explica lo que pasa y reintenta sola cuando vuelve la red. Una app que se
queda en blanco sin datos es motivo de rechazo en las dos tiendas.

---

## Android — listo

Requisitos en la máquina que compile: **JDK 21 o superior** (Capacitor 8 lo
exige; el JDK 17 que trae Android Studio NO vale — aquí se usó
`C:\Program Files\Java\jdk-23.0.1`) y el SDK de Android.

```sh
# APK de prueba, para instalar en un móvil por USB
npm run mobile:apk
# → android/app/build/outputs/apk/debug/app-debug.apk

# El paquete que se sube a Play (hace falta la firma, más abajo)
npm run mobile:aab
# → android/app/build/outputs/bundle/release/app-release.aab
```

Si Gradle se queja de la versión de Java:

```sh
# PowerShell
$env:JAVA_HOME = "C:\Program Files\Java\jdk-23.0.1"
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
```

`android/local.properties` (dónde está el SDK) es de esta máquina y no va al
repositorio: quien compile en otra tendrá que escribirlo, o abrir `android/` con
Android Studio, que lo hace solo.

### Para subir a Play

1. **Clave de firma.** Se genera UNA vez y se guarda como oro: perderla
   significa no poder volver a actualizar la app nunca.
   ```sh
   keytool -genkey -v -keystore aprendoenglish.jks -keyalg RSA \
     -keysize 2048 -validity 10000 -alias aprendoenglish
   ```
   Guárdala **fuera** del repositorio (`.gitignore` ya bloquea `*.jks` y
   `*.keystore` por si acaso).
2. **Versión.** En `android/app/build.gradle`: `versionCode` sube de uno en uno
   en cada envío, `versionName` es lo que ve el usuario ("1.0").
3. **Cuenta de desarrollador**: 25 USD, pago único.
4. **Ficha**: icono 512×512, gráfico de cabecera 1024×500, capturas, política de
   privacidad (obligatoria, con URL pública).
5. **Formulario de seguridad de datos**: hay que declarar que se recogen correo
   y datos de uso, porque se recogen.

`targetSdkVersion` está en 36, que es lo que Play pide ahora mismo.

### Alternativa: TWA

Como el sitio ya tiene manifiesto
([`public/manifest.webmanifest`](public/manifest.webmanifest)) e iconos, también
se puede empaquetar con [Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap)
como Trusted Web Activity: sale sin barra de navegador y sin webview. Es más
limpio en Android, pero **no sirve para iOS**, así que Capacitor cubre los dos
con un solo proyecto.

---

## iOS — se puede, con condiciones

Dos obstáculos, uno logístico y otro de criterio.

### 1. Hace falta un Mac

`npx cap add ios` y Xcode sólo corren en macOS. No hay forma de generar el
`.ipa` desde Windows. Opciones:

- Un Mac prestado o alquilado por horas (MacStadium, MacinCloud).
- CI con runner macOS (GitHub Actions `macos-latest`) — la más barata si ya se
  usa CI.

En cuanto haya un Mac: `npm run mobile:ios`.

Además: cuenta de Apple Developer, **99 USD al año**, y para publicar como
empresa hace falta un número DUNS.

### 2. La norma 4.2 — esto es lo importante

Apple rechaza las apps que sólo envuelven una web
([App Store Review Guidelines 4.2, "Minimum Functionality"](https://developer.apple.com/app-store/review/guidelines/#minimum-functionality)).
Tal cual está hoy, **el envoltorio se rechazaría.** Google es mucho más
permisivo con esto; Apple no.

Lo que hay que añadir para que deje de ser "sólo una web". Con dos o tres de
estas suele bastar, y todas encajan con lo que la app ya hace:

| Añadido | Plugin | Por qué encaja |
| --- | --- | --- |
| **Recordatorio de racha** | `@capacitor/local-notifications` | La app ya lleva la cuenta de la racha; avisar a las 19:00 es la función nativa más natural que tiene |
| **Lección descargada** | `@capacitor/filesystem` | Guardar el módulo en curso para estudiar en el metro. Además tapa la pega de "sin conexión no hay app" |
| **Vibración al acertar** | `@capacitor/haptics` | Una línea, y se nota |
| **Voz del sistema** | `@capacitor-community/text-to-speech` | La app ya usa `speechSynthesis`; la voz nativa suena mejor y funciona sin red |
| **Inicio de sesión con Apple** | `@capacitor-community/apple-sign-in` | **Obligatorio**, no opcional: si hay login con Google, Apple exige ofrecer también el suyo (norma 4.8) |

La última no es negociable. La pantalla de login tiene "Continuar con Google"
([`src/routes/login.tsx`](src/routes/login.tsx)), así que sin Sign in with Apple
el envío se rechaza aunque todo lo demás esté bien.

### Otras cosas que mirar antes del primer envío a iOS

- **Google OAuth dentro de un webview**: Google lo bloquea. `allowNavigation` en
  el config ya deja que ese salto se abra en el navegador del sistema, que es la
  forma admitida — pero hay que probarlo en un dispositivo de verdad.
- **Compras**: si en algún momento se vende una suscripción DENTRO de la app,
  Apple exige su pasarela y se queda el 15–30 %. Mientras el pago lo haga la
  institución fuera de la app, no aplica.
- **Edad**: si la usan menores, la ficha necesita clasificación por edad y la
  política de privacidad tiene que decir qué se recoge de ellos.

---

## Resumen

| | Play Store | App Store |
| --- | --- | --- |
| ¿Compila? | **Sí, ya** (`npm run mobile:apk`) | Necesita un Mac |
| Coste | 25 USD, una vez | 99 USD/año |
| ¿Pasaría revisión tal cual? | Sí | **No** — norma 4.2, y falta Sign in with Apple |
| Trabajo pendiente | Firma + ficha | Mac + 2–3 funciones nativas + Sign in with Apple |

Lo sensato es publicar Android primero, que ya está, y usar ese tiempo para
añadir las funciones nativas que iOS pide de todas formas.
