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
    const { title, overview, release_date, runtime, language } = req.body;

    const poster_path = req.file ? `/uploads/${req.file.filename}` : null;

    const result = await pool.query(
      `
      INSERT INTO media 
      (title, overview, poster_path, release_date, runtime, language)
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *
      `,
      [title, overview, poster_path, release_date, runtime, language],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create media" });
  }
};
