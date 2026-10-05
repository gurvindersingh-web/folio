import { useEffect, useRef, useState, memo } from 'react';
import './InkIntro.css';

// Single source of truth for timing and assets.
const INK_SRC = '/imgs/intro/ink_lv2_slow.webp';
const INK_MASK = `url(${INK_SRC})`;
const GIF_LOOP_MS = 8240;          // Exact loop length of the ink animation.
const LOOP_SAFETY_MARGIN_MS = 200; // Start fading just before it visibly loops.
const PLAY_DURATION_MS = GIF_LOOP_MS - LOOP_SAFETY_MARGIN_MS;
const FADE_OPACITY_MS = 5500;
const FADE_TRANSFORM_MS = 6500;
const REDUCED_MOTION_PLAY_MS = 400;
const REDUCED_MOTION_FADE_MS = 1;

const OVERLAY_STYLE = {
  '--fade-opacity-duration': `${FADE_OPACITY_MS}ms`,
  '--fade-transform-duration': `${FADE_TRANSFORM_MS}ms`,
  '--ink-mask': INK_MASK,
};

const getReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const InkIntro = ({ onComplete }) => {
  // loading -> playing -> fading -> done
  const [phase, setPhase] = useState('loading');
  const [reduced] = useState(getReducedMotion); // read once, consistent across effects

  // Keep latest callback without re-running the fade timer when parent re-renders.
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Preload ink mask, lock scroll, schedule fade start.
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    let cancelled = false;
    let playTimer;

    const unlock = () => {
      document.body.style.overflow = previousOverflow;
    };

    const start = () => {
      if (cancelled) return;
      setPhase('playing'); // text timeline + ink timer start together, after asset is ready
      playTimer = setTimeout(
        () => {
          unlock();
          setPhase('fading');
        },
        reduced ? REDUCED_MOTION_PLAY_MS : PLAY_DURATION_MS
      );
    };

    if (reduced) {
      start();
    } else {
      const img = new Image();
      img.decoding = 'async';
      img.src = INK_SRC;
      // Resolves on load+decode; also resolve on error so it never hangs.
      img.decode().then(start, start);
    }

    return () => {
      cancelled = true;
      clearTimeout(playTimer);
      unlock();
    };
  }, [reduced]);

  // Fade -> done.
  useEffect(() => {
    if (phase !== 'fading') return;
    const t = setTimeout(
      () => {
        setPhase('done');
        onCompleteRef.current?.();
      },
      reduced ? REDUCED_MOTION_FADE_MS : FADE_TRANSFORM_MS
    );
    return () => clearTimeout(t);
  }, [phase, reduced]);

  if (phase === 'done') return null;

  const className = [
    'ink-intro-overlay',
    phase !== 'loading' && 'is-playing',
    phase === 'fading' && 'fade-out',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={className} style={OVERLAY_STYLE}>
      <div className="ink-layer ink-layer--tl" aria-hidden="true" />
      <div className="ink-layer ink-layer--br" aria-hidden="true" />

      <div className="ink-banner">
        <div className="ink-content">
          <h1 className="ink-title">
            Gurvinder
            <br />
            Singh
          </h1>
          <p>@ gurvindersingh-web</p>
        </div>
      </div>
    </div>
  );
};

export default memo(InkIntro);