import { Router } from "express";

import { AuthenticatedRequest } from "../../middleware/interfaces.js";
import { aiRouter } from "./ai.js";
import { foodsRouter } from "./foods/index.js";

export function apiRouter() {
  const router = Router();

  router.get("/route", async (_req: AuthenticatedRequest, res, next) => {
    try {
      res.json({ success: true });
      return;
    } catch (error) {
      next(error);
    }
  });

  router.use("/ai", aiRouter());
  router.use("/foods", foodsRouter());

  return router;
}
