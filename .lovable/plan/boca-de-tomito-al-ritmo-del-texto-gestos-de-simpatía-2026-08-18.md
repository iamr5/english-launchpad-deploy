# Boca de Tomito al ritmo del texto + gestos de simpatía

## Qué cambia

1. **Duración proporcional a lo que dice.** Hoy los globos de diálogo mueven la boca con una fórmula fija (45 ms por carácter, mínimo 600 ms) y el mínimo se queda corto en frases breves y largo en textos pausados. Se pasa a un cálculo por palabras y signos de puntuación: ritmo de lectura real (~3.3 palabras/segundo), pausa extra por comas y puntos, con piso de 900 ms y techo razonable. Cuando la frase la dice la voz sintetizada (lecciones, quizzes, vocabulario, speaking), la boca ya se corta exactamente al terminar el audio: eso se mantiene.

2. **Sonrisa y ojos entornados de vez en cuando.** Tomito, cuando está quieto, hará cada cierto tiempo un gesto corto: la boca cerrada se ensancha y curva un poco (sonrisa) mientras los ojos se entornan a media altura, durante ~1.2 s, y luego vuelve a su cara neutra. El gesto no se dispara mientras habla, para no pisar la animación de boca.

## Detalles técnicos

`src/assets/demo-app.html`
- `mascotTalkFor(ms)` sigue igual; se añade `talkDurationFor(text)` que calcula la duración (palabras × 300 ms + 180 ms por coma + 320 ms por punto, mín. 900 ms, máx. 9 s) y el globo de onboarding pasa a usarlo.
- Cualquier otro globo/burbuja que muestre texto de la mascota usa el mismo helper.

`public/demo-assets/mascots/mascot-runtime.js`
- Nuevo `Mascot.emote('smile', ms)` que aplica/quita la clase `emote-smile` en la raíz de la mascota, y un ciclo de reposo que lo dispara cada 9-16 s (aleatorio) solo si no está en `talking`; se detiene cuando la mascota se desmonta.

`public/demo-assets/mascots/tomito/mascot.css`
- Reglas `.tomito.emote-smile .mouth` (leve `scaleX`/curva y desplazamiento) y `.tomito.emote-smile .eyes` (`scaleY` ~0.55) con transición suave de entrada y salida; se anulan bajo `prefers-reduced-motion`.
- El gesto no se aplica cuando la mascota tiene la clase `talking`.

Verificación en `/demoautonoma` con capturas del gesto y del ciclo de habla.
