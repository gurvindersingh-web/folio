import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SmoothScroll = ({ children }) => {
  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionQuery.matches) return undefined;

    const lenis = new Lenis({
      duration: 1.05,
      lerp: 0.1,
      smoothWheel: true,
      autoRaf: false,
      anchors: true,
      prevent: (node) => node?.closest?.('[data-lenis-prevent]')
    });

    lenis.on('scroll', ScrollTrigger.update);

    const onTick = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    const handleChange = (event) => {
      if (event.matches) {
        lenis.destroy();
      }
    };
    motionQuery.addEventListener('change', handleChange);

    return () => {
      motionQuery.removeEventListener('change', handleChange);
      gsap.ticker.remove(onTick);
      lenis.destroy();
    };
  }, []);

  return children;
};

export default SmoothScroll;
