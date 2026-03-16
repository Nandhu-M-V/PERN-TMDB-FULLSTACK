import { pool } from "../config/db.js";

export const filterMediaService = async (queryParams: any) => {
  const {
    page = 1,
    limit = 24,
    year,
    minRating,
    type = "all",
    sortBy = "popularity",
  } = queryParams;

  const offset = (Number(page) - 1) * Number(limit);

  const allowedSort = ["popularity", "vote_average", "release_date"];
  const sortColumn = allowedSort.includes(sortBy) ? sortBy : "popularity";

  let baseQuery = "";

  if (type === "movie") {
    baseQuery = `
      SELECT
        id,
        title,
        poster_path,
        release_date,
        vote_average::float,
        popularity,
        vote_count,
        'movie' as media_type
      FROM movies
    `;
  } else if (type === "tv") {
    baseQuery = `
      SELECT
        id,
        title,
        poster_path,
        release_date,
        vote_average::float,
        popularity,
        vote_count,
        'tv' as media_type
      FROM tvshows
    `;
  } else {
    baseQuery = `
      SELECT
        id,
        title,
        poster_path,
        release_date,
        vote_average::float,
        popularity,
        vote_count,
        'movie' as media_type
      FROM movies

      UNION ALL

      SELECT
        id,
        title,
        poster_path,
        release_date,
        vote_average::float,
        popularity,
        vote_count,
        'tv' as media_type
      FROM tvshows
    `;
  }

  let query = `
    SELECT *
    FROM (${baseQuery}) media
    WHERE 1=1
  `;

  const values: any[] = [];
  let i = 1;

  if (year) {
    query += ` AND EXTRACT(YEAR FROM release_date) = $${i}`;
    values.push(year);
    i++;
  }

  if (minRating) {
    query += ` AND vote_average >= $${i}`;
    values.push(minRating);
    i++;
  }

  query += ` ORDER BY ${sortColumn} DESC`;
  query += ` LIMIT $${i} OFFSET $${i + 1}`;

  values.push(limit, offset);

  return pool.query(query, values);
};
