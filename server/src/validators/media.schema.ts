import { z } from "zod";

// Base schema for movies or TV shows
const baseMediaSchema = {
  tmdb_id: z.number().int().positive(),
  title: z.string().min(1),
  overview: z.string().optional(),
  poster_path: z.string().optional(),
  backdrop_path: z.string().optional(),
  release_date: z.string().optional(),
  runtime: z.number().int().optional(),
  popularity: z.number().optional(),
  vote_average: z.number().min(0).max(10).optional(),
  vote_count: z.number().int().optional(),
  adult: z.boolean().optional(),
  status: z.string().optional(),
  original_language: z.string().max(10).optional(),
};

export const createMediaSchema = z.object({
  body: z.object(baseMediaSchema),
});
