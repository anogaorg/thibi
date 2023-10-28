import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import ErrorPage from "./ErrorPage.tsx";
import "./index.css";
import Upload from "./upload.tsx";

/*
Vite support for Web Workers is kind of a snowflake
NOTE: On Firefox, this can only be tested with a production build
See more here: https://v3.vitejs.dev/guide/features.html#web-workers
*/
import OfflineWorker from "./offline/OfflineWorker?worker&url";

async function startServiceWorker() {
  try {
    const ServiceWorker = navigator.serviceWorker;
    let registration = await ServiceWorker.getRegistration(OfflineWorker);

    if (!registration) {
      registration = await ServiceWorker.register(OfflineWorker, {
        type: "module",
        scope: "/",
      });
    }

    if (registration.installing) {
      console.info("Service worker installing");
    } else if (registration.waiting) {
      console.info("Service worker installed");
    } else if (registration.active) {
      console.info("Service worker active");
    }
  } catch (error: unknown) {
    console.error(`Service Worker registration failed with ${error}`);
  }
}

if ("serviceWorker" in navigator) {
  startServiceWorker();
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "upload",
        element: <Upload />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  // Remember that StrictMode has this side effect: https://react.dev/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
