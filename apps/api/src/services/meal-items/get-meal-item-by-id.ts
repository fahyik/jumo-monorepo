import { sql } from "../../db/index.js";
import type { MealItem } from "@jumo-monorepo/interfaces";

export async function getMealItemById(
  mealItemId: string,
  userId: string
): Promise<MealItem | null> {
  const rows = await sql<MealItem[]>`
    SELECT
      mi.id,
      mi.user_id as "userId",
      mi.meal_id as "mealId",
      mi.provider_food_id as "providerFoodId",
      jsonb_build_object(
        'id', pf.id,
        'provider', pf.provider,
        'providerId', pf.provider_id,
        'rawData', pf.raw_data,
        'foodData', pf.data,
        'createdAt', pf.created_at,
        'updatedAt', pf.updated_at
      ) as "providerFood",
      mi.quantity,
      mi.unit,
      mi.deleted_at as "deletedAt",
      mi.created_at as "createdAt",
      mi.updated_at as "updatedAt",
      COALESCE(
        jsonb_agg(
          jsonb_build_object(
            'nutrient', jsonb_build_object(
              'id', n.id,
              'name', n.name,
              'unit', n.unit,
              'translationKey', n.translation_key,
              'parentId', n.parent_id,
              'createdAt', n.created_at,
              'updatedAt', n.updated_at
            ),
            'amount', min.amount
          )
        ) FILTER (WHERE n.id IS NOT NULL),
        '[]'::jsonb
      ) as nutrients
    FROM jumo.meal_items mi
    LEFT JOIN jumo.provider_foods pf ON mi.provider_food_id = pf.id
    LEFT JOIN jumo.meal_items_nutrients min ON mi.id = min.meal_item_id
    LEFT JOIN jumo.nutrients n ON min.nutrient_id = n.id
    WHERE mi.id = ${mealItemId} AND mi.user_id = ${userId}
    GROUP BY mi.id, pf.id
  `;

  return rows.length > 0 ? rows[0] : null;
}
