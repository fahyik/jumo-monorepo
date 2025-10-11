import { sql } from "../../db/index.js";
import type { MealItem, Nutrient } from "@jumo-monorepo/interfaces";

export interface GetMealItemsInput {
  mealId: string;
  userId: string;
  includeDeleted?: boolean;
}

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

export async function getMealItems(input: GetMealItemsInput): Promise<MealItem[]> {
  const { mealId, userId, includeDeleted = false } = input;

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
    WHERE mi.meal_id = ${mealId} AND mi.user_id = ${userId}
    ${includeDeleted ? sql`` : sql`AND mi.deleted_at IS NULL`}
    ORDER BY mi.created_at ASC
  `;

  const itemsMap = new Map<string, MealItem>();

  for (const row of rows) {
    if (!itemsMap.has(row.id)) {
      itemsMap.set(row.id, {
        id: row.id,
        userId: row.userId,
        mealId: row.mealId,
        providerFoodId: row.providerFoodId,
        quantity: row.quantity,
        unit: row.unit,
        nutrients: [],
        deletedAt: row.deletedAt ?? undefined,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      });
    }

    if (row.nutrientId && row.nutrientAmount !== null) {
      const item = itemsMap.get(row.id)!;
      item.nutrients.push({
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

  return Array.from(itemsMap.values());
}
