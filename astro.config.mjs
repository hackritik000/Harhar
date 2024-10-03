import { defineConfig } from 'astro/config';

import node from '@astrojs/node';

export default defineConfig({
  security: {
    checkOrigin: true,
  },

  output: 'hybrid',

  adapter: node({
    mode: 'standalone',
  }),
});
