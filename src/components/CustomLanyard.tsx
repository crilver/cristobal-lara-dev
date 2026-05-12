import { useEffect, useState } from 'react';
import Lanyard from '../lib/react-bits/Lanyard';

type Theme = 'dark' | 'light';

const HEADSHOT_FOR_THEME: Record<Theme, string> = {
  // Dark theme → black-background portrait (NWeb), so the photo's bg
  // blends into the dark canvas. No amber overlay needed.
  dark: '/headshots/cristobal-dark-card.webp',
  // Light theme → white-background portrait (BWeb), bg blends into the
  // light canvas.
  light: '/headshots/cristobal-light-card.webp',
};

const COLORS_FOR_THEME: Record<
  Theme,
  {
    bgFrom: string;
    bgTo: string;
    accent: string;
    foreground: string;
    muted: string;
    subdued: string;
  }
> = {
  dark: {
    bgFrom: '#0a0a0b',
    bgTo: '#1a1a1d',
    accent: '#ffb400',
    foreground: '#f5f2ec',
    muted: '#a8a8a8',
    subdued: '#6b6b6b',
  },
  light: {
    bgFrom: '#f5f2ec',
    bgTo: '#fffcf6',
    accent: '#b87100',
    foreground: '#0a0a0b',
    muted: '#404040',
    subdued: '#6b6b6b',
  },
};

/** Read the current theme set on <html data-theme="...">. Falls back to dark. */
function readTheme(): Theme {
  if (typeof document === 'undefined') return 'dark';
  const t = document.documentElement.dataset.theme;
  return t === 'light' ? 'light' : 'dark';
}

/**
 * Canvas 2D event-badge card texture. NO amber multiply overlay — the photo
 * is drawn as-is (its own background blends with the canvas bg).
 * Drawn at 600×844 (≈ 0.71 aspect, matching the GLB card's collider extent).
 */
function drawCardCanvas(
  canvas: HTMLCanvasElement,
  headshot: HTMLImageElement,
  theme: Theme
): void {
  const W = 600;
  const H = 844;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const c = COLORS_FOR_THEME[theme];

  // 1) Background gradient
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, c.bgFrom);
  bg.addColorStop(1, c.bgTo);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // 2) Subtle amber glow (top right)
  const glow = ctx.createRadialGradient(W - 80, 80, 0, W - 80, 80, 320);
  const accentRGBA = theme === 'dark' ? 'rgba(255, 180, 0, 0.40)' : 'rgba(184, 113, 0, 0.18)';
  glow.addColorStop(0, accentRGBA);
  glow.addColorStop(1, 'rgba(255, 180, 0, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // 3) Top border accent
  ctx.fillStyle = c.accent;
  ctx.fillRect(40, 56, 28, 2);

  // 4) Top eyebrow text
  ctx.font = '700 13px "Geist Mono Variable", ui-monospace, monospace';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = c.accent;
  ctx.fillText('ENGINEER', 80, 57);
  ctx.fillStyle = c.muted;
  ctx.fillText('· CL · 2026', 168, 57);

  // 5) Photo well — drawn directly, no amber multiply.
  const PX = 40, PY = 96, PW = 520, PH = 520;
  ctx.save();
  ctx.beginPath();
  ctx.rect(PX, PY, PW, PH);
  ctx.clip();
  // Cover-fit headshot
  const photoAR = headshot.width / headshot.height;
  const wellAR = PW / PH;
  let drawW = PW, drawH = PH, drawX = PX, drawY = PY;
  if (photoAR > wellAR) {
    drawH = PH;
    drawW = PH * photoAR;
    drawX = PX - (drawW - PW) / 2;
  } else {
    drawW = PW;
    drawH = PW / photoAR;
    drawY = PY - (drawH - PH) / 2;
  }
  ctx.drawImage(headshot, drawX, drawY, drawW, drawH);
  ctx.restore();

  // Photo inner frame (subtle)
  ctx.strokeStyle = theme === 'dark' ? 'rgba(245,242,236,0.06)' : 'rgba(0,0,0,0.06)';
  ctx.lineWidth = 1;
  ctx.strokeRect(PX + 0.5, PY + 0.5, PW - 1, PH - 1);

  // 6) Name — display serif, two lines
  ctx.fillStyle = c.foreground;
  ctx.font = '300 76px "Fraunces Variable", Georgia, serif';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('Cristobal', 40, 700);
  ctx.fillText('Lara', 40, 768);
  // Amber period after "Lara"
  const laraWidth = ctx.measureText('Lara').width;
  ctx.fillStyle = c.accent;
  ctx.fillText('.', 40 + laraWidth, 768);

  // 7) Role + location — mono caps
  ctx.fillStyle = theme === 'dark' ? 'rgba(245, 242, 236, 0.92)' : 'rgba(10, 10, 11, 0.92)';
  ctx.font = '600 14px "Geist Mono Variable", ui-monospace, monospace';
  ctx.fillText('FULL-STACK WEB DEVELOPER', 40, 800);

  ctx.fillStyle = c.muted;
  ctx.font = '500 12px "Geist Mono Variable", ui-monospace, monospace';
  ctx.fillText('VANCOUVER · CLOUD · AI', 40, 822);

  // 8) Bottom right — barcode-style stripes
  const BCX = 380, BCY = 790, BCH = 36;
  const stripeWidths = [3, 1, 4, 2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 2, 4, 1, 2, 3, 1, 2, 4, 1];
  let xCursor = BCX;
  for (let i = 0; i < stripeWidths.length; i++) {
    const sw = stripeWidths[i];
    if (i % 2 === 0) {
      ctx.fillStyle = c.foreground;
      ctx.fillRect(xCursor, BCY, sw, BCH);
    }
    xCursor += sw + 1;
    if (xCursor > W - 40) break;
  }

  // Bottom right tiny serial
  ctx.fillStyle = c.subdued;
  ctx.font = '500 9px "Geist Mono Variable", ui-monospace, monospace';
  ctx.fillText('ENG·001', BCX, BCY - 6);

  // 9) Top-right "AI" pill
  const PILL_W = 36, PILL_H = 20, PILL_X = W - 40 - PILL_W, PILL_Y = 46;
  ctx.fillStyle = c.accent;
  ctx.beginPath();
  const r = 10;
  ctx.moveTo(PILL_X + r, PILL_Y);
  ctx.lineTo(PILL_X + PILL_W - r, PILL_Y);
  ctx.quadraticCurveTo(PILL_X + PILL_W, PILL_Y, PILL_X + PILL_W, PILL_Y + r);
  ctx.lineTo(PILL_X + PILL_W, PILL_Y + PILL_H - r);
  ctx.quadraticCurveTo(PILL_X + PILL_W, PILL_Y + PILL_H, PILL_X + PILL_W - r, PILL_Y + PILL_H);
  ctx.lineTo(PILL_X + r, PILL_Y + PILL_H);
  ctx.quadraticCurveTo(PILL_X, PILL_Y + PILL_H, PILL_X, PILL_Y + PILL_H - r);
  ctx.lineTo(PILL_X, PILL_Y + r);
  ctx.quadraticCurveTo(PILL_X, PILL_Y, PILL_X + r, PILL_Y);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = theme === 'dark' ? '#0a0a0b' : '#f5f2ec';
  ctx.font = '700 10px "Geist Mono Variable", ui-monospace, monospace';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.fillText('AI', PILL_X + PILL_W / 2, PILL_Y + PILL_H / 2);
  ctx.textAlign = 'left';
}

/** Canvas 2D rope texture — horizontal repeating strip of stack labels. */
function drawRopeCanvas(canvas: HTMLCanvasElement, theme: Theme): void {
  const W = 1200;
  const H = 96;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const c = COLORS_FOR_THEME[theme];

  ctx.fillStyle = c.bgFrom;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = c.accent;
  ctx.fillRect(0, H - 2, W, 2);
  ctx.fillRect(0, 0, W, 2);

  const labels = ['REACT', 'TYPESCRIPT', 'NODE', 'JAVA', 'NESTJS', 'POSTGRES', 'AWS', 'GCP'];
  ctx.font = '700 30px "Geist Mono Variable", ui-monospace, monospace';
  ctx.textBaseline = 'middle';

  const sep = '   ·   ';
  const totals = labels.map((l) => ctx.measureText(l).width);
  const sepWidth = ctx.measureText(sep).width;

  let x = 0;
  while (x < W) {
    for (let i = 0; i < labels.length; i++) {
      ctx.fillStyle = c.foreground;
      ctx.fillText(labels[i], x, H / 2);
      x += totals[i];

      ctx.fillStyle = c.accent;
      ctx.fillText(sep, x, H / 2);
      x += sepWidth;

      if (x > W) break;
    }
  }
}

export default function CustomLanyard() {
  const [theme, setTheme] = useState<Theme>(readTheme);
  const [cardImage, setCardImage] = useState<string | undefined>(undefined);
  const [ropeImage, setRopeImage] = useState<string | undefined>(undefined);

  // Watch for theme changes on <html data-theme> and re-render textures.
  useEffect(() => {
    const obs = new MutationObserver(() => setTheme(readTheme()));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadHeadshot = () =>
      new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = HEADSHOT_FOR_THEME[theme];
      });

    Promise.all([loadHeadshot(), document.fonts.ready])
      .then(([headshot]) => {
        if (cancelled) return;
        try {
          const cardCanvas = document.createElement('canvas');
          drawCardCanvas(cardCanvas, headshot, theme);
          setCardImage(cardCanvas.toDataURL('image/png'));

          const ropeCanvas = document.createElement('canvas');
          drawRopeCanvas(ropeCanvas, theme);
          setRopeImage(ropeCanvas.toDataURL('image/png'));
        } catch (err) {
          // eslint-disable-next-line no-console
          console.warn('[CustomLanyard] Texture generation failed:', err);
        }
      })
      .catch(() => {
        // Headshot or fonts failed — Lanyard uses default visual.
      });

    return () => {
      cancelled = true;
    };
  }, [theme]);

  return <Lanyard cardImage={cardImage} ropeImage={ropeImage} transparent />;
}
