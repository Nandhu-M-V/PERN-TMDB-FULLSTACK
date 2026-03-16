import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { getDiscoverTvShows } from '../../../utils/apiFetch';

export interface TvShow {
  id: number;
  tmdb_id?: string;
  name: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  first_air_date?: string;
  vote_average?: number;
  tagline?: string;
}

interface TvShowState {
  loading1: boolean;
  tvShows: TvShow[];
  error1: string;
  tvstatus: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: TvShowState = {
  loading1: false,
  tvShows: [],
  error1: '',
  tvstatus: 'idle',
};

export const fetchTvShows = createAsyncThunk<TvShow[], number>(
  'tvShow/fetchTvShows',
  async (page) => {
    const response = await getDiscoverTvShows(page);
    return response;
  }
);

const tvSlice = createSlice({
  name: 'tvshow',
  initialState,
  reducers: {
    updateTvShow: (
      state,
      action: PayloadAction<{
        id: number;
        name: string;
        overview: string;
        vote_average: number;
        first_air_date: string;
      }>
    ) => {
      const show = state.tvShows.find((tv) => tv.id === action.payload.id);

      if (show) {
        show.name = action.payload.name;
        show.overview = action.payload.overview;
        show.vote_average = action.payload.vote_average;
        show.first_air_date = action.payload.first_air_date;
      }
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchTvShows.pending, (state) => {
        state.loading1 = true;
        state.tvstatus = 'loading';
        state.error1 = '';
      })
      .addCase(fetchTvShows.fulfilled, (state, action) => {
        state.tvstatus = 'succeeded';
        state.loading1 = false;
        state.tvShows = action.payload;
      })
      .addCase(fetchTvShows.rejected, (state, action) => {
        state.loading1 = false;
        state.tvstatus = 'failed';
        state.error1 = action.error.message ?? 'Error';
      });
  },
});

export const { updateTvShow } = tvSlice.actions;

export default tvSlice.reducer;
