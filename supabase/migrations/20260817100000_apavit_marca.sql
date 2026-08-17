-- APAVIT hereda la marca de su demo.
--
-- La institución se creó sin marca (brand_slug NULL) porque en el repositorio no
-- había ningún demo suyo y apuntarla a ciegas le habría puesto los colores de
-- otra. El demo existe: está publicado en /apavit, hecho desde el panel, así que
-- vive como fila en la tabla `demos` y no como archivo en src/demos/.
--
-- Con esto, quien entre con un correo del padrón de APAVIT ve en la app la misma
-- marca que se le enseñó en el demo: colores, mascota, textos y bienvenida. Y lo
-- que se retoque en /apavit desde el panel se ve en la app en la siguiente
-- recarga, sin tocar nada más.

-- El EXISTS no es adorno: brand_slug apunta con clave foránea a demos(slug), y
-- el demo de APAVIT NO está entre los archivos semilla de src/demos/. En una
-- base recreada sólo desde las migraciones esa fila no existiría todavía y el
-- UPDATE reventaría por integridad referencial, tumbando el despliegue entero
-- por una cuestión de aspecto. Así, si el demo está, se enlaza; y si no, la
-- institución se queda con el aspecto de fábrica —que funciona— y basta con
-- elegirlo en el desplegable de /instituciones.
UPDATE public.orgs o
SET brand_slug = 'apavit'
WHERE o.slug = 'apavit'
  AND o.brand_slug IS DISTINCT FROM 'apavit'
  AND EXISTS (SELECT 1 FROM public.demos d WHERE d.slug = 'apavit');

-- El nombre completo, para que el panel y los títulos de las páginas privadas
-- («Inglés · …», «Panel de seguimiento · …») no digan sólo la sigla.
UPDATE public.orgs
SET name = 'Asociación Peruana de Agencias de Viajes y Turismo'
WHERE slug = 'apavit' AND name = 'APAVIT';
