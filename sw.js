/*
  NOSSO CONTROLE -- Service Worker v1.1.7
  Prioriza sempre a versão mais recente da internet.
  O cache fica apenas como alternativa quando estiver offline.
*/

const CACHE_NAME = "nosso-controle-v1.1.7";

const OFFLINE_FILES = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js"
];

self.addEventListener("install", (event) => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Não impede a instalação caso algum arquivo falhe.
      await Promise.allSettled(
        OFFLINE_FILES.map((url) =>
          cache.add(new Request(url, { cache: "reload" }))
        )
      );
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((names) =>
        Promise.all(
          names
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        )
      ),
      self.clients.claim()
    ])
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Não interfere em Supabase, APIs ou arquivos de outros domínios.
  if (url.origin !== self.location.origin) return;

  // HTML/navegação: tenta sempre buscar a versão atual.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request, { cache: "no-store" })
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) =>
            cache.put("./index.html", copy)
          );
          return response;
        })
        .catch(async () => {
          return (
            (await caches.match("./index.html")) ||
            (await caches.match("./"))
          );
        })
    );
    return;
  }

  // JS, CSS e demais arquivos locais: rede primeiro, cache só offline.
  event.respondWith(
    fetch(request, { cache: "no-store" })
      .then((response) => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) =>
            cache.put(request, copy)
          );
        }
        return response;
      })
      .catch(() =>
        caches.match(request, { ignoreSearch: true })
      )
  );
});
