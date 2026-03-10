import { Request, Response } from "express";
import { pool } from "../config/db.js";

// interface CreateMediaBody {
//   title: string;
//   overview: string;
//   release_date: string;
//   runtime: number;
//   language: string;
// }

export const createMedia = async (req: Request, res: Response) => {
  try {
    const { title, overview, release_date, runtime } = req.body;

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
      (title, overview, poster_path, release_date, runtime)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *
      `,
      [title, overview, poster_path, release_date, runtime],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create media" });
  }
};
