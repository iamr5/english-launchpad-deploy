# Nuevo bloque de evidencia: 35% más retención

Reemplazar la sección "Por qué la práctica fuera del aula" (bloque `#evidencia`) en los tres sílabos por una cifra que se entiende de inmediato.

## Contenido nuevo

Cifra grande: **35%** — subtítulo: "más retención".

Titular: **La práctica sostenida puede aumentar la retención hasta en 35%.**

Párrafo: Con el mismo tiempo total de estudio, los estudiantes que distribuyeron la práctica durante varios días recordaron 35% más vocabulario que quienes concentraron todo en una sola sesión. Por eso la plataforma complementa el trabajo del docente: mantiene la práctica activa entre una clase y la siguiente.

Refuerzo en letra pequeña: un meta-análisis de Cambridge University Press sobre 65 estudios encontró que el uso de apps móviles fue más efectivo que los métodos convencionales para el aprendizaje de vocabulario a largo plazo, con mayor efecto fuera del aula que dentro.

Fuentes (nota al pie discreta): Bloom & Shuell (1981), *Journal of Educational Research*; meta-análisis de 65 estudios, Cambridge University Press.

Sin jerga: no se muestran valores d ni p en el cuerpo del texto.

## Alcance técnico

Se edita solo la sección `#evidencia` en:

- `src/assets/silabo-autonoma.html`
- `src/assets/silabo-autonoma-1.html`
- `src/assets/silabo-cip.html` (usa "colegiados" en lugar de "estudiantes")

Se conserva el layout y las clases existentes (`.evidence`, `.stat`, `cite`); solo cambian textos y se añade la línea de refuerzo. Verificación visual en escritorio y móvil en las tres rutas.
