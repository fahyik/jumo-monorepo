import { sql } from "../../db/index.js";
import type { Meal } from "@jumo-monorepo/interfaces";

export async function getMealById(
  mealId: string,
  userId: string
): Promise<Meal | null> {
  const meals = await sql<Meal[]>`
    WITH meal_items_with_nutrients AS (
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
        jsonb_build_object(
          'id', pf.id,
          'provider', pf.provider,
          'providerId', pf.provider_id,
          'foodData', pf.data,
          'createdAt', pf.created_at,
          'updatedAt', pf.updated_at
        ) as "providerFood",
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
      WHERE mi.deleted_at IS NULL
      GROUP BY mi.id, pf.id
    ),
    meal_with_items AS (
      SELECT
        m.id,
        m.user_id as "userId",
        m.name,
        m.notes,
        m.consumed_at as "consumedAt",
        m.deleted_at as "deletedAt",
        m.created_at as "createdAt",
        m.updated_at as "updatedAt",
        COALESCE(
          jsonb_agg(
            jsonb_build_object(
              'id', mi.id,
              'userId', mi."userId",
              'mealId', mi."mealId",
              'providerFoodId', mi."providerFoodId",
              'providerFood', mi."providerFood",
              'quantity', mi.quantity,
              'unit', mi.unit,
              'nutrients', mi.nutrients,
              'deletedAt', mi."deletedAt",
              'createdAt', mi."createdAt",
              'updatedAt', mi."updatedAt"
            )
          ) FILTER (WHERE mi.id IS NOT NULL),
          '[]'::jsonb
        ) as items
      FROM jumo.meals m
      LEFT JOIN meal_items_with_nutrients mi ON m.id = mi."mealId"
      WHERE m.id = ${mealId} AND m.user_id = ${userId}
      GROUP BY m.id
    )
    SELECT
      id,
      "userId",
      name,
      notes,
      "consumedAt",
      "deletedAt",
      "createdAt",
      "updatedAt",
      items,
      (
        SELECT COALESCE(
          jsonb_agg(
            jsonb_build_object(
              'nutrient', n_agg.nutrient,
              'amount', n_agg.total_amount
            )
          ),
          '[]'::jsonb
        )
        FROM (
          SELECT
            (n_data->>'nutrient')::jsonb as nutrient,
            SUM((n_data->>'amount')::numeric) as total_amount
          FROM meal_with_items mwi,
               jsonb_array_elements(mwi.items) as item_data,
               jsonb_array_elements(item_data->'nutrients') as n_data
          WHERE mwi.id = meal_with_items.id
          GROUP BY n_data->>'nutrient'
        ) n_agg
      ) as nutrients
    FROM meal_with_items
  `;

  return meals.length > 0 ? meals[0] : null;
}
