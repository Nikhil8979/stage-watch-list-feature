import { z } from "zod";
import { ContentType } from "../generated/prisma/enums";

export const AddItemToWatchListSchema = z
  .object({
    contentId: z.string(),
  })
  .strict();

export const watchListSchema = z.object({
  limit: z
    .string()
    .default("10")
    .transform((val) => (val ? parseInt(val, 10) : undefined))
    .refine(
      (v) => v === undefined || (Number.isInteger(v) && v > 0 && v <= 100),
      {
        message: "limit must be an integer between 1 and 100",
      }
    ),
  cursor: z.string().optional(),
});

export const RemoveItemFromWatchListSchema = z
  .object({
    contentId: z.string(),
  })
  .strict();

export type WatchListSchema = z.infer<typeof watchListSchema>;
