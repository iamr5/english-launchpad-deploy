# Versión corta del sílabo en /silabo-autonoma-1

Publicar una segunda versión del dosier de la Autónoma, más breve y sin repeticiones, en `aprendoenglish.com/silabo-autonoma-1`. La versión actual en `/silabo-autonoma` se queda intacta.

## Qué se conserva

El documento actual tiene 10 bloques. La versión corta baja a 5, con el mismo diseño, tipografías, mascota (Nomi) y cifras reales:

1. **Portada** — título, standfirst, ficha (Actualización, cifras) y Nomi. Se recorta el texto largo a lo esencial.
2. **Demo real** — los tres previsualizadores (web, móvil y panel docente) con carga diferida y botón de ampliar, tal cual funcionan hoy.
3. **Qué es y qué resuelve** — fusión de "Lo que la Coordinación puede poner en marcha" + "Con qué criterios está escrito el contenido" + "Una misma herramienta, tres impactos": una sola sección con la oportunidad institucional, los principios pedagógicos en lista compacta y los tres públicos (alumno, docente, institución).
4. **El contenido ya existe** — el sílabo desplegable A1–C1 (la evidencia dura) con el muro de cifras y los cuatro formatos de ejercicio integrados como una fila de tarjetas, en vez de una sección propia.
5. **Cierre** — llamado a la acción, sin repetir cifras ya mostradas.

## Qué se elimina o comprime

| Bloque actual | Decisión |
|---|---|
| Índice "Plataforma, contenido e implementación" | Se elimina: con 5 secciones no hace falta índice. |
| "Una capa de práctica ya construida" | Se comprime a 3 líneas dentro del bloque de contenido. |
| Anexo de correspondencia MCER ↔ Cambridge | Se mantiene, pero colapsado al final como anexo plegable. |
| "Tipología de ejercicios" | Se integra como tarjetas dentro del bloque de contenido. |
| "Articulación más allá del aula" | Se resume en 2 frases dentro del cierre. |
| Repeticiones de la píldora de cifras | Queda solo en la portada y en el muro de cifras. |

Regla general: cada cifra aparece una sola vez; ningún párrafo vuelve a argumentar que "es serio y revisable" — eso lo sostienen el sílabo desplegable y la tabla.

## Detalle técnico

- Nuevo asset `src/assets/silabo-autonoma-1.html`, derivado del actual (mismo CSS, mismo script de modal + IntersectionObserver, misma inyección de Nomi).
- Nueva ruta `src/routes/silabo-autonoma-1.tsx` con el mismo patrón que `silabo-autonoma.tsx`: handler `GET`, favicon `head.png` y meta Open Graph/Twitter propias.
- Añadir `"silabo-autonoma-1"` a `RESERVED_SLUGS` en `src/lib/demo-config.ts`.
- Verificación con navegador headless: los tres iframes cargan al hacer scroll, sin recortes, y la página se ve bien en móvil y escritorio.
