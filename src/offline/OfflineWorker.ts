self.addEventListener("install", (event: Event) => {
  // This is interesting. `addEventListener` doesn't have an overload for ExtendableEvent. Maybe in later TypeScript targets, it does? Casting for now.
  const castEvent = event as ExtendableEvent;
  castEvent.waitUntil(
    addResourcesToCache([
      "/",
      "/upload",
      "/explore",
      "/sqlite3-opfs-async-proxy.js",
      "/sqlite3-worker1-promiser.js",
      "/sqlite3-worker1.js",
      "/sqlite3.js",
      "/sqlite3.wasm",
      "/dev.anoga.thibi.index.js",
      "/dev.anoga.thibi.index.css",
      "/anoga_thibi_icon_placeholder.png",
    ]),
  );
});

self.addEventListener("activate", (event: Event) => {
  const activate = event as ExtendableEvent;
  //@ts-ignore Typescript complaining that this should be Clients. But Clients doc specifically call out that service worker should use self.clients.
  activate.waitUntil(self.clients.claim());
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

const cacheFirst = async (request: Request): Promise<Response> => {
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
      `Failed to fetch resource from offline mode and over the network ${error}`,
    );
    return new Response("Unexpected offline worker error", {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }
};
