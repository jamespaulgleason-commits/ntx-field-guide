/*
  sw.js - offline cache for the Texas Peace Officer Field Guide.

  CURRENT SCOPE: webpage + offline caching only. manifest.json and icons/
  are deliberately NOT precached here because this deploy doesn't include
  them yet (no "Add to Home Screen" install experience for now — that's
  deferred, not abandoned). cache.addAll() below is atomic: if any single
  listed file 404s, the WHOLE install step fails and NOTHING gets cached.
  So this list must only contain files that actually exist in the deploy.
  When manifest.json + icons/ are added back for the mobile-install piece,
  add them back to CORE_ASSETS and bump CACHE_VERSION.

  Strategy: cache-first with a background refresh (stale-while-revalidate).
  The whole app is one self-contained HTML file (all statute/case/ordinance
  data is embedded, no API calls), so precaching that one file plus the
  self-hosted fonts, semantic-search library, and model is enough for full
  offline use.

  TO PUBLISH AN UPDATE: bump CACHE_VERSION below. Old caches are purged on
  the next activate, so this is the whole update mechanism for the PWA —
  no build step needs to touch this file itself, just the version string.
*/
const CACHE_VERSION = "fieldguide-v42";

const CORE_ASSETS = [
  "./index.html",
  "./sem-worker.js",
  "./fonts/spectral-500.ttf",
  "./fonts/spectral-600.ttf",
  "./fonts/public-sans-400.ttf",
  "./fonts/public-sans-500.ttf",
  "./fonts/public-sans-600.ttf",
  "./fonts/ibm-plex-mono-400.ttf",
  "./fonts/ibm-plex-mono-500.ttf",
  "./vendor/transformers.min.js",
  // Only the SIMD build is reachable on a standard (non-cross-origin-isolated)
  // Pages deploy: the -threaded variants need SharedArrayBuffer and plain
  // non-SIMD is a pre-2021 fallback, so those three .wasm files were dropped.
  "./vendor/ort-wasm-simd.wasm",
  "./models/Xenova/all-MiniLM-L6-v2/config.json",
  "./models/Xenova/all-MiniLM-L6-v2/tokenizer.json",
  "./models/Xenova/all-MiniLM-L6-v2/tokenizer_config.json",
  "./models/Xenova/all-MiniLM-L6-v2/onnx/model_quantized.onnx"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      const networkFetch = fetch(event.request)
        .then(response => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_VERSION).then(cache => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => cached); // offline and not cached: nothing more we can do

      // Serve cached immediately if we have it (fast + works offline);
      // still fetch in the background to keep the cache fresh for next time.
      return cached || networkFetch;
    })
  );
});
