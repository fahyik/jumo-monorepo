import { z } from "zod";

import type { Meal, MealItem } from "../domain/meals.js";
import type { ApiEndpoint } from "./api-endpoint.js";

// Meal schemas
export const updateMealSchema = z.object({
  name: z.string().optional(),
  notes: z.string().optional(),
  consumedAt: z.iso.datetime().optional(),
});

export const getMealsQuerySchema = z.object({
  includeDeleted: z.enum(["true", "false"]).optional(),
  limit: z.string().optional(),
  offset: z.string().optional(),
  groupBy: z.enum(["day"]).optional(),
  timezone: z.string().optional(),
});

export const createMealItemSchema = z.object({
  providerFoodId: z.string(),
  quantity: z.number().positive(),
  unit: z.string(),
});

export const updateMealItemSchema = z.object({
  quantity: z.number().positive().optional(),
  unit: z.string().optional(),
});

export const createMealSchema = z.object({
  name: z.string().optional(),
  notes: z.string().optional(),
  consumedAt: z.iso.datetime(),
  items: z.array(createMealItemSchema).nonempty(),
});

// API endpoint types
export type CreateMeal = ApiEndpoint<
  z.infer<typeof createMealSchema>,
  never,
  never,
  Meal
>;

export type UpdateMeal = ApiEndpoint<
  z.infer<typeof updateMealSchema>,
  never,
  { id: string },
  Meal
>;

export type GetMeal = ApiEndpoint<never, never, { id: string }, Meal>;

export type GetMeals = ApiEndpoint<
  never,
  z.infer<typeof getMealsQuerySchema>,
  never,
  Meal[]
>;

export type DeleteMeal = ApiEndpoint<never, never, { id: string }, void>;

export type CreateMealItem = ApiEndpoint<
  z.infer<typeof createMealItemSchema>,
  never,
  { mealId: string },
  MealItem
>;

export type UpdateMealItem = ApiEndpoint<
  z.infer<typeof updateMealItemSchema>,
  never,
  { mealId: string; id: string },
  MealItem
>;

export type DeleteMealItem = ApiEndpoint<
  never,
  never,
  { mealId: string; id: string },
  void
>;
