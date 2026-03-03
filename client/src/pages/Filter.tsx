import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getFilterMovies,
  fetchMovieGenres,
  type Genre,
  type DiscoverMovieFilters,
  type DiscoverMovie,
} from '@/utils/ApiFetch';

const FilterResultsPage = () => {
  const navigate = useNavigate();

  const [movies, setMovies] = useState<DiscoverMovie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [year, setYear] = useState<number | ''>('');
  const [minRating, setMinRating] = useState(0);
  const [minVotes, setMinVotes] = useState(0);
  const [minRuntime, setMinRuntime] = useState(0);
  const [maxRuntime, setMaxRuntime] = useState(0);
  const [sortBy, setSortBy] = useState('popularity.desc');

  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  // ---------------- LOAD GENRES ----------------
  useEffect(() => {
    const loadGenres = async () => {
      const data = await fetchMovieGenres();
      setGenres(data);
    };
    loadGenres();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [
    selectedGenres,
    year,
    minRating,
    minVotes,
    minRuntime,
    maxRuntime,
    sortBy,
  ]);

  useEffect(() => {
    const buildFilters = (): DiscoverMovieFilters => {
      const filters: DiscoverMovieFilters = {
        page,
        sort_by: sortBy,
        include_adult: false,
      };

      if (selectedGenres.length > 0) {
        filters.with_genres = selectedGenres.join(',');
      }

      if (year) {
        filters.primary_release_year = year;
      }

      if (minRating > 0) {
        filters['vote_average.gte'] = minRating;
      }

      if (minVotes > 0) {
        filters['vote_count.gte'] = minVotes;
      }

      if (minRuntime > 0) {
        filters['with_runtime.gte'] = minRuntime;
      }

      if (maxRuntime > 0) {
        filters['with_runtime.lte'] = maxRuntime;
      }

      return filters;
    };

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getFilterMovies(buildFilters());

        setMovies(data.results);
        setTotalPages(data.total_pages);
      } catch {
        setError('Failed to fetch movies');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [
    page,
    selectedGenres,
    year,
    minRating,
    minVotes,
    minRuntime,
    maxRuntime,
    sortBy,
  ]);

  const filteredMovies = useMemo(() => {
    return movies.filter((movie) =>
      movie.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [movies, search]);

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-black text-black dark:text-white">
      <aside className="w-80 bg-white dark:bg-gray-900 pt-28 p-6 border-r border-gray-200 dark:border-gray-800 overflow-y-auto">
        <h2 className="text-xl font-bold mb-6">Filters</h2>

        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium">
            Search (within results)
          </label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800"
            placeholder="Search movies..."
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium">Genres</label>
          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => (
              <button
                key={genre.id}
                onClick={() =>
                  setSelectedGenres((prev) =>
                    prev.includes(genre.id)
                      ? prev.filter((id) => id !== genre.id)
                      : [...prev, genre.id]
                  )
                }
                className={`px-3 py-1 rounded text-sm ${
                  selectedGenres.includes(genre.id)
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                {genre.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium">Year</label>
          <input
            type="number"
            value={year}
            onChange={(e) =>
              setYear(e.target.value ? Number(e.target.value) : '')
            }
            className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800"
            placeholder="2024"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium">Min Rating</label>
          <input
            type="number"
            min={0}
            max={10}
            step={0.5}
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
            className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium">Min Votes</label>
          <input
            type="number"
            value={minVotes}
            onChange={(e) => setMinVotes(Number(e.target.value))}
            className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium">Runtime</label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={minRuntime}
              onChange={(e) => setMinRuntime(Number(e.target.value))}
              className="w-1/2 p-2 rounded bg-gray-100 dark:bg-gray-800"
            />
            <input
              type="number"
              placeholder="Max"
              value={maxRuntime}
              onChange={(e) => setMaxRuntime(Number(e.target.value))}
              className="w-1/2 p-2 rounded bg-gray-100 dark:bg-gray-800"
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800"
          >
            <option value="popularity.desc">Popularity ↓</option>
            <option value="popularity.asc">Popularity ↑</option>
            <option value="vote_average.desc">Rating ↓</option>
            <option value="release_date.desc">Newest</option>
            <option value="release_date.asc">Oldest</option>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
            {filteredMovies.map((movie) => (
              <div
                key={movie.id}
                onClick={() =>
                  navigate(`/movie/${movie.id}/${slugify(movie.title)}`)
                }
                className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer"
              >
                {movie.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-72 object-cover"
                  />
                ) : (
                  <div className="w-full h-72 flex items-center justify-center bg-gray-300 dark:bg-gray-800">
                    No Image
                  </div>
                )}

                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{movie.title}</h3>
                  <p className="text-sm text-gray-500">
                    ⭐ {movie.vote_average.toFixed(1)}
                  </p>
                  <p className="text-sm text-gray-500">{movie.release_date}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center mt-10 gap-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
            className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
          >
            Previous
          </button>

          <span className="px-4 py-2">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((prev) => prev + 1)}
            className="px-4 py-2 bg-purple-600 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
};

export default FilterResultsPage;
