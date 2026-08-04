const STATIC_CACHE = "b2-trainer-static-v12";
const PAGE_CACHE = "b2-trainer-pages-v12";
const CORE_ASSETS = ["/favicon.svg", "/og.png", "/offline.html"];
const APP_ROUTES = [
  "/dashboard",
  "/daily",
  "/grammar",
  "/vocabulary",
  "/reading",
  "/listening",
  "/writing",
  "/review",
  "/statistics",
  "/exam",
  "/settings",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(STATIC_CACHE).then((cache) => cache.addAll(CORE_ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== STATIC_CACHE && key !== PAGE_CACHE)
          .map((key) => caches.delete(key)),
      ),
    ),
  );
  self.clients.claim();
});

self.addEventListener("message", (event) => {
  if (event.data?.type !== "CACHE_APP") return;
  event.waitUntil(
    caches.open(PAGE_CACHE).then(async (cache) => {
      await Promise.allSettled(
        APP_ROUTES.map(async (route) => {
          const response = await fetch(route, { credentials: "same-origin" });
          if (response.ok) await cache.put(route, response);
        }),
      );
    }),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (
    request.method !== "GET" ||
    url.origin !== self.location.origin ||
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/signin-with-chatgpt") ||
    url.pathname.startsWith("/signout-with-chatgpt") ||
    url.pathname.startsWith("/callback")
  ) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then(async (response) => {
          if (response.ok && APP_ROUTES.includes(url.pathname)) {
            const cache = await caches.open(PAGE_CACHE);
            await cache.put(url.pathname, response.clone());
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(url.pathname);
          return cached ?? caches.match("/offline.html");
        }),
    );
    return;
  }

  const assetRequest = ["style", "script", "image", "font", "audio"].includes(
    request.destination,
  );
  if (!assetRequest) return;
  event.respondWith(
    caches.match(request).then(async (cached) => {
      if (cached) return cached;
      const response = await fetch(request);
      if (response.ok) {
        const cache = await caches.open(STATIC_CACHE);
        await cache.put(request, response.clone());
      }
      return response;
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = event.notification.data?.url ?? "/daily";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      const existing = clients.find((client) => new URL(client.url).pathname === target);
      if (existing) return existing.focus();
      return self.clients.openWindow(target);
    }),
  );
});
