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
      className={`rounded-md shadow-xs shadow-black hover:bg-red-800 text-gray-300 hover:text-white font-bold bg-red-700 px-3 py-2.5 ${dark ? 'bg-red-900' : 'bg-red-700'}`}
    >
      <FaMoon />
    </button>
  );
}
