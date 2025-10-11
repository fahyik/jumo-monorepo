import { sql } from "../../db/index.js";

export async function deleteMealItem(mealItemId: string, userId: string): Promise<boolean> {
  const result = await sql`
    UPDATE jumo.meal_items
    SET deleted_at = NOW()
    WHERE id = ${mealItemId} AND user_id = ${userId} AND deleted_at IS NULL
  `;

  return result.count > 0;
}
