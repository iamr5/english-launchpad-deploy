# Cambiar ruta del sílabo de Santa María de la Gracia

Actualmente el dosier académico del Colegio Santa María de la Gracia vive en `/silabo-santa-maria`. El usuario quiere que la URL sea `/silabo-santa-maria-de-la-gracia`.

## Pasos

1. Renombrar la ruta
   - Mover `src/routes/silabo-santa-maria.tsx` → `src/routes/silabo-santa-maria-de-la-gracia.tsx`.
   - Cambiar `createFileRoute("/silabo-santa-maria")` por `createFileRoute("/silabo-santa-maria-de-la-gracia")`.

2. Actualizar metadatos sociales
   - En la misma ruta, actualizar `<meta property="og:url" content="https://aprendoenglish.com/silabo-santa-maria-de-la-gracia">`.
   - Mantener el resto de títulos/descripciones iguales.

3. Proteger slugs reservados
   - En `src/lib/demo-config.ts`, añadir `"silabo-santa-maria-de-la-gracia"` a `RESERVED_SLUGS`.
   - Mantener `"silabo-santa-maria"` reservado para evitar que alguien cree un demo con ese slug y cause confusión/redirecciones rotas.

4. Verificar
   - Compilar la app y confirmar que la nueva URL responde con el HTML del sílabo.
   - Comprobar que `/silabo-santa-maria` ya no devuelve el contenido (la ruta antigua desaparece al renombrar el archivo).

## Notas técnicas

- No es necesario renombrar `src/assets/silabo-santa-maria.html`; la ruta puede importarlo con el nombre de archivo actual. Sin embargo, si se prefiere coherencia, se puede renombrar también a `silabo-santa-maria-de-la-gracia.html` y actualizar el import. Esta tarea es opcional.
- TanStack Router regenerará el árbol de rutas automáticamente; no tocar `src/routeTree.gen.ts` a mano.
