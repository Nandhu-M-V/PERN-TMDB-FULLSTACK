import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { getDiscoverMovies } from '../../utils/ApiFetch';

interface Movie {
  id: number;
  tmdb_id?: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  tagline?: string;
  vote_average?: number;
  release_date?: string;
}

interface MovieState {
  loading: boolean;
  movies: Movie[];
  error: string;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: MovieState = {
  loading: false,
  movies: [],
  error: '',
  status: 'idle',
};

export const fetchMovies = createAsyncThunk<Movie[], number>(
  'movie/fetchMovies',
  async (page) => {
    const response = await getDiscoverMovies(page);
    console.log('Fetching movies...');
    return response;
  }
);

const movieSlice = createSlice({
  name: 'movie',
  initialState,
  reducers: {
    updateMovie: (
      state,
      action: PayloadAction<{
        id: number;
        title: string;
        overview: string;
        vote_average: number;
        release_date: string;
      }>
    ) => {
      const movie = state.movies.find((m) => m.id === action.payload.id);

      if (movie) {
        movie.title = action.payload.title;
        movie.overview = action.payload.overview;
        movie.release_date = action.payload.release_date;
        movie.vote_average = action.payload.vote_average;
      }
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
        state.status = 'loading';
        state.error = '';
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'succeeded';
        state.movies = action.payload;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.error.message ?? 'Error';
      });
  },
});

export const { updateMovie } = movieSlice.actions;

export default movieSlice.reducer;
