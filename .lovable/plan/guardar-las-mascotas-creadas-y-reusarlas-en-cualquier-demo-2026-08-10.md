# Guardar las mascotas creadas y reusarlas en cualquier demo

Hoy, cuando diseñas una mascota en el constructor y pulsas «Usar esta mascota», el pack se sube y se guarda **sólo dentro de la configuración de ese demo**. No queda en ningún sitio compartido, así que no aparece junto a Ozzy, Boti y Gallito y hay que rehacerla para otro demo.

## Qué voy a hacer

### 1. Una biblioteca de mascotas guardadas

Nueva colección en la base de datos donde vive cada mascota guardada: su nombre, cómo se le llama, qué es, su emoji, su miniatura y dónde están sus archivos. La escriben y borran sólo los administradores; el panel la lee para ofrecerla.

Los archivos del pack dejan de subirse dentro de la carpeta de un demo cuando se guardan en la biblioteca: van a una carpeta común, para que cualquier demo pueda apuntar a ellos.

### 2. Botón «Guardar en mis mascotas»

En el constructor, junto a «Usar esta mascota»:

- Pide un nombre (propone el que ya tiene la mascota).
- Guarda el pack en la biblioteca y, si quieres, lo aplica al demo en el que estás.
- Si guardas una mascota con el mismo nombre, ofrece actualizarla en vez de duplicarla.

El mismo botón aparece en «Subir pack .zip», para que un pack dibujado a mano también se pueda guardar en la biblioteca.

### 3. Que aparezcan en el panel de personajes

La parrilla de «Personaje» pasa a tener dos bloques:

- **Incorporadas** — Ozzy, Boti, Gallito, como ahora.
- **Mis mascotas** — las guardadas, con su miniatura, su nombre y un menú para renombrar o borrar.

Al elegir una de las tuyas, el demo queda apuntando a ese pack (igual que hoy con «Usar esta mascota»), y al reabrir el constructor se retoma tal cual la dejaste, con sus colores y su logo.

### 4. Detalles de cuidado

- Borrar una mascota de la biblioteca no rompe los demos que ya la usan: cada demo lleva copia de su manifiesto y sus archivos siguen en el almacenamiento. Se avisa antes de borrar si algún demo la está usando.
- La miniatura se genera del propio personaje, así que la parrilla se ve sin cargar el pack entero.

## Detalle técnico

- Migración: tabla `public.mascot_library` (`id`, `name`, `short_name`, `kind`, `emoji`, `base_url`, `manifest jsonb`, `thumb text`, `created_by`, `created_at`, `updated_at`), con `GRANT` a `authenticated`/`service_role`, RLS activada, lectura y escritura restringidas a `has_role(auth.uid(),'admin')` — misma política que `demos`.
- `src/lib/mascot-pack.ts`: `uploadPack` recibe un prefijo de carpeta en vez de asumir el slug; la biblioteca usa `biblioteca/mascot/<id>-<ts>/`.
- Nuevo `src/lib/mascot-library.ts`: listar, guardar, renombrar y borrar contra esa tabla (Supabase desde el cliente, ya que el panel es admin).
- `src/components/mascot-constructor.tsx`: acción «Guardar en mis mascotas» (nombre + aplicar al demo), reutilizando `packDeMascota` y `miniaturaSVG` para el thumb.
- `src/routes/_authenticated/demos.tsx`: la sección Personaje combina `packChoices()` con la biblioteca; seleccionar una fija `mascot.pack = "custom"`, `mascot.baseUrl` y `mascot.manifest`. `MascotPackField` gana el botón de guardar en biblioteca.
