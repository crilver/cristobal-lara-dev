import AnimatedContent from '../../lib/react-bits/AnimatedContent';
import ScrollReveal from '../../lib/react-bits/ScrollReveal';

const META = [
  { label: 'Based', value: 'Vancouver, BC' },
  { label: 'From', value: 'Ecuador' },
  { label: 'Status', value: 'Open to roles', accent: true },
  { label: 'Permit', value: 'CO-OP, 12+ mo' },
];

export default function About() {
  return (
    <section id="about" className="relative px-6 py-16 md:px-12 md:py-20">
      <div className="mx-auto grid max-w-[1400px] gap-12 md:grid-cols-12 md:gap-16">
        <AnimatedContent direction="vertical" distance={40} duration={0.9} threshold={0.1} className="md:col-span-5">
          <header>
            <p className="eyebrow mb-4">
              <span className="text-accent">//</span> Section 02 · About
            </p>
            <h2
              className="font-display font-light leading-[0.95] tracking-tight"
              style={{ fontSize: 'var(--text-display-2)' }}
            >
              How I got
              <br />
              here<span className="text-accent">.</span>
            </h2>
          </header>
        </AnimatedContent>

        <div className="md:col-span-7">
          <div className="space-y-2">
            <ScrollReveal
              baseOpacity={0.15}
              enableBlur
              blurStrength={3}
              baseRotation={2}
              textClassName="!text-[1.15rem] md:!text-[1.35rem] !font-normal !leading-[1.6] text-fg/90 font-sans"
            >
              I'm a full-stack web developer based in Vancouver. I design, build, and operate
              production web systems end-to-end: frontend, backend, infrastructure, observability,
              security.
            </ScrollReveal>

            <ScrollReveal
              baseOpacity={0.15}
              enableBlur
              blurStrength={3}
              baseRotation={2}
              textClassName="!text-[1.15rem] md:!text-[1.35rem] !font-normal !leading-[1.6] text-fg/90 font-sans"
            >
              Current stack: NestJS, Java, React 19, PostgreSQL, AWS / GCP / Cloudflare, with AI
              woven into the development loop: Claude API, MCP servers, agent skills. Nothing in
              that chain is out of scope for me, schema and APIs through to CDN, CI/CD, and
              observability.
            </ScrollReveal>

            <ScrollReveal
              baseOpacity={0.15}
              enableBlur
              blurStrength={3}
              baseRotation={2}
              textClassName="!text-[1.15rem] md:!text-[1.35rem] !font-normal !leading-[1.6] text-fg/90 font-sans"
            >
              The foundation underneath: a mechatronics engineering degree from ESPOL, a research
              stint at IRIDIA (Université libre de Bruxelles), two peer-reviewed publications, and
              five years leading IEEE Robotics & Automation Society. The engineering-systems
              background is why I think end-to-end, not the headline.
            </ScrollReveal>
          </div>

          <AnimatedContent direction="vertical" distance={30} duration={0.8} delay={0.1} threshold={0.1}>
            <div className="mt-12 grid grid-cols-2 gap-6 border-t border-border-subtle pt-8 font-mono text-xs uppercase tracking-[0.16em] md:grid-cols-4">
              {META.map((m) => (
                <div key={m.label}>
                  <p className="text-muted-fg">{m.label}</p>
                  <p className={`mt-1 ${m.accent ? 'text-accent' : 'text-fg'}`}>{m.value}</p>
                </div>
              ))}
            </div>
          </AnimatedContent>
        </div>
      </div>
    </section>
  );
}
