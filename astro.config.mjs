import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { loadEnv } from 'vite';
import { fileURLToPath } from 'node:url';

const isDev = process.argv.includes('dev');
const devEnv = isDev ? loadEnv('development', process.cwd(), '') : {};

if (isDev) {
  Object.assign(process.env, devEnv);
}

export default defineConfig({
  // 1. Point Astro to your new GitHub Pages root domain
  site: 'https://examexperts.github.io',
  
  // 2. Force static HTML output (Required for GitHub Pages)
  output: 'static',

  // Note: The @astrojs/cloudflare adapter has been removed because 
  // GitHub Pages only hosts static files and cannot run worker environments.

  session: {
    // Defaulting to memory storage so the static build process doesn't break
    driver: { entrypoint: 'unstorage/drivers/memory' },
    ttl: 60 * 60 * 24 * 14,
    cookie: { name: 'hsc-portal-session', path: '/', secure: !isDev, sameSite: 'lax', maxAge: 60 * 60 * 24 * 14 },
  },
  
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      // Applied the dev alias globally so Astro doesn't crash trying to find 
      // actual Cloudflare Worker modules during the static GitHub build
      alias: {
        'cloudflare:workers': fileURLToPath(
          new URL('./src/lib/auth/runtime-env.dev.ts', import.meta.url),
        ),
      }
    },
  },
});