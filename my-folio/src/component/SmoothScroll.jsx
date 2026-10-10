import { useEffect } from 'react';
import {
  lenisInstance,
  setLenisInstance,
  scrollToAnchor,
  isInPageHashLink
} from '../utils/scroll.js';
import { bindLayoutRefresh, scheduleScrollTriggerRefresh } from '../utils/perf.js';

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

    const unbindLayout = bindLayoutRefresh();

    return () => {
      document.removeEventListener('click', onClick);
      if (rafId) cancelAnimationFrame(rafId);
      unbindLayout();
    };
  }, []);

  useEffect(() => {
    // Lenis only on fine-pointer + motion-ok devices (avoids fighting native mobile scroll).
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce), (pointer: coarse)');

    let disposed = false;
    let importing = false;
    let generation = 0;
    let lenis;
    let gsap;
    let scrollTrigger;
    let onTick;
    let ticking = false;
    let imageLoadHandler;

    const stop = () => {
      generation += 1;
      importing = false;
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (imageLoadHandler) {
        document.removeEventListener('load', imageLoadHandler, true);
        imageLoadHandler = undefined;
      }
      if (gsap && onTick) gsap.ticker.remove(onTick);
      ticking = false;
      if (window.__portfolioScrollTrigger === scrollTrigger) window.__portfolioScrollTrigger = null;
      if (lenisInstance === lenis) setLenisInstance(null);
      lenis?.destroy();
      lenis = undefined;
      gsap = undefined;
      scrollTrigger = undefined;
      onTick = undefined;
    };

    const handleVisibilityChange = () => {
      if (!lenis || !gsap || !onTick) return;
      if (document.hidden) {
        lenis.stop();
        if (ticking) gsap.ticker.remove(onTick);
        ticking = false;
      } else {
        lenis.start();
        if (!ticking) gsap.ticker.add(onTick);
        ticking = true;
      }
    };

    const start = () => {
      if (disposed || motionQuery.matches || lenis || importing) return;
      importing = true;
      const currentGeneration = ++generation;

      Promise.all([
        import('lenis'),
        import('gsap'),
        import('gsap/ScrollTrigger')
      ]).then(([{ default: Lenis }, { gsap: loadedGsap }, { ScrollTrigger }]) => {
        if (disposed || motionQuery.matches || currentGeneration !== generation) return;
        importing = false;
        gsap = loadedGsap;
        scrollTrigger = ScrollTrigger;
        gsap.registerPlugin(ScrollTrigger);
        // iOS toolbar show/hide must not thrash pin/refresh calculations.
        ScrollTrigger.config({ ignoreMobileResize: true });
        window.__portfolioScrollTrigger = ScrollTrigger;
        lenis = new Lenis({
          duration: 1.05,
          lerp: 0.12,
          smoothWheel: true,
          autoRaf: false,
          anchors: false,
          prevent: (node) => node?.closest?.('[data-lenis-prevent]')
        });
        setLenisInstance(lenis);

        // Single animation loop: GSAP ticker drives Lenis; ST updates on Lenis scroll.
        lenis.on('scroll', ScrollTrigger.update);
        onTick = (time) => lenis.raf(time * 1000);
        gsap.ticker.lagSmoothing(0);
        if (!document.hidden) {
          gsap.ticker.add(onTick);
          ticking = true;
        } else {
          lenis.stop();
        }
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Debounced refresh when lazy images change layout (capture phase, images only).
        imageLoadHandler = (event) => {
          if (event.target instanceof HTMLImageElement) scheduleScrollTriggerRefresh(180);
        };
        document.addEventListener('load', imageLoadHandler, true);
        scheduleScrollTriggerRefresh(0);
      }).catch(() => {
        if (currentGeneration === generation) importing = false;
      });
    };

    const handleMotionChange = () => {
      if (motionQuery.matches) stop();
      else start();
    };

    motionQuery.addEventListener('change', handleMotionChange);
    start();

    return () => {
      disposed = true;
      motionQuery.removeEventListener('change', handleMotionChange);
      stop();
    };
  }, []);

  return children;
};

export default SmoothScroll;
