import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import codegen from 'vite-plugin-graphql-codegen';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
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
      },
    },
  },
});
