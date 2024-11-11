import { defineConfig } from "astro/config";

import node from "@astrojs/node";

export default defineConfig({
  security: {
    checkOrigin: true,
  },

  output: "server",

  adapter: node({
    mode: "standalone",
  }),
});
