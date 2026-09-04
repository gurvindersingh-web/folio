import { useRef, useEffect } from 'react';

const AnimatedContent = ({
  children,
  container,
  distance = 100,
  direction = 'vertical',
  reverse = false,
  duration = 0.8,
  ease = 'power3.out',
  initialOpacity = 0,
  animateOpacity = true,
  scale = 1,
  threshold = 0.1,
  delay = 0,
  disappearAfter = 0,
  disappearDuration = 0.5,
  disappearEase = 'power3.in',
  onComplete,
  onDisappearanceComplete,
  className = '',
  ...props
}) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.style.visibility = 'visible';
      el.style.opacity = '1';
      return undefined;
    }

    let disposed = false;
    let st;
    let tl;
    let disappearance;

    import('gsap').then(async ({ gsap }) => {
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger);

      let scrollerTarget = container || document.getElementById('snap-main-container') || null;
      if (typeof scrollerTarget === 'string') {
        scrollerTarget = document.querySelector(scrollerTarget);
      }

      const axis = direction === 'horizontal' ? 'x' : 'y';
      const offset = reverse ? -distance : distance;
      const startPct = (1 - threshold) * 100;

      gsap.set(el, {
        [axis]: offset,
        scale,
        opacity: animateOpacity ? initialOpacity : 1,
        visibility: 'visible'
      });

      tl = gsap.timeline({
        paused: true,
        delay,
        onComplete: () => {
          onComplete?.();
          if (disappearAfter > 0) {
            disappearance = gsap.to(el, {
              [axis]: reverse ? distance : -distance,
              scale: 0.8,
              opacity: animateOpacity ? initialOpacity : 0,
              delay: disappearAfter,
              duration: disappearDuration,
              ease: disappearEase,
              onComplete: () => onDisappearanceComplete?.()
            });
          }
        }
      });

      tl.to(el, {
        [axis]: 0,
        scale: 1,
        opacity: 1,
        duration,
        ease
      });

      st = ScrollTrigger.create({
        trigger: el,
        scroller: scrollerTarget,
        start: `top ${startPct}%`,
        once: true,
        onEnter: () => tl.play()
      });
    });

    return () => {
      disposed = true;
      st?.kill();
      tl?.kill();
      disappearance?.kill();
    };
  }, [
    container,
    distance,
    direction,
    reverse,
    duration,
    ease,
    initialOpacity,
    animateOpacity,
    scale,
    threshold,
    delay,
    disappearAfter,
    disappearDuration,
    disappearEase,
    onComplete,
    onDisappearanceComplete
  ]);

  return (
    <div ref={ref} className={className} style={{ visibility: 'hidden' }} {...props}>
      {children}
    </div>
  );
};

export default AnimatedContent;
