import { fetchMovies } from '../Redux/features/movies/movieSlice';
import { fetchTvShows } from '@/Redux/features/Tvshows/tvshowSlice';
import type { AppDispatch, RootState } from '../Redux/store/store';
import HomeBanner from '@/components/HomeBanner';
import Loading from '@/components/Loading';
import { useAuth } from '@/context/useAuth';
import { useDispatch, useSelector } from 'react-redux';
import defaultImage from '../assets/images/ComingSoon.jpg';
import { useEffect } from 'react';
import HomeCards from '@/components/Homecards';
import '../components/styles/styles.css';

import { random } from '@/utils/random';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { user } = useAuth();

  //   const [backdropImg, setBackdrop] = useState('');

  const { t } = useTranslation();
  const IMAGE_BANNER_URL = 'https://image.tmdb.org/t/p/original';

  const { movies, loading, status, error } = useSelector(
    (state: RootState) => state.movie
  );

  const { tvShows, loading1, tvstatus, error1 } = useSelector(
    (state: RootState) => state.tvshow
  );

  const roles = user?.role;
  const name = user?.email;

  useEffect(() => {
    if (status === 'idle' || tvstatus === 'idle') {
      dispatch(fetchTvShows(1));
      dispatch(fetchMovies(1));
    }
  }, [status, tvstatus, dispatch]);

  const randomSeed = random;

  const randomMovie =
    movies.length > 0 ? movies[Math.floor(randomSeed * movies.length)] : null;

  const backdropImg = randomMovie?.backdrop_path
    ? `${IMAGE_BANNER_URL}${randomMovie.backdrop_path}`
    : defaultImage;

  if (loading || loading1) return <Loading />;
  if (error || error1) return <p className="text-red-500">{error || error1}</p>;

  return (
    <>
      <div className=" min-h-screen pl-10  text-white">
        <div className="dark:hidden bg-red-300/30 w-full left-0 -z-9 top-210 absolute h-full" />
        <h1 className="absolute z-20 top-30 lg:left-30 font-bold text-2xl md:text-4xl lg:text-6xl text-primary/90">
          <label className="t-shadow">{t('welcomeUser')}</label>
          <div className="t-shadow">
            {roles && roles.includes('admin')
              ? `Admin ${name?.split('@')[0].toUpperCase()} `
              : name?.includes('@')
                ? name.split('@')[0].toUpperCase()
                : 'Guest'}
            !
          </div>
        </h1>
        {backdropImg && (
          <img
            src={backdropImg}
            className="w-full left-0 -z-10 blur-2xl fixed h-full object-cover rounded-4xl"
            alt="movie backdrop"
          />
        )}

        {backdropImg && <HomeBanner backdrop={backdropImg} />}

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
          {movies
            .filter(
              (movie): movie is typeof movie & { tmdb_id: number } =>
                movie.tmdb_id !== undefined
            )
            .map((movie) => (
              <div key={movie.id} className="snap-start">
                <HomeCards movie={movie} mediaType="movie" />
              </div>
            ))}
        </div>
        <div className="absolute z-10 top-210 pointer-events-none inset-0 bg-linear-to-b from-black/70 via-black/30 to-transparent" />

        <h2 className=" font-extrabold py-4 text-red-800 text-4xl">
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
          {tvShows
            .filter(
              (movie): movie is typeof movie & { tmdb_id: number } =>
                movie.tmdb_id !== undefined
            )
            .map((movie) => (
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
