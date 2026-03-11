import { useLocation, useNavigate } from 'react-router-dom';
import { FaSearch, FaBars, FaTimes } from 'react-icons/fa';
// import { useAuth0 } from '@auth0/auth0-react';
import { useTranslation } from 'react-i18next';
import Search from './Search';
import './styles/styles.css';
import { useAuth } from '@/context/useAuth';

// import LoginButton from './login-signup/LoginButton';
// import LogoutButton from './login-signup/LogoutButton';

import { useEffect, useRef, useState } from 'react';
import ThemeToggle from './DarkMode';
import LanguageSwitcher from './LangSwitch';
const Header = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const { user, setUser } = useAuth();

  //   const { isAuthenticated, isLoading, error } = useAuth0();

  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(true);
  const [offset, setOffset] = useState(0);

  const dropdownRef = useRef<HTMLLIElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.scrollY * 0.3);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setMobileOpen(false);
      setOpen(false);
    }, 0);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : 'auto';
  }, [mobileOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }

      if (
        mobileRef.current &&
        !mobileRef.current.contains(event.target as Node)
      ) {
        setMobileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      style={{ transform: `translateY(-${offset}px)` }}
      className="fixed w-full top-0 px-3 bg-red-400/50 dark:bg-gray-600/50
      border-b border-red-700 z-50 backdrop-blur-lg
      transition-transform duration-75"
    >
      <nav className="w-full flex justify-start items-center h-20 dark:text-white relative">
        <div className="flex gap-5 min-w-1/2">
          <h1
            className="text-4xl font-extrabold [@media(max-width:640px)]:hidden text-white dark:text-red-700 hover:scale-105 hover:text-red-600 cursor-pointer"
            onClick={() => navigate('/')}
          >
            FlixNova
          </h1>
          <h1
            className="text-4xl font-extrabold [@media(max-width:640px)]:block hidden  text-red-700 hover:scale-105 hover:text-red-600 cursor-pointer"
            onClick={() => navigate('/')}
          >
            FN
          </h1>
          <button
            className="[@media(max-width:1030px)]:flex hidden top-2.5 relative text-2xl z-50"
            onClick={(e) => {
              e.stopPropagation();
              setMobileOpen((prev) => !prev);
            }}
          >
            {mobileOpen ? <FaTimes /> : <FaBars />}
          </button>

          <ul className="flex [@media(max-width:1030px)]:hidden gap-2 text-lg font-semibold">
            <li
              className={`cursor-pointer p-2 px-3 rounded-2xl   transition hover:bg-red-200 hover:text-red-700 ${
                location.pathname === '/movies/discover'
                  ? 'bg-red-200 text-red-700 border border-red-700'
                  : 'border border-white/0'
              }`}
              onClick={() => navigate('/movies/discover')}
            >
              {t('movies')}
            </li>

            <li
              className={`cursor-pointer p-2 px-3 rounded-2xl transition hover:bg-red-200 hover:text-red-700 ${
                location.pathname === '/tvshow/discover'
                  ? 'bg-red-200 text-red-700 border border-red-700'
                  : ''
              }`}
              onClick={() => navigate('/tvshow/discover')}
            >
              {t('tvShows')}
            </li>

            <li ref={dropdownRef} className="relative">
              <div
                onClick={() => setOpen((prev) => !prev)}
                className="cursor-pointer p-2 px-3 rounded-2xl transition hover:bg-red-200 hover:text-red-700"
              >
                {t('more')}
              </div>

              {open && (
                <div className="absolute left-0 mt-2 w-40 bg-red-700 p-0.5 border-b border-red-950 shadow-lg rounded-md z-50">
                  <button
                    onClick={() => {
                      navigate('/filter');
                      setOpen(false);
                    }}
                    className="w-full cursor-pointer text-left px-4 py-2 rounded-sm bg-red-600 border-b border-red-950 hover:bg-red-200 hover:text-red-700 transition"
                  >
                    {t('filter')}
                  </button>

                  <button
                    onClick={() => {
                      navigate('/media/add');
                      setOpen(false);
                    }}
                    className="w-full cursor-pointer text-left px-4 py-2 rounded-sm border-b border-black bg-red-600  hover:bg-red-200 hover:text-red-700 transition"
                  >
                    {/* {t('filter')} */} Add Media
                  </button>
                </div>
              )}
            </li>
          </ul>

          <div
            ref={mobileRef}
            className={`absolute top-20 left-0 w-full rounded-lg bg-red-700 text-white shadow-lg [@media(max-width:1030px)]:block hidden z-40 transition-all duration-300 ${
              mobileOpen
                ? 'translate-y-0 opacity-100'
                : '-translate-y-5 opacity-0 pointer-events-none'
            }`}
          >
            <ul className="flex flex-col text-lg font-semibold">
              <li
                className="p-4 cursor-pointer rounded-md border-b border-red-600 hover:bg-red-800"
                onClick={() => {
                  navigate('/movies/discover');
                  setMobileOpen(false);
                }}
              >
                {t('movies')}
              </li>

              <li
                className="p-4 cursor-pointer rounded-md border-b border-red-600 hover:bg-red-800"
                onClick={() => {
                  navigate('/tvshow/discover');
                  setMobileOpen(false);
                }}
              >
                {t('tvShows')}
              </li>

              <li
                className="p-4 cursor-pointer rounded-md border-b border-red-600 hover:bg-red-800"
                onClick={() => {
                  navigate('/filter');
                  setMobileOpen(false);
                }}
              >
                {t('filter')}
              </li>

              <div
                className="p-4 rounded-md hover:bg-red-800"
                onClick={() => {
                  navigate('media/add');
                  setMobileOpen(false);
                }}
              >
                Add Media
              </div>
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-end pl-20 gap-2 min-w-1/2 [@media(max-width:640px)]:w-auto">
          <button
            onClick={() => setShowSearch((prev) => !prev)}
            className={`text-2xl cursor-pointer rounded-2xl px-4 py-3 hover:text-red-500 hover:bg-red-200 ${
              showSearch ? 'text-red-800 border border-red-700 bg-red-200' : ''
            }`}
          >
            <FaSearch />
          </button>

          <LanguageSwitcher />

          {/* {error && <div className="text-red-700">{t('authError')}</div>}

          {isLoading ? (
            <span className="loader"></span>
          ) : (
            <div className="rounded-md shadow-black hover:bg-red-800 text-gray-300 hover:text-white font-bold bg-red-700 px-3 py-2">
              {isAuthenticated ? <LogoutButton /> : <LoginButton />}
            </div>
          )} */}
          {user ? (
            <div className="rounded-md shadow-black hover:bg-red-800 text-gray-300 hover:text-white font-bold bg-red-700 px-3 py-2">
              <button onClick={() => setUser(null)}>Logout</button>
            </div>
          ) : (
            <div className="rounded-md shadow-black hover:bg-red-800 text-gray-300 hover:text-white font-bold bg-red-700 px-3 py-2">
              <button onClick={() => navigate('login')}>Login</button>
            </div>
          )}

          <ThemeToggle />
        </div>
      </nav>

      <div
        className={`absolute right-5 top-25 transition-all duration-500 ${
          showSearch ? 'translate-x-200' : 'translate-x-0'
        }`}
      >
        <Search autoFocus={!showSearch} />
      </div>
    </header>
  );
};

export default Header;
