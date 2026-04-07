import vercel from '@astrojs/vercel/serverless';
import { defineConfig } from 'astro/config';
import auth from 'auth-astro';

// https://astro.build/config
// Vercel : adapter serverless (pas @astrojs/node, réservé aux VPS / Docker).
export default defineConfig({
  output: 'hybrid',
  adapter: vercel(),
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
