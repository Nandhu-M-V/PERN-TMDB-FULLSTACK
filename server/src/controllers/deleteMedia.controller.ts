import { Request, Response } from "express";
import { pool } from "../config/db.js";
import { logger } from "../utils/logger.js";

export const deleteMedia = async (req: Request, res: Response) => {
  try {
    const { type, id } = req.params;

    if (!type || !id) {
      return res.status(400).json({ message: "Type and ID are required" });
    }

    let table = "";

    if (type === "movie") {
      table = "movies";
    } else if (type === "tv") {
      table = "tvshows";
    } else {
      return res.status(400).json({ message: "Invalid media type" });
    }

    const result = await pool.query(
      `DELETE FROM ${table} WHERE id = $1 RETURNING *`,
      [id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Media not found" });
    }

    res.json({
      message: `${type} deleted successfully`,
      media: result.rows[0],
    });
    logger.info(`${type} was deleted Successfully`);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
    logger.error(error);
  }
};
