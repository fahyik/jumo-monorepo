import { sql } from "../../db/index.js";
import type { Meal, MealItem } from "@jumo-monorepo/interfaces";

interface MealWithItemsRow {
  id: string;
  userId: string;
  name: string | null;
  notes: string | null;
  consumedAt: Date;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  itemId: string | null;
  itemUserId: string | null;
  itemMealId: string | null;
  itemProviderFoodId: string | null;
  itemQuantity: number | null;
  itemUnit: string | null;
  itemDeletedAt: Date | null;
  itemCreatedAt: Date | null;
  itemUpdatedAt: Date | null;
  nutrientId: string | null;
  nutrientName: string | null;
  nutrientUnit: string | null;
  nutrientTranslationKey: string | null;
  nutrientCreatedAt: Date | null;
  nutrientUpdatedAt: Date | null;
  nutrientAmount: number | null;
}

export async function getMealById(
  mealId: string,
  userId: string
): Promise<(Meal & { items: MealItem[] }) | null> {
  const rows = await sql<MealWithItemsRow[]>`
    SELECT
      m.id,
      m.user_id as "userId",
      m.name,
      m.notes,
      m.consumed_at as "consumedAt",
      m.deleted_at as "deletedAt",
      m.created_at as "createdAt",
      m.updated_at as "updatedAt",
      mi.id as "itemId",
      mi.user_id as "itemUserId",
      mi.meal_id as "itemMealId",
      mi.provider_food_id as "itemProviderFoodId",
      mi.quantity as "itemQuantity",
      mi.unit as "itemUnit",
      mi.deleted_at as "itemDeletedAt",
      mi.created_at as "itemCreatedAt",
      mi.updated_at as "itemUpdatedAt",
      n.id as "nutrientId",
      n.name as "nutrientName",
      n.unit as "nutrientUnit",
      n.translation_key as "nutrientTranslationKey",
      n.created_at as "nutrientCreatedAt",
      n.updated_at as "nutrientUpdatedAt",
      min.amount as "nutrientAmount"
    FROM jumo.meals m
    LEFT JOIN jumo.meal_items mi ON m.id = mi.meal_id AND mi.deleted_at IS NULL
    LEFT JOIN jumo.meal_items_nutrients min ON mi.id = min.meal_item_id
    LEFT JOIN jumo.nutrients n ON min.nutrient_id = n.id
    WHERE m.id = ${mealId} AND m.user_id = ${userId}
  `;

  if (rows.length === 0) {
    return null;
  }

  const firstRow = rows[0];
  const meal: Meal & { items: MealItem[] } = {
    id: firstRow.id,
    userId: firstRow.userId,
    name: firstRow.name ?? undefined,
    notes: firstRow.notes ?? undefined,
    consumedAt: firstRow.consumedAt,
    deletedAt: firstRow.deletedAt ?? undefined,
    createdAt: firstRow.createdAt,
    updatedAt: firstRow.updatedAt,
    items: [],
  };

  const itemsMap = new Map<string, MealItem>();

  for (const row of rows) {
    if (row.itemId && !itemsMap.has(row.itemId)) {
      itemsMap.set(row.itemId, {
        id: row.itemId,
        userId: row.itemUserId!,
        mealId: row.itemMealId!,
        providerFoodId: row.itemProviderFoodId!,
        quantity: row.itemQuantity!,
        unit: row.itemUnit!,
        nutrients: [],
        deletedAt: row.itemDeletedAt ?? undefined,
        createdAt: row.itemCreatedAt!,
        updatedAt: row.itemUpdatedAt!,
      });
    }

    if (row.itemId && row.nutrientId && row.nutrientAmount !== null) {
      const item = itemsMap.get(row.itemId)!;
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

  meal.items = Array.from(itemsMap.values());

  return meal;
}
