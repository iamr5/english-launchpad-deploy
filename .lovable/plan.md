# Landing de preinscripción en /cip

Una página de venta corta, con la marca del demo del CIP (logos, colores, mascota Boti, vocabulario de ingeniería), cuyo único objetivo es: que el estudiante vea el valor en menos de un minuto y deje su correo.

## Movimiento de rutas

- La presentación que hoy vive en `/cip` pasa a `/cip-presentacion` (sigue existiendo `/CIP-presenta`).
- `/cip` queda para el nuevo landing de preinscripción.

## Estructura del landing (una sola pantalla larga, sin ruido)

1. **Héroe**: logo CIP + AprendoEnglish, titular directo ("Aprende inglés técnico, sin salir del trabajo"), una línea de apoyo, Boti a un lado y el formulario de correo visible de inmediato (campo + botón "Quiero preinscribirme"). Debajo, contador social: "X ingenieros ya se preinscribieron".
2. **Prueba el curso aquí mismo** (el bloque central): un quiz real interactivo tomado del banco del curso y una tarjeta de vocabulario de ingeniería, jugables en la propia página. Al terminar 2–3 preguntas aparece de nuevo el formulario con "Te faltan 8.127 ejercicios como este".
3. **Vista del demo en vivo**: un marco con `/democip` cargado bajo demanda (aparece cuando se llega al bloque, igual que en los sílabos) para que vean la app real, más un botón "Abrir el demo completo".
4. **Qué incluye**: cifras reales en 4–6 datos (45 microlecciones A1–C1, 377 quizzes, 8.127 ejercicios, 11.040 palabras con 779 de ingeniería, panel de progreso, certificado por nivel).
5. **Cierre**: formulario otra vez + una línea de por qué ahora (cupos de la primera cohorte del CIP).

Sin menú de navegación, sin secciones de relleno; cada bloque termina apuntando al mismo formulario.

## Formulario y números

- Un solo campo (correo) y un botón. Cada envío cuenta como firma.
- Validación en el navegador y en el servidor; correo repetido no duplica registro, responde "ya estabas en la lista".
- Estados: enviando, confirmado (mensaje de gracias con "compártelo con un colega") y error con reintento.
- Se guarda correo, demo de origen (`cip`), fecha, y datos de campaña (`utm_*`) si vienen en el enlace.
- **Panel en `/demos`**: nueva pestaña "Preinscripciones" con total, total de hoy, últimos registros y descarga CSV. Solo administradores.

## Detalles técnicos

- Tabla `public.preinscripciones` (id, email único por demo, slug, utm, created_at) con RLS: inserción vía endpoint de servidor (no escritura directa desde el navegador), lectura solo para el rol admin; GRANTs explícitos.
- Endpoint `src/routes/api/public/preinscripcion.ts`: validación con Zod, límite de intentos por IP, respuesta idempotente.
- Landing servido desde `src/routes/cip.tsx` (HTML propio en `src/assets/cip-preinscripcion.html`), con la marca resuelta en el servidor con la misma configuración de `democip` que ya usa `/demos` — si mañana cambian el logo o los colores del demo, el landing los toma solos.
- El quiz de muestra se sirve desde el banco existente por la API de práctica; nada de duplicar contenido.
- Metadatos propios: título, descripción, og:image y favicon del CIP.
- Nueva ruta `src/routes/cip-presentacion.tsx` con el HTML actual de la presentación.
