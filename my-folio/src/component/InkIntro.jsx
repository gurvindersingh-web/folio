import { useState, useEffect } from 'react';
import './InkIntro.css';

const InkIntro = ({ onComplete }) => {
  const [phase, setPhase] = useState('playing');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    // The GIF loops continuously. We fade out and unmount after 4.5 seconds to reveal the website.
    const hardTimeout = setTimeout(() => {
      setPhase('fading');
    }, 4500);

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
      }, 600); // match CSS fade-out duration
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
