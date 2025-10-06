import { sql } from "../../db/index.js";
import type { MealItem } from "@jumo-monorepo/interfaces";
import { getMealItemById } from "./get-meal-item-by-id.js";

export interface UpdateMealItemInput {
  mealItemId: string;
  userId: string;
  quantity?: number;
  unit?: string;
  nutrients?: Array<{ nutrientId: string; amount: number }>;
}

export async function updateMealItem(input: UpdateMealItemInput): Promise<MealItem | null> {
  const updates = [];

  if (input.quantity !== undefined) {
    updates.push(sql`quantity = ${input.quantity}`);
  }
  if (input.unit !== undefined) {
    updates.push(sql`unit = ${input.unit}`);
  }

  if (updates.length > 0) {
    await sql`
      UPDATE jumo.meal_items
      SET ${sql.join(updates, sql`, `)}
      WHERE id = ${input.mealItemId} AND user_id = ${input.userId}
    `;
  }

  if (input.nutrients !== undefined) {
    await sql`
      DELETE FROM jumo.meal_items_nutrients
      WHERE meal_item_id = ${input.mealItemId}
    `;

    if (input.nutrients.length > 0) {
      await sql`
        INSERT INTO jumo.meal_items_nutrients (meal_item_id, nutrient_id, amount)
        VALUES ${sql(input.nutrients.map(n => [input.mealItemId, n.nutrientId, n.amount]))}
      `;
    }
  }

  return getMealItemById(input.mealItemId, input.userId);
}
