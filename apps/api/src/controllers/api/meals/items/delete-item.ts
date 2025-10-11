import { NextFunction, Response } from "express";

import { AuthenticatedRequest } from "../../../../middleware/interfaces.js";
import { deleteMealItem as deleteMealItemService } from "../../../../services/meal-items/delete-meal-item.js";

export async function deleteItem(
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

    const deleted = await deleteMealItemService(itemId, userId);
    if (!deleted) {
      res.status(404).json({ success: false, reason: "Meal item not found" });
      return;
    }

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
}
