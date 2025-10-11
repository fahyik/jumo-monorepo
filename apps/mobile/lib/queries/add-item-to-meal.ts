import { apiClient } from "../api";

import { CreateMealItem } from "@jumo-monorepo/interfaces";

export async function addItemToMeal(params: {
  mealId: string;
  providerFoodId: string;
  quantity: number;
  unit: string;
}) {
  return apiClient<CreateMealItem["response"]>(
    `/meals/${params.mealId}/items`,
    {
      method: "POST",
      body: JSON.stringify({
        providerFoodId: params.providerFoodId,
        quantity: params.quantity,
        unit: params.unit,
      }),
    }
  );
}
