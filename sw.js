const CACHE_NAME = 'sachin-portfolio-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './css/style.css',
  './js/scripts.js',
  './manifest.json',
  './assets/image/proffessional_photo.jpeg',
  './assets/image/icon-192.png',
  './assets/image/icon-512.png',
  './assets/Sachinkannan_RS.pdf'
];

// Install Service Worker and cache critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pre-caching offline shell');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate Service Worker and clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Clearing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch events interceptor
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Strategy: Stale-While-Revalidate for local assets and external resources (CDN styles/fonts)
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          // Verify valid response before caching
          if (networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch((err) => {
          console.warn('[Service Worker] Fetch failed, serving cached fallback if available:', err);
          // Return offline fallback for HTML requests if both fetch and cache fail
          if (event.request.headers.get('accept').includes('text/html')) {
            return cache.match('./index.html');
          }
        });

        // Return cached response immediately if we have it, otherwise wait for network
        return cachedResponse || fetchPromise;
      });
    })
  );
});
