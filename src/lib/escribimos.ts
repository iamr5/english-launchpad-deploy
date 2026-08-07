// Los ocho personajes de «mascotas escribimos», y el motor que los arma.
//
// La entrega original era un constructor.html suelto (sigue estando, tal cual,
// en public/demo-assets/mascots/escribimos/constructor.html). Esto es su motor
// portado a TypeScript para que el panel de demos pueda usarlo: elegir especie
// y colores ahí mismo y salir con un pack de mascota igual al que produciría un
// zip subido a mano.
//
// La data —cuerpo compartido, capas por especie, paletas— vive en
// public/demo-assets/mascots/escribimos/datos/personajes.json y se descarga la
// primera vez que alguien abre el constructor. Son 140 KB: no tiene sentido
// meterlos en el bundle del panel cuando la mayoría de visitas no lo abren.
//
// Cómo se dibuja, por qué el color viaja en el atributo `fill` y no en clases, y
// cómo se derivan los tonos: README.md de esa misma carpeta.

import { zipSync, strToU8 } from "fflate";
import type { MascotManifest } from "./mascot-pack";

/** Carpeta pública de la entrega. */
export const ESCRIBIMOS_DIR = "/demo-assets/mascots/escribimos/";

// ─────────────────────────────────────────────────────────────────────────────
// La data
// ─────────────────────────────────────────────────────────────────────────────

/** Una figura: etiqueta, clase de color, atributos ya serializados y color de respaldo. */
export type Figura = [tag: string, cls: string, attrs: string, fallback: string];

/** Un grupo del rostro. Los que son ojo se envuelven aparte para el parpadeo. */
export type GrupoCabeza = { p: Figura[]; ojo?: boolean };

export type Personaje = {
  nombre: string;
  en: string;
  tail: Figura[];
  mid: Figura[];
  head: GrupoCabeza[];
  glass: Figura[];
  /** Colores propios de la especie: `--f0`… el pelaje, `--p0`… los rosados. */
  vars: Record<string, string>;
  /** Colores de uniforme, sin los dos guiones: `shirt`, `pants`, `ink`… */
  tokens: Record<string, string>;
  /** Punto de giro de la cola, o null si la especie no tiene. */
  pivot: [number, number] | null;
};

export type Personajes = {
  viewBox: string;
  body: { back: Figura[]; armL: Figura[]; armR: Figura[]; shirt: Figura[] };
  logoRect: { x: number; y: number; width: number; height: number };
  /**
   * Variantes de cuerpo. Comparten TODO el arte: la única diferencia medida
   * entre ellas es cuánto sube el rostro respecto del torso (~20 unidades) y
   * el tamaño del hueco del logo en el polo. Por eso una variante son cuatro
   * números y no un dibujo nuevo — y por eso vale para los ocho personajes sin
   * pedir arte de ninguno.
   */
  cuerpos?: Record<
    string,
    {
      nombre: string;
      detalle?: string;
      /** Unidades que sube el rostro respecto del torso. */
      subeCabeza: number;
      logoRect: { x: number; y: number; width: number; height: number };
      /**
       * Polo propio de la variante. Si falta se usa el de `body.shirt`. El del
       * estampado es de cuello redondo y viene tal cual del SVG original, en
       * una sola pieza plana; el clásico son 132 con sombreado y contorno.
       */
      shirt?: Figura[];
    }
  >;
  chars: Record<string, Personaje>;
};

/** El emoji con el que cada especie se presenta en las lecciones. */
export const EMOJIS: Record<string, string> = {
  conejito: "🐰",
  gatito: "🐱",
  llamita: "🦙",
  mapachito: "🦝",
  monito: "🐵",
  osito: "🐻",
  perrito: "🐶",
  zorrito: "🦊",
};

let cache: Promise<Personajes> | null = null;

/** Descarga la data una sola vez por sesión. */
export function loadPersonajes(): Promise<Personajes> {
  cache ??= fetch(ESCRIBIMOS_DIR + "datos/personajes.json").then((r) => {
    if (!r.ok) throw new Error(`No se pudieron leer los personajes (${r.status}).`);
    return r.json() as Promise<Personajes>;
  });
  return cache;
}

// ─────────────────────────────────────────────────────────────────────────────
// Color
// ─────────────────────────────────────────────────────────────────────────────

const hex2rgb = (h: string) => {
  let s = h.replace("#", "");
  if (s.length === 3) s = [...s].map((c) => c + c).join("");
  return [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16) / 255);
};

const rgb2hex = (r: number[]) =>
  "#" +
  r
    .map((c) =>
      Math.round(Math.max(0, Math.min(1, c)) * 255)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("");

function toHSL(hex: string): [number, number, number] {
  const [r, g, b] = hex2rgb(hex);
  const mx = Math.max(r, g, b),
    mn = Math.min(r, g, b),
    l = (mx + mn) / 2;
  let h = 0,
    s = 0;
  if (mx !== mn) {
    const d = mx - mn;
    s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
    h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
    h *= 60;
  }
  return [h, s, l];
}

export function fromHSL(h: number, s: number, l: number) {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(1, s));
  l = Math.max(0, Math.min(1, l));
  const c = (1 - Math.abs(2 * l - 1)) * s,
    x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
    m = l - c / 2;
  const t = [
    [c, x, 0],
    [x, c, 0],
    [0, c, x],
    [0, x, c],
    [x, 0, c],
    [c, 0, x],
  ][Math.floor(h / 60) % 6];
  return rgb2hex(t.map((v) => v + m));
}

const croma = (hex: string) => {
  const [r, g, b] = hex2rgb(hex);
  return Math.max(r, g, b) - Math.min(r, g, b);
};
const satHSL = (hex: string) => toHSL(hex)[1];

type Delta = { base: boolean; dh: number; w: number; rs: number; claro: boolean; rl: number };

/**
 * Cada color de una especie se guarda como distancia respecto a su pelaje base:
 * matiz, viveza y luminosidad. El base sale siempre exacto y el resto conserva su
 * relación con él, así el antifaz del mapache sigue más oscuro que su cara y la
 * pechera del zorro más clara que su lomo, sea cual sea el color elegido.
 *
 * El matiz propio de un tono sólo pesa si ese tono es de verdad colorido: cremas
 * y grises adoptan el matiz nuevo en vez de irse a un color sin relación, que es
 * lo que mantiene crema un hocico crema.
 */
function deltas(base: string, map: Record<string, string>): Record<string, Delta> {
  const [bh, , bl] = toHSL(base),
    bs = satHSL(base);
  const out: Record<string, Delta> = {};
  for (const k in map) {
    const [h, , l] = toHSL(map[k]),
      c = croma(map[k]);
    out[k] = {
      base: map[k].toLowerCase() === base.toLowerCase(),
      dh: ((h - bh + 540) % 360) - 180,
      w: Math.max(0, Math.min(1, (c - 0.09) / 0.3)),
      // Saturación y luminosidad como proporciones, nunca como restas fijas: una
      // resta apaga el tono o lo manda a negro en cuanto el base nuevo es mucho
      // más oscuro o más apagado que el original.
      rs: bs > 0.03 ? satHSL(map[k]) / bs : 1,
      claro: l > bl,
      rl: l > bl ? (bl < 0.999 ? (l - bl) / (1 - bl) : 0) : bl > 0.001 ? l / bl : 1,
    };
  }
  return out;
}

function derive(newBase: string, dl: Record<string, Delta>) {
  const [nh, , nl] = toHSL(newBase),
    ns = satHSL(newBase),
    out: Record<string, string> = {};
  for (const k in dl) {
    const d = dl[k];
    if (d.base) {
      out[k] = newBase; // el base sale tal cual se eligió
      continue;
    }
    const L = d.claro ? nl + (1 - nl) * d.rl : nl * d.rl;
    out[k] = fromHSL(
      nh + d.dh * d.w,
      Math.max(0, Math.min(1, ns * d.rs)),
      Math.max(0.03, Math.min(0.98, L)),
    );
  }
  return out;
}

/**
 * El contorno del pantalón y el de las zapatillas son un solo trazo compuesto,
 * con su propia ranura y dibujado un punto más oscuro que el del cuerpo. El
 * control de contorno mueve los dos, guardando esa diferencia original, para que
 * ninguna línea se quede atrás al cambiarlo.
 */
const RAZON_SOMBRA = 0.713;
export function sombraDe(hex: string) {
  const [h, s, l] = toHSL(hex);
  return fromHSL(h, s, Math.max(0.02, l * RAZON_SOMBRA));
}

const deltasCache = new WeakMap<
  Personajes,
  Record<string, { skin: Record<string, Delta>; pink: Record<string, Delta> }>
>();

function deltasDe(data: Personajes, char: string) {
  let all = deltasCache.get(data);
  if (!all) {
    all = {};
    for (const n of Object.keys(data.chars)) {
      const v = data.chars[n].vars;
      const skin: Record<string, string> = {},
        pink: Record<string, string> = {};
      for (const k in v) (k.startsWith("--f") ? skin : pink)[k] = v[k];
      all[n] = { skin: deltas(v["--f0"], skin), pink: v["--p0"] ? deltas(v["--p0"], pink) : {} };
    }
    deltasCache.set(data, all);
  }
  return all[char];
}

// ─────────────────────────────────────────────────────────────────────────────
// Estado del constructor
// ─────────────────────────────────────────────────────────────────────────────

export type LogoModo = "none" | "color" | "img";

export type EstadoMascota = {
  char: string;
  /** Variante de cuerpo (ver Personajes.cuerpos). Vacío = la clásica. */
  cuerpo?: string;
  /** Color base del pelaje. Los demás tonos de la especie salen de aquí. */
  fur: string;
  /** Rosado de mejillas y orejas, si la especie los tiene. */
  pink: string | null;
  /** Con esto los rosados siguen al pelaje en vez de ir por libre. */
  linkPink: boolean;
  /** Tonos derivados fijados a mano, que ya no se recalculan. */
  fijos: Record<string, string>;
  /** Colores de uniforme. */
  tokens: Record<string, string>;
  cola: boolean;
  lentes: boolean;
  anim: boolean;
  logo: LogoModo;
  /** El logo, siempre como data URI: un SVG dentro de un <img> no carga nada de fuera. */
  logoImg: string | null;
  logoEscala: number;
  /** De dónde salió el logo, para poder rehacerlo al reabrir el constructor. */
  logoFrom?: "brand" | "file" | null;
};

export function estadoInicial(data: Personajes, char: string): EstadoMascota {
  const c = data.chars[char];
  return {
    char,
    fur: c.vars["--f0"],
    pink: c.vars["--p0"] ?? null,
    linkPink: false,
    fijos: {},
    tokens: { ...c.tokens },
    cola: !!c.tail.length,
    lentes: true,
    anim: true,
    logo: "color",
    logoImg: null,
    logoEscala: 1,
    logoFrom: null,
  };
}

/** Cambiar de especie conserva el uniforme y el logo: sólo cambia el animal. */
export function cambiarEspecie(data: Personajes, prev: EstadoMascota, char: string): EstadoMascota {
  const s = estadoInicial(data, char);
  return {
    ...s,
    tokens: {
      ...s.tokens,
      shirt: prev.tokens.shirt,
      shoe: prev.tokens.shoe,
      glass: prev.tokens.glass,
      ink: prev.tokens.ink,
      shoeInk: prev.tokens.shoeInk,
      logo: prev.tokens.logo,
    },
    logo: prev.logo,
    logoImg: prev.logoImg,
    logoEscala: prev.logoEscala,
    logoFrom: prev.logoFrom,
    anim: prev.anim,
    lentes: prev.lentes,
  };
}

/** Todos los colores ya resueltos, listos para pintar. */
export function colores(data: Personajes, S: EstadoMascota): Record<string, string> {
  const c = data.chars[S.char];
  const dl = deltasDe(data, S.char);
  const v: Record<string, string> = { ...derive(S.fur, dl.skin) };
  if (S.pink) {
    const base = S.linkPink
      ? derive(S.fur, deltas(c.vars["--f0"], { x: c.vars["--p0"] })).x
      : S.pink;
    Object.assign(v, derive(base, dl.pink));
  }
  for (const [k, val] of Object.entries(S.tokens)) v["--" + k] = val;
  Object.assign(v, S.fijos);
  return v;
}

/** Aplica un color al estado, con la regla del contorno de zapatillas incluida. */
export function aplicarColor(S: EstadoMascota, clave: string, hex: string): EstadoMascota | null {
  if (!/^#[0-9a-f]{6}$/i.test(hex)) return null;
  if (clave === "fur") return { ...S, fur: hex };
  if (clave === "pink") {
    const fijos = Object.fromEntries(Object.entries(S.fijos).filter(([k]) => !k.startsWith("--p")));
    return { ...S, pink: hex, linkPink: false, fijos };
  }
  const tokens = { ...S.tokens, [clave]: hex };
  if (clave === "ink") tokens.shoeInk = sombraDe(hex);
  return { ...S, tokens };
}

// ─────────────────────────────────────────────────────────────────────────────
// Dibujo
// ─────────────────────────────────────────────────────────────────────────────

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");

/**
 * El color viaja en el atributo `fill` de cada figura, nunca en clases CSS. Un
 * bloque <style> dentro de un SVG en línea no está aislado: aplica a todo el
 * documento, y con la vista previa y ocho miniaturas en la misma página ganaría
 * el último y todos los personajes saldrían del mismo color.
 */
function nodos(list: Figura[], vars: Record<string, string>) {
  return list
    .map(
      ([tag, cls, attrs, fb]) =>
        `<${tag} class="${cls}" fill="${vars["--" + cls] || fb}" ${attrs}/>`,
    )
    .join("");
}

/**
 * La animación, en CSS puro. Los ciclos duran distinto a propósito para que no
 * coincidan nunca y el movimiento no se sienta mecánico. Los @keyframes llevan
 * prefijo porque son globales aunque el resto se acote.
 */
function estilos(anim: boolean, pivot: [number, number] | null, scope: string) {
  if (!anim) return "";
  const q = scope ? scope + " " : "";
  return `
${q}#personaje{animation:esc-respira 3.4s ease-in-out infinite;transform-origin:406px 1380px}
${q}#cabeza{animation:esc-cabecea 5.1s ease-in-out infinite;transform-origin:406px 850px}
${q}#brazo-izq{animation:esc-brazoI 4.3s ease-in-out infinite;transform-origin:200px 930px}
${q}#brazo-der{animation:esc-brazoD 4.7s ease-in-out infinite;transform-origin:612px 930px}
${q}.ojo{transform-box:fill-box;transform-origin:center;animation:esc-parpadea 5.6s ease-in-out infinite}
${
  pivot
    ? `${q}#cola{animation:esc-colea 3.9s ease-in-out infinite;transform-origin:${pivot[0]}px ${pivot[1]}px}
@keyframes esc-colea{0%,100%{transform:rotate(-4deg)}50%{transform:rotate(4deg)}}`
    : ""
}
@keyframes esc-respira{0%,100%{transform:translateY(0) scale(1,1)}50%{transform:translateY(-9px) scale(1.006,.992)}}
@keyframes esc-cabecea{0%,100%{transform:rotate(-1.1deg) translateY(0)}50%{transform:rotate(1.1deg) translateY(-4px)}}
@keyframes esc-brazoI{0%,100%{transform:rotate(2.2deg)}50%{transform:rotate(-2.2deg)}}
@keyframes esc-brazoD{0%,100%{transform:rotate(-2.4deg)}50%{transform:rotate(2.4deg)}}
@keyframes esc-parpadea{0%,92%,100%{transform:scaleY(1)}95%{transform:scaleY(.08)}}
/* Con «reducir movimiento» no se para todo: se ralentiza, como el resto de
   mascotas de la app. Pararlo deja al personaje como una calcomanía, y su
   vaivén es decorativo, no informativo. El constructor suelto sí lo para; aquí
   manda la convención de la app, que además lo explica en el panel. */
@media (prefers-reduced-motion:reduce){
  ${q}#personaje,${q}#cabeza,${q}#brazo-izq,${q}#brazo-der,${q}.ojo,${q}#cola{animation-duration:9s}}`;
}

/**
 * La variante de cuerpo en uso. Si el estado guardado no la trae —o nombra una
 * que ya no existe— se cae a la clásica, que es el aspecto de siempre: así una
 * mascota guardada antes de esto se sigue dibujando igual.
 */
export function cuerpoDe(data: Personajes, S: EstadoMascota) {
  const v = data.cuerpos || {};
  return (
    v[S.cuerpo || ""] ||
    v.clasico || { nombre: "Clásico", subeCabeza: 0, logoRect: data.logoRect }
  );
}

/** La ranura del logo: sin logo, recuadro de color, o imagen recortada al rectángulo. */
function bloqueLogo(data: Personajes, S: EstadoMascota, vars: Record<string, string>) {
  if (S.logo === "none") return "";
  const r = cuerpoDe(data, S).logoRect,
    k = S.logoEscala;
  // Escala desde el centro de la ranura, así el logo crece sin moverse de sitio.
  const an = r.width * k,
    al = r.height * k;
  const at =
    `x="${(r.x + (r.width - an) / 2).toFixed(1)}" y="${(r.y + (r.height - al) / 2).toFixed(1)}"` +
    ` width="${an.toFixed(1)}" height="${al.toFixed(1)}"`;
  if (S.logo === "img") {
    if (!S.logoImg) return "";
    return (
      `<g id="logo"><clipPath id="recorteLogo"><rect ${at}/></clipPath>` +
      `<image ${at} href="${esc(S.logoImg)}" clip-path="url(#recorteLogo)" preserveAspectRatio="xMidYMid meet"/></g>`
    );
  }
  return `<g id="logo"><rect class="logo" fill="${vars["--logo"]}" ${at}/></g>`;
}

function interior(data: Personajes, S: EstadoMascota, vars: Record<string, string>) {
  const c = data.chars[S.char],
    B = data.body;
  const cabeza = c.head
    .map((g) => (g.ojo ? `<g class="ojo">${nodos(g.p, vars)}</g>` : nodos(g.p, vars)))
    .join("");
  const dy = cuerpoDe(data, S).subeCabeza || 0;
  const sube = dy ? ` transform="translate(0,${-dy})"` : "";
  return (
    `<g id="personaje">` +
    (S.cola && c.tail.length ? `<g id="cola">${nodos(c.tail, vars)}</g>` : "") +
    `<g id="cuerpo">${nodos(B.back, vars)}</g>` +
    `<g id="brazo-izq">${nodos(B.armL, vars)}</g><g id="brazo-der">${nodos(B.armR, vars)}</g>` +
    (c.mid.length ? `<g id="pecho">${nodos(c.mid, vars)}</g>` : "") +
    `<g id="polo">${nodos(cuerpoDe(data, S).shirt ?? B.shirt, vars)}</g>` +
    bloqueLogo(data, S, vars) +
    // El rostro (y los lentes con él) suben lo que pida la variante. Es el
    // único cambio de dibujo entre cuerpos: el arte es exactamente el mismo.
    `<g id="cabeza"${sube}>${cabeza}</g>` +
    (S.lentes ? `<g id="lentes"${sube}>${nodos(c.glass, vars)}</g>` : "") +
    `</g>`
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Encuadre
// ─────────────────────────────────────────────────────────────────────────────

/** La caja que ocupa el dibujo, en unidades del lienzo. La mide el navegador. */
export type Caja = { x: number; y: number; w: number; h: number };

export const ENCUADRE = {
  /** Aire alrededor del dibujo. La cola barre unos 17 px y las orejas 14 al cabecear. */
  margen: 24,
  /**
   * Proporción alto/ancho del pack. La app fija el ANCHO del hueco y deriva el
   * alto con esto, y las posiciones del mapa están calibradas con la de Boti
   * (1,5). Dándoles a todas las especies la misma, ninguna se descoloca.
   */
  ratio: 1.5,
};

const r2 = (n: number) => Math.round(n * 100) / 100;

/**
 * El encuadre de una especie a partir de su caja real.
 *
 * El lienzo de la entrega es común a las ocho y va justo para la más ancha, así
 * que a las estrechas les sobra aire a los lados y salían pequeñas: el hueco lo
 * fija el ancho, y un conejito que ocupa el 68 % de su lienzo se ve un tercio
 * más chico que un oso que ocupa el 83 % del suyo. Recortando por especie cada
 * una llena su hueco.
 *
 * Lo que falte para la proporción se añade ARRIBA, nunca abajo: el personaje
 * está plantado en el suelo y la línea de piso tiene que quedarse donde está.
 */
export function encuadrar(caja: Caja) {
  const m = ENCUADRE.margen;
  let x0 = caja.x - m,
    x1 = caja.x + caja.w + m;
  const y1 = caja.y + caja.h + m;
  let y0 = caja.y - m;

  if ((y1 - y0) / (x1 - x0) < ENCUADRE.ratio) {
    y0 = y1 - (x1 - x0) * ENCUADRE.ratio; // le falta alto: crece hacia arriba
  } else {
    const centro = (x0 + x1) / 2,
      ancho = (y1 - y0) / ENCUADRE.ratio; // le falta ancho: se reparte a los lados
    x0 = centro - ancho / 2;
    x1 = centro + ancho / 2;
  }
  const w = r2(x1 - x0),
    h = r2(y1 - y0);
  return { viewBox: `${r2(x0)} ${r2(y0)} ${w} ${h}`, artboard: { width: w, height: h } };
}

/**
 * El personaje entero. `scope` acota la animación cuando el SVG va en línea;
 * `viewBox` lo encuadra a la especie (sin él sale en el lienzo común, que es lo
 * que hay que usar para medirlo).
 */
export function personajeSVG(
  data: Personajes,
  S: EstadoMascota,
  {
    anim = S.anim,
    scope = "",
    id = "",
    viewBox = data.viewBox,
  }: { anim?: boolean; scope?: string; id?: string; viewBox?: string } = {},
) {
  const vars = colores(data, S),
    c = data.chars[S.char];
  const css = estilos(anim, S.cola ? c.pivot : null, scope);
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"` +
    `${id ? ` id="${id}"` : ""} viewBox="${viewBox}">` +
    `<style>${css}</style>${interior(data, S, vars)}</svg>`
  );
}

/**
 * Mide el dibujo tal cual, sin animación, montándolo fuera de la vista. Sólo el
 * navegador sabe dónde acaba un trazo, así que el encuadre se calcula aquí y no
 * con una tabla escrita a mano que se quedaría vieja al redibujar el arte.
 */
export function medirPersonaje(data: Personajes, S: EstadoMascota): Caja | null {
  if (typeof document === "undefined") return null;
  const hueco = document.createElement("div");
  hueco.setAttribute("aria-hidden", "true");
  hueco.style.cssText =
    "position:absolute;left:-10000px;top:0;width:200px;height:280px;pointer-events:none";
  hueco.innerHTML = personajeSVG(data, S, { anim: false });
  document.body.appendChild(hueco);
  try {
    const svg = hueco.firstElementChild as SVGSVGElement | null;
    const b = svg?.getBBox();
    return b && b.width ? { x: b.x, y: b.y, w: b.width, h: b.height } : null;
  } catch {
    return null;
  } finally {
    hueco.remove();
  }
}

/**
 * Sólo la cabeza: es lo que va en la barra superior de la app y en los globos de
 * diálogo. El recorte está pensado para las orejas más altas de las ocho
 * especies; si se añade alguna con orejas más altas, hay que subir el viewBox.
 */
export function cabezaSVG(data: Personajes, S: EstadoMascota) {
  const vars = colores(data, S),
    c = data.chars[S.char];
  const cabeza = c.head.map((g) => nodos(g.p, vars)).join("");
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="60 130 700 760">` +
    cabeza +
    (S.lentes ? nodos(c.glass, vars) : "") +
    `</svg>`
  );
}

/** La miniatura del selector de especie: la cabeza con los colores de fábrica. */
export function miniaturaSVG(data: Personajes, char: string) {
  const c = data.chars[char];
  const vars: Record<string, string> = { ...c.vars };
  for (const [k, v] of Object.entries(c.tokens)) vars["--" + k] = v;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="60 130 700 760">` +
    c.head.map((g) => nodos(g.p, vars)).join("") +
    nodos(c.glass, vars) +
    `</svg>`
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Paletas
// ─────────────────────────────────────────────────────────────────────────────

export const PELAJE = [
  "#FDF0E0",
  "#F6E0C8",
  "#EEB37C",
  "#C58B5C",
  "#8C5A3C",
  "#5E4034",
  "#C6D4EE",
  "#93A9CE",
  "#5C6B93",
  "#2F3A5C",
  "#BBB5B5",
  "#7C7C86",
  "#FD8730",
  "#F2C14E",
  "#E88BA8",
  "#B48BD6",
  "#6FBF9B",
  "#3E8B5C",
];
export const ROPA = [
  "#FEFEFE",
  "#E9EDF6",
  "#181C3F",
  "#2E3192",
  "#00AEEF",
  "#00A79D",
  "#662D91",
  "#BE1E2D",
  "#EF4136",
  "#F7941E",
  "#F2C14E",
  "#8B5E3C",
  "#5E1C3A",
  "#3C3C3C",
];
export const ROSAS = [
  "#FDA5AC",
  "#F48F97",
  "#FFC2C2",
  "#FDBEBB",
  "#FF8B88",
  "#E8829E",
  "#D98BA0",
  "#FFD9CF",
];
export const TINTAS = ["#181C3F", "#0B1020", "#2B2118", "#3A2A12", "#1F3A2E", "#4A2140"];

/** Los campos de uniforme, en el orden en que se enseñan. */
export const UNIFORME: [clave: string, etiqueta: string, paleta: string[]][] = [
  ["shirt", "Polo", ROPA],
  ["pants", "Pantalón", ROPA],
  ["shoe", "Zapatillas", ROPA],
  ["glass", "Lentes", ROPA],
  ["ink", "Contorno", TINTAS],
];

/** Una combinación al azar que se sostenga: pelaje vivo, uniforme casi siempre sobrio. */
export function alAzar(data: Personajes, prev: EstadoMascota): EstadoMascota {
  const pick = <T>(a: T[]) => a[Math.floor(Math.random() * a.length)];
  const nombres = Object.keys(data.chars);
  const n = pick(nombres);
  const S = estadoInicial(data, n);
  S.fur = fromHSL(Math.random() * 360, 0.18 + Math.random() * 0.55, 0.48 + Math.random() * 0.34);
  if (S.pink) S.linkPink = Math.random() < 0.3;
  S.tokens.pants = pick(ROPA);
  S.tokens.shirt = Math.random() < 0.68 ? "#FEFEFE" : pick(ROPA);
  S.tokens.shoe = Math.random() < 0.75 ? "#FEFEFE" : pick(ROPA);
  S.tokens.glass = Math.random() < 0.7 ? "#060E23" : pick(ROPA);
  S.lentes = Math.random() < 0.85;
  S.cola = !!data.chars[n].tail.length;
  // El logo es de la institución, no del azar: se conserva.
  S.logo = prev.logo;
  S.logoImg = prev.logoImg;
  S.logoEscala = prev.logoEscala;
  S.logoFrom = prev.logoFrom;
  return S;
}

// ─────────────────────────────────────────────────────────────────────────────
// El pack
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Lo que se guarda dentro del manifiesto para poder volver a abrir el
 * constructor donde se dejó. El logo no viaja aquí —sería un data URI enorme
 * dentro de la configuración del demo—; sólo de dónde salió.
 */
export type EstadoGuardado = Omit<EstadoMascota, "logoImg">;

export type ManifiestoEscribimos = MascotManifest & { escribimos: EstadoGuardado };

/** Si un manifiesto lo hizo este constructor, devuelve el estado con el que se hizo. */
export function estadoDePack(m: MascotManifest | null): EstadoGuardado | null {
  const e = (m as ManifiestoEscribimos | null)?.escribimos;
  return e && typeof e === "object" && e.char ? e : null;
}

export type Identidad = { name: string; shortName: string; kind: string; emoji: string };

/** Cómo se llama por defecto el personaje elegido. Todo es editable después. */
export function identidad(data: Personajes, char: string): Identidad {
  const nombre = data.chars[char].nombre;
  return {
    name: nombre,
    shortName: nombre,
    kind: `${nombre.toLowerCase()} guía`,
    emoji: EMOJIS[char] ?? "✨",
  };
}

/**
 * El CSS del pack. La animación no está aquí: viaja dentro del propio SVG, que
 * es un documento aparte y se anima solo aunque vaya dentro de un <img>. Aquí
 * sólo queda plantar la capa en su hueco.
 */
const PACK_CSS = `/* escribimos · mascot.css
   Una sola capa: el personaje entero, con su animación dentro del SVG.
   Generado por el constructor del panel; se puede editar a mano sin problema. */
.escribimos .bear  { position: absolute; inset: 0; }
.escribimos .group { position: absolute; inset: 0; }
.escribimos .layer { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
`;

/**
 * Arma el pack completo: manifiesto, hoja y las dos piezas de arte. Sale un zip
 * idéntico al que se subiría a mano, así pasa por la misma validación y se
 * guarda por el mismo camino que cualquier otro pack.
 *
 * `caja` es la medida real del dibujo, la que da el encuadre de esta especie. Sin
 * ella se cae al lienzo común de la entrega, que va justo para la especie más
 * ancha y deja pequeñas a las demás.
 */
export function packDeMascota(
  data: Personajes,
  S: EstadoMascota,
  ident: Identidad,
  caja?: Caja | null,
): { manifest: ManifiestoEscribimos; zip: File } {
  const [, , anchoLienzo, altoLienzo] = data.viewBox.split(/[\s,]+/).map(Number);
  const marco = caja
    ? encuadrar(caja)
    : { viewBox: data.viewBox, artboard: { width: anchoLienzo, height: altoLienzo } };
  const { logoImg: _omitido, ...guardado } = S;

  const manifest: ManifiestoEscribimos = {
    id: `escribimos-${S.char}`,
    name: ident.name,
    shortName: ident.shortName,
    kind: ident.kind,
    emoji: ident.emoji,
    engine: "layers",
    css: "mascot.css",
    rootClass: "escribimos",
    shadow: false,
    artboard: marco.artboard,
    headIcon: "head-icon.svg",
    layers: { personaje: "layers/personaje.svg" },
    stack: [{ layer: "personaje" }],
    escribimos: guardado,
  };

  const files: Record<string, Uint8Array> = {
    "mascot.json": strToU8(JSON.stringify(manifest, null, 2) + "\n"),
    "mascot.css": strToU8(PACK_CSS),
    "layers/personaje.svg": strToU8(
      personajeSVG(data, S, { anim: S.anim, viewBox: marco.viewBox }),
    ),
    "head-icon.svg": strToU8(cabezaSVG(data, S)),
  };

  const zip = zipSync(files, { level: 6 });
  return {
    manifest,
    zip: new File([zip as BlobPart], `${manifest.id}.zip`, { type: "application/zip" }),
  };
}

/**
 * Rescata el logo de un pack ya subido.
 *
 * En la configuración del demo sólo se guarda de dónde salió el logo, no la
 * imagen: un data URI dentro del config lo hincharía. Pero la imagen sí está
 * incrustada en el arte que se subió, así que al reabrir el constructor se saca
 * de ahí. Sin esto, quien hubiera subido un logo propio tendría que volver a
 * buscar el archivo cada vez que retoca la mascota, y si no lo encuentra, la
 * vuelve a generar sin logo sin darse cuenta.
 */
export async function logoDePack(baseUrl: string): Promise<string | null> {
  const r = await fetch(baseUrl.replace(/\/?$/, "/") + "layers/personaje.svg");
  if (!r.ok) return null;
  const m = /<image[^>]*href="(data:[^"]+)"/.exec(await r.text());
  return m ? m[1].replace(/&amp;/g, "&") : null;
}

/**
 * Convierte una imagen a data URI. Hace falta porque un SVG dentro de un <img>
 * no carga nada de fuera: un logo referenciado por URL saldría en blanco.
 */
export async function comoDataURI(src: string | Blob): Promise<string> {
  const blob = typeof src === "string" ? await (await fetch(src)).blob() : src;
  return await new Promise<string>((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result));
    r.onerror = () => rej(new Error("No se pudo leer la imagen."));
    r.readAsDataURL(blob);
  });
}
