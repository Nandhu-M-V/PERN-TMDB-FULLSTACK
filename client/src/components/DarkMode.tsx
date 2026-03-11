import { useEffect, useState } from 'react';

import { FaMoon } from 'react-icons/fa';

export default function ThemeToggle() {
  const [dark, setDark] = useState(
    () => localStorage.getItem('theme') === 'dark'
  );

  useEffect(() => {
    const root = document.documentElement;

    if (dark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className={`px-4 py-3 cursor-pointer rounded-md text-white ${dark ? 'bg-red-900' : 'bg-red-700'}`}
    >
      <FaMoon />
    </button>
  );
}
