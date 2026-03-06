import { fetchMovies } from '../features/movies/movieSlice';
import { fetchTvShows } from '@/features/Tvshows/tvshowSlice';
import type { AppDispatch, RootState } from '../app/store';
import HomeBanner from '@/components/HomeBanner';
import Loading from '@/components/Loading';
// import { useAuth0 } from '@auth0/auth0-react';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import HomeCards from '@/components/Homecards';
import '../components/styles/styles.css';

import { random } from '@/utils/random';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { t } = useTranslation();
  const IMAGE_BANNER_URL = 'https://image.tmdb.org/t/p/original';

  const { movies, loading, status, error } = useSelector(
    (state: RootState) => state.movie
  );

  const { tvShows, loading1, tvstatus, error1 } = useSelector(
    (state: RootState) => state.tvshow
  );

  //   const { user } = useAuth0();
  const roles = ['Admin']; // Replace with actual role fetching logic

  //   useEffect(() => {
  //     if (user) {
  //       console.log('USER OBJECT:', user);
  //     }
  //   }, [user]);

  const name = t('guest');

  useEffect(() => {
    if (status === 'idle' || tvstatus === 'idle') {
      dispatch(fetchMovies(1));
      dispatch(fetchTvShows(1));
    }
  }, [status, tvstatus, dispatch]);

  const randomSeed = random;

  const randomMovie =
    movies.length > 0 ? movies[Math.floor(randomSeed * movies.length)] : null;

  if (loading || loading1) return <Loading />;
  if (error || error1) return <p className="text-red-500">{error || error1}</p>;

  return (
    <>
      <div className=" min-h-screen pl-20 pb-5 text-white">
        <div className="dark:hidden bg-purple-300/30 w-full left-0 -z-9 top-190 absolute h-full" />
        <h1 className="absolute z-20 top-30 lg:left-30 font-bold text-2xl md:text-4xl lg:text-6xl text-purple-200">
          <label className="t-shadow">{t('welcomeUser')}</label>
          <div className="t-shadow">
            {roles && roles.includes('Admin')
              ? `Admin ${name.split('@')[0].toUpperCase()} `
              : name.includes('@')
                ? name.split('@')[0].toUpperCase()
                : name.toUpperCase()}
            !
          </div>
        </h1>
        {randomMovie?.backdrop_path && (
          <>
            <img
              src={`${IMAGE_BANNER_URL}${randomMovie.backdrop_path}`}
              className="w-full left-0 -z-10 blur-2xl transition-all fixed h-full object-cover rounded-4xl"
              alt="movie backdrop"
            />
          </>
        )}
        {randomMovie?.backdrop_path && (
          <HomeBanner backdrop={randomMovie.backdrop_path} />
        )}

        <h2 className="font-extrabold text-white mt-15 relative z-10 pb-0 text-4xl">
          {t('trendingMovies')}
        </h2>

        <div
          className="
            px-10 py-5
            grid grid-flow-col auto-cols-[220px]
            overflow-x-auto overflow-y-hidden
            scroll-smooth
            custom-scrollbar
            snap-x
            scrollbar-hide
            mt-5
        "
        >
          {movies.map((movie) => (
            <div key={movie.id} className="snap-start">
              <HomeCards movie={movie} mediaType="movie" />
            </div>
          ))}
        </div>
        <div className="absolute z-10 top-194 pointer-events-none inset-0 bg-linear-to-b from-black/70 via-black/30 to-transparent" />

        <h2 className=" font-extrabold py-4 text-purple-900 text-4xl">
          {' '}
          {t('topTvShows')}
        </h2>

        <div
          className="
            px-10 py-5
            grid grid-flow-col auto-cols-[220px]
            gap-1
            overflow-x-auto overflow-y-hidden
            custom-scrollbar
            scroll-smooth
            snap-x
            scrollbar-hide
            mb-15
        "
        >
          {tvShows.map((movie) => (
            <div key={movie.id} className="snap-start">
              <HomeCards movie={movie} mediaType="tv" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
