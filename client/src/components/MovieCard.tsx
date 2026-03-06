import type { BaseMedia } from './TvShowCard';
import { useNavigate } from 'react-router-dom';
import defaultImage from '../assets/images/ComingSoon.jpg';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const MovieCard = ({ movie }: { movie: BaseMedia }) => {
  const navigate = useNavigate();

  const displayTitle = movie.title ?? movie.name ?? 'Untitled';
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

  return (
    <div
      onClick={() => navigate(`/movie/${movie.id}/${slugify(displayTitle)}`)}
      className="group relative w-62 h-95 snap-start
                 rounded-2xl overflow-hidden
                 transform transition-all duration-500
                 hover:scale-105 cursor-pointer hover:-translate-y-1
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

        {movie.release_date && (
          <p className="text-sm text-gray-300">
            {movie.release_date.toString().split('T')[0]}
          </p>
        )}

        {movie.vote_average !== undefined && (
          <p className="text-sm text-yellow-400">
            ⭐ {movie.vote_average.toFixed(1)}
          </p>
        )}
      </div>
    </div>
  );
};

export default MovieCard;
