import { NextFunction, Request, Response } from "express";
import { z } from "zod";

import { getFoodByBarcode } from "../../../services/open-food-facts/get-food-by-barcode.js";

const querySchema = z.object({
  forceRefresh: z
    .literal(["true", "false"])
    .optional()
    .transform((val) => val === "true"),
});

export async function getSearchFoodByBarcode(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { barcode } = req.params;

    const validation = querySchema.safeParse(req.query);
    if (!validation.success) {
      res.status(400).json({
        success: false,
        error: validation.error.issues,
      });
      return;
    }

    const result = await getFoodByBarcode({
      barcode,
      options: { forceRefresh: validation.data.forceRefresh },
    });

    res.status(200).json(result);
    return;
  } catch (error) {
    next(error);
  }
}
