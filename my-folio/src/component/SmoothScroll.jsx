import { useEffect } from 'react';

const SmoothScroll = ({ children }) => {
  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionQuery.matches) return undefined;

    let disposed = false;
    let lenis;
    let gsap;
    let onTick;
    let handleVisibilityChange;
    let handleChange;

    Promise.all([
      import('lenis'),
      import('gsap'),
      import('gsap/ScrollTrigger')
    ]).then(([{ default: Lenis }, { gsap: loadedGsap }, { ScrollTrigger }]) => {
      if (disposed) return;
      gsap = loadedGsap;
      gsap.registerPlugin(ScrollTrigger);
      lenis = new Lenis({
        duration: 1.05,
        lerp: 0.1,
        smoothWheel: true,
        autoRaf: false,
        anchors: true,
        prevent: (node) => node?.closest?.('[data-lenis-prevent]')
      });

      lenis.on('scroll', ScrollTrigger.update);
      onTick = (time) => lenis.raf(time * 1000);
      gsap.ticker.add(onTick);
      gsap.ticker.lagSmoothing(0);

      handleVisibilityChange = () => {
        if (document.hidden) lenis.stop();
        else lenis.start();
      };
      handleChange = (event) => {
        if (event.matches) lenis.destroy();
      };
      motionQuery.addEventListener('change', handleChange);
      document.addEventListener('visibilitychange', handleVisibilityChange);
    });

    return () => {
      disposed = true;
      if (handleChange) motionQuery.removeEventListener('change', handleChange);
      if (handleVisibilityChange) document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (gsap && onTick) gsap.ticker.remove(onTick);
      lenis?.destroy();
    };
  }, []);

  return children;
};

export default SmoothScroll;
