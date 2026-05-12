export const site = {
  name: 'Cristobal Lara',
  shortName: 'Cristobal',
  url: 'https://cristobal-lara.dev',
  tagline: 'Full-stack engineer shipping polyglot systems',
  description:
    'Cristobal Lara is a full-stack engineer in Vancouver building polyglot production systems — multi-tenant SaaS, real-time event pipelines, and the occasional swarm robot.',
  ogImage: '/og.jpg',
  locale: 'en',
  email: 'cristobal.lara.dev@gmail.com',
  socials: {
    github: 'https://github.com/crilver',
    linkedin: 'https://www.linkedin.com/in/cristobal-lara',
  },
  cvHref: '/Cristobal_Lara_Resume.pdf',
} as const;

export const nav = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
] as const;
