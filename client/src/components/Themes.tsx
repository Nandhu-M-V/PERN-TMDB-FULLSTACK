import { useState, useEffect, useRef } from 'react';
import { FaSun } from 'react-icons/fa';
import { useTheme } from '@/hooks/useTheme';

interface ThemeToggleProps {
  onOpenChange?: (open: boolean) => void;
}

export default function ThemeToggle({ onOpenChange }: ThemeToggleProps) {
  const { theme, changeTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const themes = ['light', 'red', 'green', 'sky', 'gray'] as const;

  const toggle = () => {
    setOpen((prev) => {
      const newState = !prev;
      onOpenChange?.(newState);
      return newState;
    });
  };

  // close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        onOpenChange?.(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onOpenChange]);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={toggle}
        className="rounded-md shadow-xs shadow-black hover:bg-foreground hover:text-primary text-foreground font-bold bg-primary px-3 py-2.5"
      >
        <FaSun />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-32 bg-background rounded-md border shadow-lg">
          {themes.map((t) => (
            <button
              key={t}
              onClick={() => {
                changeTheme(t);
                setOpen(false);
                onOpenChange?.(false);
              }}
              className={`block w-full px-3 py-2 text-left hover:bg-primary/50 ${
                theme === t ? 'font-bold text-foreground' : ''
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
