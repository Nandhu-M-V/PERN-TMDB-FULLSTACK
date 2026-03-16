import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFilterMovies, type DiscoverMovie } from '@/utils/apiFetch';

const FilterResultsPage = () => {
  const navigate = useNavigate();

  const [movies, setMovies] = useState<DiscoverMovie[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState('');
  const [type, setType] = useState<'all' | 'movie' | 'tv'>('all');

  const [year, setYear] = useState<number | ''>('');
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('popularity');

  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const slugify = (title: string) => {
    if (!title) return 'untitled';

    return title
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\p{L}\p{N}\s-]/gu, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  // reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [type, year, minRating, sortBy]);

  // fetch results
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getFilterMovies({
          page,
          limit: 24,
          type,
          year,
          minRating,
          sortBy,
        });

        setMovies(data.results);
        setTotalPages(data.total_pages || 1);
      } catch {
        setError('Failed to fetch media');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, type, year, minRating, sortBy]);

  const filteredMovies = useMemo(() => {
    return movies.filter((m) =>
      m.title?.toLowerCase().includes(search.toLowerCase())
    );
  }, [movies, search]);

  return (
    <div className="min-h-screen flex bg-foreground/40 dark:bg-black text-white dark:text-white">
      <aside className="w-80 bg-foreground/70 dark:bg-gray-900 pt-28 p-6 border-r border-primary dark:border-gray-800 overflow-y-auto">
        <h2 className="text-xl font-bold mb-6">Filters</h2>

        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium">Search</label>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 rounded text-black bg-gray-100 dark:bg-gray-800"
            placeholder="Search titles..."
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium">Type</label>

          <select
            value={type}
            onChange={(e) => setType(e.target.value as 'all' | 'movie' | 'tv')}
            className="w-full p-2 rounded text-black bg-gray-100 dark:bg-gray-800"
          >
            <option value="all">All</option>
            <option value="movie">Movies</option>
            <option value="tv">TV Shows</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-sm  font-medium">Year</label>

          <input
            type="number"
            value={year}
            onChange={(e) =>
              setYear(e.target.value ? Number(e.target.value) : '')
            }
            className="w-full p-2 rounded text-black bg-gray-100 dark:bg-gray-800"
            placeholder="2024"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium">
            Minimum Rating
          </label>

          <input
            type="number"
            min={0}
            max={10}
            step={0.5}
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
            className="w-full p-2 rounded text-black bg-gray-100 dark:bg-gray-800"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">Sort By</label>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full p-2 rounded text-black bg-gray-100 dark:bg-gray-800"
          >
            <option value="popularity">Popularity</option>
            <option value="vote_average">Rating</option>
            <option value="release_date">Release Date</option>
          </select>
        </div>
      </aside>

      <main className="pt-28 flex-1 p-8">
        <h2 className="text-2xl font-bold mb-6">
          Results ({filteredMovies.length})
        </h2>

        {loading && <p>Loading...</p>}

        {error && <p className="text-red-500">{error}</p>}

        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredMovies.map((movie) => {
              const title = movie.title;

              return (
                <div
                  key={`${movie.media_type}-${movie.id}`}
                  onClick={() =>
                    navigate(
                      `/${movie.media_type}/${movie.id}/${slugify(title)}`
                    )
                  }
                  className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer"
                >
                  {movie.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={title}
                      className="w-full h-72 object-cover"
                    />
                  ) : (
                    <div className="w-full h-72 flex items-center justify-center bg-gray-300 dark:bg-gray-800">
                      No Image
                    </div>
                  )}

                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{title}</h3>

                    <p className="text-sm text-gray-500">
                      ⭐ {movie.vote_average?.toFixed(1)}
                    </p>

                    <p className="text-sm text-gray-500">
                      {movie.release_date}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex justify-center mt-10 gap-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
          >
            Previous
          </button>

          <span className="px-4 py-2">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 bg-red-600 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
};

export default FilterResultsPage;
