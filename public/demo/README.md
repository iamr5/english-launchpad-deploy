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
  animated "Busi" mascot, and text-to-speech (browser `speechSynthesis`).
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
- `rive.js`, `rive_wasm.js`, `busi_act_riv.js` — Rive runtime, wasm (data URL), and
  the Busi `.riv` animation (base64). The mascot is bundled here, so no separate
  `.riv` file is needed.
- `data.js`, `data_modulo3.js`, `data_modulo4.js`, `data_modulo5.js` — course content.
- `*.png`, `*.svg` — icons, logos, and the `modulebg1..5.png` module backdrops.
