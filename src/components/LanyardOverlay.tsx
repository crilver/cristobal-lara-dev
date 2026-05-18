import { Suspense, lazy, useEffect, useState } from 'react';

const CustomLanyard = lazy(() => import('./CustomLanyard'));

const DESKTOP_QUERY = '(min-width: 1024px)';

/**
 * Lanyard wrapper rendered as a position:absolute child of the Hero section.
 * Scrolls naturally with the hero — as the page scrolls down the lanyard
 * rides along (visually "pulled" toward the top of the viewport) and exits
 * once the hero has scrolled out of view.
 *
 * The lanyard is only ever shown at >=lg. CSS `display:none` would still let
 * React mount the lazy component and pull its ~1.1 MB Three.js + Rapier
 * chunk on phones (where it's invisible). So we gate the dynamic import on a
 * matchMedia check: below lg the import is never called, and mobile never
 * downloads or executes that bundle.
 *
 * This layer is interactive (the card is draggable) but sits at z-10 —
 * BELOW the hero text/CTA layer (z-20, which is pointer-events:none except
 * its own content). So clicks on the CTAs/nav hit the text layer, while the
 * empty right-side region over the card falls through to this canvas. That
 * keeps the buttons working AND the badge draggable.
 */
export default function LanyardOverlay() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return (
    <div
      aria-hidden
      className="absolute inset-0 z-10 hidden lg:block"
    >
      {/* Constrain the lanyard stage to the same max-w-[1400px] centered
          column as the hero text so the badge stays pinned beside it and
          never drifts into the side gutters on ultra-wide screens. */}
      <div className="relative mx-auto h-full w-full max-w-[1400px]">
        {isDesktop && (
          <Suspense fallback={null}>
            <CustomLanyard />
          </Suspense>
        )}
      </div>
    </div>
  );
}
