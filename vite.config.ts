import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Allows setting the base path via environment variable for GitHub Pages (e.g., '/my-repo/')
  base: process.env.VITE_BASE_PATH || '/',
  define: {
    // Stringify the API key to inject it during build time (safe for frontend-only demo deployments)
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
  },
});