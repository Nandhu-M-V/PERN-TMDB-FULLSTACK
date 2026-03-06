export interface BaseMedia {
  id: number;
  tmdb_id?: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path?: string | null;
  overview: string;
  media_type?: string;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
}

import defaultImage from '../assets/images/ComingSoon.jpg';

import { useNavigate } from 'react-router-dom';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const TvShowCard = ({ movie }: { movie: BaseMedia }) => {
  const displayTitle = movie.title || movie.name || 'Untitled';
  const displayDate = movie.release_date || movie.first_air_date;
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

  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/tv/${movie.id}/${slugify(displayTitle)}`)}
      className="group relative w-62 h-95 snap-start
                 rounded-2xl overflow-hidden
                 cursor-pointer
                 transform transition-all duration-500
                 hover:scale-105 hover:-translate-y-1
                 hover:shadow-2xl hover:shadow-black/40"
    >
      <img
        className="w-full h-full object-cover"
        src={
          movie.poster_path
            ? `${IMAGE_BASE_URL}${movie.poster_path}`
            : defaultImage
        }
        alt={displayTitle}
      />

      <div
        className="absolute inset-0 bg-black/80
                   opacity-0 group-hover:opacity-100
                   transition-opacity duration-500
                   flex flex-col justify-end p-4 text-white"
      >
        <h3 className="font-bold text-lg">{displayTitle}</h3>

        {displayDate && (
          <p className="text-sm text-gray-300">
            {displayDate.toString().split('T')[0]}
          </p>
        )}

        {movie.vote_average && (
          <p className="text-sm text-yellow-400">
            ⭐ {movie.vote_average.toFixed(1)}
          </p>
        )}
      </div>
    </div>
  );
};

export default TvShowCard;
