import { Router } from "express";

import { getFoods } from "./get-foods.js";
import { getSearchFoodByBarcode } from "./get-search-food-by-barcode.js";

export function foodsRouter() {
  const router = Router();

  router.get("/", getFoods);
  router.get("/barcode/:barcode", getSearchFoodByBarcode);

  return router;
}
