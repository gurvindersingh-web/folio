import { useState, useEffect, useRef } from 'react';
import './InkIntro.css';

const InkIntro = ({ onComplete }) => {
  const [phase, setPhase] = useState('loading');
  const videoTopRef = useRef(null);
  const videoBotRef = useRef(null);

  useEffect(() => {
    const videoTop = videoTopRef.current;
    const videoBot = videoBotRef.current;
    if (!videoTop || !videoBot) return;

    document.body.style.overflow = 'hidden';
    let fadeTimeout;
    let readyCount = 0;

    const tryStart = () => {
      readyCount++;
      if (readyCount < 2) return; // Wait for both videos

      Promise.all([videoTop.play(), videoBot.play()])
        .then(() => {
          setPhase('playing');
          fadeTimeout = setTimeout(() => setPhase('fading'), 4200);
        })
        .catch(() => setPhase('fading'));
    };

    // Keep the intro short so it never becomes a second loading screen.
    const hardTimeout = setTimeout(() => setPhase('fading'), 2200);

    videoTop.addEventListener('canplay', tryStart, { once: true });
    videoBot.addEventListener('canplay', tryStart, { once: true });

    return () => {
      clearTimeout(fadeTimeout);
      clearTimeout(hardTimeout);
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    if (phase !== 'fading') return;
    document.body.style.overflow = '';
    const timer = setTimeout(() => {
      setPhase('done');
      onComplete?.();
    }, 800);
    return () => clearTimeout(timer);
  }, [phase, onComplete]);

  if (phase === 'done') return null;

  return (
    <div className={`ink-intro-overlay ${phase === 'fading' ? 'fade-out' : ''}`}>
      <div className="ink-banner">
        <div className="ink-content">
          <h1 className="ink-title">Gurvinder<br/>Singh</h1>
          <p>@ gurvindersingh-web</p>
        </div>
      </div>

      {/* Top-left ink — plays normally */}
      <video
        ref={videoTopRef}
        className="ink-video ink-video--top-left"
        src="/imgs/intro/ink.mp4"
        muted
        playsInline
        preload="metadata"
      />

      {/* Bottom-right ink — rotated 180° so it spreads from the opposite corner */}
      <video
        ref={videoBotRef}
        className="ink-video ink-video--bottom-right"
        src="/imgs/intro/ink.mp4"
        muted
        playsInline
        preload="metadata"
      />
    </div>
  );
};

export default InkIntro;
