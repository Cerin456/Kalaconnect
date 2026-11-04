'use client';

/**
 * KalaConnect – Cultural Splash Screen
 *
 * Architecture (3 layers):
 *  1. Background layer   – the high-resolution reference artwork image (cover)
 *  2. Readability layer  – a subtle radial gradient that softens the centre of
 *                          the artwork so HTML text reads crisply over it
 *  3. Content layer      – all real HTML: logo, branding text, progress bar,
 *                          Skip button (not baked into the artwork)
 *
 * The artwork image is ONLY the decorative background.
 * Every piece of text, the logo, the progress bar, and the Skip button are
 * genuine, interactive, responsive HTML elements – none are part of the image.
 *
 * Session behaviour  : shown once per browser session via sessionStorage.
 * Duration           : 6 seconds total; Skip dismisses immediately.
 * Accessibility      : respects prefers-reduced-motion; dialog ARIA role.
 */

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const TOTAL_MS = 6000;        // 6 s display
const FADE_OUT_MS = 700;      // fade-out duration

/* ─── Reduced-motion hook ─── */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const h = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return reduced;
}

/* ─── Inline lotus SVG (no external file) ─── */
function Lotus({ size = 22, color = '#702D35' }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size * 0.72}
      viewBox="0 0 60 44"
      fill="none"
      aria-hidden="true"
      style={{ display: 'inline-block', flexShrink: 0 }}
    >
      {/* centre petal */}
      <ellipse cx="30" cy="26" rx="6" ry="16" fill={color} />
      {/* inner side petals */}
      <ellipse cx="19" cy="27" rx="5.5" ry="13" fill={color} opacity="0.78"
        transform="rotate(-20 19 27)" />
      <ellipse cx="41" cy="27" rx="5.5" ry="13" fill={color} opacity="0.78"
        transform="rotate(20 41 27)" />
      {/* outer petals */}
      <ellipse cx="8"  cy="30" rx="4" ry="10" fill={color} opacity="0.48"
        transform="rotate(-38 8 30)" />
      <ellipse cx="52" cy="30" rx="4" ry="10" fill={color} opacity="0.48"
        transform="rotate(38 52 30)" />
      {/* stem */}
      <rect x="28" y="40" width="4" height="4" rx="2" fill={color} opacity="0.55" />
    </svg>
  );
}

/* ─── Decorative separator ─── */
function Separator() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.6rem',
      width: '100%',
      maxWidth: 260,
      margin: '0.4rem auto',
    }}>
      <div style={{
        flex: 1,
        height: 1,
        background: 'linear-gradient(90deg, transparent, #702D35 40%, #702D35 60%, transparent)',
      }} />
      <Lotus size={20} color="#702D35" />
      <div style={{
        flex: 1,
        height: 1,
        background: 'linear-gradient(90deg, transparent, #702D35 40%, #702D35 60%, transparent)',
      }} />
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */
export default function SplashScreen() {
  const [phase, setPhase] = useState<'entering' | 'visible' | 'exiting' | 'done'>('entering');
  const [progress, setProgress] = useState(0);
  const reducedMotion = usePrefersReducedMotion();
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };

  const dismiss = () => {
    clear();
    setProgress(100);
    setPhase('exiting');
    const t = setTimeout(() => setPhase('done'), reducedMotion ? 0 : FADE_OUT_MS);
    timers.current.push(t);
  };

  useEffect(() => {
    if (reducedMotion) {
      const t = setTimeout(dismiss, 500);
      timers.current.push(t);
      return clear;
    }

    /* Enter */
    const t1 = setTimeout(() => setPhase('visible'), 50);
    timers.current.push(t1);

    /* Fill progress bar over (TOTAL_MS – 600) ms */
    const fillDur = TOTAL_MS - 600;
    const tick = 25;
    const inc = 100 / (fillDur / tick);
    let pct = 0;
    const step = () => {
      pct = Math.min(pct + inc, 100);
      setProgress(pct);
      if (pct < 100) {
        const t = setTimeout(step, tick);
        timers.current.push(t);
      }
    };
    const t2 = setTimeout(step, 400);
    timers.current.push(t2);

    /* Auto-dismiss */
    const t3 = setTimeout(dismiss, TOTAL_MS);
    timers.current.push(t3);

    return clear;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  if (phase === 'done') return null;

  const entering = phase === 'entering';
  const exiting  = phase === 'exiting';
  const rootOpacity = entering ? 0 : exiting ? 0 : 1;
  const rootTransition = reducedMotion
    ? 'none'
    : exiting
    ? `opacity ${FADE_OUT_MS}ms ease-in`
    : 'opacity 500ms ease-out';

  return (
    <>
      {/* ── Scoped styles ── */}
      <style>{`
        /* keyframes for staggered content entry */
        @keyframes kcs-rise {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .kcs-f1 { animation: kcs-rise .65s ease  .15s both; }
        .kcs-f2 { animation: kcs-rise .65s ease  .45s both; }
        .kcs-f3 { animation: kcs-rise .65s ease  .70s both; }
        .kcs-f4 { animation: kcs-rise .65s ease  .92s both; }
        .kcs-f5 { animation: kcs-rise .65s ease 1.15s both; }
        .kcs-f6 { animation: kcs-rise .65s ease 1.42s both; }
        .kcs-f7 { animation: kcs-rise .65s ease 1.70s both; }

        @media (prefers-reduced-motion: reduce) {
          .kcs-f1,.kcs-f2,.kcs-f3,.kcs-f4,.kcs-f5,.kcs-f6,.kcs-f7 {
            animation: none; opacity: 1;
          }
        }

        /* Skip button */
        .kcs-skip {
          position: absolute;
          top: 1.1rem;
          right: 1.2rem;
          z-index: 20;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.38rem 1.05rem;
          border-radius: 2rem;
          border: 1.5px solid rgba(201,160,96,0.75);
          background: rgba(255,255,255,0.10);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          color: #FAF6EF;
          font-family: var(--font-inter, system-ui, sans-serif);
          font-size: 0.82rem;
          font-weight: 500;
          letter-spacing: 0.04em;
          text-shadow: 0 1px 4px rgba(0,0,0,0.55);
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
        }
        .kcs-skip:hover, .kcs-skip:focus-visible {
          background: rgba(255,255,255,0.22);
          border-color: rgba(201,160,96,1);
          outline: none;
        }

        /* progress track */
        .kcs-track {
          width: 220px;
          height: 3.5px;
          background: rgba(201,160,96,0.30);
          border-radius: 2px;
          overflow: hidden;
        }
        @media (max-width: 480px) {
          .kcs-track { width: 170px; }
        }
        .kcs-fill {
          height: 100%;
          background: #702D35;
          border-radius: 2px;
          transition: width 0.08s linear;
        }
      `}</style>

      {/* ══════════════════════════════════════════
          ROOT  –  full-screen fixed overlay
          ══════════════════════════════════════════ */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="KalaConnect – Welcome"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          overflow: 'hidden',
          opacity: rootOpacity,
          transition: rootTransition,
          /* ── Layer 1: artwork background ── */
          backgroundImage: 'url(/images/splash-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* ── Layer 2: centre readability wash ──
            Softens the artwork's own text in the central zone so the
            HTML elements on Layer 3 read crisply without looking doubled. */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            /* Light ellipse in the branding centre, fading to transparent at edges */
            background:
              'radial-gradient(ellipse 54% 60% at 50% 44%, rgba(249,236,196,0.52) 0%, rgba(249,236,196,0.18) 55%, transparent 72%)',
            pointerEvents: 'none',
          }}
        />

        {/* ── Skip button (Layer 3) ── */}
        <button
          className="kcs-skip"
          onClick={dismiss}
          aria-label="Skip splash screen and enter site"
        >
          Skip&thinsp;→
        </button>

        {/* ── Layer 3: central branding content ── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            /* Nudge content slightly upward to match reference layout
               (progress area sits a bit below true centre) */
            paddingBottom: '3vh',
          }}
        >

          {/* 1 ── Logo emblem ── */}
          <div
            className="kcs-f1"
            style={{
              position: 'relative',
              width: 'clamp(96px, 10vw, 130px)',
              height: 'clamp(96px, 10vw, 130px)',
              marginBottom: '0.1rem',
            }}
          >
            <Image
              src="/images/logo.png"
              alt="KalaConnect logo emblem"
              fill
              className="object-contain"
              priority
              sizes="130px"
            />
          </div>

          {/* 2 ── Brand name ── */}
          <h1
            className="kcs-f2"
            style={{
              fontFamily: 'var(--font-cormorant, Georgia, serif)',
              fontSize: 'clamp(2.4rem, 5.5vw, 3.75rem)',
              fontWeight: 700,
              color: '#5C1A22',
              lineHeight: 1.1,
              letterSpacing: '-0.01em',
              margin: '0.15rem 0 0.25rem',
              textShadow: '0 2px 16px rgba(255,248,228,0.7)',
            }}
          >
            KalaConnect
          </h1>

          {/* 3 ── ART · IDENTITY · OPPORTUNITY ── */}
          <p
            className="kcs-f3"
            style={{
              fontFamily: 'var(--font-inter, system-ui, sans-serif)',
              fontSize: 'clamp(0.62rem, 1.1vw, 0.80rem)',
              fontWeight: 600,
              letterSpacing: '0.30em',
              color: '#4A1A10',
              textTransform: 'uppercase',
              margin: '0 0 0.65rem',
              textShadow: '0 1px 8px rgba(255,248,228,0.8)',
            }}
          >
            ART&nbsp;&nbsp;·&nbsp;&nbsp;IDENTITY&nbsp;&nbsp;·&nbsp;&nbsp;OPPORTUNITY
          </p>

          {/* 4 ── Decorative separator ── */}
          <div className="kcs-f4">
            <Separator />
          </div>

          {/* 5 ── Main tagline ── */}
          <p
            className="kcs-f5"
            style={{
              fontFamily: 'var(--font-cormorant, Georgia, serif)',
              fontSize: 'clamp(1.55rem, 3.5vw, 2.45rem)',
              fontWeight: 600,
              fontStyle: 'italic',
              color: '#5C1A22',
              lineHeight: 1.2,
              margin: '0.5rem 0 0.4rem',
              textAlign: 'center',
              textShadow: '0 2px 14px rgba(255,248,228,0.75)',
              paddingInline: '1rem',
            }}
          >
            Where Tradition Meets Tomorrow
          </p>

          {/* 6 ── Supporting text ── */}
          <p
            className="kcs-f6"
            style={{
              fontFamily: 'var(--font-inter, system-ui, sans-serif)',
              fontSize: 'clamp(0.75rem, 1.3vw, 0.95rem)',
              fontWeight: 400,
              color: '#3A1208',
              margin: '0 0 1.6rem',
              textShadow: '0 1px 8px rgba(255,248,228,0.85)',
              textAlign: 'center',
              paddingInline: '1rem',
            }}
          >
            Celebrating India&rsquo;s Artists, Art Forms &amp; Living Heritage
          </p>

          {/* 7 ── Progress area ── */}
          <div
            className="kcs-f7"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.45rem',
            }}
          >
            {/* Lotus above bar */}
            <Lotus size={18} color="#702D35" />

            {/* Progress track + fill */}
            <div
              className="kcs-track"
              role="progressbar"
              aria-valuenow={Math.round(progress)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Loading"
            >
              <div className="kcs-fill" style={{ width: `${progress}%` }} />
            </div>

            {/* Loading text */}
            <span
              style={{
                fontFamily: 'var(--font-cormorant, Georgia, serif)',
                fontSize: 'clamp(0.80rem, 1.2vw, 0.95rem)',
                fontStyle: 'italic',
                color: '#4A1A10',
                textShadow: '0 1px 6px rgba(255,248,228,0.9)',
                letterSpacing: '0.02em',
              }}
            >
              Discovering India&rsquo;s Creative Soul&hellip;
            </span>
          </div>

        </div>{/* /content */}
      </div>{/* /root */}
    </>
  );
}
