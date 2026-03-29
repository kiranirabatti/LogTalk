import { useEffect, useState } from 'react';

const useDarkMode = (): [boolean, () => void] => {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('logtalk-theme');
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('logtalk-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggle = () => setIsDark((prev) => !prev);

  return [isDark, toggle];
};

export default useDarkMode;
