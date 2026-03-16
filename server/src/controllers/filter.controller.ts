import { Request, Response } from "express";
import { filterMediaService } from "../services/filter.service";

export const filterMedia = async (req: Request, res: Response) => {
  try {
    const result = await filterMediaService(req.query);

    res.json({
      results: result.rows,
      page: Number(req.query.page) || 1,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch media" });
  }
};
