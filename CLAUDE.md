# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Personal portfolio of Cristobal Lara (https://cristobal-lara.dev) — an editorial-dark, motion-driven single page with static per-project case studies. Astro 6 static output deployed to Cloudflare Pages. The site holds 90+ mobile Lighthouse Performance and 100 Accessibility/Best Practices/SEO; changes must not regress that.

## Commands

Requires Node ≥ 22.12 and pnpm (CI uses pnpm 10).

```sh
pnpm install
pnpm dev            # dev server at http://localhost:4321
pnpm build          # static build to ./dist
pnpm preview        # serve the production build
pnpm lint           # ESLint (flat config, eslint.config.js)
pnpm format         # Prettier write (has prettier-plugin-astro)
pnpm format:check
pnpm astro check    # TypeScript/Astro type checking (@astrojs/check)
```

There are no tests. CI (`.github/workflows/ci.yml`) runs `pnpm lint` + `pnpm build` on push/PR to main — those two must pass.

## Architecture

Two routes only:

- `src/pages/index.astro` — the whole single-page site. Composes React island sections from `src/components/sections/` (Hero, Work, About, Experience, Contact).
- `src/pages/projects/[slug].astro` — case-study pages, statically generated via `getStaticPaths` from data. Pure Astro, ships no React.

**Data-driven content.** All content lives in `src/data/`:
- `projects.ts` — card-level metadata (title, tagline, role, year, status, stack, links), typed `Project[]`.
- `case-studies.ts` — long-form narrative keyed by the same slug, typed `Record<string, CaseStudy>`.
- `site.ts` — identity, nav, socials, SEO description.

Adding a project = adding entries to `projects.ts` (+ optionally `case-studies.ts`); the `/projects/[slug]` route generates automatically. No content changes should require touching page templates.

**Islands & hydration strategy** (deliberate, per section):
- `Hero` is `client:load` but server-renders its HTML with a reserved 100dvh height, so the headline paints immediately with no layout shift.
- All other sections are `client:visible` — JS deferred until scrolled near.

**Performance patterns — preserve these:**
- Heavy WebGL is never touched during SSR and never blocks paint: `SoftAurora` (ogl) and `CustomLanyard` (Three.js/R3F/Rapier) are `lazy()`-imported inside their islands.
- The lanyard is desktop-only via a `matchMedia('(min-width: 1024px)')` state gate in `src/components/LanyardOverlay.tsx` **before** the dynamic import. CSS `display:none` is not enough — React would still mount the lazy component and pull the ~1.1 MB Three.js+Rapier chunk on phones. Follow this gating pattern for any new heavy client-only feature.
- The animation primitives (`AnimatedContent`, `SplitText`) degrade below 1024px and under `prefers-reduced-motion` to the compositor-only CSS `.rb-fade-in` keyframe in `global.css` instead of running GSAP.
- New heavy deps used via dynamic import must be added to `optimizeDeps.include` in `astro.config.mjs` — otherwise Vite lazy-discovers them and throws 504 "Outdated Optimize Dep" errors after lockfile changes.

**`src/lib/react-bits/`** — vendored animation/WebGL primitives from React Bits, intentionally kept as-is and excluded from ESLint. Don't refactor them to house style.

**`src/layouts/Layout.astro`** owns the entire `<head>` (SEO meta, canonical, OG/Twitter, `Person`/`WebSite` JSON-LD — case studies inject `BreadcrumbList` via `slot="head"`) plus two inline scripts with non-obvious rationale:
- Theme pre-flash guard: the site is **dark-first by design** — light mode is an explicit toggle choice stored in `localStorage`, NOT the OS `prefers-color-scheme`. Don't "fix" it to follow the OS.
- Delegated anchor-click handler using instant (`behavior: 'auto'`) `scrollIntoView`: the continuous WebGL render loop starves smooth-scroll, making nav links appear dead. Don't switch it back to smooth scrolling.

**Styling.** Tailwind CSS v4 via `@tailwindcss/vite` — there is no `tailwind.config`; design tokens live in the `@theme inline` block in `src/styles/global.css`. Theme colors are CSS variables swapped by `:root[data-theme='light']`. Fonts are self-hosted via `@fontsource-variable` (Fraunces display, Geist sans, Geist Mono).

**Deployment.** Cloudflare Pages serving `./dist` (`wrangler.json`). `public/_headers` sets cache and security headers — deliberately **no CSP**, because the site relies on inline scripts + WebGL + GSAP and a wrong policy silently breaks the hero/lanyard.

## Repo conventions

- `scripts/` is gitignored on purpose: local Playwright UI-audit harnesses and asset-generation scripts (`gen-og.mjs`, `gen-favicons.mjs`, `convert-headshots.mjs`). They exist on disk for local use but are never committed.
- Case-study copy, résumé, photos, and project imagery in `public/` are © Cristobal Lara (not MIT); the copy is intentionally honest/recruiter-facing — don't inflate claims when editing it.
