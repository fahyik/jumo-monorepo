import { sql } from "../../db/index.js";

import type {
  CreateMeal,
  Meal,
  MealItem,
  ProviderFood,
} from "@jumo-monorepo/interfaces";

type CreateMealInput = {
  userId: string;
} & CreateMeal["body"];

export async function createMeal(
  input: CreateMealInput
): Promise<Meal & { items: MealItem[] }> {
  return await sql.begin(async (sql) => {
    const [meal] = await sql<Meal[]>`
      INSERT INTO jumo.meals (user_id, name, notes, consumed_at)
      VALUES (${input.userId}, ${input.name ?? null}, ${input.notes ?? null}, ${input.consumedAt})
      RETURNING
        id,
        user_id as "userId",
        name,
        notes,
        consumed_at as "consumedAt",
        deleted_at as "deletedAt",
        created_at as "createdAt",
        updated_at as "updatedAt"
    `;

    const items: MealItem[] = [];

    if (input.items && input.items.length > 0) {
      for (const item of input.items) {
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
          WHERE id = ${item.providerFoodId}
        `;

        if (!providerFood) {
          throw new Error(`Provider food not found: ${item.providerFoodId}`);
        }

        const [mealItem] = await sql<MealItem[]>`
          INSERT INTO jumo.meal_items (user_id, meal_id, provider_food_id, quantity, unit)
          VALUES (${input.userId}, ${meal.id}, ${item.providerFoodId}, ${item.quantity}, ${item.unit})
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
        const multiplier = item.quantity / 100;
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

        items.push({ ...mealItem, nutrients: [] });
      }
    }

    return { ...meal, items };
  });
}
