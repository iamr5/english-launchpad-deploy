# Vocabulario: navegación más simple, tandas de 10 con examen, definiciones en español e iconos propios

Hoy la pestaña Vocabulario tiene 247 temas repartidos en 19 secciones generales más 6 bancos especializados (11.040 palabras). Cada tema abre una rejilla de fichas grandes: la mediana es de 50 palabras por tema y 161 temas pasan de 40, así que abrir uno es una pared de tarjetas sin corte ni meta. Los iconos actuales son 189 emojis del sistema.

## 1. Navegar sin perderse

- **Índice por secciones plegables**: cada sección (Básicos, Comida, Viaje…) entra plegada con su icono, su total de palabras y su barra. Se abre la que interesa; los bancos especializados quedan agrupados aparte y marcados.
- **Filtros rápidos arriba**: "Todos · En curso · Sin empezar · Dominados", más el buscador que ya existe.
- **Fichas de tema más compactas**: se cambian las tarjetas grandes por filas con icono, nombre, progreso "18/50" y el sello de examen. Entran unas tres veces más temas por pantalla.
- **Continuar donde quedaste**: arriba del índice, acceso directo al último tema y a la siguiente tanda pendiente.

## 2. Tandas de 10 con examen dentro del tema

- Al abrir un tema, sus palabras se parten en tandas de 10 (la última puede tener menos). Cada tanda es una tarjeta de la lista: "Tanda 1 · palabras 1–10", con su progreso y su estado.
- Dentro de una tanda: las 10 palabras en fichas (audio, inglés, español, definición) y al final el botón **Examinarme de estas 10**.
- El examen de tanda usa el motor de quiz que ya existe (opción múltiple, dictado, "¿para qué se usa?"), con 10 preguntas de esas 10 palabras, repaso de falladas y repetición si se vuelve a fallar.
- Aprobar una tanda la marca y abre la siguiente. El **examen del tema completo** se conserva como prueba final, disponible cuando todas las tandas están aprobadas.
- Los temas cortos (10 palabras o menos) siguen siendo una sola tanda, sin cambio visible.

## 3. Definición en español

- Cada palabra pasa a tener una definición corta en español (una frase, nivel del alumno), visible al tocar la palabra: se despliega bajo la ficha junto con el ejemplo de uso que ya existe, sin abandonar la pantalla.
- Las definiciones se generan con IA para las 11.040 palabras y se guardan en el contenido del curso (mismo proceso que se usó para el banco de práctica: generación por lotes + revisión lingüística y de nivel). No se piden en vivo, así que no añaden espera ni coste al usar la app.
- Se sirven junto con las palabras del tema, en la misma petición perezosa de hoy, para no engordar la carga inicial.

## 4. Iconos con el estilo de las mascotas

Se sustituyen los 189 emojis por un set propio dibujado en el mismo lenguaje visual de las mascotas (Boti, Ozito, Gallito): formas redondeadas, contorno grueso, color plano, paleta de la marca, fondo transparente. Cada tema apunta a uno de estos iconos por familia temática; así el set se mantiene coherente y liviano en lugar de tener 247 dibujos distintos.

**Iconos a generar (40):**

Saludos · Familia y personas · Cuerpo · Ropa · Casa · Cocina · Comida · Bebidas · Frutas y verduras · Restaurante · Compras · Dinero y banco · Ciudad · Transporte · Viaje y equipaje · Hotel · Playa y vacaciones · Naturaleza · Animales · Clima · Tiempo y calendario · Números · Colores y formas · Escuela y estudio · Trabajo y oficina · Profesiones · Tecnología · Internet y redes · Salud y médico · Deporte · Música y arte · Cine y ocio · Emociones · Verbos de acción · Adjetivos y descripción · Conectores y gramática · Ingeniería · Derecho · Negocios y finanzas · Turismo y hotelería

## Detalles técnicos

- UI y lógica en `src/assets/demo-app.html` (`renderVocabIndice`, `renderVocabTema`, `openVocabExam`): índice plegable + filtros, vista de tanda, `vocabExamRound` acotado a las 10 palabras de la tanda, progreso de tanda en `PROGRESS.__vocabTanda`.
- Contenido: se añade la definición como cuarto campo por palabra en `src/content/vocab/general.js` y `packs.js`, y se expone en `/api/course/vocab` con las palabras del tema.
- Iconos: SVG en `public/demo-assets/vocab-icons/`, mapa tema → icono en el contenido de vocabulario; se hereda el color de marca del demo igual que hacen las mascotas.
- Cambio aplicado a todos los demos, `/democip` incluido.

## Alcance

La generación de 11.040 definiciones es un proceso largo (por lotes, con revisión), del mismo tipo que la ampliación del banco de práctica. La interfaz, las tandas y los iconos quedan listos primero y funcionan aunque una palabra todavía no tenga definición.
