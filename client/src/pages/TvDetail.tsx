import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Loading from '@/components/Loading';
import { deleteTvshow, fetchShowid } from '@/utils/ApiFetch';
// import { useAuth0 } from '@auth0/auth0-react';
// import defautImage from '../assets/images/ComingSoon.jpg';

import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/Confirm';

import { useDispatch } from 'react-redux';
import { fetchTvShows } from '@/features/Tvshows/tvshowSlice';
import type { AppDispatch } from '@/app/store';

import defaultPoster from '../assets/images/defaultposter.jpg';

import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useAuth } from '@/context/useAuth';
import { toast } from 'react-toastify';

export interface Genre {
  id: number;
  name: string;
}

export interface Creator {
  id: number;
  name: string;
  profile_path: string | null;
}

export interface Network {
  id: number;
  name: string;
  logo_path: string | null;
}

export interface Season {
  id: number;
  title: string;
  poster_path: string | null;
  season_number: number;
  episode_count: number;
}

export interface TvDetailType {
  id: number;
  tmdb_id: number;
  title: string;
  overview: string;
  backdrop_path: string;
  poster_path: string;
  release_date?: string;
  vote_average: number;
  tagline?: string;
  number_of_seasons?: number;
  number_of_episodes?: number;
  episode_run_time?: number[];
  genres?: Genre[];
  created_by?: Creator[];
  networks?: Network[];
  seasons?: Season[];
}

const TvDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const showId = id;

  const [show, setShow] = useState<TvDetailType | null>(null);
  const [similar, setSimilar] = useState<TvDetailType[]>([]);
  const [loading, setLoading] = useState(true);

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
    const getRelated = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/tvshows`);
        setSimilar(res.data.results);
      } catch (error) {
        console.error(error);
      }
    };
    getRelated();
  }, [showId]);

  const dispatch = useDispatch<AppDispatch>();

  const { user } = useAuth();
  const roles = user?.role; // Replace with actual role fetching logic

  const { i18n } = useTranslation();

  useEffect(() => {
    if (!showId) return;

    const getShow = async () => {
      try {
        setLoading(true);

        const data = await fetchShowid(showId);
        setShow(data);
      } catch (error) {
        console.error(error);
        setShow(null);
      } finally {
        setLoading(false);
      }
    };

    getShow();
  }, [showId, i18n.language]);

  const posterUrl = show?.tmdb_id
    ? show.poster_path
      ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
      : defaultPoster
    : show?.poster_path
      ? `http://localhost:5000${show.poster_path}`
      : defaultPoster;

  if (loading) return <Loading />;
  if (!show)
    return <div className="text-white p-10 text-3xl">Show not found</div>;

  const year = show.release_date?.split('-')[0];

  return (
    <div className="text-white bg-gray-200/80 dark:bg-gray-950 pt-20 min-h-screen relative">
      <div
        className="relative h-[70vh] bg-cover bg-top"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${show.backdrop_path})`,
        }}
      >
        <div className="absolute inset-0 dark:bg-linear-to-t from-black via-black/30 to-transparent" />

        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent dark:hidden" />
      </div>

      <div className="relative -mt-50 px-6 md:px-10 flex flex-col md:flex-row gap-10">
        <div className="absolute top-50 z-0 inset-0 bg-linear-to-b from-black/70 via-black/30 to-transparent h-full dark:block hidden" />
        <div className="absolute top-50 z-0 inset-0 bg-linear-to-b from-black/30 via-gray-300/30 to-transparent h-full dark:hidden" />

        <img
          src={posterUrl}
          alt={show.title}
          className="w-64 relative bottom-50 rounded-xl h-96 z-10 shadow-2xl"
        />

        <div className="max-w-3xl relative">
          <h1 className="text-4xl font-bold">{show.title}</h1>

          <p className="text-gray-600 dark:text-gray-400 italic mt-2">
            {show.tagline}
          </p>

          <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-700 dark:text-gray-300">
            <span>⭐ {show.vote_average.toFixed(1)}</span>
            <span>{year}</span>

            {show.episode_run_time?.[0] && (
              <span>{show.episode_run_time[0]} min</span>
            )}
          </div>

          <div className="flex gap-3 mt-4 flex-wrap">
            {show.genres?.map((genre) => (
              <span
                key={genre.id}
                className="bg-gray-300 dark:bg-gray-800 px-3 py-1 rounded-full text-sm"
              >
                {genre.name}
              </span>
            ))}
          </div>

          <p className="mt-1 text-gray-300 leading-relaxed">
            {show.overview.length < 400
              ? show.overview
              : `${show.overview.slice(0, 400)}...`}
          </p>

          <div className="mt-6">
            <div className="flex gap-6 flex-wrap">
              {show.created_by?.map((creator) => (
                <div key={creator.id} className="text-sm">
                  <p>{creator.name}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-6 mt-6 items-center flex-wrap">
            {show.networks
              ?.slice(0, 7)
              .map(
                (network) =>
                  network.logo_path && (
                    <img
                      key={network.id}
                      src={`https://image.tmdb.org/t/p/w200${network.logo_path}`}
                      alt={network.name}
                      className="h-10 object-contain opacity-80"
                    />
                  )
              )}
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();

            if (!roles || !roles.includes('admin')) {
              toast.error('Only an Admin can edit Media');
              return;
            }

            navigate(`/tvshow/edit/${show.id}`);
          }}
          className={`absolute bottom-20 cursor-pointer right-52
          bg-blue-600 hover:bg-blue-700
          px-4 py-2 rounded-md
          text-sm font-semibold transition
          ${roles && roles.includes('admin') ? '' : 'hidden'}
        `}
        >
          Edit Show
        </button>

        {roles && roles.includes('admin') && (
          <div className="absolute bottom-20 right-20 z-10">
            <ConfirmDialog
              title="Delete Show?"
              description="This action cannot be undone."
              actionText="Delete"
              trigger={
                <Button className="bg-red-700 text-white hover:bg-red-800">
                  Delete Show
                </Button>
              }
              onConfirm={async () => {
                if (!id) return;

                try {
                  await deleteTvshow(Number(id));
                  dispatch(fetchTvShows(1));
                  toast.success('Show deleted successfully');
                  navigate('/');
                } catch (error) {
                  toast.error(`Failed to delete show ${error}`);
                }
              }}
            />
          </div>
        )}
      </div>

      <div className="px-7 pb-20">
        <h2 className="text-3xl relative text-red-700 z-10 font-bold mb-6">
          Trending TV Shows
        </h2>

        <div className="flex gap-6 custom-scrollbar relative z-10 overflow-x-auto pb-4">
          {similar.map((season) => (
            <div
              key={season.id}
              className="min-w-45 cursor-pointer"
              onClick={() =>
                navigate(`/tv/${season.id}/${slugify(season.title)}`)
              }
            >
              <img
                src={
                  season.tmdb_id
                    ? season.poster_path
                      ? `https://image.tmdb.org/t/p/w500${season.poster_path}`
                      : defaultPoster
                    : season.poster_path
                      ? `http://localhost:5000${season.poster_path}`
                      : defaultPoster
                }
                alt={season.title}
                className="w-64 rounded-xl h-60 shadow-2xl"
              />

              <p className="mt-2 dark:text-white text-black text-sm">
                {season.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TvDetail;
