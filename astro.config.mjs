import node from '@astrojs/node';
import { defineConfig } from 'astro/config';
import auth from 'auth-astro';

// https://astro.build/config
export default defineConfig({
  output: 'hybrid',
  adapter: node({ mode: 'standalone' }),
  integrations: [
    auth({
      // Route définie dans src/pages/api/auth/[...auth].ts pour que hybrid + dev
      // appliquent bien prerender=false (évite getStaticPaths sur la route injectée).
      injectEndpoints: false,
    }),
  ],
  build: {
    assets: 'assets'
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: undefined
        }
      }
    }
  }
});
