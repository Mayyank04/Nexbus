/**
 * @file sw.js
 * @description NEXBUS Service Worker providing offline caching, asset persistence, and PWA resilience.
 */

const PREVIOUS_CACHE = 'nexbus-offline-v1';
const CACHE_NAME = 'nexbus-offline-v2';
const PRECACHE_URLS = [
  '/',
  '/twin',
  '/journey',
  '/simulate',
  '/control',
  '/methodology',
  '/about',
  '/terms',
  '/privacy',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/nexbus-icon.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
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
  const request = event.request;
  const url = new URL(request.url);

  // Skip non-GET requests, chrome-extension schemes, and foreign origins (Cache Poisoning Defense)
  if (request.method !== 'GET' || !url.protocol.startsWith('http') || url.origin !== self.location.origin) {
    return;
  }

  // API Requests: Network-First with graceful degraded offline fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request).catch(async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        return new Response(
          JSON.stringify({
            success: false,
            degraded: true,
            offline: true,
            evidenceClassification: 'UNAVAILABLE',
            freshnessStatus: 'UNAVAILABLE',
            error: 'OFFLINE_DEGRADATION',
            message: 'Device is offline. Live external transit telemetry is paused.',
            timestamp: new Date().toISOString(),
          }),
          {
            headers: {
              'Content-Type': 'application/json',
              'X-Nexbus-Degraded': 'true',
              'X-Nexbus-Offline': 'true',
              'X-Nexbus-Evidence-Classification': 'UNAVAILABLE',
              'Cache-Control': 'no-store, no-cache',
            },
            status: 200,
          }
        );
      })
    );
    return;
  }

  // Navigation requests: Network-First with cache fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          return caches.match('/');
        })
    );
    return;
  }

  // Static Assets: Cache-First
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;
      return fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
        }
        return networkResponse;
      });
    })
  );
});
