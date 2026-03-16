import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchMovies } from '../Redux/features/movies/movieSlice';
import { fetchTvShows } from '@/Redux/features/Tvshows/tvshowSlice';
import type { AppDispatch } from '../Redux/store/store';
import { useDispatch } from 'react-redux';

const LanguageSwitcher = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { i18n, t } = useTranslation();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'en', label: t('english') },
    { code: 'hi', label: t('hindi') },
    { code: 'ja', label: t('japanese') },
    { code: 'de', label: t('german') },
  ];

  const changeLang = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.removeItem('editedMovies');
    localStorage.removeItem('editedTvShows');

    dispatch(fetchMovies(1));
    dispatch(fetchTvShows(1));

    setOpen(false);
  };

  // close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLang =
    languages.find((lang) => lang.code === i18n.language)?.label || 'English';

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Button */}
      <button
        onClick={() => setOpen(!open)}
        className="bg-foreground text-white px-4 py-2 rounded-md
        font-bold text-sm shadow-md hover:bg-gray-200 hover:text-black
        cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        {currentLang}
      </button>

      {/* Dropdown */}
      {open && (
        <ul
          className="absolute right-0 mt-2 w-40 bg-white
          rounded-md shadow-lg border overflow-hidden z-50"
        >
          {languages.map((lang) => (
            <li
              key={lang.code}
              onClick={() => changeLang(lang.code)}
              className="px-4 py-2 text-black hover:bg-gray-200
              cursor-pointer transition"
            >
              {lang.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LanguageSwitcher;
