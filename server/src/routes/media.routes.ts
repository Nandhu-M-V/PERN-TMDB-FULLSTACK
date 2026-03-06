import { Router } from "express";
import { syncMedia } from "../controllers/mediaSync.controller.js";
import { validate } from "../middleware/validate.js";
import { createMediaSchema } from "../validators/media.schema.js";
import { getMovies } from "../controllers/getMovies.controller.js";
import { getTvShows } from "../controllers/getTvShows.controller.js";
import { getMediaById } from "../controllers/getMediaByID.controller.js";
import { pool } from "../config/db.js";
import { updateMovie } from "../controllers/updateMovie.controller.js";
import { updateTvShow } from "../controllers/updateTvShows.controller.js";

const router = Router();

// updating media
router.post("/sync/:type", syncMedia);

// Zod Validate creation
router.post("/", validate(createMediaSchema), async (req, res) => {
  res.json({ message: "Movie validated", data: req.body });
});

// Fetch Movies
router.get("/movies", getMovies);

// Fetch TV Shows
router.get("/tvshows", getTvShows);

// Fetch media by ID
router.get("/movie/:id", getMediaById);
router.get("/tvshow/:id", getMediaById);

// Update movie
router.put("/movie/:id", updateMovie);

// Update TV Show
router.put("/tvshow/:id", updateTvShow);

export default router;
