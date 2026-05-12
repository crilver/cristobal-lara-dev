import AnimatedContent from '../../lib/react-bits/AnimatedContent';

const ITEMS = [
  {
    org: 'Smart Twigs',
    role: 'SSr Full-stack Engineer',
    when: '2024 — Present',
    where: 'Remote (US co.)',
    note: 'Polyglot product work across LEGO auctions (Spring Boot/Kafka/Stripe), cashback infra (Node + GCP), observability rollouts (Sentry), and multi-tenant SaaS bootstrapping.',
  },
  {
    org: 'CCTB · Vancouver',
    role: 'Full-stack Web Developer Diploma (with co-op)',
    when: '2024 — 2027',
    where: 'Vancouver, BC',
    note: 'Co-op track running concurrent with paid full-stack work. Coursework done; in the work-term portion through 2027.',
  },
  {
    org: 'Hunter Ecuador',
    role: 'Software Developer',
    when: 'Feb — Jun 2024',
    where: 'Guayaquil, EC',
    note: 'First commercial full-stack role after graduation. Internal tooling and integrations.',
  },
  {
    org: 'ESPOL University',
    role: 'Software Developer',
    when: 'Oct — Dec 2023',
    where: 'Guayaquil, EC',
    note: 'University-funded engineering software contract immediately following the mechatronics degree.',
  },
  {
    org: 'IRIDIA · ULB',
    role: 'Research Intern · Mercator platform',
    when: 'Feb — May 2023',
    where: 'Brussels, BE',
    note: 'Modular swarm-robot research at the Université libre de Bruxelles AI lab. Co-author on the HardwareX 2026 paper.',
  },
  {
    org: 'ESPOL — Engineering',
    role: 'B.Sc. Mechatronics Engineering',
    when: '2017 — 2023',
    where: 'Guayaquil, EC',
    note: 'Thesis: open-source 3D-printed three-fingered robotic gripper — published in Biomimetics, MDPI (2025).',
  },
];

export default function Experience() {
  return (
    <section id="experience" className="relative px-6 py-32 md:px-12 md:py-48">
      <div className="mx-auto max-w-[1400px]">
        <header className="mb-20 flex flex-wrap items-end justify-between gap-6 border-b border-border-subtle pb-8">
          <AnimatedContent direction="vertical" distance={30} duration={0.8} threshold={0.1}>
            <div>
              <p className="eyebrow mb-4">
                <span className="text-accent">§</span> Section 03 — Experience
              </p>
              <h2
                className="font-display font-light leading-[0.95] tracking-tight"
                style={{ fontSize: 'var(--text-display-2)' }}
              >
                The timeline<span className="text-accent">.</span>
              </h2>
            </div>
          </AnimatedContent>
          <AnimatedContent direction="vertical" distance={30} duration={0.8} delay={0.15} threshold={0.1}>
            <a
              href="/Cristobal_Lara_Resume.pdf"
              className="inline-flex items-center gap-3 rounded-full border border-border-subtle px-5 py-3 font-mono text-xs uppercase tracking-[0.18em] text-fg transition-colors hover:border-accent hover:text-accent"
            >
              Download CV ↓
            </a>
          </AnimatedContent>
        </header>

        <ol className="space-y-12">
          {ITEMS.map((it, i) => (
            <AnimatedContent
              key={it.org}
              direction="horizontal"
              distance={-60}
              duration={0.9}
              delay={i * 0.06}
              threshold={0.15}
            >
              <li className="grid gap-4 border-b border-border-subtle pb-12 last:border-0 md:grid-cols-12 md:gap-8">
                <div className="font-mono text-xs uppercase tracking-[0.18em] text-muted-fg md:col-span-2">
                  <span className="text-accent">0{i + 1}</span>
                  <span className="mx-2">/</span>
                  {it.when}
                </div>
                <div className="md:col-span-4">
                  <p className="font-display text-2xl font-light tracking-tight">{it.org}</p>
                  <p className="mt-1 text-sm text-muted-fg">{it.where}</p>
                </div>
                <div className="md:col-span-6">
                  <p className="text-lg text-fg">{it.role}</p>
                  <p className="mt-2 text-muted-fg">{it.note}</p>
                </div>
              </li>
            </AnimatedContent>
          ))}
        </ol>
      </div>
    </section>
  );
}
