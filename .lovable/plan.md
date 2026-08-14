# Reestructurar /cip como campaña de preinscripción

Hoy la página vende "habla inglés en 1 año con 20 minutos al día". Eso es un beneficio de estudiante, no el motivo de esta campaña. El objetivo real es que muchos ingenieros dejen su correo y le pasen la voz a sus colegas, para que el Colegio active el programa. La página se reordena alrededor de ese mensaje.

## Mensaje nuevo

- **Titular**: el CIP puede dar inglés técnico a todos sus colegiados. Falta la señal de demanda.
- **Es transparente**: esto todavía no está funcionando. Existe la tecnología y el curso construido; el Colegio puede tenerlo activo en un mes si hay suficientes preinscritos.
- **Llamado doble**: preinscríbete y comparte con tus colegas. Cada preinscripción cuenta como voto.
- El "1 año / 20 minutos" deja de ser el titular y baja a un dato de apoyo dentro de "cómo funciona".

## Nueva estructura de la página

1. **Héroe** — logo CIP, eyebrow "Aún no existe. Puede existir en un mes.", titular de campaña, una línea de apoyo, formulario de correo y, debajo, contador de ingenieros ya preinscritos. Boti al lado, con **burbuja de texto** ("Hola, soy Boti. Voy a acompañarte hasta que hables inglés de ingeniero.") que aparece al montarse la mascota.
2. **Por qué ahora** — tres pasos claros en línea: preinscripción abierta → el Colegio ve la demanda → arranca la primera cohorte en ~1 mes. Deja explícito el "todavía no está funcionando".
3. **Tecnología de punta, hecha para ingenieros** — el bloque que hoy está blandengue. Se vuelve concreto y con imágenes: capturas reales de la app (test de ubicación de 40 ítems, ruta de niveles A1–C1, vocabulario técnico con definición en español, panel de progreso), cada una con una frase de qué resuelve. Números duros al lado: 45 microlecciones, 8.127 ejercicios, 11.040 palabras, 779 términos de ingeniería, corrección automática, ubicación por nivel.
4. **Este es el curso, tal cual** — se conserva el demo real embebido con carga al clic. **Se elimina el bloque de quiz de muestra**: en su lugar el foco queda en recorrer el curso completo.
5. **Pásale la voz** — bloque dedicado: por qué su firma sola no basta, botones para compartir por WhatsApp, LinkedIn y copiar enlace (con el mismo `utm` de origen para poder medir quién trae a quién).
6. **Cierre** — formulario otra vez con el argumento de campaña, no de cupos escasos.

## Detalles técnicos

- Cambios concentrados en `src/routes/cip.tsx`: se retiran `SAMPLE`/`SampleQuiz` y `QUIZ_CSS`, se reescriben `Hero`, `Benefits` y `FinalCta`, y se añaden los bloques "Cómo funciona", "Tecnología" y "Comparte". Se mantiene `EmailForm`, `LiveDemo` y el sistema visual actual (Archivo / Archivo Black, bandas papel-navy-acento).
- `BotiFull` gana una burbuja posicionada sobre la mascota, con el mismo diferido por `IntersectionObserver` y espacio reservado para que no salte el layout.
- Las capturas de la app se toman del demo real (`/democip`) con Playwright y se guardan optimizadas en `public/cip/`, con `loading="lazy"` y dimensiones explícitas. Nada de imágenes de stock.
- Contador de preinscritos: se añade un `GET` en `src/routes/api/public/preinscripcion.ts` que devuelve sólo el total del slug `cip` (ningún dato personal); si falla, el héroe simplemente no muestra el contador.
- Compartir usa enlaces `wa.me` / LinkedIn y `navigator.clipboard`; sin librerías nuevas.
- `head()` se actualiza con título y descripción de campaña; se conserva el `og:image` actual.
- No se toca la lógica de preinscripción existente, `demo-app.html` ni `/democip`.
