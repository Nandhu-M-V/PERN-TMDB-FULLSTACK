import { Request, Response } from "express";
import { pool } from "../config/db.js";
import { logger } from "../utils/logger.js";

export const getMediaById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const table = req.path.includes("/movie") ? "movies" : "tvshows";

    const result = await pool.query(`SELECT * FROM ${table} WHERE id = $1`, [
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Media not found" });
    }

    const media = {
      ...result.rows[0],
      vote_average: Number(result.rows[0].vote_average),
      popularity: Number(result.rows[0].popularity),
    };

    res.json(media);
    // logger.info(`fetched Media`);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch media" });
    logger.error(error);
  }
};
