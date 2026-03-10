import { z } from "zod";

export const newMediaSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),

  overview: z
    .string()
    .trim()
    .min(10, "Overview must be at least 10 characters"),

  release_date: z.string().min(1, "Release date is required"),

  runtime: z.number().min(1, "Runtime must be greater than 0"),
});

export type MediaInput = z.infer<typeof newMediaSchema>;
