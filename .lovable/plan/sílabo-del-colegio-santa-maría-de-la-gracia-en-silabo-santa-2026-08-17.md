# Sílabo del Colegio Santa María de la Gracia en /silabo-santa-maria

Publicar el dosier subido en `aprendoenglish.com/silabo-santa-maria`, con el mismo tratamiento que `/silabo-autonoma`, `/silabo-autonoma-1` y `/silabo-cip`, y corrigiendo lo que el documento de revisión señala.

## 1. Corregir el mensaje de "adaptación al programa"

El documento de revisión marca tres puntos con el mismo comentario: el dosier promete configuración a medida y eso no aplica a un colegio de unos pocos cientos de estudiantes.

- Sección 10 "La plataforma se ajusta al programa del colegio, no al revés" y su entradilla: se reescribe. El nuevo encuadre es que la plataforma llega **lista para usarse**, con el programa A1–C1 ya construido, y que la Coordinación **elige qué activa y en qué orden** desde su propio panel (secuencia, umbrales, campos de vocabulario), sin desarrollos a medida ni contenido hecho por encargo.
- Píldora "Se configura según el programa del colegio · la Coordinación define el qué y el cuándo" → pasa a hablar de selección y activación, no de configuración a medida.
- Tarjeta 03 "Bajo gestión académica": se replantea para que diga lo que sí ocurre — la Coordinación decide qué se habilita, cuándo y con qué exigencia, sobre contenido que ya existe.
- Se revisan las demás frases del mismo tipo (nota de "qué es configurable y qué no", tarjetas 01–05 de la sección 10) para que ninguna prometa desarrollo de contenido propio del colegio.

## 2. Corregir las cifras

El dosier trae los estimados antiguos. Se reemplazan por las cifras reales ya verificadas en los otros sílabos:

| Dice el dosier | Debe decir |
| --- | --- |
| 48 microlecciones | 45 lecciones (391 microlecciones) |
| 7 200 ejercicios | 8 127 ejercicios |
| 1 800 por formato | reparto real por formato |
| 8 000 palabras | 11 040 palabras |
| sin dato de horas | ≈145 h de práctica disponible |

Se revisan todas las apariciones: ficha de "Extensión", índice, píldoras de prueba, tarjetas de formato, banda de volumen, sección 10 y el cierre. Fecha de actualización: agosto de 2026.

## 3. Alinear con el feedback ya aplicado a los otros sílabos

- Bloque de apertura de evidencia **35% más retención** (práctica distribuida), con las mismas fuentes al pie, redactado para colegio (estudiantes de primaria y secundaria).
- Encuadre de **complemento, no reemplazo** del docente en portada y cierre.
- **Cambridge por delante** en la sección de correspondencia, con MCER como marco.
- Nivel A1 descrito en positivo.
- Los cuatro formatos con **maquetas esquemáticas en HTML/CSS**, no solo un número.
- Banda de volumen rehecha con la cifra de 8 127 como elemento dominante.
- Se elimina la sección 12 "Una misma herramienta, tres impactos distintos" (duplica la 13), conservando su frase de cierre, y la ruta de lanzamiento de 4 pasos del final. Se renumeran los rótulos.

## 4. Demos reales embebidos

La sección "Primero, veamos cómo lo viviría el alumno" pasa de maqueta a demos reales del colegio, igual que en los otros sílabos:

- Previsualizador web → iframe a `/santa-maria-de-la-gracia`
- Previsualizador móvil (marco de teléfono) → mismo demo
- Panel docente → `/santa-maria-de-la-gracia/dashboard`

Con botones "Ampliar" y "Abrir ↗", y carga diferida al hacer scroll.

## Detalle técnico

- `src/assets/silabo-santa-maria.html` (asset editable en el repo, como los otros sílabos).
- `src/routes/silabo-santa-maria.tsx`: handler `GET` que inyecta `headTags` (favicon `head.png` + Open Graph/Twitter con el nombre del colegio) y devuelve `text/html`.
- Se reutilizan las clases y el script de modal + IntersectionObserver de `silabo-autonoma.html`.
- Se añade el slug a `RESERVED_SLUGS` en `src/lib/demo-config.ts`.
- Verificación en navegador headless: escritorio y móvil, comprobando que los tres iframes cargan al hacer scroll y que ya no quedan cifras antiguas.
