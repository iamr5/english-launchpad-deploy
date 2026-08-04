# Pack de mascota — `gallito`

**Gallito el Tumi** ✨ — un tumi, el cuchillo ceremonial peruano, no un gallo:
el nombre es suyo, no describe la especie. Cinco capas SVG apiladas y animadas por CSS, igual que
[`ozito`](../ozito/README.md), del que sale su animación.

## Capas

Las cinco comparten lienzo (809.74 × 1179.21), que es lo que permite apilarlas
como acetatos:

| Capa | Dónde está en el lienzo |
| --- | --- |
| `cape` | detrás de todo |
| `legs` | del 57% al 97% de alto: llegan al suelo |
| `body` | del 57% al 83% |
| `head` | del 8% al 53% |
| `eyes` | entre el 40% y el 57%, dentro de la cabeza |

## Cómo se mueve

- **Sobre todo vertical.** El torso sube y baja; las rotaciones no pasan de un
  grado, sólo para que no parezca un ascensor.
- **Sin brazos.** No hay capa de brazos, así que no hay péndulo: todo el
  movimiento nace del torso.
- **Las patas se estiran** desde el pie plantado (pivote al 97%) y no se
  despegan del suelo, igual que en Ozzy.
- **La cara cabecea** girando sobre el cuello (52%).
- **La capa acompaña con retraso** (4,6 s frente a 3,4 s), para que se note el
  peso.
- **Los ojos parpadean** en su propio ciclo de 5,9 s, con dos cierres seguidos y
  una pausa larga. Va desacompasado del cabeceo a propósito, para que no caiga
  siempre en el mismo punto.

Los ojos viven dentro del envoltorio `headbob` junto con la cabeza: así cabecean
con ella. Sueltos se quedarían atrás.

## Probarlo

```sh
# desde esta carpeta
python -m http.server 8000
# abre http://localhost:8000/preview.html
```

El panel lateral marca cada capa como `ok` o `falta`, y el deslizador cambia el
tamaño para comprobar que nada se descoloca al escalar.

## Ajustar la animación

Todo está en `mascot.css`, y lo que casi siempre hay que tocar son los pivotes:

```css
.gallito .headbob { transform-origin: 50% 52%; }  /* el cuello */
.gallito .legs    { transform-origin: 55% 97%; }  /* el pie plantado */
.gallito .eyes    { transform-origin: 52.5% 47%; }
```

Van en porcentaje del lienzo, no en píxeles, así que el gallito se ve igual a
cualquier tamaño.
