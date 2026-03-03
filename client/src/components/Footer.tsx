import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <footer className="bg-purple-900/90 border-t border-black dark:bg-zinc-900 dark:text-gray-400 z-10">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
          <div>
            <h2 className="text-black dark:text-white text-lg font-semibold mb-3">
              MovieApp
            </h2>
            <p>{t('footerDescription')}</p>
          </div>

          <div>
            <h3 className="text-black dark:text-white font-medium mb-3">
              {t('quickLinks')}
            </h3>
            <ul className="space-y-2">
              <li
                onClick={() => navigate('/')}
                className="hover:text-purple-700 transition cursor-pointer"
              >
                {t('home')}
              </li>
              <li
                onClick={() => navigate('/movies/discover')}
                className="hover:text-purple-700 transition cursor-pointer"
              >
                {t('discoverMovies')}
              </li>
              <li
                onClick={() => navigate('/tvshow/discover')}
                className="hover:text-purple-700 transition cursor-pointer"
              >
                {t('topRatedTvshows')}
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-black dark:text-white font-medium mb-3">
              {t('about')}
            </h3>
            <p>{t('tmdbDisclaimer')}</p>
          </div>
        </div>

        <div className="border-t border-zinc-700 mt-8 pt-6 text-center text-xs">
          © {new Date().getFullYear()} MovieApp. {t('rightsReserved')}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
