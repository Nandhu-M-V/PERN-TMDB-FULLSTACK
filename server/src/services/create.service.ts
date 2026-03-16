import { pool } from "../config/db.js";

interface MediaInput {
  title: string;
  overview: string;
  release_date: string;
  runtime: number;
  tagline?: string;
  rating?: number;
}

export const createMediaService = async (
  mediaType: string,
  data: MediaInput,
  poster_path: string | null,
) => {
  const { title, overview, release_date, runtime, tagline, rating } = data;

  const result = await pool.query(
    `
    INSERT INTO ${mediaType}
    (title, overview, tagline, vote_average, poster_path, backdrop_path, release_date, runtime)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING *
    `,
    [
      title,
      overview,
      tagline || null,
      rating || null,
      poster_path,
      poster_path,
      release_date,
      runtime,
    ],
  );

  return result.rows[0];
};
