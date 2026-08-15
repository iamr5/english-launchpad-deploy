import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { fetchDemos, isAdmin } from "@/lib/demos.data";
import {
  addDomain,
  addEmails,
  addInvite,
  createOrg,
  deleteOrg,
  fetchDomains,
  fetchInvites,
  fetchMemberCounts,
  fetchOrgs,
  matchProblem,
  orgSlugProblem,
  parseEmails,
  removeDomain,
  removeInvite,
  resyncMembers,
  saveOrg,
  suggestInviteCode,
  suggestOrgSlug,
  type OrgRow,
} from "@/lib/orgs.data";
import type { TablesUpdate } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

// El panel de instituciones: quién es cliente, con qué marca ve la app y cómo
// se asigna cada cuenta.
//
// Es el hermano de /demos y a propósito NO repite sus controles de marca. Un
// demo se pinta en /demos; aquí sólo se dice de qué demo hereda la app su
// aspecto. Duplicar los cien deslizadores del otro panel sería garantizar que
// los dos acaben discrepando.

export const Route = createFileRoute("/_authenticated/instituciones")({
  head: () => ({
    meta: [
      { title: "Instituciones — Aprendo English" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: Instituciones,
});

function Instituciones() {
  const qc = useQueryClient();
  const admin = useQuery({ queryKey: ["is-admin"], queryFn: isAdmin });
  const orgs = useQuery({ queryKey: ["orgs"], queryFn: fetchOrgs });
  const domains = useQuery({ queryKey: ["org-domains"], queryFn: fetchDomains });
  const invites = useQuery({ queryKey: ["org-invites"], queryFn: fetchInvites });
  const counts = useQuery({ queryKey: ["org-counts"], queryFn: fetchMemberCounts });
  const demos = useQuery({ queryKey: ["demos"], queryFn: fetchDemos });

  const [nuevo, setNuevo] = useState({ name: "", slug: "", brand_slug: "" });
  const [sel, setSel] = useState<string | null>(null);

  const refrescar = () => {
    qc.invalidateQueries({ queryKey: ["orgs"] });
    qc.invalidateQueries({ queryKey: ["org-domains"] });
    qc.invalidateQueries({ queryKey: ["org-invites"] });
    qc.invalidateQueries({ queryKey: ["org-counts"] });
  };

  const crear = useMutation({
    mutationFn: () =>
      createOrg({ name: nuevo.name.trim(), slug: nuevo.slug, brand_slug: nuevo.brand_slug }),
    onSuccess: (o) => {
      setNuevo({ name: "", slug: "", brand_slug: "" });
      setSel(o.id);
      refrescar();
      toast.success(`«${o.name}» creada.`);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const resync = useMutation({
    mutationFn: resyncMembers,
    onSuccess: (n) => {
      refrescar();
      toast.success(`${n} cuenta(s) reasignada(s) a su institución.`);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (admin.isLoading)
    return (
      <Marco>
        <p className="text-sm text-slate-500">Comprobando permisos…</p>
      </Marco>
    );

  if (!admin.data?.ok) {
    return (
      <Marco>
        <Card className="p-6">
          <h2 className="font-semibold mb-1">Sólo para administradores</h2>
          <p className="text-sm text-slate-600">
            {admin.data?.reason ?? "Esta cuenta no tiene el rol de administrador."}
            {admin.data?.email && (
              <>
                {" "}
                Entrando como <code>{admin.data.email}</code>.
              </>
            )}
          </p>
        </Card>
      </Marco>
    );
  }

  const problemaSlug = nuevo.slug ? orgSlugProblem(nuevo.slug) : null;

  return (
    <Marco>
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Instituciones</h1>
        <p className="text-sm text-slate-600 mt-1">
          Quién es cliente, con qué marca ve la app al iniciar sesión y cómo se asigna cada cuenta.
          El aspecto se diseña en{" "}
          <a className="underline" href="/demos">
            /demos
          </a>
          ; aquí sólo se elige de cuál se hereda.
        </p>
      </header>

      {/* ── Alta ────────────────────────────────────────────────────────── */}
      <Card className="p-5 mb-6">
        <h2 className="font-semibold mb-3">Nueva institución</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <Label className="text-xs">Nombre</Label>
            <Input
              value={nuevo.name}
              placeholder="Universidad Ejemplo"
              onChange={(e) => {
                const name = e.target.value;
                setNuevo((n) => ({
                  ...n,
                  name,
                  // El identificador se propone solo, pero deja de hacerlo en
                  // cuanto se toca a mano: si no, pisaría lo escrito.
                  slug: n.slug && n.slug !== suggestOrgSlug(n.name) ? n.slug : suggestOrgSlug(name),
                }));
              }}
            />
          </div>
          <div>
            <Label className="text-xs">Identificador</Label>
            <Input
              value={nuevo.slug}
              placeholder="universidad-ejemplo"
              onChange={(e) => setNuevo((n) => ({ ...n, slug: e.target.value.toLowerCase() }))}
            />
            {problemaSlug && <p className="text-xs text-red-600 mt-1">{problemaSlug}</p>}
          </div>
          <div>
            <Label className="text-xs">Hereda la marca de</Label>
            <select
              className="w-full h-9 px-3 border rounded-md text-sm bg-white"
              value={nuevo.brand_slug}
              onChange={(e) => setNuevo((n) => ({ ...n, brand_slug: e.target.value }))}
            >
              <option value="">— sin marca (aspecto de fábrica) —</option>
              {(demos.data ?? []).map((d) => (
                <option key={d.slug} value={d.slug}>
                  {d.institution} · /{d.slug}
                </option>
              ))}
            </select>
          </div>
        </div>
        <Button
          className="mt-3"
          disabled={!nuevo.name.trim() || !!problemaSlug || !nuevo.slug || crear.isPending}
          onClick={() => crear.mutate()}
        >
          {crear.isPending ? "Creando…" : "Crear"}
        </Button>
      </Card>

      {/* ── Listado ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-semibold">{orgs.data?.length ?? 0} institución(es)</h2>
        <Button
          variant="outline"
          size="sm"
          disabled={resync.isPending}
          onClick={() => resync.mutate()}
        >
          {resync.isPending ? "Reasignando…" : "Aplicar a las cuentas ya existentes"}
        </Button>
      </div>
      <p className="text-xs text-slate-500 mb-4">
        El padrón se aplica solo a quien se registre <strong>a partir de ahora</strong>. Si alguien
        ya tenía cuenta antes de que su correo estuviera en la lista, sigue como estaba hasta que
        pulses ese botón. No deshace las altas por código ni las hechas a mano.
      </p>

      {orgs.isLoading && <p className="text-sm text-slate-500">Cargando…</p>}
      {orgs.error && <p className="text-sm text-red-600">{(orgs.error as Error).message}</p>}

      <div className="space-y-3">
        {(orgs.data ?? []).map((o) => (
          <FilaOrg
            key={o.id}
            org={o}
            abierta={sel === o.id}
            onToggle={() => setSel(sel === o.id ? null : o.id)}
            miembros={counts.data?.[o.id] ?? 0}
            demos={(demos.data ?? []).map((d) => ({ slug: d.slug, institution: d.institution }))}
            dominios={(domains.data ?? []).filter((d) => d.org_id === o.id)}
            codigos={(invites.data ?? []).filter((i) => i.org_id === o.id)}
            onCambio={refrescar}
          />
        ))}
      </div>
    </Marco>
  );
}

function Marco({ children }: { children: React.ReactNode }) {
  return <div className="max-w-4xl mx-auto p-6">{children}</div>;
}

function FilaOrg({
  org,
  abierta,
  onToggle,
  miembros,
  demos,
  dominios,
  codigos,
  onCambio,
}: {
  org: OrgRow;
  abierta: boolean;
  onToggle: () => void;
  miembros: number;
  demos: { slug: string; institution: string }[];
  dominios: { match: string }[];
  codigos: { code: string; uses: number; max_uses: number }[];
  onCambio: () => void;
}) {
  const [dominio, setDominio] = useState("");
  const [codigo, setCodigo] = useState("");
  const [topeUsos, setTopeUsos] = useState(0);
  const [pegado, setPegado] = useState("");
  const [verTodos, setVerTodos] = useState(false);

  // Se analiza mientras se escribe para poder decir cuántas van a entrar ANTES
  // de pulsar: pegar mil líneas y descubrir después que la mitad no valía es
  // justo lo que no debe pasar.
  const previa = useMemo(() => parseEmails(pegado), [pegado]);
  const correos = dominios.filter((d) => d.match.includes("@"));

  const importar = useMutation({
    mutationFn: () => addEmails(org.id, pegado),
    onSuccess: (r) => {
      setPegado("");
      onCambio();
      const partes = [`${r.asignadas} correo(s) en ${org.name}`];
      if (r.movidas.length) partes.push(`${r.movidas.length} venía(n) de otra institución`);
      if (r.invalidas.length) partes.push(`${r.invalidas.length} descartado(s)`);
      toast.success(partes.join(" · "));
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const guardar = useMutation({
    mutationFn: (patch: TablesUpdate<"orgs">) => saveOrg(org.id, patch),
    onSuccess: () => {
      onCambio();
      toast.success("Guardado.");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const nuevoDominio = useMutation({
    mutationFn: () => addDomain(org.id, dominio),
    onSuccess: (m) => {
      setDominio("");
      onCambio();
      toast.success(`«${m}» asignado a ${org.name}.`);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const quitarDominio = useMutation({
    mutationFn: removeDomain,
    onSuccess: onCambio,
    onError: (e: Error) => toast.error(e.message),
  });

  const nuevoCodigo = useMutation({
    mutationFn: () => addInvite(org.id, codigo || suggestInviteCode(org.slug), topeUsos),
    onSuccess: () => {
      setCodigo("");
      setTopeUsos(0);
      onCambio();
      toast.success("Código creado.");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const quitarCodigo = useMutation({
    mutationFn: removeInvite,
    onSuccess: onCambio,
    onError: (e: Error) => toast.error(e.message),
  });

  const borrar = useMutation({
    mutationFn: () => deleteOrg(org.id),
    onSuccess: () => {
      onCambio();
      toast.success(`«${org.name}» eliminada.`);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const problemaDominio = dominio ? matchProblem(dominio) : null;

  return (
    <Card className="p-4">
      <button className="w-full flex items-center gap-3 text-left" onClick={onToggle} type="button">
        <span className="flex-1">
          <span className="font-semibold">{org.name}</span>
          <span className="text-xs text-slate-500 ml-2">/{org.slug}</span>
        </span>
        {!org.active && <Badge variant="secondary">de baja</Badge>}
        <Badge variant="outline">{miembros} cuenta(s)</Badge>
        <Badge variant="outline">
          {org.brand_slug ? `marca: /${org.brand_slug}` : "sin marca"}
        </Badge>
        <span className="text-slate-400 text-sm">{abierta ? "▲" : "▼"}</span>
      </button>

      {abierta && (
        <div className="mt-4 pt-4 border-t space-y-5">
          {/* Marca heredada */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label className="text-xs">Hereda la marca de</Label>
              <select
                className="w-full h-9 px-3 border rounded-md text-sm bg-white"
                value={org.brand_slug ?? ""}
                onChange={(e) => guardar.mutate({ brand_slug: e.target.value || null })}
              >
                <option value="">— sin marca (aspecto de fábrica) —</option>
                {demos.map((d) => (
                  <option key={d.slug} value={d.slug}>
                    {d.institution} · /{d.slug}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500 mt-1">
                Los colores, la mascota y los textos que ya se diseñaron en ese demo. Lo que se
                cambie allí se ve aquí en la siguiente recarga.
              </p>
            </div>
            <div className="flex items-end gap-3">
              <div className="flex items-center gap-2">
                <Switch
                  checked={org.active}
                  onCheckedChange={(v) => guardar.mutate({ active: v })}
                />
                <span className="text-sm">Activa</span>
              </div>
              <p className="text-[11px] text-slate-500 flex-1">
                De baja, sus cuentas siguen entrando pero con el aspecto de fábrica.
              </p>
            </div>
          </div>

          {/* El padrón: qué correos pertenecen a esta institución */}
          <div>
            <h3 className="text-sm font-semibold mb-1">
              Correos de esta institución
              <span className="ml-2 font-normal text-slate-500">
                {correos.length === 0 ? "ninguno" : `${correos.length}`}
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 mb-2">
              El padrón: quién pertenece a {org.name}. Pega la lista entera —de una hoja de cálculo,
              de un correo, como venga— y se dan de alta todas de una vez.
            </p>

            <Textarea
              value={pegado}
              onChange={(e) => setPegado(e.target.value)}
              rows={4}
              className="font-mono text-xs"
              placeholder={"ana.torres@cip.org.pe\nluis.perez@cip.org.pe\ncarmen@gmail.com"}
            />
            <div className="flex items-center gap-3 mt-2">
              <Button
                variant="outline"
                disabled={!previa.ok.length || importar.isPending}
                onClick={() => importar.mutate()}
              >
                {importar.isPending
                  ? "Dando de alta…"
                  : previa.ok.length
                    ? `Dar de alta ${previa.ok.length}`
                    : "Dar de alta"}
              </Button>
              {!!previa.bad.length && (
                <span className="text-xs text-amber-700">
                  {previa.bad.length} no parece{previa.bad.length > 1 ? "n" : ""} un correo — se
                  omitirá{previa.bad.length > 1 ? "n" : ""}
                </span>
              )}
            </div>

            {/* Un dominio entero, para quien tiene correo institucional */}
            <details className="mt-3">
              <summary className="text-xs text-slate-600 cursor-pointer">
                …o meter un dominio entero de golpe
              </summary>
              <p className="text-[11px] text-slate-500 mt-2 mb-2">
                <code>cip.org.pe</code> mete a <strong>cualquiera</strong> que se registre con ese
                dominio, sin tener que listarlo. Cómodo si toda la institución usa correo propio;
                peligroso si el dominio es compartido. Una dirección concreta del padrón manda sobre
                su dominio.
              </p>
              <div className="flex gap-2">
                <Input
                  value={dominio}
                  placeholder="cip.org.pe"
                  onChange={(e) => setDominio(e.target.value)}
                />
                <Button
                  variant="outline"
                  disabled={!dominio || !!problemaDominio || nuevoDominio.isPending}
                  onClick={() => nuevoDominio.mutate()}
                >
                  Añadir
                </Button>
              </div>
              {problemaDominio && <p className="text-xs text-red-600 mt-1">{problemaDominio}</p>}
            </details>

            {/* Lo que ya está dado de alta. Se enseñan unos pocos: un padrón de
                mil correos no cabe en pantalla ni hace falta verlo entero. */}
            {!!dominios.length && (
              <div className="flex flex-wrap gap-2 mt-3">
                {dominios.slice(0, verTodos ? undefined : 12).map((d) => (
                  <span
                    key={d.match}
                    className={`inline-flex items-center gap-1 text-xs rounded-full pl-3 pr-1 py-1 ${
                      d.match.includes("@") ? "bg-slate-100" : "bg-amber-100 text-amber-900"
                    }`}
                    title={d.match.includes("@") ? "" : "Dominio entero"}
                  >
                    {d.match.includes("@") ? "" : "@ "}
                    {d.match}
                    <button
                      type="button"
                      className="w-5 h-5 rounded-full hover:bg-slate-300"
                      onClick={() => quitarDominio.mutate(d.match)}
                      aria-label={`Quitar ${d.match}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
                {dominios.length > 12 && (
                  <button
                    type="button"
                    className="text-xs text-slate-600 underline"
                    onClick={() => setVerTodos(!verTodos)}
                  >
                    {verTodos ? "ver menos" : `ver los ${dominios.length}`}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Códigos */}
          <div>
            <h3 className="text-sm font-semibold mb-1">Códigos de alta</h3>
            <p className="text-[11px] text-slate-500 mb-2">
              Para quien se registra con un correo personal y por tanto no cae por dominio. Se le da
              el código y lo introduce una vez.
            </p>
            <div className="flex flex-wrap gap-2 mb-2">
              {codigos.length === 0 && (
                <span className="text-xs text-slate-400">Ninguno todavía.</span>
              )}
              {codigos.map((c) => (
                <span
                  key={c.code}
                  className="inline-flex items-center gap-1 text-xs bg-slate-100 rounded-full pl-3 pr-1 py-1 font-mono"
                >
                  {c.code}
                  <span className="text-slate-500 not-italic">
                    ({c.uses}/{c.max_uses || "∞"})
                  </span>
                  <button
                    type="button"
                    className="w-5 h-5 rounded-full hover:bg-slate-300"
                    onClick={() => quitarCodigo.mutate(c.code)}
                    aria-label={`Quitar ${c.code}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={codigo}
                placeholder={suggestInviteCode(org.slug)}
                onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                className="font-mono"
              />
              <Input
                type="number"
                min={0}
                value={topeUsos}
                onChange={(e) => setTopeUsos(Number(e.target.value))}
                className="w-28"
                title="0 = sin tope"
              />
              <Button
                variant="outline"
                disabled={nuevoCodigo.isPending}
                onClick={() => nuevoCodigo.mutate()}
              >
                Crear
              </Button>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              El número es el tope de usos. 0 = sin tope.
            </p>
          </div>

          <div className="pt-2 border-t">
            <Button
              variant="ghost"
              size="sm"
              className="text-red-600"
              disabled={borrar.isPending}
              onClick={() => {
                if (
                  confirm(
                    `¿Eliminar «${org.name}»? Sus ${miembros} cuenta(s) se quedan sin institución.`,
                  )
                ) {
                  borrar.mutate();
                }
              }}
            >
              Eliminar institución
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
