// import vercel from "@astrojs/vercel/serverless";
import { defineConfig } from 'astro/config';
import node from "@astrojs/node";
import vercel from "@astrojs/vercel/serverless";
import preact from "@astrojs/preact";

// https://astro.build/config
export default defineConfig({
  vite: {
    resolve: {
      alias: {
        ".prisma/client/index-browser": "@prisma/client/index-browser.js"
      }
    }
  },
  output: "server",
  adapter: vercel(),
  integrations: [preact()],
  // adapter: node({
  //   mode: "standalone"
  // }),
  // image: {
  //   domains: [""],
  // }
});