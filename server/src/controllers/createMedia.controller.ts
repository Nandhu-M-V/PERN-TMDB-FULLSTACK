import { Request, Response } from "express";
import { pool } from "../config/db.js";
import { logger } from "../utils/logger.js";

export const createMedia = async (req: Request, res: Response) => {
  try {
    const { title, overview, release_date, runtime, tagline, rating } =
      req.body;

    const mediaType = req.params.type;

    if (mediaType !== "movies" && mediaType !== "tvshows") {
      return res.status(400).json({ message: "Invalid media type" });
    }

    const poster_path = req.file ? `/uploads/${req.file.filename}` : null;

    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const result = await pool.query(
      `
      INSERT INTO ${mediaType}
      (title, overview, tagline, vote_average, poster_path,backdrop_path, release_date, runtime)
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

    res.status(201).json(result.rows[0]);
    console.log(result.rows[0]);

    logger.info(`New ${mediaType} added: ${title}`);
  } catch (error) {
    console.error(error);
    logger.error(error);
    res.status(500).json({ message: "Failed to create media" });
  }
};
