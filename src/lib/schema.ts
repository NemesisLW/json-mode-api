import { z } from "zod";

export const inputDataSchema = z.object({
  data: z.string(),
  format: z.object({}).passthrough(),
});
