import { Router } from "express";

import { deleteMeal } from "./delete-meal.js";
import { getMealById } from "./get-meal-by-id.js";
import { getMeals } from "./get-meals.js";
import { mealItemsRouter } from "./items/index.js";
import { patchMeal } from "./patch-meal.js";
import { postMeal } from "./post-meal.js";

export function mealsRouter() {
  const router = Router();

  router.post("/", postMeal);
  router.get("/", getMeals);
  router.get("/:id", getMealById);
  router.patch("/:id", patchMeal);
  router.delete("/:id", deleteMeal);

  router.use("/:mealId/items", mealItemsRouter());

  return router;
}
