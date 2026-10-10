import { useRef, useCallback, useEffect } from 'react';
import gsap from 'gsap';
import './BorderGlow.css';

function parseHSL(hslStr) {
  const match = hslStr.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);
  if (!match) return { h: 40, s: 80, l: 80 };
  return { h: parseFloat(match[1]), s: parseFloat(match[2]), l: parseFloat(match[3]) };
}

function buildGlowVars(glowColor, intensity) {
  const { h, s, l } = parseHSL(glowColor);
  const base = `${h}deg ${s}% ${l}%`;
  const opacities = [100, 60, 50, 40, 30, 20, 10];
  const keys = ['', '-60', '-50', '-40', '-30', '-20', '-10'];
  const vars = {};
  for (let i = 0; i < opacities.length; i++) {
    vars[`--glow-color${keys[i]}`] = `hsl(${base} / ${Math.min(opacities[i] * intensity, 100)}%)`;
  }
  return vars;
}

const GRADIENT_POSITIONS = ['80% 55%', '69% 34%', '8% 6%', '41% 38%', '86% 85%', '82% 18%', '51% 4%'];
const GRADIENT_KEYS = ['--gradient-one', '--gradient-two', '--gradient-three', '--gradient-four', '--gradient-five', '--gradient-six', '--gradient-seven'];
const COLOR_MAP = [0, 1, 2, 0, 1, 2, 1];

function buildGradientVars(colors) {
  const vars = {};
  for (let i = 0; i < 7; i++) {
    const c = colors[Math.min(COLOR_MAP[i], colors.length - 1)];
    vars[GRADIENT_KEYS[i]] = `radial-gradient(at ${GRADIENT_POSITIONS[i]}, ${c} 0px, transparent 50%)`;
  }
  vars['--gradient-base'] = `linear-gradient(${colors[0]} 0 100%)`;
  return vars;
}

function isLightColor(color) {
  const value = color.trim().replace('#', '');
  if (!/^[\da-f]{3}([\da-f]{3})?$/i.test(value)) return false;
  const hex = value.length === 3 ? value.split('').map(char => char + char).join('') : value;
  const red = parseInt(hex.slice(0, 2), 16);
  const green = parseInt(hex.slice(2, 4), 16);
  const blue = parseInt(hex.slice(4, 6), 16);
  return red * 0.2126 + green * 0.7152 + blue * 0.0722 > 180;
}

function easeOutCubic(x) { return 1 - Math.pow(1 - x, 3); }
function easeInCubic(x) { return x * x * x; }

function animateValue({ start = 0, end = 100, duration = 1000, delay = 0, ease = easeOutCubic, onUpdate, onEnd }) {
  let timerId = 0;
  let rafId = 0;
  let cancelled = false;
  const t0 = performance.now() + delay;
  function tick() {
    if (cancelled) return;
    const elapsed = performance.now() - t0;
    const t = Math.min(Math.max(elapsed / duration, 0), 1);
    onUpdate(start + (end - start) * ease(t));
    if (t < 1) rafId = requestAnimationFrame(tick);
    else if (onEnd) onEnd();
  }
  if (delay > 0) {
    timerId = setTimeout(() => {
      rafId = requestAnimationFrame(tick);
    }, delay);
  } else {
    rafId = requestAnimationFrame(tick);
  }
  return () => {
    cancelled = true;
    if (timerId) clearTimeout(timerId);
    if (rafId) cancelAnimationFrame(rafId);
  };
}

const BorderGlow = ({
  children,
  className = '',
  edgeSensitivity = 30,
  glowColor = '40 80 80',
  backgroundColor = 'var(--color-surface)',
  borderRadius = 28,
  glowRadius = 40,
  glowIntensity = 1.0,
  coneSpread = 25,
  animated = true,
  autoAnimate = false,
  colors,
  fillOpacity = 0.5,
}) => {
  const cardRef = useRef(null);
  const pointerFrameRef = useRef(0);
  const pointerRef = useRef(null);

  const getCenterFromRect = useCallback((rect) => {
    return [rect.width / 2, rect.height / 2];
  }, []);

  const getEdgeProximity = useCallback((rect, x, y) => {
    const [cx, cy] = getCenterFromRect(rect);
    const dx = x - cx;
    const dy = y - cy;
    let kx = Infinity;
    let ky = Infinity;
    if (dx !== 0) kx = cx / Math.abs(dx);
    if (dy !== 0) ky = cy / Math.abs(dy);
    return Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
  }, [getCenterFromRect]);

  const getCursorAngle = useCallback((rect, x, y) => {
    const [cx, cy] = getCenterFromRect(rect);
    const dx = x - cx;
    const dy = y - cy;
    if (dx === 0 && dy === 0) return 0;
    const radians = Math.atan2(dy, dx);
    let degrees = radians * (180 / Math.PI) + 90;
    if (degrees < 0) degrees += 360;
    return degrees;
  }, [getCenterFromRect]);

  const updatePointerGlow = useCallback(() => {
    pointerFrameRef.current = 0;
    if (autoAnimate) return;
    const card = cardRef.current;
    const pointer = pointerRef.current;
    if (!card || !pointer) return;

    const rect = card.getBoundingClientRect();
    const x = pointer.x - rect.left;
    const y = pointer.y - rect.top;

    const edge = getEdgeProximity(rect, x, y);
    const angle = getCursorAngle(rect, x, y);

    card.style.setProperty('--edge-proximity', `${(edge * 100).toFixed(3)}`);
    card.style.setProperty('--cursor-angle', `${angle.toFixed(3)}deg`);
  }, [autoAnimate, getEdgeProximity, getCursorAngle]);

  const handlePointerMove = useCallback((e) => {
    if (autoAnimate || e.pointerType === 'touch') return;
    pointerRef.current = { x: e.clientX, y: e.clientY };
    if (!pointerFrameRef.current) {
      pointerFrameRef.current = requestAnimationFrame(updatePointerGlow);
    }
  }, [autoAnimate, updatePointerGlow]);

  useEffect(() => () => {
    if (pointerFrameRef.current) cancelAnimationFrame(pointerFrameRef.current);
  }, []);

  useEffect(() => {
    if (!cardRef.current) return;
    if (!animated && !autoAnimate) return;
    const card = cardRef.current;

    if (autoAnimate) {
      card.classList.add('sweep-active');
      card.style.setProperty('--edge-proximity', '100');

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      let currentAngle = 0;
      const rotateSpeed = 360 / 4000;
      let isVisible = true;
      let documentVisible = !document.hidden;
      let isAnimating = false;

      const canAnimate = () => isVisible && documentVisible && !reducedMotion.matches;
      
      const tick = (time, deltaTime) => {
        if (!canAnimate()) return;
        currentAngle = (currentAngle + deltaTime * rotateSpeed) % 360;
        card.style.setProperty('--cursor-angle', `${currentAngle}deg`);
      };

      const schedule = () => {
        const shouldAnimate = canAnimate();
        if (shouldAnimate && !isAnimating) {
          gsap.ticker.add(tick);
          isAnimating = true;
        } else if (!shouldAnimate && isAnimating) {
          gsap.ticker.remove(tick);
          isAnimating = false;
        }
      };

      const observer = new IntersectionObserver(([entry]) => {
        isVisible = entry.isIntersecting;
        schedule();
      });
      observer.observe(card);

      const handleVisibilityChange = () => {
        documentVisible = !document.hidden;
        schedule();
      };
      const handleMotionChange = () => schedule();
      document.addEventListener('visibilitychange', handleVisibilityChange);
      reducedMotion.addEventListener('change', handleMotionChange);

      schedule();

      return () => {
        if (isAnimating) gsap.ticker.remove(tick);
        observer.disconnect();
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        reducedMotion.removeEventListener('change', handleMotionChange);
      };
    } else if (animated) {
      const angleStart = 110;
      const angleEnd = 465;
      card.classList.add('sweep-active');
      card.style.setProperty('--cursor-angle', `${angleStart}deg`);

      const cancels = [];
      cancels.push(animateValue({ duration: 500, onUpdate: v => card.style.setProperty('--edge-proximity', v) }));
      cancels.push(animateValue({ ease: easeInCubic, duration: 1500, end: 50, onUpdate: v => {
        card.style.setProperty('--cursor-angle', `${(angleEnd - angleStart) * (v / 100) + angleStart}deg`);
      }}));
      cancels.push(animateValue({ ease: easeOutCubic, delay: 1500, duration: 2250, start: 50, end: 100, onUpdate: v => {
        card.style.setProperty('--cursor-angle', `${(angleEnd - angleStart) * (v / 100) + angleStart}deg`);
      }}));
      cancels.push(animateValue({ ease: easeInCubic, delay: 2500, duration: 1500, start: 100, end: 0,
        onUpdate: v => card.style.setProperty('--edge-proximity', v),
        onEnd: () => card.classList.remove('sweep-active'),
      }));

      return () => {
        cancels.forEach(cancel => cancel());
      };
    }
  }, [animated, autoAnimate]);

  const glowVars = buildGlowVars(glowColor, glowIntensity);
  const isLightTheme = typeof document !== 'undefined' && document.documentElement.dataset.theme === 'light';
  const gradientColors = colors || (
    isLightTheme
      ? ['#d7c9b5', '#8e7356', '#fffaf2']
      : ['#101010ff', '#c6c1b9', '#ffffffff']
  );
  const lightSurface = isLightTheme || isLightColor(backgroundColor);

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      className={`border-glow-card${lightSurface ? ' border-glow-card--light' : ''} ${className}`}
      style={{
        '--card-bg': backgroundColor,
        '--edge-sensitivity': edgeSensitivity,
        '--border-radius': `${borderRadius}px`,
        '--glow-padding': `${glowRadius}px`,
        '--cone-spread': coneSpread,
        '--fill-opacity': fillOpacity,
        ...glowVars,
        ...buildGradientVars(gradientColors),
      }}
    >
      <span className="edge-light" />
      <div className="border-glow-inner">
        {children}
      </div>
    </div>
  );
};

export default BorderGlow;
