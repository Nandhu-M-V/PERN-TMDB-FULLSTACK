import { useTranslation } from 'react-i18next';
import { fetchMovies } from '../features/movies/movieSlice';
import { fetchTvShows } from '@/features/Tvshows/tvshowSlice';
import type { AppDispatch } from '../app/store';
import { useDispatch } from 'react-redux';

const LanguageSwitcher = () => {
  const dispatch = useDispatch<AppDispatch>();

  //   const { movies, loading, error, status } = useSelector(
  //     (state: RootState) => state.movie
  //   );
  //   const { tvShows, loading1, tvstatus, error1 } = useSelector(
  //     (state: RootState) => state.tvshow
  //   );

  const { i18n, t } = useTranslation();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
    localStorage.removeItem('editedMovies');
    localStorage.removeItem('editedTvShows');
    dispatch(fetchMovies(1));
    dispatch(fetchTvShows(1));
  };

  return (
    <div>
      <select
        value={i18n.language}
        onChange={handleChange}
        className="rounded-md shadow-xs shadow-black
        bg-purple-700 text-gray-200 font-bold
        px-3 py-3 hover:bg-purple-800 text-sm cursor-pointer
        focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        <option className="cursor-pointer" value="en">
          {t('english')}
        </option>
        <option className="cursor-pointer" value="hi">
          {t('hindi')}
        </option>
        <option className="cursor-pointer" value="ja">
          {t('japanese')}
        </option>
        <option className="cursor-pointer" value="de">
          {t('german')}
        </option>
      </select>
    </div>
  );
};

export default LanguageSwitcher;
