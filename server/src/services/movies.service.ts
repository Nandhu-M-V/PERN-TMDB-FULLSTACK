import axios from "axios";
import { pool } from "../config/db.js";

export const fetchPopularMovies = async () => {
  console.log("TOKEN:", process.env.TMDB_ACCESS_TOKEN);
  console.log("Fetching from TMDB...");
  const response = await axios.get(
    "https://api.themoviedb.org/3/movie/popular",
    {
      headers: { Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}` },
    },
  );

  const movies = response.data.results;

  console.log("TMDB returned:", response.data.results.length);

  for (const movie of movies) {
    // console.log(movie.title, movie.backdrop_path);
    console.log("Inserting movie:", movie.title);

    await pool.query(
      `INSERT INTO movies
   (tmdb_id, title, overview, poster_path, backdrop_path, release_date, vote_average)
   VALUES ($1, $2, $3, $4, $5, $6, $7)
   ON CONFLICT (tmdb_id)
   DO UPDATE SET
     title = EXCLUDED.title,
     overview = EXCLUDED.overview,
     poster_path = EXCLUDED.poster_path,
     backdrop_path = EXCLUDED.backdrop_path,
     release_date = EXCLUDED.release_date,
     vote_average = EXCLUDED.vote_average`,
      [
        movie.id,
        movie.title,
        movie.overview,
        movie.poster_path,
        movie.backdrop_path,
        movie.release_date,
        movie.vote_average,
      ],
    );
  }

  return movies.length;
};
