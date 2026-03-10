import { Router } from "express";
import { syncMedia } from "../controllers/mediaSync.controller.js";
import { validate } from "../middleware/validate.js";
import { createMediaSchema } from "../validators/media.schema.js";
import { getMovies } from "../controllers/getMovies.controller.js";
import { getTvShows } from "../controllers/getTvShows.controller.js";
import { getMediaById } from "../controllers/getMediaByID.controller.js";
import { updateMovie } from "../controllers/updateMovie.controller.js";
import { updateTvShow } from "../controllers/updateTvShows.controller.js";
import { upload } from "../middleware/upload.js";
import { createMedia } from "../controllers/createMedia.controller.js";

const router = Router();

// Sync media
router.post("/sync/:type", syncMedia);

// Create media (with poster upload)
router.post(
  "/media/:type",
  upload.single("poster"),
  // validate(createMediaSchema),
  createMedia,
);

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
