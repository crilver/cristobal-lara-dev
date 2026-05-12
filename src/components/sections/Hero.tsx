import { Suspense, lazy } from 'react';
import AnimatedContent from '../../lib/react-bits/AnimatedContent';
import SplitText from '../../lib/react-bits/SplitText';
import StarBorder from '../../lib/react-bits/StarBorder';

// Heavy 3D/WebGL components — lazy-loaded so they don't block initial paint.
const SoftAurora = lazy(() => import('../../lib/react-bits/SoftAurora'));
const CustomLanyard = lazy(() => import('../CustomLanyard'));

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
      className="relative isolate flex min-h-[100dvh] flex-col overflow-hidden pt-24 md:pt-28"
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

      <div className="relative mx-auto grid w-full max-w-[1400px] grid-cols-1 items-center gap-12 px-6 py-12 md:grid-cols-12 md:gap-8 md:px-12 md:py-16 lg:gap-16">
        {/* Left: type column */}
        <div className="md:col-span-7 lg:col-span-7">
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

          {/* Headline — character-by-character with GSAP SplitText */}
          <h1
            className="amber-hero-dot font-display font-light leading-[0.92] tracking-tight"
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
            <SplitText
              text="developer."
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

          {/* CTA row */}
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

        {/* Right: Lanyard with custom card */}
        <div className="relative md:col-span-5 lg:col-span-5">
          <AnimatedContent
            direction="vertical"
            distance={50}
            duration={1.2}
            delay={0.3}
            threshold={0}
          >
            <div className="relative h-[520px] w-full md:h-[640px] lg:h-[720px]">
              <Suspense
                fallback={
                  <div className="flex h-full w-full items-center justify-center font-mono text-xs uppercase tracking-[0.18em] text-muted-fg">
                    Loading card…
                  </div>
                }
              >
                <CustomLanyard />
              </Suspense>
            </div>
            <p className="mt-2 text-center font-mono text-[10px] uppercase tracking-[0.22em] text-muted-fg">
              <span style={{ color: 'var(--color-accent)' }}>↑</span> drag the card
            </p>
          </AnimatedContent>
        </div>
      </div>

      {/* Footer ticker — three concrete facts */}
      <AnimatedContent
        direction="vertical"
        distance={30}
        duration={0.9}
        delay={1.2}
        threshold={0}
        className="relative w-full"
      >
        <ul className="mx-auto mt-8 grid max-w-[1400px] gap-4 border-t border-border-subtle px-6 py-8 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-fg md:grid-cols-3 md:gap-12 md:px-12">
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
    </section>
  );
}
