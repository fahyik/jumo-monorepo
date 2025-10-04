import { NextFunction, Request, Response } from "express";

import { getFoodByBarcode } from "../../../services/open-food-facts/get-food-by-barcode.js";

export async function getSearchFoodByBarcode(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { barcode } = req.params;

    const result = await getFoodByBarcode({ barcode });

    res.status(200).json(result);
    return;
  } catch (error) {
    next(error);
  }
}
