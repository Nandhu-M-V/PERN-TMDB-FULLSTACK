import { z } from 'zod';

export const mediaSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),

  overview: z
    .string()
    .trim()
    .min(10, 'Overview must be at least 10 characters'),

  poster: z
    .instanceof(FileList)
    .refine((files) => files.length === 1, 'Poster is required'),

  release_date: z.string().min(1, 'Release date is required'),

  runtime: z.number().min(1, 'Runtime must be greater than 0'),
  type: z.enum(['movies', 'tvshows']),
});

export type MediaFormData = z.infer<typeof mediaSchema>;
