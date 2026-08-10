# Polo de cuello redondo que no se nota + marca de agua movible

## 1. El polo y la cabeza

Qué hay hoy, comprobado en los datos y en el motor:

- La variante «Cuello redondo» sí tiene su propio polo (3 piezas: contorno, pelaje del cuello y polo), distinto del clásico (132 piezas).
- El motor sí aplica el desplazamiento: sube el grupo del rostro y el de los lentes lo que diga la variante.
- Ese desplazamiento está puesto en **20 unidades sobre un lienzo de 1268 de alto**: menos del 1,6 % de la figura. Por eso «la deja en el mismo lugar»: el movimiento existe pero es imperceptible.

No doy por confirmado que 20 sea el número equivocado por error de medida o por otra causa, así que el primer paso es medirlo de verdad.

Qué haré:

1. **Medir sobre el arte, no a ojo.** Genero cada especie con el polo nuevo y la comparo con los SVG de referencia (gatito y perrito) alineando por los hombros y el borde del cuello, no por el lienzo. De ahí sale el desplazamiento real del rostro. Si difiere por especie, cada una lleva el suyo.
2. **Aplicar y verificar en las ocho**, con el polo nuevo y con el clásico: cuello, mentón, lentes y orejas en su sitio, sin hueco ni solape entre cabeza y cuello.
3. **Revisar la ranura del logo** del pecho con el desplazamiento correcto.
4. **Refrescar lo ya guardado.** Una mascota guardada conserva el dibujo con el que se generó: los demos que ya la usan no cambian solos aunque se arregle el arte. Compruebo si es tu caso; si lo es, dejo aviso en el panel («esta mascota se generó con una versión anterior, vuelve a guardarla») para que no parezca que el arreglo no funcionó.

## 2. Marca de agua: detrás, y donde tú quieras

Hoy la marca de agua va fija abajo a la izquierda y con una capa alta, por eso pisa los botones.

- Pasa **por debajo de toda la interfaz**: se ve el fondo, nunca encima de botones, tarjetas ni pantallas de celebración.
- Nuevos controles en **/demos → Marca**, junto a la casilla de marca de agua:
  - **Posición**: las cuatro esquinas, arriba/abajo al centro, o centrada.
  - **Separación** del borde (horizontal y vertical).
  - **Tamaño** y **transparencia**.
- Vista previa en vivo en el panel, para no tener que publicar para ver cómo queda.
- Los demos existentes se quedan como están (abajo a la izquierda) mientras nadie toque los nuevos controles.

## Detalle técnico

- Arte y desplazamiento: `public/demo-assets/mascots/escribimos/datos/personajes.json` (`cuerpos.estampado.subeCabeza`, y `subeCabeza` por especie si hace falta); motor en `src/lib/escribimos.ts` (`cuerpoDe`, `interior`).
- Marca de agua: `.brand-wm` en `public/demo-assets/splash.css` baja a una capa por debajo de la UI; `src/assets/demo-app.html` (`mountBrandLogos`) aplica posición/tamaño/opacidad desde la configuración; campos nuevos `brand.watermarkPos`, `watermarkX`, `watermarkY`, `watermarkSize`, `watermarkOpacity` en `src/lib/demo-config.ts` y sus controles en `src/routes/_authenticated/demos.tsx`.
