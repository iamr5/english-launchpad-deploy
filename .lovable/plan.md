# Mejoras al demo `/democip`

Todo ocurre dentro del HTML estático del demo (`src/assets/democip-index.html`, que es lo que sirve la ruta) más los archivos del test de ubicación que subiste, copiados a `public/democip/`. No se toca el backend, ni `/app`, `/dashboard`, `/demo`, `/cip` ni las presentaciones.

## 1. Botones de debug ocultos tras 7 toques

Los 4 FABs (Completar lección, Reiniciar progreso, Deshacer último quiz, Borrar TODO) dejan de mostrarse al arrancar. Se activan solo con 7 toques consecutivos sobre el fondo (no sobre botones, enlaces, inputs ni tarjetas interactivas), dentro de una ventana de ~2.5 s entre toques; si pasa más tiempo, el contador se reinicia. Al llegar a 7 aparecen con un aviso breve; 7 toques más los vuelven a ocultar.

## 2. Área clicable completa en todos los botones

Auditoría de los botones del demo para que toda la superficie responda al toque, no solo el texto:
- El texto y los iconos interiores pasan a `pointer-events: none` y los contenedores a área completa.
- Se elimina `touch-action: none` de los FABs (causa toques perdidos en móvil).
- El "Confirmar/Siguiente" del quiz se ancla con `touch-action: manipulation` y sin elementos flotantes que le roben el toque; con los FABs ocultos por defecto ya no puede quedarse trabado.

## 3. Resultado del quiz más notorio + auto-avance tipo Waze

- El bloque de resultado ("¡Bien hecho!" / "Casi — la respuesta es…") gana un banner de color a pantalla ancha, tipografía mayor e icono grande: verde para acierto, ámbar/rojo para error.
- El botón "Siguiente" muestra un anillo/barra de 1 segundo que se completa y auto-avanza. Tocarlo antes avanza de inmediato; el temporizador se cancela si el usuario interactúa con la explicación.
- En caso de error el auto-avance se alarga (o se desactiva) para que dé tiempo a leer la respuesta correcta.

## 4. Onboarding reordenado y ajustado

- "¿Cómo te llamas?" pasa a ser la segunda pantalla, justo después del saludo.
- Meta diaria: solo tres opciones — 15 min al día "Calentando", 30 min al día "Decidido", 1 hora al día "Imparable". Se eliminan 5/10/20.
- La pantalla "¿Cuánto inglés sabes?" se reemplaza por el test de ubicación de `test-ubicacion_1.zip` (banco de 40 ítems, 5 bandas, parada temprana, opción "No lo sé"), integrado dentro del flujo del onboarding y guardando el nivel estimado en el perfil local.
- "Esto vamos a practicar": los 3 elementos pierden borde/sombra para que no parezcan botones; el único botón sigue siendo el CTA inferior.

## 5. Quitar la marca "En colaboración con"

Se elimina el badge `langles_colaboracion.svg` y los logos `langles_iso.png` / `langles_logo.png` de todas las pantallas del demo.

## 6. Temporizador de meta diaria + insignia

Chip discreto en la barra superior que cuenta el tiempo activo del día contra la meta elegida. Solo suma tiempo cuando hay actividad real (scroll de lectura o respuestas de quiz) y se pausa con la pestaña en segundo plano. Al cumplir la meta, con progreso registrado, aparece una celebración breve y se otorga la insignia del día; nunca bloquea ni interrumpe la lección.

## 7. Desbloqueo de teoría evidente

Al aprobar un mini-quiz: Boti aparece con un mensaje ("¡Ahora vamos por aquí!"), la nueva sección entra con animación, se hace scroll suave hacia ella y el siguiente quiz se marca como recién desbloqueado con un realce temporal.

## 8. Enlace al dashboard desde el lobby

Botón/tarjeta "Ver mi progreso" en la pantalla principal del demo que lleva a `/dashboard`. Al estar el demo dentro de un iframe, la navegación se hace hacia la ventana superior para que abra la ruta real.

## 9. Chips de palabras con icono ✕

En el quiz de reconstruir frases, las palabras ya colocadas muestran una ✕ discreta dentro de la tarjeta, junto a la palabra, para que se entienda que se pueden quitar.

## 10. Progreso por sección (0–100% por bloque)

La barra de progreso se recalcula por sección desbloqueada: cada bloque de teoría llega a 100% al terminarlo, se marca como completado en la barra segmentada de la lección, y la nueva sección arranca en 0%. La barra general de la lección pasa a mostrarse por segmentos completados.

## 11. Audio sin límite

Se elimina el contador `MAX_PLAYS`: el botón "escuchar" se puede pulsar las veces que se quiera y desaparece el estado "sin más".

## Detalles técnicos

- Archivos a editar: `src/assets/democip-index.html` (fuente servida por `src/routes/democip.tsx`), copia espejo en `public/democip/index.html`.
- Archivos nuevos en `public/democip/`: `placement_items.js` y el motor del test extraído de `placement.html` (adaptado para vivir dentro del onboarding en vez de ser una página aparte).
- Se conserva el registro local `placement_log_v1` en `localStorage`; sin backend, tal como indica el README del test.
- Verificación final con Playwright en viewport móvil: onboarding completo, test de ubicación, quiz con auto-avance, temporizador y desbloqueo.
