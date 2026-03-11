import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Loading from '@/components/Loading';
import { fetchShowid } from '@/utils/ApiFetch';
// import { useAuth0 } from '@auth0/auth0-react';
// import defautImage from '../assets/images/ComingSoon.jpg';
import defaultPoster from '../assets/images/defaultposter.jpg';

import { useTranslation } from 'react-i18next';
import axios from 'axios';

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

  //   const { user } = useAuth0();
  const roles = ['Admin']; // Replace with actual role fetching logic

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
    <div className="text-white bg-red-400/50 dark:bg-gray-950 pt-20 min-h-screen relative">
      <div
        className="relative h-[70vh]  bg-cover bg-top"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${show.backdrop_path})`,
        }}
      >
        <div className="absolute inset-0 dark:bg-linear-to-t from-black via-black/30 to-transparent" />
      </div>

      <div className="relative -mt-40 px-6 md:px-16 flex flex-col md:flex-row gap-10">
        <div className="absolute dark:hidden top-40 z-0 inset-0 bg-linear-to-b from-black/70 via-black/30 to-transparent h-full" />
        <div className="absolute top-40 z-0 inset-0 bg-linear-to-b from-white/20 via-white/10 to-transparent h-full" />
        <img
          src={posterUrl}
          alt={show.title}
          className="w-64 rounded-xl h-96 z-10 shadow-2xl"
        />

        <div className="max-w-3xl relative">
          <h1 className="text-4xl font-bold">{show.title}</h1>
          <p className="text-gray-400 italic mt-2">{show.tagline}</p>

          <div className="flex flex-wrap gap-4 mt-4 text-sm z-10 text-gray-300">
            <span>⭐ {show.vote_average.toFixed(1)}</span>
            <span>{year}</span>
            {/* <span>{show.number_of_seasons} Seasons</span> */}
            {/* <span>{show.number_of_episodes} Episodes</span> */}
            {show.episode_run_time?.[0] && (
              <span>{show.episode_run_time[0]} min</span>
            )}
          </div>

          <div className="flex gap-3 mt-4 flex-wrap">
            {show.genres?.map((genre) => (
              <span
                key={genre.id}
                className="bg-gray-800 px-3 py-1 rounded-full text-sm"
              >
                {genre.name}
              </span>
            ))}
          </div>

          <p className="mt-6 text-gray-300 leading-relaxed">{show.overview}</p>

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!roles || !roles.includes('Admin')) {
                alert('You do not have permission to edit this page.');
                return;
              }
              navigate(`/tvshow/edit/${show.id}`);
            }}
            className={`absolute bottom-0 cursor-pointer right-0 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-sm font-semibold transition ${roles && roles.includes('Admin') ? '' : 'hidden'}`}
          >
            Edit Show
          </button>

          <div className="mt-6">
            {/* <h3 className="text-lg font-semibold mb-2">Created By</h3> */}
            <div className="flex gap-6 flex-wrap">
              {show.created_by?.map((creator) => (
                <div key={creator.id} className="text-sm">
                  <p>{creator.name}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-6 mt-6 z-10 items-center flex-wrap">
            {show.networks
              ?.slice(0, 7)
              .map(
                (network) =>
                  network.logo_path && (
                    <img
                      key={network.id}
                      src={`https://image.tmdb.org/t/p/w200${network.logo_path}`}
                      alt={network.name}
                      className="h-10 object-contain z-10 opacity-80"
                    />
                  )
              )}
          </div>
        </div>
      </div>

      <div className="px-6 md:px-16 mt-16 pb-20">
        <h2 className="text-2xl text-red-700 font-bold mb-6">
          Trending Tvshows
        </h2>

        <div className="flex gap-6 custom-scrollbar overflow-x-auto pb-4">
          {similar.map((season) => (
            <div
              key={season.id}
              className="min-w-45"
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
                className="w-64 rounded-xl h-60 z-10 shadow-2xl"
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
