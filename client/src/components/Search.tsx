import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { BaseMedia } from './TvShowCard';

interface SearchProps {
  autoFocus?: boolean;
}

const Search = ({ autoFocus }: SearchProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<BaseMedia[]>([]);
  const [loading, setLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<number | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (autoFocus) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [autoFocus]);

  const fetchMovies = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:5000/api/search?query=${encodeURIComponent(
          searchQuery
        )}`
      );

      const data = await res.json();
      setResults(data.results ?? []);
    } catch (error) {
      console.error(error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (debounceRef.current !== null) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = window.setTimeout(() => {
      fetchMovies(query);
    }, 500);

    return () => {
      if (debounceRef.current !== null) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

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

  const handleSelect = (type: string, id: number, name: string) => {
    setQuery('');
    setResults([]);

    if (type.toLowerCase() === 'movie') {
      navigate(`/movie/${id}/${slugify(name)}`);
    } else if (type.toLowerCase() === 'tv') {
      navigate(`/tv/${id}/${slugify(name)}`);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setResults([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={searchRef} className="z-20 md:w-md lg:w-2xl">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search Movies, TV shows..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full h-15 pl-14 pr-6 rounded-full
                     bg-gray-600/50 backdrop-blur-md border border-gray-700
                     text-white placeholder-gray-400
                     focus:outline-none focus:ring-2 focus:ring-red-600
                     transition-all duration-300"
        />
      </div>

      {loading && (
        <div className="flex flex-col relative items-center mt-2">
          <span className="loader"></span>
        </div>
      )}

      {results.length > 0 && (
        <div className="bg-black/90 backdrop-blur-lg absolute top-16 max-w-3xl w-full rounded-xl max-h-96 overflow-y-auto custom-scrollbar shadow-2xl border border-gray-800">
          {results.slice(0, 15).map((item) => (
            <div
              key={item.id}
              onClick={() =>
                handleSelect(
                  item.media_type || 'movie',
                  item.id,
                  item.title || item.name || ''
                )
              }
              className="flex items-center gap-4 p-3 hover:bg-gray-800 transition cursor-pointer"
            >
              {item.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                  alt={item.title || item.name}
                  className="w-12 rounded-md"
                />
              )}

              <div>
                <p className="text-white font-medium">
                  {item.title || item.name}
                </p>
                <p className="text-gray-400 text-sm">
                  {item.media_type?.toUpperCase()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && query && results.length === 0 && (
        <div className="absolute top-16 bg-black/90 w-full max-w-3xl rounded-xl text-white p-4">
          No results found
        </div>
      )}
    </div>
  );
};

export default Search;
