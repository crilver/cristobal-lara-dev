import { useEffect, useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import Lanyard from '../lib/react-bits/Lanyard';
import CardFace from './CardFace';

/**
 * Wraps the React Bits Lanyard with a runtime-generated card texture
 * built from <CardFace />. The card face is rendered offscreen, captured
 * with html-to-image, and the resulting PNG data URL is applied to the
 * 3D card material's `map`.
 *
 * Fonts must be ready before the snapshot so the captured texture has
 * the correct typography baked in.
 */
export default function CustomLanyard() {
  const cardFaceRef = useRef<HTMLDivElement>(null);
  const [headshotDataUrl, setHeadshotDataUrl] = useState<string | undefined>(undefined);
  const [cardImage, setCardImage] = useState<string | undefined>(undefined);

  // Step 1: load headshot as a data URL so html-to-image can inline it
  // (avoids the CORS-tainted-canvas problem on the snapshot).
  useEffect(() => {
    let cancelled = false;
    fetch('/cristobal.jpg')
      .then((res) => res.blob())
      .then(
        (blob) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          })
      )
      .then((dataUrl) => {
        if (!cancelled) setHeadshotDataUrl(dataUrl);
      })
      .catch(() => {
        // Headshot couldn't load — Lanyard will fall back to default card visual.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Step 2: once headshot is in the DOM and fonts are ready, snapshot the
  // card face to a PNG data URL.
  useEffect(() => {
    if (!headshotDataUrl || !cardFaceRef.current) return;

    let cancelled = false;
    const node = cardFaceRef.current;

    document.fonts.ready.then(() => {
      // Two-pass capture: warm up the renderer first, then take the real shot.
      // Helps with font rendering glitches on first run.
      toPng(node, { pixelRatio: 2, cacheBust: true })
        .then(() => toPng(node, { pixelRatio: 2, cacheBust: true }))
        .then((dataUrl) => {
          if (!cancelled) setCardImage(dataUrl);
        })
        .catch(() => {
          // Snapshot failed — Lanyard will use the default card visual.
        });
    });

    return () => {
      cancelled = true;
    };
  }, [headshotDataUrl]);

  return (
    <>
      {/* Hidden offscreen CardFace used as the texture source. */}
      <div
        aria-hidden
        style={{
          position: 'fixed',
          top: 0,
          left: -10000,
          width: 540,
          height: 760,
          pointerEvents: 'none',
        }}
      >
        <CardFace ref={cardFaceRef} headshotDataUrl={headshotDataUrl} />
      </div>

      <Lanyard cardImage={cardImage} transparent gravity={[0, -40, 0]} />
    </>
  );
}
