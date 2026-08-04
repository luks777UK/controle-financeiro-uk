/*
  NOSSO CONTROLE -- Service Worker 2.1.0

  Estratégia:
  - HTML, app.js, CSS e sw.js: rede primeiro.
  - Cache somente como alternativa offline.
  - Ativação imediata de novas versões.
*/

const CACHE_NAME = "nosso-controle-shell-2.1.0";

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
          cache.add(new Request(path, { cache: "reload" }))
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

  /*
    Não interfere no Supabase, APIs, autenticação
    ou recursos de outros domínios.
  */
  if(url.origin !== self.location.origin) return;

  const isNavigation = request.mode === "navigate";
  const isCoreFile =
    url.pathname.endsWith("/") ||
    url.pathname.endsWith("/index.html") ||
    url.pathname.endsWith("/app.js") ||
    url.pathname.endsWith("/styles.css") ||
    url.pathname.endsWith("/sw.js");

  if(isNavigation || isCoreFile){
    event.respondWith(
      fetch(request, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache"
        }
      })
        .then(response => {
          if(response && response.ok){
            const copy = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              const key = isNavigation ? "./index.html" : request;
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

          return caches.match(request, { ignoreSearch: true });
        })
    );
    return;
  }

  /*
    Outros arquivos locais: rede primeiro,
    cache apenas quando estiver offline.
  */
  event.respondWith(
    fetch(request)
      .then(response => {
        if(response && response.ok){
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, copy);
          });
        }
        return response;
      })
      .catch(() =>
        caches.match(request, { ignoreSearch: true })
      )
  );
});
