import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi';
import AnimatedContent from './AnimatedContent.jsx';
import { useTheme } from '../themeContext.jsx';
import { scrollToAnchor, lenisInstance, ANCHOR_SCROLL_EVENT } from '../utils/scroll.js';

const NAV_ITEMS = [
  { href: '#home', id: 'home', label: 'HOME' },
  { href: '#about', id: 'about', label: 'ABOUT' },
  { href: '#skills', id: 'skills', label: 'SKILLS' },
  { href: '#projects', id: 'projects', label: 'PROJECTS' },
  { href: '#achievements', id: 'achievements', label: 'ACHIEVEMENTS' },
  { href: '#contact', id: 'contact', label: 'CONTACT' },
];
const NAV_IDS = new Set(NAV_ITEMS.map((item) => item.id));
const LAST_ID = NAV_ITEMS[NAV_ITEMS.length - 1].id;
const LINE_OFFSET = 5; // px below the header where a section counts as "reached"

const getHashId = (e) => e.currentTarget.getAttribute('href')?.slice(1);

const handleNavClick = (e) => {
  const id = getHashId(e);
  if (!id) return;
  e.preventDefault();
  scrollToAnchor(id);
};

// Locks native scroll AND Lenis (Lenis would otherwise keep scrolling the page behind the overlay).
function useScrollLock(locked) {
  useEffect(() => {
    if (!locked) return undefined;
    const previous = document.body.style.overflow;
    const lenis = lenisInstance;
    document.body.style.overflow = 'hidden';
    lenis?.stop?.();
    return () => {
      document.body.style.overflow = previous;
      lenis?.start?.();
    };
  }, [locked]);
}

function useActiveSection(headerRef) {
  const [active, setActive] = useState('');

  useEffect(() => {
    let raf = 0;
    let locked = false; // true while a nav-initiated scroll is running

    const update = () => {
      raf = 0;
      if (locked) return;
      const line = (headerRef.current?.getBoundingClientRect().bottom ?? 88) + LINE_OFFSET;
      let current = '';
      for (const { id } of NAV_ITEMS) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= line) current = id;
        else break; // sections are in DOM order
      }
      if (Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 20) {
        current = LAST_ID;
      }
      setActive((prev) => (prev === current ? prev : current));
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    // Nav click → highlight the target immediately and ignore intermediate sections until the
    // scroll lands; then re-sync with the real position.
    const onAnchorScroll = (e) => {
      const { phase, id } = e.detail || {};
      if (phase === 'start' && NAV_IDS.has(id)) {
        locked = true;
        setActive(id);
      } else if (phase === 'end') {
        locked = false;
        schedule();
      }
    };

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    window.addEventListener(ANCHOR_SCROLL_EVENT, onAnchorScroll);

    // Lazy sections / images change page height without any scroll event.
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(schedule) : null;
    ro?.observe(document.body);

    update();
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      window.removeEventListener(ANCHOR_SCROLL_EVENT, onAnchorScroll);
      ro?.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [headerRef]);

  return active;
}

const ThemeToggle = ({ mobile = false }) => {
  const { theme, toggleTheme } = useTheme();
  const nextTheme = theme === 'dark' ? 'light' : 'dark';

  return (
    <button
      type="button"
      className={`r-theme-toggle${mobile ? ' r-theme-toggle--mobile' : ''}`}
      onClick={toggleTheme}
      aria-label={`Switch to ${nextTheme} theme`}
      title={`Switch to ${nextTheme} theme`}
    >
      <FiSun aria-hidden="true" />
      <FiMoon aria-hidden="true" />
      <span className="sr-only">{`Switch to ${nextTheme} theme`}</span>
    </button>
  );
};

const Navbar = memo(function Navbar() {
  const headerRef = useRef(null);
  const activeSection = useActiveSection(headerRef);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const toggleMobileNav = useCallback(() => setMobileNavOpen((prev) => !prev), []);

  useScrollLock(mobileNavOpen);

  // Escape closes the menu.
  useEffect(() => {
    if (!mobileNavOpen) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setMobileNavOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileNavOpen]);

  // Resizing/rotating to desktop width must not leave the scroll lock stuck on.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 769px)');
    const onChange = (e) => {
      if (e.matches) setMobileNavOpen(false);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Close first so the scroll lock (incl. Lenis.stop) is released, then scroll.
  const handleMobileNavClick = useCallback((e) => {
    const id = getHashId(e);
    if (!id) return;
    e.preventDefault();
    setMobileNavOpen(false);
    requestAnimationFrame(() => scrollToAnchor(id));
  }, []);

  return (
    <>
      <header className="r-header" ref={headerRef}>
        <AnimatedContent className="r-header-logo-slot" eager distance={20} direction="vertical" reverse={true} duration={0.8} delay={0}>
          <div className="r-logo">
            <span className="r-logo-icon">水</span> Gurvinder Singh
          </div>
        </AnimatedContent>
        <AnimatedContent className="r-header-nav-slot" eager distance={20} direction="vertical" reverse={true} duration={0.8} delay={0.1}>
          <nav className="r-nav" aria-label="Main navigation">
            {NAV_ITEMS.map(({ href, id, label }) => (
              <a
                key={id}
                href={href}
                className={activeSection === id ? 'is-active' : undefined}
                aria-current={activeSection === id ? 'location' : undefined}
                onClick={handleNavClick}
              >
                {label}
              </a>
            ))}
          </nav>
        </AnimatedContent>
        <div className="r-header-actions-slot">
          <AnimatedContent eager distance={20} direction="vertical" reverse={true} duration={0.8} delay={0.2}>
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="r-version" style={{ textDecoration: 'none', color: 'inherit' }}>
              <span className="r-pulse" style={{ margin: 0 }}></span> OPEN FOR WORK
            </a>
          </AnimatedContent>
          <ThemeToggle />
          <button
            type="button"
            className="r-mobile-toggle"
            onClick={toggleMobileNav}
            aria-expanded={mobileNavOpen}
            aria-controls="mobile-nav"
            aria-label={mobileNavOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileNavOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </header>

      <nav
        id="mobile-nav"
        className={`r-mobile-nav ${mobileNavOpen ? 'r-mobile-nav--open' : ''}`}
        aria-label="Mobile navigation"
        inert={!mobileNavOpen}
      >
        {NAV_ITEMS.map(({ href, id, label }) => (
          <a
            key={id}
            href={href}
            onClick={handleMobileNavClick}
            className={activeSection === id ? 'is-active' : undefined}
            aria-current={activeSection === id ? 'location' : undefined}
          >
            {label}
          </a>
        ))}
        <ThemeToggle mobile />
      </nav>
    </>
  );
});

export default Navbar;