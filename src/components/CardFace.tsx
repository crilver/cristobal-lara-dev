import { forwardRef } from 'react';

/**
 * Visual design of Cristobal's lanyard card face.
 * Rendered offscreen, then snapshotted to a canvas via html-to-image
 * and applied as the texture on the 3D Lanyard card mesh.
 *
 * Size is calibrated to match the card.glb UV mapping (vertical card,
 * roughly 1:1.4 aspect — 540 × 760).
 */

// Deterministic pattern for the QR-style decoration so html-to-image
// produces the same texture on every capture.
const QR_PATTERN = [
  1, 1, 0, 1, 1, 0, 1, 1,
  1, 0, 1, 1, 0, 1, 0, 1,
  0, 1, 1, 0, 1, 1, 1, 0,
  1, 1, 0, 1, 1, 0, 1, 1,
  0, 1, 1, 1, 0, 1, 1, 0,
  1, 0, 1, 0, 1, 0, 1, 1,
  1, 1, 0, 1, 1, 1, 0, 1,
  0, 1, 1, 0, 1, 0, 1, 1,
];

interface CardFaceProps {
  /** Data URL of the headshot, pre-resolved so html-to-image can inline it. */
  headshotDataUrl?: string;
}

const CardFace = forwardRef<HTMLDivElement, CardFaceProps>(function CardFace(
  { headshotDataUrl },
  ref
) {
  return (
    <div
      ref={ref}
      style={{
        width: 540,
        height: 760,
        background: 'linear-gradient(180deg, #0a0a0b 0%, #1a1a1d 100%)',
        padding: 36,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Geist Variable', system-ui, -apple-system, sans-serif",
        color: '#f5f2ec',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 24,
      }}
    >
      {/* Subtle amber glow */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: -120,
          right: -120,
          width: 320,
          height: 320,
          borderRadius: '50%',
          background: '#ffb400',
          opacity: 0.2,
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />

      {/* Top eyebrow */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontFamily: "'Geist Mono Variable', ui-monospace, monospace",
          fontSize: 11,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: '#a8a8a8',
          marginBottom: 24,
        }}
      >
        <div style={{ width: 28, height: 1, background: '#ffb400' }} />
        <span style={{ color: '#ffb400' }}>ID·001</span>
        <span style={{ opacity: 0.4 }}>/</span>
        <span>2026</span>
      </div>

      {/* Photo */}
      <div
        style={{
          width: '100%',
          aspectRatio: '1 / 1',
          borderRadius: 14,
          overflow: 'hidden',
          background: '#ffb400',
          position: 'relative',
        }}
      >
        {headshotDataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={headshotDataUrl}
            alt=""
            crossOrigin="anonymous"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center top',
              mixBlendMode: 'multiply',
              display: 'block',
            }}
          />
        ) : null}
      </div>

      {/* Name + role */}
      <div style={{ marginTop: 28, flex: 1 }}>
        <h2
          style={{
            fontFamily: "'Fraunces Variable', Georgia, serif",
            fontWeight: 300,
            fontSize: 52,
            lineHeight: 0.92,
            letterSpacing: '-0.025em',
            margin: 0,
            color: '#f5f2ec',
          }}
        >
          Cristobal
          <br />
          Lara
          <span style={{ color: '#ffb400' }}>.</span>
        </h2>
        <p
          style={{
            marginTop: 16,
            marginBottom: 6,
            fontFamily: "'Geist Mono Variable', ui-monospace, monospace",
            fontSize: 12,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#f5f2ec',
            opacity: 0.85,
          }}
        >
          Full-stack Web Developer
        </p>
        <p
          style={{
            marginTop: 0,
            marginBottom: 0,
            fontFamily: "'Geist Mono Variable', ui-monospace, monospace",
            fontSize: 11,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#a8a8a8',
          }}
        >
          Vancouver, BC <span style={{ color: '#ffb400' }}>·</span> Cloud · AI
        </p>
      </div>

      {/* Bottom row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginTop: 16,
        }}
      >
        <div
          style={{
            fontFamily: "'Geist Mono Variable', ui-monospace, monospace",
            fontSize: 9,
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: '#6b6b6b',
            lineHeight: 1.4,
          }}
        >
          ENG·001
          <br />
          cristobal-lara.dev
        </div>
        <div
          style={{
            width: 56,
            height: 56,
            border: '1px solid #28282a',
            borderRadius: 6,
            display: 'grid',
            gridTemplateColumns: 'repeat(8, 1fr)',
            gridTemplateRows: 'repeat(8, 1fr)',
            gap: 1,
            padding: 4,
            background: '#0a0a0b',
          }}
        >
          {QR_PATTERN.map((cell, i) => (
            <div
              key={i}
              style={{
                background: cell ? '#f5f2ec' : 'transparent',
                borderRadius: 1,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

export default CardFace;
