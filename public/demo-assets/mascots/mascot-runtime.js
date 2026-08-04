// ─────────────────────────────────────────────────────────────────────────────
// mascot-runtime.js — monta CUALQUIER mascota a partir de su mascot.json.
//
// Reemplaza al viejo mascotHTML() (que traía a Ozzy escrito a mano). El markup
// que produce para el pack `ozito` es idéntico al que producía aquella función,
// así que la animación de mascot.css calza sin tocar nada.
//
// Uso (síncrono, cuando el manifest ya viaja inyectado en la página):
//     Mascot.init(manifest, '/demo-assets/mascots/ozito/');
//     el.innerHTML = Mascot.html();
//
// Uso (asíncrono, para preview.html y para probar un pack suelto):
//     await Mascot.load('/demo-assets/mascots/ozito/');
//     Mascot.fill();            // rellena todo contenedor con la clase raíz
//
// Un pack se describe en mascot.json. Ver mascots/ozito/README.md.
// ─────────────────────────────────────────────────────────────────────────────
(function (global) {
  'use strict';

  var pack = null;   // el manifest ya cargado
  var base = '';     // carpeta del pack, con barra final

  function join(file) {
    if (!file) return '';
    if (/^(https?:)?\/\//.test(file) || file.charAt(0) === '/' || /^data:/.test(file)) return file;
    return base + file;
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;')
      .replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // Un nodo del árbol `stack` puede ser una capa, un grupo o un envoltorio:
  //   { layer: 'head' }                              → <img class="layer head">
  //   { group: 'torso', children: [...] }            → <div class="group torso">…</div>
  //   { wrapper: 'glassesfollow', children: [...] }  → <div class="glassesfollow">…</div>
  function node(n) {
    if (!n) return '';
    if (n.layer) {
      var file = pack.layers && pack.layers[n.layer];
      if (!file) return '';                       // capa declarada pero sin archivo → se omite
      return '<img class="layer ' + esc(n.layer) + '" src="' + esc(join(file)) + '" alt="">';
    }
    var kids = (n.children || []).map(node).join('');
    if (n.group)   return '<div class="group ' + esc(n.group) + '">' + kids + '</div>';
    if (n.wrapper) return '<div class="' + esc(n.wrapper) + '">' + kids + '</div>';
    return kids;
  }

  function injectCSS() {
    if (!pack.css) return;
    var id = 'mascot-css-' + pack.id;
    if (document.getElementById(id)) return;
    var link = document.createElement('link');
    link.id = id; link.rel = 'stylesheet'; link.href = join(pack.css);
    document.head.appendChild(link);
  }

  var api = {
    // Deja el pack listo. `manifest` es el objeto ya parseado; `baseUrl` la carpeta.
    init: function (manifest, baseUrl) {
      pack = manifest;
      base = baseUrl ? baseUrl.replace(/\/?$/, '/') : '';
      injectCSS();
      return api;
    },

    load: function (baseUrl) {
      var dir = baseUrl.replace(/\/?$/, '/');
      return fetch(dir + 'mascot.json')
        .then(function (r) {
          if (!r.ok) throw new Error('No se pudo leer ' + dir + 'mascot.json (' + r.status + ')');
          return r.json();
        })
        .then(function (m) { return api.init(m, dir); });
    },

    manifest: function () { return pack; },

    // Proporción alto/ancho del artboard. El host fija el ANCHO y deriva el alto
    // con esto, para que ninguna mascota salga aplastada.
    ratio: function () {
      var a = pack && pack.artboard;
      return a && a.width ? a.height / a.width : 1;
    },

    rootClass: function () { return (pack && pack.rootClass) || 'mascot'; },

    // Ruta al icono de cabeza (el que va en la barra superior y en los globos).
    headIcon: function () { return pack && pack.headIcon ? join(pack.headIcon) : ''; },

    html: function () {
      if (!pack) return '';
      var shadow = pack.shadow ? '<div class="shadow"></div>' : '';
      return shadow + '<div class="bear">' + (pack.stack || []).map(node).join('') + '</div>';
    },

    // Rellena los contenedores vacíos que ya existen en el HTML.
    fill: function (root) {
      var scope = root || document;
      var sel = '.' + api.rootClass();
      scope.querySelectorAll(sel).forEach(function (el) {
        if (!el.children.length) el.innerHTML = api.html();
      });
      return api;
    },

    mount: function (target, opts) {
      var el = typeof target === 'string' ? document.querySelector(target) : target;
      if (!el || !pack) return null;
      el.classList.add(api.rootClass());

      // Las capas van con position:absolute e inset:0, asi que necesitan que el
      // contenedor este posicionado. Si no lo esta, se resuelven contra algun
      // ancestro y la mascota sale gigante. Se garantiza aqui para no depender
      // de que cada sitio que la monte se acuerde.
      if (getComputedStyle(el).position === 'static') el.style.position = 'relative';

      el.innerHTML = api.html();

      if (opts && opts.width) {
        el.style.width = opts.width + 'px';
        el.style.height = (opts.width * api.ratio()) + 'px';
      } else {
        // Sin ancho pedido se respeta el del hueco, pero el alto se recalcula
        // con la proporcion de ESTA mascota: el del hueco suele estar pensado
        // para otra y la dejaria estirada.
        var w = el.getBoundingClientRect().width;
        if (w) el.style.height = (w * api.ratio()) + 'px';
      }
      return el;
    },
  };

  global.Mascot = api;
})(window);
