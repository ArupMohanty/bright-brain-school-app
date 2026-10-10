import { useCallback, useEffect, useRef, useState } from 'react';
import { loadTheme, saveTheme } from '../storage/settings';
import type { Theme } from '../storage/settings';

function systemTheme(): Theme {
  const prefersDark =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
}

/** Current colour theme: the saved choice, otherwise the device setting. */
export function useTheme(): { theme: Theme; toggleTheme: () => void } {
  const [theme, setTheme] = useState<Theme>(systemTheme);
  const chosenByUser = useRef(false);

  useEffect(() => {
    let active = true;
    void loadTheme().then((saved) => {
      if (active && saved && !chosenByUser.current) setTheme(saved);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggleTheme = useCallback(() => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    chosenByUser.current = true;
    setTheme(next);
    void saveTheme(next);
  }, [theme]);

  return { theme, toggleTheme };
}
