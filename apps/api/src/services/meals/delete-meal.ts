import { sql } from "../../db/index.js";

export async function deleteMeal(mealId: string, userId: string): Promise<boolean> {
  const result = await sql`
    UPDATE jumo.meals
    SET deleted_at = NOW()
    WHERE id = ${mealId} AND user_id = ${userId} AND deleted_at IS NULL
  `;

  return result.count > 0;
}
