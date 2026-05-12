import { Suspense, lazy } from 'react';
import AnimatedContent from '../../lib/react-bits/AnimatedContent';
import SplitText from '../../lib/react-bits/SplitText';
import StarBorder from '../../lib/react-bits/StarBorder';
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
      className="relative isolate min-h-[100dvh] overflow-hidden"
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

      {/* Text column — sits on the left, constrained so it never collides
          with the Lanyard canvas on desktop. */}
      <div className="relative mx-auto w-full max-w-[1400px] px-6 pt-28 pb-12 md:px-12 md:pt-32 md:pb-20">
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
              <StarBorder
                as="a"
                href="#work"
                color="#ffb400"
                speed="5s"
                className="font-mono"
              >
                <span className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.18em]">
                  Browse work <span aria-hidden>↓</span>
                </span>
              </StarBorder>

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

      {/* Footer ticker — three concrete facts. Sits at the bottom of the
          section, constrained to the left so it doesn't underlay the Lanyard. */}
      <div className="absolute inset-x-0 bottom-0 px-6 pb-8 md:px-12 md:pb-10">
        <AnimatedContent
          direction="vertical"
          distance={30}
          duration={0.9}
          delay={1.2}
          threshold={0}
        >
          <ul className="mx-auto grid max-w-[1400px] gap-4 border-t border-border-subtle pt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-fg md:max-w-[55%] md:grid-cols-3 md:gap-8">
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
