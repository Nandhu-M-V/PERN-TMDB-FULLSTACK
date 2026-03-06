import axios from "axios";
import { pool } from "../config/db.js";

type MediaType = "movie" | "tv";

export const fetchPopularMedia = async (type: MediaType) => {
  try {
    console.log(`Fetching popular ${type} from TMDB...`);

    const table = type === "movie" ? "movies" : "tvshows";

    let totalProcessed = 0;

    for (let page = 1; page <= 10; page++) {
      console.log(`Fetching ${type} page ${page}...`);

      const response = await axios.get(
        `https://api.themoviedb.org/3/${type}/popular?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
            timeout: 10000,
          },
        },
      );

      const items = response.data.results;

      // console.log(items);

      for (const item of items) {
        await pool.query(
          `
          INSERT INTO ${table} (
            tmdb_id,
            title,
            overview,
            poster_path,
            backdrop_path,
            release_date,
            runtime,
            popularity,
            vote_average,
            vote_count,
            adult,
            status,
            original_language
          )
          VALUES (
            $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13
          )
          ON CONFLICT (tmdb_id)
          DO UPDATE SET
            title = EXCLUDED.title,
            overview = EXCLUDED.overview,
            poster_path = EXCLUDED.poster_path,
            backdrop_path = EXCLUDED.backdrop_path,
            release_date = EXCLUDED.release_date,
            runtime = EXCLUDED.runtime,
            popularity = EXCLUDED.popularity,
            vote_average = EXCLUDED.vote_average,
            vote_count = EXCLUDED.vote_count,
            adult = EXCLUDED.adult,
            status = EXCLUDED.status,
            original_language = EXCLUDED.original_language,
            updated_at = CURRENT_TIMESTAMP
          `,
          [
            item.id,
            type === "movie" ? item.title : item.name,
            item.overview ?? null,
            item.poster_path ?? null,
            item.backdrop_path ?? null,
            type === "movie"
              ? item.release_date || null
              : item.first_air_date || null,
            type === "movie"
              ? (item.runtime ?? null)
              : (item.episode_run_time?.[0] ?? null),
            item.popularity ?? 0,
            item.vote_average ?? 0,
            item.vote_count ?? 0,
            type === "movie" ? (item.adult ?? false) : false,
            item.status ?? null,
            item.original_language ?? null,
          ],
        );
      }

      totalProcessed += items.length;
    }

    console.log(`Done. Processed ${totalProcessed} ${type}s.`);
    return totalProcessed;
  } catch (error) {
    console.error("Error syncing:", error);
    throw error;
  }
};
