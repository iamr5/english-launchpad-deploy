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

  // Un nodo del árbol `stack` puede ser una capa, un grupo, un envoltorio o una
  // ranura:
  //   { layer: 'head' }                              → <img class="layer head">
  //   { group: 'torso', children: [...] }            → <div class="group torso">…</div>
  //   { wrapper: 'glassesfollow', children: [...] }  → <div class="glassesfollow">…</div>
  //   { slot: 'chestlogo' }                          → <div class="chestlogo"></div>
  //
  // Los packs con "inline": true no usan <img>: su SVG se pega dentro del DOM
  // para que las variables CSS de la página (la ropa del personaje) lo alcancen.
  // Un <img> es un documento aparte y las variables no cruzan esa frontera.
  function node(n) {
    if (!n) return '';
    if (n.slot) return '<div class="' + esc(n.slot) + '"></div>';
    if (n.layer) {
      var file = pack.layers && pack.layers[n.layer];
      if (!file) return '';                       // capa declarada pero sin archivo → se omite
      if (pack.inline) {
        return '<span class="layer ' + esc(n.layer) + '" data-svg="' + esc(join(file)) + '"></span>';
      }
      return '<img class="layer ' + esc(n.layer) + '" src="' + esc(join(file)) + '" alt="">';
    }
    var kids = (n.children || []).map(node).join('');
    if (n.group)   return '<div class="group ' + esc(n.group) + '">' + kids + '</div>';
    if (n.wrapper) return '<div class="' + esc(n.wrapper) + '">' + kids + '</div>';
    return kids;
  }

  // ── Capas en línea ──────────────────────────────────────────────────────────
  // Quien monta la mascota lo hace de mil formas (innerHTML suelto, mount(),
  // fill(), plantillas del demo). En vez de perseguir a cada uno, se vigila el
  // documento: cualquier [data-svg] que aparezca se rellena solo.
  var svgCache = {};
  function hydrate(el) {
    if (!el || el.dataset.svgDone) return;
    var url = el.getAttribute('data-svg');
    if (!url) return;
    el.dataset.svgDone = '1';
    var got = svgCache[url] || (svgCache[url] = fetch(url).then(function (r) { return r.text(); }));
    got.then(function (txt) { el.innerHTML = txt; }).catch(function () { delete el.dataset.svgDone; });
  }
  function hydrateAll(root) {
    (root || document).querySelectorAll('[data-svg]').forEach(hydrate);
  }
  if (typeof MutationObserver === 'function') {
    new MutationObserver(function (muts) {
      muts.forEach(function (m) {
        m.addedNodes.forEach(function (nd) {
          if (nd.nodeType !== 1) return;
          if (nd.hasAttribute && nd.hasAttribute('data-svg')) hydrate(nd);
          if (nd.querySelectorAll) hydrateAll(nd);
        });
      });
    }).observe(document.documentElement, { childList: true, subtree: true });
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

    // Rellena a mano las capas en línea que ya estén puestas. El observador de
    // arriba lo hace solo; esto está para quien monte la mascota antes de
    // cargar este archivo.
    hydrate: function (root) { hydrateAll(root); return api; },

    /**
     * Abre y cierra la boca. Se llama al empezar y al terminar de hablar
     * (voz o globo de texto). En packs sin boca abierta no hace nada.
     */
    talk: function (on, root) {
      var sel = '.' + api.rootClass();
      (root || document).querySelectorAll(sel).forEach(function (el) {
        el.classList.toggle('talking', !!on);
        if (on) el.classList.remove('emote-smile');
      });
      return api;
    },

    /**
     * Un gesto corto: por ahora 'smile' (sonrisa + ojos entornados). No se
     * aplica sobre una mascota que esté hablando, para no pisar la boca.
     */
    emote: function (name, ms, root) {
      var sel = '.' + api.rootClass();
      var cls = 'emote-' + (name || 'smile');
      (root || document).querySelectorAll(sel).forEach(function (el) {
        if (el.classList.contains('talking')) return;
        el.classList.add(cls);
        clearTimeout(el._emoteT);
        el._emoteT = setTimeout(function () { el.classList.remove(cls); }, Math.max(400, ms || 1200));
      });
      return api;
    },
  };

  // Ciclo de reposo: cada 9-16 s la mascota sonríe un instante si no habla.
  function idleEmotes() {
    setTimeout(function () {
      try { api.emote('smile', 1200); } catch (e) {}
      idleEmotes();
    }, 9000 + Math.random() * 7000);
  }
  idleEmotes();





  global.Mascot = api;
})(window);
