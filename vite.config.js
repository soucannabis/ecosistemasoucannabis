import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      babel: {
        presets: ['@babel/preset-react'], // Suporte para JSX
      },
    }),
  ],
  esbuild: {
    loader: 'jsx', // Trata arquivos .js como JSX
    include: /src\/.*\.js$/, // Inclui arquivos .js dentro da pasta src
  },
});
