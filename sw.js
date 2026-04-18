const CACHE_NAME = 'calendar-ortodox-v2';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  // Adăugăm și fișierul JSON extern la cache ca să meargă offline
  'https://azisespala.ro/data/holidays-2026.json' 
];

// Instalarea Service Worker-ului și salvarea fișierelor
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Fisiere salvate in cache');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

// Interceptarea cererilor (Folosim cache dacă nu e net)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Returnează varianta din memorie dacă există, altfel o descarcă de pe net
        return response || fetch(event.request).then((fetchResponse) => {
            return caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, fetchResponse.clone());
                return fetchResponse;
            });
        });
      })
      .catch(() => {
          // Aici se poate adăuga un mesaj dacă pică tot
      })
  );
});
