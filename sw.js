/* NOSSO CONTROLE — Service Worker 2.1.1 */
const CACHE_NAME="nosso-controle-2.1.1";
const CORE=["./","./index.html","./styles.css?v=2.1.1","./app.js?v=2.1.1"];
self.addEventListener("install",e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE_NAME).then(c=>Promise.allSettled(CORE.map(u=>c.add(new Request(u,{cache:"reload"}))))))});
self.addEventListener("activate",e=>{e.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))),self.clients.claim()]))});
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET")return;const u=new URL(r.url);if(u.origin!==self.location.origin)return;e.respondWith(fetch(r,{cache:"no-store"}).then(res=>{if(res&&res.ok){const copy=res.clone();caches.open(CACHE_NAME).then(c=>c.put(r,copy))}return res}).catch(()=>caches.match(r,{ignoreSearch:true}).then(x=>x||caches.match("./index.html"))))});
