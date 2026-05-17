import AnimatedContent from '../../lib/react-bits/AnimatedContent';
import GlareHover from '../../lib/react-bits/GlareHover';
import { site } from '../../data/site';

const CHANNELS = [
  { label: 'Email', value: site.email, href: `mailto:${site.email}` },
  { label: 'LinkedIn', value: 'in/cristobal-lara', href: site.socials.linkedin, external: true },
  { label: 'GitHub', value: 'github.com/crilver', href: site.socials.github, external: true },
];

export default function Contact() {
  return (
    <section id="contact" className="relative px-6 py-20 md:px-12 md:py-28">
      <div className="mx-auto max-w-[1400px]">
        <AnimatedContent direction="vertical" distance={40} duration={0.9} threshold={0.1}>
          <p className="eyebrow mb-4">
            <span className="text-accent">§</span> Section 04 · Contact
          </p>
          <h2
            className="font-display font-light leading-[0.9] tracking-tight"
            style={{ fontSize: 'var(--text-display-1)' }}
          >
            Let's talk<span className="text-accent">.</span>
          </h2>
        </AnimatedContent>

        <AnimatedContent direction="vertical" distance={30} duration={0.8} delay={0.15} threshold={0.1}>
          <p className="mt-10 max-w-2xl text-xl text-fg/85">
            Open to full-stack, frontend, backend, cloud, or AI-engineering roles in Vancouver.
            Mid to senior, 75K+ CAD. Remote across Canada works too.
          </p>
        </AnimatedContent>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {CHANNELS.map((c, i) => (
            <AnimatedContent
              key={c.label}
              direction="vertical"
              distance={40}
              duration={0.8}
              delay={0.25 + i * 0.08}
              threshold={0.1}
            >
              <a
                href={c.href}
                target={c.external ? '_blank' : undefined}
                rel={c.external ? 'noopener' : undefined}
                className="block group"
              >
                <GlareHover
                  width="100%"
                  height="auto"
                  background="var(--color-surface)"
                  borderColor="var(--color-border-subtle)"
                  borderRadius="16px"
                  glareColor="#ffb400"
                  glareOpacity={0.22}
                  glareAngle={-35}
                  glareSize={300}
                  transitionDuration={700}
                  className="!grid-cols-1 !place-items-stretch hover:!border-accent transition-colors"
                >
                  <div className="flex items-center justify-between p-8">
                    <div>
                      <p className="eyebrow mb-2 text-accent">{c.label}</p>
                      <p className="font-mono text-sm md:text-base">{c.value}</p>
                    </div>
                    <span
                      aria-hidden
                      className="font-mono text-2xl transition-transform group-hover:translate-x-1 group-hover:text-accent"
                    >
                      →
                    </span>
                  </div>
                </GlareHover>
              </a>
            </AnimatedContent>
          ))}
        </div>

        <AnimatedContent direction="vertical" distance={30} duration={0.8} delay={0.55} threshold={0.1}>
          <footer className="mt-24 flex flex-wrap items-end justify-between gap-6 border-t border-border-subtle pt-8 font-mono text-xs uppercase tracking-[0.18em] text-muted-fg">
            <p>
              © 2026 Cristobal Lara <span className="text-accent">·</span> Vancouver, BC
            </p>
            <p>
              Built with Astro, React, Tailwind, React Bits{' '}
              <span className="text-accent">·</span> hosted on Cloudflare
            </p>
          </footer>
        </AnimatedContent>
      </div>
    </section>
  );
}
