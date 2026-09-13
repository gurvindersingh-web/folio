import { useEffect, useRef, useState, memo } from 'react';
import './InkIntro.css';

// Single source of truth for timing — tweak these to change pacing.
const INK_GIF_SRC = '/imgs/intro/ink_lv2_slow.gif';
const GIF_LOOP_MS = 8320;          // Exact loop length of the ink GIF.
const LOOP_SAFETY_MARGIN_MS = 200; // Start fading just before it visibly loops.
const PLAY_DURATION_MS = GIF_LOOP_MS - LOOP_SAFETY_MARGIN_MS;
const FADE_OPACITY_MS = 5500;      // +2s slower fade
const FADE_TRANSFORM_MS = 6500;    // +2s slower zoom-out settle
const REDUCED_MOTION_PLAY_MS = 400;

const InkIntro = ({ onComplete }) => {
  const [phase, setPhase] = useState('playing');
  const playTimerRef = useRef(null);
  const fadeTimerRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    let cancelled = false;
    const img = new Image();

    const startPlayTimer = () => {
      if (cancelled) return;
      playTimerRef.current = setTimeout(
        () => setPhase('fading'),
        prefersReducedMotion ? REDUCED_MOTION_PLAY_MS : PLAY_DURATION_MS
      );
    };

    if (prefersReducedMotion) {
      startPlayTimer();
    } else {
      img.src = INK_GIF_SRC;
      if (img.complete) {
        startPlayTimer();
      } else {
        img.addEventListener('load', startPlayTimer, { once: true });
        img.addEventListener('error', startPlayTimer, { once: true }); // never hang forever
      }
    }

    return () => {
      cancelled = true;
      img.removeEventListener('load', startPlayTimer);
      img.removeEventListener('error', startPlayTimer);
      clearTimeout(playTimerRef.current);
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    if (phase !== 'fading') return;
    fadeTimerRef.current = setTimeout(() => {
      setPhase('done');
      onComplete?.();
      document.body.style.overflow = '';
    }, FADE_TRANSFORM_MS); // matches the longer CSS transition
    return () => clearTimeout(fadeTimerRef.current);
  }, [phase, onComplete]);

  if (phase === 'done') return null;

  return (
    <div
      className={`ink-intro-overlay ${phase === 'fading' ? 'fade-out' : ''}`}
      style={{
        '--fade-opacity-duration': `${FADE_OPACITY_MS}ms`,
        '--fade-transform-duration': `${FADE_TRANSFORM_MS}ms`,
      }}
    >
      <div className="ink-layer ink-layer--tl">
        <div className="ink-layer ink-layer--br"></div>
      </div>

      <div className="ink-banner">
        <div className="ink-content">
          <h1 className="ink-title">Gurvinder<br />Singh</h1>
          <p>@ gurvindersingh-web</p>
        </div>
      </div>
    </div>
  );
};

export default memo(InkIntro);