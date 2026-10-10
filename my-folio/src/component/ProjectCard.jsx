import { memo, useEffect, useRef, useState, useMemo } from 'react';
import './ProjectCard.css';
import { FiGithub, FiArrowUpRight } from 'react-icons/fi';

const ProjectCard = ({
  title,
  description,
  impact,
  stack = [],
  image,
  link,
  live,
  reverse = false,
  index = 1,
  year,
  role,
  status = 'Public',
  engine,
  video
}) => {
  const frameRef = useRef(null);
  const shineRef = useRef(null);
  const videoRef = useRef(null);
  const rafRef = useRef(0);
  const pointerFrameRef = useRef(0);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const mediaHoveredRef = useRef(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const shouldReduceVideo = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saveData = navigator.connection?.saveData === true;
    return reducedMotion || saveData;
  }, []);

  const settle = () => {
    const frame = frameRef.current;
    if (!frame) {
      rafRef.current = 0;
      return;
    }

    const current = currentRef.current;
    const target = targetRef.current;
    current.x += (target.x - current.x) * 0.14;
    current.y += (target.y - current.y) * 0.14;

    frame.style.setProperty('--rx', `${(-current.y * 5.5).toFixed(2)}deg`);
    frame.style.setProperty('--ry', `${(current.x * 7).toFixed(2)}deg`);
    frame.style.setProperty('--tx', `${(current.x * 6).toFixed(2)}px`);
    frame.style.setProperty('--ty', `${(current.y * 6).toFixed(2)}px`);

    if (Math.abs(current.x - target.x) > 0.002 || Math.abs(current.y - target.y) > 0.002) {
      rafRef.current = requestAnimationFrame(settle);
      return;
    }

    current.x = target.x;
    current.y = target.y;
    rafRef.current = 0;
  };

  const startSettle = () => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(settle);
  };

  const handlePointerMove = (event) => {
    if (event.pointerType === 'touch' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    
    const clientX = event.clientX;
    const clientY = event.clientY;

    if (!pointerFrameRef.current) {
      pointerFrameRef.current = requestAnimationFrame(() => {
        pointerFrameRef.current = 0;
        
        const frame = frameRef.current;
        if (!frame) return;

        const rect = frame.getBoundingClientRect();
        const px = (clientX - rect.left) / rect.width;
        const py = (clientY - rect.top) / rect.height;
        targetRef.current = {
          x: Math.max(-1, Math.min(1, (px - 0.5) * 2)),
          y: Math.max(-1, Math.min(1, (py - 0.5) * 2))
        };

        if (shineRef.current) {
          shineRef.current.style.setProperty('--sx', `${px * 100}%`);
          shineRef.current.style.setProperty('--sy', `${py * 100}%`);
        }

        startSettle();
      });
    }
  };

  const handlePointerEnter = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    mediaHoveredRef.current = true;
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handlePointerLeave = () => {
    mediaHoveredRef.current = false;
    targetRef.current = { x: 0, y: 0 };
    startSettle();
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  useEffect(() => () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (pointerFrameRef.current) cancelAnimationFrame(pointerFrameRef.current);
  }, []);

  useEffect(() => {
    const card = frameRef.current?.closest('.project-card');
    if (!card || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return undefined;
    }
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
      if (entry.isIntersecting && video) {
        setShouldLoadVideo(true);
      }
    }, { threshold: 0.01, rootMargin: '200px' });
    observer.observe(card);
    return () => observer.disconnect();
  }, [video]);

  useEffect(() => {
    if (shouldLoadVideo && mediaHoveredRef.current && videoReady) {
      videoRef.current?.play().catch(() => {});
    }
  }, [shouldLoadVideo, videoReady]);

  const paddedIndex = String(index).padStart(2, '0');
  const specs = [
    year ? ['YEAR', year] : null,
    role ? ['ROLE', role] : null,
    engine ? ['ENGINE', engine] : null,
    status ? ['STATUS', status] : null
  ].filter(Boolean);

  const isSquare = image.endsWith('.png');

  return (
    <article className={`project-card ${reverse ? 'project-card--reverse' : ''} ${isVisible ? 'project-card--visible' : ''}`}>
      <div className="project-card__index" aria-hidden="true">
        {paddedIndex}
      </div>

      <div
        className="project-card__media"
        onPointerMove={handlePointerMove}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        <div ref={frameRef} className="project-card__frame">
          <span className="project-card__corner project-card__corner--tl">+</span>
          <span className="project-card__corner project-card__corner--tr">+</span>
          <span className="project-card__corner project-card__corner--bl">+</span>
          <span className="project-card__corner project-card__corner--br">+</span>
          <div className="project-card__image-clip">
            <picture>
              {!image.endsWith('.webp') && !image.endsWith('.avif') && (
                <>
                  <source srcSet={image.replace(/\.(png|jpg|jpeg)$/i, '.avif')} type="image/avif" />
                  <source srcSet={image.replace(/\.(png|jpg|jpeg)$/i, '.webp')} type="image/webp" />
                </>
              )}
              <img
                src={image}
                alt={title}
                width="1280"
                height="720"
                className={`project-card__image${isSquare ? ' project-card__image--square' : ''}`}
                loading="lazy"
                decoding="async"
              />
            </picture>
            
            {video && shouldLoadVideo && !shouldReduceVideo && (
              <video
                ref={videoRef}
                className="project-card__video"
                loop
                muted
                playsInline
                preload="metadata"
                poster={video.replace(/\.mp4$/, '-poster.jpg')}
                onCanPlay={() => setVideoReady(true)}
                width="1280"
                height="720"
              >
                <source src={video.replace(/\.mp4$/, '.webm')} type="video/webm" />
                <source src={video} type="video/mp4" />
              </video>
            )}
            {video && shouldReduceVideo && (
              <img
                src={video.replace(/\.mp4$/, '-poster.jpg')}
                alt="Video poster fallback"
                className="project-card__video"
                style={{ opacity: 1, pointerEvents: 'none' }}
                width="1280"
                height="720"
                loading="lazy"
                decoding="async"
              />
            )}
            <div ref={shineRef} className="project-card__shine" />
            <div className="project-card__image-overlay" />
          </div>
          <div className="project-card__scan" />
        </div>
      </div>

      <div className="project-card__body">
        <div className="r-about-eyebrow project-card__eyebrow">
          <span className="r-about-eyebrow-text">{`PROJECT ${paddedIndex}`}</span>
          <span className="r-about-eyebrow-icon">水</span>
        </div>

        <div className="project-card__content">
          <div className="project-card__kicker">
            <span className="r-pulse" />
            Featured work
          </div>
          <h3 className="project-card__title">{title}</h3>
          <p className="project-card__description">{description}</p>

          {impact && (
            <p className="project-card__impact">{impact}</p>
          )}

          {specs.length > 0 && (
            <div className="project-card__specs">
              {specs.map(([label, value]) => (
                <div className="r-spec-row" key={label}>
                  <span>{label}</span>
                  <span className="r-dots" />
                  <span>{value}</span>
                </div>
              ))}
            </div>
          )}

          {stack.length > 0 && (
            <div className="project-card__stack">
              {stack.map((tech) => (
                <span key={tech} className="project-card__stack-item">{tech}</span>
              ))}
            </div>
          )}

          <div className="project-card__links">
            {link && (
              <a href={link} target="_blank" rel="noopener noreferrer" className="project-card__link project-card__link--primary">
                <FiGithub size={16} />
                <span>Source</span>
                <FiArrowUpRight size={14} />
              </a>
            )}
            {live && (
              <a href={live} target="_blank" rel="noopener noreferrer" className="project-card__link">
                <span>Live demo</span>
                <FiArrowUpRight size={14} />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default memo(ProjectCard);
