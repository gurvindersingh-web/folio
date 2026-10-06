export let lenisInstance = null;
export function setLenisInstance(instance) { lenisInstance = instance; }

/** Fired on window: detail = { phase: 'start' | 'end', id } */
export const ANCHOR_SCROLL_EVENT = 'anchor-scroll';

const SETTLE_TOLERANCE = 1.5;   // px the section top may be off the header line
const SETTLE_DELAY = 50;        // ms between correction passes (lets lazy layout settle)
const MAX_SETTLE_PASSES = 4;

// Dash timing
const DASH_IN_MS = 700;
const DASH_HOLD_MS = 80;
const DASH_OUT_MS = 1000;
const DASH_SKEW = -12;
const DASH_Z = '9998';
const DASH_EASE = 'cubic-bezier(0.76, 0, 0.24, 1)';

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

const skew = `skewX(${DASH_SKEW}deg)`;
const posIn = `translate3d(-115%, 0, 0) ${skew}`;
const posCover = `translate3d(0, 0, 0) ${skew}`;
const posOut = `translate3d(115%, 0, 0) ${skew}`;

/** Lazily created full-screen wipe element: #d4cebd with the name centered. */
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
    backfaceVisibility: 'hidden',
    contain: 'layout paint style',
    backgroundColor: '#d4cebd',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transform: posIn,
  });

  // Counter-skew so the text stays upright while the panel is skewed.
  const content = document.createElement('div');
  Object.assign(content.style, {
    transform: `skewX(${-DASH_SKEW}deg)`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.5rem',
    textAlign: 'center',
  });

  const title = document.createElement('div');
  title.innerHTML = 'Gurvinder<br>Singh';
  Object.assign(title.style, {
    fontFamily: "'Playfair Display', 'Playfair Display Fallback', serif",
    fontSize: 'clamp(3.5rem, 12vw, 9rem)',
    fontWeight: '500',
    lineHeight: '0.95',
    letterSpacing: '-0.02em',
    color: '#141414',
  });

  const sub = document.createElement('div');
  sub.textContent = '@ gurvindersingh-web';
  Object.assign(sub.style, {
    fontFamily: "'JetBrains Mono', 'JetBrains Mono Fallback', monospace",
    fontSize: 'clamp(0.7rem, 1.2vw, 0.95rem)',
    fontWeight: '600',
    letterSpacing: '0.25em',
    textTransform: 'uppercase',
    color: '#3a3a36',
  });

  content.append(title, sub);
  el.appendChild(content);
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
    // DASH: wipe in → jump while fully covered → wipe out.
    const overlay = getOverlay();
    overlay.style.transform = posIn;
    overlay.style.visibility = 'visible';

    const wipeIn = overlay.animate(
      [{ transform: posIn }, { transform: posCover }],
      { duration: DASH_IN_MS, easing: DASH_EASE, fill: 'forwards' },
    );
    session.anims.push(wipeIn);

    const startWipeOut = () => {
      if (!live()) return;
      const wipeOut = overlay.animate(
        [{ transform: posCover }, { transform: posOut }],
        { duration: DASH_OUT_MS, easing: DASH_EASE, fill: 'forwards' },
      );
      session.anims.push(wipeOut);

      wipeOut.onfinish = () => {
        if (!live()) return;
        hideOverlay();
        complete();
      };
    };

    wipeIn.onfinish = () => {
      if (!live()) return;
      jumpTo(goal);
      // Let the new scroll position paint under the cover before revealing it.
      later(() => {
        requestAnimationFrame(() => requestAnimationFrame(startWipeOut));
      }, DASH_HOLD_MS);
    };

    later(complete, DASH_IN_MS + DASH_HOLD_MS + DASH_OUT_MS + 600); // safety net
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