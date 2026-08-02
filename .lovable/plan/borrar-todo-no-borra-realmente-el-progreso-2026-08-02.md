# "Borrar TODO" no borra realmente el progreso

## Qué está pasando

El botón de borrado quita las claves guardadas y recarga la página, pero hay procesos que siguen escribiendo el progreso viejo en el mismo instante:

- Hay un guardado diferido (400 ms) que puede dispararse justo después del borrado y volver a escribir en memoria todo el progreso anterior antes de que la recarga ocurra.
- El cronómetro de meta diaria corre cada segundo y también guarda el progreso que sigue vivo en memoria.
- El borrado no limpia otras claves: el resumen para el panel, la lista de personas con quienes compartes progreso y el registro del test de ubicación.

Resultado: recargas y la sección 1 del módulo 1 sigue marcada como completada.

## Cómo se arregla

1. Al pulsar "Borrar TODO": marcar un estado de "borrado en curso" que bloquea cualquier escritura posterior, cancelar el guardado pendiente y detener el cronómetro.
2. Vaciar el progreso en memoria antes de tocar el almacenamiento, para que ningún guardado tardío tenga datos que reescribir.
3. Borrar todas las claves del demo, no solo dos: progreso, perfil, resumen del panel, observadores invitados y registro del test de ubicación.
4. Recargar reemplazando la entrada actual, de modo que el arranque siempre lea el estado limpio y muestre el onboarding desde cero.
5. Aplicar la misma protección al botón "Reiniciar progreso" (solo progreso, conservando el perfil), que hoy sufre la misma carrera.

## Verificación

Con Playwright en móvil: completar la primera lección, pulsar "Borrar TODO", confirmar tras la recarga que aparece el onboarding, que la sección 1 está en 0% y que no queda ninguna clave del demo en el almacenamiento del navegador.

## Detalles técnicos

- Archivos: `src/assets/democip-index.html` (fuente servida por `/democip`) y su copia espejo `public/democip/index.html`.
- Añadir bandera `WIPED`; `saveProgress()`, `scheduleSave()`, `saveSummary()` y `goalTick()` retornan si está activa.
- `resetAllData()`: `clearTimeout(_saveT)`, limpiar el `setInterval` del cronómetro (guardar su id), `PROGRESS = {}`, remover `ingles_web_progress_v1`, `ingles_web_profile_v1`, `ingles_web_summary_v1`, `ae_share`, `placement_log_v1`, y luego `location.replace(location.pathname)`.
- `resetProgress()`: misma cancelación de temporizadores y limpieza de `SUMMARY_KEY` antes de re-renderizar.
