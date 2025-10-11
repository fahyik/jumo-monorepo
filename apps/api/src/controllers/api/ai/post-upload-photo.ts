import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { NextFunction, Response } from "express";
import convert from "heic-convert";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import z from "zod";

import { sql } from "../../../db/index.js";
import { logger } from "../../../logger.js";
import { AuthenticatedRequest } from "../../../middleware/interfaces.js";
import { AI_NUTRIENT_MAPPING } from "../../../services/ai/mapping.js";
import { supabase } from "../../../supabase.js";
import { convertUnit } from "../../../utils/unit-converter.js";

import type {
  Nutrient,
  ProviderFood,
  ProviderFoodData,
} from "@jumo-monorepo/interfaces";

export async function postUploadPhoto(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, reason: "No file uploaded" });
    }

    let buffer = req.file.buffer;

    if (req.file.mimetype === "image/heic") {
      const converted = await convert({
        // @ts-expect-error NOTE: it's the correct type
        buffer: req.file.buffer,
        format: "JPEG",
        quality: 1,
      });
      buffer = Buffer.from(converted);
    }

    const resizedBuffer = await sharp(buffer).resize(256).toBuffer();

    const result = await generateObject({
      model: openai("gpt-4.1-mini"),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Estimate the per 100g nutritional breakdown, the portion size and an absolute nutritional breakdown. If the image is not of food, return success false with a reason",
            },
            {
              type: "image",
              image: resizedBuffer,
            },
          ],
        },
      ],
      schema: z.object({
        success: z.boolean(),
        data: z
          .object({
            name: z.string(),
            description: z.string(),
            nutritionPer100g: z.object({
              carbohydrates: z.number(),
              carbohydratesUnit: z.literal("g"),
              proteins: z.number(),
              proteinsUnit: z.literal("g"),
              fats: z.number(),
              fatsUnit: z.literal("g"),
              energy: z.number(),
              energyUnit: z.literal("kcal"),
              alcohol: z.number(),
              alcoholUnit: z.literal("g"),
              salt: z.number(),
              saltUnit: z.literal("g"),
              sugar: z.number(),
              sugarUnit: z.literal("g"),
              fiber: z.number(),
              fiberUnit: z.literal("g"),
              saturatedFat: z.number(),
              saturatedFatUnit: z.literal("g"),
              sodium: z.number(),
              sodiumUnit: z.literal("mg"),
            }),
            estimatedPortionSize: z.number(),
            estimatedPortionSizeUnit: z.literal("g"),
            notes: z.string().optional(),
          })
          .optional(),
        reason: z.string().optional(),
      }),
    });

    if (result.object.success && result.object.data && req.auth) {
      const userId = req.auth.sub;
      const timestamp = Date.now();

      const fileExtension = req.file.mimetype.split("/")[1];
      const filePath = `${userId}/${timestamp}.${fileExtension}`;

      const BUCKET = "image-uploads";

      const uploadResult = await supabase.storage
        .from(BUCKET)
        .upload(filePath, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: false,
        });

      if (uploadResult.error) {
        logger.error("Failed to upload image to storage", uploadResult.error);
        return res
          .status(500)
          .json({ success: false, reason: "Failed to upload image" });
      }

      // Fetch nutrients from database
      const dbNutrients = await sql<Nutrient[]>`
        SELECT id, name, unit, translation_key as "translationKey", parent_id as "parentId", created_at as "createdAt", updated_at as "updatedAt"
        FROM jumo.nutrients
      `;

      const aiData = result.object.data;
      const nutritionPer100g = aiData.nutritionPer100g;

      // Map AI nutrients to database nutrients
      const nutrients: ProviderFoodData["nutrients"] = [];

      for (const dbNutrient of dbNutrients) {
        let amount = 0;
        let providerNutrientId: string | null = null;

        const aiMapping = AI_NUTRIENT_MAPPING[dbNutrient.id];

        if (aiMapping) {
          const value =
            nutritionPer100g[aiMapping.value as keyof typeof nutritionPer100g];
          const providerUnit =
            nutritionPer100g[aiMapping.unit as keyof typeof nutritionPer100g];

          if (typeof value === "number") {
            amount = value;

            if (typeof providerUnit === "string") {
              amount = convertUnit(amount, providerUnit, dbNutrient.unit);
            }
          }

          providerNutrientId = aiMapping.value;
        }

        nutrients.push({
          id: dbNutrient.id,
          providerNutrientId,
          unit: dbNutrient.unit,
          amount,
        });
      }

      const providerFoodData: ProviderFoodData = {
        name: aiData.name,
        description: aiData.description,
        notes: aiData.notes,
        servingSize: aiData.estimatedPortionSize,
        servingSizeUnit: aiData.estimatedPortionSizeUnit,
        nutrients,
        image: {
          type: "storage",
          bucket: BUCKET,
          path: filePath,
        },
      };

      const providerId = uuidv4();

      const [providerFood] = await sql<ProviderFood[]>`
        INSERT INTO jumo.provider_foods (provider, provider_id, raw_data, data)
        VALUES (${userId}, ${providerId}, ${sql.json(JSON.parse(JSON.stringify(result.object)))}, ${sql.json(JSON.parse(JSON.stringify(providerFoodData)))})
        RETURNING
          id,
          provider,
          provider_id as "providerId",
          data as "foodData",
          created_at as "createdAt",
          updated_at as "updatedAt"
      `;

      res.json({ success: true, data: providerFood });
      return;
    }
  } catch (error) {
    next(error);
  }
}
