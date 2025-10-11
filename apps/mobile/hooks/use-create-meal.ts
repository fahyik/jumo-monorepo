import { useMutation, useQueryClient } from "@tanstack/react-query";

import { CreateMeal } from "@jumo-monorepo/interfaces";
import type { Meal } from "@jumo-monorepo/interfaces/src/domain/meals.js";

import { apiClient } from "@/lib/api";

export function useCreateMeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateMeal["body"]) => {
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
