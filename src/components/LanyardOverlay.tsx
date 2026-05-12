import { Suspense, lazy } from 'react';

const CustomLanyard = lazy(() => import('./CustomLanyard'));

/**
 * Lanyard wrapper rendered as a position:absolute child of the Hero section.
 * Scrolls naturally with the hero — as the page scrolls down the lanyard
 * rides along (visually "pulled" toward the top of the viewport) and exits
 * once the hero has scrolled out of view.
 *
 * Pointer-events: none so the nav and any underlying content stay clickable.
 */
export default function LanyardOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-30 hidden md:block"
    >
      <Suspense fallback={null}>
        <CustomLanyard />
      </Suspense>
    </div>
  );
}
