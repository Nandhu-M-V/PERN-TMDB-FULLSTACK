import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/app/store';
import { fetchGenres } from '@/features/genres/genreSlice';
import { useEffect } from 'react';

interface Props {
  onSelect: (id: number, name: string) => void;
}

const FilterGenres = ({ onSelect }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { genres, genreLoading } = useSelector(
    (state: RootState) => state.genre
  );

  useEffect(() => {
    dispatch(fetchGenres());
  }, [dispatch]);

  return (
    <div className="absolute top-20 left-140 mt-2 w-52 bg-gray-900 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
      {genreLoading ? (
        <p className="p-3 text-gray-300">Loading...</p>
      ) : (
        genres.map((genre) => (
          <div
            key={genre.id}
            onClick={() => onSelect(genre.id, genre.name)}
            className="px-4 py-2 hover:bg-purple-600 cursor-pointer text-white transition-colors"
          >
            {genre.name}
          </div>
        ))
      )}
    </div>
  );
};

export default FilterGenres;
