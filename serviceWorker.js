const CACHE_STATIC_NAME = "static-v1";
const CACHE_INMUTABLE_NAME = "inmutable-v1";
const CACHE_DINAMYC_NAME = "dinamyc-v1";

function cleanCache(cacheName, sizeItems) {
  caches.open(cacheName).then((cache) => {
    cache.keys().then((keys) => {
      if (keys.length >= sizeItems) {
        cache.delete(keys[0]).then(() => {
          cleanCache(cacheName, sizeItems);
        });
      }
    });
  });
}

self.addEventListener("install", (event) => {
  const promiseCache = caches.open(CACHE_STATIC_NAME).then((cache) => {
    return cache.addAll([
      "./",
      "./index.html",
      "./js/app.js",
      "./manifest.json",
      "./images/noticia4.png",
      "./images/noticia3.png",
      "./images/noticia2.png",
      "./images/noticia1.png",
       "./images/icons/android-launchericon-72-72.png",
      "./images/icons/android-launchericon-512-512.png",
      "./images/icons/android-launchericon-144-144.png",
      "./images/icons/android-launchericon-192-192.png",
      "./images/icons/android-launchericon-48-48.png",
      "./images/icons/android-launchericon-96-96.png",
    ]);
  });

  const immutablePromise = caches
    .open(CACHE_INMUTABLE_NAME)
    .then((cacheInmutable) => {
      return cacheInmutable.addAll([
        "./css/bootstrap.min.css",
        "https://code.jquery.com/jquery-3.5.1.min.js",
        "https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/js/bootstrap.bundle.min.js",    
      ]);
    });
  event.waitUntil(Promise.all([promiseCache, immutablePromise]));
});

self.addEventListener("fetch", (event) => {
  const respuestaCache = caches.match(event.request).then((resp) => {
    if (resp) {
      return resp;
    }
    console.log("No esta en cache ", event.request.url);

    return fetch(event.request).then((respNet) => {
      caches.open(CACHE_DINAMYC_NAME).then((cache) => {
        cache.put(event.request, respNet).then(() => {
          cleanCache(CACHE_DINAMYC_NAME, 4);
        });
      });

      return respNet.clone();
    });
  });
  event.respondWith(respuestaCache);
});
