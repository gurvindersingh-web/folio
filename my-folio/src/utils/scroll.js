export let lenisInstance = null;
export function setLenisInstance(instance) { lenisInstance = instance; }

let revealTimer = 0;

function headerOffset() {
  const header = document.querySelector('.r-header');
  return -(header?.getBoundingClientRect().height ?? 88);
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
