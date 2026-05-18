import AnimatedContent from '../../lib/react-bits/AnimatedContent';
import GlareHover from '../../lib/react-bits/GlareHover';
import DeviceMockup from '../DeviceMockup';
import { featuredProjects, supportingProjects, type Project } from '../../data/projects';

/** Featured project — larger, content-led card. Same GlareHover treatment
 *  as the supporting cards (which the design intentionally keeps), just
 *  scaled up with the full tagline, more stack tags, status + AI badges.
 *  No imagery, no 3D tilt, no cursor tooltip. */
function FeaturedCard({ project, index }: { project: Project; index: number }) {
  const num = `0${index + 1}`;
  // CoraVet gets the real product device mockup; AeroAnalytics gets a
  // theme-aware screenshot. Both as dimmed, scrimmed backgrounds that
  // never change the card's compact dimensions.
  const hasMockup = project.slug === 'coravet';
  const hasImage = project.slug === 'aeroanalytics';
  const hasBg = hasMockup || hasImage;
  const cardClass =
    'block' + (hasMockup ? ' cv-card' : '') + (hasImage ? ' aa-card' : '');
  return (
    <AnimatedContent direction="vertical" distance={60} duration={1} delay={index * 0.15} threshold={0.1}>
      <a href={`/projects/${project.slug}`} className={cardClass}>
        <GlareHover
          width="100%"
          height="100%"
          background="var(--color-surface)"
          borderColor="var(--color-border-subtle)"
          borderRadius="16px"
          glareColor="#ffb400"
          glareOpacity={0.2}
          glareAngle={-35}
          glareSize={320}
          transitionDuration={700}
          className="!grid-cols-1 !place-items-stretch transition-colors hover:!border-accent"
        >
          <div className="relative h-full w-full">
            {/* Background device mockup (CoraVet only) — scaled down,
                dimmed, bleeding off the right. A left→right scrim keeps
                the foreground text fully readable. The card keeps its
                original compact dimensions; the mockup never affects
                layout/height because it's absolutely positioned. */}
            {hasBg && (
              <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
                {hasMockup && (
                  <div className="absolute right-[-16%] top-1/2 w-[80%] -translate-y-1/2 opacity-[0.55] md:right-[-12%] md:w-[72%]">
                    <DeviceMockup
                      laptopSrc="/coravet/dashboard.webp"
                      phoneSrc="/coravet/mobile.webp"
                      laptopAlt="CoraVet operational dashboard"
                      phoneAlt="CoraVet mobile customer view"
                    />
                  </div>
                )}
                {hasImage && (
                  <>
                    <img
                      src="/aeroanalytics/dark.webp"
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="aa-bg aa-bg-dark absolute right-0 top-1/2 h-auto w-[82%] rounded-l-xl opacity-50 md:w-[72%]"
                    />
                    <img
                      src="/aeroanalytics/light.webp"
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="aa-bg aa-bg-light absolute right-0 top-1/2 h-auto w-[82%] rounded-l-xl opacity-60 md:w-[72%]"
                    />
                  </>
                )}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(90deg, var(--color-surface) 0%, color-mix(in oklab, var(--color-surface) 72%, transparent) 42%, transparent 75%)',
                  }}
                />
                <div
                  className="absolute inset-x-0 bottom-0 h-2/5"
                  style={{
                    background:
                      'linear-gradient(0deg, var(--color-surface) 0%, transparent 100%)',
                  }}
                />
              </div>
            )}

            {/* Foreground content — identical structure & dimensions for
                both featured cards so they stay symmetric. */}
            <div className="relative flex min-h-[320px] w-full flex-col justify-between gap-10 p-8 md:min-h-[360px] md:p-10">
              <div className="flex items-start justify-between gap-4">
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
                  N°{num}
                </span>
                <div className="flex items-center gap-2">
                  {project.ai && (
                    <span
                      className="rounded-full px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em]"
                      style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-bg)' }}
                    >
                      AI
                    </span>
                  )}
                  <span className="rounded-full border border-border-subtle bg-bg/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-fg backdrop-blur-sm">
                    {project.status}
                  </span>
                </div>
              </div>
              <div>
                <h3 className="font-display text-4xl font-light tracking-tight text-fg md:text-5xl">
                  {project.title}
                  <span className="text-accent">.</span>
                </h3>
                <p className="mt-4 text-base text-fg/85 md:text-lg">
                  {project.tagline}
                </p>
                <ul className="mt-6 flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-fg">
                  {project.stack.slice(0, 5).map((s) => (
                    <li
                      key={s}
                      className="rounded-full border border-border-subtle bg-bg/30 px-3 py-1 backdrop-blur-sm"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </GlareHover>
      </a>
    </AnimatedContent>
  );
}

/** Supporting project card — kept exactly as the design intends. */
function SupportingCard({ project, index }: { project: Project; index: number }) {
  const num = `0${index + 3}`;
  return (
    <AnimatedContent direction="vertical" distance={40} duration={0.8} delay={index * 0.08} threshold={0.1}>
      <a href={`/projects/${project.slug}`} className="block">
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
    <section id="work" className="relative px-6 py-16 md:px-12 md:py-20">
      <div className="mx-auto max-w-[1400px]">
        {/* Cohesive header — eyebrow → title → description stacked and
            left-aligned, constrained width. No far-right split. */}
        <header className="mb-12 max-w-3xl border-b border-border-subtle pb-8">
          <AnimatedContent direction="vertical" distance={30} duration={0.8} threshold={0.1}>
            <p className="eyebrow mb-4">
              <span className="text-accent">//</span> Section 01 · Work
            </p>
            <h2
              className="font-display font-light leading-[0.95] tracking-tight"
              style={{ fontSize: 'var(--text-display-2)' }}
            >
              Selected work<span className="text-accent">.</span>
            </h2>
            <p className="mt-6 max-w-xl text-muted-fg md:text-lg">
              From a multi-tenant SaaS running live in Ecuador to a continent-scale air-quality
              dashboard built in 48 hours. Each opens a full case study.
            </p>
          </AnimatedContent>
        </header>

        {/* Featured projects — large content-led cards */}
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
          {featuredProjects.map((p, i) => (
            <FeaturedCard key={p.slug} project={p} index={i} />
          ))}
        </div>

        {/* Supporting projects — unchanged */}
        <div className="mt-10 grid gap-6 md:mt-14 md:grid-cols-2 lg:grid-cols-4">
          {supportingProjects.map((p, i) => (
            <SupportingCard key={p.slug} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
