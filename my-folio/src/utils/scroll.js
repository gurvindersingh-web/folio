export let lenisInstance = null;
export function setLenisInstance(instance) { lenisInstance = instance; }

/** Fired on window: detail = { phase: 'start' | 'end', id } */
export const ANCHOR_SCROLL_EVENT = 'anchor-scroll';

const SETTLE_TOLERANCE = 1.5;   // px the section top may be off the header line
const SETTLE_DELAY = 120;       // ms between correction passes (lets lazy layout settle)
const MAX_SETTLE_PASSES = 4;

// Dash timing
const DASH_IN_MS = 520;         // wipe covers the screen
const DASH_OUT_MS = 2080;        // wipe exits, revealing the target section
const DASH_SKEW = -12;          // deg
const DASH_Z = '9998';          // keep below modals; adjust if the header should sit above it

const INTERRUPT_EVENTS = ['wheel', 'touchstart', 'pointerdown', 'keydown'];
const INTERRUPT_KEYS = new Set(['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ']);

let revealTimer = 0;
let session = null; // { id, token, timers, anims, removeListeners }
let counter = 0;
let overlayEl = null;

function headerHeight() {
  const header = document.querySelector('.r-header');
  return header?.getBoundingClientRect().height ?? 88;
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

function emit(phase, id) {
  window.dispatchEvent(new CustomEvent(ANCHOR_SCROLL_EVENT, { detail: { phase, id } }));
}

/** Absolute scrollY that puts `el` directly under the fixed header (clamped to the page). */
function goalFor(el) {
  const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  const top = el.getBoundingClientRect().top + window.scrollY - headerHeight();
  return Math.min(Math.max(0, top), maxScroll);
}

/** Instant jump (also cancels any running smooth scroll when called with the current position). */
function jumpTo(y) {
  const lenis = lenisInstance;
  if (lenis) {
    try {
      lenis.scrollTo(y, { immediate: true, force: true });
      return;
    } catch { /* fall through to native */ }
  }
  window.scrollTo({ top: y, behavior: 'instant' });
}

/** Lazily created full-screen wipe element. Override colors via --dash-bg / --dash-accent. */
function getOverlay() {
  if (overlayEl && overlayEl.isConnected) return overlayEl;
  const el = document.createElement('div');
  el.setAttribute('aria-hidden', 'true');
  Object.assign(el.style, {
  position: 'fixed',
  top: '0',
  left: '-15%',
  width: '130%',
  height: '100%',
  zIndex: DASH_Z,
  pointerEvents: 'none',
  visibility: 'hidden',
  willChange: 'transform',
  backgroundColor: '#d4cebd',
  transform: `translateX(-115%) skewX(${DASH_SKEW}deg)`,
});
  document.body.appendChild(el);
  overlayEl = el;
  return el;
}

function hideOverlay() {
  if (overlayEl) overlayEl.style.visibility = 'hidden';
}

function closeSession() {
  if (!session) return;
  session.timers.forEach((t) => window.clearTimeout(t));
  session.anims.forEach((a) => { try { a.cancel(); } catch { /* noop */ } });
  session.removeListeners();
  session = null;
  hideOverlay();
}

function finishSession() {
  const done = session;
  if (!done) return;
  closeSession();
  hideLayout();
  emit('end', done.id);
}

export function cancelAnchorScroll() {
  if (!session) return;
  jumpTo(window.scrollY);
  finishSession();
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

  // Same target already in flight (e.g. two click handlers fired) → ignore.
  if (session && id && session.id === id) return;

  closeSession(); // supersede any previous run silently

  const token = ++counter;
  const live = () => session?.token === token;
  const reduced = prefersReducedMotion();

  const onInterrupt = (e) => {
    if (e.type === 'keydown' && !INTERRUPT_KEYS.has(e.key)) return;
    if (!live()) return;
    jumpTo(window.scrollY); // stop where the user is
    finishSession();
  };
  const listenerOpts = { passive: true };
  INTERRUPT_EVENTS.forEach((type) => window.addEventListener(type, onInterrupt, listenerOpts));

  session = {
    id,
    token,
    timers: [],
    anims: [],
    removeListeners: () => INTERRUPT_EVENTS.forEach((type) => window.removeEventListener(type, onInterrupt, listenerOpts)),
  };

  const later = (fn, ms) => { session.timers.push(window.setTimeout(fn, ms)); };

  revealLayout();
  void el.getBoundingClientRect();
  emit('start', id);

  // After the jump: verify we really are at the section (lazy content / images can shift
  // layout) and correct, then release.
  const settle = (pass) => {
    if (!live()) return;
    const goal = goalFor(el);
    if (Math.abs(goal - window.scrollY) > SETTLE_TOLERANCE && pass < MAX_SETTLE_PASSES) {
      jumpTo(goal);
      later(() => settle(pass + 1), SETTLE_DELAY);
      return;
    }
    finishSession();
  };

  let completed = false;
  const complete = () => {
    if (completed || !live()) return;
    completed = true;
    later(() => settle(0), 0);
  };

  const goal = goalFor(el);
  const distance = Math.abs(goal - window.scrollY);

  if (reduced) {
    jumpTo(goal);
    completed = true;
    later(() => settle(0), SETTLE_DELAY);
  } else if (distance < 1) {
    complete();
  } else {
    // DASH: wipe in → instant jump while fully covered → wipe out.
    const overlay = getOverlay();
    const skew = `skewX(${DASH_SKEW}deg)`;
    overlay.style.visibility = 'visible';

    const wipeIn = overlay.animate(
      [
        { transform: `translateX(-115%) ${skew}` },
        { transform: `translateX(0%) ${skew}` },
      ],
      { duration: DASH_IN_MS, easing: 'cubic-bezier(0.7, 0, 0.84, 0)', fill: 'forwards' },
    );
    session.anims.push(wipeIn);

    wipeIn.onfinish = () => {
      if (!live()) return;
      jumpTo(goal);

      const wipeOut = overlay.animate(
        [
          { transform: `translateX(0%) ${skew}` },
          { transform: `translateX(115%) ${skew}` },
        ],
        { duration: DASH_OUT_MS, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'forwards' },
      );
      session.anims.push(wipeOut);

      wipeOut.onfinish = () => {
        if (!live()) return;
        hideOverlay();
        complete();
      };
    };

    later(complete, DASH_IN_MS + DASH_OUT_MS + 600); // safety net if onfinish never fires
  }

  if (updateHash && id) {
    const next = `#${id}`;
    if (window.location.hash !== next) {
      history.replaceState(history.state, '', next);
    }
  }
}

export function isInPageHashLink(anchor) {
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