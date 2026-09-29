// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';

// Change SITE and BASE here to deploy under a different domain / GitHub Pages repo path.
// For a GitHub Pages *project* page (username.github.io/repo-name), set BASE to '/repo-name'.
// For a *user/org* page or a custom domain, leave BASE as '/'.
const SITE = 'https://example.github.io';
const BASE = '/';

// https://astro.build/config
export default defineConfig({
  site: SITE,
  base: BASE,
  trailingSlash: 'never',
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-dark',
        dark: 'github-dark',
      },
    },
  },
  integrations: [mdx(), preact(), sitemap()],
});
