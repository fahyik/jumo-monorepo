import { sql } from "../../db/index.js";
import type { MealItem } from "@jumo-monorepo/interfaces";

interface MealItemRow {
  id: string;
  userId: string;
  mealId: string;
  providerFoodId: string;
  quantity: number;
  unit: string;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  nutrientId: string | null;
  nutrientName: string | null;
  nutrientUnit: string | null;
  nutrientTranslationKey: string | null;
  nutrientAmount: number | null;
  nutrientCreatedAt: Date | null;
  nutrientUpdatedAt: Date | null;
}

export async function getMealItemById(
  mealItemId: string,
  userId: string
): Promise<MealItem | null> {
  const rows = await sql<MealItemRow[]>`
    SELECT
      mi.id,
      mi.user_id as "userId",
      mi.meal_id as "mealId",
      mi.provider_food_id as "providerFoodId",
      mi.quantity,
      mi.unit,
      mi.deleted_at as "deletedAt",
      mi.created_at as "createdAt",
      mi.updated_at as "updatedAt",
      n.id as "nutrientId",
      n.name as "nutrientName",
      n.unit as "nutrientUnit",
      n.translation_key as "nutrientTranslationKey",
      n.created_at as "nutrientCreatedAt",
      n.updated_at as "nutrientUpdatedAt",
      min.amount as "nutrientAmount"
    FROM jumo.meal_items mi
    LEFT JOIN jumo.meal_items_nutrients min ON mi.id = min.meal_item_id
    LEFT JOIN jumo.nutrients n ON min.nutrient_id = n.id
    WHERE mi.id = ${mealItemId} AND mi.user_id = ${userId}
  `;

  if (rows.length === 0) {
    return null;
  }

  const firstRow = rows[0];
  const mealItem: MealItem = {
    id: firstRow.id,
    userId: firstRow.userId,
    mealId: firstRow.mealId,
    providerFoodId: firstRow.providerFoodId,
    quantity: firstRow.quantity,
    unit: firstRow.unit,
    nutrients: [],
    deletedAt: firstRow.deletedAt ?? undefined,
    createdAt: firstRow.createdAt,
    updatedAt: firstRow.updatedAt,
  };

  for (const row of rows) {
    if (row.nutrientId && row.nutrientAmount !== null) {
      mealItem.nutrients.push({
        nutrient: {
          id: row.nutrientId,
          name: row.nutrientName!,
          unit: row.nutrientUnit!,
          translationKey: row.nutrientTranslationKey ?? undefined,
          createdAt: row.nutrientCreatedAt!,
          updatedAt: row.nutrientUpdatedAt!,
        },
        amount: row.nutrientAmount,
      });
    }
  }

  return mealItem;
}
