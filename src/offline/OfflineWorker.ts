const addResourcesToCache = async (resources) => {
  const cache = await caches.open("v1");
  await cache.addAll(resources);
};

self.addEventListener("install", (event) => {
  event.waitUntil(
    addResourcesToCache([
      "/",
      "/sqlite3-opfs-async-proxy.js",
      "/sqlite3-worker1-promiser.js",
      "/sqlite3-worker1.js",
      "/sqlite3.js",
      "/sqlite3.wasm",
      "/dev.anoga.thibi.index.js",
      "/dev.anoga.thibi.index.css",
    ]),
  );
});
