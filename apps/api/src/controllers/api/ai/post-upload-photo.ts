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
import { supabase } from "../../../supabase.js";

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
            }),
            estimatedPortionSize: z.number(),
            estimatedPortionSizeUnit: z.literal("g"),
            totalNutritionForEstimatedPortion: z.object({
              carbohydrates: z.number(),
              carbohydratesUnit: z.literal("g"),
              proteins: z.number(),
              proteinsUnit: z.literal("g"),
              fats: z.number(),
              fatsUnit: z.literal("g"),
              energy: z.number(),
              energyUnit: z.literal("kcal"),
            }),
            notes: z.string().optional(),
          })
          .optional(),
        reason: z.string().optional(),
      }),
    });

    if (result.object.success && req.auth) {
      const userId = req.auth.sub;
      const timestamp = Date.now();

      const fileExtension = req.file.mimetype.split("/")[1];
      const filePath = `${userId}/${timestamp}.${fileExtension}`;

      const uploadResult = await supabase.storage
        .from("image-uploads")
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

      const providerId = uuidv4();
      const rawData = {
        ...result.object,
        file_path: filePath,
      };

      await sql`
        INSERT INTO jumo.provider_foods (provider, provider_id, raw_data, data)
        VALUES (${userId}, ${providerId}, ${sql.json(rawData)}, ${sql.json({})})
      `;
    }

    res.json(result.object);
  } catch (error) {
    next(error);
  }
}
