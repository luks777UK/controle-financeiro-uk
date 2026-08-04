/*
  NOSSO CONTROLE -- Service Worker 2.1.1

  Rede primeiro para todos os arquivos principais.
  Cache somente quando a internet estiver indisponível.
*/

const CACHE_NAME = "nosso-controle-offline-2.1.1";

const OFFLINE_FILES = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js"
];

self.addEventListener("install", event => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      await Promise.allSettled(
        OFFLINE_FILES.map(path =>
          cache.add(
            new Request(path, { cache: "reload" })
          )
        )
      );
    })
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    Promise.all([
      caches.keys().then(names =>
        Promise.all(
          names
            .filter(name => name !== CACHE_NAME)
            .map(name => caches.delete(name))
        )
      ),
      self.clients.claim()
    ])
  );
});

self.addEventListener("message", event => {
  if(event.data?.type === "SKIP_WAITING"){
    self.skipWaiting();
  }
});

self.addEventListener("fetch", event => {
  const request = event.request;

  if(request.method !== "GET") return;

  const url = new URL(request.url);

  if(url.origin !== self.location.origin) return;

  const isNavigation =
    request.mode === "navigate";

  event.respondWith(
    fetch(request, { cache: "no-store" })
      .then(response => {
        if(response && response.ok){
          const copy = response.clone();

          caches.open(CACHE_NAME).then(cache => {
            const key = isNavigation
              ? "./index.html"
              : request;

            cache.put(key, copy);
          });
        }

        return response;
      })
      .catch(async () => {
        if(isNavigation){
          return (
            await caches.match("./index.html") ||
            await caches.match("./")
          );
        }

        return caches.match(
          request,
          { ignoreSearch: true }
        );
      })
  );
});
