import { Router } from "express";
import { syncMovies } from "../controllers/movies.controller.js";
import { validate } from "../middleware/validate.js";
import { createMovieSchema } from "../validators/movie.schema.js";
import { pool } from "../config/db.js";

const router = Router();

router.post("/sync", syncMovies);

// Example: Create movie manually with validation
router.post("/", validate(createMovieSchema), async (req, res) => {
  res.json({ message: "Movie validated", data: req.body });
});

router.get("/", async (req, res) => {
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
    res.status(500).json({ error: "Failed to fetch movies" });
  }
});

export default router;
