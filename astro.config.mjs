import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';
import { loadEnv } from 'vite';
import { fileURLToPath } from 'node:url';

const isDev = process.argv.includes('dev');
const devEnv = isDev ? loadEnv('development', process.cwd(), '') : {};

if (isDev) {
  Object.assign(process.env, devEnv);
}

export default defineConfig({
  output: isDev ? 'static' : 'server',
  adapter: isDev ? undefined : cloudflare(),
  session: {
    ...(isDev ? { driver: { entrypoint: 'unstorage/drivers/memory' } } : {}),
    ttl: 60 * 60 * 24 * 14,
    cookie: { name: 'hsc-portal-session', path: '/', secure: !isDev, sameSite: 'lax', maxAge: 60 * 60 * 24 * 14 },
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: isDev
        ? {
            'cloudflare:workers': fileURLToPath(
              new URL('./src/lib/auth/runtime-env.dev.ts', import.meta.url),
            ),
          }
        : undefined,
    },
  },
});