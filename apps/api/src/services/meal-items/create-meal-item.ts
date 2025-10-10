import { sql } from "../../db/index.js";

import type { CreateMealItem, MealItem, ProviderFood } from "@jumo-monorepo/interfaces";

type CreateMealItemInput = {
  userId: string;
} & CreateMealItem["body"] &
  CreateMealItem["params"];

export async function createMealItem(
  input: CreateMealItemInput
): Promise<MealItem> {
  // Fetch provider food data
  const [providerFood] = await sql<ProviderFood[]>`
    SELECT
      id,
      provider,
      provider_id as "providerId",
      data as "foodData",
      created_at as "createdAt",
      updated_at as "updatedAt"
    FROM jumo.provider_foods
    WHERE id = ${input.providerFoodId}
  `;

  if (!providerFood) {
    throw new Error(`Provider food not found: ${input.providerFoodId}`);
  }

  const [mealItem] = await sql<MealItem[]>`
    INSERT INTO jumo.meal_items (user_id, meal_id, provider_food_id, quantity, unit)
    VALUES (${input.userId}, ${input.mealId}, ${input.providerFoodId}, ${input.quantity}, ${input.unit})
    RETURNING
      id,
      user_id as "userId",
      meal_id as "mealId",
      provider_food_id as "providerFoodId",
      quantity,
      unit,
      deleted_at as "deletedAt",
      created_at as "createdAt",
      updated_at as "updatedAt"
  `;

  // Calculate nutrients based on quantity
  // Provider food nutrients are per 100g, so we need to scale them
  const multiplier = input.quantity / 100;
  const nutrients = providerFood.foodData.nutrients.map((nutrient) => ({
    nutrientId: nutrient.id,
    amount: nutrient.amount * multiplier,
  }));

  if (nutrients.length > 0) {
    await sql`
      INSERT INTO jumo.meal_items_nutrients (meal_item_id, nutrient_id, amount)
      VALUES ${sql(nutrients.map((n) => [mealItem.id, n.nutrientId, n.amount]))}
    `;
  }

  return mealItem;
}
