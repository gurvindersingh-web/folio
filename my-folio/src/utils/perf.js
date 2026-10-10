/** Shared performance helpers — no React, safe to import from any module. */

const DPR_DESKTOP_MAX = 2;
const DPR_DEFAULT_MAX = 1.5;
const DPR_LOW_POWER_MAX = 1;

let refreshTimer = 0;
let refreshRaf = 0;
let layoutObserver = null;
let layoutListenerBound = false;

export function capDpr(max = DPR_DEFAULT_MAX) {
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
  return Math.min(dpr, max);
}

export function isLowPowerDevice() {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cores = navigator.hardwareConcurrency || 8;
  const memory = navigator.deviceMemory || 8;
  return reduced || (coarse && (cores <= 4 || memory <= 4));
}

export function renderDprCap() {
  if (isLowPowerDevice()) return DPR_LOW_POWER_MAX;
  // Fine pointer (desktop/trackpad): allow up to 2; otherwise 1.5.
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches) {
    return Math.min(DPR_DESKTOP_MAX, DPR_DEFAULT_MAX + 0.5);
  }
  return DPR_DEFAULT_MAX;
}

/** Debounced ScrollTrigger.refresh — coalesces theme, image load, resize. */
export function scheduleScrollTriggerRefresh(delay = 150) {
  if (typeof window === 'undefined') return;
  if (refreshTimer) clearTimeout(refreshTimer);
  refreshTimer = window.setTimeout(() => {
    refreshTimer = 0;
    if (refreshRaf) cancelAnimationFrame(refreshRaf);
    refreshRaf = requestAnimationFrame(() => {
      refreshRaf = 0;
      window.__portfolioScrollTrigger?.refresh?.();
    });
  }, delay);
}

/**
 * One shared ResizeObserver (+ visualViewport / fonts) that refreshes ScrollTrigger.
 * Idempotent — safe to call from SmoothScroll mount.
 */
export function bindLayoutRefresh() {
  if (typeof window === 'undefined' || layoutListenerBound) return () => {};
  layoutListenerBound = true;

  const onResize = () => scheduleScrollTriggerRefresh(120);

  if (typeof ResizeObserver !== 'undefined') {
    layoutObserver = new ResizeObserver(onResize);
    layoutObserver.observe(document.documentElement);
  } else {
    window.addEventListener('resize', onResize, { passive: true });
  }

  window.visualViewport?.addEventListener('resize', onResize, { passive: true });
  window.addEventListener('orientationchange', onResize, { passive: true });

  if (document.fonts?.ready) {
    document.fonts.ready.then(() => scheduleScrollTriggerRefresh(0)).catch(() => {});
  }

  return () => {
    layoutListenerBound = false;
    layoutObserver?.disconnect();
    layoutObserver = null;
    window.removeEventListener('resize', onResize);
    window.visualViewport?.removeEventListener('resize', onResize);
    window.removeEventListener('orientationchange', onResize);
    if (refreshTimer) clearTimeout(refreshTimer);
    if (refreshRaf) cancelAnimationFrame(refreshRaf);
    refreshTimer = 0;
    refreshRaf = 0;
  };
}

export function runWhenIdle(fn, timeout = 2000) {
  if (typeof window === 'undefined') return () => {};
  if ('requestIdleCallback' in window) {
    const id = window.requestIdleCallback(fn, { timeout });
    return () => window.cancelIdleCallback?.(id);
  }
  const id = window.setTimeout(fn, Math.min(timeout, 1200));
  return () => clearTimeout(id);
}
