import { createContext, useContext } from 'react';
import { scheduleScrollTriggerRefresh } from './utils/perf.js';

export const THEME_STORAGE_KEY = 'portfolio-theme';

export const ThemeContext = createContext(null);

export const getMediaTheme = () => (
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
    // Match CSS duration (250ms) so the universal transition cannot linger into scroll.
    window.setTimeout(() => document.documentElement.classList.remove('theme-transition'), 250);
  }

  scheduleScrollTriggerRefresh(150);
};

export const useTheme = () => useContext(ThemeContext);
