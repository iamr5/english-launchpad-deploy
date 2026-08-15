# Puesta en producción — marca por institución

Qué había, qué se ha construido y qué te toca hacer a ti.

---

## Lo que había

La marca por institución existía **sólo en los demos**. `/demos` es un panel
completo —colores, mascota, tipografías, splash, fondos del mapa, metas del
panel— y todo eso se inyecta en la plantilla al servir `aprendoenglish.com/<slug>`.

Pero la elegía **la URL**, no la cuenta. Quien iniciaba sesión no llegaba por un
slug: llegaba por `/login`, y `/app` servía un archivo estático
(`public/app/index.html`) idéntico para todo el mundo. En la base de datos no
había nada que uniera una cuenta con una institución.

Dicho de otro modo: le enseñabas al CIP su demo con su marca, firmaban, sus
ingenieros entraban… y veían la app genérica.

---

## Lo que se ha construido

Las mismas piezas de `/demos`, pero resueltas desde **la cuenta que entra**.

**Base de datos** — `supabase/migrations/20260814190000_orgs.sql`

- `orgs` — una institución real. Puede **heredar la marca del demo** con el que
  se le vendió (`brand_slug`) y poner lo suyo encima.
- `org_domains` — cómo se asigna sola una cuenta: por dominio (`cip.org.pe`) o
  por dirección entera (`ana@gmail.com`, que manda sobre el dominio).
- `org_members` — la pertenencia. Una cuenta, una institución.
- `org_invites` — código de alta para quien usa correo personal.
- Disparador al registrarse + `resync_org_members()` para las cuentas que ya
  existían.

**Resolución de la marca** — `src/lib/org-config.server.ts`

Tres capas, de lo general a lo concreto: valores de fábrica → configuración del
demo heredado → lo que cambie la institución. Si algo falla —sin institución, de
baja, base caída— sirve el aspecto de fábrica, que es una app perfectamente
usable. Una consulta caída no deja a nadie fuera de su curso.

**La app, ya pintada** — `/api/app-shell` y `/api/dashboard-shell`

`/app` y `/dashboard` ya no cargan el archivo estático: piden estas rutas, que
sirven la **misma plantilla que un demo** con la marca de la institución. Es
deliberado: lo que el cliente aprobó en su demo es literalmente lo que ve su
alumno. No hay una segunda plantilla que mantener al día.

El rodeo del pase firmado (`src/lib/app-token.ts`) es porque un `<iframe src>`
no lleva cabecera `Authorization` y la sesión de Supabase vive en localStorage.
Dura 10 minutos y sólo abre la página; todo lo demás sigue pasando por RLS.

**Panel** — `/instituciones`

Crear instituciones, elegir de qué demo heredan la marca, dar de alta dominios y
códigos, ver cuántas cuentas hay en cada una. No repite los controles de marca
de `/demos` a propósito: duplicarlos sería garantizar que los dos acaben
discrepando.

**Login** — campo opcional de código de institución al registrarse.

**Vista del panel** — antes iba en la URL del iframe (`?role=teacher`), así que
una familia podía pedir el reporte de aula cambiando el parámetro. Ahora la
decide el servidor por los roles y viaja firmada dentro del pase.

---

## Lo que tienes que hacer

### 1 · Aplicar la migración

Es el único paso obligatorio. Sin él, `/instituciones` responderá "no existe la
tabla" y la app seguirá saliendo con la marca de fábrica (no se rompe nada —
está previsto).

En Lovable, pídele:

> Aplica la migración `supabase/migrations/20260814190000_orgs.sql` a Supabase.

O desde tu máquina, si tienes la CLI: `supabase db push`.

Después, regenera los tipos para que dejen de hacer falta los `as any` de
`orgs.data.ts` y `org-config.server.ts`:

> Regenera `src/integrations/supabase/types.ts` desde el esquema de Supabase.

### 2 · Poner un secreto de firma

En las variables de entorno del despliegue (Cloudflare):

```
APP_SHELL_SECRET=<una cadena larga y aleatoria>
```

Sin él funciona igual, pero el pase se firma con una cadena por defecto que está
escrita en el código — o sea, previsible. Genera una así:

```sh
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

Aprovecha y pon también `COURSE_TOKEN_SECRET`, que tiene el mismo problema
desde antes.

### 3 · Dar de alta tus instituciones

En `aprendoenglish.com/instituciones`, por cada cliente:

1. **Nombre** e **identificador** (se propone solo).
2. **Hereda la marca de** → el demo que ya le hiciste. Aquí está el truco: no
   hay que volver a elegir colores. El CIP ya viene sembrado apuntando a
   `/democip`.
3. **Dominios** → `cip.org.pe`. Todo el que se registre con ese dominio entra
   solo. Si alguien usa gmail, añade su dirección entera.
4. **Códigos** (opcional) → para repartir entre alumnos con correo personal.

### 4 · Reasignar las cuentas que ya existen

Dar de alta un dominio hoy no toca a quien se registró ayer. El botón
**"Reasignar cuentas por dominio"** recorre las cuentas existentes y les pone la
que les toque. No deshace las altas por código ni las hechas a mano.

### 5 · Comprobarlo

1. Entra con un correo del dominio que diste de alta.
2. Deberías ver la bienvenida con la marca de la institución y, después, la app
   con sus colores y su mascota.
3. Cambia un color en `/demos` en el demo del que hereda, recarga la app: el
   cambio se ve en unos segundos (la caché dura 10 s).

---

## Lo que NO se ha tocado, y conviene que sepas

- **`public/app/index.html` sigue ahí** y ahora es el respaldo: se sirve si el
  pase no llega (red, sesión caída) y para el atajo de depuración `fake_login`.
  Es una copia vieja de la plantilla, sin marca. Si algún día quieres, se puede
  borrar; hoy es la red de seguridad.
- **El progreso sigue en localStorage**, tanto en la app como en el panel. Eso
  ya era así; las tablas `progress` y `profiles` existen pero la plantilla no
  escribe en ellas. Es el siguiente trabajo grande si quieres que un alumno
  cambie de móvil sin perder su racha.
- **El botón de depuración de `/login`** (fake login) sigue visible en
  producción. No da acceso a nada —sin sesión de Supabase, RLS lo rechaza
  todo—, pero se ve raro en una demo con un cliente delante. Se quita borrando
  el último bloque de `src/routes/login.tsx`.

---

## Tiendas de aplicaciones

Está en [MOBILE.md](MOBILE.md), con detalle. En dos líneas:

- **Play Store: sí, y ya compila.** `npm run mobile:apk` genera el APK en esta
  máquina. Falta la clave de firma y la ficha de la tienda.
- **App Store: se puede, pero no tal cual.** Hace falta un Mac, y sobre todo
  Apple rechaza los envoltorios de web (norma 4.2). Hay que añadir dos o tres
  funciones nativas —recordatorio de racha, lección descargada, vibración— y
  **Sign in with Apple**, que es obligatorio desde el momento en que hay login
  con Google.

Lo sensato: publicar Android ya, y usar ese tiempo para añadir lo que iOS pide.
