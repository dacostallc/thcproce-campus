/* eslint-disable no-restricted-globals */
const CACHE = "thcproce-shell-v2";
const SHELL = ["/", "/manifest.webmanifest"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then(async (cache) => {
        for (const path of SHELL) {
          try {
            await cache.add(
              new Request(path, { cache: "reload", credentials: "same-origin" })
            );
          } catch {
            /* Dev / asset ausente: ignora */
          }
        }
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.map((k) => (k !== CACHE ? caches.delete(k) : Promise.resolve()))
        )
      )
      .then(() => self.clients.claim())
  );
});

/** Navegação: tenta rede; offline cai no shell do campus (PWA leve). */
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  let url;
  try {
    url = new URL(event.request.url);
  } catch {
    return;
  }
  if (url.origin !== self.location.origin) return;
  if (event.request.mode !== "navigate") return;

  event.respondWith(
    fetch(event.request).catch(async () => {
      const c = await caches.open(CACHE);
      return (await c.match("/")) || Response.error();
    })
  );
});

/** Web Push: ligue subscrição + VAPID no backend para ir além do placeholder */
self.addEventListener("push", (event) => {
  const data = event.data?.text() ?? "THCProce — novidade no campus";
  event.waitUntil(
    self.registration.showNotification("THCProce", {
      body: data,
      icon: "/next.svg",
      badge: "/next.svg"
    })
  );
});
