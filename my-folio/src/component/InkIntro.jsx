import { useState, useEffect, useRef } from 'react';
import './InkIntro.css';

const InkIntro = ({ onComplete }) => {
  const [phase, setPhase] = useState('loading'); // loading | playing | fading | done
  const videoRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const video = videoRef.current;
    if (!video) return;

    let fadeTimeout;

    const startPlaying = () => {
      setPhase('playing');
      // Ink fully covers the screen by ~4s, then we fade
      fadeTimeout = setTimeout(() => setPhase('fading'), 4200);
    };

    const onCanPlay = () => {
      video.play()
        .then(startPlaying)
        .catch(() => {
          // Autoplay blocked (rare for muted) — skip intro
          setPhase('fading');
        });
    };

    // Hard timeout: if video hasn't loaded in 2.5s, skip intro entirely
    const hardTimeout = setTimeout(() => {
      setPhase('fading');
    }, 2500);

    video.addEventListener('canplay', onCanPlay, { once: true });

    return () => {
      clearTimeout(fadeTimeout);
      clearTimeout(hardTimeout);
      video.removeEventListener('canplay', onCanPlay);
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
      {/* Text layer — sits behind the video */}
      <div className="ink-banner">
        <div className="ink-content">
          <h1 className="ink-title">Gurvinder<br/>Singh</h1>
          <p>@ gurvindersingh-web</p>
        </div>
      </div>

      {/* Ink video — mix-blend-mode: multiply makes white areas invisible
          against the beige background, while black ink areas turn everything
          dark, creating the reveal effect */}
      <video
        ref={videoRef}
        className="ink-video"
        src="/imgs/intro/ink.mp4"
        muted
        playsInline
        preload="auto"
      />
    </div>
  );
};

export default InkIntro;
