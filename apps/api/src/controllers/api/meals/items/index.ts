import { Router } from "express";

import { deleteItem } from "./delete-item.js";
import { patchItem } from "./patch-item.js";
import { postItem } from "./post-item.js";

export function mealItemsRouter() {
  const router = Router({ mergeParams: true });

  router.post("/", postItem);
  router.patch("/:itemId", patchItem);
  router.delete("/:itemId", deleteItem);

  return router;
}
