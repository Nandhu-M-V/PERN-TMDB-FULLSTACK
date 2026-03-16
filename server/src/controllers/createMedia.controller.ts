import { Request, Response } from "express";
import { createMediaService } from "../services/create.service.js";
import { logger } from "../utils/logger.js";

export const createMedia = async (req: Request, res: Response) => {
  try {
    const mediaType = req.params.type;

    if (mediaType !== "movies" && mediaType !== "tvshows") {
      return res.status(400).json({ message: "Invalid media type" });
    }

    const poster_path = req.file ? `/uploads/${req.file.filename}` : null;

    const media = await createMediaService(mediaType, req.body, poster_path);

    res.status(201).json(media);

    logger.info(`New ${mediaType} added: ${media.title}`);
  } catch (error) {
    console.error(error);
    logger.error(error);
    res.status(500).json({ message: "Failed to create media" });
  }
};
