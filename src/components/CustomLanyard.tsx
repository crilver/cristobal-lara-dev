import { useEffect, useState } from 'react';
import {
  siReact,
  siTypescript,
  siJavascript,
  siNodedotjs,
  siPostgresql,
  siGooglecloud,
} from 'simple-icons';
import Lanyard from '../lib/react-bits/Lanyard';

// AWS was removed from simple-icons in v15+ (Amazon trademark policy).
// Canonical "AWS smile" SVG path (24×24 viewBox), used here for editorial
// reference of Cristobal's cloud stack.
const SI_AWS = {
  title: 'Amazon Web Services',
  hex: 'FF9900',
  path:
    'M6.763 10.036c0 .296.032.535.088.71.064.176.144.368.256.576.04.063.056.127.056.183 0 .08-.048.16-.152.24l-.503.335a.383.383 0 0 1-.208.072c-.08 0-.16-.04-.239-.112a2.47 2.47 0 0 1-.287-.375 6.18 6.18 0 0 1-.248-.471c-.622.734-1.405 1.101-2.347 1.101-.67 0-1.205-.191-1.596-.574-.391-.384-.59-.894-.59-1.533 0-.678.239-1.23.726-1.644.487-.415 1.133-.623 1.955-.623.272 0 .551.024.846.064.296.04.6.104.918.176v-.583c0-.607-.127-1.03-.375-1.277-.255-.248-.686-.367-1.3-.367-.28 0-.568.031-.863.103-.295.072-.583.16-.862.272a2.29 2.29 0 0 1-.28.103.488.488 0 0 1-.127.023c-.112 0-.168-.08-.168-.247v-.391c0-.128.016-.224.056-.28a.597.597 0 0 1 .224-.167c.279-.144.614-.264 1.005-.36a4.84 4.84 0 0 1 1.246-.151c.95 0 1.644.216 2.091.647.439.43.662 1.085.662 1.963v2.586zm-3.24 1.214c.263 0 .534-.048.822-.144.287-.096.543-.271.758-.51.128-.152.224-.32.272-.512.047-.191.08-.423.08-.694v-.335a6.66 6.66 0 0 0-.735-.136 6.02 6.02 0 0 0-.75-.048c-.535 0-.926.104-1.19.32-.263.215-.39.518-.39.917 0 .375.095.655.295.846.191.2.47.296.838.296zm6.41.862c-.144 0-.24-.024-.304-.08-.064-.048-.12-.16-.168-.311L7.586 5.55a1.398 1.398 0 0 1-.072-.32c0-.128.064-.2.192-.2h.783c.151 0 .255.025.31.08.065.048.113.16.16.312l1.342 5.284 1.245-5.284c.04-.16.088-.264.151-.312a.549.549 0 0 1 .32-.08h.638c.152 0 .256.025.32.08.063.048.12.16.151.312l1.261 5.348 1.381-5.348c.048-.16.104-.264.16-.312a.52.52 0 0 1 .311-.08h.743c.127 0 .2.065.2.2 0 .04-.009.08-.017.128a1.137 1.137 0 0 1-.056.2l-1.923 6.17c-.048.16-.104.263-.16.311a.488.488 0 0 1-.303.08h-.687c-.151 0-.255-.024-.32-.08-.063-.056-.119-.16-.15-.32l-1.238-5.148-1.23 5.14c-.04.16-.087.264-.15.32-.065.056-.177.08-.32.08zm10.256.215c-.415 0-.83-.048-1.229-.143-.399-.096-.71-.2-.918-.32-.128-.071-.215-.151-.247-.223a.563.563 0 0 1-.048-.224v-.407c0-.167.064-.247.183-.247.048 0 .096.008.144.024.048.016.12.048.2.08.271.12.566.215.878.279.319.064.63.096.95.096.502 0 .894-.088 1.165-.264a.86.86 0 0 0 .415-.758.777.777 0 0 0-.215-.559c-.144-.151-.416-.287-.807-.415l-1.157-.36c-.583-.183-1.014-.454-1.277-.813a1.902 1.902 0 0 1-.4-1.158c0-.335.073-.63.216-.886.144-.255.335-.479.575-.654.24-.184.51-.32.83-.415.32-.096.655-.136 1.006-.136.175 0 .359.008.535.032.183.024.35.056.518.088.16.04.312.08.455.127.144.048.256.096.336.144a.69.69 0 0 1 .24.2.43.43 0 0 1 .071.263v.375c0 .168-.064.256-.184.256a.83.83 0 0 1-.303-.096 3.652 3.652 0 0 0-1.532-.311c-.455 0-.815.071-1.062.223-.248.152-.375.383-.375.71 0 .224.08.416.24.567.159.152.454.304.877.44l1.134.358c.574.184.99.44 1.237.768.247.327.367.702.367 1.117 0 .343-.072.655-.207.926-.144.272-.336.511-.583.703-.248.2-.543.343-.886.447-.36.111-.734.167-1.142.167zM21.698 16.207c-2.626 1.94-6.442 2.969-9.722 2.969-4.598 0-8.74-1.7-11.87-4.526-.247-.223-.024-.527.272-.351 3.384 1.963 7.559 3.153 11.877 3.153 2.914 0 6.114-.607 9.06-1.852.439-.2.814.287.383.607zM22.792 14.961c-.336-.43-2.22-.207-3.074-.103-.255.032-.295-.192-.063-.36 1.5-1.053 3.967-.75 4.254-.399.287.36-.08 2.826-1.485 4.007-.215.184-.423.088-.327-.151.32-.79 1.03-2.57.695-2.994z',
};

// Order of icons along the rope.
const ROPE_ICONS = [
  siReact,
  siTypescript,
  siJavascript,
  siNodedotjs,
  siPostgresql,
  SI_AWS,
  siGooglecloud,
];

type Theme = 'dark' | 'light';

// Single transparent-bg portrait used for both themes. The card paints its
// own gradient bg, the subject floats on top.
const HEADSHOT_URL = '/headshots/cristobal-card.webp';

// The lanyard card + rope intentionally stay on the dark palette regardless
// of the site's current light/dark theme. The badge reads as a physical
// object whose finish doesn't change with the page.
const LANYARD_THEME: Theme = 'dark';

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

/**
 * Canvas 2D event-badge card texture. The headshot is a transparent PNG/WebP,
 * drawn centered over the card's own gradient. No photo well or border —
 * the subject floats on the card so the bg is uninterrupted.
 *
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

  // 5) Photo — transparent-bg portrait, drawn centered horizontally.
  // The photo area sits above the name block (y ≤ ~640). Sized so the
  // subject fills most of the card width while leaving generous margins.
  const PHOTO_AREA_TOP = 88;
  const PHOTO_AREA_BOTTOM = 640;
  const PHOTO_AREA_HEIGHT = PHOTO_AREA_BOTTOM - PHOTO_AREA_TOP; // 552
  const PHOTO_AREA_WIDTH = W - 80; // 520 (40px margin each side)
  const photoAR = headshot.width / headshot.height;
  const areaAR = PHOTO_AREA_WIDTH / PHOTO_AREA_HEIGHT;
  // Contain-fit so the entire subject is visible inside the area.
  let drawW: number, drawH: number;
  if (photoAR > areaAR) {
    drawW = PHOTO_AREA_WIDTH;
    drawH = PHOTO_AREA_WIDTH / photoAR;
  } else {
    drawH = PHOTO_AREA_HEIGHT;
    drawW = PHOTO_AREA_HEIGHT * photoAR;
  }
  // Pre-squeeze horizontally to cancel out the GLB card's UV stretching.
  // The card mesh's front face uses a narrower U range than V, so anything
  // drawn at natural width gets pulled wider when projected. Drawing at
  // ~75% width here makes the subject land at natural proportions on the
  // card. Tune this single value (1.0 = no squeeze, lower = narrower).
  const UV_SQUEEZE = 0.75;
  drawW *= UV_SQUEEZE;
  // Left-aligned in canvas-space. The GLB card's visible front face is
  // shifted left of the canvas geometric center, so canvas-centered draws
  // get clipped on the right of the visible card. Aligning at the same
  // left margin as the eyebrow/name puts the subject visually centered
  // on the card itself.
  const drawX = 0;
  const drawY = PHOTO_AREA_TOP + (PHOTO_AREA_HEIGHT - drawH) / 2;
  // Matte filter — softens the bright studio shot into the card's
  // editorial palette. Tune brightness ↓ for darker, saturate ↓ for
  // more muted, contrast ↓ for softer blacks/whites.
  ctx.save();
  ctx.filter = 'brightness(0.85) contrast(0.92) saturate(0.75)';
  ctx.drawImage(headshot, drawX, drawY, drawW, drawH);
  ctx.restore();

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

/** Canvas 2D rope texture — single non-repeating strip of stack icons.
 *  Each icon is rendered from its simple-icons (or hardcoded) SVG path
 *  via Path2D, in its brand color. Canvas width is computed from the
 *  icon size + gap so repeat=-1 plays the strip once along the rope. */
function drawRopeCanvas(canvas: HTMLCanvasElement, theme: Theme): void {
  const H = 96;
  const ICON_SIZE = 60; // pixel size in canvas (simple-icons viewBox is 24×24)
  const ICON_GAP = 60;
  const PAD = 40;

  const n = ROPE_ICONS.length;
  const W = PAD * 2 + n * ICON_SIZE + (n - 1) * ICON_GAP;

  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const c = COLORS_FOR_THEME[theme];

  // Background + top/bottom amber edge.
  ctx.fillStyle = c.bgFrom;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = c.accent;
  ctx.fillRect(0, H - 2, W, 2);
  ctx.fillRect(0, 0, W, 2);

  const scale = ICON_SIZE / 24;

  // Rope hangs vertically on screen but the texture's X axis runs along
  // the rope length (vertically). Each icon is rotated 90° around its
  // center so its natural "up" lines up with the rope's "up" — they read
  // upright instead of sideways. Flip the sign of the rotation if they
  // come out upside-down.
  ROPE_ICONS.forEach((icon, i) => {
    const cx = PAD + i * (ICON_SIZE + ICON_GAP) + ICON_SIZE / 2;
    const cy = H / 2;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-Math.PI / 2);
    ctx.scale(scale, scale);
    ctx.translate(-12, -12); // re-center the 24×24 path after rotate+scale
    ctx.fillStyle = `#${icon.hex}`;
    ctx.fill(new Path2D(icon.path));
    ctx.restore();
  });
}

export default function CustomLanyard() {
  const [cardImage, setCardImage] = useState<string | undefined>(undefined);
  const [ropeImage, setRopeImage] = useState<string | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;

    const loadHeadshot = () =>
      new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = HEADSHOT_URL;
      });

    Promise.all([loadHeadshot(), document.fonts.ready])
      .then(([headshot]) => {
        if (cancelled) return;
        try {
          const cardCanvas = document.createElement('canvas');
          drawCardCanvas(cardCanvas, headshot, LANYARD_THEME);
          setCardImage(cardCanvas.toDataURL('image/png'));

          const ropeCanvas = document.createElement('canvas');
          drawRopeCanvas(ropeCanvas, LANYARD_THEME);
          setRopeImage(ropeCanvas.toDataURL('image/png'));
        } catch (err) {
          console.warn('[CustomLanyard] Texture generation failed:', err);
        }
      })
      .catch(() => {
        // Headshot or fonts failed — Lanyard uses default visual.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return <Lanyard cardImage={cardImage} ropeImage={ropeImage} transparent />;
}
