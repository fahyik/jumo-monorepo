import { NextFunction, Response } from "express";
import { createMealSchema } from "@jumo-monorepo/interfaces";

import { AuthenticatedRequest } from "../../../middleware/interfaces.js";
import { createMeal as createMealService } from "../../../services/meals/create-meal.js";

export async function postMeal(
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

    const validation = createMealSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({ success: false, reason: validation.error });
      return;
    }

    const meal = await createMealService({
      userId,
      name: validation.data.name,
      notes: validation.data.notes,
      consumedAt: validation.data.consumedAt,
      items: validation.data.items,
    });

    res.status(201).json({ success: true, data: meal });
  } catch (error) {
    next(error);
  }
}
