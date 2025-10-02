// vite.config.ts
import { defineConfig, type PluginOption } from 'vite'
import react from '@vitejs/plugin-react';
import Sitemap from 'vite-plugin-sitemap';
import { createHtmlPlugin } from 'vite-plugin-html';

export default defineConfig({
  plugins: [
    react(),
    Sitemap({
      hostname: 'https://pricewolves.com',
      dynamicRoutes: [
        '/',
        '/dashboard',
        '/create-new-store',
        '/create-new-item',
      ],
      changefreq: 'weekly',
      priority: 0.7,
      generateRobotsTxt: true,
      outDir: 'dist',
    }) as PluginOption,
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          title: 'Price Wolves',
          description: 'Price Wolves aim to hunt stores with the lowest prices.',
        },
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
  // @ts-ignore
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test-setup.tsx',
  },
});