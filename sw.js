
const C="rifa-gilfest-v1";self.addEventListener("install",e=>e.waitUntil(caches.open(C).then(c=>c.addAll(["./","./index.html","./cartela.html","./style.css"]))));self.addEventListener("fetch",e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))))
