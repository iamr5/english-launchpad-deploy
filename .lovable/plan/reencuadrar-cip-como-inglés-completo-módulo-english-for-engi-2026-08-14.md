# Reencuadrar /cip como inglés completo + módulo "English for Engineering" en /democip

## 1. /cip: es inglés, y además incluye inglés técnico

Hoy todo el mensaje dice "inglés técnico": titular, metadatos, bloques y textos de compartir. Eso encoge la promesa. El curso es inglés general A1–C1, con una capa profesional encima.

- **Titular**: pasa a inglés completo — "Que todos los ingenieros del Perú *hablen inglés*" — y el técnico deja de ser el sujeto de la frase.
- **Fila de badges** debajo del titular, discreta, tipo etiqueta (no tarjetas ni párrafos): `Niveles A1–C1 (MCER)` · `Incluye inglés técnico` · `Test de ubicación` · `Certificado por nivel` · `Con la marca del CIP`.
- **Cuerpo**: los bloques que hoy hablan de "vocabulario técnico" quedan como *una parte* del curso. El de vocabulario dice "11.040 palabras, de las cuales 779 son de ingeniería"; el de niveles explica el MCER en una línea.
- **Metadatos, texto de WhatsApp/LinkedIn y cierre** se alinean al mismo encuadre: inglés para todos los colegiados, con especialización de ingeniería incluida.
- No cambia la estructura de la campaña (héroe con formulario, contador de firmas, transparencia, demo embebido, "pásale la voz").

## 2. /democip: "English for Engineering" con especialidades seleccionables

Del documento, el camino más barato y con más valor percibido es **vocabulario por especialidad + situaciones profesionales** (Nivel B "ligero"), porque el banco ya existe: los 779 términos de ingeniería están agrupados en 12 temas que se corresponden casi uno a uno con ramas.

Se añade dentro de Vocabulario una zona propia, **English for Engineering**, con:

1. **Selector de especialidad** (una vez, cambiable después): Civil / Obra, Sistemas y Software, Industrial y Calidad, Mecánica, Eléctrica y Electrónica, Minas y Materiales, Gestión de Proyectos. Cada una agrupa los temas existentes que le corresponden; las ramas sin banco propio se muestran como "próximamente" y ofrecen el tronco común.
2. **Tronco común (transversal)** siempre disponible: correos profesionales, reuniones y avances, seguridad, presentación de un proyecto. Es lo que sirve a cualquier rama.
3. **Situaciones reales**: por especialidad, 3–4 escenas cortas (reportar un avance, explicar una falla, pedir una especificación) resueltas con los tipos de ejercicio que ya tiene la app —selección, reconstrucción, escritura con variantes— así no hay motor nuevo.
4. **Piloto profundo**: Civil / Obra sale completa (vocabulario + situaciones + lectura de una especificación); las demás arrancan con vocabulario y situaciones del tronco común.

Se mantiene todo lo actual del demo: ruta A1–C1, práctica, progreso. La zona técnica es una capa adicional, nunca el reemplazo del curso general.

## Detalles técnicos

- `/cip`: cambios sólo en `src/routes/cip.tsx` (head, `Hero`, `METRICS`, `BENEFITS`, bloque de tecnología, textos de compartir y cierre) más un estilo `.badges` en el CSS del propio archivo. Nada de assets nuevos.
- `/democip`: cambios en `src/assets/demo-app.html`. El selector de especialidad se guarda en el progreso local existente; el mapeo especialidad → temas se define como una tabla en el propio archivo, apuntando a los `id` que ya existen en `src/content/vocab/packs.js` (`inge-construccion-y-obra`, `inge-programacion-y-software`, etc.). Se sigue sirviendo por tema con la carga bajo demanda actual (`/api/course/vocab`), sin cargar el banco entero.
- Las situaciones reales se añaden como un banco pequeño nuevo dentro del contenido existente, reutilizando el `renderQuiz` actual y sus variantes de escritura.
- No se toca la preinscripción, `/silabo-cip` ni la configuración de `/demos`.
