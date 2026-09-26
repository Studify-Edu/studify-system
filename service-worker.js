// ============================================================================
// Studify Service Worker - Offline-First Static Asset Caching
// ============================================================================
const CACHE_NAME = 'studify-cache-v122';
const STATIC_ASSETS = [
    './',
    './index.html',
    './assistant/index.html',
    './assistant/admin.html',
    './assistant/app.js',
    './assistant/style.css',
    './assistant/sounds.js',
    './admin/admin.html',
    './admin/admin.js',
    './admin/admin.css',
    './icon-192.png',
    './icon-512.png',
    './manifest.json',
    './assets/xlsx.full.min.js',
    './assets/sounds/scan.mp3',
    './assets/sounds/cash.mp3',
    './assets/sounds/achievement.mp3',
    './assets/sounds/warning.mp3',
    './assets/sounds/error.mp3',
    './assets/sounds/send.mp3',
    './assets/sounds/lock.mp3',
    './assets/sounds/menu.mp3',
    './assets/sounds/theme_day.mp3',
    './assets/sounds/theme_night.mp3',
    './assets/sounds/lang.mp3',
    './assets/sounds/key_type.mp3',
    './assets/sounds/key_delete.mp3',
    './assets/sounds/delete.mp3',
    './assets/sounds/tap.mp3',
    './assets/sounds/tab_switch.mp3',
    './assets/sounds/digital_pay.mp3',
    './assets/sounds/touch_tick.mp3',
    './assets/sounds/sync_start.mp3',
    './assets/sounds/sync_done.mp3',
    './assets/sounds/notif.mp3',
    './assets/sounds/vip.mp3',
    './assets/sounds/status_normal.mp3',
    './assets/sounds/status_warn.mp3',
    './assets/sounds/globe.mp3',
    './assets/sounds/page_attendance.mp3',
    './assets/sounds/page_students.mp3',
    './assets/sounds/page_syllabus.mp3',
    './assets/sounds/sound_unmute.wav',
    './assets/sounds/sound_mute.wav'
];

// Install: Cache all core static assets
self.addEventListener('install', (event) => {
    console.log('[ServiceWorker] Installing & caching static assets...');
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        })
    );
});

// Activate: Clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[ServiceWorker] Activated');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        }).then(() => {
            return self.clients.claim(); // Take control of all pages
        })
    );
});

// Fetch: Network-first strategy for local static code assets to ensure updates load immediately
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    if (event.request.method !== 'GET') return;
    if (url.hostname.includes('firebase') || 
        url.hostname.includes('supabase') ||
        url.hostname.includes('googleapis') || 
        url.hostname.includes('gstatic') ||
        url.hostname.includes('google.com') ||
        url.hostname.includes('cdn.jsdelivr.net') ||
        url.hostname.includes('cdnjs.cloudflare.com')) {
        return;
    }

    event.respondWith(
        fetch(event.request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
                const responseClone = networkResponse.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseClone);
                });
            }
            return networkResponse;
        }).catch(() => {
            return caches.match(event.request);
        })
    );
});
