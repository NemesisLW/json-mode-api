import { z } from "zod";
const JSONSchemaTypeSchema: z.ZodType<JSONSchemaType> = z.lazy(() =>
  z.union([
    z.object({
      type: z.literal("string"),
      minLength: z.number().optional(),
      maxLength: z.number().optional(),
      pattern: z.string().optional(),
    }),
    z.object({
      type: z.literal("number"),
      minimum: z.number().optional(),
      maximum: z.number().optional(),
    }),
    z.object({
      type: z.literal("boolean"),
    }),
    z.object({
      type: z.literal("array"),
      items: JSONSchemaTypeSchema,
      minItems: z.number().optional(),
      maxItems: z.number().optional(),
    }),
    z.object({
      type: z.literal("object"),
      properties: z.record(JSONSchemaTypeSchema),
      required: z.array(z.string()).optional(),
    }),
  ])
);

export const FormatSchema = z.record(JSONSchemaTypeSchema);

export const inputDataSchema = z.object({
  data: z.string(),
  format: z.object({}).passthrough(),
  // format: FormatSchema,
});
