import { z } from "zod";

import type { ApiEndpoint } from "./api-endpoint.js";

// Food schemas
export const getFoodsQuerySchema = z.object({
  type: z.literal(["branded", "generic"]),
  search: z.string(),
});

// API endpoint types
export type GetFoods = ApiEndpoint<
  never,
  z.infer<typeof getFoodsQuerySchema>,
  never,
  unknown // OpenFoodFacts API response structure
>;

export type GetFoodByBarcode = ApiEndpoint<
  never,
  never,
  { barcode: string },
  unknown // OpenFoodFacts API response structure
>;
