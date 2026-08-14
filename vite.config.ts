// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import fs from "node:fs";
import path from "node:path";
import { loadEnv } from "vite";
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Load all (non-VITE_) env vars into process.env for server-side code only.
const serverEnv = loadEnv(process.env.NODE_ENV || "development", process.cwd(), "");
Object.assign(process.env, serverEnv);

// El contenido del curso son scripts de navegador (definen COURSE_DATA y
// window.PLACEMENT_ITEMS). Se evalúan AQUÍ, en build, y se emiten como JSON:
// el runtime de producción (Cloudflare Workers) prohíbe `new Function`, así que
// evaluarlos en caliente hacía fallar /api/course/bundle con un 500.
function courseContentPlugin() {
  const VIRTUAL = "virtual:course-content";
  const RESOLVED = "\0" + VIRTUAL;
  const files = [
    "data.js",
    "data_modulo3.js",
    "data_modulo4.js",
    "data_modulo5.js",
    "placement_items.js",
    // Banco de práctica: ejercicios extra por bloque de teoría. Se cargan aquí
    // por lo mismo que el curso — el runtime de Workers no evalúa código suelto.
    "practice_bank_m1m2.js",
    "practice_bank_m3.js",
    "practice_bank_m4.js",
    "practice_bank_m5.js",
  ];

  return {
    name: "course-content",
    resolveId(id: string) {
      return id === VIRTUAL ? RESOLVED : undefined;
    },
    load(this: { addWatchFile: (f: string) => void }, id: string) {
      if (id !== RESOLVED) return undefined;
      const dir = path.resolve(import.meta.dirname, "src/content");
      const src = files
        .map((f) => {
          const p = path.join(dir, f);
          this.addWatchFile(p);
          return fs.existsSync(p) ? fs.readFileSync(p, "utf8") : "";
        })
        .join("\n;\n");
      const run = new Function(
        "window",
        `${src}\n;return { course: typeof COURSE_DATA !== "undefined" ? COURSE_DATA : window.COURSE_DATA, placement: window.PLACEMENT_ITEMS || [], practice: window.PRACTICE_BANK || {} };`,
      );

      const out = run({}) as { course?: { modules?: unknown[] } };
      if (!out?.course?.modules?.length) {
        throw new Error("El contenido del curso no se pudo evaluar en build.");
      }
      return `export default ${JSON.stringify(out)};`;
    },
  };
}

// La biblioteca de vocabulario. Mismo motivo que el curso: son scripts de
// navegador (definen window.VOCAB_GENERAL y window.VOCAB_PACKS) y se evalúan
// aquí, en build, porque Workers no permite `new Function` en caliente.
function vocabContentPlugin() {
  const VIRTUAL = "virtual:vocab-content";
  const RESOLVED = "\0" + VIRTUAL;
  const files = ["general.js", "packs.js"];

  return {
    name: "vocab-content",
    resolveId(id: string) {
      return id === VIRTUAL ? RESOLVED : undefined;
    },
    load(this: { addWatchFile: (f: string) => void }, id: string) {
      if (id !== RESOLVED) return undefined;
      const dir = path.resolve(import.meta.dirname, "src/content/vocab");
      const src = files
        .map((f) => {
          const p = path.join(dir, f);
          this.addWatchFile(p);
          return fs.existsSync(p) ? fs.readFileSync(p, "utf8") : "";
        })
        .join("\n;\n");
      const run = new Function(
        "window",
        `${src}\n;return { general: window.VOCAB_GENERAL || [], packs: window.VOCAB_PACKS || {} };`,
      );
      return `export default ${JSON.stringify(run({}))};`;
    },
  };
}

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    plugins: [courseContentPlugin(), vocabContentPlugin()],
    resolve: {
      alias: {
        "entities/lib/decode.js": path.resolve(
          import.meta.dirname,
          "node_modules/entities/lib/decode.js",
        ),
        "entities/lib/encode.js": path.resolve(
          import.meta.dirname,
          "node_modules/entities/lib/encode.js",
        ),
        entities: path.resolve(import.meta.dirname, "node_modules/entities"),
      },
    },
  },
});

