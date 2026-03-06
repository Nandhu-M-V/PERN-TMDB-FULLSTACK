import * as React from 'react';
import defimg from '../assets/images/ComingSoon.jpg';
import './styles/styles.css';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

interface Media {
  id: number;
  title?: string;
  overview?: string;
  name?: string;
  backdrop_path?: string | null;
}

interface CarousalProps {
  movies: Media[];
}

export default function Carousal({ movies }: CarousalProps) {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  return (
    <Carousel plugins={[plugin.current]} className="w-full mt-20">
      <CarouselContent>
        {movies.map((movie) => (
          <CarouselItem key={movie.id}>
            <div className="relative h-195 rounded-md w-full overflow-hidden">
              <img
                src={
                  movie.backdrop_path
                    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
                    : defimg
                }
                className="w-full h-full object-cover"
                alt={movie.title || movie.name}
              />

              <div className="absolute inset-0 dark:bg-linear-to-t from-black via-black/50 to-transparent" />

              <div className="absolute bottom-40 max-w-300 left-10 text-white">
                <h2 className="text-8xl cursor-default  text-gray-200 font-bold">
                  <label className="t-shadow">
                    {movie.title || movie.name}
                  </label>
                </h2>
              </div>
              <div className="absolute bottom-15 max-w-400 left-10 text-white">
                <h2 className="pl-2 cursor-default text-md text-gray-400">
                  {movie?.overview ? movie.overview?.slice(0, 400) + '...' : ''}
                </h2>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
