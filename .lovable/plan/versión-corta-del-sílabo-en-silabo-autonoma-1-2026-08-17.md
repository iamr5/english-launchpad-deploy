# Aplicar las dos migraciones pendientes y regenerar los tipos

## Qué se aplica, en orden

1. `20260815120000_org_roster_roles.sql` — el padrón pasa a decidir también la interfaz:
   - Nueva columna `role` en `org_domains`, restringida a `student` / `parent` / `teacher` (nunca `admin`).
   - Nuevas funciones `org_role_for_email(text)` y `apply_roster_role(uuid, app_role)`.
   - `assign_org_on_signup()` y `resync_org_members()` se reescriben para aplicar el rol del padrón, respetando el rol de administrador.
   - Se crea la institución `apavit` (sin `brand_slug`, sin correos).
2. `20260817090000_apavit_padron.sql` — las tres direcciones exactas del padrón de APAVIT (dos alumnos, un profesor) y su aplicación inmediata a las cuentas que ya existan.

Ambos archivos se envían tal cual están en el repositorio, sin reescribir ni reformatear el SQL.

## Después

Regenerar `src/integrations/supabase/types.ts` desde el esquema, para que `org_domains` incluya la columna `role` y aparezcan las nuevas funciones.

## Verificación

- Consultar `org_domains` para confirmar las tres filas de APAVIT con su rol y la fila de `orgs` con slug `apavit`.
- Comprobar que `types.ts` ya declara `role` en `org_domains`.
- Revisar que el código que lee o escribe el padrón (`/instituciones`) sigue compilando con los tipos nuevos; si algún formulario necesita exponer el campo de rol, se indica pero no se cambia en este paso salvo que sea necesario para que compile.
