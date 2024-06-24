'use strict';

const CACHE_NAME = 'quitanda-app-v1';

const FILES_TO_CACHE = [
    'images/icons/152.png',
    'images/icons/144.png',
    'images/favicon.ico',
    'images/bg2.jpg',
    'images/logo.png',
    'images/offline.png',
    'js/bootstrap.bundle.min.js',
    'js/app.js',
    'css/bootstrap.min.css',
    'css/styles.css',
    'offline.html'
];

//Instalação do Service Worker e gero o cache estático
self.addEventListener('install', (evt) => {

    console.log("[Service Worker] Instalando....");

    evt.waitUntil(

            caches.open(CACHE_NAME).then((cache) => {

                console.log("[Service Worker] Fazendo cache dos arquivos da aplicação - estáticos");
                return cache.addAll(FILES_TO_CACHE);
            })

    );

    self.skipWaiting();

});

//Ativação Service Worker e Definir a pagina offline

self.addEventListener('activate', (evt) => {

    console.log("[Service Worker] Ativando....");

    evt.waitUntil(

        caches.keys().then((keylist) => {

            return Promise.all(keylist.map((key) => {

                if(key !== CACHE_NAME){
                    return caches.delete(key);
                }
            }));

        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (evt) =>{

    if(evt.request.mode !== 'navigate'){

        return;
    }
    evt.respondWith(

        fetch(evt.request).catch(() => {
                return caches.open(CACHE_NAME).then((cache) => {
                    return cache.match('offline.html');
                });
        })

    );

});