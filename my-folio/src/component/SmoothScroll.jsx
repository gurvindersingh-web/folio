import { useEffect } from 'react';
import { 
  lenisInstance, 
  setLenisInstance, 
  scrollToAnchor, 
  isInPageHashLink 
} from '../utils/scroll.js';

const SmoothScroll = ({ children }) => {
  useEffect(() => {
    const onClick = (event) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = event.target.closest('a[href]');
      if (!isInPageHashLink(anchor)) return;

      const hash = new URL(anchor.getAttribute('href'), window.location.href).hash;
      const target = document.getElementById(hash.slice(1));
      if (!target) return;

      event.preventDefault();
      scrollToAnchor(target);
    };

    document.addEventListener('click', onClick);

    let rafId;
    if (window.location.hash) {
      const initial = document.getElementById(window.location.hash.slice(1));
      if (initial) {
        rafId = requestAnimationFrame(() => scrollToAnchor(initial, { updateHash: false }));
      }
    }

    return () => {
      document.removeEventListener('click', onClick);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce), (pointer: coarse)');
    if (motionQuery.matches) return undefined;

    let disposed = false;
    let lenis;
    let gsap;
    let scrollTrigger;
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
      scrollTrigger = ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);
      window.__portfolioScrollTrigger = ScrollTrigger;
      lenis = new Lenis({
        duration: 1.05,
        lerp: 0.1,
        smoothWheel: true,
        autoRaf: false,
        anchors: false,
        prevent: (node) => node?.closest?.('[data-lenis-prevent]')
      });
      setLenisInstance(lenis);

      lenis.on('scroll', (event) => {
        ScrollTrigger.update(event);
        window.dispatchEvent(new CustomEvent('portfolio-scroll'));
      });
      onTick = (time) => lenis.raf(time * 1000);
      gsap.ticker.add(onTick);
      gsap.ticker.lagSmoothing(0);

      handleVisibilityChange = () => {
        if (document.hidden) lenis.stop();
        else lenis.start();
      };
      handleChange = (event) => {
        if (event.matches) {
          lenis.destroy();
          if (lenisInstance === lenis) setLenisInstance(null);
        }
      };
      motionQuery.addEventListener('change', handleChange);
      document.addEventListener('visibilitychange', handleVisibilityChange);
    });

    return () => {
      disposed = true;
      if (handleChange) motionQuery.removeEventListener('change', handleChange);
      if (handleVisibilityChange) document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (gsap && onTick) gsap.ticker.remove(onTick);
      if (window.__portfolioScrollTrigger === scrollTrigger) window.__portfolioScrollTrigger = null;
      if (lenisInstance === lenis) setLenisInstance(null);
      lenis?.destroy();
    };
  }, []);

  return children;
};

export default SmoothScroll;
