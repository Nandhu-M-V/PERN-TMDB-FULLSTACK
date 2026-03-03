import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { TvDetailType } from './TvDetail';

const EditTvShow = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const showId = Number(id);

  const [tv, setTv] = useState<TvDetailType | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [name, setName] = useState('');
  const [overview, setOverview] = useState('');
  const [tagline, setTagline] = useState('');
  const [vote_average, setVote] = useState(0);
  const [first_air_date, setFirstAirDate] = useState('');

  useEffect(() => {
    if (!showId) return;

    const stored = localStorage.getItem('editedTvShows');
    const parsed = stored ? JSON.parse(stored) : {};

    if (parsed[showId]) {
      const show = parsed[showId];
      setTimeout(() => {
        setTv(show);
        setName(show.name);
        setOverview(show.overview);
        setTagline(show.tagline);
        setVote(show.vote_average);
        setFirstAirDate(show.first_air_date);
      }, 0);
    } else {
      alert('TV Show not found in local storage!');
      navigate('/tvshow/discover');
    }
  }, [showId, navigate]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) newErrors.name = 'TV Show name is required';
    if (!overview.trim()) newErrors.overview = 'Overview is required';
    if (!first_air_date)
      newErrors.first_air_date = 'First air date is required';
    if (vote_average < 0 || vote_average > 10)
      newErrors.vote_average = 'Vote must be between 0 and 10';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!tv || !validate()) return;

    const updatedShow = {
      ...tv,
      name,
      overview,
      tagline,
      vote_average,
      first_air_date,
    };

    const stored = localStorage.getItem('editedTvShows');
    const parsed = stored ? JSON.parse(stored) : {};
    parsed[showId] = updatedShow;
    localStorage.setItem('editedTvShows', JSON.stringify(parsed));

    navigate(`/tv/${showId}`);
  };

  if (!tv)
    return (
      <div className="text-white p-10">TV Show not found in local storage</div>
    );

  return (
    <div className="min-h-screen bg-gray-300 dark:bg-black text-black dark:text-white flex justify-center pt-28 px-6">
      <div className="w-full max-w-2xl space-y-6">
        <h1 className="text-3xl font-bold text-purple-600">Edit TV Show</h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="space-y-6"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="font-medium">
              TV Show Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors((prev) => ({ ...prev, name: '' }));
              }}
              className="p-3 w-full rounded border border-black dark:border-purple-500 bg-gray-200 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="overview" className="font-medium">
              TV Show Overview
            </label>
            <textarea
              id="overview"
              rows={6}
              value={overview}
              onChange={(e) => {
                setOverview(e.target.value);
                setErrors((prev) => ({ ...prev, overview: '' }));
              }}
              className="p-3 w-full rounded border border-black dark:border-purple-500 bg-gray-200 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.overview && (
              <p className="text-red-500 text-sm">{errors.overview}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="tagline" className="font-medium">
              Tagline
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
            <label htmlFor="firstAirDate" className="font-medium">
              First Air Date
            </label>
            <input
              id="firstAirDate"
              type="date"
              value={first_air_date}
              onChange={(e) => {
                setFirstAirDate(e.target.value);
                setErrors((prev) => ({ ...prev, first_air_date: '' }));
              }}
              className="p-3 w-full rounded border border-black dark:border-purple-500 bg-gray-200 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.first_air_date && (
              <p className="text-red-500 text-sm">{errors.first_air_date}</p>
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
              onChange={(e) => {
                setVote(Number(e.target.value));
                setErrors((prev) => ({ ...prev, vote_average: '' }));
              }}
              className="p-3 w-full rounded border border-black dark:border-purple-500 bg-gray-200 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.vote_average && (
              <p className="text-red-500 text-sm">{errors.vote_average}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition duration-200"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditTvShow;
