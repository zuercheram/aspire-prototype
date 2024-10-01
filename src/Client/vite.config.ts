import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import mkcert from "vite-plugin-mkcert";
// import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    https: true,
    port: 5173,
    strictPort: true, // exit if port is in use
    hmr: {
      clientPort: 5173, // point vite websocket connection to vite directly, circumventing .net proxy
    },
  },
  optimizeDeps: {
    force: true,
  },
  build: {
    outDir: "./dist",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          "material-ui": ["@mui/material"],
        },
      },
    },
  },
  plugins: [
    react(),
    mkcert(),
    // use this if you want to provide a PWA. Be careful to verify the update mechanism for your service worker though,
    // as any issues with that would mean every user needs to manually delete their service worker manually to get
    // a new version
    // VitePWA({
    //   registerType: "autoUpdate",

    //   srcDir: "service-worker",
    //   filename: "service-worker.js",
    //   strategies: "injectManifest",
    //   devOptions: { enabled: true },
    //   manifest: {
    //     start_url: "\\",
    //     id: "\\",
    //     icons: [
    //       {
    //         src: "android-chrome-192x192.png",
    //         sizes: "192x192",
    //         type: "image/png",
    //       },
    //       {
    //         src: "android-chrome-512x512.png",
    //         sizes: "512x512",
    //         type: "image/png",
    //       },
    //       {
    //         src: "android-chrome-512x512.png",
    //         sizes: "512x512",
    //         type: "image/png",
    //         purpose: "any maskable",
    //       },
    //     ],
    //   },
    //   workbox: {
    //     globPatterns: ["**/*.{js,css,svg,woff,woff2}"],
    //     skipWaiting: true,
    //     clientsClaim: true,
    //     navigateFallback: null,
    //   },
    // }),
  ],
});
