export const site = {
  name: 'Cristobal Lara',
  shortName: 'Cristobal',
  url: 'https://cristobal-lara.dev',
  tagline: 'Full-stack web developer · cloud-native',
  description:
    'Cristobal Lara is a full-stack web developer in Vancouver. He designs, builds, and operates production web systems end-to-end, cloud-native, with a mechatronics engineering foundation.',
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
  { label: 'Work', href: '/#work' },
  { label: 'About', href: '/#about' },
  { label: 'Experience', href: '/#experience' },
  { label: 'Contact', href: '/#contact' },
] as const;
