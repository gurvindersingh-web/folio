import { useState, useEffect, useRef } from 'react';
import './InkIntro.css';

const InkIntro = ({ onComplete }) => {
  const [phase, setPhase] = useState('loading');
  const videoTopRef = useRef(null);
  const videoBotRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const videoTop = videoTopRef.current;
    const videoBot = videoBotRef.current;
    if (!videoTop || !videoBot) return;

    let fadeTimeout;
    let hardTimeout;
    let started = false;

    const start = (fadeDelay = 3600) => {
      if (started) return;
      started = true;
      clearTimeout(hardTimeout);
      clearTimeout(fadeTimeout);
      videoTop.playbackRate = 1.45;
      videoBot.playbackRate = 1.45;
      setPhase('playing');
      void videoTop.play().catch(() => {});
      void videoBot.play().catch(() => {});
      fadeTimeout = setTimeout(() => setPhase('fading'), fadeDelay);
    };

    const handleCanPlay = () => start();
    const handleLoadedData = () => start();
    videoTop.addEventListener('canplay', handleCanPlay, { once: true });
    videoBot.addEventListener('canplay', handleCanPlay, { once: true });
    videoTop.addEventListener('loadeddata', handleLoadedData, { once: true });
    videoBot.addEventListener('loadeddata', handleLoadedData, { once: true });

    hardTimeout = setTimeout(() => {
      start(900);
    }, 1800);

    return () => {
      clearTimeout(fadeTimeout);
      clearTimeout(hardTimeout);
      videoTop.removeEventListener('canplay', handleCanPlay);
      videoBot.removeEventListener('canplay', handleCanPlay);
      videoTop.removeEventListener('loadeddata', handleLoadedData);
      videoBot.removeEventListener('loadeddata', handleLoadedData);
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    if (phase !== 'fading') return;

    document.body.style.overflow = '';
    setPhase('done');
    onComplete?.();
  }, [phase, onComplete]);

  if (phase === 'done') return null;

  return (
    <div className="ink-intro-overlay">
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
        preload="auto"
      />

      {/* Bottom-right ink — rotated 180° so it spreads from the opposite corner */}
      <video
        ref={videoBotRef}
        className="ink-video ink-video--bottom-right"
        src="/imgs/intro/ink.mp4"
        muted
        playsInline
        preload="auto"
      />
    </div>
  );
};

export default InkIntro;
