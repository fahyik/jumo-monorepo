import { NextFunction, Response } from "express";
import { getMealsQuerySchema } from "@jumo-monorepo/interfaces";

import { AuthenticatedRequest } from "../../../middleware/interfaces.js";
import { getMeals as getMealsService } from "../../../services/meals/get-meals.js";

export async function getMeals(
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

    const validation = getMealsQuerySchema.safeParse(req.query);
    if (!validation.success) {
      res.status(400).json({ success: false, reason: validation.error });
      return;
    }

    const meals = await getMealsService({
      userId,
      includeDeleted: validation.data.includeDeleted === "true",
      limit: validation.data.limit ? parseInt(validation.data.limit) : undefined,
      offset: validation.data.offset ? parseInt(validation.data.offset) : undefined,
    });

    res.status(200).json({ success: true, data: meals });
  } catch (error) {
    next(error);
  }
}
