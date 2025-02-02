import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { viteStaticCopy } from 'vite-plugin-static-copy'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    viteStaticCopy({
      targets: [
        {
          src: 'manifest.json', // Копируем manifest.json
          dest: '.',            // В корень папки dist
        },
        {
          src: 'public/*',      // Копируем все файлы из public
          dest: '.',            // В корень папки dist
        },
      ],
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        content: 'src/content.js',
        popup: 'src/popup/popup.html',
        background: 'src/background.js',
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
