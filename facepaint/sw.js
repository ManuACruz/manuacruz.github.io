// This game moved to /tapabu/facepaint/. This worker replaces the old offline
// cache: it clears it, unregisters itself and reloads open pages, which then
// reach the redirect in index.html.

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Caches are shared by the whole site (and the moved game uses the same
      // cache name), so only drop entries that live under this old folder.
      const oldScope = self.registration.scope;
      for (const key of await caches.keys()) {
        const cache = await caches.open(key);
        for (const req of await cache.keys()) {
          if (req.url.startsWith(oldScope)) await cache.delete(req);
        }
      }
      await self.registration.unregister();
      const clients = await self.clients.matchAll({ type: 'window' });
      for (const client of clients) client.navigate(client.url);
    })()
  );
});
