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
      className="pointer-events-none absolute inset-0 z-30 hidden lg:block"
    >
      {/* Constrain the lanyard stage to the same max-w-[1400px] centered
          column as the hero text. The Lanyard canvas is w-full h-full, so
          capping this wrapper keeps the badge pinned beside the text at
          every viewport instead of drifting into the empty side gutters
          on ultra-wide screens. */}
      <div className="relative mx-auto h-full w-full max-w-[1400px]">
        <Suspense fallback={null}>
          <CustomLanyard />
        </Suspense>
      </div>
    </div>
  );
}
