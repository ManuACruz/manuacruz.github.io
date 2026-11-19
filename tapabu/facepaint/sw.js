// Papepi moved from /tapabu/facepaint/ to /tapabu/papepi/. This worker
// replaces the old offline cache: it clears what lives under this old folder,
// unregisters itself and reloads open pages, which then reach the redirect
// in index.html. Saves are kept: they belong to the whole site.

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Caches are shared by the whole site, so only drop entries that live
      // under this old folder.
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
