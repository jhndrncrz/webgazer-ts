import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  build: {
    // The demo intentionally bundles the full WebGazer/TensorFlow payload.
    // Keep the warning threshold above that known-good size so real regressions still stand out.
    chunkSizeWarningLimit: 2300,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('@webgazer-ts')) {
            return 'webgazer';
          }

          if (id.includes('node_modules/react')) {
            return 'react-vendor';
          }
        },
      },
    },
  },
})
