import { NextFunction, Response } from "express";

import { AuthenticatedRequest } from "../../../../middleware/interfaces.js";
import { createMealItem as createMealItemService } from "../../../../services/meal-items/create-meal-item.js";

import { createMealItemSchema } from "@jumo-monorepo/interfaces";

export async function postItem(
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

    const mealId = req.params.mealId;
    if (!mealId) {
      res.status(400).json({ success: false, reason: "Missing meal ID" });
      return;
    }

    const validation = createMealItemSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({ success: false, reason: validation.error });
      return;
    }

    const mealItem = await createMealItemService({
      userId,
      mealId,
      providerFoodId: validation.data.providerFoodId,
      quantity: validation.data.quantity,
      unit: validation.data.unit,
    });

    res.status(201).json({ success: true, data: mealItem });
  } catch (error) {
    next(error);
  }
}
