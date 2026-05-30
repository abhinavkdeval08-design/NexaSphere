/**
 * Root vite.config.js
 *
 * This file exists for backwards-compatibility only.
 * The canonical configuration is in website/vite.config.js
 *
 * To develop the website:   cd website && npm run dev
 * To build the website:     cd website && npm run build
 * To develop admin:         cd admin-dashboard && npm run dev
 */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { sentryVitePlugin } from "@sentry/vite-plugin";

export default defineConfig({
  root: "./website",
  base: process.env.VITE_BASE_PATH || "/",
  plugins: [
    react(),
    sentryVitePlugin({
      org: process.env.SENTRY_ORG || "nexasphere",
      project: process.env.SENTRY_PROJECT || "javascript-react",
      authToken: process.env.SENTRY_AUTH_TOKEN,
      silent: true,
    }),
    VitePWA({
      disable: process.env.DISABLE_PWA === "true",
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "pwa-192x192.png", "pwa-512x512.png"],
      manifest: {
        name: "NexaSphere — Connecting GL Bajaj Tech Ecosystem",
        short_name: "NexaSphere",
        description:
          "The premier tech community of GL Bajaj Group of Institutions.",
        theme_color: "#CC1111",
        background_color: "#0A0A0A",
        display: "standalone",
        icons: [
          { src: "pwa-192x192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "pwa-192x192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
          { src: "pwa-512x512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          { src: "pwa-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        inlineWorkboxRuntime: true,
        globPatterns: ["**/*.{js,css,html,ico,png,svg,jpg}"],
      },
    }),
  ],
  optimizeDeps: {
    include: ["idb-keyval"],
  },
  server: {
    port: 5175,
    proxy: {
      "/api": "http://localhost:8787",
      "/healthz": "http://localhost:8787",
    },
  },
});
