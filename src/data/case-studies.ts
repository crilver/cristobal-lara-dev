// Long-form case-study content, keyed by the same slug as `projects.ts`.
// projects.ts owns the card-level metadata (title, tagline, role, year,
// status, stack, links); this file owns the narrative shown at
// /projects/[slug]. Content distilled from the local work-evidence
// dossiers — honest, recruiter-facing, no inflation.

export interface CaseStudyHighlight {
  /** Mono uppercase label, e.g. "ROLE", "SCALE". */
  label: string;
  /** Short value, e.g. "Sole engineer". */
  value: string;
}

export interface CaseStudySection {
  heading: string;
  /** One or more prose paragraphs. */
  body?: string[];
  /** Optional bullet list rendered after the prose. */
  bullets?: string[];
}

export interface CaseStudyLink {
  label: string;
  href: string;
}

export interface CaseStudy {
  slug: string;
  /** Lead paragraph — larger, sets the scene in 2-3 sentences. */
  intro: string;
  /** Why the project exists / the problem context. */
  context: string;
  /** 3-4 metric/fact callouts shown as a card grid. */
  highlights: CaseStudyHighlight[];
  /** Editorial body sections. */
  sections: CaseStudySection[];
  /** "What I personally did" — used on team projects. */
  contributions?: string[];
  /** Notable judgment calls / trade-offs. */
  decisions?: { title: string; body: string }[];
  /** Extra links beyond projects.ts (paper, etc.). */
  links?: CaseStudyLink[];
  /** Path to a self-hosted demo video under /public (native <video>). */
  demoVideo?: string;
  /**
   * Metadata for the demo video — drives the <video> poster and the
   * VideoObject JSON-LD (Google won't index a video without it).
   */
  demoVideoMeta?: {
    name: string;
    description: string;
    /** Poster/thumbnail path under /public. */
    thumbnail: string;
    /** ISO date the video was published on this site. */
    uploadDate: string;
  };
}

export const caseStudies: Record<string, CaseStudy> = {
  coravet: {
    slug: 'coravet',
    intro:
      'A multi-tenant veterinary clinic SaaS I designed, built, and operate end-to-end as the sole engineer, from the data model and API through the dashboard, infrastructure, security hardening, observability, and go-to-market. The first live tenant is a real clinic in La Concordia, Ecuador.',
    context:
      'The Ecuadorian SMB veterinary market is tech-skeptical, so the product is deliberately positioned as "your own clinic online": each clinic gets a personalized site and URL, not a seat on a shared platform. Regulated electronic invoicing was intentionally left out of scope; it belongs in the clinic\'s existing accounting tool.',
    highlights: [
      { label: 'Team', value: 'Sole engineer' },
      { label: 'Status', value: 'Live production tenant' },
      { label: 'Schema', value: '26 Prisma migrations' },
      { label: 'Hardening', value: '11-layer prod defense' },
    ],
    sections: [
      {
        heading: 'What it is',
        body: [
          'Two product surfaces from one codebase: a public marketing site plus per-clinic customer portal (Astro, statically rendered to Cloudflare), and an operational dashboard SPA for vets, managers, and staff (Vite + React 19). Both sit on a NestJS 11 API with a multi-tenant Prisma schema on PostgreSQL (Neon), organized as a pnpm + Turborepo monorepo with shared UI, API-client, and type packages.',
        ],
      },
      {
        heading: 'Engineering depth',
        body: [
          'Security and correctness are designed in, not bolted on.',
        ],
        bullets: [
          'Three stacked NestJS guards: Firebase auth, role, and a legal-acceptance gate that returns a machine-readable 403 the SPA routes on.',
          'A Server-Sent Events layer (30+ typed events, per-user/clinic/role scoped) whose 30s heartbeat re-verifies Firebase session revocation in-band, closing stale streams within 30 seconds of deactivating a user.',
          'Timezone correctness via a dedicated date-utils module: all datetimes UTC timestamptz, all query boundaries clinic-local; a documented invariant after a near-miss.',
          'LOPDP-compliant legal versioning: SHA-256-hashed canonical Markdown, append-only acceptance table, boot-time drift detection, right-to-erasure as anonymization.',
          'Server-side image pipeline (Sharp → WebP @ q80) turning multi-MB phone photos into ~80 KB cards, plus client-side pre-compression.',
        ],
      },
      {
        heading: 'Infrastructure & operations',
        body: [
          'A DigitalOcean droplet behind Cloudflare (WAF, Origin Cert, R2), with public SSH eliminated entirely. Both personal and CI/CD access ride a Tailscale private mesh. A multi-stage Alpine Docker image runs non-root with memory/CPU caps; a single GitHub Actions pipeline deploys from git push in under four minutes. Structured Pino logs with request-id propagation and free-tier-safe Sentry give end-to-end traceability.',
        ],
      },
      {
        heading: 'Beyond the code',
        body: [
          'I owned the launch, not just the build: brand and positioning decisions, LOPDP-compliant legal docs, and a 7,400+ entity Ecuador veterinary prospect dataset merged from five public sources (vet directories, Agrocalidad, Google Places, the SRI RUC catastro, OpenStreetMap) with a self-served filtering dashboard. Built with Claude Code as a pair-programming assistant throughout.',
        ],
      },
    ],
    decisions: [
      {
        title: 'SSE over WebSockets',
        body: 'Real-time is one-way here. SSE rides standard HTTP/2, plays nicely with Cloudflare and firebase-admin-verified session cookies, and needs no custom auth handshake.',
      },
      {
        title: 'Cloudflare Origin Cert + IP-only firewall over Let’s Encrypt',
        body: 'A 15-year cert with no renewal failure mode, and a Cloudflare-IP-only droplet firewall that makes a leaked origin cert near-irrelevant.',
      },
    ],
  },

  aeroanalytics: {
    slug: 'aeroanalytics',
    demoVideo: '/aeroanalytics/demo.mp4',
    demoVideoMeta: {
      name: 'AeroAnalytics demo — NASA TEMPO air-quality dashboard',
      description:
        'Walkthrough of AeroAnalytics: a continent-scale 3D air-quality heatmap over NASA TEMPO satellite data with per-location dashboards and short-term forecasts. 1st place at NASA Space Apps Challenge 2025, Vancouver.',
      thumbnail: '/aeroanalytics/dark.webp',
      uploadDate: '2026-05-17',
    },
    intro:
      'A web app that ingests NASA TEMPO satellite data plus ground-based stations and visualizes air quality across North America on an interactive continent-scale map and per-location dashboard. Built in a 48-hour hackathon by a team of six; I was one of three full-stack engineers, focused on the React/TypeScript frontend.',
    context:
      'The WHO links ambient and household air pollution to roughly 7 million premature deaths a year. AeroAnalytics gives the public an at-a-glance view of AQI, key pollutants, forecasts, and hazard alerts, turning heterogeneous scientific data into something a non-expert can read in seconds.',
    highlights: [
      { label: 'Result', value: '1st of 23 teams' },
      { label: 'Event', value: 'NASA Space Apps 2025, Vancouver' },
      { label: 'Built in', value: '48 hours' },
      { label: 'Team', value: '6 engineers' },
    ],
    sections: [
      {
        heading: 'What we built',
        body: [
          'The team web-scraped NASA TEMPO data, built an ETL that harmonizes disparate sources spatially and temporally, trained a short-term forecasting model, and shipped a working demo for the judges, end to end in 48 hours.',
        ],
      },
      {
        heading: 'The frontend (my part)',
        body: [
          'The flagship view is a continent-scale 3D pollution heatmap: a deck.gl HexagonLayer with GPU-accelerated aggregation over a MapLibre dark-matter basemap, with three zoom-aware interpolations (radius, elevation, coverage) so it stays legible from continent to city scale. Clicking the map deep-links to a per-location dashboard at /dashboard/:lat/:lng. The URL is the source of truth, so views are bookmarkable and shareable.',
          'State runs on Redux Toolkit + RTK Query (30s freshness, reconnect refetch, friendly error transforms). ECharts time-series charts overlay a dashed amber forecast line that splits at the current hour, so users see the boundary between observed and predicted at a glance.',
        ],
      },
    ],
    contributions: [
      'deck.gl heatmap integration: HexagonLayer, GPU aggregation, custom lighting, zoom-aware radius/elevation/coverage interpolation, selected-point marker.',
      'CSV/API pollution data loader with per-source client-side caching.',
      'Dashboard wiring: URL params → Redux → RTK Query → ECharts, with a forecast/historical mode state machine.',
      'Sidebar, filter panel, location detail, quick-jump cities, theme toggle, responsive collapse.',
      'API client with RTK Query and a custom transformErrorResponse for friendlier empty states.',
    ],
    decisions: [
      {
        title: 'Honest scope under time pressure',
        body: 'It shipped as a technically-feasible demonstration: the +1h forecast was real, longer horizons were stubbed during the 48 hours. The architecture supports the full vision the team pitched, and it took 1st place out of 23 teams at the Vancouver event.',
      },
    ],
  },

  'bricks-and-bids': {
    slug: 'bricks-and-bids',
    intro:
      'Backend engineer on a US online auction marketplace for LEGO sets, minifigures, and original builds. A Spring Boot 3 + Java 17 + PostgreSQL service with live bidding; I authored 180 commits across 14+ months of migrations, integrations, and feature work.',
    context:
      'I joined when the codebase already ran on Braintree, GoShippo, and SendGrid/Twilio. By the time I rotated off, all three had been migrated, Kafka had been introduced for atomic bid processing, and a full CI/CD pipeline shipped JARs to a DigitalOcean droplet.',
    highlights: [
      { label: 'Role', value: 'Backend engineer' },
      { label: 'Commits', value: '180 authored' },
      { label: 'Payments', value: '5-phase zero-downtime' },
      { label: 'Tenure', value: '14+ months' },
    ],
    sections: [
      {
        heading: 'Payments migration: Braintree → Stripe',
        body: [
          'A multi-month, surgical migration with no customer-visible downtime, run in five phases: client-token endpoints, payment-method registration and bid-side authorization, charge/capture and refunds on auction win, Stripe Connect for seller onboarding and payouts, then the final cutover retiring Braintree.',
        ],
      },
      {
        heading: 'Other systems I owned',
        bullets: [
          'Shipping migrated GoShippo → EasyPost, with USPS Price Discovery (OAuth2) for live rate quoting and rebuilt buyer/seller delivery views and webhooks.',
          'Transactional email moved SendGrid+Twilio → AWS SES with Thymeleaf templates fed by 20+ Spring ApplicationEvents and @Async listeners.',
          'A Kafka request/reply bid queue behind a feature flag that absorbs traffic spikes asynchronously while preserving per-auction ordering and atomicity.',
          'Auth refactor: sign-up/login/OTP, Google OAuth2, brute-force rate limiting, Passay password policy, pending-users held in memory until OTP verification so the DB stays clean.',
          'The CI/CD pipeline: GitHub Actions → SCP/SSH → DigitalOcean droplet → systemd, with dev/prod profiles so seeders never run in production.',
        ],
      },
    ],
  },

  joinredeemer: {
    slug: 'joinredeemer',
    intro:
      'Full-stack engineer on a US Chrome extension plus companion web app that activates cashback at checkout across major e-commerce sites and recommends the best credit card per purchase. I worked the extension (TypeScript + Redux Toolkit/RTK Query), backend integration, and the analytics pipelines. My main charge was integrating retailers at scale and killing the long tail of selector, cookie, redirect, and tracking bugs.',
    context:
      'The extension runs in the background and "wakes up" only on shopping flows: it detects cart/checkout/confirmation pages via a per-retailer registry of selectors and URL regexes, redirects through an affiliate link, recommends a card, tracks the transaction, and reports to MixPanel and Everflow. Anonymous-first: a user gets an account on install with zero friction.',
    highlights: [
      { label: 'Scale', value: '30+ retailers' },
      { label: 'Cost saved', value: '42% GCP SQL (~$250/mo)' },
      { label: 'Testing', value: 'Jest → Vitest + Puppeteer' },
      { label: 'UX', value: 'Anonymous-first' },
    ],
    sections: [
      {
        heading: 'Retailer integration at scale',
        body: [
          'Each retailer is a contract: cart/checkout/thank-you selectors plus URL regexes, SPA detection where needed, multi-region subdomain handling, then end-to-end validation of activation, tracking, and card recommendations in both visible and hidden extension modes. I integrated or maintained 30+: Amazon, Best Buy, Walmart, Home Depot, Nike, eBay, AliExpress, and a long tail, plus quarterly selector audits to keep the top retailers green.',
        ],
      },
      {
        heading: 'Backend & infrastructure',
        bullets: [
          'Anonymous → registered user merge with Everflow referrer/ID de-duplication.',
          'Moved Everflow event tracking (install, sign-up, first purchase, uninstall) from frontend to backend with token-protected server-to-server postbacks and a Google-Cloud IP allowlist.',
          'Built a static outbound IP (Cloud NAT + Serverless VPC Access Connector) so partner APIs could whitelist us.',
          'Cut Google Cloud SQL fixed cost by 42% (~$250/month) by right-sizing after a usage analysis.',
          'Replaced an external WhoisXML domain-classification call with a rolling 7-day top-25 domain table, cheaper and more controllable.',
        ],
      },
      {
        heading: 'Testing',
        body: [
          'Migrated the test runner Jest → Vitest and built a Puppeteer end-to-end pipeline that simulates real navigation to reach cart/checkout, deliberately bypassing the retailer bot-detection that blocks direct-URL access.',
        ],
      },
    ],
  },

  nyma: {
    slug: 'nyma',
    intro:
      'Backend engineer on a US fashion auction and marketplace SaaS for streetwear and second-hand luxury. It began as a structured fork of the Bricks & Bids backend and evolved into its own product; I authored 172 commits across the migration and the new product surfaces.',
    context:
      'NYMA runs three flows on one item model: timed auction, fixed-price marketplace, and in-person pickup. The migration was a tracked refactor: re-namespace 50+ packages, swap the LEGO taxonomy for a fashion one (brand, collab, sub-category, size, label), and rebrand the domain end-to-end.',
    highlights: [
      { label: 'Role', value: 'Backend engineer' },
      { label: 'Commits', value: '172 authored' },
      { label: 'Observability', value: '4-phase Sentry rollout' },
      { label: 'Emails', value: '60+ event-driven' },
    ],
    sections: [
      {
        heading: 'New product surfaces',
        bullets: [
          'A full in-person Pickup sub-system: end-of-day deadlines in the buyer’s local timezone, admin actions, a "both" fulfillment type, and 9 dedicated email events.',
          'A Power Seller program: enrollment, credit transactions, scheduled renewals, admin controls.',
          'Item Authentication with automated label generation and lifecycle events.',
          'AI-assisted listing descriptions with a per-user rate limiter, and OpenGraph previews for shared listings.',
        ],
      },
      {
        heading: 'Payments & cost',
        body: [
          'Re-architected the bid flow to hold a Stripe payment only on the first bid instead of every bid (a measurable fee saving without weakening the auction guarantee), plus Affirm and direct-payment integrations and webhook idempotency fixes.',
        ],
      },
      {
        heading: 'Observability I led',
        body: [
          'A deliberate four-phase Sentry rollout across auctions, bidding, payments, shipping, pickup, and marketplace: errors plus custom metrics through a shared SentryMetricsUtil with one naming convention. I codified the conventions afterward: no string-as-exception, PII hygiene in metric tags, and mandatory captureException inside @Async and @EventListener (Spring’s default async handler doesn’t forward to Sentry).',
        ],
      },
    ],
  },

  mercator: {
    slug: 'mercator',
    intro:
      'Research intern at IRIDIA, the AI lab of the Université libre de Bruxelles, on Mercator, a modular, open-hardware swarm-robot platform built on the Sphero RVR+. I am a co-author on the platform paper, published in HardwareX 25 (2026).',
    context:
      'Mercator is a research instrument: a reproducible robot other labs can build to run swarm-robotics experiments. That makes validation the hard part: every part has to be proven to fit and integrate before it is committed to a physical build and a published bill of materials.',
    highlights: [
      { label: 'Lab', value: 'IRIDIA · ULB, Brussels' },
      { label: 'Published', value: 'HardwareX 25 (2026)' },
      { label: 'Authors', value: 'Co-author (8)' },
      { label: 'Term', value: 'Feb – May 2023' },
    ],
    sections: [
      {
        heading: 'Role',
        body: [
          'I contributed to the mechanical and electronics integration of the platform and to the validation work the paper reports, iterating the design across multiple prototype generations, from early laser-cut prototypes to the final 3D-printed builds in the publication.',
        ],
      },
      {
        heading: 'Engineering',
        body: [
          'I built a full CAD digital twin of the platform in Autodesk Inventor from day one, used to validate fit, clearances, and mounting points on screen before any part was produced. That covered the chassis plates, sensor mounts, LED diffusion ring, and the power-regulator enclosure. On the electronics side I did the power budget across the RVR battery, two Raspberry Pis, the LIDAR, Multiflex sensors, OAK-D, the DWM/UWB modules, and the LED ring, and the placement rationale for the UWB antennas to avoid RF interference with the battery electronics.',
        ],
      },
    ],
  },
};
