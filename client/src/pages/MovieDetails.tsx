import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '@/components/Loading';
import type { SimilarMovie } from '@/utils/ApiFetch';

import defautImage from '../assets/images/ComingSoon.jpg';
import defaultPoster from '../assets/images/defaultposter.jpg';

import {
  deleteMovie,
  fetchMovieid,
  fetchSimilarMovies,
} from '@/utils/ApiFetch';

import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/useAuth';

import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/app/store';
import { fetchMovies } from '@/features/movies/movieSlice';

import { toast } from 'react-toastify';

import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/Confirm';

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
  tmdb_id: number;
  overview: string;
  backdrop_path: string;
  poster_path: string;
  release_date: string;
  runtime?: number;
  vote_average: number;
  tagline?: string;
  genres?: Genre[];
  production_companies?: ProductionCompany[];
}

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState<MovieDetailType | null>(null);
  const [similar, setSimilar] = useState<SimilarMovie[]>([]);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch<AppDispatch>();

  const { user } = useAuth();
  const roles = user?.role;

  const { i18n } = useTranslation();

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

    const getMovie = async () => {
      try {
        setLoading(true);

        const data = await fetchMovieid(id);
        const similarData = await fetchSimilarMovies();

        setMovie(data);
        setSimilar(similarData);
      } catch (error) {
        console.error(error);
        setMovie(null);
      } finally {
        setLoading(false);
      }
    };

    getMovie();
  }, [id, i18n.language]);

  const posterUrl = movie?.tmdb_id
    ? movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : defaultPoster
    : movie?.poster_path
      ? `http://localhost:5000${movie.poster_path}`
      : defaultPoster;

  if (loading) return <Loading />;

  if (!movie)
    return <div className="text-white p-10 text-3xl">Movie not found</div>;

  const year = movie.release_date?.split('-')[0];

  return (
    <div className="text-white bg-gray-200/80 dark:bg-gray-950 pt-20 min-h-screen relative">
      <div
        className="relative h-[70vh] bg-cover bg-top"
        style={
          movie.backdrop_path
            ? {
                backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
              }
            : { backgroundImage: `url(${defautImage})` }
        }
      >
        <div className="absolute inset-0 dark:bg-linear-to-t from-black via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/30 to-transparent" />
      </div>

      <div className="relative -mt-50 px-6 md:px-10 flex flex-col md:flex-row gap-10">
        <div className="absolute top-50 z-0 inset-0 bg-linear-to-b from-black/70 via-black/30 to-transparent h-full" />
        <div className="absolute dark:hidden top-50 z-0 inset-0 bg-linear-to-b from-black/10 via-white/30 to-transparent h-full" />

        <img
          src={posterUrl}
          alt={movie.title}
          className="w-64 relative bottom-50 rounded-xl h-96 z-10 shadow-2xl"
        />

        <div className="max-w-3xl relative">
          <h1 className="text-4xl font-bold">{movie.title}</h1>

          <p className="text-gray-400 italic mt-2">{movie.tagline}</p>

          <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-300">
            <span>⭐ {movie.vote_average.toFixed(1)}</span>
            <span>{year}</span>
            {movie.runtime && <span>{movie.runtime} min</span>}
          </div>

          <div className="flex gap-3 mt-4 flex-wrap">
            {movie.genres?.map((genre) => (
              <span
                key={genre.id}
                className="bg-gray-800 px-3 py-1 rounded-full text-sm"
              >
                {genre.name}
              </span>
            ))}
          </div>

          <p className="mt-0 text-gray-300 leading-relaxed">
            {movie.overview.length < 400
              ? movie.overview
              : `${movie.overview.slice(0, 400)}...`}
          </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();

            if (!roles || !roles.includes('admin')) {
              toast.error('Only an Admin can edit Media');
              return;
            }

            navigate(`/movies/edit/${movie.id}`);
          }}
          className={`absolute bottom-20 cursor-pointer right-52
              bg-blue-600 hover:bg-blue-700
              px-4 py-2 rounded-md
              text-sm font-semibold transition
              ${roles && roles.includes('admin') ? '' : 'hidden'}
            `}
        >
          Edit Page
        </button>

        {/* Delete Dialog */}
        {roles && roles.includes('admin') && (
          <div className="absolute bottom-20 right-20 z-10">
            <ConfirmDialog
              title="Delete Movie?"
              description="This action cannot be undone."
              actionText="Delete"
              trigger={
                <Button className="bg-red-700 text-white hover:bg-red-800">
                  Delete Movie
                </Button>
              }
              onConfirm={async () => {
                if (!id) return;

                try {
                  await deleteMovie(Number(id));
                  dispatch(fetchMovies(1));
                  toast.success('Movie deleted successfully');
                  navigate('/');
                } catch (error) {
                  toast.error(`Failed to delete movie ${error}`);
                }
              }}
            />
          </div>
        )}
      </div>

      {/* Similar Movies */}
      <div className=" px-7 pb-20">
        <h2 className="text-3xl relative text-red-700 z-10 font-bold mb-6">
          Similar Movies
        </h2>

        <div className="flex gap-6 custom-scrollbar relative z-10 overflow-x-auto pb-4">
          {similar.map((movie) => (
            <div
              key={movie.id}
              className="min-w-45 cursor-pointer"
              onClick={() =>
                navigate(`/movie/${movie.id}/${slugify(movie.title)}`)
              }
            >
              <img
                src={
                  movie.tmdb_id
                    ? movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : defaultPoster
                    : movie.poster_path
                      ? `http://localhost:5000${movie.poster_path}`
                      : defaultPoster
                }
                alt={movie.title}
                className="w-64 rounded-xl h-60 shadow-2xl"
              />

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
