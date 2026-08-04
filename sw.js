/* NOSSO CONTROLE — Service Worker 2.1.4 */
const CACHE_NAME="nosso-controle-2.1.4";
const CORE=["./","./index.html?v=2.1.4","./styles.css?v=2.1.4","./app.js?v=2.1.4"];
self.addEventListener("install",event=>{
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then(cache=>Promise.allSettled(CORE.map(url=>cache.add(new Request(url,{cache:"reload"}))))));
});
self.addEventListener("activate",event=>{
  event.waitUntil(Promise.all([
    caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE_NAME).map(key=>caches.delete(key)))),
    self.clients.claim()
  ]));
});
self.addEventListener("fetch",event=>{
  const request=event.request;
  if(request.method!=="GET")return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin)return;
  if(request.mode==="navigate"){
    event.respondWith(fetch(request,{cache:"no-store"}).catch(()=>caches.match("./index.html?v=2.1.4")||caches.match("./")));
    return;
  }
  event.respondWith(fetch(request,{cache:"no-store"}).then(response=>{
    if(response&&response.ok){
      const copy=response.clone();
      caches.open(CACHE_NAME).then(cache=>cache.put(request,copy));
    }
    return response;
  }).catch(()=>caches.match(request,{ignoreSearch:true})));
});
