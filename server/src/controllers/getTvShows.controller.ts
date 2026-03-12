import { Request, Response } from "express";
import { pool } from "../config/db.js";

export const getTvShows = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 30;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      "SELECT * FROM tvshows ORDER BY updated_at DESC LIMIT $1 OFFSET $2",
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
