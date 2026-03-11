import { Request, Response } from "express";
import { pool } from "../config/db.js";
import { logger } from "../utils/logger.js";

export const updateTvShow = async (req: Request, res: Response) => {
  const tvId = Number(req.params.id);
  const { title, overview, vote_average, release_date } = req.body;

  try {
    const result = await pool.query(
      `UPDATE tvshows
       SET title=$1, overview=$2, vote_average=$3, release_date=$4
       WHERE id=$5
       RETURNING *`,
      [title, overview, vote_average, release_date, tvId],
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "TV Show not found" });

    res.json(result.rows[0]);
    logger.info(`movie with id:${tvId} has been edited`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
    logger.error(err);
  }
};
