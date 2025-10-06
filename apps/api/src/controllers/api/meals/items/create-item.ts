import { NextFunction, Response } from "express";
import { z } from "zod";

import { AuthenticatedRequest } from "../../../../middleware/interfaces.js";
import { createMealItem as createMealItemService } from "../../../../services/meal-items/create-meal-item.js";

const createItemSchema = z.object({
  providerFoodId: z.string().uuid(),
  quantity: z.number().positive(),
  unit: z.string(),
  nutrients: z.array(
    z.object({
      nutrientId: z.string().uuid(),
      amount: z.number(),
    })
  ),
});

export async function createItem(
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

    const validation = createItemSchema.safeParse(req.body);
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
      nutrients: validation.data.nutrients,
    });

    res.status(201).json({ success: true, data: mealItem });
  } catch (error) {
    next(error);
  }
}
