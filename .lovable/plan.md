# Enviar de verdad las invitaciones de "Comparte tu progreso"

Hoy, en `/democip`, al agregar un correo en "Comparte tu progreso" solo se guarda en el navegador (lista local `ae_share`) y se muestra "invitación enviada". No sale ningún correo.

## Requisito previo

Para enviar correos hace falta configurar un dominio de envío propio (por ejemplo `notify.aprendoenglish.com`, usando el dominio que ya tienes). Sin eso no hay envío real posible. Se configura desde el diálogo de correo del proyecto y la verificación DNS puede tardar hasta unas horas.

## Qué se construye

1. **Endpoint de invitación**: una ruta de servidor pública que recibe `{ email, studentName, level, streak, minutosHoy }`, valida el correo (formato y largo), limita el abuso básico y envía el correo.
2. **Plantilla de correo** "Invitación a seguir un progreso": saludo, quién invita, qué podrá ver (nivel, racha, tiempo, lecciones) y qué no, y un botón que lleva a `/dashboard` (con `/login` si no tiene cuenta).
3. **Conexión desde el demo**: al pulsar "Invitar" en `/democip`, además de guardar el observador localmente, se llama al endpoint. La tarjeta muestra tres estados: enviando, "invitación enviada a X" o error con opción de reintentar. Se mantiene la lista con opción de quitar.

## Aclaraciones

- El observador recibe un correo con enlace al panel; para ver el progreso deberá crear una cuenta o iniciar sesión (el vínculo real observador-alumno en la base de datos no está en este alcance; el correo lo invita a ver el panel).
- Los rebotes, bajas y reintentos los maneja la plataforma; no se crean tablas de correo.

## Detalles técnicos

- `src/routes/api/public/share-invite.ts` (validación con Zod + envío).
- Plantilla React Email en `src/lib/email-templates/` registrada en el registry; helper `sendTemplateEmail` con clave de idempotencia por correo+día.
- Cambios de UI en `src/assets/democip-index.html` (función de invitar) y copia sincronizada a `public/democip/index.html`.

<presentation-actions>
<presentation-open-email-setup>Configurar dominio de correo</presentation-open-email-setup>
</presentation-actions>
