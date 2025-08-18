
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    global: 'globalThis',
  },
  build: {
    rollupOptions: {
      external: [
        'socks-proxy-agent',
        'https-proxy-agent',
        'http-proxy-agent',
        'node:http',
        'node:https',
        'node:crypto',
        'node:fs',
        'node:path',
        'node:url',
        'node:util',
        'node:stream',
        'node:buffer',
        'node:events',
        'node:os',
        'node:querystring',
        'node:zlib'
      ],
      output: {
        globals: {
          'socks-proxy-agent': 'SocksProxyAgent',
          'https-proxy-agent': 'HttpsProxyAgent',
          'http-proxy-agent': 'HttpProxyAgent',
          'node:http': 'http',
          'node:https': 'https',
          'node:crypto': 'crypto',
          'node:fs': 'fs',
          'node:path': 'path',
          'node:url': 'url',
          'node:util': 'util',
          'node:stream': 'stream',
          'node:buffer': 'buffer',
          'node:events': 'events',
          'node:os': 'os',
          'node:querystring': 'querystring',
          'node:zlib': 'zlib'
        }
      }
    }
  },
  optimizeDeps: {
    exclude: ['ccxt'],
    include: []
  }
}));
