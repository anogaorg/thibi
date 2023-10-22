import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import { externalizeDeps } from 'vite-plugin-externalize-deps';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // externalizeDeps({
    //   except: [
    //     '@sqlite.org/sqlite-wasm'
    //   ]
    // })
  ],
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
  optimizeDeps: {
    exclude: ['@sqlite.org/sqlite-wasm'],
  },
})
