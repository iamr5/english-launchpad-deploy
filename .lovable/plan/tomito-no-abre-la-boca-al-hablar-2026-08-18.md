# Tomito no abre la boca al hablar

## Qué encontré

- El pack de Tomito ya trae las dos bocas (`mouth.svg` cerrada y `mouth-open.svg`) y su CSS ya define el estado `talking`: con esa clase se oculta la boca cerrada y se muestra la abierta con una animación de apertura/cierre.
- El motor de mascotas expone `Mascot.talk(on)`, que pone y quita esa clase.
- **Nadie llama nunca a `Mascot.talk`.** No hay una sola llamada en toda la app ni en las presentaciones, así que la boca jamás se activa: Tomito (y cualquier otra mascota con boca) siempre se ve con la boca cerrada.

## Qué haré

1. Conectar la voz de la app con la boca: cuando la app pronuncia una frase (el reproductor de audio de las lecciones, quizzes, vocabulario y speaking), abrir la boca al empezar y cerrarla al terminar o al cortar el audio.
2. Conectar también los globos de texto de la mascota: cuando Boti/Tomito "dice" algo en pantalla, la boca se mueve mientras dura el mensaje y se cierra al final.
3. Revisar el movimiento en sí para que se lea claro: alternar boca abierta/cerrada en un ritmo natural de habla en lugar de una sola deformación, y respetar la preferencia de "reducir movimiento".
4. Comprobarlo en `/demoautonoma` (Tomito) y en un demo con Boti, para que el mismo enganche sirva para todas las mascotas del catálogo.

## Detalles técnicos

- `src/assets/demo-app.html`: llamar `window.Mascot?.talk(true)` en el `onstart` de `speak()` y `talk(false)` en `done()`/`stopSpeak()`, más en el flujo de speaking que usa `SpeechSynthesisUtterance` directo (~línea 7093). Envolver en try/catch para no romper demos sin runtime de mascota.
- Mismo enganche en el panel de progreso (`demo-dashboard.html`) si allí la mascota emite mensajes.
- `public/demo-assets/mascots/tomito/mascot.css`: ajustar `@keyframes tomito-talk` para alternar visibilidad entre `.mouth` y `.mouthopen` (ritmo ~0.22s) en vez de solo escalar, y fijar `transform-origin` de la boca.
- Sin cambios de esquema ni de contenido.
