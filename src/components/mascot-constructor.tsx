// El constructor de mascotas dentro del panel: se elige especie y colores y sale
// un pack de mascota listo, sin descargar plantillas ni subir zips a mano.
//
// El motor —la data de los ocho personajes, el cálculo de color y el armado del
// SVG— está en src/lib/escribimos.ts. Aquí sólo están los controles.
//
// Lo que se genera es un pack normal y corriente: se empaqueta en un zip en
// memoria y se sube por el MISMO camino que un pack hecho a mano, así pasa por
// la misma validación y el resto de la app no distingue entre uno y otro.

import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { uploadPack, type MascotManifest } from "@/lib/mascot-pack";
import {
  ESCRIBIMOS_DIR,
  PELAJE,
  ROSAS,
  UNIFORME,
  alAzar,
  aplicarColor,
  cambiarEspecie,
  colores,
  comoDataURI,
  estadoDePack,
  estadoInicial,
  identidad,
  loadPersonajes,
  miniaturaSVG,
  packDeMascota,
  personajeSVG,
  type EstadoMascota,
  type Personajes,
} from "@/lib/escribimos";

/** Un color: muestras a la vista, campo hex escribible y selector del sistema.
 *  Las tres formas porque el selector nativo no abre en todas partes. */
function CampoColor({
  etiqueta,
  valor,
  paleta,
  disabled,
  onChange,
}: {
  etiqueta: string;
  valor: string;
  paleta: string[];
  disabled?: boolean;
  onChange: (hex: string) => void;
}) {
  // El campo hex se escribe carácter a carácter, así que lleva su propio texto:
  // si se pintara desde el estado, «#1» se descartaría antes de acabar de teclear.
  const [texto, setTexto] = useState(valor);
  const tocando = useRef(false);
  useEffect(() => {
    if (!tocando.current) setTexto(valor.toUpperCase());
  }, [valor]);

  return (
    <div className={`space-y-1.5 ${disabled ? "opacity-45 pointer-events-none" : ""}`}>
      <div className="flex items-center gap-2">
        <Label className="flex-1">{etiqueta}</Label>
        <Input
          value={texto}
          maxLength={7}
          spellCheck={false}
          aria-label={`Código hex de ${etiqueta.toLowerCase()}`}
          className="h-8 w-24 font-mono text-xs"
          onFocus={() => (tocando.current = true)}
          onBlur={() => {
            tocando.current = false;
            setTexto(valor.toUpperCase());
          }}
          onChange={(e) => {
            let v = e.target.value.trim();
            if (v && v[0] !== "#") v = "#" + v;
            setTexto(v);
            onChange(v);
          }}
        />
        <input
          type="color"
          value={/^#[0-9a-f]{6}$/i.test(valor) ? valor : "#000000"}
          onChange={(e) => onChange(e.target.value)}
          aria-label={etiqueta}
          className="h-8 w-9 shrink-0 cursor-pointer rounded-md border bg-transparent"
        />
      </div>
      <div className="flex flex-wrap gap-1">
        {paleta.map((c) => (
          <button
            key={c}
            type="button"
            title={c}
            aria-label={`${etiqueta} ${c}`}
            aria-pressed={c.toLowerCase() === (valor ?? "").toLowerCase()}
            onClick={() => onChange(c)}
            style={{ background: c }}
            className="h-6 w-6 rounded-md border transition aria-pressed:ring-2 aria-pressed:ring-primary aria-pressed:ring-offset-1"
          />
        ))}
      </div>
    </div>
  );
}

export function MascotConstructor({
  slug,
  brandLogo,
  manifest,
  enUso,
  onUsar,
}: {
  slug: string;
  /** Logo de la institución, si lo hay: es lo que se ofrece para la ranura del polo. */
  brandLogo?: string;
  /** El manifiesto del pack en uso, para reabrir el constructor donde se dejó. */
  manifest: MascotManifest | null;
  /** Si el demo está usando ahora mismo una mascota hecha aquí. */
  enUso: boolean;
  onUsar: (baseUrl: string, manifest: MascotManifest) => void;
}) {
  const guardado = useMemo(() => estadoDePack(manifest), [manifest]);
  // Si el demo ya lleva una mascota de aquí, el constructor se abre solo. Si no,
  // se abre a mano: la data son 140 KB que no hay por qué descargar de paso.
  const [abierto, setAbierto] = useState(enUso && !!guardado);
  const [data, setData] = useState<Personajes | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [S, setS] = useState<EstadoMascota | null>(null);
  const [subiendo, setSubiendo] = useState(false);

  useEffect(() => {
    if (!abierto || data) return;
    let vivo = true;
    loadPersonajes()
      .then((d) => {
        if (!vivo) return;
        setData(d);
        // Se retoma el estado guardado en el manifiesto; el logo no viaja ahí
        // (sería un data URI enorme dentro de la configuración), así que se
        // vuelve a montar aparte si venía del logo de la institución.
        setS(
          guardado && d.chars[guardado.char]
            ? { ...guardado, logoImg: null }
            : estadoInicial(d, "conejito"),
        );
      })
      .catch((e) => vivo && setError((e as Error).message));
    return () => {
      vivo = false;
    };
  }, [abierto, data, guardado]);

  // El logo de la institución, ya como data URI: un SVG dentro de un <img> no
  // carga nada de fuera, así que por URL saldría en blanco.
  useEffect(() => {
    if (!S || S.logoFrom !== "brand" || S.logoImg || !brandLogo) return;
    let vivo = true;
    comoDataURI(brandLogo)
      .then((uri) => vivo && setS((s) => (s ? { ...s, logoImg: uri } : s)))
      .catch(() => vivo && toast.error("No se pudo leer el logo de la institución."));
    return () => {
      vivo = false;
    };
  }, [S, brandLogo]);

  const minis = useMemo(
    () =>
      data
        ? Object.keys(data.chars).map((n) => ({
            id: n,
            nombre: data.chars[n].nombre,
            en: data.chars[n].en,
            svg: miniaturaSVG(data, n),
          }))
        : [],
    [data],
  );

  const svg = useMemo(
    () => (data && S ? personajeSVG(data, S, { scope: "#esc-preview", id: "esc-preview" }) : ""),
    [data, S],
  );

  if (!abierto) {
    return (
      <div className="rounded-lg border p-3 space-y-2">
        <p className="text-sm font-medium">Diseñar una mascota</p>
        <p className="text-xs text-muted-foreground">
          Ocho personajes con el mismo cuerpo —conejito, gatito, llamita, mapachito, monito, osito,
          perrito y zorrito— a los que se les elige el color del pelaje, el uniforme y el logo del
          polo. Sale una mascota propia sin dibujar nada.
        </p>
        <Button variant="outline" size="sm" onClick={() => setAbierto(true)}>
          Abrir el constructor
        </Button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-3">
        <p className="text-sm text-destructive">{error}</p>
      </div>
    );
  }

  if (!data || !S) {
    return (
      <div className="rounded-lg border p-3">
        <p className="text-sm text-muted-foreground">Cargando los personajes…</p>
      </div>
    );
  }

  const c = data.chars[S.char];
  const vars = colores(data, S);
  const tieneCola = !!c.tail.length;
  const derivados = (prefijo: string) =>
    Object.keys(c.vars)
      .filter((v) => v.startsWith(prefijo))
      .slice(1);

  const color = (clave: string) => (hex: string) => {
    const next = aplicarColor(S, clave, hex);
    if (next) setS(next);
  };

  async function usar() {
    if (!data || !S) return;
    setSubiendo(true);
    try {
      const ident = identidad(data, S.char);
      const { manifest: m, zip } = packDeMascota(data, S, ident);
      const { baseUrl, manifest: subido } = await uploadPack(slug, zip);
      // uploadPack devuelve el manifiesto que salió del zip; el estado del
      // constructor viaja dentro, así que se conserva tal cual.
      onUsar(baseUrl, subido);
      toast.success(`${ident.name} ${ident.emoji} lista. Guarda para aplicarla.`);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSubiendo(false);
    }
  }

  return (
    <div className="rounded-lg border p-3 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium">Diseñar una mascota</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Elige especie y colores. Al usarla se guarda como mascota propia de este demo.
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setAbierto(false)}>
          Cerrar
        </Button>
      </div>

      <div className="flex flex-wrap items-start gap-4">
        <div
          className="w-[150px] shrink-0 rounded-lg border bg-muted/30 p-2"
          // El SVG se pinta entero de una vez: es el mismo que acaba dentro del
          // pack, así lo que se ve aquí es exactamente lo que verá el alumno.
          dangerouslySetInnerHTML={{ __html: svg }}
        />
        <div className="min-w-[220px] flex-1 space-y-2">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => setS(alAzar(data, S))}>
              Sorpréndeme
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setS(estadoInicial(data, S.char))}>
              Colores de fábrica
            </Button>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <Switch
              checked={S.cola && tieneCola}
              disabled={!tieneCola}
              onCheckedChange={(v) => setS({ ...S, cola: v })}
            />
            {tieneCola ? "Con cola" : "Esta especie no tiene cola"}
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Switch checked={S.lentes} onCheckedChange={(v) => setS({ ...S, lentes: v })} />
            Con lentes
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Switch checked={S.anim} onCheckedChange={(v) => setS({ ...S, anim: v })} />
            Con animación
          </label>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Personaje</Label>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
          {minis.map((m) => (
            <button
              key={m.id}
              type="button"
              aria-pressed={m.id === S.char}
              onClick={() => setS(cambiarEspecie(data, S, m.id))}
              className={`rounded-lg border p-1 text-center transition hover:bg-accent/50 ${
                m.id === S.char ? "border-primary bg-accent" : ""
              }`}
            >
              <span className="block" dangerouslySetInnerHTML={{ __html: m.svg }} />
              <b className="block text-[11px] font-medium leading-tight">{m.nombre}</b>
              <i className="block text-[10px] not-italic text-muted-foreground">{m.en}</i>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <CampoColor etiqueta="Pelaje" valor={S.fur} paleta={PELAJE} onChange={color("fur")} />
          {/* Los demás tonos de la especie salen del base guardando su relación
              original con él; cada uno se puede fijar a mano si hace falta. */}
          {derivados("--f").length > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground">Tonos derivados</span>
              {derivados("--f").map((v) => (
                <input
                  key={v}
                  type="color"
                  value={vars[v]}
                  title={`${vars[v]}${S.fijos[v] ? " · fijado a mano" : ""}`}
                  onChange={(e) => setS({ ...S, fijos: { ...S.fijos, [v]: e.target.value } })}
                  className={`h-6 w-6 cursor-pointer rounded-md border bg-transparent ${
                    S.fijos[v] ? "ring-2 ring-primary ring-offset-1" : ""
                  }`}
                />
              ))}
              {Object.keys(S.fijos).length > 0 && (
                <button
                  type="button"
                  className="text-xs underline text-muted-foreground"
                  onClick={() => setS({ ...S, fijos: {} })}
                >
                  Automáticos
                </button>
              )}
            </div>
          )}
          {S.pink && (
            <>
              <label className="flex items-center gap-2 text-sm">
                <Switch checked={S.linkPink} onCheckedChange={(v) => setS({ ...S, linkPink: v })} />
                Mejillas y orejas siguen al pelaje
              </label>
              <CampoColor
                etiqueta="Rosados"
                valor={vars["--p0"] ?? "#FDA5AC"}
                paleta={ROSAS}
                disabled={S.linkPink}
                onChange={color("pink")}
              />
            </>
          )}
        </div>

        <div className="space-y-2">
          {UNIFORME.map(([clave, etiqueta, paleta]) => (
            <CampoColor
              key={clave}
              etiqueta={etiqueta}
              valor={S.tokens[clave]}
              paleta={paleta}
              onChange={color(clave)}
            />
          ))}
        </div>
      </div>

      <LogoDelPolo S={S} setS={setS} brandLogo={brandLogo} paletaLogo={UNIFORME[0][2]} />

      <div className="flex flex-wrap items-center gap-2 border-t pt-3">
        <Button size="sm" disabled={subiendo} onClick={usar}>
          {subiendo ? "Guardando…" : "Usar esta mascota"}
        </Button>
        {enUso && <span className="text-xs text-muted-foreground">En uso en este demo.</span>}
        <a
          className="text-xs underline text-muted-foreground"
          href={ESCRIBIMOS_DIR + "constructor.html"}
          target="_blank"
          rel="noreferrer"
        >
          Abrir el constructor completo
        </a>
      </div>
    </div>
  );
}

/** La ranura del logo del polo: sin logo, un recuadro de color, o una imagen. */
function LogoDelPolo({
  S,
  setS,
  brandLogo,
  paletaLogo,
}: {
  S: EstadoMascota;
  setS: (s: EstadoMascota) => void;
  brandLogo?: string;
  paletaLogo: string[];
}) {
  const [cargando, setCargando] = useState(false);

  async function delArchivo(f: File) {
    setCargando(true);
    try {
      const uri = await comoDataURI(f);
      // Va incrustado en el SVG del pack, y un archivo pesa por dos: el pack
      // entero tiene un tope de 3 MB por archivo.
      if (uri.length > 1_500_000) {
        toast.error("Ese logo pesa demasiado. Usa un SVG o un PNG por debajo de 1 MB.");
        return;
      }
      setS({ ...S, logo: "img", logoImg: uri, logoFrom: "file" });
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="space-y-2">
      <Label>Logo del polo</Label>
      <div className="flex flex-wrap gap-2">
        {(
          [
            ["none", "Sin logo"],
            ["color", "Recuadro de color"],
            ["img", "Imagen"],
          ] as const
        ).map(([modo, texto]) => (
          <Button
            key={modo}
            type="button"
            size="sm"
            variant={S.logo === modo ? "default" : "outline"}
            onClick={() => setS({ ...S, logo: modo })}
          >
            {texto}
          </Button>
        ))}
      </div>

      {S.logo === "color" && (
        <CampoColor
          etiqueta="Color del recuadro"
          valor={S.tokens.logo}
          paleta={paletaLogo}
          onChange={(hex) =>
            /^#[0-9a-f]{6}$/i.test(hex) && setS({ ...S, tokens: { ...S.tokens, logo: hex } })
          }
        />
      )}

      {S.logo === "img" && (
        <div className="flex flex-wrap items-center gap-2">
          {brandLogo && (
            <Button
              variant="outline"
              size="sm"
              disabled={cargando}
              onClick={() => setS({ ...S, logoImg: null, logoFrom: "brand" })}
            >
              Usar el logo de la institución
            </Button>
          )}
          <Button variant="outline" size="sm" asChild disabled={cargando}>
            <label className="cursor-pointer">
              {cargando ? "Leyendo…" : "Subir otra imagen"}
              <input
                type="file"
                accept="image/svg+xml,image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) delArchivo(f);
                  e.target.value = "";
                }}
              />
            </label>
          </Button>
          {!S.logoImg && (
            <span className="text-xs text-muted-foreground">
              Aún no hay imagen: la ranura sale vacía.
            </span>
          )}
        </div>
      )}

      {S.logo !== "none" && (
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">Tamaño</span>
          <input
            type="range"
            min={30}
            max={220}
            value={Math.round(S.logoEscala * 100)}
            onChange={(e) => setS({ ...S, logoEscala: Number(e.target.value) / 100 })}
            className="flex-1 accent-primary"
            aria-label="Tamaño del logo"
          />
          <span className="w-12 text-right text-xs tabular-nums">
            {Math.round(S.logoEscala * 100)} %
          </span>
        </div>
      )}
      <p className="text-xs text-muted-foreground">
        La imagen se recorta a la ranura del polo sin deformarse. Usa PNG o SVG con fondo
        transparente; queda incrustada dentro de la mascota, así que conviene que sea liviana.
      </p>
    </div>
  );
}
