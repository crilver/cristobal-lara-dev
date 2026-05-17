import { Suspense, lazy } from 'react';
import AnimatedContent from '../../lib/react-bits/AnimatedContent';
import SplitText from '../../lib/react-bits/SplitText';
import LanyardOverlay from '../LanyardOverlay';

// Heavy 3D/WebGL background — lazy-loaded so it doesn't block initial paint.
const SoftAurora = lazy(() => import('../../lib/react-bits/SoftAurora'));

const FACTS = [
  {
    num: '01',
    body: 'Shipping production SaaS — sole engineer, live tenant in Ecuador.',
  },
  {
    num: '02',
    body: 'Co-author × 2 — HardwareX 2026 & Biomimetics MDPI 2025.',
  },
  {
    num: '03',
    body: '1st place — NASA Space Apps Challenge 2025, Vancouver.',
  },
];

export default function Hero() {
  return (
    <section
      id="top"
      className="relative isolate flex min-h-[100dvh] flex-col overflow-hidden"
      aria-label="Introduction"
    >
      {/* Animated aurora background, amber palette */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-80">
        <Suspense fallback={null}>
          <SoftAurora
            color1="#ffb400"
            color2="#ff8c42"
            brightness={0.75}
            speed={0.5}
            scale={1.4}
            noiseFrequency={2.0}
            noiseAmplitude={1.1}
            bandHeight={0.45}
            bandSpread={1.1}
            octaveDecay={0.18}
            layerOffset={4}
            colorSpeed={0.6}
            enableMouseInteraction
            mouseInfluence={0.25}
          />
        </Suspense>
      </div>

      {/* Subtle dark vignette so type stays legible against the aurora */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 0%, rgba(10,10,11,0.35) 55%, var(--color-bg) 100%)',
        }}
      />

      {/* Lanyard as an absolute child of the Hero — scrolls with the
          hero so it appears "pulled to the top" as the user scrolls
          down. Sits at z-30 within Hero's stacking context (above text
          so the card overlays anything beneath it). The text column on
          the left leaves room for the lanyard via max-w-[55%]. */}
      <LanyardOverlay />

      {/* Text column — vertically centered in the hero so the section
          isn't top-loaded with a dead void below. flex-1 lets it take all
          space between the navbar and the bottom ticker strip. */}
      <div className="relative mx-auto flex w-full max-w-[1400px] flex-1 items-center px-6 pt-28 md:px-12 md:pt-24">
        <div className="md:max-w-[55%] lg:max-w-[55%]">
          <AnimatedContent
            direction="horizontal"
            distance={-40}
            duration={0.9}
            threshold={0}
          >
            <p className="eyebrow mb-8 flex items-center gap-3">
              <span
                aria-hidden
                className="inline-block h-px w-8"
                style={{ backgroundColor: 'var(--color-accent)' }}
              />
              Portfolio · CL · Vancouver · 2026
            </p>
          </AnimatedContent>

          {/* Headline — split per char with GSAP. Amber period kept outside
              SplitText so the per-split last-char rule never grabs the "k"
              of "Full-stack". */}
          <h1
            className="font-display font-light leading-[0.92] tracking-tight"
            style={{ fontSize: 'var(--text-display-1)' }}
          >
            <SplitText
              text="Full-stack"
              tag="span"
              className="block"
              splitType="chars"
              delay={30}
              duration={0.9}
              ease="power4.out"
              from={{ y: 80, opacity: 0 }}
              to={{ y: 0, opacity: 1 }}
              threshold={0}
              rootMargin="0px"
              textAlign="left"
            />
            <span className="block">
              <SplitText
                text="developer"
                tag="span"
                className="inline-block"
                splitType="chars"
                delay={30}
                duration={0.9}
                ease="power4.out"
                from={{ y: 80, opacity: 0 }}
                to={{ y: 0, opacity: 1 }}
                threshold={0}
                rootMargin="0px"
                textAlign="left"
              />
              <span style={{ color: 'var(--color-accent)' }}>.</span>
            </span>
          </h1>

          <AnimatedContent
            direction="vertical"
            distance={30}
            duration={0.9}
            delay={0.6}
            threshold={0}
          >
            <p className="mt-10 max-w-xl text-balance text-lg leading-snug text-fg/85 md:text-xl">
              Designing and shipping production web systems —{' '}
              <span className="text-accent">cloud-native</span>,{' '}
              <span className="text-accent">AI-augmented</span>, end-to-end. From Vancouver.
            </p>
          </AnimatedContent>

          <AnimatedContent
            direction="vertical"
            distance={20}
            duration={0.8}
            delay={0.9}
            threshold={0}
          >
            <div className="mt-12 flex flex-wrap items-center gap-4">
              {/* Primary CTA — plain anchor (StarBorder was swallowing the
                  navigation entirely and its infinite animation destabilized
                  the page). Filled amber to keep it the primary action. */}
              <a
                href="#work"
                className="group inline-flex items-center gap-3 rounded-[20px] border border-accent bg-accent px-6 py-4 font-mono text-xs uppercase tracking-[0.18em] text-bg transition-all hover:bg-transparent hover:text-accent"
              >
                Browse work
                <span aria-hidden className="transition-transform group-hover:translate-y-0.5">
                  ↓
                </span>
              </a>

              <a
                href="#contact"
                className="group inline-flex items-center gap-3 rounded-[20px] border border-border-subtle px-6 py-4 font-mono text-xs uppercase tracking-[0.18em] text-fg transition-all hover:border-accent hover:text-accent"
              >
                Get in touch
                <span aria-hidden className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </a>
            </div>
          </AnimatedContent>
        </div>

      </div>

      {/* Footer ticker — three concrete facts. In normal flow at the
          bottom of the flex column (no absolute pinning), so it stays
          visually connected to the content with no dead gap. */}
      <div className="relative mx-auto w-full max-w-[1400px] px-6 pb-8 md:px-12 md:pb-10">
        <AnimatedContent
          direction="vertical"
          distance={30}
          duration={0.9}
          delay={1.2}
          threshold={0}
        >
          <ul className="grid gap-4 border-t border-border-subtle pt-6 mt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-fg md:max-w-[55%] md:grid-cols-3 md:gap-8">
            {FACTS.map((f) => (
              <li key={f.num} className="flex items-start gap-3">
                <span
                  aria-hidden
                  style={{ color: 'var(--color-accent)' }}
                  className="shrink-0 font-mono"
                >
                  {f.num}
                </span>
                <span className="leading-snug text-fg/70">{f.body}</span>
              </li>
            ))}
          </ul>
        </AnimatedContent>
      </div>
    </section>
  );
}
