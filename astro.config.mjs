import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    mode: 'advanced'
  }),
  vite: {
    plugins: [tailwindcss()],
  },
});