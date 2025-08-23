// vite.config.ts
import { defineConfig, type PluginOption } from 'vite'
import react from '@vitejs/plugin-react';
import Sitemap from 'vite-plugin-sitemap';
import seoPrerender from 'vite-plugin-seo-prerender';

export default defineConfig({
  plugins: [
    react(),
    // Sitemap generation
    Sitemap({
      hostname: 'https://pricewolves.com',
      dynamicRoutes: [
        '/',
        '/create-new-store',
        '/create-new-item',
        '/dashboard',
      ],
      changefreq: 'weekly',
      priority: 0.7,
      generateRobotsTxt: true,
      outDir: 'dist',
    }) as PluginOption,
    // Pre-render for SEO
    seoPrerender({
      routes: [
        '/',
        '/create-new-store',
        '/create-new-item',
        '/dashboard',
      ],
    }) as PluginOption,
  ],
});
