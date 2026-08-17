# Ajustes de sílabos y de la landing /cip

## 1. "391 partes" → "391 microlecciones"

En `/silabo-cip` y `/silabo-autonoma` (badge del hero, ficha "Extensión", índice, muro de cifras, píldoras de prueba, textos corridos y las descripciones sociales de ambas rutas) se cambia la redacción:

- "45 lecciones · 391 partes" → "45 lecciones · 391 microlecciones"
- "391 / partes de lección" → "391 / microlecciones"

Se aplica también en `/cip`, donde la ficha grande dice hoy "391 partes de lección", para que las tres páginas hablen igual.

## 2. Hero de /cip: el formulario en su propia fila

Hoy el hero es una rejilla de dos columnas y el formulario vive dentro de la columna izquierda, así que queda descentrado respecto a la pantalla.

Nueva estructura:

```text
┌─ hero (columna grande) ─────────────────────┐
│ fila 1:  [ texto + chips ] [ Boti ]         │
│ fila 2:  [   formulario centrado (1 col)  ] │
└─────────────────────────────────────────────┘
```

La fila 1 mantiene las dos columnas actuales (texto/mascota). La fila 2 ocupa todo el ancho y el bloque del formulario queda centrado horizontalmente, con un ancho máximo cómodo (~620 px) y el contador de firmas debajo, también centrado. En móvil se apila igual que hoy.

## 3. El shimmer pasa a envolver todo el formulario

- El brillo deja de estar en la nota "Sin costo y sin compromiso…" y pasa a la tarjeta que contiene el campo de correo y el botón "Firmar mi preinscripción": el shimmer recorre toda esa tarjeta.
- La nota de privacidad se vuelve discreta: sin borde de color ni fondo tintado ni icono destacado, sólo texto pequeño en gris con un candado sutil, centrado bajo el formulario.
- Se respeta `prefers-reduced-motion` (sin animación).

## 4. Chips del hero menos "de error"

Los chips actuales usan el rojo institucional plano y se leen como alertas. Se adoptan las reglas de `/silabo-cip`:

- Chips normales: borde y fondo translúcidos en azul claro sobre la banda oscura, texto claro, punto en azul suave.
- El chip destacado ("Incluye inglés técnico por especialidad") deja de ser rojo sólido: borde coral al 55 %, fondo coral al 13 % y texto en tono claro, con el punto del mismo tono; se conserva un pulso muy suave.

## Detalle técnico

- `src/routes/cip.tsx`: reestructurar `Hero` (fila 1 grid de 2 columnas, fila 2 con el formulario centrado), mover la clase `.promise`/shimmer al contenedor del formulario dentro de `EmailForm`, y actualizar el CSS embebido de `.badges` / `.badges li.hot` con la paleta del sílabo. Cambio de texto en `METRICS` y en el `head()`.
- `src/assets/silabo-cip.html`, `src/assets/silabo-autonoma.html`, `src/routes/silabo-cip.tsx`, `src/routes/silabo-autonoma.tsx`: sustitución de la palabra "partes" por "microlecciones".
- Verificación con capturas en móvil y escritorio del hero de `/cip`.
