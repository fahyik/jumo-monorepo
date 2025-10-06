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
    SELECT
      id,
      user_id as "userId",
      name,
      notes,
      consumed_at as "consumedAt",
      deleted_at as "deletedAt",
      created_at as "createdAt",
      updated_at as "updatedAt"
    FROM jumo.meals
    WHERE user_id = ${userId}
    ${includeDeleted ? sql`` : sql`AND deleted_at IS NULL`}
    ORDER BY consumed_at DESC
    LIMIT ${limit}
    OFFSET ${offset}
  `;

  return meals;
}
