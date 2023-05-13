import { defineConfig } from 'vite';
import { qwikVite } from '@builder.io/qwik/optimizer';
import { qwikCity } from '@builder.io/qwik-city/vite';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { staticAdapter } from '@builder.io/qwik-city/adapters/static/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(() => {
  return {
    plugins: [qwikCity(), qwikVite(), tsconfigPaths(), nodeResolve(), staticAdapter({
        origin: 'https://stellaron.vercel.app/',
      }),],
    preview: {
      headers: {
        'Cache-Control': 'public, max-age=600',
      },
    },
    build: {
      ssr: true,
      rollupOptions: {
        input: ['@qwik-city-plan'],
      },
    },
  };
});
