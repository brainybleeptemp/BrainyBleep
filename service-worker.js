const CACHE_NAME = "brainybleep-cache-v1";
const urlsToCache = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./mascot-head-icon.png"
];

// Install
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Activate
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => key !== CACHE_NAME ? caches.delete(key) : null))
    )
  );
});

// Fetch
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
// Listen for push events
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : { title: "BrainyBleep", body: "You have a reminder!" };
  const options = {
    body: data.body,
    icon: 'mascot-head-icon.png',
    badge: 'mascot-head-icon.png',
    vibrate: [100, 50, 100],
    data: { url: './index.html' }
  };
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle notification click
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window" }).then(clientList => {
      if (clients.openWindow) return clients.openWindow(event.notification.data.url);
    })
  );
});
