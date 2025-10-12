import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  server: {
    port: 5173,
    open: true
  },
  build: {
    target: 'es2020',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'webgazer',
      formats: ['es', 'umd'],
      fileName: (format) => `webgazer-ts.${format === 'es' ? 'js' : 'umd.cjs'}`
    },
    rollupOptions: {
      // Externalize dependencies so they're not bundled
      external: [
        '@tensorflow/tfjs',
        '@tensorflow-models/face-landmarks-detection',
        'localforage',
        'regression'
      ],
      output: {
        // Use named exports to avoid the warning
        exports: 'named',
        globals: {
          '@tensorflow/tfjs': 'tf',
          '@tensorflow-models/face-landmarks-detection': 'faceLandmarksDetection',
          'localforage': 'localforage',
          'regression': 'regression'
        }
      }
    }
  }
});
