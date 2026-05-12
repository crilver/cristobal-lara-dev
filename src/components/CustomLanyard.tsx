import { useEffect, useState } from 'react';
import Lanyard from '../lib/react-bits/Lanyard';

/**
 * Canvas 2D card texture — event-badge style.
 * Drawn at 600×844 (≈ 0.71 aspect, matching the GLB card's CuboidCollider
 * extent 1.6×2.25). Background gradient + amber-multiply headshot + name +
 * role + location + barcode-style decoration.
 */
function drawCardCanvas(canvas: HTMLCanvasElement, headshot: HTMLImageElement): void {
  const W = 600;
  const H = 844;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 1) Background gradient
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#0a0a0b');
  bg.addColorStop(1, '#1a1a1d');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // 2) Subtle amber glow (top right)
  const glow = ctx.createRadialGradient(W - 80, 80, 0, W - 80, 80, 320);
  glow.addColorStop(0, 'rgba(255, 180, 0, 0.4)');
  glow.addColorStop(1, 'rgba(255, 180, 0, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // 3) Top border accent
  ctx.fillStyle = '#ffb400';
  ctx.fillRect(40, 56, 28, 2);

  // 4) Top eyebrow text
  ctx.font = '700 13px "Geist Mono Variable", ui-monospace, monospace';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffb400';
  ctx.fillText('ENGINEER', 80, 57);
  ctx.fillStyle = '#a8a8a8';
  ctx.fillText('· CL · 2026', 168, 57);

  // 5) Photo well — amber background, headshot drawn with multiply
  const PX = 40, PY = 96, PW = 520, PH = 520;
  ctx.fillStyle = '#ffb400';
  ctx.fillRect(PX, PY, PW, PH);
  ctx.save();
  ctx.beginPath();
  ctx.rect(PX, PY, PW, PH);
  ctx.clip();
  ctx.globalCompositeOperation = 'multiply';
  // Cover-fit: scale headshot to cover the well, centered
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

  // Photo inner frame
  ctx.strokeStyle = 'rgba(0,0,0,0.25)';
  ctx.lineWidth = 1;
  ctx.strokeRect(PX + 0.5, PY + 0.5, PW - 1, PH - 1);

  // 6) Name — display serif, two lines
  ctx.fillStyle = '#f5f2ec';
  ctx.font = '300 76px "Fraunces Variable", Georgia, serif';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('Cristobal', 40, 700);
  ctx.fillText('Lara', 40, 768);
  // Amber period after "Lara"
  const laraWidth = ctx.measureText('Lara').width;
  ctx.fillStyle = '#ffb400';
  ctx.fillText('.', 40 + laraWidth, 768);

  // 7) Role + location — mono caps
  ctx.fillStyle = 'rgba(245, 242, 236, 0.92)';
  ctx.font = '600 14px "Geist Mono Variable", ui-monospace, monospace';
  ctx.fillText('FULL-STACK WEB DEVELOPER', 40, 800);

  ctx.fillStyle = '#8a8a8a';
  ctx.font = '500 12px "Geist Mono Variable", ui-monospace, monospace';
  ctx.fillText('VANCOUVER · CLOUD · AI', 40, 822);

  // 8) Bottom right — barcode-style stripes
  const BCX = 380, BCY = 790, BCH = 36;
  const stripeWidths = [3, 1, 4, 2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 2, 4, 1, 2, 3, 1, 2, 4, 1];
  let xCursor = BCX;
  for (let i = 0; i < stripeWidths.length; i++) {
    const sw = stripeWidths[i];
    if (i % 2 === 0) {
      ctx.fillStyle = '#f5f2ec';
      ctx.fillRect(xCursor, BCY, sw, BCH);
    }
    xCursor += sw + 1;
    if (xCursor > W - 40) break;
  }

  // Bottom right tiny serial
  ctx.fillStyle = '#6b6b6b';
  ctx.font = '500 9px "Geist Mono Variable", ui-monospace, monospace';
  ctx.fillText('ENG·001', BCX, BCY - 6);

  // 9) Top-right "AI" pill
  const PILL_W = 36, PILL_H = 20, PILL_X = W - 40 - PILL_W, PILL_Y = 46;
  ctx.fillStyle = '#ffb400';
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

  ctx.fillStyle = '#0a0a0b';
  ctx.font = '700 10px "Geist Mono Variable", ui-monospace, monospace';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.fillText('AI', PILL_X + PILL_W / 2, PILL_Y + PILL_H / 2);
  ctx.textAlign = 'left';
}

/**
 * Canvas 2D rope/lanyard texture — a horizontal repeating strip showing
 * Cristobal's stack as styled labels. Tiled across the rope by meshline.
 */
function drawRopeCanvas(canvas: HTMLCanvasElement): void {
  const W = 1200;
  const H = 96;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Background — dark
  ctx.fillStyle = '#0a0a0b';
  ctx.fillRect(0, 0, W, H);

  // Bottom amber accent line
  ctx.fillStyle = '#ffb400';
  ctx.fillRect(0, H - 2, W, 2);
  ctx.fillRect(0, 0, W, 2);

  // Repeating stack label sequence
  const labels = ['REACT', 'TYPESCRIPT', 'NODE', 'JAVA', 'NESTJS', 'POSTGRES', 'AWS', 'GCP'];
  ctx.font = '700 30px "Geist Mono Variable", ui-monospace, monospace';
  ctx.textBaseline = 'middle';

  // Measure total width of one full cycle (labels + amber separators)
  const sep = '   ·   ';
  ctx.fillStyle = '#f5f2ec';
  const totals = labels.map((l) => ctx.measureText(l).width);
  const sepWidth = ctx.measureText(sep).width;
  const oneCycle = totals.reduce((a, b) => a + b, 0) + sepWidth * labels.length;

  // Repeat until we fill the canvas
  let x = 0;
  while (x < W) {
    for (let i = 0; i < labels.length; i++) {
      ctx.fillStyle = '#f5f2ec';
      ctx.fillText(labels[i], x, H / 2);
      x += totals[i];

      ctx.fillStyle = '#ffb400';
      ctx.fillText(sep, x, H / 2);
      x += sepWidth;

      if (x > W) break;
    }
  }
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
        img.src = '/cristobal.jpg';
      });

    Promise.all([loadHeadshot(), document.fonts.ready])
      .then(([headshot]) => {
        if (cancelled) return;
        try {
          const cardCanvas = document.createElement('canvas');
          drawCardCanvas(cardCanvas, headshot);
          setCardImage(cardCanvas.toDataURL('image/png'));

          const ropeCanvas = document.createElement('canvas');
          drawRopeCanvas(ropeCanvas);
          setRopeImage(ropeCanvas.toDataURL('image/png'));
        } catch (err) {
          // Surface to console for dev — Lanyard falls back to defaults silently.
          // eslint-disable-next-line no-console
          console.warn('[CustomLanyard] Texture generation failed:', err);
        }
      })
      .catch(() => {
        // Headshot or fonts failed to load — defaults will be used.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return <Lanyard cardImage={cardImage} ropeImage={ropeImage} transparent />;
}
