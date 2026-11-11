// Offline cache for Anatomy Type. Bump happens automatically when files change.
const CACHE = "anatomy-type-4177467679";
const CORE = ["./", "index.html", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png", "data/abdomen.json", "data/body.json", "data/brain.json", "data/chest.json", "data/cranial.json", "data/eye.json", "data/foot.json", "data/hand.json", "data/heart.json", "data/knee.json", "data/leg.json", "data/limb.json", "data/mforearm.json", "data/mhead.json", "data/mhip.json", "data/mleg.json", "data/mmap.json", "data/mshoulder.json", "data/mtrunk.json", "data/narm.json", "data/nleg.json", "data/nmap.json", "data/omap.json", "data/pelvis.json", "data/skull.json", "data/spinal.json", "data/trunk.json", "data/urinary.json", "data/varm.json", "data/vhead.json", "data/vleg.json", "data/vmap.json", "data/vtrunk.json"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const req = e.request; if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (req.mode === "navigate") {   // the page: network first, so updates show up; cache when offline
    e.respondWith(fetch(req).then(r => { const c = r.clone(); caches.open(CACHE).then(k => k.put("index.html", c)); return r; }).catch(() => caches.match("index.html")));
    return;
  }
  // models, icons, three.js and fonts: cache first
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {
    if (r.ok || r.type === "opaque") { const c = r.clone(); caches.open(CACHE).then(k => k.put(req, c)); }
    return r;
  })));
});
