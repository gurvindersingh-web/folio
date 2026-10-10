import { useEffect, useRef, useState, memo } from 'react';
import './InkIntro.css';

const INK_SRC = '/imgs/intro/ink_lv2_slow.webp';
const GIF_LOOP_MS = 4400;          // exact loop length of the ink animation
const LOOP_SAFETY_MARGIN_MS = 200; // cut layers just before it visibly loops
const PLAY_DURATION_MS = GIF_LOOP_MS - LOOP_SAFETY_MARGIN_MS;
const FADE_MS = LOOP_SAFETY_MARGIN_MS;
const UNMOUNT_MS = FADE_MS + 50;
const REDUCED_MOTION_PLAY_MS = 400;
const REDUCED_MOTION_FADE_MS = 1;

const OVERLAY_STYLE = {
  '--fade-ms': `${FADE_MS}ms`,
  '--ink-mask': `url(${INK_SRC})`,
};

const getReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const InkIntro = ({ onComplete }) => {
  // loading -> playing -> fading -> done
  const [phase, setPhase] = useState('loading');
  const [reduced] = useState(getReducedMotion);

  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Preload ink, lock scroll, schedule fade start.
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
      setPhase('playing');
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
      img.fetchPriority = 'high';
      img.src = INK_SRC;
      img.decode().then(start, start);
    }

    return () => {
      cancelled = true;
      clearTimeout(playTimer);
      unlock();
    };
  }, [reduced]);

  // Fade starts -> release the app immediately; unmount right after.
  useEffect(() => {
    if (phase !== 'fading') return;
    onCompleteRef.current?.();
    const t = setTimeout(
      () => setPhase('done'),
      reduced ? REDUCED_MOTION_FADE_MS : UNMOUNT_MS
    );
    return () => clearTimeout(t);
  }, [phase, reduced]);

  if (phase === 'done') return null;

  const fading = phase === 'fading';

  const className = [
    'ink-intro-overlay',
    phase !== 'loading' && 'is-playing',
    fading && 'fade-out',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={className}
      style={OVERLAY_STYLE}
      inert={fading}
      aria-hidden={fading || undefined}
    >
      <div className="ink-layer" aria-hidden="true" />

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