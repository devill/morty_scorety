const CACHE = 'scorety-v1';
const ASSETS = [
  './', './index.html', './manifest.json',
  ...['b1','b2','b3','b4','b5','b6','b7','b8',
      'ing_toadstool','ing_eyes','ing_cloud','ing_mandrake','scroll','sideA',
      'icon-192','icon-512',
      'sc_toadstool_I','sc_toadstool_II','sc_cloud_I','sc_cloud_II',
      'sc_eyes_I','sc_eyes_II','sc_mandrake_I','sc_mandrake_II']
    .map(n => `./art/${n}.png`),
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request)));
});
