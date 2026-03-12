import { fetchMovies } from '../features/movies/movieSlice';
import type { AppDispatch, RootState } from '../app/store';
import MovieCard from '../components/MovieCard';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import Loading from '@/components/Loading';
import Carousal from '@/components/Carousal';
import '../utils/i18n';
import { useTranslation } from 'react-i18next';

const Movies = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { i18n, t } = useTranslation();

  const [page, setpage] = useState(1);

  const { movies, loading, error, status } = useSelector(
    (state: RootState) => state.movie
  );

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchMovies(page));
    }
  }, [status, dispatch, page, i18n.language]);

  function newPage(newpage: number) {
    setpage(newpage);
    dispatch(fetchMovies(newpage));
  }

  if (loading) return <Loading />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="dark:bg-black bg-gray-100/90 pb-5 min-h-screen transition-all duration-200 text-white">
      <div className="absolute top-180 inset-0 bg-linear-to-b from-black/40 via-black/10 to-transparent" />

      <Carousal movies={movies} />

      <div
        className="
    px-10 py-5
    grid
    min-[600px]:grid-cols-2
    min-[850px]:grid-cols-3
    min-[1100px]:grid-cols-4
    min-[1400px]:grid-cols-5
    gap-y-20 gap-10
    justify-center "
      >
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      <div className="w-full flex justify-center mb-10">
        <div className="flex items-center gap-4 mt-6">
          <button
            onClick={() => newPage(page - 1)}
            disabled={page === 1}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200
      ${
        page === 1
          ? 'bg-gray-400 cursor-not-allowed opacity-60'
          : 'bg-red-700 cursor-pointer hover:bg-red-800 active:scale-95'
      } text-black
      dark:text-white  shadow-md`}
          >
            {t('prev')}
          </button>

          <span className="text-black cursor-default dark:text-white font-semibold">
            Page {page}
          </span>

          <button
            onClick={() => newPage(page + 1)}
            className="px-4 py-2 rounded-lg font-medium bg-red-700
               hover:bg-red-800 active:scale-95 text-black cursor-pointer
               dark:text-white shadow-md transition-all duration-200"
          >
            {t('next')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Movies;
