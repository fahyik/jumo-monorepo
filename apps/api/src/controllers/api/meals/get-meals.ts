import { NextFunction, Response } from "express";
import { formatInTimeZone } from "date-fns-tz";

import { AuthenticatedRequest } from "../../../middleware/interfaces.js";
import { getMeals as getMealsService } from "../../../services/meals/get-meals.js";

import { getMealsQuerySchema } from "@jumo-monorepo/interfaces";

export async function getMeals(
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

    const validation = getMealsQuerySchema.safeParse(req.query);
    if (!validation.success) {
      res.status(400).json({ success: false, reason: validation.error });
      return;
    }

    const meals = await getMealsService({
      userId,
      includeDeleted: validation.data.includeDeleted === "true",
      limit: validation.data.limit
        ? parseInt(validation.data.limit)
        : undefined,
      offset: validation.data.offset
        ? parseInt(validation.data.offset)
        : undefined,
    });

    if (validation.data.groupBy === "day") {
      const timezone = validation.data.timezone || "UTC";
      const groupedByDay = meals.reduce(
        (acc, meal) => {
          const date = formatInTimeZone(
            new Date(meal.consumedAt),
            timezone,
            "yyyy-MM-dd"
          );
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push(meal);
          return acc;
        },
        {} as Record<string, typeof meals>
      );

      // Sort meals within each day by consumedAt ascending
      Object.keys(groupedByDay).forEach((date) => {
        groupedByDay[date].sort(
          (a, b) =>
            new Date(a.consumedAt).getTime() - new Date(b.consumedAt).getTime()
        );
      });

      res.status(200).json({ success: true, data: groupedByDay });
    } else {
      res.status(200).json({ success: true, data: meals });
    }
  } catch (error) {
    next(error);
  }
}
