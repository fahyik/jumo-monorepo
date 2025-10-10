import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { Meal } from "@jumo-monorepo/interfaces/src/domain/meals.js";

import { apiClient } from "@/lib/api";

interface CreateMealPayload {
  name?: string;
  notes?: string;
  consumedAt: Date;
  items?: {
    providerFoodId: string;
    quantity: number;
    unit: string;
    nutrients: {
      nutrientId: string;
      amount: number;
    }[];
  }[];
}

export function useCreateMeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateMealPayload) => {
      return apiClient<Meal>("/meals", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meals"] });
    },
  });
}
