import { z } from "zod";

export const createMovieSchema = z.object({
  body: z.object({
    tmdb_id: z.number(),
    title: z.string().min(1),
    overview: z.string().optional(),
    poster_path: z.string().optional(),
    backdrop_path: z.string().optional(),
    release_date: z.string().optional(),
    vote_average: z.number().optional(),
  }),
});
