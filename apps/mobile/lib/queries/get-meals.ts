import type { GetMeals } from "@jumo-monorepo/interfaces/src/api/meals.js";
import type { Meal } from "@jumo-monorepo/interfaces/src/domain/meals.js";

import { apiClient } from "../api";

type GetMealsQuery = GetMeals["query"];

interface GetMealsOptionsWithGroupBy extends GetMealsQuery {
  groupBy: "day";
}

interface GetMealsOptionsWithoutGroupBy extends GetMealsQuery {
  groupBy?: never;
}

export async function getMeals(
  options: GetMealsOptionsWithGroupBy
): Promise<Record<string, Meal[]>>;
export async function getMeals(
  options?: GetMealsOptionsWithoutGroupBy
): Promise<Meal[]>;
export async function getMeals(
  options?: GetMealsQuery
): Promise<Meal[] | Record<string, Meal[]>> {
  const params = new URLSearchParams();

  if (options?.groupBy) params.append("groupBy", options.groupBy);
  if (options?.timezone) params.append("timezone", options.timezone);
  if (options?.includeDeleted) params.append("includeDeleted", options.includeDeleted);
  if (options?.limit) params.append("limit", options.limit);
  if (options?.offset) params.append("offset", options.offset);

  const queryString = params.toString();
  const endpoint = `/meals${queryString ? `?${queryString}` : ""}`;

  const response = await apiClient<{
    success: boolean;
    data: Meal[] | Record<string, Meal[]>;
  }>(endpoint);

  return response.data;
}
