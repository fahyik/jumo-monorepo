import { sql } from "../../db/index.js";
import { getMealItemById } from "./get-meal-item-by-id.js";

import type { MealItem, UpdateMealItem, ProviderFood } from "@jumo-monorepo/interfaces";

type UpdateMealItemInput = {
  mealItemId: string;
  userId: string;
} & UpdateMealItem["body"];

export async function updateMealItem(
  input: UpdateMealItemInput
): Promise<MealItem | null> {
  const updates: Record<string, unknown> = {};

  if (input.quantity !== undefined) {
    updates.quantity = input.quantity;
  }
  if (input.unit !== undefined) {
    updates.unit = input.unit;
  }

  if (Object.keys(updates).length > 0) {
    await sql`
      UPDATE jumo.meal_items
      SET ${sql(updates)}
      WHERE id = ${input.mealItemId} AND user_id = ${input.userId}
    `;
  }

  // Recalculate nutrients if quantity changed
  if (input.quantity !== undefined) {
    // Get meal item to fetch provider food id
    const [mealItem] = await sql<{ providerFoodId: string; quantity: number }[]>`
      SELECT provider_food_id as "providerFoodId", quantity
      FROM jumo.meal_items
      WHERE id = ${input.mealItemId} AND user_id = ${input.userId}
    `;

    if (mealItem) {
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
        WHERE id = ${mealItem.providerFoodId}
      `;

      if (providerFood) {
        // Delete existing nutrients
        await sql`
          DELETE FROM jumo.meal_items_nutrients
          WHERE meal_item_id = ${input.mealItemId}
        `;

        // Calculate nutrients based on new quantity
        const multiplier = mealItem.quantity / 100;
        const nutrients = providerFood.foodData.nutrients.map((nutrient) => ({
          nutrientId: nutrient.id,
          amount: nutrient.amount * multiplier,
        }));

        if (nutrients.length > 0) {
          await sql`
            INSERT INTO jumo.meal_items_nutrients (meal_item_id, nutrient_id, amount)
            VALUES ${sql(nutrients.map((n) => [input.mealItemId, n.nutrientId, n.amount]))}
          `;
        }
      }
    }
  }

  return getMealItemById(input.mealItemId, input.userId);
}
