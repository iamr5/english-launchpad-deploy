# Ajustes al demo /democip (progreso, celebración, ruta, panel y timer)

Todo esto se aplica en el demo `/democip` (archivo `src/assets/democip-index.html`, copiado a `public/democip/index.html`), más un ajuste en el panel `public/dashboard/index.html`.

## 1. La barra de secciones dice "vas por la 5" cuando recién empiezas

Hoy los segmentos de arriba cuentan **todos los bloques de contenido** de la lección (intro, vista previa, cada teoría…), y como los primeros vienen desbloqueados de fábrica, aparecen 4 marcados como hechos apenas entras. Además el 53% viene del scroll dentro del bloque activo, no de tu avance real.

Cambio: los segmentos pasan a representar **secciones reales con candado** (los bloques que exigen mini-quiz para abrir el siguiente), agrupando junto a cada uno el contenido introductorio que lo acompaña. Al entrar por primera vez: sección 1 de N, 0%, ningún segmento verde. Un segmento solo se pone verde al superar su mini-quiz. Se mantiene el tope de 90% mientras falte el quiz de esa sección, y el 100% al aprobarlo.

## 2. Falta la magia al terminar una lección

Al aprobar el quiz final: pantalla de celebración con la mascota (Boti) — entrada animada, confeti/estrellas breves, mensaje de felicitación con el nombre de la lección, XP ganada y racha, y botón para seguir a la siguiente lección. Reemplaza el cierre discreto actual.

## 3. Caminito del módulo: íconos lentos y confirmación de más

- Estrella, check y candado dejan de cargarse como archivos externos: se incrustan como SVG inline dentro del HTML, así aparecen al instante sin petición de red.
- Al tocar un nodo desbloqueado se **entra directo a la lección**; se elimina el globo con "Empezar/Continuar" como paso intermedio. El globo se mantiene solo como etiqueta informativa sobre el nodo actual (sin requerir segundo clic) y los nodos bloqueados siguen mostrando su aviso.

## 4. Constancia de logro y compartir progreso

- La constancia deja de estar fija en B2: muestra **el nivel que te toca ahora** (A1 al inicio) con su requisito real ("Se desbloquea al completar el nivel A1"), y va subiendo de nivel conforme completas módulos. Mismo criterio en la tarjeta de constancia del panel.
- Nueva tarjeta "Comparte tu progreso": ingresas un correo (mamá, jefe, profesor) y queda listado como observador, con opción de quitarlo. El texto deja claro que esa persona **solo ve tu progreso** (nivel, racha, tiempo, lecciones) y que puede recibir un aviso si dejas de avanzar varios días. En el demo la invitación se guarda localmente y se muestra el estado "invitación enviada" (no hay envío real de correo en este demo).

## 5. El timer no se entiende

- El chip de la meta diaria pasa de "0'" a texto legible: **"13 min"** dentro del anillo con etiqueta "de 30 min" al tocarlo, y al cumplir la meta muestra "¡Meta lista!".
- El panel de progreso del alumno muestra el tiempo **de hoy** ("Hoy: 14 min de 30 min") además del acumulado semanal, alimentado por el mismo contador del demo.

## Detalles técnicos

- `sectionState()` se reescribe para agrupar bloques por compuerta (`requiresQuizToUnlockNext`) en vez de contar bloques renderizables; `updateCompletion()` pinta los segmentos con ese nuevo conteo.
- Celebración: nueva función reutilizando el patrón de `botiCheer()` + overlay, disparada desde el cierre de `openFinalQuiz`.
- Íconos: sprite `<svg><symbol>` en el HTML; `renderPath()` usa `<use>` en lugar de `<img src="star.svg">`.
- Nodo del caminito: `data-open` se ejecuta en el clic del nodo desbloqueado.
- Constancia: nivel objetivo derivado del índice del módulo en curso, no del literal `B2`.
- Observadores: `PROGRESS.__watchers` en localStorage; el panel lee el mismo estado.
