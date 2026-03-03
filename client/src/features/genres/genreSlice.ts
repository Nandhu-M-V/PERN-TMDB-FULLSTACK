import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchMovieGenres } from '@/utils/ApiFetch';

interface Genre {
  id: number;
  name: string;
}

interface GenreState {
  genres: Genre[];
  genreLoading: boolean;
  genreError: string | null;
}

const initialState: GenreState = {
  genres: [],
  genreLoading: false,
  genreError: null,
};

export const fetchGenres = createAsyncThunk<Genre[]>(
  'genres/fetchGenres',
  async () => {
    const response = await fetchMovieGenres();
    return response;
  }
);

const genreSlice = createSlice({
  name: 'genres',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGenres.pending, (state) => {
        state.genreLoading = true;
      })
      .addCase(fetchGenres.fulfilled, (state, action) => {
        state.genreLoading = false;
        state.genres = action.payload;
      })
      .addCase(fetchGenres.rejected, (state) => {
        state.genreLoading = false;
        state.genreError = 'Failed to fetch genres';
      });
  },
});

export default genreSlice.reducer;
