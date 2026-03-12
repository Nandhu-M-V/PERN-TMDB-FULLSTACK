import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { AppDispatch } from '../app/store';
import type { MovieDetailType } from './MovieDetails';
import { fetchMovies } from '@/features/movies/movieSlice';
import { useDispatch } from 'react-redux';
import { useAuth } from '@/context/useAuth';
import { toast } from 'react-toastify';
import { ConfirmDialog } from '@/components/Confirm';
import { Button } from '@/components/ui/button';

const EditMovie = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const movieId = Number(id);

  const [movie, setMovie] = useState<MovieDetailType | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const { user } = useAuth();
  const role = user?.role;

  const [title, setTitle] = useState('');
  const [overview, setOverview] = useState('');
  const [tagline, setTagline] = useState('');
  const [vote_average, setVote] = useState(0);
  const [release_date, setReleaseDate] = useState('');

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!movieId) return;

    const fetchMovie = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/movie/${movieId}`);
        if (!res.ok) throw new Error('Movie not found');

        const data: MovieDetailType = await res.json();
        setMovie(data);
        setTitle(data.title);
        setOverview(data.overview);
        setTagline(data.tagline ?? '');
        setVote(data.vote_average);
        setReleaseDate(data.release_date.split('T')[0]);
      } catch (err) {
        toast.error(
          `Movie not Found ${err instanceof Error ? err.message : ''}`
        );
        navigate('/movies/discover');
      }
    };

    fetchMovie();
  }, [movieId, navigate]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) newErrors.title = 'Title is required';
    if (!overview.trim()) newErrors.overview = 'Overview is required';
    if (vote_average < 0 || vote_average > 10)
      newErrors.vote_average = 'Vote must be between 0 and 10';
    if (!release_date) newErrors.release_date = 'Release date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

  const handleSubmit = async () => {
    if (role != 'admin') {
      toast.error('Only an Admin can edit Media ');

      return;
    }

    if (!movie || !validate()) return;

    const updatedMovie = {
      title,
      overview,
      tagline,
      vote_average,
      release_date,
    };

    try {
      const response = await fetch(
        `http://localhost:5000/api/movie/${movieId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedMovie),
        }
      );

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        toast.error(errData.error || 'Failed to update movie');
        return;
      }

      const data = await response.json().catch(() => updatedMovie);
      dispatch(fetchMovies(1));

      navigate(`/movie/${movieId}/${slugify(data.title)}`);
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong while updating the movie.');
    }
  };

  if (!movie) return <div className="text-white p-10">Movie not found</div>;

  return (
    <div className="min-h-screen bg-gray-300 dark:bg-black text-black dark:text-white flex justify-center pt-28 px-6">
      <div className="w-full max-w-2xl space-y-6">
        <h1 className="text-3xl font-bold text-red-600">Edit Movie</h1>

        <div className="flex flex-col gap-2">
          <label htmlFor="title" className="font-medium">
            Movie Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-3 w-full rounded border border-black dark:border-red-500 bg-gray-200 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="overview" className="font-medium">
            Movie Overview
          </label>
          <textarea
            id="overview"
            rows={6}
            value={overview}
            onChange={(e) => setOverview(e.target.value)}
            className="p-3 w-full rounded border border-black dark:border-red-500 bg-gray-200 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          {errors.overview && (
            <p className="text-red-500 text-sm">{errors.overview}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="tagline" className="font-medium">
            Movie Tagline
          </label>
          <input
            id="tagline"
            type="text"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            className="p-3 w-full rounded border border-black dark:border-red-500 bg-gray-200 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="releaseDate" className="font-medium">
            Release Date
          </label>
          <input
            id="releaseDate"
            type="date"
            value={release_date || '2000-01-01'}
            onChange={(e) => setReleaseDate(e.target.value)}
            className="p-3 w-full rounded border border-black dark:border-red-500 bg-gray-200 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          {errors.release_date && (
            <p className="text-red-500 text-sm">{errors.release_date}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="voteAverage" className="font-medium">
            Vote Average
          </label>
          <input
            id="voteAverage"
            type="number"
            step="0.1"
            value={vote_average}
            onChange={(e) => setVote(Number(e.target.value))}
            className="p-3 w-full rounded border border-black dark:border-red-500 bg-gray-200 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          {errors.vote_average && (
            <p className="text-red-500 text-sm">{errors.vote_average}</p>
          )}
        </div>

        {role && role.includes('admin') && (
          <div className="">
            <ConfirmDialog
              title="Are you sure you want to edit this movie?"
              description="This action cannot be undone."
              actionText="Submit"
              trigger={
                <Button className="w-full h-full bg-red-600 justify-center flex hover:bg-red-700 text-white  py-3 rounded-lg transition duration-200">
                  Save Changes
                </Button>
              }
              onConfirm={async () => {
                if (!id) return;

                try {
                  handleSubmit();
                  toast.success('Movie Edited successfully');
                } catch (error) {
                  toast.error(`Failed to delete movie ${error}`);
                }
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EditMovie;
