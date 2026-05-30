/**
 * Root vite.config.js — BACKWARDS-COMPAT STUB ONLY
 *
 * This file delegates to the canonical workspace configs:
 *   Website:         cd website && npm run dev     (port 5175)
 *   Admin Dashboard: cd admin-dashboard && npm run dev  (port 5001)
 *
 * Or use the root convenience scripts:
 *   npm run dev:website
 *   npm run dev:admin
 *   npm run dev:all       ← starts both concurrently
 */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Redirect Vite root to the website workspace
  root: './website',
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react()],
  server: {
    port: 5175,
    proxy: {
      '/api': 'http://localhost:8787',
      '/healthz': 'http://localhost:8787',
    },
  },
});
