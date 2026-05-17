export type ProjectStatus = 'live' | 'published' | 'shipped' | 'archived';

export interface Project {
  slug: string;
  title: string;
  /** One-line positioning — appears under the title on the home tile. */
  tagline: string;
  /** Cristobal's role on this project. */
  role: string;
  /** Headline year or year-range. */
  year: string;
  /** Hero status pill ("live", "published", etc). */
  status: ProjectStatus;
  /** Short stack list — 3-6 entries, shown as small mono tags. */
  stack: string[];
  /** Outbound links shown on the case-study page. */
  links?: {
    live?: string;
    repo?: string;
    paper?: string;
    caseStudy?: boolean; // whether /projects/[slug] case study exists
  };
  /** Featured (large tile) vs supporting (standard card). */
  featured?: boolean;
  /** AI-engineering badge — surfaces an amber "AI" tag on the tile. */
  ai?: boolean;
}

export const projects: Project[] = [
  {
    slug: 'coravet',
    title: 'CoraVet',
    tagline: 'Multi-tenant veterinary SaaS, sole engineer, live in production.',
    role: 'Founder · Full-stack',
    year: '2025 — now',
    status: 'live',
    stack: ['NestJS 11', 'Prisma 7', 'PostgreSQL', 'Astro 5', 'React 19', 'Cloudflare R2'],
    links: {
      live: 'https://agroveterinaria-coravet.com',
      caseStudy: true,
    },
    featured: true,
  },
  {
    slug: 'aeroanalytics',
    title: 'AeroAnalytics',
    tagline:
      '1st place — NASA Space Apps Challenge 2025, Vancouver (23 teams). Continent-scale air-quality dashboard over NASA TEMPO data.',
    role: 'Full-stack Engineer',
    year: '2025',
    status: 'shipped',
    stack: ['React 19', 'TypeScript', 'deck.gl 9', 'MapLibre GL', 'Redux Toolkit', 'ECharts'],
    links: {
      caseStudy: true,
    },
    featured: true,
  },
  {
    slug: 'bricks-and-bids',
    title: 'Bricks & Bids',
    tagline: 'LEGO live-auction platform — Stripe migration in 5 zero-downtime phases, Kafka request/reply bid queue.',
    role: 'Backend Engineer',
    year: '2024 — 2025',
    status: 'shipped',
    stack: ['Spring Boot 3.x', 'Java 17', 'Kafka', 'Stripe', 'PostgreSQL'],
    links: { caseStudy: true },
  },
  {
    slug: 'joinredeemer',
    title: 'JoinRedeemer',
    tagline: 'Chrome cashback extension across 30+ retailers — cut GCP SQL costs by 42% through query and infra rework.',
    role: 'Full-stack Engineer',
    year: '2024 — 2025',
    status: 'shipped',
    stack: ['TypeScript', 'Node.js', 'GCP', 'PostgreSQL', 'Chrome Extension APIs'],
    links: { caseStudy: true },
  },
  {
    slug: 'nyma',
    title: 'NYMA',
    tagline: 'Fashion-streetwear e-commerce — led the 4-phase Sentry observability rollout that surfaced silent prod failures.',
    role: 'Full-stack Engineer',
    year: '2024 — 2025',
    status: 'shipped',
    stack: ['TypeScript', 'Node.js', 'Sentry', 'PostgreSQL', 'CI/CD'],
    links: { caseStudy: true },
  },
  {
    slug: 'mercator',
    title: 'Mercator',
    tagline:
      'Modular swarm-robot platform built at IRIDIA, ULB. Co-author on the HardwareX 2026 paper (4th of 8 authors).',
    role: 'Research Intern · Co-author',
    year: '2023',
    status: 'published',
    stack: ['Python', 'ROS', 'Autodesk Inventor', 'Sphero RVR+', 'UWB'],
    links: {
      paper: 'https://doi.org/10.1016/j.ohx.2026.e00751',
      caseStudy: true,
    },
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const supportingProjects = projects.filter((p) => !p.featured);
