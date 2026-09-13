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

    let hardTimeout;
    let started = false;
    let endedCount = 0;

    const start = () => {
      if (started) return;
      started = true;
      clearTimeout(hardTimeout);
      videoTop.playbackRate = 1.45;
      videoBot.playbackRate = 1.45;
      setPhase('playing');
      void videoTop.play().catch(() => {});
      void videoBot.play().catch(() => {});
    };

    const handleCanPlay = () => start();
    const handleLoadedData = () => start();
    const handleEnded = () => {
      endedCount += 1;
      if (endedCount === 2) {
        setPhase('done');
        onComplete?.();
      }
    };
    videoTop.addEventListener('canplay', handleCanPlay, { once: true });
    videoBot.addEventListener('canplay', handleCanPlay, { once: true });
    videoTop.addEventListener('loadeddata', handleLoadedData, { once: true });
    videoBot.addEventListener('loadeddata', handleLoadedData, { once: true });
    videoTop.addEventListener('ended', handleEnded);
    videoBot.addEventListener('ended', handleEnded);

    hardTimeout = setTimeout(() => {
      setPhase('done');
      onComplete?.();
    }, 5000);

    return () => {
      clearTimeout(hardTimeout);
      videoTop.removeEventListener('canplay', handleCanPlay);
      videoBot.removeEventListener('canplay', handleCanPlay);
      videoTop.removeEventListener('loadeddata', handleLoadedData);
      videoBot.removeEventListener('loadeddata', handleLoadedData);
      videoTop.removeEventListener('ended', handleEnded);
      videoBot.removeEventListener('ended', handleEnded);
      document.body.style.overflow = '';
    };
  }, []);

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
