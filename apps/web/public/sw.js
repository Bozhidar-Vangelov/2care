const CACHE_NAME = "2care-v1";

// Resources to pre-cache on install (the app shell)
const PRECACHE_URLS = ["/", "/offline", "/dashboard"];

// ─── Install ────────────────────────────────────────────────────────────────
// Cache the app shell so the UI loads instantly on repeat visits.
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting()),
  );
});

// ─── Activate ───────────────────────────────────────────────────────────────
// Remove stale caches from previous versions.
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  );
});

// ─── Fetch ──────────────────────────────────────────────────────────────────
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and browser-extension / chrome-extension requests.
  if (request.method !== "GET" || !url.protocol.startsWith("http")) return;

  // ── API calls → Network-first ──────────────────────────────────────────
  // Always try the network first; only fall back to cache for offline reads.
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful GET responses for offline reads.
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => caches.match(request)),
    );
    return;
  }

  // ── Next.js static assets → Cache-first ───────────────────────────────
  // Hashed filenames mean they're immutable; serve from cache indefinitely.
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ??
          fetch(request).then((response) => {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            return response;
          }),
      ),
    );
    return;
  }

  // ── Next.js image optimisation → Cache-first ──────────────────────────
  if (url.pathname.startsWith("/_next/image")) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ??
          fetch(request).then((response) => {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            return response;
          }),
      ),
    );
    return;
  }

  // ── Navigation requests → Network-first with offline fallback ─────────
  // For page navigations, try network first so content is always fresh.
  // Fall back to the offline page when the network is unavailable.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request) ?? caches.match("/offline")),
    );
    return;
  }

  // ── Everything else → Stale-while-revalidate ──────────────────────────
  event.respondWith(
    caches.match(request).then((cached) => {
      const networkFetch = fetch(request).then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        return response;
      });
      return cached ?? networkFetch;
    }),
  );
});
