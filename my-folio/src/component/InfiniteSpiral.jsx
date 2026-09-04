import { useEffect, useMemo, useRef } from 'react';
import './InfiniteSpiral.css';

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const modulo = (value, divisor) => ((value % divisor) + divisor) % divisor;
const smoothstep = (min, max, value) => {
  const x = clamp((value - min) / (max - min || 1), 0, 1);
  return x * x * (3 - 2 * x);
};

const InfiniteSpiral = ({
  items = [],
  speed = 0.55,
  direction = 'up',
  animationMode = 'auto',
  radius = 170,
  cardWidth = 100,
  cardHeight = 100,
  verticalSpacing = 60,
  perspective = 1000,
  cardsPerTurn = 7,
  rotation = 0,
  cardTilt = 0,
  cardRadius = 10,
  centerScale = 1.2,
  edgeFade = 0.3,
  edgeBlur = 6,
  maxFps = 60,
  pauseOnHover = false,
  imageFit = 'cover',
  grayscale = 0,
  className = ''
}) => {
  const rootRef = useRef(null);
  const cardRefs = useRef([]);
  const progressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const autoSpeedRef = useRef(0);
  const hoveredRef = useRef(false);
  const visibleRef = useRef(true);
  const draggingRef = useRef(false);
  const lastPointerYRef = useRef(0);
  const dragMovedRef = useRef(false);
  const wakeRef = useRef(() => {});
  const cardStyleCacheRef = useRef([]);

  const normalizedItems = useMemo(
    () =>
      items.map((item, index) =>
        typeof item === 'string'
          ? { src: item, alt: `Spiral image ${index + 1}` }
          : { alt: `Spiral image ${index + 1}`, ...item }
      ),
    [items]
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root || normalizedItems.length === 0) return;

    let frameId = 0;
    let throttleTimer = 0;
    let lastRenderTime = 0;
    let documentVisible = !document.hidden;
    let previousTime = performance.now();
    let bounds = root.getBoundingClientRect();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const scrollEnabled = animationMode === 'scroll' || animationMode === 'all';
    const scrollSpeedMultiplier = Math.max(speed, 0) / 0.55;
    let lastScrollY = window.scrollY;

    const resizeObserver = new ResizeObserver(() => {
      bounds = root.getBoundingClientRect();
    });
    resizeObserver.observe(root);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting) wakeRef.current();
      },
      { threshold: 0.02 }
    );
    intersectionObserver.observe(root);

    const handleScroll = () => {
      const nextScrollY = window.scrollY;
      const scrollDelta = nextScrollY - lastScrollY;
      lastScrollY = nextScrollY;
      if (!scrollEnabled || !visibleRef.current || scrollDelta === 0) return;
      targetProgressRef.current += clamp(
        (scrollDelta * scrollSpeedMultiplier) / Math.max(verticalSpacing * 2, 1),
        -1.5,
        1.5
      );
      wakeRef.current();
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const shouldAnimate = () => {
      const autoEnabled = animationMode === 'auto' || animationMode === 'all';
      const isSettling = Math.abs(targetProgressRef.current - progressRef.current) > 0.001;
      return documentVisible && visibleRef.current && (
        (autoEnabled && !reducedMotion.matches && !(pauseOnHover && hoveredRef.current)) ||
        draggingRef.current ||
        isSettling
      );
    };

    const schedule = () => {
      if (frameId || throttleTimer || !shouldAnimate()) return;
      const targetFps = clamp(maxFps, 20, 60);
      // At 60 FPS, use the browser's native frame scheduler to avoid timer
      // jitter. Lower caps still use a timer to save work on constrained pages.
      if (targetFps >= 59) {
        frameId = requestAnimationFrame(render);
        return;
      }
      const frameInterval = 1000 / targetFps;
      const remaining = frameInterval - (performance.now() - lastRenderTime);
      if (remaining > 0) {
        throttleTimer = window.setTimeout(() => {
          throttleTimer = 0;
          schedule();
        }, remaining);
      } else {
        frameId = requestAnimationFrame(render);
      }
    };

    const handleVisibilityChange = () => {
      documentVisible = !document.hidden;
      if (documentVisible) {
        previousTime = performance.now();
        schedule();
      }
    };
    const handleMotionChange = () => schedule();
    document.addEventListener('visibilitychange', handleVisibilityChange);
    reducedMotion.addEventListener('change', handleMotionChange);
    wakeRef.current = schedule;

    const render = time => {
      frameId = 0;
      lastRenderTime = time;
      const delta = Math.min((time - previousTime) / 1000, 0.05);
      previousTime = time;

      const autoEnabled = animationMode === 'auto' || animationMode === 'all';
      const motionPaused = draggingRef.current || (pauseOnHover && hoveredRef.current);
      const directionMultiplier = direction === 'down' ? -1 : 1;
      const desiredAutoSpeed =
        autoEnabled && visibleRef.current && !reducedMotion.matches && !motionPaused
          ? speed * directionMultiplier
          : 0;
      const speedBlend = 1 - Math.exp(-delta * 7);
      autoSpeedRef.current += (desiredAutoSpeed - autoSpeedRef.current) * speedBlend;
      targetProgressRef.current += autoSpeedRef.current * delta;

      const followBlend = 1 - Math.exp(-delta * (draggingRef.current ? 22 : 11));
      progressRef.current += (targetProgressRef.current - progressRef.current) * followBlend;

      const count = normalizedItems.length;
      const half = count / 2;
      const width = Math.max(bounds.width, 1);
      const height = Math.max(bounds.height, 1);
      const fit = Math.min(1, width / (cardWidth * 2.8), height / (cardHeight * 2.35));
      const responsiveRadius = Math.min(radius, Math.max(72, width * 0.36)) * fit;
      const fadeStart = clamp(1 - edgeFade, 0, 0.98);
      const turnSize = Math.max(cardsPerTurn, 1);

      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        let offset = index - progressRef.current;
        offset = modulo(offset + half, count) - half;

        const edge = Math.min(Math.abs(offset) / Math.max(half, 1), 1);
        const opacity = 1 - smoothstep(fadeStart, 1, edge);
        const focus = 1 - Math.min(Math.abs(offset) / Math.max(turnSize * 0.65, 1), 1);
        const scale = (1 + (centerScale - 1) * focus) * fit;
        const angle = offset * (360 / turnSize) + rotation;
        const angleRadians = (angle * Math.PI) / 180;
        const x = Math.sin(angleRadians) * responsiveRadius;
        const z = Math.cos(angleRadians) * responsiveRadius;
        const depthScale = clamp(perspective / Math.max(perspective - z, 1), 0.72, 1.45);
        const visualScale = scale * depthScale;
        const depth = (z / Math.max(responsiveRadius, 1) + 1) / 2;
        const blur = edgeBlur > 0 ? edgeBlur * smoothstep(0.35, 1, edge) : 0;
        const nextStyles = {
          transform: `translate(-50%, -50%) translate3d(${x.toFixed(2)}px, ${(offset * verticalSpacing * fit).toFixed(2)}px, 0) rotateZ(${cardTilt}deg) scale(${visualScale.toFixed(3)})`,
          opacity: opacity.toFixed(3),
          filter: blur > 0.01 ? `blur(${blur.toFixed(2)}px)` : 'none',
          zIndex: String(Math.round(depth * 100000) + index),
          pointerEvents: opacity > 0.25 ? 'auto' : 'none'
        };
        const previousStyles = cardStyleCacheRef.current[index] || {};
        Object.entries(nextStyles).forEach(([property, value]) => {
          if (previousStyles[property] !== value) card.style[property] = value;
        });
        cardStyleCacheRef.current[index] = nextStyles;
      });

      schedule();
    };

    schedule();

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(throttleTimer);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      reducedMotion.removeEventListener('change', handleMotionChange);
      wakeRef.current = () => {};
    };
  }, [
    normalizedItems,
    speed,
    direction,
    animationMode,
    radius,
    perspective,
    cardWidth,
    cardHeight,
    verticalSpacing,
    cardsPerTurn,
    rotation,
    cardTilt,
    centerScale,
    edgeFade,
    edgeBlur,
    maxFps,
    pauseOnHover
  ]);

  const rootStyle = {
    perspective: `${perspective}px`,
    '--infinite-spiral-card-width': `${cardWidth}px`,
    '--infinite-spiral-card-height': `${cardHeight}px`,
    '--infinite-spiral-card-radius': `${cardRadius}px`,
    cursor: animationMode === 'drag' || animationMode === 'all' ? 'grab' : 'default',
    touchAction: animationMode === 'drag' || animationMode === 'all' ? 'pan-x' : 'auto',
    userSelect: animationMode === 'drag' || animationMode === 'all' ? 'none' : 'auto'
  };

  const dragEnabled = animationMode === 'drag' || animationMode === 'all';

  const stopDragging = event => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    event.currentTarget.style.cursor = dragEnabled ? 'grab' : 'default';
  };

  return (
    <div
      ref={rootRef}
      className={`infinite-spiral ${className}`.trim()}
      style={rootStyle}
      onMouseEnter={() => {
        hoveredRef.current = true;
        wakeRef.current();
      }}
      onMouseLeave={() => {
        hoveredRef.current = false;
        wakeRef.current();
      }}
      onPointerDown={event => {
        if (!dragEnabled || event.button !== 0) return;
        draggingRef.current = true;
        dragMovedRef.current = false;
        lastPointerYRef.current = event.clientY;
        targetProgressRef.current = progressRef.current;
        event.currentTarget.setPointerCapture(event.pointerId);
        event.currentTarget.style.cursor = 'grabbing';
        wakeRef.current();
      }}
      onPointerMove={event => {
        if (!draggingRef.current) return;
        const pointerDelta = event.clientY - lastPointerYRef.current;
        lastPointerYRef.current = event.clientY;
        if (Math.abs(pointerDelta) > 0.5) dragMovedRef.current = true;
        targetProgressRef.current -= pointerDelta / Math.max(verticalSpacing, 1);
        wakeRef.current();
      }}
      onPointerUp={stopDragging}
      onPointerCancel={stopDragging}
      onClickCapture={event => {
        if (!dragMovedRef.current) return;
        event.preventDefault();
        event.stopPropagation();
        dragMovedRef.current = false;
      }}
    >
      <div className="infinite-spiral__stage" role="list" aria-label="Infinite spiral gallery">
        {normalizedItems.map((item, index) => {
          const Card = item.href ? 'a' : 'div';
          return (
            <Card
              key={item.id ?? `${item.src}-${index}`}
              ref={node => {
                cardRefs.current[index] = node;
              }}
              className="infinite-spiral__item"
              style={{ width: cardWidth, height: cardHeight, borderRadius: cardRadius }}
              href={item.href}
              target={item.target}
              rel={item.target === '_blank' ? 'noreferrer' : undefined}
              role="listitem"
              aria-label={item.label ?? item.alt}
            >
              <img
                className="infinite-spiral__image"
                src={item.src}
                alt={item.alt}
                width={cardWidth}
                height={cardHeight}
                loading="lazy"
                draggable={false}
                style={{
                  width: cardWidth,
                  height: cardHeight,
                  maxWidth: 'none',
                  maxHeight: 'none',
                  objectFit: imageFit,
                  filter: `grayscale(${Math.min(1, Math.max(0, grayscale))})`
                }}
              />
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default InfiniteSpiral;
