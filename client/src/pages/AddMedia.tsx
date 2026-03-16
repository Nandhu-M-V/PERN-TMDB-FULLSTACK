import axios from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { mediaSchema } from '../validators/mediaSchema';
import type { MediaFormData } from '../validators/mediaSchema';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { fetchMovies } from '@/Redux/features/movies/movieSlice';
import { fetchTvShows } from '@/Redux/features/Tvshows/tvshowSlice';
import type { AppDispatch } from '@/Redux/store/store';
import { API_URL } from '@/environment_variables/env_constants';

const AddMedia = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MediaFormData>({
    resolver: zodResolver(mediaSchema),
    defaultValues: {
      type: 'movies',
    },
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handlePreview = (file?: File) => {
    if (!file) return;

    if (preview) URL.revokeObjectURL(preview);

    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.role;
  const dispatch = useDispatch<AppDispatch>();

  const onSubmit = async (data: MediaFormData) => {
    try {
      setLoading(true);

      if (role !== 'admin') {
        toast.error('Only an Admin can add Media');
        navigate('/');
        return;
      }

      const file = data.poster[0];

      if (!file) {
        toast.error('Poster is required');
        return;
      }

      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('overview', data.overview);

      if (data.tagline) formData.append('tagline', data.tagline);
      if (data.rating !== undefined)
        formData.append('rating', String(data.rating));

      formData.append('release_date', data.release_date);
      formData.append('runtime', String(data.runtime));
      formData.append('poster', file);

      await axios.post(`${API_URL}/api/media/${data.type}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Media added successfully 🎬');

      reset();
      setPreview(null);
      dispatch(fetchMovies(1));
      dispatch(fetchTvShows(1));

      navigate('/');
    } catch (err) {
      console.error(err);
      toast.error('Failed to add media');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center mt-10 px-6 py-20
    bg-linear-to-br from-gray-300 via-gray-200 to-gray-300
    dark:from-black dark:via-gray-900 dark:to-black"
    >
      <div
        className="w-full max-w-6xl
      backdrop-blur-xl
      bg-white/90 dark:bg-gray-900/70
      border border-gray-300 dark:border-gray-700
      rounded-3xl shadow-2xl p-10"
      >
        <h1 className="text-4xl font-bold text-center mb-10 text-black">
          Add New Media 🎬
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* MEDIA TYPE */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-200">
              Media Type
            </h3>

            <div className="flex gap-6 text-gray-900 dark:text-gray-200">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" value="movies" {...register('type')} />
                Movie
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" value="tvshows" {...register('type')} />
                TV Show
              </label>
            </div>

            {errors.type && (
              <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {/* LEFT SIDE */}
            <div className="space-y-6">
              <div>
                <label className="block font-medium mb-1 text-gray-900 dark:text-gray-200">
                  Title
                </label>

                <input
                  {...register('title')}
                  className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-3
                  bg-white text-gray-900
                  dark:bg-gray-800 dark:text-white
                  focus:ring-2 focus:primary outline-none"
                />

                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-medium mb-1 text-gray-900 dark:text-gray-200">
                  Tagline
                </label>

                <input
                  {...register('tagline')}
                  className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-3
                  bg-white text-gray-900
                  dark:bg-gray-800 dark:text-white
                  focus:ring-2 focus:primary outline-none"
                />

                {errors.tagline && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.tagline.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-medium mb-1 text-gray-900 dark:text-gray-200">
                  Release Date
                </label>

                <input
                  type="date"
                  {...register('release_date')}
                  className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-3
                  bg-white text-gray-900
                  dark:bg-gray-800 dark:text-white
                  focus:ring-2 focus:primary outline-none"
                />
              </div>

              <div>
                <label className="block font-medium mb-1 text-gray-900 dark:text-gray-200">
                  Runtime
                </label>

                <input
                  type="number"
                  min={1}
                  {...register('runtime', { valueAsNumber: true })}
                  className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-3
                  bg-white text-gray-900
                  dark:bg-gray-800 dark:text-white
                  focus:ring-2 focus:primary outline-none"
                />

                {errors.runtime && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.runtime.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-medium mb-1 text-gray-900 dark:text-gray-200">
                  Rating
                </label>

                <input
                  type="number"
                  step="0.1"
                  min={0}
                  max={10}
                  {...register('rating', { valueAsNumber: true })}
                  className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-3
                  bg-white text-gray-900
                  dark:bg-gray-800 dark:text-white
                  focus:ring-2 focus:primary outline-none"
                />

                {errors.rating && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.rating.message}
                  </p>
                )}
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="space-y-6">
              <div>
                <label className="block font-medium mb-1 text-gray-900 dark:text-gray-200">
                  Overview
                </label>

                <textarea
                  {...register('overview')}
                  rows={6}
                  className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-3
                  bg-white text-gray-900
                  dark:bg-gray-800 dark:text-white
                  focus:ring-2 focus:primary outline-none"
                />

                {errors.overview && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.overview.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-medium mb-2 text-gray-900 dark:text-gray-200">
                  Poster Image
                </label>

                <input
                  type="file"
                  accept="image/*"
                  {...register('poster')}
                  onChange={(e) => handlePreview(e.target.files?.[0])}
                  className="block w-full text-sm
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:bg-primary file:text-black
                  hover:file:bg-primary"
                />

                {errors.poster && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.poster.message as string}
                  </p>
                )}

                {preview && (
                  <div className="mt-4 flex flex-col items-center">
                    <img
                      src={preview}
                      className="w-44 rounded-lg shadow-lg border"
                    />
                    <p className="text-sm mt-2 text-gray-700 dark:text-gray-300">
                      Poster Preview
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-lg font-semibold bg-foreground border hover:text-foreground hover:border-foreground hover:bg-primary text-white rounded-xl transition disabled:opacity-50"
          >
            {loading ? 'Adding Media...' : 'Add Media'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMedia;
