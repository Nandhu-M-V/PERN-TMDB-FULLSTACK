import { Request, Response } from "express";
import { pool } from "../config/db.js";

export const updateMovie = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, overview, tagline, vote_average, release_date } = req.body;

  try {
    const result = await pool.query(
      `UPDATE movies
       SET title = $1, overview = $2, tagline = $3, vote_average = $4, release_date = $5
       WHERE id = $6
       RETURNING *`,
      [title, overview, tagline, vote_average, release_date, id],
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Movie not found" });

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
