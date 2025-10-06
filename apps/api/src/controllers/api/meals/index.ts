import { Router } from "express";

import { createMeal } from "./create-meal.js";
import { deleteMeal } from "./delete-meal.js";
import { getMealById } from "./get-meal-by-id.js";
import { getMeals } from "./get-meals.js";
import { updateMeal } from "./update-meal.js";
import { mealItemsRouter } from "./items/index.js";

export function mealsRouter() {
  const router = Router();

  router.post("/", createMeal);
  router.get("/", getMeals);
  router.get("/:id", getMealById);
  router.patch("/:id", updateMeal);
  router.delete("/:id", deleteMeal);

  router.use("/:mealId/items", mealItemsRouter());

  return router;
}
