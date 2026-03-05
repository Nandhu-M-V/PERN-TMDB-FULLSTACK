import { Router } from "express";
import { syncMedia } from "../controllers/media.controller.js";
import { validate } from "../middleware/validate.js";
import { createMediaSchema } from "../validators/media.schema.js";
import { pool } from "../config/db.js";

const router = Router();

// updating media
router.post("/sync/:type", syncMedia);

// Zod Validate creation
router.post("/", validate(createMediaSchema), async (req, res) => {
  res.json({ message: "Movie validated", data: req.body });
});

// Fetch Movies
router.get("/movies", async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 20;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      "SELECT * FROM movies ORDER BY release_date DESC LIMIT $1 OFFSET $2",
      [limit, offset],
    );

    res.json({
      page,
      results: result.rows.map((movie) => ({
        ...movie,
        vote_average: Number(movie.vote_average),
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch movies" });
  }
});

// Fetch TV Shows
router.get("/tvshows", async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 20;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      "SELECT * FROM tvshows ORDER BY release_date DESC LIMIT $1 OFFSET $2",
      [limit, offset],
    );

    res.json({
      page,
      results: result.rows.map((show) => ({
        ...show,
        vote_average: Number(show.vote_average),
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch TV shows" });
  }
});

export default router;
