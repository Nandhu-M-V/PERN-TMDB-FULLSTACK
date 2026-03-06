import axios from 'axios';
import i18n from './i18n';

import type { TvDetailType } from '@/pages/TvDetail';
import type { MovieDetailType } from '@/pages/MovieDetails';

const token = import.meta.env.VITE_TMDB_ACCESS_TOKEN;

if (!token) {
  throw new Error('TMDB Access Token is missing in .env file');
}

export const tmdbApi = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${token}`,
  },
});

export interface DiscoverMovieFilters {
  language?: string;
  sort_by?: string;
  page?: number;
  include_adult?: boolean;

  with_genres?: string;
  primary_release_year?: number;

  'vote_average.gte'?: number;
  'vote_count.gte'?: number;
  'with_runtime.gte'?: number;
  'with_runtime.lte'?: number;
}

export interface DiscoverMovieResponse {
  page: number;
  results: DiscoverMovie[];
  total_pages: number;
  total_results: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface DiscoverMovie {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  vote_count: number;
  release_date: string;
  genre_ids: number[];
}

export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
}

export interface TvShow {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  first_air_date: string;
  vote_average: number;
}

export interface SimilarMovie {
  id: number;
  title: string;
  poster_path: string;
}

export const fetchMovieGenres = async (): Promise<Genre[]> => {
  const res = await tmdbApi.get('/genre/movie/list');
  return res.data.genres;
};

export const getDiscoverMovies = async (page: number): Promise<Movie[]> => {
  const res = await axios.get('http://localhost:5000/api/movies', {
    params: {
      include_video: false,
      language: i18n.language,
      page,
      sort_by: 'popularity.desc',
    },
  });

  return res.data.results;
};

export const getFilterMovies = async (
  params: DiscoverMovieFilters
): Promise<DiscoverMovieResponse> => {
  const res = await tmdbApi.get('/discover/movie', {
    params: {
      language: i18n.language,
      include_adult: false,
      sort_by: 'popularity.desc',
      ...params,
    },
  });

  return res.data;
};

export const getDiscoverTvShows = async (page: number): Promise<TvShow[]> => {
  const res = await tmdbApi.get('http://localhost:5000/api/tvshows', {
    params: {
      include_video: false,
      language: i18n.language,
      page,
      sort_by: 'popularity.desc',
    },
  });

  return res.data.results;
};
// export const getDiscoverTvShows = async (page: number): Promise<TvShow[]> => {
//   const res = await tmdbApi.get('/trending/tv/week', {
//     params: {
//       include_video: false,
//       language: i18n.language,
//       page,
//       sort_by: 'popularity.desc',
//     },
//   });

//   return res.data.results;
// };

export const fetchShowid = async (id: string): Promise<TvDetailType> => {
  const res = await axios.get(`http://localhost:5000/api/tvshow/${id}`, {
    // params: { language: i18n.language },
  });

  return res.data;
};

export const fetchMovieid = async (id: string): Promise<MovieDetailType> => {
  const res = await axios.get(`http://localhost:5000/api/movie/${id}`, {
    // params: { language: i18n.language },
  });

  return res.data;
};

export const fetchSimilarMovies = async (): Promise<SimilarMovie[]> => {
  const res = await axios.get('http://localhost:5000/api/movies', {
    params: {
      include_video: false,
      sort_by: 'popularity.desc',
    },
  });

  return res.data.results;
};
