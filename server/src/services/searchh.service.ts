import { pool } from "../config/db.js";

export const searchMediaService = async (query: string) => {
  const search = `%${query}%`;

  const result = await pool.query(
    `
    SELECT id, title, poster_path, 'movie' AS media_type
    FROM movies
    WHERE title ILIKE $1

    UNION ALL

    SELECT id, title, poster_path, 'tv' AS media_type
    FROM tvshows
    WHERE title ILIKE $1

    LIMIT 15
    `,
    [search],
  );

  return result.rows;
};
