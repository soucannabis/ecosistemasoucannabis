import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import inject from '@rollup/plugin-inject';

export default defineConfig({
  plugins: [
    react(),
    inject({
      Buffer: ['buffer', 'Buffer'], // Equivalente ao ProvidePlugin para Buffer
    }),
  ],
  resolve: {
    alias: {
      crypto: 'crypto-browserify',
      stream: 'stream-browserify',
      assert: 'assert',
      http: 'stream-http',
      https: 'https-browserify',
      os: 'os-browserify',
      url: 'url',
      path: 'path-browserify',
      process: 'process/browser',
    },
  },
  optimizeDeps: {
    include: ['crypto-browserify', 'stream-browserify', 'assert', 'process'], // Otimiza dependências
  },
});
