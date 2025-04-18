import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    viteStaticCopy({
      targets: [
        {
          src: "manifest.json",
          dest: ".",
        },
        {
          src: "src/assets/icon*.png",
          dest: "assets",
        },
        {
          src: "src/popup/popup*",
          dest: "popup",
        },
      ],
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        content: "src/content_scripts/main.js",
        background: "src/background.js",
        styles: "src/styles.css",
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name].[ext]",
      },
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
