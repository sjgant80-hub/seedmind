// sw.js — minimal offline shell. Your life stays on your device; the organism runs with no network.
const CACHE = 'seedmind-v1';
const ASSETS = ['./', './index.html', './seedmind.mjs', './manifest.webmanifest'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  // network-first for the app shell so a seed export always inlines the LATEST kernel; cache fallback offline
  e.respondWith(fetch(e.request).then(res => { const c = res.clone(); caches.open(CACHE).then(k => k.put(e.request, c)); return res; }).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html'))));
});
