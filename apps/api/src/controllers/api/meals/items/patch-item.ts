import { NextFunction, Response } from "express";

import { AuthenticatedRequest } from "../../../../middleware/interfaces.js";
import { updateMealItem as updateMealItemService } from "../../../../services/meal-items/update-meal-item.js";

import { updateMealItemSchema } from "@jumo-monorepo/interfaces";

export async function patchItem(
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

    const itemId = req.params.itemId;
    if (!itemId) {
      res.status(400).json({ success: false, reason: "Missing item ID" });
      return;
    }

    const validation = updateMealItemSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({ success: false, reason: validation.error });
      return;
    }

    const mealItem = await updateMealItemService({
      mealItemId: itemId,
      userId,
      quantity: validation.data.quantity,
      unit: validation.data.unit,
    });

    if (!mealItem) {
      res.status(404).json({ success: false, reason: "Meal item not found" });
      return;
    }

    res.status(200).json({ success: true, data: mealItem });
  } catch (error) {
    next(error);
  }
}
