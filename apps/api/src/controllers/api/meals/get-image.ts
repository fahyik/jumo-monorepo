import { NextFunction, Response } from "express";

import { AuthenticatedRequest } from "../../../middleware/interfaces.js";
import { getImageSignedUrl } from "../../../services/meal-items/get-image-signed-url.js";

import { GetMealItemImage } from "@jumo-monorepo/interfaces";

export async function getImage(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { path, userId } = req.params as GetMealItemImage["params"];

    if (userId && req.auth?.sub !== userId) {
      res.status(403).json({ success: false, reason: "NO_PERMISSION" });
      return;
    }

    const result = await getImageSignedUrl(`${userId}/${path}`);

    res.json(result);
  } catch (error) {
    next(error);
  }
}
