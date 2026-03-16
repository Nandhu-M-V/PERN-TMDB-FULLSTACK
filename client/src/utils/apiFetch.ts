import axios from 'axios';
import i18n from './i18n';

import type { TvDetailType } from '@/pages/TvDetail';
import type { MovieDetailType } from '@/pages/MovieDetails';
import { API_URL } from '@/environment_variables/env_constants';

// const token = import.meta.env.VITE_TMDB_ACCESS_TOKEN;

// if (!token) {
//   throw new Error('TMDB Access Token is missing in .env file');
// }

export const API = axios.create({
  baseURL: `${API_URL}`,
  headers: {
    accept: 'application/json',
  },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export interface DiscoverMovieFilters {
  page?: number;
  limit?: number;
  type: 'movie' | 'tv' | 'all';
  year?: number | string;
  minRating?: number;
  sortBy?: string;
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
  media_type?: string;
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
  tmdb_id: number;
  id: number;
  title: string;
  poster_path: string;
}

export const fetchMovieGenres = async (): Promise<Genre[]> => {
  const res = await API.get('/genre/movie/list');
  return res.data.genres;
};

// get all movies

export const getDiscoverMovies = async (page: number): Promise<Movie[]> => {
  const res = await API.get('/api/movies', {
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
  const res = await API.get('/api/filter', {
    params,
  });

  return res.data;
};

// get all tvshows

export const getDiscoverTvShows = async (page: number): Promise<TvShow[]> => {
  const res = await API.get('/api/tvshows', {
    params: {
      include_video: false,
      language: i18n.language,
      page,
      sort_by: 'popularity.desc',
    },
  });

  return res.data.results;
};

// get tvshow

export const fetchShowid = async (id: string): Promise<TvDetailType> => {
  const res = await API.get(`/api/tvshow/${id}`, {
    // params: { language: i18n.language },
  });

  return res.data;
};

// get movie

export const fetchMovieid = async (id: string): Promise<MovieDetailType> => {
  const res = await API.get(`/api/movie/${id}`, {
    // params: { language: i18n.language },
  });

  return res.data;
};

// similar movies for detail page

export const fetchSimilarMovies = async (): Promise<SimilarMovie[]> => {
  const res = await API.get('/api/movies', {
    params: {
      include_video: false,
      sort_by: 'popularity.desc',
    },
  });

  return res.data.results;
};

// delete Movies

export const deleteMovie = async (id: number) => {
  await API.delete(`/api/media/movie/${id}`);
};

// delete Tvshows
export const deleteTvshow = async (id: number) => {
  await API.delete(`/api/media/tv/${id}`);
};
