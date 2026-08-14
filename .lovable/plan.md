# Ajustes de marca y navegación en los demos

Cinco cambios sobre la plantilla común (`src/assets/demo-app.html`), así que aplican a **todos** los demos publicados a la vez.

## 1. Aislar los colores de feedback de la marca

Hoy el color de "acción" de la marca pinta `--green`, y `--green` se usa tanto para botones (Empecemos, Continuar) como para todo lo que significa "correcto": opción acertada, chip "Superado", banner de acierto, segmentos aprobados, quiz completado. Por eso un demo con marca roja acaba con dos rojos: el suyo y el de error.

Se separan dos familias:

- **Marca (personalizable)**: CTAs principales, nodos del mapa, anillos de progreso, cabeceras, resaltes/selección.
- **Semántica (fija, no personalizable)**: verde de acierto (`#3FAA24` / `#2E7D1A`) y rojo de error (`#F44336`). Nunca cambian por institución.

También se corrige que los tokens seleccionados usen hoy el mismo rojo que el error: la selección pasa a usar el color de resalte de la marca; el rojo queda solo para fallo.

En el panel `/demos` los campos de color se re-etiquetan para dejar claro que "Acción" ya no toca los estados de acierto.

## 2. "Ruta" al centro del nav inferior

Orden nuevo: **Vocabulary · Ruta · Práctica**. Solo cambia el orden visual; los ids, el enrutado por pestaña y la pestaña inicial (Ruta) siguen igual.

## 3. La lección se lee más angosta y con más marca

- Columna de lectura centrada con ancho máximo (~640 px) en lugar de ocupar todo el ancho en pantallas grandes.
- Más presencia de marca dentro del texto: banda superior y títulos de sección con el acento de la institución, filete/regla lateral en los bloques colapsables, chips y viñetas con el color de marca, y la marca de agua del demo detrás del contenido (por debajo de los botones, como ya está definido).

## 4. Práctica como workbook

Deja de listar solo lo desbloqueado: se listan **todos** los quizzes del curso, se puedan hacer con o sin haber pasado la lección. Al entrar se explica en la cabecera de la sección qué es: un cuaderno de ejercicios libre, sin nota y sin afectar el orden de la ruta. Los que ya se superaron siguen marcados como tal.

Se mantiene que aprobar aquí pueda dar crédito en la ruta (comportamiento actual), sin bloqueos previos.

## 5. La Ruta como home con saludo y progreso

Arriba de los módulos, antes de las lecciones:

- Saludo con el nombre del onboarding: "¡Hola, *nombre*! Qué bueno verte de vuelta :)".
- Indicador de progreso: porcentaje/anillo del curso, racha, minutos del día y XP — datos que ya se calculan para la pantalla de progreso.

Luego siguen las tarjetas de módulos tal como están.

## Detalles técnicos

- `src/assets/demo-app.html`:
  - Nuevas variables `--ok` / `--okDark` y `--err` fijas en `:root`; se reemplaza `var(--green)` por `var(--ok)` en todo lo que sea correctitud (`.opt.correct`, `.w-input.correct`, `.fb-banner.ok`, `.fb-line.ok`, `.seg.done`, `.secsegs .ssg.done`, `.pg-track .tk.done`, `.pg-mission.done`, `.result-icon.ok`, `.vd-exam.done`, `.pr-q.done`, `.win .w-t`, `.pbar .fill.done`). `--green`/`--greenDark` quedan solo para CTA/mapa y siguen ligadas a `colors.action`.
  - `.token.sel` pasa de `--red2` a `var(--blue)`; `.token.err` a `var(--err)`.
  - `#lesson-body` con contenedor centrado `max-width:640px` y acentos de marca (`--accent`) en cabeceras, reglas y chips.
  - Reordenar los tres `<button class="tab">` de `#home-tabs`.
  - `renderPractice()` / `practiceItems()`: quitar el filtro `open` y el conteo "N de M desbloqueados"; nuevo texto introductorio de workbook.
  - `renderCourse()`: prepender un bloque de bienvenida con nombre (perfil `ingles_web_profile_v1`) y resumen de progreso reutilizando los cálculos de `renderProgress()`.
- `src/lib/demo-page.ts`: sin cambios de variables nuevas; se verifica que no se emitan overrides sobre las nuevas variables semánticas.
- `src/routes/_authenticated/demos.tsx`: ajustar etiquetas/ayudas de los campos de color de acción y resalte.
