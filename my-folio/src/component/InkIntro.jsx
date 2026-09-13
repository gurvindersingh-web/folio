import { useState, useEffect } from 'react';
import './InkIntro.css';

const InkIntro = ({ onComplete }) => {
  const [phase, setPhase] = useState('playing'); // playing | fading | done

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    // Pure CSS @property animation drives the ink reveal.
    // Zero network dependency — starts painting on first frame.
    // Longest blob animation: 3.2s duration + 0.2s delay = ends ~3.4s
    // Add buffer → fade at 3.6s
    const fadeTimer = setTimeout(() => setPhase('fading'), 3600);

    return () => {
      clearTimeout(fadeTimer);
      document.body.style.overflow = '';
    };
  }, []);

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
    <div className={`ink-intro-overlay ${phase === 'fading' ? 'fade-out' : ''}`}>
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
