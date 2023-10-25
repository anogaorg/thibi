import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Credit: https://github.com/vitejs/vite/issues/9864#issuecomment-1230560351
const previewServerPlugin = {
  name: "preview-server-headers-plugin",
  configurePreviewServer(server) {
    server.middlewares.use((req, res, next) => {
      res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
      res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
      next();
    });
  },
};
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), previewServerPlugin],
  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
    },
  },
  optimizeDeps: {
    exclude: ["@sqlite.org/sqlite-wasm"],
  },
});
