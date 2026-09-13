import { useEffect } from 'react';

let lenisInstance = null;
let revealTimer = 0;

function headerOffset() {
  const header = document.querySelector('.r-header');
  return -(header?.offsetHeight ?? 88) - 64; // Increased offset for perfect alignment
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function revealLayout() {
  document.documentElement.classList.add('is-anchor-scrolling');
  window.clearTimeout(revealTimer);
}

function hideLayout() {
  window.clearTimeout(revealTimer);
  revealTimer = window.setTimeout(() => {
    document.documentElement.classList.remove('is-anchor-scrolling');
  }, 80);
}

export function scrollToAnchor(hashOrEl, { updateHash = true } = {}) {
  if (typeof window === 'undefined') return;

  const id = typeof hashOrEl === 'string'
    ? hashOrEl.replace(/^#/, '')
    : hashOrEl?.id;
  const el = typeof hashOrEl === 'string'
    ? document.getElementById(id)
    : hashOrEl;

  if (!el) return;

  revealLayout();
  void el.getBoundingClientRect();

  const offset = headerOffset();
  const reduced = prefersReducedMotion();
  const lenis = lenisInstance;

  const finish = () => hideLayout();

  if (lenis && !reduced) {
    lenis.scrollTo(el, {
      offset,
      duration: 1.2,
      onComplete: finish,
    });
  } else if (reduced) {
    const top = el.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: 'auto' });
    finish();
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: 'smooth' });
    window.setTimeout(finish, 900);
  }

  if (updateHash && id) {
    const next = `#${id}`;
    if (window.location.hash !== next) {
      history.replaceState(null, '', next);
    }
  }
}

function isInPageHashLink(anchor) {
  if (!anchor) return false;
  if (anchor.hasAttribute('download') || anchor.target === '_blank') return false;

  const href = anchor.getAttribute('href');
  if (!href || href === '#') return false;

  try {
    const url = new URL(href, window.location.href);
    return url.origin === window.location.origin
      && url.pathname === window.location.pathname
      && url.hash.length > 1;
  } catch {
    return false;
  }
}

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

    if (window.location.hash) {
      const initial = document.getElementById(window.location.hash.slice(1));
      if (initial) {
        requestAnimationFrame(() => scrollToAnchor(initial, { updateHash: false }));
      }
    }

    return () => document.removeEventListener('click', onClick);
  }, []);

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
        anchors: false,
        prevent: (node) => node?.closest?.('[data-lenis-prevent]')
      });
      lenisInstance = lenis;

      lenis.on('scroll', ScrollTrigger.update);
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
          if (lenisInstance === lenis) lenisInstance = null;
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
      if (lenisInstance === lenis) lenisInstance = null;
      lenis?.destroy();
    };
  }, []);

  return children;
};

export default SmoothScroll;
