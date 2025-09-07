import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import WindiCSS from 'vite-plugin-windicss';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    WindiCSS(),
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        sidepanel: resolve(__dirname, 'public/index.html')
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]'
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  }
})
