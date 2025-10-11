import { NextFunction, Response } from "express";

import { AuthenticatedRequest } from "../../../middleware/interfaces.js";
import { getMealById as getMealByIdService } from "../../../services/meals/get-meal-by-id.js";

export async function getMealById(
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

    const meal = await getMealByIdService(mealId, userId);
    if (!meal) {
      res.status(404).json({ success: false, reason: "Meal not found" });
      return;
    }

    res.status(200).json({ success: true, data: meal });
  } catch (error) {
    next(error);
  }
}
