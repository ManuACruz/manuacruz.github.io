// Offline support for "Add to Home Screen" (GDD 6). Registered only from
// production builds (see main.js).
//
//   the page      network first, so a new version shows up on the next
//                 launch; its files (bundle, styles, fonts, lazy chunks) are
//                 cached BEFORE the new page is, so the cache never holds a
//                 page whose bundle it lacks (a white screen offline). Then
//                 hashed files the new page no longer uses are deleted.
//   assets/       hashed names never change: cache first, no re-download.
//   the rest      voices, sound effects, icons, manifest: served from the
//                 cache and refreshed in the background.

const CACHE = 'papepi-v1';
const OURS = /^(papepi|facepaint)-/; // this game's caches, old name included (the site's other games keep theirs)
const PRECACHE = ['./', './index.html', './manifest.webmanifest', './voices/index.json'];
const SHELL = new URL('./', self.location).href;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => OURS.test(k) && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

const ASSET_RE = /assets\/[\w.\-]+\.(?:js|css|woff2?)/g;
const NAME_RE = /[\w.\-]+\.(?:js|css|woff2?)/g;

/** Absolute URLs of the hashed files a text names (as "assets/x" or as a bare "x"). */
function assetsIn(text, base, bare = false) {
  const found = new Set();
  for (const m of text.match(ASSET_RE) || []) found.add(new URL(m, base).href);
  if (bare) {
    // inside a bundle or a stylesheet, siblings are named relative to assets/
    for (const m of text.match(NAME_RE) || []) if (/-[\w-]{6,}\.(js|css|woff2?)$/.test(m)) found.add(new URL(m, base).href);
  }
  return found;
}

/** Cache a freshly fetched page with everything it needs, then drop what it no longer uses. */
async function adoptPage(cache, html) {
  const keep = assetsIn(html, SHELL);
  // one level down: the bundle names its lazy chunks, the stylesheet its fonts
  for (const url of [...keep]) {
    let res = await cache.match(url);
    if (!res) {
      res = await fetch(url);
      if (!res.ok) throw new Error(`sw: ${url} -> ${res.status}`);
      await cache.put(url, res.clone());
    }
    for (const sub of assetsIn(await res.text(), url, true)) keep.add(sub);
  }
  for (const url of keep) {
    if (await cache.match(url)) continue;
    const res = await fetch(url);
    if (res.ok) await cache.put(url, res);
  }
  // only now is the new page safe to serve offline
  await cache.put(SHELL, new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } }));
  for (const req of await cache.keys()) {
    if (/\/assets\//.test(new URL(req.url).pathname) && !keep.has(req.url)) await cache.delete(req);
  }
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (req.mode === 'navigate') {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE);
        try {
          const res = await fetch(req);
          if (res.ok) {
            const html = await res.clone().text();
            event.waitUntil(adoptPage(cache, html).catch(() => {}));
          }
          return res;
        } catch {
          return (await cache.match(SHELL)) || (await cache.match('./index.html')) || Response.error();
        }
      })()
    );
    return;
  }

  if (/\/assets\//.test(url.pathname)) {
    event.respondWith(
      caches.open(CACHE).then(async (cache) => {
        const cached = await cache.match(req);
        if (cached) return cached;
        try {
          const res = await fetch(req);
          if (res.ok) cache.put(req, res.clone());
          return res;
        } catch {
          return Response.error();
        }
      })
    );
    return;
  }

  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(req);
      const refresh = fetch(req)
        .then((res) => {
          if (res && res.ok) cache.put(req, res.clone());
          return res;
        })
        .catch(() => null);
      if (cached) {
        event.waitUntil(refresh); // stale-while-revalidate
        return cached;
      }
      return (await refresh) || Response.error();
    })
  );
});
