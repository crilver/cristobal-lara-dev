// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://cristobal-lara.dev',
  integrations: [react()],
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
