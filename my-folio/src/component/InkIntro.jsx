import { useState, useEffect } from 'react';
import './InkIntro.css';

const InkIntro = ({ onComplete }) => {
  const [phase, setPhase] = useState('playing');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    // The GIF is exactly 6.24s long. We start fading just before it loops.
    const hardTimeout = setTimeout(() => {
      setPhase('fading');
    }, 6200);

    return () => {
      clearTimeout(hardTimeout);
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    if (phase === 'fading') {
      const timer = setTimeout(() => {
        setPhase('done');
        onComplete?.();
        document.body.style.overflow = '';
      }, 3000); // match longest CSS fade-out duration (transform is 3s)
      return () => clearTimeout(timer);
    }
  }, [phase, onComplete]);

  if (phase === 'done') return null;

  return (
    <div className={`ink-intro-overlay ${phase === 'fading' ? 'fade-out' : ''}`}>
      
      {/* Nested layers for wiping away the background to transparent */}
      <div className="ink-layer ink-layer--tl">
        <div className="ink-layer ink-layer--br"></div>
      </div>
      
      {/* Banner text sits on top and fades out via CSS */}
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
