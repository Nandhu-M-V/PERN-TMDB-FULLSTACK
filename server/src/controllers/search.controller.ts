import { Request, Response } from "express";
import { searchMediaService } from "../services/search.service.ts";

export const searchMedia = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;

    if (!query || typeof query !== "string") {
      return res.json({ results: [] });
    }

    const results = await searchMediaService(query);

    res.json({ results });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Search failed" });
  }
};
