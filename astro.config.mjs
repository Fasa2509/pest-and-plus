// import vercel from "@astrojs/vercel/serverless";
import { defineConfig } from 'astro/config';
import node from "@astrojs/node";
import vercel from "@astrojs/vercel/serverless";
import preact from "@astrojs/preact";

// https://astro.build/config
export default defineConfig({
  output: "server",
  // adapter: node({
  //   mode: "standalone"
  // }),
  adapter: vercel(),
  integrations: [preact()]
  // image: {
  //   domains: [""],
  // }
});