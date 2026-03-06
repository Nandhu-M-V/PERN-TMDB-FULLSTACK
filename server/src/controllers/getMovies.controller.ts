import { Request, Response } from "express";
import { pool } from "../config/db.js";

export const getMovies = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 20;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      "SELECT * FROM movies ORDER BY release_date DESC LIMIT $1 OFFSET $2",
      [limit, offset],
    );

    res.json({
      page,
      results: result.rows.map((show) => ({
        ...show,
        vote_average: Number(show.vote_average),
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch TV shows" });
  }
};
