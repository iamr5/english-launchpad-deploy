import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  createDemo,
  deleteDemo,
  fetchDemos,
  isAdmin,
  saveDemo,
  sessionInfo,
  slugProblem,
  suggestSlug,
  uploadBrandFile,
  type DemoRow,
} from "@/lib/demos.data";
import { DEFAULTS, SPLASH_STYLES, shadeHex } from "@/lib/demo-config";
import { BUILT_IN_PACKS, packAsset, packChoices, packInfo } from "@/lib/mascot-packs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  downloadTemplate,
  inspectPack,
  uploadPack,
  type MascotManifest,
  type PackCheck,
} from "@/lib/mascot-pack";
import { MascotConstructor } from "@/components/mascot-constructor";
import {
  LIBRARY_FOLDER,
  deleteMascot,
  listSavedMascots,
  renameMascot,
  saveMascot,
  type SavedMascot,
} from "@/lib/mascot-library";

import {
  arteAntiguo,
  estadoDePack,
  loadPersonajes,
  logoDePack,
  medirPersonaje,
  packDeMascota,
} from "@/lib/escribimos";

import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/demos")({
  head: () => ({ meta: [{ title: "Demos — AprendoEnglish" }] }),
  component: DemosManager,
});

type Cfg = Record<string, unknown>;

/** Lee `a.b.c` de un objeto sin reventar si falta un tramo. */
function get<T = string>(o: Cfg, path: string, fallback: T = "" as T): T {
  const v = path.split(".").reduce<unknown>((acc, k) => (acc == null ? acc : (acc as Cfg)[k]), o);
  return (v ?? fallback) as T;
}
/** Escribe `a.b.c`; borra la clave si el valor queda vacío, para no guardar ruido. */
function set(o: Cfg, path: string, value: unknown): Cfg {
  const keys = path.split(".");
  const out = structuredClone(o) as Cfg;
  let node: Cfg = out;
  for (const k of keys.slice(0, -1)) {
    const next = (node[k] as Cfg | undefined) ?? {};
    node[k] = next;
    node = next;
  }
  const last = keys[keys.length - 1];
  if (value === "" || value == null) delete node[last];
  else node[last] = value;
  return out;
}

const MODULE_LABELS = ["Módulo 1", "Módulo 2", "Módulo 3", "Módulo 4", "Módulo 5"];

// Las mascotas incorporadas salen de mascot-packs.ts, el mismo sitio del que
// tira el servidor: así no puede haber una que exista pero no se pueda elegir.
const PACK_INFO = Object.fromEntries(packChoices().map((p) => [p.id, p]));

/** Oscurece un hex igual que lo hace el servidor, para que la sombra coincida. */
function shade(hex: string, amount: number) {
  const m = /^#?([0-9a-f]{6})$/i.exec((hex ?? "").trim());
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  return (
    "#" +
    [(n >> 16) & 255, (n >> 8) & 255, n & 255]
      .map((c) => {
        const v = amount < 0 ? c * (1 + amount) : c + (255 - c) * amount;
        return Math.max(0, Math.min(255, Math.round(v)))
          .toString(16)
          .padStart(2, "0");
      })
      .join("")
  );
}

/** Un icono de la configuración: emoji o imagen. */
function Ico({ v, fallback, size = 18 }: { v: string; fallback: string; size?: number }) {
  const val = v || fallback;
  if (!val) return null;
  return /^(https?:|\/|data:)/.test(val) || /\.(svg|png|jpg|webp)$/i.test(val) ? (
    <img src={val} alt="" style={{ height: size, width: size, objectFit: "contain" }} />
  ) : (
    <span style={{ fontSize: size }}>{val}</span>
  );
}

/**
 * Muestra, de verdad, lo que toca la pestaña abierta. Se pinta con la
 * configuración SIN guardar, así el cambio se ve al escribirlo — el previo de la
 * derecha va por iframe y sólo refleja lo ya guardado.
 */
/**
 * Trae /demo-assets/splash.css al panel — el mismo archivo que carga el demo.
 * Se engancha una sola vez aunque haya varios previos en pantalla, y no se
 * retira al desmontar: es un css estático, quitarlo solo provocaría parpadeos
 * al cambiar de pestaña.
 */
function SplashCss() {
  React.useEffect(() => {
    const ID = "splash-css";
    if (document.getElementById(ID)) return;
    const link = document.createElement("link");
    link.id = ID;
    link.rel = "stylesheet";
    link.href = "/demo-assets/splash.css";
    document.head.appendChild(link);
  }, []);
  return null;
}

function LivePreview({ tab, cfg, institution }: { tab: string; cfg: Cfg; institution: string }) {
  const g = (p: string, f: unknown = "") => get(cfg, p, f) as string;
  const accent = g("colors.accent", DEFAULTS.colors.accent);
  const button = g("colors.button") || accent;
  const spinner = g("colors.spinner") || accent;
  const action = g("colors.action") || "#3FAA24";
  const highlight = g("colors.highlight") || "#1CB0F6";
  const mods = (get(cfg, "colors.modules", DEFAULTS.colors.modules) as string[]) ?? [];
  const packId = g("mascot.pack", "ozito");
  // Un pack subido no está en PACK_INFO: sus datos salen del manifiesto guardado.
  const custom = get(cfg, "mascot.manifest", null) as MascotManifest | null;
  const baseUrl = g("mascot.baseUrl");
  const pack =
    packId === "custom" && custom
      ? {
          name: custom.shortName ?? custom.name,
          kind: custom.kind ?? "mascota guía",
          emoji: custom.emoji ?? "✨",
          head: baseUrl + custom.headIcon,
        }
      : (PACK_INFO[packId] ?? PACK_INFO.ozito);
  const mFull = g("mascot.fullName") || (pack as { fullName?: string }).fullName || pack.name;
  const mName = g("mascot.name") || pack.name;
  const mKind = g("mascot.kind") || pack.kind;
  const mEmoji = g("mascot.emoji") || pack.emoji;
  const audience = g("copy.audience") || DEFAULTS.copy.audience;
  const headerText = g("brand.headerText");
  const logo = g("brand.logo");
  const appbarIcon = g("brand.appbarIcon") || pack.head;

  const frame: React.CSSProperties = {
    fontFamily: "ui-rounded, 'Segoe UI', system-ui, sans-serif",
    background: "#F4F4F6",
    borderRadius: 14,
    padding: 14,
  };

  const AppBar = (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        background: "#fff",
        padding: "10px 12px",
        borderRadius: 10,
        border: "1px solid #E6E6EA",
      }}
    >
      <img src={appbarIcon} alt="" style={{ height: 30 }} />
      {logo ? (
        <img src={logo} alt="" style={{ height: 24, maxWidth: 150, objectFit: "contain" }} />
      ) : headerText ? (
        <span style={{ fontWeight: 700, fontSize: 18 }}>{headerText}</span>
      ) : (
        <span style={{ fontWeight: 700, fontSize: 18 }}>
          <span style={{ color: "#000" }}>Aprendo</span>
          <span style={{ color: "#539bec" }}>English</span>
          <span style={{ color: "#ea4e57", fontSize: 13 }}>.com</span>
        </span>
      )}
      <span style={{ flex: 1 }} />
      <span style={chip}>
        <Ico v={g("icons.goal")} fallback="" size={15} />
        {!g("icons.goal") && <span style={ring(accent)} />}
        <b style={{ fontSize: 12 }}>0 min</b>
      </span>
      <span style={chip}>
        <Ico v={g("icons.streak")} fallback="🔥" size={15} />
        <b style={{ fontSize: 12 }}>5</b>
      </span>
    </div>
  );

  const DashCta = (
    <button
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        width: "100%",
        background: "#fff",
        border: "2px solid #E6E6EA",
        borderRadius: 14,
        padding: "11px 13px",
        textAlign: "left",
        cursor: "default",
      }}
    >
      <Ico v={g("icons.dashboard")} fallback="📊" size={22} />
      <span style={{ flex: 1 }}>
        <b style={{ display: "block", fontSize: 14 }}>
          {g("copy.dashboardCta") || DEFAULTS.copy.dashboardCta}
        </b>
        <small style={{ color: "#7A7A7A", fontSize: 12 }}>
          {g("copy.dashboardCtaSub") || DEFAULTS.copy.dashboardCtaSub}
        </small>
      </span>
    </button>
  );

  if (tab === "splash") {
    // El previo monta el MISMO markup y el MISMO css que sirve demo-page.ts
    // (splashHTML + /demo-assets/splash.css). Nada de re-dibujarlo aquí: si se
    // duplicara, el panel acabaría enseñando algo distinto del demo real.
    const style = g("splash.style") || DEFAULTS.splash.style!;
    const from = g("splash.colors.from") || shadeHex(accent, -0.55);
    const to = g("splash.colors.to") || shadeHex(accent, 0.12);
    const glow = g("splash.colors.accent") || shadeHex(accent, 0.45);
    const rotulo = headerText || institution || "";
    // El de la bienvenida manda; si no hay, el de la cabecera. Igual que el
    // servidor, para que el previo no enseñe uno y el visitante vea otro.
    const spLogo = g("splash.logo") || logo;
    const off = !get<boolean>(cfg, "splash.enabled", true);
    return (
      <div style={frame}>
        <SplashCss />
        {off ? (
          <div
            style={{
              height: 210,
              borderRadius: 12,
              border: "1px dashed #C9C9D2",
              display: "grid",
              placeItems: "center",
              color: "#8A8A97",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            El demo abre directamente, sin bienvenida.
          </div>
        ) : (
          <div
            key={`${style}-${from}-${to}-${glow}`}
            className={`sp sp-preview sp-${style}`}
            style={
              {
                "--sp-from": from,
                "--sp-to": to,
                "--sp-glow": glow,
              } as React.CSSProperties
            }
          >
            <div className="sp-deco">
              {style === "constelacion" &&
                Array.from({ length: 14 }, (_, i) => (
                  <i key={i} style={{ "--i": i } as React.CSSProperties} />
                ))}
            </div>
            <div className="sp-mark">
              {spLogo ? (
                <img className="sp-logo" src={spLogo} alt={rotulo} />
              ) : (
                <div className="sp-word">{rotulo || "Tu institución"}</div>
              )}
              {!!g("splash.phrase") && <p className="sp-phrase">{g("splash.phrase")}</p>}
            </div>
          </div>
        )}
        <p style={{ margin: "10px 2px 0", fontSize: 12, color: "#6B6B78" }}>
          {spLogo
            ? g("splash.logo")
              ? "Logo propio de la bienvenida."
              : "Se usa el logo de la pestaña Marca."
            : "Sin logo sale el texto de cabecera."}
        </p>
      </div>
    );
  }

  if (tab === "marca") {
    const ola = (g("brand.ola") || "").trim();
    const olaOn = !!ola && ola !== "none";
    const olaUrl = ola === "default" ? "/demo-assets/ola.svg" : ola;
    const olaColor = g("colors.ola") || "#0D47A1";
    return (
      <div style={frame}>
        {AppBar}
        {olaOn && (
          <div style={{ marginTop: 12 }}>
            <div
              style={{
                height: 46,
                borderRadius: "10px 10px 0 0",
                border: "1px solid #E6E6EA",
                borderBottom: "none",
                background: "#fff",
                color: olaColor,
                backgroundImage: `url("${olaUrl}")`,
                backgroundRepeat: ola === "default" ? "repeat-x" : "no-repeat",
                backgroundSize: ola === "default" ? "auto 100%" : "100% 100%",
                backgroundPosition: "center top",
              }}
            />
            <div
              style={{
                border: "1px solid #E6E6EA",
                borderTop: "none",
                borderRadius: "0 0 10px 10px",
                background: "#fff",
                padding: "10px 12px",
                fontSize: 13,
                color: "#5C5159",
              }}
            >
              ¡Hola! Soy <b>{mFull}</b> {mEmoji}.
            </div>
          </div>
        )}
        <p style={caption}>
          La barra superior y la ola con la que abre el onboarding.
          {ola === "default" && " La de serie se repite sin costura a cualquier ancho."}
        </p>
      </div>
    );
  }

  if (tab === "colores") {
    return (
      <div style={frame}>
        <div
          style={{
            background: accent,
            color: "#fff",
            borderRadius: 12,
            padding: "9px 13px",
            boxShadow: `0 4px 0 ${shade(accent, -0.24)}`,
            fontWeight: 800,
          }}
        >
          <div style={{ fontSize: 11, letterSpacing: ".8px", opacity: 0.92 }}>MÓDULO 1 · A1</div>
          <div style={{ fontSize: 17 }}>Primeros pasos</div>
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
          {mods.slice(0, 5).map((c, i) => (
            <div key={i} style={{ flex: 1, textAlign: "center" }}>
              <div
                style={{
                  height: 34,
                  borderRadius: 9,
                  background: c,
                  boxShadow: `0 3px 0 ${shade(c, -0.24)}`,
                }}
              />
              <div style={{ fontSize: 10, color: "#7A7A7A", marginTop: 5 }}>M{i + 1}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 14 }}>
          <button
            style={{
              background: button,
              color: "#fff",
              border: "none",
              borderRadius: 12,
              padding: "10px 20px",
              fontWeight: 800,
              boxShadow: `0 4px 0 ${shade(button, -0.24)}`,
              cursor: "default",
            }}
          >
            Empezar
          </button>
          <span
            style={{
              width: 26,
              height: 26,
              borderRadius: "50%",
              border: "3px solid #E0E0E0",
              borderTopColor: spinner,
              display: "inline-block",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <span style={{ fontSize: 12, color: "#7A7A7A" }}>ruedita de carga</span>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
          <button
            style={{
              background: action,
              color: "#fff",
              border: "none",
              borderRadius: 12,
              padding: "9px 18px",
              fontWeight: 800,
              boxShadow: `0 4px 0 ${shade(action, -0.28)}`,
              cursor: "default",
            }}
          >
            Empecemos
          </button>
          <span
            style={{
              flex: 1,
              minWidth: 150,
              border: `2px solid ${highlight}`,
              color: highlight,
              background: `color-mix(in srgb, ${highlight} 10%, transparent)`,
              borderRadius: 12,
              padding: "9px 12px",
              fontWeight: 700,
              fontSize: 13.5,
            }}
          >
            Opción elegida
          </span>
        </div>
        <p style={caption}>
          Cabecera de módulo, colores de módulo, botón, ruedita, acción principal y resaltado.
        </p>
      </div>
    );
  }

  if (tab === "mascota") {
    return (
      <div style={frame}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <img src={pack.head} alt="" style={{ height: 54 }} />
          <div
            style={{
              flex: 1,
              background: "#fff",
              border: "1px solid #E6E6EA",
              borderRadius: 12,
              padding: "9px 12px",
              fontSize: 13.5,
            }}
          >
            ¡Hola! Soy <b>{mFull}</b> {mEmoji}, tu {mKind}.
          </div>
        </div>
        <div
          style={{
            background: "#fff",
            border: "1px solid #E6E6EA",
            borderRadius: 12,
            padding: "9px 12px",
            fontSize: 13.5,
            marginTop: 8,
          }}
        >
          Más adelante, en las lecciones: «<b>{mName}</b> tip: repite en voz alta.»
        </div>
        <p style={caption}>
          Arriba, la presentación con el nombre completo; abajo, cómo lo llaman el resto del tiempo.
        </p>
      </div>
    );
  }

  if (tab === "textos") {
    return (
      <div style={frame}>
        <div
          style={{
            background: "#fff",
            border: "1px solid #E6E6EA",
            borderRadius: 12,
            padding: "9px 12px",
            fontSize: 13.5,
            marginBottom: 10,
          }}
        >
          ¡Hey, <b>{audience}</b>! Soy <b>{mName}</b> {mEmoji}, y hoy te presento…
        </div>
        {DashCta}
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <span style={chip}>
            <Ico v={g("icons.streak")} fallback="🔥" size={15} />
            <b style={{ fontSize: 12 }}>5</b>
          </span>
          <span style={chip}>
            <Ico v={g("icons.goal")} fallback="" size={15} />
            {!g("icons.goal") && <span style={ring(accent)} />}
            <b style={{ fontSize: 12 }}>15 min</b>
          </span>
        </div>
        <p style={caption}>
          {audience} sustituye a <code>{"{{audience}}"}</code> en todo el curso.
        </p>
      </div>
    );
  }

  if (tab === "mapa") {
    const bgs = (get(cfg, "map.backgrounds", []) as (string | null)[]) ?? [];
    return (
      <div style={frame}>
        <div style={{ display: "flex", gap: 6 }}>
          {MODULE_LABELS.map((_, i) => (
            <div key={i} style={{ flex: 1 }}>
              <div
                style={{
                  aspectRatio: "9/16",
                  borderRadius: 8,
                  border: "1px solid #E6E6EA",
                  background: `#fff url('${bgs[i] || `/demo-assets/modulebg${i + 1}.png`}') center top / cover no-repeat`,
                }}
              />
              <div style={{ fontSize: 10, color: "#7A7A7A", marginTop: 4, textAlign: "center" }}>
                M{i + 1}
                {bgs[i] ? " ·propio" : ""}
              </div>
            </div>
          ))}
        </div>
        <p style={caption}>El fondo real de cada mapa. «propio» = subido para este demo.</p>
      </div>
    );
  }

  return <div style={frame}>{AppBar}</div>;
}

const chip: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  border: "2px solid #E6E6EA",
  background: "#fff",
  borderRadius: 999,
  padding: "4px 9px",
};
const ring = (c: string): React.CSSProperties => ({
  width: 15,
  height: 15,
  borderRadius: "50%",
  background: `conic-gradient(${c} 45%, #E0E0E0 0)`,
  display: "inline-block",
});
const caption: React.CSSProperties = {
  fontSize: 11.5,
  color: "#7A7A7A",
  margin: "10px 0 0",
};

/**
 * Un fallo a la vista, siempre. Los errores más habituales aquí vienen de RLS y
 * su mensaje crudo no dice nada, así que se traducen a algo accionable.
 */
function ErrorNote({ error }: { error: Error }) {
  const msg = error?.message ?? "";
  const rls = /row-level security|violates row-level/i.test(msg);
  const dup = /duplicate key|already exists/i.test(msg);
  const format = /demos_slug_format|check constraint/i.test(msg);

  const title = rls
    ? "Tu cuenta no tiene permiso para esto"
    : dup
      ? "Ese enlace ya está ocupado"
      : format
        ? "Ese enlace no vale"
        : "No se pudo guardar";

  const help = rls
    ? "Hay que darle permiso de administrador a tu cuenta. Abajo del todo puedes ver con cuál estás entrando."
    : dup
      ? "Ya hay un demo usando ese nombre. Elige otro."
      : format
        ? "Usa sólo minúsculas, números y guiones, entre 2 y 39 caracteres."
        : "Inténtalo otra vez. Si vuelve a fallar, mira el detalle de abajo.";

  return (
    <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-3 space-y-1.5">
      <p className="text-sm font-medium text-destructive">{title}</p>
      <p className="text-xs text-muted-foreground">{help}</p>
      <details className="text-[11px] text-muted-foreground">
        <summary className="cursor-pointer select-none">Ver detalle técnico</summary>
        <pre className="whitespace-pre-wrap break-words mt-1">{msg}</pre>
      </details>
    </div>
  );
}

/** Aviso permanente si la sesión no es administradora: nada va a poder guardarse. */
function AdminBanner() {
  const admin = useQuery({ queryKey: ["is-admin"], queryFn: isAdmin });
  if (admin.isLoading || admin.data?.ok) return null;
  return (
    <Card className="p-4 mb-4 border-amber-500/50 bg-amber-500/5">
      <p className="text-sm font-medium">Puedes mirar, pero no guardar</p>
      <p className="text-sm text-muted-foreground mt-1">
        {admin.data?.email
          ? `La cuenta ${admin.data.email} no tiene permiso de administrador, así que crear un demo o guardar una edición se va a rechazar.`
          : "No has iniciado sesión, así que no se puede guardar nada."}
      </p>
      <details className="mt-2">
        <summary className="text-xs text-muted-foreground cursor-pointer select-none">
          Cómo se arregla
        </summary>
        <p className="text-xs text-muted-foreground mt-1.5">
          Ejecutando esto una vez en la base de datos:
        </p>
        <pre className="text-[11px] bg-muted p-2 rounded mt-1 overflow-x-auto">
          {`insert into public.user_roles (user_id, role)
select id, 'admin' from auth.users
where lower(email) = lower('${admin.data?.email ?? "tu@correo.com"}')
on conflict do nothing;`}
        </pre>
      </details>
    </Card>
  );
}

function DemosManager() {
  const qc = useQueryClient();
  const demos = useQuery({ queryKey: ["demos"], queryFn: fetchDemos });
  const [selected, setSelected] = useState<string | null>(null);

  const current = useMemo(
    () => demos.data?.find((d) => d.slug === selected) ?? null,
    [demos.data, selected],
  );

  useEffect(() => {
    if (!selected && demos.data?.length) setSelected(demos.data[0].slug);
  }, [demos.data, selected]);

  if (demos.isLoading) {
    return (
      <Shell>
        <p className="text-muted-foreground">Cargando demos…</p>
      </Shell>
    );
  }

  if (demos.error) {
    const msg = (demos.error as Error).message ?? "";
    const noTable = /relation .*demos.* does not exist|schema cache/i.test(msg);
    return (
      <Shell>
        <Card className="p-6 space-y-3">
          <h2 className="font-bold text-lg">
            {noTable ? "Todavía no está lista la base de datos" : "No se pudieron cargar los demos"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {noTable
              ? "Falta publicar los cambios para que se cree la tabla donde se guardan los demos. Mientras tanto no se pierde nada: los enlaces que ya funcionaban siguen funcionando."
              : "Puede ser un corte momentáneo. Recarga la página; si sigue igual, mira el detalle de abajo."}
          </p>
          <details className="text-xs text-muted-foreground">
            <summary className="cursor-pointer select-none">Ver detalle técnico</summary>
            <pre className="bg-muted p-3 rounded-lg overflow-x-auto mt-1.5">{msg}</pre>
          </details>
        </Card>
      </Shell>
    );
  }

  return (
    <Shell>
      <AdminBanner />
      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <DemoList
          demos={demos.data ?? []}
          selected={selected}
          onSelect={setSelected}
          onCreated={(slug) => {
            qc.invalidateQueries({ queryKey: ["demos"] });
            setSelected(slug);
          }}
        />
        {current ? (
          <DemoEditor key={current.slug} demo={current} />
        ) : (
          <Card className="p-8 text-center text-muted-foreground">
            Aún no hay ningún demo. Crea el primero con el formulario de la izquierda.
          </Card>
        )}
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto max-w-6xl px-6 py-5">
          <h1 className="text-2xl font-bold">Demos</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Cada demo es un enlace con los colores, el logo y la mascota de una institución.
          </p>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-6">{children}</main>
      <SessionFooter />
    </div>
  );
}

/**
 * Con qué cuenta se está entrando. Está a la vista porque casi todo lo que
 * falla en este panel falla por permisos, y sin esto no hay forma de saber si
 * la sesión es la que uno cree.
 */
function SessionFooter() {
  const s = useQuery({ queryKey: ["session-info"], queryFn: sessionInfo });
  const d = s.data;

  return (
    <footer className="mx-auto max-w-6xl px-6 pb-10 pt-2">
      <div className="rounded-lg border bg-muted/40 p-3.5 text-[13px] leading-relaxed">
        {s.isLoading && <span className="text-muted-foreground">Comprobando tu sesión…</span>}
        {d && (
          <>
            <p>
              Estás entrando como <b>{d.email ?? "nadie: no has iniciado sesión"}</b>
              {d.email && (
                <>
                  {" y "}
                  {d.isAdmin ? (
                    <b className="text-emerald-600">puedes crear y editar demos</b>
                  ) : (
                    <b className="text-destructive">no puedes guardar cambios</b>
                  )}
                  .
                </>
              )}
            </p>

            {!d.isAdmin && d.email && (
              <p className="text-muted-foreground mt-1">
                Tu cuenta no tiene permiso de administrador, así que crear un demo o guardar una
                edición se rechazará.
              </p>
            )}

            {/* fake_login sólo hace que el guardia de la ruta no compruebe nada.
                Si además hay sesión, las consultas van firmadas con ella y se
                escribe con normalidad; lo grave es cuando no la hay. */}
            {d.fakeLogin && d.email && (
              <p className="text-muted-foreground mt-1">
                Tienes puesto el atajo de pruebas <code>fake_login</code>, pero no molesta: sólo
                evita que la página te pida iniciar sesión. Lo que se guarda va con la cuenta de
                arriba.
              </p>
            )}
            {d.fakeLogin && !d.email && (
              <p className="text-destructive mt-1">
                Has entrado con el atajo de pruebas <code>fake_login</code> y sin cuenta, así que
                nada de lo que hagas se va a guardar. Quítalo e inicia sesión.
              </p>
            )}

            {d.error && <p className="text-destructive mt-1">Error al comprobarlo: {d.error}</p>}

            <p className="text-muted-foreground mt-2 text-[11.5px]">
              Datos técnicos, por si hacen falta: usuario{" "}
              <code>{d.userId ? d.userId.slice(0, 8) + "…" : "—"}</code> · permisos{" "}
              <code>{d.roles.length ? d.roles.join(", ") : "ninguno"}</code>
            </p>
          </>
        )}
        {d && d.fakeLogin && !d.email && (
          <div className="mt-3">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                localStorage.removeItem("fake_login");
                localStorage.removeItem("fake_role");
                location.reload();
              }}
            >
              Quitar el atajo e iniciar sesión
            </Button>
          </div>
        )}
      </div>
    </footer>
  );
}

function DemoList({
  demos,
  selected,
  onSelect,
  onCreated,
}: {
  demos: DemoRow[];
  selected: string | null;
  onSelect: (s: string) => void;
  onCreated: (s: string) => void;
}) {
  const [institution, setInstitution] = useState("");
  const [slug, setSlug] = useState("");
  const [touched, setTouched] = useState(false);

  const effectiveSlug = touched ? slug : suggestSlug(institution);
  const problem = institution ? slugProblem(effectiveSlug) : null;
  const taken = demos.some((d) => d.slug === effectiveSlug);

  const create = useMutation({
    mutationFn: () => createDemo({ slug: effectiveSlug, institution }),
    onSuccess: (row) => {
      toast.success(`Demo «${row.slug}» creado como borrador.`);
      setInstitution("");
      setSlug("");
      setTouched(false);
      onCreated(row.slug);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-4">
      <Card className="p-4 space-y-3">
        <h2 className="font-semibold text-sm">Nuevo demo</h2>
        <div className="space-y-1.5">
          <Label htmlFor="new-inst">Institución</Label>
          <Input
            id="new-inst"
            value={institution}
            placeholder="Colegio de Ingenieros"
            onChange={(e) => setInstitution(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="new-slug">Enlace</Label>
          <Input
            id="new-slug"
            value={effectiveSlug}
            placeholder="democip"
            onChange={(e) => {
              setTouched(true);
              setSlug(e.target.value.toLowerCase());
            }}
          />
          <p className="text-xs text-muted-foreground break-all">
            aprendoenglish.com/<b>{effectiveSlug || "…"}</b>
          </p>
          {problem && <p className="text-xs text-destructive">{problem}</p>}
          {taken && <p className="text-xs text-destructive">Ese enlace ya está en uso.</p>}
        </div>
        <Button
          className="w-full"
          disabled={!institution || !effectiveSlug || !!problem || taken || create.isPending}
          onClick={() => create.mutate()}
        >
          {create.isPending ? "Creando…" : "Crear borrador"}
        </Button>
        {create.error && <ErrorNote error={create.error as Error} />}
      </Card>

      <div className="space-y-1.5">
        {demos.map((d) => (
          <button
            key={d.slug}
            onClick={() => onSelect(d.slug)}
            className={`w-full text-left px-3 py-2.5 rounded-lg border transition ${
              selected === d.slug ? "border-primary bg-accent" : "hover:bg-accent/50"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium truncate">{d.institution}</span>
              <Badge variant={d.published ? "default" : "secondary"}>
                {d.published ? "Publicado" : "Borrador"}
              </Badge>
            </div>
            <span className="text-xs text-muted-foreground">/{d.slug}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function DemoEditor({ demo }: { demo: DemoRow }) {
  const qc = useQueryClient();
  const [cfg, setCfg] = useState<Cfg>(demo.config ?? {});
  const [institution, setInstitution] = useState(demo.institution);
  const [published, setPublished] = useState(demo.published);
  const [previewKey, setPreviewKey] = useState(0);
  const [tab, setTab] = useState("marca");
  // Sube uno cada vez que la biblioteca de mascotas cambia, para releerla.
  const [libTick, setLibTick] = useState(0);


  const dirty =
    JSON.stringify(cfg) !== JSON.stringify(demo.config ?? {}) ||
    institution !== demo.institution ||
    published !== demo.published;

  const save = useMutation({
    mutationFn: () => saveDemo(demo.slug, { config: cfg, institution, published }),
    onSuccess: () => {
      toast.success("Guardado.");
      qc.invalidateQueries({ queryKey: ["demos"] });
      // La página del demo cachea la configuración un minuto; recargar el
      // previo con un parámetro nuevo evita quedarse mirando lo viejo.
      setTimeout(() => setPreviewKey((k) => k + 1), 300);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: () => deleteDemo(demo.slug),
    onSuccess: () => {
      toast.success("Demo eliminado.");
      qc.invalidateQueries({ queryKey: ["demos"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const upd = (path: string) => (v: unknown) => setCfg((c) => set(c, path, v));
  const g2 = (p: string, f: unknown = "") => get(cfg, p, f) as string;
  // Lo que trae la mascota elegida, para enseñarlo como marca de agua.
  const mascotHead = (() => {
    const id = g2("mascot.pack", "ozito");
    const man = get(cfg, "mascot.manifest", null) as MascotManifest | null;
    if (id === "custom" && man) return g2("mascot.baseUrl") + man.headIcon;
    return (PACK_INFO[id] ?? PACK_INFO.ozito).head;
  })();
  // Lo que trae la mascota elegida: se enseña como marca de agua en los campos.
  const packDefaults = (() => {
    const id = g2("mascot.pack", "ozito");
    const man = get(cfg, "mascot.manifest", null) as MascotManifest | null;
    if (id === "custom" && man)
      return {
        fullName: man.name,
        name: man.shortName ?? man.name,
        kind: man.kind ?? "mascota guía",
        emoji: man.emoji ?? "✨",
      };
    return packInfo(id);
  })();
  const url = `/${demo.slug}`;

  return (
    <div className="space-y-4">
      <Card className="p-4 flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[200px]">
          <a href={url} target="_blank" rel="noreferrer" className="font-mono text-sm underline">
            aprendoenglish.com{url}
          </a>
          <p className="text-xs text-muted-foreground mt-0.5">
            {published
              ? "Cualquiera con el enlace puede abrirlo."
              : "Es un borrador: quien abra el enlace verá una página de «no encontrado»."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Switch id="pub" checked={published} onCheckedChange={setPublished} />
          <Label htmlFor="pub">Publicado</Label>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            navigator.clipboard.writeText(`https://aprendoenglish.com${url}`);
            toast.success("Enlace copiado.");
          }}
        >
          Copiar enlace
        </Button>
        <Button disabled={!dirty || save.isPending} onClick={() => save.mutate()}>
          {save.isPending ? "Guardando…" : dirty ? "Guardar" : "Guardado"}
        </Button>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[1fr_390px]">
        <Card className="p-4">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="marca">Marca</TabsTrigger>
              <TabsTrigger value="splash">Bienvenida</TabsTrigger>
              <TabsTrigger value="colores">Colores</TabsTrigger>
              <TabsTrigger value="mascota">Mascota</TabsTrigger>
              <TabsTrigger value="textos">Textos</TabsTrigger>
              <TabsTrigger value="mapa">Mapa</TabsTrigger>
            </TabsList>

            <div className="mb-5">
              <LivePreview tab={tab} cfg={cfg} institution={institution} />
            </div>

            <TabsContent value="marca" className="space-y-4">
              <Field label="Institución" value={institution} onChange={setInstitution} />
              <Field
                label="Texto de la cabecera"
                hint="Si lo dejas vacío se usa el logotipo de AprendoEnglish."
                value={get(cfg, "brand.headerText")}
                onChange={upd("brand.headerText")}
              />
              <FileField
                label="Logo"
                fallbackLabel="logotipo AprendoEnglish"
                slug={demo.slug}
                kind="logo"
                value={get(cfg, "brand.logo")}
                onChange={upd("brand.logo")}
              />
              <FileField
                label="Ola de la cabecera"
                hint="No sale salvo que la pidas. Escribe default para la ola de serie, o sube tu propia imagen."
                fallbackSrc="/demo-assets/ola.svg"
                slug={demo.slug}
                kind="ola"
                value={g2("brand.ola")}
                onChange={upd("brand.ola")}
              />
              {!!g2("brand.ola") && g2("brand.ola") !== "none" && (
                <div className="flex flex-wrap items-end gap-3 rounded-lg border p-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Cómo encaja</Label>
                    <div className="flex gap-1">
                      {[
                        { id: "repeat", label: "Repetir" },
                        { id: "stretch", label: "Estirar" },
                      ].map((o) => {
                        const on = (g2("brand.olaFit") || "repeat") === o.id;
                        return (
                          <Button
                            key={o.id}
                            size="sm"
                            variant={on ? "default" : "outline"}
                            onClick={() => upd("brand.olaFit")(o.id === "repeat" ? "" : o.id)}
                          >
                            {o.label}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                  {(g2("brand.olaFit") || "repeat") === "repeat" && (
                    <div className="space-y-1.5">
                      <Label className="text-xs">Crestas a lo ancho</Label>
                      <Input
                        type="number"
                        min={1}
                        max={60}
                        className="w-24"
                        value={g2("brand.olaRepeats") || 15}
                        onChange={(e) =>
                          upd("brand.olaRepeats")(
                            Number(e.target.value) === 15 ? "" : Number(e.target.value) || "",
                          )
                        }
                      />
                    </div>
                  )}
                  <p className="w-full text-xs text-muted-foreground">
                    Repetir mantiene la misma densidad en cualquier pantalla: el ancho de cada
                    cresta sale de este número, no del tamaño de la imagen. Estirar es para una
                    imagen que no empalma consigo misma y se le nota la costura.
                  </p>
                </div>
              )}
              <div className="rounded-lg border p-3 space-y-3">
                <div>
                  <Label className="text-xs font-medium">El logo por el demo</Label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Además de la cabecera. Sin logo cargado no se pinta nada.
                  </p>
                </div>
                {[
                  {
                    k: "onboarding",
                    t: "Onboarding y test de nivel",
                    d: "Las primeras pantallas de la visita.",
                  },
                  {
                    k: "celebrations",
                    t: "Celebraciones",
                    d: "Lección completada y veredicto del test: máxima atención.",
                  },
                  {
                    k: "watermark",
                    t: "Marca de agua",
                    d: "Esquina inferior, translúcido, durante todo el demo.",
                  },
                ].map((o) => (
                  <label key={o.k} className="flex items-start gap-3 cursor-pointer">
                    <Switch
                      className="mt-0.5"
                      checked={
                        get(
                          cfg,
                          `brand.logoSpots.${o.k}`,
                          (DEFAULTS.brand.logoSpots as Record<string, boolean>)[o.k],
                        ) as boolean
                      }
                      onCheckedChange={(v) => upd(`brand.logoSpots.${o.k}`)(v)}
                    />
                    <span className="leading-tight">
                      <span className="text-sm">{o.t}</span>
                      <span className="block text-xs text-muted-foreground">{o.d}</span>
                    </span>
                  </label>
                ))}
                {(get(cfg, "brand.logoSpots.watermark", false) as boolean) && (
                  <div className="rounded-md border bg-muted/30 p-3 space-y-2">
                    <Label className="text-xs">Qué imagen usa la marca de agua</Label>
                    <div className="flex flex-wrap gap-1">
                      {[
                        { id: "logo", label: "El logo de la cabecera" },
                        { id: "icon", label: "El icono de la barra" },
                        { id: "custom", label: "Otra imagen" },
                      ].map((o) => {
                        const on = (g2("brand.watermarkSource") || "logo") === o.id;
                        return (
                          <Button
                            key={o.id}
                            size="sm"
                            variant={on ? "default" : "outline"}
                            onClick={() =>
                              upd("brand.watermarkSource")(o.id === "logo" ? "" : o.id)
                            }
                          >
                            {o.label}
                          </Button>
                        );
                      })}
                    </div>
                    {g2("brand.watermarkSource") === "custom" ? (
                      <FileField
                        label="Imagen de la marca de agua"
                        hint="Se pinta translúcida en la esquina inferior. Un PNG o SVG con fondo transparente queda mejor."
                        slug={demo.slug}
                        kind="marca-agua"
                        fallbackLabel="sin imagen"
                        value={get(cfg, "brand.watermarkImage")}
                        onChange={upd("brand.watermarkImage")}
                      />
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        {g2("brand.watermarkSource") === "icon"
                          ? "El icono de la barra superior; si no has subido uno, la cabeza de la mascota."
                          : "El logo de la cabecera. Sin logo cargado no se pinta nada."}
                      </p>
                    )}
                    <WatermarkPlacement
                      src={
                        (g2("brand.watermarkSource") === "custom"
                          ? (get(cfg, "brand.watermarkImage") as string)
                          : g2("brand.watermarkSource") === "icon"
                            ? ((get(cfg, "brand.appbarIcon") as string) || mascotHead)
                            : (get(cfg, "brand.logo") as string)) || ""
                      }
                      pos={(g2("brand.watermarkPos") || "bl") as WmPos}
                      x={num(get(cfg, "brand.watermarkX"), 12)}
                      y={num(get(cfg, "brand.watermarkY"), 10)}
                      size={num(get(cfg, "brand.watermarkSize"), 84)}
                      opacity={num(get(cfg, "brand.watermarkOpacity"), 0.28)}
                      onChange={(k, v) => upd(`brand.watermark${k}`)(v)}
                    />
                  </div>
                )}

              </div>

              <FileField
                label="Icono de la barra superior"
                hint="Si lo dejas vacío se usa la cabeza de la mascota."
                fallbackSrc={mascotHead}
                slug={demo.slug}
                kind="icono"
                value={get(cfg, "brand.appbarIcon")}
                onChange={upd("brand.appbarIcon")}
              />
              <hr />
              <Field
                label="Título al compartir"
                value={get(cfg, "meta.title")}
                placeholder={DEFAULTS.meta.title}
                onChange={upd("meta.title")}
              />
              <Field
                label="Descripción al compartir"
                value={get(cfg, "meta.description")}
                placeholder={DEFAULTS.meta.description}
                onChange={upd("meta.description")}
                multiline
              />
              <FileField
                label="Imagen al compartir (1200×630)"
                fallbackSrc="https://aprendoenglish.com/social-preview.jpg"
                slug={demo.slug}
                kind="social"
                value={get(cfg, "meta.image")}
                onChange={upd("meta.image")}
              />
            </TabsContent>

            <TabsContent value="splash" className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer rounded-lg border p-3">
                <Switch
                  className="mt-0.5"
                  checked={get(cfg, "splash.enabled", true) as boolean}
                  onCheckedChange={(v) => upd("splash.enabled")(v)}
                />
                <span className="leading-tight">
                  <span className="text-sm">Abrir con pantalla de bienvenida</span>
                  <span className="block text-xs text-muted-foreground">
                    Sale en cada carga, con la marca, y se salta tocando la pantalla.
                  </span>
                </span>
              </label>

              {(get(cfg, "splash.enabled", true) as boolean) && (
                <>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Estilo</Label>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {SPLASH_STYLES.map((s) => {
                        const on = (get(cfg, "splash.style", DEFAULTS.splash.style) as string) === s.id;
                        return (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => upd("splash.style")(s.id)}
                            className={`rounded-lg border p-2.5 text-left transition ${
                              on ? "border-primary ring-1 ring-primary" : "hover:bg-muted/50"
                            }`}
                          >
                            <span className="text-sm font-medium">{s.name}</span>
                            <span className="block text-xs text-muted-foreground leading-snug mt-0.5">
                              {s.hint}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <FileField
                    label="Logo de la bienvenida"
                    hint="Si lo dejas vacío se usa el de la cabecera. A pantalla completa y sobre fondo oscuro suele hacer falta otra versión: la vertical, o la clara."
                    fallbackSrc={get(cfg, "brand.logo") || undefined}
                    fallbackLabel="el logo de la cabecera"
                    slug={demo.slug}
                    kind="splash"
                    value={get(cfg, "splash.logo")}
                    onChange={upd("splash.logo")}
                  />

                  <Field
                    label="Frase"
                    hint="Una línea. Si la dejas vacía sale solo la marca."
                    placeholder="Inglés que se te queda"
                    value={get(cfg, "splash.phrase")}
                    onChange={upd("splash.phrase")}
                  />

                  <div className="rounded-lg border p-3 space-y-3">
                    <div>
                      <Label className="text-xs font-medium">Colores</Label>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Vacíos se derivan del acento del demo, así que ya salen con tu marca.
                        Tócalos solo si quieres otra cosa.
                      </p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <ColorField
                        label="Degradado: inicio"
                        value={get(cfg, "splash.colors.from")}
                        fallback={shadeHex(
                          get(cfg, "colors.accent", DEFAULTS.colors.accent) as string,
                          -0.55,
                        )}
                        onChange={upd("splash.colors.from")}
                      />
                      <ColorField
                        label="Degradado: final"
                        value={get(cfg, "splash.colors.to")}
                        fallback={shadeHex(
                          get(cfg, "colors.accent", DEFAULTS.colors.accent) as string,
                          0.12,
                        )}
                        onChange={upd("splash.colors.to")}
                      />
                      <ColorField
                        label="Luces"
                        value={get(cfg, "splash.colors.accent")}
                        fallback={shadeHex(
                          get(cfg, "colors.accent", DEFAULTS.colors.accent) as string,
                          0.45,
                        )}
                        onChange={upd("splash.colors.accent")}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs">Cuánto dura</Label>
                    <div className="flex items-center gap-3">
                      <Input
                        type="range"
                        min={800}
                        max={6000}
                        step={200}
                        className="flex-1"
                        value={Number(get(cfg, "splash.duration", DEFAULTS.splash.duration))}
                        onChange={(e) => upd("splash.duration")(Number(e.target.value))}
                      />
                      <span className="text-sm tabular-nums w-14 text-right">
                        {(
                          Number(get(cfg, "splash.duration", DEFAULTS.splash.duration)) / 1000
                        ).toFixed(1)}
                        s
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Se va sola al cumplirse, o antes si tocan la pantalla.
                    </p>
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="colores" className="space-y-4">
              <ColorField
                label="Acento"
                hint="Cabeceras de módulo, chips y detalles."
                value={get(cfg, "colors.accent", DEFAULTS.colors.accent)}
                onChange={upd("colors.accent")}
              />
              <ColorField
                label="Botones"
                hint="Si lo dejas vacío se usa el color de acento."
                value={get(cfg, "colors.button")}
                onChange={upd("colors.button")}
              />
              <ColorField
                label="Botones de acción"
                hint="Empecemos, Continuar, Empezar; y el acierto en los quizzes."
                value={get(cfg, "colors.action", "#3FAA24")}
                onChange={upd("colors.action")}
              />
              <ColorField
                label="Resaltado"
                hint="La opción que eliges en un quiz, y los pasos del onboarding."
                value={get(cfg, "colors.highlight", "#1CB0F6")}
                onChange={upd("colors.highlight")}
              />
              <ColorField
                label="Ruedita de carga"
                hint="La ruedita que gira mientras carga un mapa. Si lo dejas vacío se usa el color de acento."
                value={get(cfg, "colors.spinner")}
                onChange={upd("colors.spinner")}
              />
              <hr />
              <p className="text-sm font-medium">Color de cada módulo</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {MODULE_LABELS.map((label, i) => (
                  <ColorField
                    key={i}
                    label={label}
                    value={get(cfg, `colors.modules.${i}`, DEFAULTS.colors.modules[i])}
                    onChange={(v: string) => {
                      const mods = [
                        ...(get(cfg, "colors.modules", null) ?? DEFAULTS.colors.modules),
                      ];
                      mods[i] = v;
                      setCfg((c) => set(c, "colors.modules", mods));
                    }}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="mascota" className="space-y-4">
              <MascotStage
                packId={g2("mascot.pack", "ozito")}
                manifest={get(cfg, "mascot.manifest", null) as MascotManifest | null}
                baseUrl={g2("mascot.baseUrl")}
              />
              <div className="space-y-1.5">
                <Label>Personaje</Label>
                <div className="grid gap-2 sm:grid-cols-2">
                  {packChoices().map((p) => {
                    const active = get(cfg, "mascot.pack", "ozito") === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => setCfg((c) => set(c, "mascot.pack", p.id))}
                        className={`text-left p-3 rounded-lg border transition ${
                          active ? "border-primary bg-accent" : "hover:bg-accent/50"
                        }`}
                      >
                        <div className="font-medium text-sm">{p.label}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{p.note}</div>
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-muted-foreground">
                  <a
                    className="underline"
                    href="/demo-assets/mascots/ozito/preview.html"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Ver Ozito animado
                  </a>
                </p>
              </div>
              <MisMascotas
                key={libTick}
                baseUrl={g2("mascot.baseUrl")}
                pack={g2("mascot.pack", "ozito")}
                onPick={(baseUrl, manifest) =>
                  setCfg((c) =>
                    set(
                      set(set(c, "mascot.pack", "custom"), "mascot.baseUrl", baseUrl),
                      "mascot.manifest",
                      manifest,
                    ),
                  )
                }
                onChanged={() => setLibTick((n) => n + 1)}
              />
              <MascotConstructor
                slug={demo.slug}
                brandLogo={g2("brand.logo")}
                manifest={get(cfg, "mascot.manifest", null) as MascotManifest | null}
                baseUrl={g2("mascot.baseUrl")}
                enUso={
                  g2("mascot.pack", "ozito") === "custom" &&
                  !!estadoDePack(get(cfg, "mascot.manifest", null) as MascotManifest | null)
                }
                onUsar={(baseUrl, manifest) =>
                  setCfg((c) =>
                    set(
                      set(set(c, "mascot.pack", "custom"), "mascot.baseUrl", baseUrl),
                      "mascot.manifest",
                      manifest,
                    ),
                  )
                }
                onGuardada={() => setLibTick((n) => n + 1)}
              />

              <MascotPackField
                slug={demo.slug}
                pack={g2("mascot.pack", "ozito")}
                manifest={get(cfg, "mascot.manifest", null) as MascotManifest | null}
                onUploaded={(baseUrl, manifest) =>
                  setCfg((c) =>
                    set(
                      set(set(c, "mascot.pack", "custom"), "mascot.baseUrl", baseUrl),
                      "mascot.manifest",
                      manifest,
                    ),
                  )
                }
              />
              <Field
                label="Nombre completo"
                hint={`Con el que se presenta al empezar: «${packDefaults.fullName}».`}
                value={get(cfg, "mascot.fullName")}
                placeholder={packDefaults.fullName}
                onChange={upd("mascot.fullName")}
              />
              <Field
                label="Nombre corto"
                hint={`Como lo llaman las lecciones el resto del tiempo: «${packDefaults.name}».`}
                value={get(cfg, "mascot.name")}
                placeholder={packDefaults.name}
                onChange={upd("mascot.name")}
              />
              <Field
                label="Qué es"
                hint={`Qué clase de personaje es: «${packDefaults.kind}».`}
                value={get(cfg, "mascot.kind")}
                onChange={upd("mascot.kind")}
              />
              <Field
                label="Emoji"
                value={get(cfg, "mascot.emoji")}
                placeholder={packDefaults.emoji}
                onChange={upd("mascot.emoji")}
              />
            </TabsContent>

            <TabsContent value="textos" className="space-y-4">
              <div>
                <p className="text-sm font-medium">Iconos</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Elige un emoji de los de al lado, escribe otro, o sube una imagen tuya.
                </p>
              </div>
              <IconField
                label="Racha"
                slug={demo.slug}
                kind="icono-racha"
                suggestions={["🔥", "⚡", "🌟", "🏆", "💪"]}
                fallback="🔥"
                value={g2("icons.streak")}
                onChange={upd("icons.streak")}
              />
              <IconField
                label="Meta diaria"
                hint="Si lo dejas vacío se conserva el anillo de progreso de siempre."
                slug={demo.slug}
                kind="icono-meta"
                suggestions={["⏱", "⏰", "🎯", "📅", "✅"]}
                fallback=""
                value={g2("icons.goal")}
                onChange={upd("icons.goal")}
              />
              <IconField
                label="Panel de progreso"
                slug={demo.slug}
                kind="icono-panel"
                suggestions={["📊", "📈", "🗂", "🎖", "📋"]}
                fallback="📊"
                value={g2("icons.dashboard")}
                onChange={upd("icons.dashboard")}
              />

              <hr />
              <Field
                label="Cómo se dirige al alumno"
                hint="Así se dirige el curso al alumno: «ingenier@», «estudiante»… Se cambia en todas las lecciones a la vez."
                value={get(cfg, "copy.audience")}
                placeholder={DEFAULTS.copy.audience}
                onChange={upd("copy.audience")}
              />

              <details className="rounded-lg border p-3">
                <summary className="text-sm font-medium cursor-pointer select-none">
                  Cambiar el texto del botón de progreso
                </summary>
                <p className="text-xs text-muted-foreground mt-1 mb-3">
                  Normalmente no hace falta tocarlo.
                </p>
                <div className="space-y-4">
                  <Field
                    label="Texto del botón"
                    value={get(cfg, "copy.dashboardCta")}
                    placeholder={DEFAULTS.copy.dashboardCta}
                    onChange={upd("copy.dashboardCta")}
                  />
                  <Field
                    label="Subtítulo"
                    value={get(cfg, "copy.dashboardCtaSub")}
                    placeholder={DEFAULTS.copy.dashboardCtaSub}
                    onChange={upd("copy.dashboardCtaSub")}
                  />
                </div>
              </details>
            </TabsContent>

            <TabsContent value="mapa" className="space-y-4">
              <p className="text-sm text-muted-foreground">
                El fondo del mapa de cada módulo, con los botones y la mascota encima para ver cómo
                queda. Lo que dejes vacío conserva el fondo de siempre.
              </p>
              {MODULE_LABELS.map((_, i) => (
                <MapModuleField
                  key={i}
                  n={i + 1}
                  slug={demo.slug}
                  mascotHead={mascotHead}
                  modColor={
                    (get(cfg, `colors.modules.${i}`, "") as string) || DEFAULTS.colors.modules[i]
                  }
                  bg={g2(`map.backgrounds.${i}`)}
                  offsets={get<number[] | null>(cfg, `map.buttonOffsets.${i}`, null) ?? []}
                  onBg={(v: string) => {
                    const bgs: (string | null)[] = [
                      ...(get<(string | null)[] | null>(cfg, "map.backgrounds", null) ?? [
                        null,
                        null,
                        null,
                        null,
                        null,
                      ]),
                    ];
                    bgs[i] = v || null;
                    setCfg((c) => set(c, "map.backgrounds", bgs.some(Boolean) ? bgs : ""));
                  }}
                  onOffsets={(v: number[]) => {
                    const all: (number[] | null)[] = [
                      ...(get<(number[] | null)[] | null>(cfg, "map.buttonOffsets", null) ?? [
                        null,
                        null,
                        null,
                        null,
                        null,
                      ]),
                    ];
                    // Un módulo sin ningún ajuste se guarda como null, para no
                    // dejar ceros por toda la configuración.
                    all[i] = v.some(Boolean) ? v : null;
                    setCfg((c) =>
                      set(c, "map.buttonOffsets", all.some((x) => x && x.some(Boolean)) ? all : ""),
                    );
                  }}
                />
              ))}
            </TabsContent>
          </Tabs>

          <hr className="my-5" />
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              Creado {new Date(demo.created_at).toLocaleDateString("es")} · editado{" "}
              {new Date(demo.updated_at).toLocaleDateString("es")}
            </p>
            <Button
              variant="ghost"
              className="text-destructive"
              onClick={() => {
                if (confirm(`¿Eliminar el demo «${demo.slug}»? El enlace dejará de funcionar.`))
                  remove.mutate();
              }}
            >
              Eliminar
            </Button>
          </div>
        </Card>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Previo</p>
            <Button size="sm" variant="ghost" onClick={() => setPreviewKey((k) => k + 1)}>
              Recargar
            </Button>
          </div>
          <div className="rounded-2xl border overflow-hidden bg-muted">
            <iframe
              key={previewKey}
              src={`${url}?debug=1&p=${previewKey}`}
              title={`Previo de ${demo.slug}`}
              className="w-[390px] h-[720px] block bg-white"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Esto muestra lo último guardado. Si acabas de guardar y no ves el cambio, espera unos
            segundos y pulsa Recargar.
          </p>
        </div>
      </div>
    </div>
  );
}

// --- Mapa de módulo -----------------------------------------------------------
// Todo esto está copiado de la plantilla para que el previo sea fiel: mismas
// posiciones, mismos tamaños y misma escala del fondo. Si allí cambian, aquí
// también.
const SWAY = [0, -44, -70, -44, 0, 44, 70, 44];
const BTN_ADJ: Record<number, Record<number, number>> = {
  1: { 0: -2, 1: 6, 2: -1, 3: -17, 4: -20, 5: -16, 6: -12, 7: 1, 8: 3, 9: -5 },
  2: { 0: 1, 1: 5, 3: -10, 4: -13, 5: -9, 6: -14, 7: -3, 8: 1, 9: -2 },
  3: { 0: -4, 1: 6, 2: 4, 3: -11, 4: -15, 5: -11, 6: -11, 7: -2 },
  4: { 1: 5, 2: -2, 3: -13, 4: -10, 5: -12, 6: -13, 7: -9 },
  5: { 0: 1, 1: 2, 2: 2, 3: -11, 4: -18, 5: -14, 6: -18 },
};
const MASCOT_POS: Record<number, { x: number; y: number }> = {
  1: { x: 57, y: 16 },
  2: { x: 59, y: 16 },
  3: { x: 68, y: -148 },
  4: { x: 77, y: 50 },
  5: { x: 70, y: 27 },
};
/** Lecciones reales de cada módulo: son los botones que se dibujan. */
const MODULE_LESSONS = [10, 12, 8, 8, 7];

// Medidas exactas del caminito, en píxeles de la app.
const APP_WIDTH = 390; // ancho de referencia del móvil
const BG_WIDTH = 490; // background-size: 490px auto — NO es "cover"
const PATH_PAD_TOP = 97; // .lpath { padding: 97px 16px 108px 0 }
const PATH_PAD_RIGHT = 16;
const PATH_PAD_BOTTOM = 108;
// El padding es ASIMÉTRICO (16 a la derecha, 0 a la izquierda), así que las
// filas se centran en el hueco de contenido —187— mientras que el fondo y la
// mascota se centran en la caja entera —195—. Son 8px de diferencia, justo lo
// que hay que respetar para cuadrar una imagen.
const ROW_CENTER = (APP_WIDTH - PATH_PAD_RIGHT) / 2;
const BOX_CENTER = APP_WIDTH / 2;
const NODE_W = 71; // .lpath .node { width }
const NODE_H = 67; // .lpath .node { height }
const LOCKED_CAP = "#DADAE0"; // .lpath .node.locked .cap
const LOCKED_BASE = "#C2C2CC"; // .lpath .node.locked .base
const MASCOT_W = 100; // BOTI_SIZE
const MASCOT_RATIO = 1139.5 / 757.6; // BOTI_RATIO
const MASCOT_DROP = 40; // BOTI_DROP
const MASCOT_NUDGE_X = 6; // BOTI_NUDGE_X

/** Separación por encima de cada fila, igual que la calcula renderModuleNow(). */
function rowGap(i: number) {
  return i === 0
    ? 22
    : Math.round(30 - 0.45 * Math.abs(SWAY[i % SWAY.length] - SWAY[(i - 1) % SWAY.length]));
}
/** Coordenada Y del borde superior de cada botón, en píxeles de la app. */
function nodeTop(i: number) {
  let y = PATH_PAD_TOP;
  for (let j = 0; j <= i; j++) y += rowGap(j) + (j > 0 ? NODE_H : 0);
  return y;
}

/**
 * El mapa de un módulo, dibujado como en la app, con cada botón movible por
 * separado. Un fondo propio nunca trae el caminito donde lo tienen los de
 * fábrica, y cada curva cae en un sitio distinto: por eso el ajuste es por
 * botón y no un corrimiento de todos a la vez.
 */
function MapModuleField({
  n,
  slug,
  bg,
  offsets,
  mascotHead,
  modColor,
  onBg,
  onOffsets,
}: {
  n: number;
  slug: string;
  bg: string;
  offsets: number[];
  mascotHead: string;
  /** El color de ESTE módulo: es el que llevan sus botones desbloqueados. */
  modColor: string;
  onBg: (v: string) => void;
  onOffsets: (v: number[]) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [sel, setSel] = useState(0);
  const [drag, setDrag] = useState<{ i: number; x0: number; v0: number } | null>(null);

  const count = MODULE_LESSONS[n - 1] ?? 8;
  const src = bg || `/demo-assets/modulebg${n}.png`;

  // Escala del previo. El alto sale del caminito real para que no se corte.
  const VIEW_W = 250;
  const k = VIEW_W / APP_WIDTH;
  const viewH = Math.round((nodeTop(count - 1) + NODE_H + PATH_PAD_BOTTOM) * k);

  const offAt = (i: number) => offsets[i] ?? 0;
  const setOff = (i: number, v: number) => {
    const next = Array.from({ length: count }, (_, j) => (j === i ? v : offAt(j)));
    onOffsets(next);
  };

  // Arrastre horizontal: se mueve el botón y se guarda su desplazamiento.
  useEffect(() => {
    if (!drag) return;
    const move = (e: PointerEvent) => {
      const dx = (e.clientX - drag.x0) / k; // de píxeles del previo a los de la app
      setOff(drag.i, Math.round(drag.v0 + dx));
    };
    const up = () => setDrag(null);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drag]);

  const mascotH = MASCOT_W * MASCOT_RATIO;
  const thirdRowCenter = nodeTop(Math.min(2, count - 1)) + NODE_H / 2;

  return (
    <div className="rounded-lg border p-3">
      <div className="flex flex-wrap items-start gap-4">
        {/* Previo a escala: el fondo va a 490px centrado, como en la app */}
        <div
          className="relative shrink-0 overflow-hidden rounded-lg border bg-white"
          style={{
            width: VIEW_W,
            height: viewH,
            backgroundImage: `url('${src}')`,
            backgroundSize: `${BG_WIDTH * k}px auto`,
            backgroundPosition: "center top",
            backgroundRepeat: "no-repeat",
          }}
        >
          {mascotHead && (
            <img
              src={mascotHead}
              alt=""
              style={{
                position: "absolute",
                left: (BOX_CENTER + MASCOT_POS[n].x - MASCOT_W / 2 + MASCOT_NUDGE_X) * k,
                top: (thirdRowCenter - mascotH / 2 + MASCOT_POS[n].y + MASCOT_DROP) * k,
                width: MASCOT_W * k,
                opacity: 0.9,
                pointerEvents: "none",
              }}
            />
          )}

          {Array.from({ length: count }, (_, i) => {
            const x = SWAY[i % SWAY.length] + (BTN_ADJ[n]?.[i] ?? 0) + offAt(i);
            const active = sel === i;
            return (
              <button
                key={i}
                type="button"
                onPointerDown={(e) => {
                  e.preventDefault();
                  setSel(i);
                  setDrag({ i, x0: e.clientX, v0: offAt(i) });
                }}
                title={`Lección ${i + 1} — arrástrala para moverla`}
                style={{
                  position: "absolute",
                  left: (ROW_CENTER + x) * k,
                  top: nodeTop(i) * k,
                  width: NODE_W * k,
                  height: NODE_H * k,
                  transform: "translateX(-50%)",
                  border: "none",
                  background: "none",
                  padding: 0,
                  cursor: "ew-resize",
                  touchAction: "none",
                }}
              >
                {/* base + cap: el botón redondo de la app */}
                <span
                  style={{
                    position: "absolute",
                    inset: 0,
                    top: (NODE_H - 58) * k,
                    height: 58 * k,
                    borderRadius: "50%",
                    background: i === 0 ? shade(modColor, -0.24) : LOCKED_BASE,
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    inset: 0,
                    height: 58 * k,
                    borderRadius: "50%",
                    background: i === 0 ? modColor : LOCKED_CAP,
                    outline: active ? "2px solid #111" : "none",
                    outlineOffset: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    font: "700 10px system-ui",
                  }}
                >
                  {i + 1}
                </span>
              </button>
            );
          })}
        </div>

        {/* Controles */}
        <div className="min-w-[240px] flex-1 space-y-3">
          <p className="text-sm font-medium">
            {MODULE_LABELS[n - 1]}{" "}
            <span className="text-muted-foreground font-normal">· {count} lecciones</span>
          </p>

          <div className="flex items-center gap-2">
            <img
              src={src}
              alt=""
              className={`h-11 w-11 shrink-0 rounded border object-cover bg-white ${bg ? "" : "opacity-60"}`}
            />
            <Input
              value={bg ?? ""}
              placeholder="Fondo de fábrica"
              onChange={(e) => onBg(e.target.value)}
            />
            <Button variant="outline" size="sm" asChild disabled={busy}>
              <label className="cursor-pointer shrink-0">
                {busy ? "Subiendo…" : "Subir"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setBusy(true);
                    try {
                      onBg(await uploadBrandFile(slug, `mapa${n}`, file));
                      toast.success("Fondo subido.");
                    } catch (err) {
                      toast.error((err as Error).message);
                    } finally {
                      setBusy(false);
                      e.target.value = "";
                    }
                  }}
                />
              </label>
            </Button>
            {bg && (
              <Button variant="ghost" size="sm" onClick={() => onBg("")}>
                Quitar
              </Button>
            )}
          </div>

          <div className="rounded-lg bg-muted/40 p-2.5 space-y-2">
            <p className="text-xs text-muted-foreground">
              Arrastra un botón sobre la imagen, o elígelo aquí y muévelo con la flecha.
            </p>
            <div className="flex flex-wrap gap-1">
              {Array.from({ length: count }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSel(i)}
                  className={`h-7 w-7 rounded border text-[11px] font-semibold ${
                    sel === i ? "border-primary bg-accent" : "hover:bg-accent/50"
                  } ${offAt(i) ? "text-primary" : ""}`}
                  title={offAt(i) ? `movido ${offAt(i)}px` : "sin mover"}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-xs whitespace-nowrap">Lección {sel + 1}</Label>
              <input
                type="range"
                min={-90}
                max={90}
                value={offAt(sel)}
                onChange={(e) => setOff(sel, Number(e.target.value))}
                className="flex-1"
                aria-label={`Posición horizontal de la lección ${sel + 1}`}
              />
              <Input
                type="number"
                value={offAt(sel)}
                onChange={(e) => setOff(sel, Number(e.target.value) || 0)}
                className="w-16 font-mono"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOffsets(Array.from({ length: count }, () => 0))}
                disabled={!offsets.some(Boolean)}
              >
                Quitar todos los ajustes
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const d = offAt(sel);
                  onOffsets(Array.from({ length: count }, () => d));
                }}
                disabled={!offAt(sel)}
              >
                Aplicar este a todos
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Carga un script una sola vez, aunque se pida varias veces. */
const loaded = new Map<string, Promise<void>>();
function loadScript(src: string) {
  if (!loaded.has(src)) {
    loaded.set(
      src,
      new Promise<void>((res, rej) => {
        const s = document.createElement("script");
        s.src = src;
        s.onload = () => res();
        s.onerror = () => rej(new Error("No se pudo cargar " + src));
        document.head.appendChild(s);
      }),
    );
  }
  return loaded.get(src)!;
}

/**
 * La mascota montada de verdad y moviéndose, con el mismo runtime que usa la
 * app. Antes aquí había una imagen fija de la cabeza, así que ninguna mascota
 * parecía animarse por más que lo estuviera.
 */
function MascotStage({
  packId,
  manifest,
  baseUrl,
}: {
  packId: string;
  manifest: MascotManifest | null;
  baseUrl: string;
}) {
  const box = useRef<HTMLDivElement | null>(null);
  const [err, setErr] = useState<string | null>(null);
  // Si el sistema pide menos movimiento, la mascota se mueve poco — y conviene
  // decirlo, o parece que está rota.
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    let dead = false;
    const el = box.current;
    if (!el) return;
    el.innerHTML = "";
    el.className = "";
    setErr(null);

    const pack =
      packId === "custom" ? manifest : ((BUILT_IN_PACKS[packId] ?? null) as MascotManifest | null);
    const dir = packId === "custom" ? baseUrl : packAsset(packId, "");
    if (!pack) return;

    (async () => {
      try {
        if (pack.engine === "script") {
          // Packs con motor propio (Boti): se carga su archivo y se le delega.
          await loadScript(dir + (pack.entry ?? "mascot.js"));
          if (dead) return;
          const g = (
            window as unknown as Record<string, { mount: (e: Element, o?: unknown) => void }>
          )[pack.global ?? "Boti"];
          g?.mount(el, { interactive: false });
        } else {
          await loadScript("/demo-assets/mascots/mascot-runtime.js");
          if (dead) return;
          const M = (
            window as unknown as {
              Mascot?: { init: (m: unknown, b: string) => { mount: (e: Element) => void } };
            }
          ).Mascot;
          M?.init(pack, dir).mount(el);
        }
      } catch (e) {
        if (!dead) setErr((e as Error).message);
      }
    })();

    return () => {
      dead = true;
    };
  }, [packId, manifest, baseUrl]);

  const ratio = (() => {
    const p = packId === "custom" ? manifest : BUILT_IN_PACKS[packId];
    const a = p?.artboard;
    return a?.width ? a.height / a.width : 1.5;
  })();
  const W = 96;

  return (
    <div className="flex items-end gap-3 rounded-lg border bg-muted/30 p-3">
      <div style={{ width: W, height: W * ratio, position: "relative" }} ref={box} />
      <div className="text-xs text-muted-foreground">
        {err ? (
          <span className="text-destructive">{err}</span>
        ) : reduced ? (
          // No hace falta que lo adivine nadie: si el sistema pide menos
          // movimiento, se dice cuál es el ajuste y dónde está.
          <>
            <p className="font-medium text-foreground">Se mueve poco a propósito</p>
            <p className="mt-1">
              Tu equipo tiene activado «reducir movimiento», así que las mascotas van a un cuarto de
              su recorrido y más lento. A tus alumnos, sin ese ajuste, se les moverá del todo.
            </p>
            <p className="mt-1">
              Se cambia en{" "}
              <b>Configuración → Accesibilidad → Efectos visuales → Efectos de animación</b> en
              Windows, o en{" "}
              <b>Ajustes del Sistema → Accesibilidad → Pantalla → Reducir movimiento</b> en Mac.
            </p>
          </>
        ) : (
          <p>Así se mueve de verdad, con la misma animación que verá el alumno.</p>
        )}
      </div>
    </div>
  );
}

/**
 * Un icono: emoji o imagen propia, en el mismo sitio. Los emojis sugeridos se
 * eligen de un toque; para cualquier otro, se escribe; y si hace falta la marca
 * de la institución, se sube un archivo.
 */
function IconField({
  label,
  hint,
  slug,
  kind,
  suggestions,
  fallback,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  slug: string;
  kind: string;
  suggestions: string[];
  fallback: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const isImage =
    !!value && (/^(https?:|\/|data:)/.test(value) || /\.(svg|png|jpg|webp)$/i.test(value));

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex flex-wrap items-center gap-2">
        {/* Lo que se está usando ahora mismo */}
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-white">
          {isImage ? (
            <img src={value} alt="" className="h-7 w-7 object-contain" />
          ) : (
            <span className="text-xl leading-none">{value || fallback || "—"}</span>
          )}
        </span>

        {suggestions.map((e) => (
          <button
            key={e}
            type="button"
            onClick={() => onChange(e)}
            aria-label={`Usar ${e}`}
            className={`h-10 w-10 rounded-lg border text-xl leading-none transition hover:bg-accent ${
              value === e ? "border-primary bg-accent" : ""
            }`}
          >
            {e}
          </button>
        ))}

        <Button variant="outline" size="sm" asChild disabled={busy}>
          <label className="cursor-pointer shrink-0">
            {busy ? "Subiendo…" : "Subir imagen"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setBusy(true);
                try {
                  onChange(await uploadBrandFile(slug, kind, file));
                  toast.success("Imagen subida.");
                } catch (err) {
                  toast.error((err as Error).message);
                } finally {
                  setBusy(false);
                  e.target.value = "";
                }
              }}
            />
          </label>
        </Button>

        {value && (
          <Button variant="ghost" size="sm" onClick={() => onChange("")}>
            Quitar
          </Button>
        )}
      </div>

      <Input
        value={value ?? ""}
        placeholder={
          fallback
            ? `Otro emoji, o pega una dirección (por defecto ${fallback})`
            : "Otro emoji, o pega una dirección"
        }
        onChange={(e) => onChange(e.target.value)}
      />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

/**
 * Las mascotas guardadas en la biblioteca: las que se hicieron en el
 * constructor o se subieron y se quisieron conservar. Se ofrecen igual que las
 * incorporadas, y desde aquí se renombran o se quitan.
 */
function MisMascotas({
  baseUrl,
  pack,
  onPick,
  onChanged,
}: {
  baseUrl: string;
  pack: string;
  onPick: (baseUrl: string, manifest: MascotManifest) => void;
  onChanged: () => void;
}) {
  const [items, setItems] = useState<SavedMascot[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rehaciendo, setRehaciendo] = useState<string | null>(null);

  useEffect(() => {
    let vivo = true;
    listSavedMascots()
      .then((l) => vivo && setItems(l))
      .catch((e) => vivo && setError((e as Error).message));
    return () => {
      vivo = false;
    };
  }, []);

  /**
   * Vuelve a dibujar una mascota con el arte actual.
   *
   * El pack guardado es un SVG ya hecho: al corregir el arte (el polo de cuello
   * redondo y la altura del rostro, por ejemplo) las mascotas guardadas antes
   * seguirían mostrando el dibujo viejo. Con el estado que viaja dentro del
   * manifiesto se rehace igual, sólo que con el arte de hoy.
   */
  async function regenerar(m: SavedMascot) {
    const guardado = estadoDePack(m.manifest);
    if (!guardado) return;
    setRehaciendo(m.id);
    try {
      const data = await loadPersonajes();
      const logo = await logoDePack(m.baseUrl);
      const S = { ...guardado, logoImg: logo ?? "" };
      const caja = medirPersonaje(data, S);
      const ident = {
        name: m.name,
        shortName: m.shortName ?? m.name,
        kind: m.kind ?? "mascota guía",
        emoji: m.emoji ?? "✨",
      };
      const { manifest, zip } = packDeMascota(data, S, ident, caja);
      const subido = await uploadPack(LIBRARY_FOLDER, zip);
      await saveMascot({
        name: m.name,
        manifest: { ...subido.manifest, ...manifest },
        baseUrl: subido.baseUrl,
      });
      toast.success(`«${m.name}» se volvió a dibujar con el arte actual.`);
      onChanged();
      setItems(await listSavedMascots());
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setRehaciendo(null);
    }
  }

  if (error) return <p className="text-xs text-destructive">Mis mascotas: {error}</p>;
  if (!items) return <p className="text-xs text-muted-foreground">Cargando tus mascotas…</p>;
  if (!items.length) return null;


  return (
    <div className="space-y-1.5">
      <Label>Mis mascotas</Label>
      <div className="grid gap-2 sm:grid-cols-2">
        {items.map((m) => {
          const active = pack === "custom" && baseUrl === m.baseUrl;
          return (
            <div
              key={m.id}
              className={`flex min-w-0 items-center gap-2 rounded-lg border p-2 transition ${
                active ? "border-primary bg-accent" : "hover:bg-accent/50"
              }`}
            >
              <button
                type="button"
                onClick={() => onPick(m.baseUrl, m.manifest)}
                className="flex min-w-0 flex-1 items-center gap-2 text-left"
              >
                {m.thumb ? (
                  <img src={m.thumb} alt="" className="h-10 w-10 shrink-0 object-contain" />
                ) : (
                  <span className="text-xl">{m.emoji ?? "✨"}</span>
                )}
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">
                    {m.name} {m.emoji}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {m.kind ?? "mascota guía"}
                  </span>
                </span>
              </button>
              <button
                type="button"
                className="shrink-0 text-xs underline text-muted-foreground"
                onClick={async () => {
                  const nuevo = window.prompt("Nuevo nombre", m.name);
                  if (!nuevo?.trim()) return;
                  try {
                    await renameMascot(m.id, nuevo.trim());
                    onChanged();
                  } catch (e) {
                    toast.error((e as Error).message);
                  }
                }}
              >
                Renombrar
              </button>
              <button
                type="button"
                className="shrink-0 text-xs underline text-muted-foreground"
                onClick={async () => {
                  if (!window.confirm(`¿Quitar «${m.name}» de tus mascotas?`)) return;
                  try {
                    await deleteMascot(m.id);
                    toast.success("Quitada de tus mascotas. Los demos que la usan siguen igual.");
                    onChanged();
                  } catch (e) {
                    toast.error((e as Error).message);
                  }
                }}
              >
                Quitar
              </button>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground">
        Quitar una de aquí no cambia los demos que ya la usan.
      </p>
    </div>
  );
}


/**
 * Descargar la plantilla y subir un pack propio. Es lo que permite tener una
 * mascota que no sea ninguna de las dos incorporadas.
 */
function MascotPackField({
  slug,
  pack,
  manifest,
  onUploaded,
}: {
  slug: string;
  pack: string;
  manifest: MascotManifest | null;
  onUploaded: (baseUrl: string, manifest: MascotManifest) => void;
}) {
  const [check, setCheck] = useState<PackCheck | null>(null);
  const [busy, setBusy] = useState<null | "revisando" | "subiendo" | "plantilla">(null);

  async function pick(file: File) {
    setCheck(null);
    setBusy("revisando");
    try {
      const result = await inspectPack(file);
      setCheck(result);
      if (!result.ok) return;
      setBusy("subiendo");
      const { baseUrl, manifest: m } = await uploadPack(slug, file);
      onUploaded(baseUrl, m);
      toast.success(`Pack «${m.name}» subido. Guarda para aplicarlo.`);
    } catch (e) {
      toast.error((e as Error).message);
      setCheck({
        ok: false,
        manifest: null,
        files: [],
        errors: [(e as Error).message],
        warnings: [],
      });
    } finally {
      setBusy(null);
    }
  }

  async function template(blank: boolean) {
    setBusy("plantilla");
    try {
      await downloadTemplate(blank);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="rounded-lg border p-3 space-y-3">
      <div>
        <p className="text-sm font-medium">Mascota propia</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Descarga la plantilla, redibuja el arte y súbela como <code>.zip</code>.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" disabled={!!busy} onClick={() => template(true)}>
          Descargar plantilla
        </Button>
        <Button variant="ghost" size="sm" disabled={!!busy} onClick={() => template(false)}>
          Descargar Ozito completo
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        La plantilla trae el andamiaje montado —capas, pivotes, animación y un{" "}
        <code>preview.html</code> para verla— con siluetas de relleno en vez del arte. Las
        instrucciones van dentro, en <code>README.md</code>.
      </p>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" asChild disabled={!!busy}>
          <label className="cursor-pointer">
            {busy === "revisando"
              ? "Revisando…"
              : busy === "subiendo"
                ? "Subiendo…"
                : "Subir pack .zip"}
            <input
              type="file"
              accept=".zip,application/zip"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) pick(f);
                e.target.value = "";
              }}
            />
          </label>
        </Button>
        {pack === "custom" && manifest && (
          <span className="text-xs">
            En uso: <b>{manifest.name}</b> {manifest.emoji}
          </span>
        )}
      </div>

      {check && (
        <div
          className={`rounded-lg border p-3 space-y-1.5 ${
            check.ok
              ? "border-emerald-500/40 bg-emerald-500/5"
              : "border-destructive/40 bg-destructive/5"
          }`}
        >
          <p className="text-sm font-medium">
            {check.ok
              ? `Pack válido: ${check.manifest?.name} · ${check.files.length} archivos`
              : "El pack tiene problemas"}
          </p>
          {check.errors.map((e, i) => (
            <p key={i} className="text-xs text-destructive">
              · {e}
            </p>
          ))}
          {check.warnings.map((w, i) => (
            <p key={i} className="text-xs text-muted-foreground">
              · {w}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Marca de agua: dónde va, cuánto ocupa y cuánto se nota
// ─────────────────────────────────────────────────────────────────────────────

type WmPos = "tl" | "tc" | "tr" | "cc" | "bl" | "bc" | "br";

/** Un número de la configuración, o el de siempre si no hay nada guardado. */
function num(v: unknown, d: number): number {
  const n = typeof v === "string" ? Number(v) : v;
  return typeof n === "number" && isFinite(n) ? n : d;
}

const WM_POS: { id: WmPos; label: string }[] = [
  { id: "tl", label: "Arriba izq." },
  { id: "tc", label: "Arriba centro" },
  { id: "tr", label: "Arriba der." },
  { id: "cc", label: "Centro" },
  { id: "bl", label: "Abajo izq." },
  { id: "bc", label: "Abajo centro" },
  { id: "br", label: "Abajo der." },
];

/**
 * Sitio, separación, tamaño y transparencia de la marca de agua, con un previo
 * en vivo: se ve dónde cae sin tener que publicar el demo y abrirlo.
 */
function WatermarkPlacement({
  src,
  pos,
  x,
  y,
  size,
  opacity,
  onChange,
}: {
  src: string;
  pos: WmPos;
  x: number;
  y: number;
  size: number;
  opacity: number;
  onChange: (campo: "Pos" | "X" | "Y" | "Size" | "Opacity", valor: string | number) => void;
}) {
  // El previo es un móvil de 360 de ancho encogido a la caja del panel.
  const ANCHO = 360;
  const [caja, setCaja] = useState(240);
  const escala = caja / ANCHO;
  const centrado = pos === "cc";
  const estilo: React.CSSProperties = {
    position: "absolute",
    width: size * escala,
    opacity,
    pointerEvents: "none",
    ...(pos.startsWith("t") ? { top: y * escala } : {}),
    ...(pos.startsWith("b") ? { bottom: y * escala } : {}),
    ...(pos.endsWith("l") ? { left: x * escala } : {}),
    ...(pos.endsWith("r") ? { right: x * escala } : {}),
    ...(pos.endsWith("c") && !centrado
      ? { left: "50%", transform: "translateX(-50%)" }
      : {}),
    ...(centrado ? { top: "50%", left: "50%", transform: "translate(-50%,-50%)" } : {}),
  };

  return (
    <div className="space-y-3 pt-1">
      <div>
        <Label className="text-xs">Dónde va</Label>
        <div className="flex flex-wrap gap-1 mt-1">
          {WM_POS.map((o) => (
            <Button
              key={o.id}
              size="sm"
              variant={pos === o.id ? "default" : "outline"}
              onClick={() => onChange("Pos", o.id)}
            >
              {o.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Slider2
          label="Separación horizontal"
          value={x}
          min={0}
          max={120}
          step={1}
          suffix="px"
          disabled={centrado || pos.endsWith("c")}
          onChange={(v) => onChange("X", v)}
        />
        <Slider2
          label="Separación vertical"
          value={y}
          min={0}
          max={200}
          step={1}
          suffix="px"
          disabled={centrado}
          onChange={(v) => onChange("Y", v)}
        />
        <Slider2
          label="Tamaño"
          value={size}
          min={32}
          max={260}
          step={2}
          suffix="px"
          onChange={(v) => onChange("Size", v)}
        />
        <Slider2
          label="Transparencia"
          value={Math.round(opacity * 100)}
          min={4}
          max={100}
          step={1}
          suffix="%"
          onChange={(v) => onChange("Opacity", Math.round(v) / 100)}
        />
      </div>

      <div>
        <Label className="text-xs">Cómo queda</Label>
        <div
          ref={(el) => {
            if (el && el.clientWidth && Math.abs(el.clientWidth - caja) > 2) setCaja(el.clientWidth);
          }}
          className="relative mt-1 w-full max-w-[260px] overflow-hidden rounded-lg border bg-background"
          style={{ aspectRatio: "9 / 16" }}
        >
          {/* Un boceto de la pantalla: barra, tarjetas y el botón flotante, para
              comprobar que la marca de agua pasa por debajo de todo. */}
          <div className="absolute inset-x-0 top-0 h-6 bg-muted" />
          <div className="absolute left-3 right-3 top-9 h-10 rounded-md bg-muted/70" />
          <div className="absolute left-3 right-3 top-22 h-10 rounded-md bg-muted/70" />
          <div className="absolute bottom-3 left-3 right-3 h-9 rounded-full bg-primary/80" />
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt="" style={estilo} />
          ) : (
            <p className="absolute inset-x-2 bottom-16 text-center text-[10px] text-muted-foreground">
              Sube la imagen para verla aquí
            </p>
          )}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          La marca de agua se pinta por debajo de botones y tarjetas: nunca los tapa.
        </p>
      </div>
    </div>
  );
}

/** Un deslizador con su etiqueta y su número, sin depender de más componentes. */
function Slider2({
  label,
  value,
  min,
  max,
  step,
  suffix,
  disabled,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix: string;
  disabled?: boolean;
  onChange: (v: number) => void;
}) {
  return (
    <label className={`block min-w-0 ${disabled ? "opacity-50" : ""}`}>
      <span className="flex items-baseline justify-between gap-2 text-xs">
        <span className="truncate">{label}</span>
        <span className="text-muted-foreground shrink-0">
          {value}
          {suffix}
        </span>
      </span>
      <input
        type="range"
        className="mt-1 w-full accent-primary"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}


function Field({
  label,
  hint,
  value,
  onChange,
  placeholder,
  multiline,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
}) {
  const C = multiline ? Textarea : Input;
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <C
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
          onChange(e.target.value)
        }
      />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

/** Lee un hex escrito a mano: con o sin «#», de 3 o de 6 dígitos. '' si no lo es. */
function normalizeHex(raw: string) {
  const t = (raw ?? "").trim().replace(/^#/, "");
  if (/^[0-9a-fA-F]{6}$/.test(t)) return "#" + t.toUpperCase();
  if (/^[0-9a-fA-F]{3}$/.test(t))
    return (
      "#" +
      t
        .split("")
        .map((c) => c + c)
        .join("")
        .toUpperCase()
    );
  return "";
}

function ColorField({
  label,
  hint,
  value,
  onChange,
  /**
   * Lo que se usa cuando el campo está vacío. Sin esto, un color derivado (los
   * del splash salen del acento) enseñaba un cuadrito morado que no tenía nada
   * que ver con lo que de verdad se iba a pintar.
   */
  fallback,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  fallback?: string;
}) {
  // El campo se escribe carácter a carácter: si se pintara desde el estado,
  // «#1» se descartaría antes de acabar de teclear. Se guarda el texto en
  // curso y sólo se emite cuando ya se puede leer como color.
  const [texto, setTexto] = useState(value ?? "");
  const tocando = useRef(false);
  useEffect(() => {
    if (!tocando.current) setTexto(value ?? "");
  }, [value]);

  const valid = /^#[0-9a-fA-F]{6}$/.test(value ?? "");
  const shown = valid ? value : (fallback ?? "#7C1C56");
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <input
          type="color"
          value={shown}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          className="h-9 w-12 rounded-md border cursor-pointer bg-transparent"
          aria-label={label}
        />
        <Input
          value={texto}
          placeholder={fallback ?? "#7C1C56"}
          spellCheck={false}
          onFocus={() => (tocando.current = true)}
          onBlur={() => {
            tocando.current = false;
            // Al salir, lo escrito se deja en su forma canónica; si no era un
            // color se recupera lo último válido para no dejar basura a la vista.
            setTexto(normalizeHex(texto) || (texto.trim() === "" ? "" : (value ?? "")));
          }}
          onChange={(e) => {
            const v = e.target.value;
            setTexto(v);
            if (v.trim() === "") return onChange("");
            const hex = normalizeHex(v);
            if (hex) onChange(hex);
          }}
          className="font-mono"
        />
      </div>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}



function FileField({
  label,
  hint,
  slug,
  kind,
  value,
  onChange,
  fallbackSrc,
  fallbackLabel,
}: {
  label: string;
  hint?: string;
  slug: string;
  kind: string;
  value: string;
  onChange: (v: string) => void;
  /** Imagen que se usa si no se sube ninguna: se enseña igualmente. */
  fallbackSrc?: string;
  /** Si no hay imagen por defecto, qué se usa en su lugar. */
  fallbackLabel?: string;
}) {
  const [busy, setBusy] = useState(false);
  const shown = value || fallbackSrc || "";
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="flex gap-2 items-center">
        {/* Siempre hay miniatura: si no se ha subido nada, la de por defecto,
            para saber qué se está sustituyendo. */}
        <span className="relative shrink-0">
          {shown ? (
            <img
              src={shown}
              alt=""
              className={`h-11 w-11 object-contain rounded border bg-white ${
                value ? "" : "opacity-60"
              }`}
            />
          ) : (
            <span className="flex h-11 w-11 items-center justify-center rounded border border-dashed bg-muted/40 text-center text-[9px] leading-tight text-muted-foreground px-1">
              {fallbackLabel ?? "sin imagen"}
            </span>
          )}
          {!value && (
            <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 rounded bg-muted px-1 text-[9px] text-muted-foreground">
              actual
            </span>
          )}
        </span>
        <Input
          value={value ?? ""}
          placeholder="Pega una dirección, o sube un archivo →"
          onChange={(e) => onChange(e.target.value)}
        />
        <Button variant="outline" size="sm" asChild disabled={busy}>
          <label className="cursor-pointer shrink-0">
            {busy ? "Subiendo…" : "Subir"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setBusy(true);
                try {
                  onChange(await uploadBrandFile(slug, kind, file));
                  toast.success("Archivo subido.");
                } catch (err) {
                  toast.error((err as Error).message);
                } finally {
                  setBusy(false);
                  e.target.value = "";
                }
              }}
            />
          </label>
        </Button>
        {value && (
          <Button variant="ghost" size="sm" onClick={() => onChange("")}>
            Quitar
          </Button>
        )}
      </div>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
