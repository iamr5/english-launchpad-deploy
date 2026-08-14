Ajustes de copy en /silabo-autonoma y /cip

Objetivo: eliminar el texto indicado del sílabo de la Autónoma y reencuadrar el landing del CIP para dejar de presentar el programa como algo "virtual" o "que todavía no existe".

## 1. /silabo-autonoma — eliminar bloque de metas diarias

Editar `src/assets/silabo-autonoma.html`:

- Quitar la tarjeta de métrica:
  ```html
  <div class="m"><span class="k">20</span><span class="u">min al día</span><span class="d">La meta diaria por defecto. Con ese ritmo el alumno avanza de nivel sin agotar el banco: sobra material, no falta.</span></div>
  ```
- Quitar el párrafo explicativo inmediatamente siguiente:
  ```html
  <p class="note" style="color:#9fb2d0;margin-top:12px"><b style="color:#fff">Nadie tiene que hacer las ≈145 h.</b> Es el volumen disponible: 8 127 ejercicios contados uno a uno sobre el contenido actual, al tiempo medio de resolución. El alumno avanza por su ruta —unos 20 minutos al día— y el resto del banco queda como práctica libre para quien quiera más repetición.</p>
  ```
- Mantener el resto del sílabo intacto: métricas de 145 h, 8 127 ejercicios, 45 microlecciones, 5 niveles y 11 040 palabras.

## 2. /cip — reencuadrar el mensaje: existe, está construido, falta el visto bueno del CIP

Editar `src/routes/cip.tsx` para cambiar el tono de "no existe / mes de espera" a "producto listo, el Colegio debe confirmar para encenderlo".

Cambios de copy:

- **Hero eyebrow**: de "Todavía no existe · Puede existir en un mes" a algo como "Plataforma construida · El Colegio debe activarla".
- **Hero lede**: de "Ya está construido. Falta una sola cosa: demostrar que los colegiados lo quieren." a enfatizar que la plataforma está lista, el CIP tiene que asegurarse de que los ingenieros la quieren, y entonces pueden empezar a disfrutarla.
- **Steps section**: de "Esto no está funcionando todavía. De ti depende que arranque." a "El Colegio nos pidió comprobar que los colegiados lo quieren antes de encender el acceso." o similar. Ajustar el copy de cada paso para que suene a confirmación de demanda, no a crowdfunding de algo inexistente.
- **Final CTA**: quitar "en un mes" del texto: "Diez segundos tuyos para que el {institución} pueda lanzar la plataforma de inglés de todos los colegiados...".
- **Footer**: de "Aún no es un servicio activo" a "Campaña de preinscripción · Plataforma lista para activarse".
- **Meta description/title**: quitar "Todavía no existe" y "Falta la demanda" del metadata; enfatizar que el programa está listo y se abre con el respaldo del Colegio.

No se toca la mecánica técnica: el formulario de correo, el contador, los botones de compartir, las capturas de pantalla, la demo ni la lógica de `getCipBrand`.

## Verificación

- Revisar el HTML de `silabo-autonoma` para confirmar que el bloque desapareció y no queda etiqueta suelta.
- Revisar el render de `/cip` para asegurar que no queda ninguna frase del tipo "no existe", "todavía no", "en un mes" o "virtual" en el sentido de "no real".
- Hacer build de desarrollo para comprobar que no hay errores de TS/JSX.
