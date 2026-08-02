# Dos ajustes en /democip: invitaciones fallidas y panel de progreso

## 1. No listar el correo si la invitación falló

Hoy el correo se guarda en la lista de observadores **antes** de intentar el envío, así que aparece listado aunque el envío falle ("No pudimos enviar la invitación").

Cambio: primero se intenta el envío y solo se agrega a la lista si el resultado es aceptable:

- Envío correcto → se agrega y se muestra "invitación enviada a X".
- Dominio aún sin verificar (envío pendiente) → se agrega y se avisa que el correo saldrá al activarse el envío.
- Cualquier error real (fallo de envío, correo bloqueado, límite de intentos) → **no** se agrega, el correo queda en el campo para reintentar y se muestra el error.

Mientras se envía, el botón queda deshabilitado con estado "Enviando…".

## 2. "Ver mi panel de progreso" lleva a una pantalla vacía

El botón apunta a `/dashboard`, que exige sesión y rol de familia/profesor; desde el demo no hay sesión, así que no se ve nada.

Cambio: el botón del demo apunta a `/demo-dashboard` (el panel ya desplegado en esa ruta), abriéndose en la misma pestaña. Además se agrega en ese panel un botón "Volver al demo" que regresa a `/democip`, para que el recorrido no sea un callejón sin salida.

Nota: ese panel demo hoy muestra datos de ejemplo fijos (no lee el progreso real del alumno). Si quieres que refleje tu nivel, racha y minutos reales del demo, lo hago como paso siguiente — dímelo y lo incluyo.

## Detalles técnicos

- `bindShare()` en `src/assets/democip-index.html`: reordenar para que `saveShareList` ocurra tras la respuesta del endpoint, según `j.ok` / `j.reason`.
- Función de navegación al panel (líneas ~1545-1548): cambiar `/dashboard` por `/demo-dashboard`.
- Botón "Volver al demo" en `src/assets/demo-dashboard.html`.
- Copias sincronizadas a `public/democip/index.html`.
