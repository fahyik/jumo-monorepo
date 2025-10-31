import { sql } from "../../db/index.js";
import { getMealById } from "./get-meal-by-id.js";

import type { Meal, MealItem } from "@jumo-monorepo/interfaces";

export interface UpdateMealInput {
  mealId: string;
  userId: string;
  name?: string;
  notes?: string;
  consumedAt?: string;
}

export async function updateMeal(
  input: UpdateMealInput
): Promise<(Meal & { items: MealItem[] }) | null> {
  const updates = [];

  if (input.name !== undefined) {
    updates.push(sql`name = ${input.name}`);
  }
  if (input.notes !== undefined) {
    updates.push(sql`notes = ${input.notes}`);
  }
  if (input.consumedAt !== undefined) {
    updates.push(sql`consumed_at = ${input.consumedAt}`);
  }

  if (updates.length === 0) {
    return getMealById(input.mealId, input.userId);
  }

  const updateClause = updates.reduce((acc, update, index) => {
    if (index === 0) {
      return update;
    }
    return sql`${acc}, ${update}`;
  });

  await sql`
    UPDATE jumo.meals
    SET ${updateClause}
    WHERE id = ${input.mealId} AND user_id = ${input.userId}
  `;

  return getMealById(input.mealId, input.userId);
}
