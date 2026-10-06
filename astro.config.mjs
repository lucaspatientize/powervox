import { fileURLToPath } from "node:url";
import { defineConfig } from "astro/config";
import emdash from "emdash/astro";
import { d1, r2 } from "@emdash-cms/cloudflare";
import svelte from "@astrojs/svelte";
import react from "@astrojs/react";
import cloudflare from "@astrojs/cloudflare";

const cloudflareEmailEntrypoint = fileURLToPath(
  new URL("./src/plugins/cloudflare-email.ts", import.meta.url),
).replaceAll("\\", "/");

export default defineConfig({
  output: "server",
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),
  integrations: [
    svelte(),
    react(),
    emdash({
      database: d1({ binding: "DB" }),
      storage: r2({ binding: "MEDIA" }),
      plugins: [
        {
          id: "cloudflare-email",
          version: "1.0.0",
          entrypoint: cloudflareEmailEntrypoint,
          format: "native",
          options: {
            from: { email: "noreply@cms.powervox.com.br", name: "PowerVox" },
          },
          capabilities: ["email:provide"],
        },
      ],
    }),
  ],
  server: {
    port: 4321,
  },
  site: "https://powervox.com.br",
  trailingSlash: "ignore",
});
