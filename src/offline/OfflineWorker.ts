self.addEventListener("install", (event: Event) => {
  // This is interesting. `addEventListener` doesn't have an overload for ExtendableEvent. Maybe in later TypeScript targets, it does? Casting for now.
  const castEvent = event as ExtendableEvent;
  castEvent.waitUntil(
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

self.addEventListener("fetch", (event: Event) => {
  const fetchEvent = event as FetchEvent;
  fetchEvent.respondWith(cacheFirst(fetchEvent.request));
});

const addResourcesToCache = async (resources: string[]) => {
  const cache = await caches.open("v1");
  await cache.addAll(resources);
};

const putInCache = async (request: Request, response: Response) => {
  const cache = await caches.open("v1");
  await cache.put(request, response);
};

const cacheFirst = async (request: Request) => {
  const cached = await caches.match(request);

  if (cached) {
    return cached;
  }

  try {
    const fetchedResponse = await fetch(request);
    putInCache(request, fetchedResponse.clone());
    return fetchedResponse;
  } catch (error) {
    console.error(
      "Failed to fetch resource from offline mode and over the network",
    );
    return new Response("Unexpected offline worker error", {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }
};
