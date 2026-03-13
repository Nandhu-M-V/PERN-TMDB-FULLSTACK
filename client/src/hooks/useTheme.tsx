import { useEffect, useState } from 'react';

export type Theme = 'light' | 'dark' | 'red' | 'green' | 'sky' | 'gray';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme') as Theme;
    return saved || 'light';
  });

  useEffect(() => {
    document.documentElement.className =
      theme === 'light' ? '' : `theme-${theme}`;

    localStorage.setItem('theme', theme);
  }, [theme]);

  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  return { theme, changeTheme };
}
