import { Request, Response } from "express";
import { fetchPopularMovies } from "../services/movies.service.js";

export const syncMovies = async (req: Request, res: Response) => {
  try {
    const count = await fetchPopularMovies();
    res.json({ message: `${count} movies synced from TMDB!` });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
