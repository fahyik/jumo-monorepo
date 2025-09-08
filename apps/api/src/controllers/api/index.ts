import { Router } from "express";

import { AuthenticatedRequest } from "../../middleware/interfaces";

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

  return router;
}
