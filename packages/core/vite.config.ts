import { defineConfig } from 'vite';
import { resolve } from 'path';
import { copyFileSync, existsSync } from 'fs';

export default defineConfig({
  plugins: [
    {
      name: 'legacy-webgazer-bundle-aliases',
      writeBundle() {
        const source = resolve(__dirname, 'dist/webgazer-ts.umd.cjs');
        const legacyAlias = resolve(__dirname, 'dist/webgazer.js');

        if (existsSync(source)) {
          copyFileSync(source, legacyAlias);
        }
      },
    },
  ],
  server: {
    port: 5173,
    open: true
  },
  build: {
    target: 'es2020',
    lib: {
      // Use the main index as library entry for both ESM and UMD builds
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'webgazer',
      formats: ['es', 'umd'],
      fileName: (format) => `webgazer-ts.${format === 'es' ? 'js' : 'umd.cjs'}`
    },
    rollupOptions: {
      // Bundle ALL dependencies for true drop-in replacement
      output: {
        // For UMD format: expose named exports AND assign the default instance to window.webgazer
        exports: 'named',
        extend: true,
        // Reliable footer: if there's a `default` export in the UMD bundle,
        // assign it to window.webgazer so script-tag usage works.
        // `webgazer` here refers to the UMD global name set by `name: 'webgazer'` above.
        footer: `
// Drop-in replacement: assign the default Webgazer instance to window.webgazer
if (typeof window !== 'undefined') {
  if (typeof webgazer !== 'undefined' && webgazer['default']) {
    window['webgazer'] = webgazer['default'];
  } else if (typeof webgazer !== 'undefined') {
    window['webgazer'] = webgazer;
  }
}
`.trim()
      }
    }
  }
});
