import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import tsconfigPaths from 'vite-tsconfig-paths';
import codegen from 'vite-plugin-graphql-codegen';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    nodePolyfills(),
    react(),
    tsconfigPaths(),
    codegen({
      runOnBuild: false, // Do not run codegen on build, the CI pipeline does not have access to the server
      runOnStart: true, // Run codegen on start, this is useful for local development
    }),
  ],
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      // https://rollupjs.org/guide/en/#big-list-of-options
      output: {
        // https://rollupjs.org/configuration-options/#output-compact
        compact: true,

        // https://rollupjs.org/configuration-options/#output-dynamicimportincjs
        dynamicImportInCjs: true,

        // https://rollupjs.org/guide/en/#outputmanualchunks
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            const parts = id.split('node_modules/')[1].split('/');
            const firstPart = parts[0];

            if (firstPart !== '.pnpm') {
              return firstPart;
            }

            const secondPart = parts[1];
            return secondPart.startsWith('@') ? secondPart.split('@')[1] : secondPart;
          }
        },
      },
    },
  },
});
