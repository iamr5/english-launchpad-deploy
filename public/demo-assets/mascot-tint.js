// ─────────────────────────────────────────────────────────────────────────────
// mascot-tint.js — recolorea la mascota por RANGO DE TONO, en todas partes.
//
// POR QUÉ UN FILTRO Y NO CAMBIAR LOS COLORES DEL DIBUJO
// La mascota llega a la pantalla de tres formas y sólo una es alcanzable desde
// CSS:
//   · cuerpo entero, motor 'script' (Boti): SVG inline, colores en clases
//     .boti-stN  → sí se podría recolorear a mano;
//   · cuerpo entero, motor 'layers' (Ozito, Gallito): un <img> por capa;
//   · la cabeza suelta (headIcon): un <img> en la barra superior, los vítores,
//     la pantalla de victoria, el test de ubicación, la marca de agua cuando
//     tira del icono, el logo flotante del módulo…
// Un <img> es una caja opaca: sus rellenos no se tocan desde fuera. Un filtro
// trabaja sobre los píxeles ya pintados, así que es lo único que llega a las
// tres por igual — y a cualquier pack futuro, aunque venga en PNG.
//
// EL FILTRO, PRIMITIVA A PRIMITIVA
//   1. una matriz proyecta el croma de cada píxel sobre el eje del tono elegido
//      («cuánto de este tono tiene») y lo guarda en el canal alfa;
//   2. una rampa lineal lo convierte en máscara 0–1: dónde empieza a contar (la
//      anchura del rango) y cómo de blando es el borde (el difuminado);
//   3. la máscara se cruza con el alfa del original, para que respete la
//      transparencia del dibujo;
//   4. en paralelo, otra matriz aplica tono + saturación + luminosidad;
//   5. se recomponen con in/out: lo de dentro del rango teñido, lo de fuera
//      intacto — el original tal cual, no una copia reprocesada.
//
// LO QUE NO ES
// `hueRotate` es la aproximación matricial del giro de tono, la misma que usa
// filter:hue-rotate() en CSS, no una rotación HSL de verdad: los colores muy
// saturados derivan un poco y pueden recortar. Para recolorear una mascota
// basta. Y la selección es por TONO, no por pieza: no distingue unos ojos
// azules de un cuerpo azul.
//
// CÓMO SE ENGANCHA
// Todo cuelga de la variable CSS --mascot-tint, que vale vacío cuando está
// apagado. Las superficies que no traen filtro propio se cazan con reglas de
// especificidad cero (:where), para que cualquier regla de la plantilla les
// gane; las que YA declaran un filter (.boti-svg en boti.js, .brand-float en
// demo-app.html) componen la variable en su propia declaración:
//     filter: var(--mascot-tint) drop-shadow(…);
// Un pack nuevo con motor propio necesita esa misma línea en su CSS.
// ─────────────────────────────────────────────────────────────────────────────
(function (global) {
  'use strict';

  var SVG_NS = 'http://www.w3.org/2000/svg';
  var FILTER_ID = 'mascot-tint';
  var STYLE_ID = 'mascot-tint-css';
  var VAR = '--mascot-tint';
  var RAD = Math.PI / 180;

  // Red de seguridad. Los valores buenos los manda el servidor ya normalizados
  // (DEFAULTS.mascot.tint en src/lib/demo-config.ts); esto es sólo para cuando
  // se abre la plantilla suelta, sin configuración.
  var DEF = { hue: 210, range: 60, feather: 0.35, shift: 0, sat: 1, light: 1 };

  function num(v, d) { return typeof v === 'number' && isFinite(v) ? v : d; }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }

  // ── El eje del tono ────────────────────────────────────────────────────────
  // En vez de fiarse de una fórmula de tono, se toma el color puro de ese tono
  // —hsl(h,100%,50%)— y se mide su desvío respecto del gris. El eje sale así
  // del mismo espacio en el que luego se mide cada píxel, que es lo único que
  // importa para que la comparación tenga sentido.
  function pureRgb(h) {
    var s = (((h % 360) + 360) % 360) / 60;
    var x = 1 - Math.abs((s % 2) - 1);
    return [[1, x, 0], [x, 1, 0], [0, 1, x], [0, x, 1], [x, 0, 1], [1, 0, x]][Math.floor(s) % 6];
  }

  // Los tres coeficientes que, aplicados a R,G,B, dan la proyección del croma
  // del píxel sobre ese eje: 1 = ese tono a plena saturación, 0 = gris o tono
  // perpendicular, negativo = el tono opuesto.
  //   Y  = luma Rec.601      Cr = R − Y      Cb = B − Y
  function projRow(h) {
    var c = pureRgb(h);
    var y = 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2];
    var cr = c[0] - y, cb = c[2] - y;
    // Se divide por |croma|² y no por |croma|: una vez para hacer unitario el
    // eje y otra para que el tono puro puntúe 1 y no |croma|.
    var m2 = cr * cr + cb * cb || 1;
    var ur = cr / m2, ub = cb / m2;
    return [
      ur * 0.701 + ub * -0.299,
      ur * -0.587 + ub * -0.587,
      ur * -0.114 + ub * 0.886,
    ];
  }

  // ── Tono, saturación y luminosidad, en UNA sola matriz ─────────────────────
  // Las tres son matrices 3x3, así que se multiplican aquí y el filtro sólo
  // ejecuta una primitiva en vez de tres.
  function mul(a, b) {
    var o = [];
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        o[i * 3 + j] = a[i * 3] * b[j] + a[i * 3 + 1] * b[3 + j] + a[i * 3 + 2] * b[6 + j];
      }
    }
    return o;
  }

  // Las mismas constantes que usa feColorMatrix type="hueRotate" (SVG 1.1).
  function hueMatrix(deg) {
    var c = Math.cos(deg * RAD), s = Math.sin(deg * RAD);
    return [
      0.213 + c * 0.787 - s * 0.213, 0.715 - c * 0.715 - s * 0.715, 0.072 - c * 0.072 + s * 0.928,
      0.213 - c * 0.213 + s * 0.143, 0.715 + c * 0.285 + s * 0.140, 0.072 - c * 0.072 - s * 0.283,
      0.213 - c * 0.213 - s * 0.787, 0.715 - c * 0.715 + s * 0.715, 0.072 + c * 0.928 + s * 0.072,
    ];
  }

  function satMatrix(s) {
    return [
      0.213 + 0.787 * s, 0.715 - 0.715 * s, 0.072 - 0.072 * s,
      0.213 - 0.213 * s, 0.715 + 0.285 * s, 0.072 - 0.072 * s,
      0.213 - 0.213 * s, 0.715 - 0.715 * s, 0.072 + 0.928 * s,
    ];
  }

  // ── El nodo <filter>, creado una vez y reescrito en cada cambio ────────────
  function build(doc) {
    var f = doc.getElementById(FILTER_ID);
    if (f) return f;

    function mk(tag, attrs) {
      var el = doc.createElementNS(SVG_NS, tag);
      for (var k in attrs) el.setAttribute(k, attrs[k]);
      return el;
    }

    var svg = mk('svg', { 'aria-hidden': 'true', width: '0', height: '0' });
    svg.setAttribute('style', 'position:absolute;width:0;height:0;overflow:hidden');

    f = mk('filter', {
      id: FILTER_ID,
      // sRGB y no el linearRGB de serie: el tono se mide y se gira en el mismo
      // espacio en el que están escritos los colores del dibujo.
      'color-interpolation-filters': 'sRGB',
      // Holgado a propósito: la mascota se sale de su caja al saltar y un
      // filtro recorta a su región.
      x: '-25%', y: '-25%', width: '150%', height: '150%',
    });

    var tone = mk('feColorMatrix', { in: 'SourceGraphic', type: 'matrix', result: 'tone' });
    // El tono se mide sobre una copia saturada a tope, no sobre el original.
    // Sin esto la máscara depende de la viveza del color y no sólo de su tono:
    // el cuerpo de Boti es un azul pálido (#b6d8fc), se desvía muy poco del gris
    // y se quedaba SIEMPRE fuera de la franja — mover los mandos no hacía nada.
    // Al saturar primero, ese azul y un azul vivo puntúan parecido, que es lo
    // que espera quien pide «el azul».
    var vivid = mk('feColorMatrix', { in: 'SourceGraphic', type: 'saturate', values: '6', result: 'vivid' });
    var proj = mk('feColorMatrix', { in: 'vivid', type: 'matrix', result: 'proj' });
    var ramp = mk('feComponentTransfer', { in: 'proj', result: 'ramp' });
    var func = mk('feFuncA', { type: 'linear' });
    ramp.appendChild(func);
    // La máscara hereda la transparencia del dibujo: fuera de la silueta no hay
    // nada que teñir.
    var mask = mk('feComposite', { in: 'ramp', in2: 'SourceGraphic', operator: 'in', result: 'mask' });
    var hot = mk('feComposite', { in: 'tone', in2: 'mask', operator: 'in', result: 'hot' });
    var cold = mk('feComposite', { in: 'SourceGraphic', in2: 'mask', operator: 'out', result: 'cold' });
    var merge = mk('feMerge', {});
    merge.appendChild(mk('feMergeNode', { in: 'cold' }));
    merge.appendChild(mk('feMergeNode', { in: 'hot' }));

    [tone, vivid, proj, ramp, mask, hot, cold, merge].forEach(function (n) { f.appendChild(n); });
    svg.appendChild(f);
    (doc.body || doc.documentElement).appendChild(svg);

    f.__tone = tone; f.__proj = proj; f.__func = func;
    return f;
  }

  // ── Las superficies de mascota ────────────────────────────────────────────
  // `img.layer` lo escribe mascot-runtime.js para toda mascota de capas, sea
  // cual sea su rootClass; el otro selector es la cabeza suelta, cazada por su
  // propia URL: así entran TODAS sus apariciones —presentes y futuras— sin ir
  // marcando una por una los sitios que la pintan.
  function style(doc, headIcon) {
    var el = doc.getElementById(STYLE_ID);
    if (!el) {
      el = doc.createElement('style');
      el.id = STYLE_ID;
      (doc.head || doc.documentElement).appendChild(el);
    }
    var head = headIcon
      ? ',img[src="' + String(headIcon).replace(/["\\]/g, '\\$&') + '"]'
      : '';
    // --own-filter es la salida de emergencia para un elemento que YA trae
    // filtro propio: lo declara ahí y esta regla se lo devuelve detrás del
    // teñido, porque `filter` no se acumula entre reglas y si no lo perdería.
    // Hace falta para el logo flotante del módulo (.brand-float en
    // demo-app.html), que unas veces enseña el logo de la institución —que no
    // se tiñe— y otras la cabeza de la mascota —que sí—: la regla sólo gana
    // cuando la URL casa, así que la distinción sale sola.
    var css = ':root{' + VAR + ': }\nimg.layer' + head +
      '{filter:var(' + VAR + ') var(--own-filter,)}';
    if (el.textContent !== css) el.textContent = css;
  }

  /**
   * Enciende, apaga o reajusta el teñido. Barato de llamar en cada cambio de
   * un deslizador: no remonta nada, sólo reescribe números.
   *
   *   on, hue, range, feather, shift, sat, light   los parámetros
   *   headIcon   URL de la cabeza, TAL CUAL viaja en el src de los <img>
   *   scope      dónde vale (por defecto toda la página; el panel lo acota a
   *              su previo para no teñirse entero)
   */
  function apply(o) {
    o = o || {};
    var scope = o.scope || document.documentElement;
    var doc = scope.ownerDocument || document;

    if (!o.on) { scope.style.removeProperty(VAR); return; }

    var hue = num(o.hue, DEF.hue);
    var range = clamp(num(o.range, DEF.range), 0, 180);
    var feather = clamp(num(o.feather, DEF.feather), 0, 1);
    var shift = num(o.shift, DEF.shift);
    var sat = clamp(num(o.sat, DEF.sat), 0, 4);
    var light = clamp(num(o.light, DEF.light), 0, 4);

    style(doc, o.headIcon || '');
    var f = build(doc);

    // Tono + saturación + luminosidad. La luminosidad es un factor sobre el
    // resultado (lo mismo que hace filter:brightness), así que se funde con la
    // matriz multiplicando sus términos.
    var m = mul(satMatrix(sat), hueMatrix(shift));
    f.__tone.setAttribute('values', [
      m[0] * light, m[1] * light, m[2] * light, 0, 0,
      m[3] * light, m[4] * light, m[5] * light, 0, 0,
      m[6] * light, m[7] * light, m[8] * light, 0, 0,
      0, 0, 0, 1, 0,
    ].join(' '));

    // La proyección se guarda en el alfa desplazada a 0–1 (los resultados
    // intermedios de un filtro se recortan a ese rango): A = 0.5 + 0.5·proj.
    var p = projRow(hue);
    f.__proj.setAttribute('values', [
      0, 0, 0, 0, 0,
      0, 0, 0, 0, 0,
      0, 0, 0, 0, 0,
      0.5 * p[0], 0.5 * p[1], 0.5 * p[2], 0, 0.5,
    ].join(' '));

    // La rampa: dentro del rango vale 1, y baja a 0 a lo largo del difuminado.
    // Deshaciendo el desplazamiento anterior (proj = 2A − 1), la recta que va
    // de p0 a p1 queda en slope/intercept sobre A. El mínimo de anchura evita
    // dividir por cero cuando el rango es exacto y el borde, duro.
    var p1 = Math.cos(range * RAD);
    var fw = feather * (1 - p1) + 0.02;
    var p0 = p1 - fw;
    f.__func.setAttribute('slope', String(2 / fw));
    f.__func.setAttribute('intercept', String(-(1 + p0) / fw));

    // Con un <base href> en la página —lo que hace demo-page.ts— hubo
    // navegadores que resolvían el fragmento contra ÉL y no encontraban el
    // filtro, así que ahí se escribe la ruta entera. Donde no hay <base> se
    // deja el fragmento solo: el panel es una sola página que cambia de ruta
    // sin recargar, y una ruta escrita a fuego se quedaría vieja.
    var base = doc.querySelector('base[href]');
    var ref = base ? location.pathname + location.search : '';
    scope.style.setProperty(VAR, 'url("' + ref + '#' + FILTER_ID + '")');
  }

  global.MascotTint = { apply: apply, filterId: FILTER_ID };

  // Arranque solo en las páginas de demo: la configuración ya viaja en la
  // página, así que el teñido entra sin esperar a nadie.
  var d = global.DEMO;
  if (d && d.mascot && d.mascot.tint) {
    var t = d.mascot.tint;
    apply({
      on: t.on, hue: t.hue, range: t.range, feather: t.feather,
      shift: t.shift, sat: t.sat, light: t.light,
      headIcon: d.mascot.headIcon,
    });
  }
})(window);
