import { Suspense, lazy, useEffect, useState } from 'react';

const CustomLanyard = lazy(() => import('./CustomLanyard'));

/**
 * Page-level fixed overlay for the 3D Lanyard. Sits ABOVE the navbar
 * (z-50 > nav z-40) so the rope crosses over the navbar instead of being
 * clipped by it. Pointer-events: none on the wrapper so the nav and any
 * underlying content stay fully clickable — the tradeoff is that the card
 * can't be dragged, which is acceptable for a portfolio-decoration use.
 *
 * Fades out once the user scrolls past the hero (tracked via an
 * IntersectionObserver on the #top section).
 */
export default function LanyardOverlay() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Wait a tick — #top is inside an Astro island so it may not be in the
    // DOM at the very first render.
    let cancelled = false;
    let observer: IntersectionObserver | null = null;

    const attach = () => {
      if (cancelled) return;
      const hero = document.getElementById('top');
      if (!hero) {
        // Try again next frame in case the hero hasn't hydrated yet.
        requestAnimationFrame(attach);
        return;
      }
      observer = new IntersectionObserver(
        ([entry]) => setVisible(entry.intersectionRatio > 0.15),
        { threshold: [0, 0.15, 0.5, 1] }
      );
      observer.observe(hero);
    };
    attach();

    return () => {
      cancelled = true;
      observer?.disconnect();
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-y-0 right-0 z-50 hidden md:block md:w-[48%] lg:w-[44%] xl:w-[40%]"
      style={{
        opacity: visible ? 1 : 0,
        transition: 'opacity 600ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <Suspense fallback={null}>
        <CustomLanyard />
      </Suspense>
    </div>
  );
}
