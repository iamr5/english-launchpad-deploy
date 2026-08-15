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

**Base de datos** — `supabase/migrations/20260815000000_orgs.sql`

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

## ⚠ Un arreglo que venía de la rama de tu compañero

Al traerme sus 75 commits me encontré la migración `20260814231929`, que hace:

```sql
REVOKE EXECUTE ON FUNCTION public.has_role(...) FROM PUBLIC, anon, authenticated;
```

Quitarlo de `PUBLIC` y de `anon` está bien. Quitárselo a **`authenticated`** no:
`has_role` se llama desde las políticas de RLS de la tabla `demos`, y esas
expresiones se evalúan con el rol de quien consulta. Sin ese permiso, la
política no se puede resolver y la consulta muere con *permission denied for
function has_role* — es decir, **`/demos` deja de poder leer o guardar nada**.

No es una hipótesis: ya pasó una vez. La migración `20260724234048` hizo el
mismo REVOKE y `20260803120100_demos.sql` tuvo que volver a conceder el permiso,
con el motivo escrito en un comentario al lado.

Mi migración va **la última a propósito** y vuelve a conceder el permiso. Que
`has_role` siga siendo `SECURITY DEFINER` es lo que hace que sea seguro:
`authenticated` puede *preguntar* si alguien tiene un rol, pero sigue sin poder
leer `user_roles`.

Dicho de otro modo: si hubieras aplicado la rama de tu compañero sin esto,
`/demos` se habría quedado sin funcionar. Merece la pena que se lo comentes,
porque el REVOKE probablemente venga de un aviso de seguridad automático y
volverá a aparecer.

---

## Lo que tienes que hacer

### 1 · Aplicar la migración — ✅ HECHO

Lovable la aplicó y volvió a escribirla como migración propia
(`20260815011809_…sql`, la misma sin comentarios). Están las cuatro tablas, las
funciones, el disparador, las políticas, la semilla del CIP y —importante— el
`GRANT EXECUTE` de `has_role` que arregla lo de la rama del compañero.

Que queden las dos migraciones no molesta: ambas son idempotentes
(`CREATE TABLE IF NOT EXISTS`, `CREATE OR REPLACE`, `ON CONFLICT DO NOTHING`),
así que aplicarlas en orden en un entorno nuevo funciona igual.

Los tipos también se regeneraron, así que se quitaron los `as any` que hacían
falta para compilar contra un esquema que aún no conocía estas tablas.

### 2 · El secreto de firma — no hay que hacer nada

Se intentó poner `APP_SHELL_SECRET` a mano y resultó que Lovable no expone las
variables de entorno en ningún menú de ajustes: las inyecta su propio
despliegue. (Se ve claro en que `.env` está versionado y NO contiene
`SUPABASE_SERVICE_ROLE_KEY`, y aun así `client.server.ts` la lee en caliente y
producción funciona.)

Así que el pase ya no depende de esa variable. Si no está, se deriva de
`SUPABASE_SERVICE_ROLE_KEY`, que ya está en el entorno del servidor, es secreta
y es estable. Ver `secret()` en [`src/lib/app-token.ts`](src/lib/app-token.ts).

Esto además tapa un fallo silencioso: antes, olvidarse de la variable dejaba el
pase firmado con una cadena escrita en el repositorio y **nada** lo delataba,
porque todo seguía funcionando igual.

Si algún día quieres una clave propia —por ejemplo para poder invalidar todos
los pases sin rotar la clave de servicio— pídesela a Lovable en el chat:

> Añade un secreto `APP_SHELL_SECRET` con este valor: `<pega el tuyo>`

y genéralo con:

```sh
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

**Pendiente, aparte:** `COURSE_TOKEN_SECRET` (en
[`src/lib/course-token.ts`](src/lib/course-token.ts)) sigue con el problema
original — si no está la variable, firma con una cadena del repositorio. No se
tocó a la vez porque cambiarla invalida los pases del curso que estén en uso, y
un alumno a mitad de lección se comería un 401 hasta recargar. Conviene
arreglarlo igual, en un momento de poco tráfico.

### 3 · Dar de alta tus instituciones ← ESTÁS AQUÍ

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
