import { Request, Response } from "express";
import { fetchPopularMedia } from "../services/media.service.js";

export const syncMedia = async (req: Request, res: Response) => {
  try {
    const { type } = req.params;

    if (type !== "movie" && type !== "tv") {
      return res.status(400).json({ error: "Invalid media type" });
    }
    let message = new Error();
    message = { ...message, message: "Custom Error", name: "token" };

    // throw message;
    const count = await fetchPopularMedia(type);
    res.json({ message: `${count} ${type}s synced from TMDB!` });
  } catch (error) {
    if (error) {
      res.status(500).json({ error });
    } else {
      res.status(500).json({ error: "Unknown error" });
    }
  }
};
