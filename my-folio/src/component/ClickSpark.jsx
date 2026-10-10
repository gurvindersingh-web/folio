import { useRef, useEffect, useCallback } from 'react';
import { renderDprCap } from '../utils/perf.js';

const ClickSpark = ({
  sparkColor = 'var(--color-text-strong)',
  sparkSize = 10,
  sparkRadius = 15,
  sparkCount = 8,
  duration = 400,
  easing = 'ease-out',
  extraScale = 1.0,
  children
}) => {
  const maxParticles = 120;
  const canvasRef = useRef(null);
  const sparksRef = useRef([]);
  const animationIdRef = useRef(null);
  const resolvedColorRef = useRef(sparkColor);
  const rectRef = useRef({ left: 0, top: 0, width: 0, height: 0 });
  const dprRef = useRef(1);
  const cssSizeRef = useRef({ width: 0, height: 0 });
  const documentVisibleRef = useRef(typeof document === 'undefined' ? true : !document.hidden);

  useEffect(() => {
    const updateColor = () => {
      if (sparkColor?.startsWith('var(') && typeof document !== 'undefined') {
        const val = getComputedStyle(document.documentElement).getPropertyValue(sparkColor.slice(4, -1).trim()).trim();
        resolvedColorRef.current = val || sparkColor;
      } else {
        resolvedColorRef.current = sparkColor;
      }
    };
    updateColor();
    const observer = new MutationObserver(updateColor);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] });
    return () => observer.disconnect();
  }, [sparkColor]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const applySize = () => {
      const dpr = renderDprCap();
      const width = window.innerWidth;
      const height = window.innerHeight;
      dprRef.current = dpr;
      cssSizeRef.current = { width, height };
      canvas.width = Math.ceil(width * dpr);
      canvas.height = Math.ceil(height * dpr);
      const context = canvas.getContext('2d');
      context?.setTransform(dpr, 0, 0, dpr, 0, 0);
      const rect = canvas.getBoundingClientRect();
      rectRef.current = { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
    };

    applySize();

    const ro = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(applySize)
      : null;
    if (ro) {
      ro.observe(document.documentElement);
    } else {
      window.addEventListener('resize', applySize, { passive: true });
    }

    const onVisibility = () => {
      documentVisibleRef.current = !document.hidden;
      if (document.hidden && animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = null;
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      ro?.disconnect();
      window.removeEventListener('resize', applySize);
      document.removeEventListener('visibilitychange', onVisibility);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = null;
      }
    };
  }, []);

  const easeFunc = useCallback(
    t => {
      switch (easing) {
        case 'linear':
          return t;
        case 'ease-in':
          return t * t;
        case 'ease-in-out':
          return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        default:
          return t * (2 - t);
      }
    },
    [easing]
  );

  const draw = useCallback(function drawSparks(timestamp) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (!documentVisibleRef.current) {
      animationIdRef.current = null;
      return;
    }

    const { width, height } = cssSizeRef.current;
    ctx.clearRect(0, 0, width, height);

    const currentColor = resolvedColorRef.current;

    sparksRef.current = sparksRef.current.filter(spark => {
      const elapsed = timestamp - spark.startTime;
      if (elapsed >= duration) return false;

      const progress = elapsed / duration;
      const eased = easeFunc(progress);
      const distance = eased * sparkRadius * extraScale;
      const lineLength = sparkSize * (1 - eased);
      const cos = Math.cos(spark.angle);
      const sin = Math.sin(spark.angle);

      ctx.strokeStyle = currentColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(spark.x + distance * cos, spark.y + distance * sin);
      ctx.lineTo(spark.x + (distance + lineLength) * cos, spark.y + (distance + lineLength) * sin);
      ctx.stroke();

      return true;
    });

    if (sparksRef.current.length > 0) {
      animationIdRef.current = requestAnimationFrame(drawSparks);
    } else {
      animationIdRef.current = null;
    }
  }, [sparkSize, sparkRadius, duration, easeFunc, extraScale]);

  const handleClick = e => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Fixed canvas tracks the viewport — use cached rect (refreshed on resize).
    const rect = rectRef.current;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const now = performance.now();
    const newSparks = Array.from({ length: sparkCount }, (_, i) => ({
      x,
      y,
      angle: (2 * Math.PI * i) / sparkCount,
      startTime: now
    }));

    sparksRef.current.push(...newSparks);
    if (sparksRef.current.length > maxParticles) {
      sparksRef.current.splice(0, sparksRef.current.length - maxParticles);
    }

    if (!animationIdRef.current && documentVisibleRef.current) {
      animationIdRef.current = requestAnimationFrame(draw);
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%'
      }}
      onClick={handleClick}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          userSelect: 'none',
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 9999
        }}
      />
      {children}
    </div>
  );
};

export default ClickSpark;
