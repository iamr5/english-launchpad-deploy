# Fusionar las definiciones en español al banco de vocabulario

Las 11.040 definiciones generadas siguen disponibles en el archivo intermedio (562 lotes, 0 errores). Falta incorporarlas al contenido del curso y comprobar que se vean en la ficha de cada palabra.

## Qué se hará

1. **Fusión de datos**
   - Script de una sola pasada que recorre el archivo intermedio de definiciones y las inserta como campo `d` en cada palabra de `src/content/vocab/general.js` y `src/content/vocab/packs.js`.
   - El emparejamiento es por tema + palabra en inglés (normalizado), para evitar que una palabra repetida en dos temas reciba la definición equivocada.
   - Se conserva el formato compacto actual del archivo generado (una línea por sección) para no inflar el peso ni romper el plugin de build.

2. **Verificación de cobertura**
   - Recuento posterior a la fusión: cuántas palabras quedaron con `d`, cuántas sin ella y en qué temas, para cerrar los huecos con un segundo lote si los hubiera.

3. **Ficha de palabra**
   - En `src/assets/demo-app.html`, la ficha mostrará la definición en español (`d`) como texto principal y la traducción como dato secundario; si una palabra no tuviera definición, sigue funcionando el respaldo actual.

4. **Comprobación en el navegador**
   - Revisión en el demo: abrir varias palabras de temas distintos (banco general y un pack especializado) y confirmar que la definición aparece, que el peso de carga por tema no crece de forma notoria y que las tandas de 10 + examen siguen funcionando.

## Detalles técnicos

- Campo nuevo: `d` (definición en español) en cada entrada de palabra; no cambia el orden ni la forma del arreglo, así que el índice y la carga por tema (`virtual:vocab-content`) siguen igual.
- La fusión se hace fuera del bundle del cliente: el contenido se evalúa en build, por lo que el navegador sigue recibiendo solo el tema pedido.
- Sin cambios de esquema en base de datos ni en las rutas de demos.
