import { z } from "zod";

// Food schemas
export const getFoodsQuerySchema = z.object({
  type: z.literal(["branded", "generic"]),
  search: z.string(),
});

export type GetFoodsQuery = z.infer<typeof getFoodsQuerySchema>;
