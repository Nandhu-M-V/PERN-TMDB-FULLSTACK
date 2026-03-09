import axios from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { mediaSchema } from '../validators/mediaSchema.ts';
import type { MediaFormData } from '../validators/mediaSchema.ts';
import { useEffect, useState } from 'react';

const AddMedia = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MediaFormData>({
    resolver: zodResolver(mediaSchema),
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const onSubmit = async (data: MediaFormData) => {
    try {
      setLoading(true);

      const formData = new FormData();

      formData.append('title', data.title);
      formData.append('overview', data.overview);
      formData.append('release_date', data.release_date);
      formData.append('runtime', String(data.runtime));
      formData.append('language', data.language);

      if (data.poster_path?.[0]) {
        formData.append('poster', data.poster_path[0]);
      }

      await axios.post('http://localhost:5000/api', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Media added successfully');
    } catch (err) {
      console.error(err);
      alert('Failed to add media');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-xl bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-3xl font-bold mb-6 text-center">Add New Media</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              {...register('title')}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Overview */}
          <div>
            <label className="block text-sm font-medium mb-1">Overview</label>
            <textarea
              {...register('overview')}
              rows={4}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.overview && (
              <p className="text-red-500 text-sm mt-1">
                {errors.overview.message}
              </p>
            )}
          </div>

          {/* Poster Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Poster Image
            </label>

            <input
              type="file"
              accept="image/*"
              {...register('poster_path')}
              className="block w-full text-sm file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:bg-blue-600 file:text-white
              hover:file:bg-blue-700"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setPreview(URL.createObjectURL(file));
              }}
            />

            {preview && (
              <div className="mt-4 flex flex-col items-center gap-2">
                <img
                  src={preview}
                  className="w-40 rounded-lg shadow-md border"
                />
                <p className="text-sm text-gray-500">Poster preview</p>
              </div>
            )}
          </div>

          {/* Release Date */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Release Date
            </label>
            <input
              type="date"
              {...register('release_date')}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Runtime */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Runtime (minutes)
            </label>
            <input
              type="number"
              {...register('runtime', { valueAsNumber: true })}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.runtime && (
              <p className="text-red-500 text-sm mt-1">
                {errors.runtime.message}
              </p>
            )}
          </div>

          {/* Language */}
          <div>
            <label className="block text-sm font-medium mb-1">Language</label>
            <input
              {...register('language')}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.language && (
              <p className="text-red-500 text-sm mt-1">
                {errors.language.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Media'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMedia;
