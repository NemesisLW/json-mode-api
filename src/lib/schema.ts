import { z } from "zod";

const inputDataSchema = z.object({
  data: z.string(),
  format: z.object({}).passthrough(),
});
