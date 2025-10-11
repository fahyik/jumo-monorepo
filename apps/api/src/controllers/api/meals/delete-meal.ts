import { NextFunction, Response } from "express";

import { AuthenticatedRequest } from "../../../middleware/interfaces.js";
import { deleteMeal as deleteMealService } from "../../../services/meals/delete-meal.js";

export async function deleteMeal(
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

    const deleted = await deleteMealService(mealId, userId);
    if (!deleted) {
      res.status(404).json({ success: false, reason: "Meal not found" });
      return;
    }

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
}
