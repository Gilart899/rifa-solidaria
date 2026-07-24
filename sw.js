/* ==========================================
   RIFA SOLIDÁRIA
   sw.js

   Service Worker PWA
========================================== */


"use strict";



const CACHE_NAME =

    "rifa-solidaria-v1";



const ARQUIVOS_CACHE = [


    "./",


    "./index.html",

    "./style.css",

    "./script.js",

    "./config.js",

    "./firebase.js",


    "./cartela.html",

    "./cartela.css",

    "./cartela.js",


    "./admin.html",

    "./admin.css",

    "./admin.js",


    "./raspadinha.html",

    "./raspadinha.css",

    "./raspadinha.js",


    "./comprovante.html",

    "./pdf.js",


    "./manifest.json",



    "./img/1783887880857.png",

    "./img/1784635553196.png",

    "./img/1784636629590.png",

    "./img/IMG-20260722-WA0037.jpg",

    "./img/IMG-20260722-WA0038.jpg"



];





/* ==========================================
   INSTALAÇÃO
========================================== */


self.addEventListener(

    "install",

    evento=>{


        evento.waitUntil(


            caches.open(

                CACHE_NAME

            )

            .then(

                cache=>{


                    return cache.addAll(

                        ARQUIVOS_CACHE

                    );


                }

            )


        );


        self.skipWaiting();


    }

);






/* ==========================================
   ATIVAÇÃO
========================================== */


self.addEventListener(

    "activate",

    evento=>{


        evento.waitUntil(


            caches.keys()

            .then(

                cachesAtuais=>{


                    return Promise.all(

                        cachesAtuais.map(

                            cache=>{


                                if(

                                    cache !== CACHE_NAME

                                ){

                                    return caches.delete(

                                        cache

                                    );

                                }


                            }

                        )

                    );


                }

            )


        );



        self.clients.claim();


    }

);






/* ==========================================
   BUSCA
========================================== */


self.addEventListener(

    "fetch",

    evento=>{


        evento.respondWith(


            caches.match(

                evento.request

            )

            .then(

                resposta=>{


                    return resposta

                    ||

                    fetch(

                        evento.request

                    );


                }

            )


        );


    }

);
