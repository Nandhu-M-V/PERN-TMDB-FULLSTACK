import { z } from 'zod';

export const mediaSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  overview: z.string().min(10, 'Overview must be at least 10 characters'),
  poster_path: z.string().url('Poster must be a valid URL'),
  release_date: z.string(),
  runtime: z.number().min(1, 'Runtime must be greater than 0'),
  language: z.string().min(2, 'Language required'),
});

export type MediaFormData = z.infer<typeof mediaSchema>;
