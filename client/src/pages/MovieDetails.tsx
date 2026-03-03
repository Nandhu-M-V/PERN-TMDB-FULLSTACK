import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '@/components/Loading';
import type { SimilarMovie } from '@/utils/ApiFetch';
import { useAuth0 } from '@auth0/auth0-react';

import { fetchMovieid, fetchSimilarMovies } from '@/utils/ApiFetch';
import { useTranslation } from 'react-i18next';

interface Genre {
  id: number;
  name: string;
}

interface ProductionCompany {
  id: number;
  name: string;
  logo_path: string | null;
}

export interface MovieDetailType {
  id: number;
  title: string;
  overview: string;
  backdrop_path: string;
  poster_path: string;
  release_date: string;
  runtime: number;
  vote_average: number;
  tagline: string;
  genres: Genre[];
  production_companies: ProductionCompany[];
}

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState<MovieDetailType | null>(null);
  const [loading, setLoading] = useState(true);

  const [similar, setSimilar] = useState<SimilarMovie[]>([]);

  const navigate = useNavigate();

  const { i18n } = useTranslation();

  const { user } = useAuth0();
  const roles = user?.['http://localhost:5002/roles'];

  //adding to url
  const slugify = (displayTitle: string): string => {
    if (!displayTitle) return 'untitled';

    return displayTitle
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\p{L}\p{N}\s-]/gu, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  useEffect(() => {
    if (!id) return;

    const getShow = async () => {
      try {
        setLoading(true);

        const data = await fetchMovieid(id);
        const similarData = await fetchSimilarMovies(id);

        const stored = localStorage.getItem('editedMovies');
        const parsed = stored ? JSON.parse(stored) : {};

        if (parsed[id]) {
          setMovie({
            ...data,
            ...parsed[id],
          });
        } else {
          setMovie(data);

          parsed[id] = data;
          localStorage.setItem('editedMovies', JSON.stringify(parsed));
        }

        setSimilar(similarData);
      } catch (error) {
        console.error(error);
        setMovie(null);
      } finally {
        setLoading(false);
      }
    };

    getShow();
  }, [id, i18n.language]);

  //   useEffect(() => {
  //     console.log(movie);
  //   }, [movie]);

  if (loading) return <Loading />;
  if (!movie)
    return (
      <div className="text-white text-4xl absolute z-10 p-10">
        Movie not found!!
      </div>
    );

  const year = movie.release_date?.split('-')[0];

  return (
    <div className="text-white pt-20 bg-purple-400/50 dark:bg-gray-950 min-h-screen">
      <div
        className="relative h-[70vh] bg-cover bg-top"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
        }}
      >
        <div className="absolute inset-0 dark:bg-linear-to-t from-black via-black/30 to-transparent" />
      </div>

      <div className="relative -mt-40 px-6 md:px-16 flex flex-col md:flex-row gap-10">
        <div className="absolute dark:hidden top-40 z-0 inset-0 bg-linear-to-b from-black/70 via-black/30 to-transparent h-full" />
        <div className="absolute top-40 z-0 inset-0 bg-linear-to-b from-white/20 via-white/10 to-transparent h-full" />

        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-64 rounded-xl z-10 shadow-2xl"
        />

        <div className="max-w-3xl z-10">
          <h1 className="text-4xl font-bold">{movie.title}</h1>
          <p className="text-gray-400 italic mt-2">{movie.tagline}</p>

          <div className="flex gap-4 mt-4 text-sm text-gray-300">
            <span>⭐ {movie.vote_average.toFixed(1)}</span>
            <span>{year}</span>
            <span>{movie.runtime} min</span>
          </div>

          <div className="flex z-10 gap-3 mt-4 flex-wrap">
            {movie.genres.map((genre) => (
              <span
                key={genre.id}
                className="bg-gray-800 px-3 py-1 rounded-full text-sm"
              >
                {genre.name}
              </span>
            ))}
          </div>

          <p className="mt-6 z-10 text-gray-300 leading-relaxed">
            {movie.overview}
          </p>

          <div className="flex z-10 gap-6 mt-8 items-center flex-wrap">
            {movie.production_companies.map(
              (company) =>
                company.logo_path && (
                  <img
                    key={company.id}
                    src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                    alt={company.name}
                    className="h-10 z-10 object-contain opacity-80"
                  />
                )
            )}
          </div>
          {/* editbutton */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!roles || !roles.includes('Admin')) {
                alert('You do not have permission to edit this page.');
                return;
              }
              navigate(`/movies/edit/${movie.id}`);
            }}
            className={`absolute bottom-0 left-2/3 z-10
                   bg-purple-600 hover:bg-purple-700
                   px-3 py-3 rounded-md
                   text-sm font-semibold cursor-pointer
                   transition ${roles && roles.includes('Admin') ? '' : 'hidden'}`}
          >
            Edit Page
          </button>
        </div>
      </div>
      {/* similars --- */}
      <div className="px-6 md:px-16 mt-16 pb-20">
        <h2 className=" text-purple-700 text-2xl font-bold mb-6">
          Similar Movies
        </h2>

        <div className="flex gap-6 custom-scrollbar overflow-x-auto pb-4">
          {similar.map((movie) => (
            <div
              key={movie.id}
              className="min-w-40 cursor-pointer"
              onClick={() =>
                navigate(`/movie/${movie.id}/${slugify(movie.title)}`)
              }
            >
              {movie.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                  alt={movie.title}
                  className="rounded-lg cursor-pointer shadow-lg hover:scale-105 transition"
                />
              )}
              <p className="mt-2 dark:text-white text-black text-sm">
                {movie.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
