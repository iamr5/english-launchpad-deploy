// ─────────────────────────────────────────────────────────────────────────────
// mascot.js — LA MASCOTA (Ozzy el Osito). Único punto para cambiarla.
//
// La mascota son capas SVG (body, piernas, brazos, cabeza, lentes, moño, panza)
// apiladas y animadas por CSS (bloque ".tr-bear …" en index.html). mascotHTML()
// devuelve ese stack y se usa en TRES lugares: onboarding, test de ubicación y la
// ruta del módulo (el oso que camina en el mapa).
//
// ░░ PARA CAMBIAR LA MASCOTA ░░
//   1) Misma anatomía (otro personaje con las mismas partes):
//        reemplaza los .svg (body.svg, head.svg, glasses.svg, …) por los tuyos,
//        con los MISMOS nombres de archivo. Cero código.
//   2) Un solo archivo (SVG/PNG/Lottie ya animado):
//        cambia el cuerpo de mascotHTML() por, p. ej.:
//          return '<div class="single"><img src="mi-mascota.svg" alt=""></div>';
//        y quita/ajusta las animaciones ".tr-bear …" en index.html (ya no aplican).
//
// El envoltorio (clase/id/posición) lo pone cada pantalla; este archivo sólo
// define el CONTENIDO de la mascota.
// ─────────────────────────────────────────────────────────────────────────────
function mascotHTML() {
  return '<div class="shadow"></div><div class="bear">'
    +   '<div class="group torso"><img class="layer body" src="body.svg" alt=""></div>'
    +   '<img class="layer rightleg" src="rightleg.svg" alt="">'
    +   '<img class="layer leftleg" src="leftleg.svg" alt="">'
    +   '<div class="group torso">'
    +     '<img class="layer div" src="div.svg" alt="">'
    +     '<img class="layer leftarm" src="leftarm.svg" alt="">'
    +     '<img class="layer rightarm" src="rightarm.svg" alt="">'
    +     '<img class="layer head" src="head.svg" alt="">'
    +     '<div class="glassesfollow"><img class="layer glasses" src="glasses.svg" alt=""></div>'
    +     '<img class="layer bowtie" src="bowtie.svg" alt="">'
    +     '<img class="layer tummy" src="tummy.svg" alt="">'
    +   '</div>'
    + '</div>';
}

// Rellena los contenedores estáticos (.tr-bear vacíos) del onboarding y el test.
// Corre de forma síncrona al cargar (este script va DESPUÉS del HTML de esas
// pantallas y ANTES del script principal), así el oso ya está puesto antes de que
// cualquier pantalla se muestre — sin parpadeo. La ruta del módulo llama a
// mascotHTML() por su cuenta al construirse.
(function fillStaticMascots() {
  document.querySelectorAll('.tr-bear').forEach(function (el) {
    if (!el.children.length) el.innerHTML = mascotHTML();
  });
})();
