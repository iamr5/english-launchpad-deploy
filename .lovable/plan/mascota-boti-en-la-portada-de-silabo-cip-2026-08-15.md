# Mascota Boti en la portada de /silabo-cip

Replicar en `/silabo-cip` el tratamiento de mascota que ya tiene `/silabo-autonoma` (Nomi en la portada + sello con la cabecita), usando Boti, la mascota del demo del CIP (`src/demos/democip.json` → pack `boti`).

## Qué se verá

- **Portada**: el bloque de título/standfirst pasa a una grilla de dos columnas; a la derecha aparece Boti de cuerpo completo con un pie de figura corto ("Boti · la guía que acompaña al colegiado dentro de la plataforma").
- **Sello**: en la sección donde `/silabo-autonoma` muestra el `nomi-tag`, se añade el equivalente con `boti_head.svg` y el texto "Con Boti, la guía de la plataforma".
- **Móvil**: igual que en la Autónoma, la grilla colapsa a una columna y la mascota se muestra en fila con el texto, más pequeña.
- **Impresión**: la mascota se mantiene visible pero sin sombras pesadas.

## Detalles técnicos

- Archivo a editar: `src/assets/silabo-cip.html` (portada en la línea ~751, estilos junto a los bloques `.cover`).
- Boti se renderiza con el runtime `/demo-assets/mascots/boti/boti.js` (`Boti.mount(el, { shadow:true, track:true })`), igual que en `/cip`. Se monta con un `<script>` pequeño al final del HTML, con guarda por si el runtime no carga (fallback a `/demo-assets/mascots/boti/boti_head.svg`).
- El montaje se hace sólo cuando la portada es visible (o inmediatamente, al ser hero) para no afectar el tiempo de carga; el resto de la página (iframes lazy de `/democip`) no se toca.
- Sin cambios de datos, cifras ni copy existente; `src/routes/silabo-cip.tsx` no requiere cambios.
