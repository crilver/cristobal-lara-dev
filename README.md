# cristobal-lara.dev

Personal portfolio of **Cristobal Lara** — full-stack web developer, Vancouver.

**Live:** https://cristobal-lara.dev

An editorial-dark, motion-driven single page with deep per-project case
studies. Built for speed and accessibility: every route scores **90+
Performance** and a perfect **100 Accessibility / Best Practices / SEO** on
mobile Lighthouse.

## Stack

- **Astro 6** — static output, islands architecture
- **React 19** — interactive islands only (hero, sections, 3D lanyard)
- **Tailwind CSS v4** — design tokens, dark/light theming
- **GSAP** + **Motion** — scroll-driven reveals and the split-text hero
- **Three.js / React Three Fiber / Rapier** — the draggable lanyard badge
- **ogl** — the WebGL aurora background
- **@astrojs/sitemap** — auto sitemap + JSON-LD structured data
- Deployed on **Cloudflare Pages**

## Highlights

- **Performance-first:** the heavy WebGL is desktop-only and never shipped to
  phones; the hero is server-rendered (no layout shift), animations degrade to
  a compositor-only CSS fade on mobile / reduced-motion. CLS ≈ 0, LCP ≈ 2.4s
  on throttled mobile.
- **Accessibility:** 100/100 — SSR content, `prefers-reduced-motion` honored,
  screen-reader-correct split text, focus-visible, skip link.
- **SEO:** canonical URLs, Open Graph + Twitter cards, `Person` / `WebSite` /
  `BreadcrumbList` JSON-LD, sitemap, robots.
- **Data-driven case studies:** `src/data/projects.ts` + `src/data/case-studies.ts`
  feed a single static `/projects/[slug]` route.

## Project structure

```text
src/
├── pages/
│   ├── index.astro              # the single-page site
│   └── projects/[slug].astro    # per-project case study (static)
├── layouts/Layout.astro         # head, SEO meta, JSON-LD, theme guard
├── components/
│   ├── Nav.astro                # nav + mobile menu
│   └── sections/                # Hero, Work, About, Experience, Contact
├── lib/react-bits/              # animation/WebGL primitives
├── data/                        # site, projects, case-study content
└── styles/global.css            # tokens, theme, keyframes
public/                          # fonts/assets, OG image, robots.txt
```

## Local development

```sh
pnpm install
pnpm dev        # http://localhost:4321
pnpm build      # static output to ./dist
pnpm preview    # serve the production build
pnpm lint       # ESLint (flat config)
pnpm format     # Prettier write
```

Requires Node ≥ 22.12 and pnpm.

## License

Source code is released under the [MIT License](./LICENSE).

Personal content is **not** covered by the MIT license and remains
© Cristobal Lara: the written case-study copy, résumé, photographs/headshots,
and project imagery in `public/`. Please don't reuse those.
