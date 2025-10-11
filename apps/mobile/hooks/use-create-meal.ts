import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { CreateMeal, Meal } from "@jumo-monorepo/interfaces";

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
