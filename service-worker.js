const CACHE_NAME = 'touch-game-v1';
const urlsToCache = [
  'index.html',
  'game.html',
  'style.css',
  'script.js',
  'pop_1.wav',
  'pop_2.wav',
  'icon.png',
  'manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
