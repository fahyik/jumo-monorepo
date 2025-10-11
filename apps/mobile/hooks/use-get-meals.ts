import { useQuery } from "@tanstack/react-query";

import type { Meal } from "@jumo-monorepo/interfaces/src/domain/meals.js";

import { apiClient } from "@/lib/api";

interface GetMealsOptions {
  groupBy?: "day";
  timezone?: string;
  includeDeleted?: boolean;
  limit?: number;
  offset?: number;
}

type MealsResponse<T extends GetMealsOptions> = T["groupBy"] extends "day"
  ? Record<string, Meal[]>
  : Meal[];

export function useGetMeals<T extends GetMealsOptions = {}>(
  options?: T,
  enabled = true
) {
  const params = new URLSearchParams();

  if (options?.groupBy) params.append("groupBy", options.groupBy);
  if (options?.timezone) params.append("timezone", options.timezone);
  if (options?.includeDeleted)
    params.append("includeDeleted", String(options.includeDeleted));
  if (options?.limit) params.append("limit", String(options.limit));
  if (options?.offset) params.append("offset", String(options.offset));

  const queryString = params.toString();
  const endpoint = `/meals${queryString ? `?${queryString}` : ""}`;

  return useQuery({
    queryKey: ["meals", options],
    queryFn: async () => {
      const response = await apiClient<{
        success: boolean;
        data: MealsResponse<T>;
      }>(endpoint);
      return response.data;
    },
    enabled,
  });
}
