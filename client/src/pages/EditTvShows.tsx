import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { TvDetailType } from './TvDetail';
import type { AppDispatch } from '../app/store';
import { useDispatch } from 'react-redux';
import { fetchTvShows } from '@/features/Tvshows/tvshowSlice';
import { useAuth } from '@/context/useAuth';
import { toast } from 'react-toastify';
import { ConfirmDialog } from '@/components/Confirm';
import { Button } from '@/components/ui/button';

const EditTvShow = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const showId = Number(id);

  const [tv, setTv] = useState<TvDetailType | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const { user } = useAuth();
  const role = user?.role;

  const [title, setTitle] = useState('');
  const [overview, setOverview] = useState('');
  const [tagline, setTagline] = useState('');
  const [vote_average, setVote] = useState(0);
  const [release_date, setReleaseDate] = useState('');

  const dispatch = useDispatch<AppDispatch>();

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

  useEffect(() => {
    if (!showId) return;

    const fetchShow = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/tvshow/${showId}`);
        if (!res.ok) throw new Error('TV show not found');

        const data: TvDetailType = await res.json();

        setTv(data);
        setTitle(data.title);
        setOverview(data.overview);
        setTagline(data.tagline ?? '');
        setVote(data.vote_average);
        setReleaseDate(data.release_date?.split('T')[0]?.toString() ?? '');
      } catch (err) {
        toast.error(`Only an Admin can edit Media ${err}`);

        navigate('/tvshow/discover');
      }
    };

    fetchShow();
  }, [showId, navigate]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!overview.trim()) newErrors.overview = 'Overview is required';
    if (!title.trim()) newErrors.title = 'TV Show title is required';
    if (!release_date) newErrors.release_date = 'Release date is required';
    if (vote_average < 0 || vote_average > 10)
      newErrors.vote_average = 'Vote must be between 0 and 10';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (role != 'admin') {
      toast.error('Only an Admin can edit Media ');

      return;
    }
    if (!tv || !validate()) return;

    const updatedShow = {
      title,
      overview,
      tagline,
      vote_average,
      release_date,
    };

    try {
      const response = await fetch(
        `http://localhost:5000/api/tvshow/${showId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedShow),
        }
      );

      if (!response.ok) {
        toast.error('Failed to update Tvshow ');

        return;
      }

      const data = await response.json();
      dispatch(fetchTvShows(1));
      navigate(`/tv/${showId}/${slugify(data.title)}`);
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong... ');
    }
  };

  if (!tv) return <div className="text-white p-10">TV Show not found</div>;

  return (
    <div className="min-h-screen bg-gray-300 dark:bg-black text-black dark:text-white flex justify-center pt-28 px-6">
      <div className="w-full max-w-2xl space-y-6">
        <h1 className="text-3xl font-bold text-red-600">Edit TV Show</h1>

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
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setErrors((prev) => ({ ...prev, title: '' }));
              }}
              className="p-3 w-full rounded border border-black dark:border-red-500 bg-gray-200 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title}</p>
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
              className="p-3 w-full rounded border border-black dark:border-red-500 bg-gray-200 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
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
              className="p-3 w-full rounded border border-black dark:border-red-500 bg-gray-200 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="firstAirDate" className="font-medium">
              First Air Date
            </label>
            <input
              id="firstAirDate"
              type="date"
              value={release_date}
              onChange={(e) => {
                setReleaseDate(e.target.value);
                setErrors((prev) => ({ ...prev, release_date: '' }));
              }}
              className="p-3 w-full rounded border border-black dark:border-red-500 bg-gray-200 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            {errors.release_date && (
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
              className="p-3 w-full rounded border border-black dark:border-red-500 bg-gray-200 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            {errors.vote_average && (
              <p className="text-red-500 text-sm">{errors.vote_average}</p>
            )}
          </div>

          {role && role.includes('admin') && (
            <div className="">
              <ConfirmDialog
                title="Are you sure you want to edit this tvshow?"
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
                    toast.success('Tvshow Edited successfully');
                  } catch (error) {
                    toast.error(`Failed to delete movie ${error}`);
                  }
                }}
              />
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default EditTvShow;
