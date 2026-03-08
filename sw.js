/* =======================================================
   WATER JUG TRIALS — Service Worker
   Caches all game files for offline play.
   ======================================================= */

const CACHE_NAME = 'water-jug-trials-v1';

const FILES_TO_CACHE = [
    './',
    './index.html',
    './manual_mode.html',
    './ai_mode.html',
    './landing.css',
    './landing.js',
    './css/game-base.css',
    './css/game-controls.css',
    './css/game-jugs.css',
    './css/game-ai-panel.css',
    './css/game-modals.css',
    './animations.js',
    './operations.js',
    './sounds.js',
    './state.js',
    './drag.js',
    './ai_bfs.js',
    './background_image.png',
    './tap_image.png',
    './icon-512.png'
];

/* ---- INSTALL: cache all files ---- */
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(FILES_TO_CACHE))
            .then(() => self.skipWaiting())
    );
});

/* ---- ACTIVATE: clean old caches ---- */
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
            )
        ).then(() => self.clients.claim())
    );
});

/* ---- FETCH: serve from cache, fall back to network ---- */
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(cached => cached || fetch(event.request))
    );
});
