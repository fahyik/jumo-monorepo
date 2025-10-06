import { NextFunction, Response } from "express";
import { z } from "zod";

import { AuthenticatedRequest } from "../../../middleware/interfaces.js";
import { createMeal as createMealService } from "../../../services/meals/create-meal.js";

const createMealSchema = z.object({
  name: z.string().optional(),
  notes: z.string().optional(),
  consumedAt: z.coerce.date(),
  items: z
    .array(
      z.object({
        providerFoodId: z.string().uuid(),
        quantity: z.number().positive(),
        unit: z.string(),
        nutrients: z.array(
          z.object({
            nutrientId: z.string().uuid(),
            amount: z.number(),
          })
        ),
      })
    )
    .optional(),
});

export async function createMeal(
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
