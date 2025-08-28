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
  server: {
    host: true, // allow access from network
    port: 5173,
    strictPort: true,
    // replace with your actual ngrok domain
    allowedHosts: ['b5a8ee365208.ngrok-free.app'], 
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
});