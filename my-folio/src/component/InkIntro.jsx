import React, { useState, useEffect } from 'react';
import './InkIntro.css';

const InkIntro = ({ onComplete }) => {
  const [isFading, setIsFading] = useState(false);
  const [gifUrl] = useState(`url(/imgs/intro/ink_lv2.gif?t=${Date.now()})`);

  useEffect(() => {
    // Prevent scrolling while intro is active
    document.body.style.overflow = 'hidden';

    // The ink animation GIF plays for around 3.5 seconds
    const timer = setTimeout(() => {
      setIsFading(true);
      document.body.style.overflow = '';
    }, 4000);

    // After fading out (1s), completely remove it
    const removeTimer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 5000);

    return () => {
      clearTimeout(timer);
      clearTimeout(removeTimer);
      document.body.style.overflow = '';
    };
  }, [onComplete]);

  return (
    <div 
      className={`ink-intro-overlay ${isFading ? 'fade-out' : ''}`}
      style={{ '--ink-mask': gifUrl }}
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
