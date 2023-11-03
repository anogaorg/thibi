import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Service-Worker-Allowed": "/",
    },
  },
  preview: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Service-Worker-Allowed": "/", // I do this because I want my worker to work everywhere on my site, but I want to organize it my way.
    },
  },
  optimizeDeps: {
    exclude: ["@sqlite.org/sqlite-wasm"],
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: "dev.anoga.thibi.[name].js", // see: https://rollupjs.org/configuration-options/#output-entryfilenames
        assetFileNames: "dev.anoga.thibi.[name][extname]", // see: https://rollupjs.org/configuration-options/#output-assetfilenames
      },
    },
  },
});
