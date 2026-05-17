import AnimatedContent from '../../lib/react-bits/AnimatedContent';
import TiltedCard from '../../lib/react-bits/TiltedCard';
import GlareHover from '../../lib/react-bits/GlareHover';
import { featuredProjects, supportingProjects, type Project } from '../../data/projects';

/** Build an SVG data URL with a project number and subtle amber accent.
 *  Used as the imageSrc for TiltedCard when we don't have a real screenshot yet. */
function placeholderImage(num: string, title: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#1a1a1d"/>
        <stop offset="100%" stop-color="#0a0a0b"/>
      </linearGradient>
      <radialGradient id="glow" cx="0.8" cy="0.2" r="0.6">
        <stop offset="0%" stop-color="#ffb400" stop-opacity="0.4"/>
        <stop offset="100%" stop-color="#ffb400" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#bg)"/>
    <rect width="100%" height="100%" fill="url(#glow)"/>
    <text x="48" y="120" font-family="Geist Mono, ui-monospace, monospace" font-size="14" letter-spacing="3" fill="#ffb400" text-transform="uppercase">N°${num}</text>
    <text x="48" y="920" font-family="Fraunces, Georgia, serif" font-weight="300" font-size="64" fill="#f5f2ec" letter-spacing="-1">${title}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function FeaturedTile({ project, index }: { project: Project; index: number }) {
  const num = `0${index + 1}`;
  return (
    <AnimatedContent direction="vertical" distance={60} duration={1} delay={index * 0.15} threshold={0.1}>
      <a href={`#project-${project.slug}`} className="block group">
        <TiltedCard
          imageSrc={placeholderImage(num, project.title)}
          altText={project.title}
          captionText={`${project.role} · ${project.year}`}
          containerHeight="480px"
          containerWidth="100%"
          imageHeight="480px"
          imageWidth="100%"
          rotateAmplitude={9}
          scaleOnHover={1.04}
          showMobileWarning={false}
          showTooltip
          displayOverlayContent
          overlayContent={
            <div className="pointer-events-none relative flex h-[480px] w-full flex-col justify-between rounded-[15px] p-8 md:p-10">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
                  N°{num}
                </span>
                <span className="rounded-full border border-border-subtle bg-bg/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-fg backdrop-blur-sm">
                  {project.status}
                </span>
              </div>
              <div>
                <h3 className="font-display text-4xl font-light tracking-tight text-fg md:text-5xl">
                  {project.title}
                  <span className="text-accent">.</span>
                </h3>
                <p className="mt-4 max-w-prose text-base text-fg/85 md:text-lg">{project.tagline}</p>
                <ul className="mt-6 flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-fg">
                  {project.stack.slice(0, 5).map((s) => (
                    <li
                      key={s}
                      className="rounded-full border border-border-subtle bg-bg/40 px-3 py-1 backdrop-blur-sm"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              {project.ai && (
                <span
                  className="absolute right-8 top-8 rounded-full px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em]"
                  style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-bg)' }}
                >
                  AI
                </span>
              )}
            </div>
          }
        />
      </a>
    </AnimatedContent>
  );
}

function SupportingCard({ project, index }: { project: Project; index: number }) {
  const num = `0${index + 3}`;
  return (
    <AnimatedContent direction="vertical" distance={40} duration={0.8} delay={index * 0.08} threshold={0.1}>
      <a href={`#project-${project.slug}`} className="block">
        <GlareHover
          width="100%"
          height="100%"
          background="var(--color-surface)"
          borderColor="var(--color-border-subtle)"
          borderRadius="12px"
          glareColor="#ffb400"
          glareOpacity={0.18}
          glareAngle={-35}
          glareSize={300}
          transitionDuration={700}
          className="!grid-cols-1 !place-items-stretch hover:!border-accent transition-colors"
        >
          <div className="flex h-full w-full flex-col p-6">
            <div className="mb-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-muted-fg">
              <span className="text-accent">N°{num}</span>
              <span>{project.year}</span>
            </div>
            <h3 className="font-display text-2xl font-light tracking-tight text-fg">
              {project.title}
            </h3>
            <p className="mt-3 flex-1 text-sm text-fg/70">{project.tagline}</p>
            <ul className="mt-4 flex flex-wrap gap-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-muted-fg">
              {project.stack.slice(0, 3).map((s) => (
                <li key={s} className="rounded-full border border-border-subtle px-2 py-0.5">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </GlareHover>
      </a>
    </AnimatedContent>
  );
}

export default function Work() {
  return (
    <section id="work" className="relative px-6 py-20 md:px-12 md:py-28">
      <div className="mx-auto max-w-[1400px]">
        <header className="mb-20 flex flex-wrap items-end justify-between gap-6 border-b border-border-subtle pb-8">
          <AnimatedContent direction="vertical" distance={30} duration={0.8} threshold={0.1}>
            <div>
              <p className="eyebrow mb-4">
                <span className="text-accent">§</span> Section 01 — Work
              </p>
              <h2
                className="font-display font-light leading-[0.95] tracking-tight"
                style={{ fontSize: 'var(--text-display-2)' }}
              >
                Six projects
                <br />
                on the table<span className="text-accent">.</span>
              </h2>
            </div>
          </AnimatedContent>
          <AnimatedContent direction="vertical" distance={30} duration={0.8} delay={0.1} threshold={0.1}>
            <p className="max-w-md text-muted-fg">
              From a multi-tenant SaaS running live in Ecuador to a continent-scale air-quality
              dashboard built in 48 hours. Each tile opens a full case study.
            </p>
          </AnimatedContent>
        </header>

        {/* Featured row — TiltedCard with 3D parallax */}
        <div className="grid gap-8 md:grid-cols-2 md:gap-12">
          {featuredProjects.map((p, i) => (
            <FeaturedTile key={p.slug} project={p} index={i} />
          ))}
        </div>

        {/* Supporting cards — GlareHover with cursor-tracking sheen */}
        <div className="mt-12 grid gap-6 md:mt-16 md:grid-cols-2 lg:grid-cols-4">
          {supportingProjects.map((p, i) => (
            <SupportingCard key={p.slug} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
