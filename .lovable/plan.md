# Diálogos legibles + celebraciones mágicas al terminar un quiz

## 1. Texto con varios personajes: formato de diálogo

Hoy toda la pregunta se pinta como un único bloque en negrita de 23px (`.q-question`), así que un texto tipo
`Lee: "Rosa: ... Milagros: ... Luis: ..." — ¿Quién no está convencido?` sale como un muro de texto.

Cambio: separar visualmente **el pasaje** de **la pregunta**.

```text
┌─ pasaje (tarjeta suave, texto normal 16px) ──────────┐
│  ROSA     Good afternoon, everyone. Today I will …   │
│  MILAGROS Moreover, it is widely accepted that …     │
│  LUIS     On the contrary, I firmly believe …        │
│  ROSA     That's an interesting question. …          │
└──────────────────────────────────────────────────────┘
¿Quién no está convencido de que la tendencia sea clara?   ← pregunta (negrita, como hoy)
```

Detalles:
- Cada intervención en su propia línea, con el nombre del hablante como etiqueta pequeña en mayúsculas y color de marca; se alternan sutilmente los fondos para distinguir turnos.
- Si el pasaje no tiene hablantes (narración larga entre comillas), se muestra igual como tarjeta de lectura en peso normal, con la pregunta debajo en negrita.
- Si no hay pasaje, todo queda exactamente como está hoy.
- Aplica a todos los tipos de quiz (opción múltiple, escucha, detección de error, escritura) y en todos los lugares donde se usan: ruta, examen final, práctica, mini-quiz del landing.

## 2. Celebraciones al completar un quiz

Hoy hay una sola pantalla de victoria (Boti + confeti). Se añaden **4 variantes** que se eligen al azar sin repetir la anterior:

1. **Confeti** (la actual, retocada).
2. **Estelar**: destellos y estrellas que salen desde la mascota con un anillo de luz que se expande.
3. **Fuegos artificiales**: dos o tres estallidos escalonados detrás de la tarjeta de resultados.
4. **Sellos de XP**: la XP y la racha entran con un "golpe" de sello y ondas doradas, con la mascota rebotando.

Comunes a todas: la mascota completa entra con rebote, los chips de XP/racha aparecen escalonados, y todo respeta la preferencia de "menos movimiento" (se degrada a una entrada simple).

## Notas técnicas

- `src/assets/demo-app.html`: nuevo helper `questionHTML(q)` que parsea el enunciado (`Lee:`/`Escucha:` + comillas + ` — ` prompt) y devuelve `.q-passage` + `.q-question`; se sustituye en los 4 renderers (`renderMC`, orden/escucha, detección de error, writing) y en el mini-quiz.
- Nuevos estilos `.q-passage`, `.qp-line`, `.qp-who` con tokens existentes (`--line`, `--muted`, color de marca). Sin colores hardcodeados nuevos.
- `lessonCelebration()` pasa a elegir una de 4 funciones de efecto (`fxConfetti`, `fxStars`, `fxFireworks`, `fxStamp`), guardando la última usada para no repetir; keyframes CSS nuevos, sin librerías extra.
- Sin cambios en datos ni en el backend; el contenido del banco se queda igual.
