// Offline support for "Add to Home Screen" (GDD 6). Same-origin GET requests
// are served cache-first and refreshed in the background; anything fetched
// once (index, hashed bundles, audio, icons) keeps working offline.
// Registered only from production builds (see main.js).

const CACHE = 'lightup-v2';
const PRECACHE = ['./', './index.html', './manifest.webmanifest'];

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
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // The page itself (and the manifest / worker) is fetched network-first so
  // a new build shows up on the very next online load; the hashed bundles
  // it references never change, so those stay cache-first.
  const isShell = req.mode === 'navigate' || /\/(index\.html|manifest\.webmanifest|sw\.js)?$/.test(url.pathname);

  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(req);
      const refresh = fetch(req)
        .then((res) => {
          if (res && res.ok) cache.put(req, res.clone());
          return res;
        })
        .catch(() => null);

      if (cached && !isShell) {
        event.waitUntil(refresh); // stale-while-revalidate for assets
        return cached;
      }
      const fresh = await refresh;
      if (fresh) return fresh;
      if (cached) return cached; // offline: last known page
      if (req.mode === 'navigate') {
        const shell = await cache.match('./index.html');
        if (shell) return shell;
      }
      return Response.error();
    })
  );
});
