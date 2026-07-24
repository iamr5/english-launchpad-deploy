# super_english

Standalone build of the "Inglés para moverte" English course — extracted from the
Turuta Flutter app's `assets/ingles_web/` so it runs on its own with no app, no
backend, and no auth. Plain static HTML/CSS/JS; no build step, no npm, no framework.

## Run it

Either one works:

- **Double-click `index.html`** — opens in your browser. Everything (the Rive
  mascot runtime + wasm, the course data, all images) is bundled locally, so it
  works over `file://` with no server.
- **Serve it locally** (recommended, avoids any `file://` quirks):

  ```sh
  # from this folder
  python -m http.server 8000
  # then open http://localhost:8000
  ```

## What it does

- Full course: 5 modules, all microlecciones, mini-quizzes, final quizzes, the
  animated **"Boti"** mascot, and text-to-speech (browser `speechSynthesis`).
- **Progress is saved in the browser** via `localStorage` (key
  `ingles_web_progress_v1`). It persists per browser/device; there is no account.
- Floating **debug buttons** (bottom-right): complete a lesson, reset all
  progress, undo the last quiz. To hide them for an end-user demo, remove the
  `document.body.classList.add('debug-fabs');` line near the bottom of
  `index.html`.

## What was removed from the Turuta version

The only coupling to the Flutter host was `window.AppBridge` — used solely by the
entry screen's back button to exit the native WebView. That bridge and the exit
button were removed; every other back button navigates in-page. Unused/dev-only
assets (`path_prototype.html`, `book.svg`, `chestc.svg`, `chesto.svg`,
`completed_2.png`, `forward.svg`, `lock.png`) were left behind.

## Adding auth / a backend later

Progress read/write is centralized in `loadProgress()` / `saveProgress()` in
`index.html`. To sync to Firebase (or anything else), swap those two functions to
read from / write to your store instead of `localStorage` — the rest of the app
calls only through them.

## Files

- `index.html` — the whole app (markup, styles, logic).
- `Prototipo_Ingles.html` — the family/teacher tracking dashboard (standalone page).
- `boti.js` — the **Boti** mascot: the SVG plus a small spring-based animation
  engine, in one self-contained file. No network, no build, no dependencies.
  Mount it on any empty element and size that element with CSS:

  ```html
  <div style="width:120px;height:180px" data-boti='{"interactive":true}'></div>
  <script src="boti.js"></script>
  <script>Boti.mountAll();</script>
  ```

  Or imperatively: `const b = Boti.mount('#slot', { interactive: true });` then
  `b.react()` (hop + wink), `b.blink(true)`, `b.setIntensity(0.5)`, `b.pause()`.
  Keep the container's aspect ratio at **height = width × 1.504** (artboard
  757.6 × 1139.5) so Boti isn't squashed. Both `index.html` and
  `Prototipo_Ingles.html` load this same file, so the mascot is literally the
  same character in the app and in the dashboard.
- `boti_head.svg` — Boti's head only, used as the app-bar icon.
- `rive.js`, `rive_wasm.js`, `busi_act_riv.js`, `head.svg`/`body.svg`/`*arm.svg`/
  `*leg.svg`/`bowtie.svg`/`glasses.svg`/`tummy.svg`/`div.svg`, `head.png`,
  `turuta-bear-animated_1.html`, `TuRuta Bear.html` — leftovers from the previous
  Rive/bear mascots. Nothing references them any more; safe to delete.
- `data.js`, `data_modulo3.js`, `data_modulo4.js`, `data_modulo5.js` — course content.
- `*.png`, `*.svg` — icons, logos, and the `modulebg1..5.png` module backdrops.
