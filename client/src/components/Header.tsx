import { useLocation, useNavigate } from 'react-router-dom';
import { FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import Search from './Search';
import './styles/styles.css';
import { useAuth } from '@/context/useAuth';
import { useEffect, useRef, useState } from 'react';
import ThemeToggle from './Themes';
import LanguageSwitcher from './LangSwitch';
import { toast } from 'react-toastify';
const Header = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const { user, setUser } = useAuth();

  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(true);
  const [offset, setOffset] = useState(0);

  const [themeMenuOpen, setThemeMenuOpen] = useState(false);

  const dropdownRef = useRef<HTMLLIElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);

  const allowedPaths = ['/movies/discover', '/tvshow/discover', '/'];

  const handleAddMedia = () => {
    if (user?.role === 'admin') {
      navigate('/media/add');
    } else {
      toast.error('Only an Admin can add Media ');
    }
  };

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
    if (
      location.pathname.includes('media/add') ||
      location.pathname.includes('login') ||
      location.pathname.includes('filter') ||
      themeMenuOpen
    ) {
      setTimeout(() => {
        setShowSearch(true);
      }, 0);
    }
  }, [location.pathname, themeMenuOpen]);

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
      className="fixed w-full top-0 px-3 bg-primary/90 dark:bg-gray-600/50
        border-b border-primary z-50 backdrop-blur-lg
        transition-transform duration-75 "
    >
      <nav className="w-full flex justify-start items-center h-20 dark:text-white relative">
        <div className="flex gap-5 min-w-1/2">
          <h1
            className="text-4xl font-extrabold [@media(max-width:640px)]:hidden text-white dark:text-primary hover:scale-105 hover:text-foreground cursor-pointer"
            onClick={() => navigate('/')}
          >
            FlixNova
          </h1>
          <h1
            className="text-4xl font-extrabold [@media(max-width:640px)]:block hidden  text-background hover:scale-105 hover:text-red-600 cursor-pointer"
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
              className={`cursor-pointer p-2 px-3 rounded-md text-background transition hover:bg-white hover:text-black ${
                location.pathname === '/movies/discover'
                  ? 'bg-white/90 text-black border border-primary'
                  : 'border border-white/0'
              }`}
              onClick={() => navigate('/movies/discover')}
            >
              {t('movies')}
            </li>

            <li
              className={`cursor-pointer p-2 px-3 rounded-md transition text-background hover:bg-white hover:text-black ${
                location.pathname === '/tvshow/discover'
                  ? 'bg-white/90 text-black border border-primary'
                  : ''
              }`}
              onClick={() => navigate('/tvshow/discover')}
            >
              {t('tvShows')}
            </li>

            <li
              ref={dropdownRef}
              className="relative"
              onMouseEnter={() => setOpen(true)}
              onMouseLeave={() => setOpen(false)}
            >
              <div className="cursor-pointer p-2 px-3 rounded-md text-background transition hover:bg-white hover:text-black">
                {t('more')}
              </div>

              {open && (
                <div className="absolute left-0  w-40 bg-primary p-0.5 border-b text-black border-foreground shadow-lg rounded-md z-20">
                  <button
                    onClick={() => {
                      navigate('/filter');
                      setOpen(false);
                    }}
                    className="w-full cursor-pointer text-left px-4 py-2 rounded-t-sm border-b border-red-950 hover:bg-white hover:text-primary transition"
                  >
                    {t('filter')}
                  </button>

                  <button
                    onClick={() => {
                      handleAddMedia();
                      setOpen(false);
                    }}
                    className="w-full cursor-pointer text-left px-4 py-2 rounded-b-sm hover:bg-white hover:text-primary transition"
                  >
                    Add Media
                  </button>
                </div>
              )}
            </li>
          </ul>

          <div
            ref={mobileRef}
            className={`absolute top-20 left-0 w-full rounded-b-lg bg-primary text-white shadow-lg [@media(max-width:1030px)]:block hidden z-40 transition-all duration-300 ${
              mobileOpen
                ? 'translate-y-0 opacity-100'
                : '-translate-y-5 opacity-0 pointer-events-none'
            }`}
          >
            <ul className="flex flex-col text-foreground text-lg font-semibold">
              <li
                className="p-4 cursor-pointer rounded-md border-b hover:text-primary hover:bg-foreground"
                onClick={() => {
                  navigate('/movies/discover');
                  setMobileOpen(false);
                }}
              >
                {t('movies')}
              </li>

              <li
                className="p-4 cursor-pointer rounded-md border-b hover:text-primary hover:bg-foreground"
                onClick={() => {
                  navigate('/tvshow/discover');
                  setMobileOpen(false);
                }}
              >
                {t('tvShows')}
              </li>

              {/* <li
                className="p-4 cursor-pointer rounded-md border-b hover:text-primary hover:bg-foreground"
                onClick={() => {
                  navigate('/filter');
                  setMobileOpen(false);
                }}
              >
                {t('filter')}
              </li> */}

              <div
                className="p-4 rounded-md hover:bg-foreground hover:text-primary"
                onClick={() => {
                  handleAddMedia();
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
            onClick={() => {
              if (
                allowedPaths.includes(location.pathname) ||
                location.pathname.includes('/movie/') ||
                location.pathname.includes('/tv/')
              ) {
                setShowSearch((prev) => !prev);
              }
            }}
            className={`text-2xl cursor-pointer bg-foreground shadow-xs shadow-black text-white rounded-md px-3 py-2 hover:text-primary hover:bg-white ${
              showSearch
                ? 'text-primary/90 border border-primary/20 bg-foreground'
                : ''
            }`}
          >
            <FaSearch />
          </button>

          <LanguageSwitcher />

          {user ? (
            <button
              className="rounded-md shadow-xs shadow-black
            bg-foreground text-white font-bold hover:text-black
            px-3 py-2.5 hover:bg-gray-200 text-sm cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-primary/50"
              onClick={() => {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                console.log('token is cleared.');
                setUser(null);
              }}
            >
              Logout
            </button>
          ) : (
            <button
              className="rounded-md shadow-xs shadow-black
            bg-foreground text-white font-bold hover:text-black
            px-3 py-2.5 hover:bg-gray-200 text-sm cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-primary/50"
              onClick={() => navigate('login')}
            >
              Login
            </button>
          )}

          <ThemeToggle onOpenChange={setThemeMenuOpen} />
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
