// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://cristobal-lara.dev',
  integrations: [
    react(),
    sitemap({
      // Build-time lastmod; every route is statically generated.
      lastmod: new Date(),
      changefreq: 'monthly',
      priority: 0.7,
      serialize(item) {
        // Homepage is the primary entry point; the /projects/* case
        // studies are the high-value depth pages. Others keep defaults.
        if (item.url === 'https://cristobal-lara.dev/') {
          item.changefreq = 'weekly';
          item.priority = 1.0;
        } else if (item.url.includes('/projects/')) {
          item.changefreq = 'monthly';
          item.priority = 0.8;
        }
        return item;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    // Pre-bundle heavy deps so Vite doesn't lazy-discover them on first
    // dynamic import — that race is what causes the 504 "Outdated Optimize
    // Dep" errors after a lockfile change.
    optimizeDeps: {
      include: [
        'motion/react',
        'three',
        '@react-three/fiber',
        '@react-three/drei',
        '@react-three/rapier',
        'meshline',
        'gsap',
        'gsap/ScrollTrigger',
        'gsap/SplitText',
        '@gsap/react',
        'ogl',
      ],
    },
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
});
