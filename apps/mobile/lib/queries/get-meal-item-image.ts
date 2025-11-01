import { apiClient } from "../api";

import type { GetMealItemImage } from "@jumo-monorepo/interfaces";

export async function getMealItemImage(imagePath: string): Promise<string> {
  const response = await apiClient<GetMealItemImage["response"]>(
    `/meals/images/${imagePath}`
  );

  if (response.success) {
    return response.data.url;
  }

  throw new Error(response.reason || "Failed to fetch image");
}
