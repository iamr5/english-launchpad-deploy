# Ofuscar el código del curso en el navegador

## Qué se puede y qué no

Conviene decirlo claro antes de tocar nada: todo lo que el navegador pinta, el visitante lo tiene. La ofuscación no cierra la puerta, sube mucho el coste de llevarse el curso: el HTML deja de ser legible, las funciones dejan de tener nombres reconocibles y copiar y pegar la plantilla deja de servir. Un atacante decidido y con tiempo puede seguir extrayendo contenido; uno normal, no.

Lo que ya está hecho hoy y ayuda: el contenido del curso no viaja en la página. Sale por `/api/course/bundle`, `/api/course/practice` y `/api/course/vocab`, todas con un pase firmado que caduca a las 6 horas, se emite dentro de la página y tiene límite de peticiones por IP. La página en sí, en cambio, se sirve tal cual: 418 KB de HTML con todo el JavaScript legible y comentado dentro.

## Lo que haremos

**1. Ofuscar la plantilla del curso en el momento de compilar**

La app del alumno (`demo-app.html`) y el panel (`demo-dashboard.html`) pasarán por un proceso automático antes de publicarse:

- El JavaScript se comprime y se renombra: variables y funciones pasan a nombres de una letra, se eliminan comentarios y saltos de línea.
- Los textos internos (nombres de campos, URLs de las APIs, mensajes) se codifican y se reconstruyen en ejecución, para que buscar en el código no dé pistas.
- Se añade control de flujo enredado y código señuelo, de modo que "des-ofuscar" automáticamente no devuelva algo legible.
- El HTML pierde comentarios y sangrado.

Esto ocurre solo al compilar. En desarrollo el archivo sigue legible y editable como hasta hoy, así que no complica el trabajo posterior.

**2. Endurecer la entrega del contenido**

- Un pase por visita en lugar de uno reutilizable: se vincula a la sesión del navegador y a un identificador aleatorio, para que un pase copiado a otro equipo no sirva.
- Bajar el TTL del pase de 6 horas a algo más ajustado (2 h) y recortar el tope de peticiones por hora del volcado completo.
- Marca invisible por sesión en las respuestas del contenido, para poder identificar de qué visita salió un volcado si aparece copiado.
- Cabeceras `X-Robots-Tag: noindex` y `Cache-Control: no-store` en todo lo que sirve contenido del curso, para que no quede cacheado ni indexado.

**3. Molestias razonables en la interfaz del demo**

Selección de texto y menú contextual desactivados dentro del curso, y bloqueo del arrastre de imágenes. No detendrá a nadie con conocimientos, pero sí el "copiar y pegar" masivo. Se deja fuera del panel y de las presentaciones, donde estorbaría.

## Alcance

Se aplica a las páginas del curso: `/<demo>`, `/<demo>/dashboard`, `/<demo>/padres` y `/democip`. Las presentaciones comerciales y el landing de preinscripción no llevan contenido del curso, así que se quedan como están (solo se les quita comentarios y espacios).

## Detalle técnico

- Añadir `javascript-obfuscator` y `html-minifier-terser` como dependencias de desarrollo.
- Nuevo plugin de Vite (junto a `courseContentPlugin` en `vite.config.ts`) que intercepta las importaciones `?raw` de `src/assets/demo-app.html` y `demo-dashboard.html`. En `build` extrae los bloques `<script>` sin `src`, los pasa por el ofuscador (preset medio: `stringArray`, `stringArrayEncoding: base64`, `controlFlowFlattening` parcial, `identifierNamesGenerator: mangled`, sin `debugProtection` para no romper móviles), minifica el HTML y devuelve el resultado. En `serve` devuelve el archivo intacto.
- Medir el coste: el preset elegido suele añadir 30–60 % de peso y algo de tiempo de arranque. Si el arranque en móvil se degrada de forma perceptible, se baja `controlFlowFlattening` a 0 y se conserva solo el renombrado más el `stringArray`.
- `src/lib/course-token.ts`: pasar el payload a `slug.exp.nonce`, bajar `TTL_MS` a 2 h y devolver el nonce en la verificación; `src/lib/demo-page.ts` inyecta el nonce junto al pase; los tres endpoints de `src/routes/api/course/` lo comprueban y lo usan como clave de recuento en lugar de solo la IP.
- Recordatorio de configuración: definir `COURSE_TOKEN_SECRET` como secreto del proyecto. Sin él, la firma usa un valor fijo que está en el repositorio y el pase deja de ser imprevisible.

## Verificación

- Compilar y comprobar que `/democip` arranca, hace el test de ubicación, abre una lección, una tanda de práctica y un tema de vocabulario.
- Ver el código fuente de la página publicada y confirmar que no hay nombres ni comentarios legibles.
- Comprobar que un pase de otra sesión es rechazado por los tres endpoints.
- Medir el tiempo hasta la primera pantalla antes y después, en móvil.
