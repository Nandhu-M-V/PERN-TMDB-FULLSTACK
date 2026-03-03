import { fetchTvShows } from '@/features/Tvshows/tvshowSlice';
import type { AppDispatch, RootState } from '../app/store';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import Loading from '@/components/Loading';
import TvShowCard from '@/components/TvShowCard';
import Carousal from '@/components/Carousal';
import { useTranslation } from 'react-i18next';

const TvShows = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { i18n, t } = useTranslation();

  const { tvShows, loading1, error1 } = useSelector(
    (state: RootState) => state.tvshow
  );

  const [page, setpage] = useState(1);

  useEffect(() => {
    if (tvShows.length === 0) {
      dispatch(fetchTvShows(page));
    }
  }, [dispatch, page, i18n.language, tvShows.length]);

  function newPage(newpage: number) {
    setpage(newpage);
    dispatch(fetchTvShows(newpage));
  }

  if (loading1) return <Loading />;
  if (error1) return <p className="text-red-500">{error1}</p>;

  return (
    <div className="dark:bg-black bg-purple-300/70 pb-5 min-h-screen transition-all duration-200 text-white">
      <div className="absolute top-180 inset-0 bg-linear-to-b from-black/40 via-black/10 to-transparent" />

      <Carousal movies={tvShows} />

      <div
        className="px-10 py-5
  grid
  min-[600px]:grid-cols-2
  min-[850px]:grid-cols-3
  min-[1100px]:grid-cols-4
  min-[1400px]:grid-cols-5
  gap-y-20 gap-10
  justify-center"
      >
        {tvShows.map((show) => (
          <TvShowCard key={show.id} movie={show} />
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
          : 'bg-purple-700 cursor-pointer    hover:bg-purple-800 active:scale-95'
      }
      text-black
      dark:text-white shadow-md`}
          >
            {t('prev')}
          </button>

          <span className="text-black cursor-default dark:text-white font-semibold">
            Page {page}
          </span>

          <button
            onClick={() => newPage(page + 1)}
            className="px-4 py-2 rounded-lg font-medium bg-purple-700
               hover:bg-purple-800 active:scale-95
               text-black cursor-pointer
               dark:text-white shadow-md transition-all duration-200"
          >
            {t('next')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TvShows;
