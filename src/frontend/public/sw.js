const CACHE_NAME = 'civic-pulse-map-cache-v1';
const MAP_TILE_ORIGINS = [
  'tile.openstreetmap.org',
  'unpkg.com'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Bypass Cache for API requests to keep complaint data, votes, and status 100% fresh
  if (
    url.pathname.includes('/complaints') ||
    url.pathname.includes('/wards') ||
    url.pathname.includes('/auth') ||
    url.pathname.includes('/admin') ||
    event.request.method !== 'GET'
  ) {
    return;
  }

  // Cache static map tiles and Leaflet assets for instant map reload
  const isMapAsset = MAP_TILE_ORIGINS.some((origin) => url.hostname.includes(origin));

  if (isMapAsset) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }

        try {
          const networkResponse = await fetch(event.request);
          if (networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        } catch (err) {
          return cachedResponse || new Response('Tile unavailable offline', { status: 503 });
        }
      })
    );
  }
});
