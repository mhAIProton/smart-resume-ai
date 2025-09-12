import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import WindiCSS from 'vite-plugin-windicss';
import { resolve } from 'path';
import { copyFileSync, mkdirSync, existsSync } from 'fs';

// Plugin to copy static files for Chrome extension
function copyExtensionFiles() {
  return {
    name: 'copy-extension-files',
    writeBundle() {
      const distDir = resolve(__dirname, 'dist');
      
      // Copy manifest.json
      copyFileSync(
        resolve(__dirname, 'public/manifest.json'),
        resolve(distDir, 'manifest.json')
      );
      
      // Copy background.js
      copyFileSync(
        resolve(__dirname, 'public/background.js'),
        resolve(distDir, 'background.js')
      );
      
      // Copy content.js
      copyFileSync(
        resolve(__dirname, 'public/content.js'),
        resolve(distDir, 'content.js')
      );
      
      // Copy all SVG icons
      const iconsDir = resolve(distDir, 'icons');
      if (!existsSync(iconsDir)) {
        mkdirSync(iconsDir, { recursive: true });
      }
      
      // Copy logo as icon
      copyFileSync(
        resolve(__dirname, 'public/logo.png'),
        resolve(iconsDir, 'icon16.png')
      );
      copyFileSync(
        resolve(__dirname, 'public/logo.png'),
        resolve(iconsDir, 'icon32.png')
      );
      copyFileSync(
        resolve(__dirname, 'public/logo.png'),
        resolve(iconsDir, 'icon48.png')
      );
      copyFileSync(
        resolve(__dirname, 'public/logo.png'),
        resolve(iconsDir, 'icon128.png')
      );
      
      // Copy all SVG files
      const svgFiles = [
        'circle-daw.svg', 'circle.svg', 'cover-letter.svg', 'daw.svg',
        'generating.svg', 'google.svg', 'lock.svg', 'logout.svg',
        'mark.svg', 'megaphone.svg', 'plan.svg', 'resume.svg',
        'squared-cross.svg', 'upload.svg', 'warning.svg'
      ];
      
      svgFiles.forEach(file => {
        copyFileSync(
          resolve(__dirname, `public/${file}`),
          resolve(distDir, file)
        );
      });
    }
  };
}

export default defineConfig({
  plugins: [
    react(),
    WindiCSS(),
    copyExtensionFiles()
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  }
})
