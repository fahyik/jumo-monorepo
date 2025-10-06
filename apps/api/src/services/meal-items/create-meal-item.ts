import { sql } from "../../db/index.js";
import type { MealItem } from "@jumo-monorepo/interfaces";

export interface CreateMealItemInput {
  userId: string;
  mealId: string;
  providerFoodId: string;
  quantity: number;
  unit: string;
  nutrients: Array<{ nutrientId: string; amount: number }>;
}

export async function createMealItem(input: CreateMealItemInput): Promise<MealItem> {
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

  if (input.nutrients.length > 0) {
    await sql`
      INSERT INTO jumo.meal_items_nutrients (meal_item_id, nutrient_id, amount)
      VALUES ${sql(input.nutrients.map(n => [mealItem.id, n.nutrientId, n.amount]))}
    `;
  }

  return mealItem;
}
