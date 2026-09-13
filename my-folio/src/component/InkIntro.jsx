import { useState, useEffect, useRef } from 'react';
import './InkIntro.css';

const InkIntro = ({ onComplete }) => {
  const [phase, setPhase] = useState('loading'); // loading | playing | fading | done
  const overlayRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    // We use a simple Image object to wait for the preloaded image to decode.
    // We do NOT use fetch(), because fetch() can bypass the <link rel="preload"> cache 
    // and cause a double-download on Vercel.
    const img = new Image();
    const src = '/imgs/intro/ink_lv2.webp';
    
    img.onload = () => {
      if (overlayRef.current) {
        // Force browser to re-trigger the animation from frame 1 by setting it dynamically
        overlayRef.current.style.setProperty('--ink-mask', `url(${src})`);
      }
      setPhase('playing');
    };
    
    img.onerror = () => {
      // Fallback to GIF if WebP fails
      const fallbackSrc = '/imgs/intro/ink_lv2.gif';
      if (overlayRef.current) {
        overlayRef.current.style.setProperty('--ink-mask', `url(${fallbackSrc})`);
      }
      setPhase('playing');
    };

    img.src = src;

    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    if (phase !== 'playing') return;

    // Start fading out right as the ink animation reaches its maximum expansion (~3.8s)
    const fadeTimer = setTimeout(() => setPhase('fading'), 3800);
    return () => clearTimeout(fadeTimer);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'fading') return;

    document.body.style.overflow = '';
    const removeTimer = setTimeout(() => {
      setPhase('done');
      onComplete?.();
    }, 800);
    return () => clearTimeout(removeTimer);
  }, [phase, onComplete]);

  if (phase === 'done') return null;

  return (
    <div
      ref={overlayRef}
      className={`ink-intro-overlay ${phase === 'fading' ? 'fade-out' : ''}`}
      style={{
        // The mask is applied dynamically in useEffect to ensure it starts at frame 1
      }}
    >
      <div className="ink-banner">
        <div className="ink-content">
          <h1 className="ink-title">Gurvinder<br/>Singh</h1>
          <p>@ gurvindersingh-web</p>
        </div>
      </div>
    </div>
  );
};

export default InkIntro;
