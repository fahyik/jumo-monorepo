import { NextFunction, Response } from "express";
import { updateMealSchema } from "@jumo-monorepo/interfaces";

import { AuthenticatedRequest } from "../../../middleware/interfaces.js";
import { updateMeal as updateMealService } from "../../../services/meals/update-meal.js";

export async function patchMeal(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.auth?.sub;
    if (!userId) {
      res.status(401).json({ success: false, reason: "Unauthorized" });
      return;
    }

    const mealId = req.params.id;
    if (!mealId) {
      res.status(400).json({ success: false, reason: "Missing meal ID" });
      return;
    }

    const validation = updateMealSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({ success: false, reason: validation.error });
      return;
    }

    const meal = await updateMealService({
      mealId,
      userId,
      name: validation.data.name,
      notes: validation.data.notes,
      consumedAt: validation.data.consumedAt,
    });

    if (!meal) {
      res.status(404).json({ success: false, reason: "Meal not found" });
      return;
    }

    res.status(200).json({ success: true, data: meal });
  } catch (error) {
    next(error);
  }
}
