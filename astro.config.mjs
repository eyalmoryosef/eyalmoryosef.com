import { defineConfig, envField } from "astro/config";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://eyalmoryosef.com",
  integrations: [sitemap()],
  adapter: vercel(),
  env: {
    schema: {
      ADMIN_USERNAME: envField.string({ context: "server", access: "secret", optional: true }),
      ADMIN_PASSWORD: envField.string({ context: "server", access: "secret", optional: true }),
      ADMIN_SESSION_SECRET: envField.string({ context: "server", access: "secret", optional: true }),
      GITHUB_TOKEN: envField.string({ context: "server", access: "secret", optional: true }),
      GITHUB_REPO: envField.string({ context: "server", access: "secret", optional: true, default: "eyalmoryosef/eyalmoryosef.com" }),
      GITHUB_BRANCH: envField.string({ context: "server", access: "secret", optional: true, default: "master" }),
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  i18n: {
    defaultLocale: "en",
    locales: ["en", "he"],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: true,
    },
  },
});
