const CACHE = "tuner-v4";
const ASSETS = [
   "./",
   "./index.html",
   "./css/style.css",
   "./manifest.webmanifest",
   "./img/tuner-256x256.png",
   "./img/tuner-512x512.png",
];

self.addEventListener("install", (event) => {
   event.waitUntil(
      caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
   );
});

self.addEventListener("activate", (event) => {
   event.waitUntil(
      caches.keys().then((keys) =>
         Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      ).then(() => self.clients.claim())
   );
});

self.addEventListener("fetch", (event) => {
   const { request } = event;
   const requestUrl = new URL(request.url);
   const cacheableOrigins = new Set([self.location.origin, "https://esm.sh"]);

   // Cache only app resources and the pitch-detection dependency. Other
   // services, including the visit counter, must receive every request.
   if (request.method !== "GET" || !cacheableOrigins.has(requestUrl.origin)) {
      return;
   }

   // Network-first for navigations to always pick latest HTML
   if (request.mode === "navigate") {
      event.respondWith(
         fetch(request)
            .then((response) => {
               const copy = response.clone();
               caches.open(CACHE).then((cache) => cache.put(request, copy));
               return response;
            })
            .catch(() => caches.match(request))
      );
      return;
   }

   // Cache-first for static assets
   event.respondWith(
      caches.match(request).then((cached) => {
         if (cached) return cached;
         return fetch(request).then((response) => {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
            return response;
         });
      })
   );
});
