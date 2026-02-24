import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://scream-usc.netlify.app', 

  output: "static",

  vite: {
    plugins: [
      tailwindcss()
    ]
  },

  integrations: [
    sitemap()
  ],

  adapter: netlify()
});