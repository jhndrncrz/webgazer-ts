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
      // Bundle ALL dependencies for true drop-in replacement
      // Everything (TensorFlow.js, Face Landmarks Detection, LocalForage, etc.) is bundled
      output: {
        // Use named exports but include a footer to ensure window.webgazer is the default
        exports: 'named',
        extend: true,
        // Add footer to unwrap the default export for drop-in replacement
        footer: `
// Drop-in replacement compatibility: Unwrap default export to window.webgazer
if (typeof window !== 'undefined' && typeof webgazer !== 'undefined' && webgazer.default) {
  // Replace the module object with the default export directly
  const instance = webgazer.default;
  for (const key in webgazer) {
    if (key !== 'default') {
      instance[key] = webgazer[key];
    }
  }
  if (typeof define === 'function' && define.amd) {
    // For AMD, return the instance
  } else if (typeof module !== 'undefined' && module.exports) {
    // For CommonJS, export the instance
    module.exports = instance;
  } else {
    // For browser globals, replace window.webgazer with the instance
    window.webgazer = instance;
  }
}
        `.trim()
      }
    }
  }
});
