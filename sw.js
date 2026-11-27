/* CloudJava service worker: makes the app installable (PWA) and fast to reopen.
   Range requests (used by the Java engine) and /api/ calls are never touched. */
const VERSION = 'cloudjava-2.0.1';
const CORE = ['./', 'index.html', 'home.css', 'home.js', 'icon.png', 'icon-192.png', 'manifest.webmanifest'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin || req.headers.has('range') || url.pathname.includes('/api/')) return;
  const heavy = /\.(wasm|png)$/i.test(url.pathname) && !/\/Preload\//i.test(url.pathname);
  e.respondWith(heavy ? cacheFirst(req) : networkFirst(req));
});
async function put(req, res) { if (res && res.status === 200) { const c = await caches.open(VERSION); c.put(req, res.clone()); } return res; }
async function networkFirst(req) {
  try { return await put(req, await fetch(req)); }
  catch (err) { const hit = await caches.match(req, { ignoreSearch: true }); if (hit) return hit; throw err; }
}
async function cacheFirst(req) {
  const hit = await caches.match(req); if (hit) return hit;
  return put(req, await fetch(req));
}
