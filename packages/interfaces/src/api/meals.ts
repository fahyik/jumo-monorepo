import { z } from "zod";

// Meal schemas
export const createMealSchema = z.object({
  name: z.string().optional(),
  notes: z.string().optional(),
  consumedAt: z.coerce.date(),
  items: z
    .array(
      z.object({
        providerFoodId: z.uuid(),
        quantity: z.number().positive(),
        unit: z.string(),
        nutrients: z.array(
          z.object({
            nutrientId: z.string(),
            amount: z.number(),
          })
        ),
      })
    )
    .optional(),
});

export const updateMealSchema = z.object({
  name: z.string().optional(),
  notes: z.string().optional(),
  consumedAt: z.coerce.date().optional(),
});

export const getMealsQuerySchema = z.object({
  includeDeleted: z.enum(["true", "false"]).optional(),
  limit: z.string().optional(),
  offset: z.string().optional(),
});

// Meal item schemas
export const createMealItemSchema = z.object({
  providerFoodId: z.uuid(),
  quantity: z.number().positive(),
  unit: z.string(),
  nutrients: z.array(
    z.object({
      nutrientId: z.string(),
      amount: z.number(),
    })
  ),
});

export const updateMealItemSchema = z.object({
  quantity: z.number().positive().optional(),
  unit: z.string().optional(),
  nutrients: z
    .array(
      z.object({
        nutrientId: z.string(),
        amount: z.number(),
      })
    )
    .optional(),
});

export type CreateMealInput = z.infer<typeof createMealSchema>;
export type UpdateMealInput = z.infer<typeof updateMealSchema>;
export type GetMealsQuery = z.infer<typeof getMealsQuerySchema>;
export type CreateMealItemInput = z.infer<typeof createMealItemSchema>;
export type UpdateMealItemInput = z.infer<typeof updateMealItemSchema>;
