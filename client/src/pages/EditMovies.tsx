import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { MovieDetailType } from './MovieDetails';

const EditMovie = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const movieId = Number(id);

  const [movie, setMovie] = useState<MovieDetailType | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [title, setTitle] = useState('');
  const [overview, setOverview] = useState('');
  const [tagline, setTagline] = useState('');
  const [vote_average, setVote] = useState(0);
  const [release_date, setReleaseDate] = useState('');

  useEffect(() => {
    if (!movieId) return;

    const stored = localStorage.getItem('editedMovies');
    const parsed = stored ? JSON.parse(stored) : {};

    if (parsed[movieId]) {
      const m = parsed[movieId];
      setTimeout(() => {
        setMovie(m);
        setTitle(m.title);
        setOverview(m.overview);
        setTagline(m.tagline);
        setVote(m.vote_average);
        setReleaseDate(m.release_date);
      }, 0);
    } else {
      alert('Movie not found in local storage!');
      navigate('/movies/discover');
    }
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

  const handleSubmit = () => {
    if (!movie || !validate()) return;

    const updatedMovie = {
      ...movie,
      title,
      overview,
      tagline,
      vote_average,
      release_date,
    };

    const stored = localStorage.getItem('editedMovies');
    const parsed = stored ? JSON.parse(stored) : {};

    parsed[movieId] = updatedMovie;
    localStorage.setItem('editedMovies', JSON.stringify(parsed));

    navigate(`/movie/${movieId}/${slugify(movie.title)}`);
  };

  if (!movie)
    return (
      <div className="text-white p-10">Movie not found in local storage</div>
    );

  return (
    <div className="min-h-screen bg-gray-300 dark:bg-black text-black dark:text-white flex justify-center pt-28 px-6">
      <div className="w-full max-w-2xl space-y-6">
        <h1 className="text-3xl font-bold text-purple-600">Edit Movie</h1>

        <div className="flex flex-col gap-2">
          <label htmlFor="title" className="font-medium">
            Movie Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-3 w-full rounded border border-black dark:border-purple-500 bg-gray-200 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
            className="p-3 w-full rounded border border-black dark:border-purple-500 bg-gray-200 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
            className="p-3 w-full rounded border border-black dark:border-purple-500 bg-gray-200 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="releaseDate" className="font-medium">
            Release Date
          </label>
          <input
            id="releaseDate"
            type="date"
            value={release_date}
            onChange={(e) => setReleaseDate(e.target.value)}
            className="p-3 w-full rounded border border-black dark:border-purple-500 bg-gray-200 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
            className="p-3 w-full rounded border border-black dark:border-purple-500 bg-gray-200 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {errors.vote_average && (
            <p className="text-red-500 text-sm">{errors.vote_average}</p>
          )}
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition duration-200"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default EditMovie;
