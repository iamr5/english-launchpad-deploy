import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import {
  createDemo,
  deleteDemo,
  fetchDemos,
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
          <Tabs defaultValue="marca">
            <TabsList className="mb-4">
              <TabsTrigger value="marca">Marca</TabsTrigger>
              <TabsTrigger value="colores">Colores</TabsTrigger>
              <TabsTrigger value="mascota">Mascota</TabsTrigger>
              <TabsTrigger value="textos">Textos</TabsTrigger>
              <TabsTrigger value="mapa">Mapa</TabsTrigger>
            </TabsList>

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
                  Para crear otra mascota, parte de la plantilla:{" "}
                  <a
                    className="underline"
                    href="/demo-assets/mascots/ozito/preview.html"
                    target="_blank"
                    rel="noreferrer"
                  >
                    ver Ozito
                  </a>{" "}
                  · instrucciones en <code>demo-assets/mascots/ozito/README.md</code>
                </p>
              </div>
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
              src={`${url}?p=${previewKey}`}
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
