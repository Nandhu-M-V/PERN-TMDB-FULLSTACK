import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <footer className="bg-primary border-t border-black overflow-hidden dark:bg-zinc-900 dark:text-gray-400 z-10">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
          <div>
            <h2 className="text-black text-3xl dark:text-white font-semibold mb-3">
              FlixNova
            </h2>
            <p className="text-black">{t('footerDescription')}</p>
          </div>

          <div className="text-black">
            <h3 className="text-black dark:text-white text-lg font-medium mb-3">
              {t('quickLinks')}
            </h3>
            <ul className="space-y-2">
              <li
                onClick={() => navigate('/')}
                className="hover:font-bold transition cursor-pointer"
              >
                {t('home')}
              </li>
              <li
                onClick={() => navigate('/movies/discover')}
                className="hover:font-bold transition cursor-pointer"
              >
                {t('discoverMovies')}
              </li>
              <li
                onClick={() => navigate('/tvshow/discover')}
                className="hover:font-bold transition cursor-pointer"
              >
                {t('topRatedTvshows')}
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-black text-lg font-medium mb-3">
              {t('about')}
            </h3>
            <p className="text-black">{t('tmdbDisclaimer')}</p>
          </div>
        </div>

        <div className="border-t border-foreground mt-8 pt-6 text-black text-center text-xs">
          © {new Date().getFullYear()} FlixNova. {t('rightsReserved')}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
