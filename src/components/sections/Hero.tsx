import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  MotionConfig,
  useReducedMotion,
} from 'motion/react';

const FACTS = [
  { num: '01', body: 'Shipping production SaaS — sole engineer, live tenant in Ecuador.' },
  { num: '02', body: 'Co-author × 2 — HardwareX 2026, Biomimetics MDPI 2025.' },
  { num: '03', body: '1st place — NASA Space Apps Challenge 2025, Vancouver.' },
];

const HEADLINE_PARTS = ['A', 'polyglot', 'engineer'];
const TAGLINE_PARTS = [
  'Shipping software,',
  'hardware,',
  'and the swarms',
  'in between',
  '— from Vancouver.',
];

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const headshotWrapRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Mouse-tilt on the headshot frame
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useTransform(my, [-200, 200], [6, -6]);
  const rotateY = useTransform(mx, [-200, 200], [-6, 6]);
  const rx = useSpring(rotateX, { stiffness: 180, damping: 22, mass: 0.6 });
  const ry = useSpring(rotateY, { stiffness: 180, damping: 22, mass: 0.6 });

  // Scroll-driven parallax / fade
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const headshotY = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 1, 0]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - rect.left - rect.width / 2);
    my.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <MotionConfig
      reducedMotion="user"
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.section
        ref={heroRef}
        id="top"
        className="relative isolate flex min-h-[100dvh] items-center overflow-hidden px-6 pt-28 pb-12 md:px-12 md:pt-32 md:pb-20"
        style={{ opacity: heroOpacity }}
        aria-label="Introduction"
      >
        {/* Ambient amber glow — anchors the eye to the headshot side */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 top-1/2 -z-10 h-[700px] w-[700px] -translate-y-1/2 rounded-full opacity-25 blur-3xl"
          style={{ backgroundColor: 'var(--color-accent)' }}
        />

        <div className="relative mx-auto grid w-full max-w-[1400px] grid-cols-1 items-center gap-12 md:grid-cols-12 md:gap-16">
          {/* Left: type column */}
          <motion.div
            className="md:col-span-7 lg:col-span-7"
            style={{ y: contentY }}
          >
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={mounted ? { opacity: 1, x: 0 } : undefined}
              transition={{ delay: 0.1 }}
              className="eyebrow mb-10 flex items-center gap-3"
            >
              <span
                aria-hidden
                className="inline-block h-px w-8"
                style={{ backgroundColor: 'var(--color-accent)' }}
              />
              Portfolio · CL · Vancouver · 2026
            </motion.div>

            {/* Headline — word-by-word stagger */}
            <h1
              className="font-display font-light leading-[0.92] tracking-tight"
              style={{ fontSize: 'var(--text-display-1)' }}
            >
              <span className="sr-only">A polyglot engineer.</span>
              <span aria-hidden className="block">
                {HEADLINE_PARTS.map((word, i) => (
                  <span
                    key={i}
                    className="mr-[0.18em] inline-block overflow-hidden align-bottom"
                  >
                    <motion.span
                      initial={{ y: '110%' }}
                      animate={mounted ? { y: '0%' } : undefined}
                      transition={{ delay: 0.2 + i * 0.08, duration: 1 }}
                      className="inline-block"
                    >
                      {word}
                      {i === HEADLINE_PARTS.length - 1 && (
                        <span style={{ color: 'var(--color-accent)' }}>.</span>
                      )}
                    </motion.span>
                  </span>
                ))}
              </span>
            </h1>

            {/* Tagline */}
            <p className="mt-10 max-w-xl text-balance text-lg leading-snug text-fg/85 md:text-xl">
              {TAGLINE_PARTS.map((chunk, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={mounted ? { opacity: 1, y: 0 } : undefined}
                  transition={{ delay: 0.55 + i * 0.06 }}
                  className="inline-block"
                >
                  {chunk}
                  {i < TAGLINE_PARTS.length - 1 && ' '}
                </motion.span>
              ))}
            </p>

            {/* CTA row */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={mounted ? { opacity: 1, y: 0 } : undefined}
              transition={{ delay: 1.0 }}
              className="mt-12 flex flex-wrap items-center gap-4"
            >
              <a
                href="#work"
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full px-6 py-3 font-mono text-xs uppercase tracking-[0.18em] transition-colors"
                style={{
                  backgroundColor: 'var(--color-accent)',
                  color: 'var(--color-bg)',
                }}
              >
                <span>Browse work</span>
                <span aria-hidden className="transition-transform group-hover:translate-x-1">
                  ↓
                </span>
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-3 rounded-full border border-border-subtle px-6 py-3 font-mono text-xs uppercase tracking-[0.18em] text-fg transition-colors hover:border-accent hover:text-accent"
              >
                Get in touch
              </a>
            </motion.div>
          </motion.div>

          {/* Right: amber-duotone headshot */}
          <motion.div
            ref={headshotWrapRef}
            className="relative md:col-span-5 lg:col-span-5"
            style={{ y: headshotY, perspective: 1000 }}
            initial={{ opacity: 0, filter: 'blur(20px)' }}
            animate={
              mounted ? { opacity: 1, filter: 'blur(0px)' } : undefined
            }
            transition={{ delay: 0.4, duration: 1.2 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <motion.div
              className="relative overflow-hidden rounded-2xl"
              style={{
                aspectRatio: '4 / 5',
                backgroundColor: 'var(--color-accent)',
                rotateX: rx,
                rotateY: ry,
                transformStyle: 'preserve-3d',
              }}
            >
              <img
                src="/cristobal.jpg"
                alt="Cristobal Lara, portrait"
                width={1080}
                height={1080}
                loading="eager"
                decoding="async"
                className="block h-full w-full object-cover object-top"
                style={{ mixBlendMode: 'multiply' }}
              />
              {/* Subtle frame border */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset"
                style={{ borderColor: 'rgba(0,0,0,0.2)' }}
              />
            </motion.div>

            {/* Caption strip below the headshot */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={mounted ? { opacity: 1 } : undefined}
              transition={{ delay: 1.1 }}
              className="mt-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-muted-fg"
            >
              <span>
                Cristobal Lara
                <span style={{ color: 'var(--color-accent)' }}>·</span> Full-stack Engineer
              </span>
              <span aria-hidden>2026</span>
            </motion.div>
          </motion.div>
        </div>

        {/* Footer ticker — three facts */}
        <motion.ul
          initial={{ opacity: 0 }}
          animate={mounted ? { opacity: 1 } : undefined}
          transition={{ delay: 1.3 }}
          className="absolute inset-x-6 bottom-8 mx-auto flex max-w-[1400px] flex-col gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-fg md:inset-x-12 md:flex-row md:gap-12"
        >
          {FACTS.map((f, i) => (
            <li key={f.num} className="flex items-start gap-3">
              <span
                aria-hidden
                style={{ color: 'var(--color-accent)' }}
                className="shrink-0"
              >
                {f.num}
              </span>
              <span className="leading-snug text-fg/70">{f.body}</span>
              {i < FACTS.length - 1 && (
                <span aria-hidden className="hidden text-border-subtle md:inline">
                  /
                </span>
              )}
            </li>
          ))}
        </motion.ul>
      </motion.section>
    </MotionConfig>
  );
}
