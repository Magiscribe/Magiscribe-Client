// vite.config.ts
import react from 'file:///C:/Users/manag/Documents/GitHub/Magiscribe/React-Client/node_modules/.pnpm/@vitejs+plugin-react-swc@3.7.1_@swc+helpers@0.5.13_vite@5.4.10_@types+node@22.8.7_/node_modules/@vitejs/plugin-react-swc/index.mjs';
import { defineConfig } from 'file:///C:/Users/manag/Documents/GitHub/Magiscribe/React-Client/node_modules/.pnpm/vite@5.4.10_@types+node@22.8.7/node_modules/vite/dist/node/index.js';
import tsconfigPaths from 'file:///C:/Users/manag/Documents/GitHub/Magiscribe/React-Client/node_modules/.pnpm/vite-tsconfig-paths@5.0.1_typescript@5.6.3_vite@5.4.10_@types+node@22.8.7_/node_modules/vite-tsconfig-paths/dist/index.js';
import codegen from 'file:///C:/Users/manag/Documents/GitHub/Magiscribe/React-Client/node_modules/.pnpm/vite-plugin-graphql-codegen@3.3.8_@graphql-codegen+cli@5.0.3_@types+node@22.8.7_graphql@16.9._bih4yviz5fpwoleyypincudwym/node_modules/vite-plugin-graphql-codegen/dist/index.mjs';
var vite_config_default = defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    codegen({
      runOnBuild: false,
      // Do not run codegen on build, the CI pipeline does not have access to the server
      runOnStart: true,
      // Run codegen on start, this is useful for local development
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
        manualChunks(id) {
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
export { vite_config_default as default };
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxtYW5hZ1xcXFxEb2N1bWVudHNcXFxcR2l0SHViXFxcXE1hZ2lzY3JpYmVcXFxcUmVhY3QtQ2xpZW50XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxtYW5hZ1xcXFxEb2N1bWVudHNcXFxcR2l0SHViXFxcXE1hZ2lzY3JpYmVcXFxcUmVhY3QtQ2xpZW50XFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9tYW5hZy9Eb2N1bWVudHMvR2l0SHViL01hZ2lzY3JpYmUvUmVhY3QtQ2xpZW50L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0LXN3Yyc7XG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCB0c2NvbmZpZ1BhdGhzIGZyb20gJ3ZpdGUtdHNjb25maWctcGF0aHMnO1xuaW1wb3J0IGNvZGVnZW4gZnJvbSAndml0ZS1wbHVnaW4tZ3JhcGhxbC1jb2RlZ2VuJztcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCgpLFxuICAgIHRzY29uZmlnUGF0aHMoKSxcbiAgICBjb2RlZ2VuKHtcbiAgICAgIHJ1bk9uQnVpbGQ6IGZhbHNlLCAvLyBEbyBub3QgcnVuIGNvZGVnZW4gb24gYnVpbGQsIHRoZSBDSSBwaXBlbGluZSBkb2VzIG5vdCBoYXZlIGFjY2VzcyB0byB0aGUgc2VydmVyXG4gICAgICBydW5PblN0YXJ0OiB0cnVlLCAvLyBSdW4gY29kZWdlbiBvbiBzdGFydCwgdGhpcyBpcyB1c2VmdWwgZm9yIGxvY2FsIGRldmVsb3BtZW50XG4gICAgfSksXG4gIF0sXG4gIGJ1aWxkOiB7XG4gICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiAxNTAwLFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIC8vIGh0dHBzOi8vcm9sbHVwanMub3JnL2d1aWRlL2VuLyNiaWctbGlzdC1vZi1vcHRpb25zXG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgLy8gaHR0cHM6Ly9yb2xsdXBqcy5vcmcvY29uZmlndXJhdGlvbi1vcHRpb25zLyNvdXRwdXQtY29tcGFjdFxuICAgICAgICBjb21wYWN0OiB0cnVlLFxuXG4gICAgICAgIC8vIGh0dHBzOi8vcm9sbHVwanMub3JnL2NvbmZpZ3VyYXRpb24tb3B0aW9ucy8jb3V0cHV0LWR5bmFtaWNpbXBvcnRpbmNqc1xuICAgICAgICBkeW5hbWljSW1wb3J0SW5DanM6IHRydWUsXG5cbiAgICAgICAgLy8gaHR0cHM6Ly9yb2xsdXBqcy5vcmcvZ3VpZGUvZW4vI291dHB1dG1hbnVhbGNodW5rc1xuICAgICAgICBtYW51YWxDaHVua3MoaWQ6IHN0cmluZykge1xuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzJykpIHtcbiAgICAgICAgICAgIGNvbnN0IHBhcnRzID0gaWQuc3BsaXQoJ25vZGVfbW9kdWxlcy8nKVsxXS5zcGxpdCgnLycpO1xuICAgICAgICAgICAgY29uc3QgZmlyc3RQYXJ0ID0gcGFydHNbMF07XG5cbiAgICAgICAgICAgIGlmIChmaXJzdFBhcnQgIT09ICcucG5wbScpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGZpcnN0UGFydDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3Qgc2Vjb25kUGFydCA9IHBhcnRzWzFdO1xuICAgICAgICAgICAgcmV0dXJuIHNlY29uZFBhcnQuc3RhcnRzV2l0aCgnQCcpID8gc2Vjb25kUGFydC5zcGxpdCgnQCcpWzFdIDogc2Vjb25kUGFydDtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBcVcsT0FBTyxXQUFXO0FBQ3ZYLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sbUJBQW1CO0FBQzFCLE9BQU8sYUFBYTtBQUdwQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixjQUFjO0FBQUEsSUFDZCxRQUFRO0FBQUEsTUFDTixZQUFZO0FBQUE7QUFBQSxNQUNaLFlBQVk7QUFBQTtBQUFBLElBQ2QsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLHVCQUF1QjtBQUFBLElBQ3ZCLGVBQWU7QUFBQTtBQUFBLE1BRWIsUUFBUTtBQUFBO0FBQUEsUUFFTixTQUFTO0FBQUE7QUFBQSxRQUdULG9CQUFvQjtBQUFBO0FBQUEsUUFHcEIsYUFBYSxJQUFZO0FBQ3ZCLGNBQUksR0FBRyxTQUFTLGNBQWMsR0FBRztBQUMvQixrQkFBTSxRQUFRLEdBQUcsTUFBTSxlQUFlLEVBQUUsQ0FBQyxFQUFFLE1BQU0sR0FBRztBQUNwRCxrQkFBTSxZQUFZLE1BQU0sQ0FBQztBQUV6QixnQkFBSSxjQUFjLFNBQVM7QUFDekIscUJBQU87QUFBQSxZQUNUO0FBRUEsa0JBQU0sYUFBYSxNQUFNLENBQUM7QUFDMUIsbUJBQU8sV0FBVyxXQUFXLEdBQUcsSUFBSSxXQUFXLE1BQU0sR0FBRyxFQUFFLENBQUMsSUFBSTtBQUFBLFVBQ2pFO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
