var CACHE = 'cache-only';

self.addEventListener('install', function(evt) {
  console.log('The service worker is being installed.');
  evt.waitUntil(precache());
});

function precache() {
  return caches.open(CACHE).then(function (cache) {
    return cache.addAll([
      './',
      './index.html',
      './todo.js',
      './hammer.min.js',
      './todo.css',
      './burger.png',
      './HDburger.png',
      './FHDburger.png',
      'https://fonts.googleapis.com/css?family=Open+Sans:300,400&subset=cyrillic'
    ]);
  });
}

self.addEventListener('fetch', function(evt) {
  console.log('The service worker is serving the asset.');
  if(evt.request.url.search('woff') != -1 ){
  	evt.respondWith(fetch(evt.request));
  } else {
  	evt.respondWith(fromCache(evt.request));	
  }
});

function fromCache(request) {
  return caches.open(CACHE).then(function (cache) {
    return cache.match(request).then(function (matching) {
      return matching || Promise.reject('no-match');
    });
  });
}