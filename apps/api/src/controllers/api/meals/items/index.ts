import { Router } from "express";

import { createItem } from "./create-item.js";
import { updateItem } from "./update-item.js";
import { deleteItem } from "./delete-item.js";

export function mealItemsRouter() {
  const router = Router({ mergeParams: true });

  router.post("/", createItem);
  router.patch("/:itemId", updateItem);
  router.delete("/:itemId", deleteItem);

  return router;
}
