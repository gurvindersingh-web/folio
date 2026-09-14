import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export const THEME_STORAGE_KEY = 'portfolio-theme';

const ThemeContext = createContext(null);

const getMediaTheme = () => (
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-color-scheme: light)').matches
    ? 'light'
    : 'dark'
);

export const getStoredTheme = () => {
  if (typeof window === 'undefined') return null;
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return stored === 'light' || stored === 'dark' ? stored : null;
  } catch {
    return null;
  }
};

export const getInitialTheme = () => (
  typeof document !== 'undefined'
    ? (document.documentElement.dataset.theme || getStoredTheme() || getMediaTheme())
    : 'dark'
);

export const applyTheme = (theme) => {
  if (typeof document === 'undefined') return;
  document.documentElement.dataset.theme = theme;

  const themeColor = document.querySelector('meta[name="theme-color"]');
  if (themeColor) {
    themeColor.setAttribute('content', theme === 'light' ? '#f3efe7' : '#1e1e1e');
  }

  if (!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('theme-transition');
    window.setTimeout(() => document.documentElement.classList.remove('theme-transition'), 300);
  }

  window.requestAnimationFrame?.(() => {
    window.__portfolioScrollTrigger?.refresh?.();
  });
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
    const handleChange = () => {
      if (!getStoredTheme()) setTheme(mediaQuery.matches ? 'light' : 'dark');
    };

    mediaQuery.addEventListener?.('change', handleChange);
    return () => mediaQuery.removeEventListener?.('change', handleChange);
  }, []);

  const value = useMemo(() => ({
    theme,
    toggleTheme: () => {
      const nextTheme = theme === 'dark' ? 'light' : 'dark';
      try {
        window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
      } catch {
        // Storage can be unavailable in privacy-restricted contexts.
      }
      setTheme(nextTheme);
    }
  }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
