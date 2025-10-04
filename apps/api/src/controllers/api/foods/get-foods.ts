import { NextFunction, Request, Response } from "express";
import { z } from "zod";

import { getFoods as offGetFoods } from "../../../services/open-food-facts/get-foods.js";

const getFoodsQuerySchema = z.object({
  type: z.literal(["branded", "generic"]),
  search: z.string(),
});

export async function getFoods(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const validation = getFoodsQuerySchema.safeParse(req.query);

    if (validation.success === false) {
      res.status(400).json({
        success: false,
        reason: validation.error,
      });
      return;
    }

    if (validation.data.type === "branded") {
      const result = await offGetFoods({
        search: validation.data.search,
      });
      res.status(200).json(result);

      return;
    }

    res.status(200).json({});
    return;
  } catch (error) {
    next(error);
  }
}
