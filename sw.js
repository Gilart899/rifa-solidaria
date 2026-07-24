/* ==========================================================
   RIFA SOLIDÁRIA
   Service Worker
========================================================== */

const CACHE_NAME = "rifa-solidaria-v1.0.0";

const ASSETS = [

    "./",
    "./index.html",
    "./cartela.html",
    "./style.css",
    "./script.js",
    "./config.js",
    "./firebase.js",
    "./manifest.json",

    "./img/1783887880857.png",
    "./img/1784636629590.png",
    "./img/IMG-20260722-WA0037.jpg",
    "./img/IMG-20260722-WA0038.jpg",
    "./img/trevo.png",

    "./icons/icon-192.png",
    "./icons/icon-512.png"

];

/* ===========================
   INSTALAÇÃO
=========================== */

self.addEventListener("install", event => {

    event.waitUntil(

        caches.open(CACHE_NAME)

            .then(cache => cache.addAll(ASSETS))

            .then(() => self.skipWaiting())

    );

});

/* ===========================
   ATIVAÇÃO
=========================== */

self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys().then(keys =>

            Promise.all(

                keys.map(key => {

                    if (key !== CACHE_NAME) {

                        return caches.delete(key);

                    }

                })

            )

        ).then(() => self.clients.claim())

    );

});

/* ===========================
   FETCH
=========================== */

self.addEventListener("fetch", event => {

    if (event.request.method !== "GET") return;

    event.respondWith(

        caches.match(event.request)

            .then(cacheResponse => {

                if (cacheResponse) {

                    return cacheResponse;

                }

                return fetch(event.request)

                    .then(networkResponse => {

                        const clone = networkResponse.clone();

                        caches.open(CACHE_NAME)

                            .then(cache => {

                                cache.put(event.request, clone);

                            });

                        return networkResponse;

                    });

            })

            .catch(() => {

                if (event.request.mode === "navigate") {

                    return caches.match("./index.html");

                }

            })

    );

});
