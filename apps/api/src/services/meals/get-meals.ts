import { sql } from "../../db/index.js";
import type { Meal } from "@jumo-monorepo/interfaces";

export interface GetMealsInput {
  userId: string;
  includeDeleted?: boolean;
  limit?: number;
  offset?: number;
}

export async function getMeals(input: GetMealsInput): Promise<Meal[]> {
  const { userId, includeDeleted = false, limit = 50, offset = 0 } = input;

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
      LEFT JOIN jumo.meal_items_nutrients min ON mi.id = min.meal_item_id
      LEFT JOIN jumo.nutrients n ON min.nutrient_id = n.id
      ${includeDeleted ? sql`` : sql`WHERE mi.deleted_at IS NULL`}
      GROUP BY mi.id, mi.user_id, mi.meal_id, mi.provider_food_id, mi.quantity, mi.unit, mi.deleted_at, mi.created_at, mi.updated_at
    ),
    meals_with_items AS (
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
      WHERE m.user_id = ${userId}
      ${includeDeleted ? sql`` : sql`AND m.deleted_at IS NULL`}
      GROUP BY m.id, m.user_id, m.name, m.notes, m.consumed_at, m.deleted_at, m.created_at, m.updated_at
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
          FROM meals_with_items mwi,
               jsonb_array_elements(mwi.items) as item_data,
               jsonb_array_elements(item_data->'nutrients') as n_data
          WHERE mwi.id = meals_with_items.id
          GROUP BY n_data->>'nutrient'
        ) n_agg
      ) as nutrients
    FROM meals_with_items
    ORDER BY "consumedAt" DESC
    LIMIT ${limit}
    OFFSET ${offset}
  `;

  return meals;
}
