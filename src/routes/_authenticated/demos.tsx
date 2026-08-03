import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import {
  createDemo,
  deleteDemo,
  fetchDemos,
  isAdmin,
  saveDemo,
  slugProblem,
  suggestSlug,
  uploadBrandFile,
  type DemoRow,
} from "@/lib/demos.data";
import { DEFAULTS } from "@/lib/demo-config";
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
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/demos")({
  head: () => ({ meta: [{ title: "Demos — AprendoEnglish" }] }),
  component: DemosManager,
});

type Cfg = Record<string, unknown>;

/** Lee `a.b.c` de un objeto sin reventar si falta un tramo. */
function get(o: Cfg, path: string, fallback: unknown = "") {
  return path.split(".").reduce<unknown>((v, k) => (v == null ? v : (v as Cfg)[k]), o) ?? fallback;
}
/** Escribe `a.b.c`; borra la clave si el valor queda vacío, para no guardar ruido. */
function set(o: Cfg, path: string, value: unknown): Cfg {
  const keys = path.split(".");
  const out = structuredClone(o);
  let node: Cfg = out;
  for (const k of keys.slice(0, -1)) node = node[k] ??= {};
  const last = keys[keys.length - 1];
  if (value === "" || value == null) delete node[last];
  else node[last] = value;
  return out;
}

const MODULE_LABELS = ["Módulo 1", "Módulo 2", "Módulo 3", "Módulo 4", "Módulo 5"];

const PACK_INFO: Record<string, { name: string; kind: string; emoji: string; head: string }> = {
  ozito: {
    name: "Ozzy",
    kind: "osito guía",
    emoji: "🐻",
    head: "/demo-assets/mascots/ozito/layers/head.svg",
  },
  boti: {
    name: "Boti",
    kind: "robot guía",
    emoji: "🤖",
    head: "/demo-assets/mascots/boti/boti_head.svg",
  },
};

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
function LivePreview({ tab, cfg, institution }: { tab: string; cfg: Cfg; institution: string }) {
  const g = (p: string, f: unknown = "") => get(cfg, p, f) as string;
  const accent = g("colors.accent", DEFAULTS.colors.accent);
  const button = g("colors.button") || accent;
  const spinner = g("colors.spinner") || accent;
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

  if (tab === "marca") {
    return (
      <div style={frame}>
        {AppBar}
        <p style={caption}>La barra superior, tal cual la verá el alumno.</p>
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
        <p style={caption}>Cabecera de módulo, color de cada módulo, botón y ruedita.</p>
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
            ¡Hola! Soy <b>{mName}</b> {mEmoji}, tu {mKind}.
          </div>
        </div>
        <p style={caption}>
          Así queda el texto del curso con estos valores: <code>{"{{mascot}}"}</code>{" "}
          <code>{"{{mascotEmoji}}"}</code> <code>{"{{mascotKind}}"}</code>
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
  return (
    <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-3 space-y-1">
      <p className="text-sm font-medium text-destructive">
        {rls ? "Tu cuenta no tiene permiso de administrador" : "No se pudo guardar"}
      </p>
      {rls && (
        <p className="text-xs text-muted-foreground">
          La base de datos rechazó la escritura. Hace falta una fila en <code>user_roles</code> con{" "}
          <code>role = &apos;admin&apos;</code> para tu usuario.
        </p>
      )}
      <pre className="text-[11px] text-muted-foreground whitespace-pre-wrap break-words">{msg}</pre>
    </div>
  );
}

/** Aviso permanente si la sesión no es administradora: nada va a poder guardarse. */
function AdminBanner() {
  const admin = useQuery({ queryKey: ["is-admin"], queryFn: isAdmin });
  if (admin.isLoading || admin.data?.ok) return null;
  return (
    <Card className="p-4 mb-4 border-amber-500/50 bg-amber-500/5">
      <p className="text-sm font-medium">Estás en modo sólo lectura</p>
      <p className="text-sm text-muted-foreground mt-1">
        {admin.data?.email
          ? `La cuenta ${admin.data.email} no tiene el rol de administrador, así que crear y guardar fallará.`
          : "No hay sesión iniciada."}
      </p>
      <p className="text-xs text-muted-foreground mt-2">
        Se arregla con una fila en <code>user_roles</code>:
      </p>
      <pre className="text-[11px] bg-muted p-2 rounded mt-1 overflow-x-auto">
        {`insert into public.user_roles (user_id, role)
select id, 'admin' from auth.users
where lower(email) = lower('${admin.data?.email ?? "tu@correo.com"}')
on conflict do nothing;`}
      </pre>
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
            {noTable ? "La tabla de demos aún no existe" : "No se pudieron cargar los demos"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {noTable
              ? "Publica los cambios para que se aplique la migración que crea la tabla `demos`. Mientras tanto, los demos que ya existían se siguen sirviendo desde los archivos de src/demos."
              : "Si acabas de entrar, comprueba que tu cuenta tenga el rol de administrador."}
          </p>
          <pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto">{msg}</pre>
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
            Todavía no hay ningún demo. Crea el primero.
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
            Cada demo es un enlace propio con los colores, el logo y la mascota de una institución.
          </p>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-6">{children}</main>
    </div>
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
  const url = `/${demo.slug}`;

  return (
    <div className="space-y-4">
      <Card className="p-4 flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[200px]">
          <a href={url} target="_blank" rel="noreferrer" className="font-mono text-sm underline">
            aprendoenglish.com{url}
          </a>
          <p className="text-xs text-muted-foreground mt-0.5">
            {published ? "Visible para cualquiera con el enlace." : "Borrador: el enlace da 404."}
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
                hint="Vacío deja el logotipo AprendoEnglish."
                value={get(cfg, "brand.headerText")}
                onChange={upd("brand.headerText")}
              />
              <FileField
                label="Logo"
                slug={demo.slug}
                kind="logo"
                value={get(cfg, "brand.logo")}
                onChange={upd("brand.logo")}
              />
              <FileField
                label="Icono de la barra superior"
                hint="Vacío usa la cabeza de la mascota."
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
                slug={demo.slug}
                kind="social"
                value={get(cfg, "meta.image")}
                onChange={upd("meta.image")}
              />
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
                hint="Vacío usa el acento."
                value={get(cfg, "colors.button")}
                onChange={upd("colors.button")}
              />
              <ColorField
                label="Ruedita de carga"
                hint="La que se ve al entrar a un mapa. Vacío usa el acento."
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
              <div className="space-y-1.5">
                <Label>Personaje</Label>
                <div className="grid gap-2 sm:grid-cols-2">
                  {[
                    {
                      id: "ozito",
                      name: "Ozzy el Osito 🐻",
                      note: "Por defecto. Capas SVG animadas por CSS.",
                    },
                    { id: "boti", name: "Boti 🤖", note: "El robot. Lo usa /democip." },
                  ].map((p) => {
                    const active = get(cfg, "mascot.pack", "ozito") === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => setCfg((c) => set(c, "mascot.pack", p.id))}
                        className={`text-left p-3 rounded-lg border transition ${
                          active ? "border-primary bg-accent" : "hover:bg-accent/50"
                        }`}
                      >
                        <div className="font-medium text-sm">{p.name}</div>
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
                label="Cómo se llama"
                hint="Vacío usa el nombre del pack. Aparece dentro de las lecciones."
                value={get(cfg, "mascot.name")}
                placeholder="Ozzy"
                onChange={upd("mascot.name")}
              />
              <Field
                label="Qué es"
                hint="«robot guía», «osito guía»…"
                value={get(cfg, "mascot.kind")}
                onChange={upd("mascot.kind")}
              />
              <Field
                label="Emoji"
                value={get(cfg, "mascot.emoji")}
                placeholder="🐻"
                onChange={upd("mascot.emoji")}
              />
            </TabsContent>

            <TabsContent value="textos" className="space-y-4">
              <Field
                label="Cómo se dirige al alumno"
                hint="Sustituye {{audience}} en todo el curso: «ingenier@», «estudiante»…"
                value={get(cfg, "copy.audience")}
                placeholder={DEFAULTS.copy.audience}
                onChange={upd("copy.audience")}
              />
              <hr />
              <Field
                label="Botón del panel de progreso"
                value={get(cfg, "copy.dashboardCta")}
                placeholder={DEFAULTS.copy.dashboardCta}
                onChange={upd("copy.dashboardCta")}
              />
              <Field
                label="Subtítulo de ese botón"
                value={get(cfg, "copy.dashboardCtaSub")}
                placeholder={DEFAULTS.copy.dashboardCtaSub}
                onChange={upd("copy.dashboardCtaSub")}
              />
              <hr />
              <p className="text-sm font-medium">Iconos</p>
              <p className="text-xs text-muted-foreground -mt-2">
                Un emoji, o la URL de una imagen.
              </p>
              <Field
                label="Racha"
                value={get(cfg, "icons.streak")}
                placeholder="🔥"
                onChange={upd("icons.streak")}
              />
              <Field
                label="Meta diaria"
                hint="Vacío conserva el anillo de progreso."
                value={get(cfg, "icons.goal")}
                placeholder="⏱"
                onChange={upd("icons.goal")}
              />
              <Field
                label="Panel de progreso"
                value={get(cfg, "icons.dashboard")}
                placeholder="📊"
                onChange={upd("icons.dashboard")}
              />
            </TabsContent>

            <TabsContent value="mapa" className="space-y-4">
              <p className="text-sm text-muted-foreground">
                El fondo del mapa de cada módulo. Lo que dejes vacío usa el de siempre.
              </p>
              {MODULE_LABELS.map((label, i) => (
                <FileField
                  key={i}
                  label={label}
                  slug={demo.slug}
                  kind={`mapa${i + 1}`}
                  value={get(cfg, `map.backgrounds.${i}`)}
                  onChange={(v: string) => {
                    const bgs = [
                      ...(get(cfg, "map.backgrounds", null) ?? [null, null, null, null, null]),
                    ];
                    bgs[i] = v || null;
                    setCfg((c) => set(c, "map.backgrounds", bgs.some(Boolean) ? bgs : ""));
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
            Guarda para ver los cambios aquí. Si acabas de guardar y no cambia, espera un momento y
            recarga: la página cachea su configuración un minuto.
          </p>
        </div>
      </div>
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

function ColorField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const valid = /^#[0-9a-fA-F]{6}$/.test(value ?? "");
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <input
          type="color"
          value={valid ? value : "#7C1C56"}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-12 rounded-md border cursor-pointer bg-transparent"
          aria-label={label}
        />
        <Input
          value={value ?? ""}
          placeholder="#7C1C56"
          onChange={(e) => onChange(e.target.value)}
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
}: {
  label: string;
  hint?: string;
  slug: string;
  kind: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="flex gap-2 items-center">
        {value && (
          <img
            src={value}
            alt=""
            className="h-9 w-9 object-contain rounded border bg-white shrink-0"
          />
        )}
        <Input
          value={value ?? ""}
          placeholder="URL, o sube un archivo →"
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
