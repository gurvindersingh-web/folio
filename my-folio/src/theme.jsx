import { useEffect, useMemo, useState } from 'react';
import { 
  THEME_STORAGE_KEY, 
  ThemeContext, 
  getInitialTheme, 
  getStoredTheme, 
  applyTheme 
} from './themeContext.jsx';

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
