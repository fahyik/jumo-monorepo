import { openai } from "@ai-sdk/openai";
import {
  UIMessage,
  convertToModelMessages,
  generateObject,
  streamText,
} from "ai";
import { Router } from "express";
import { Request } from "express";
import convert from "heic-convert";
import sharp from "sharp";
import z from "zod";

import { logger } from "../../logger.js";
import { uploadToMemory } from "../../middleware/file.js";

export function aiRouter() {
  const router = Router();

  router.post("/chat", async (req: Request, res) => {
    const { messages }: { messages: UIMessage[] } = req.body;

    const result = streamText({
      // model: cerebras("llama3.1-8b"),
      model: openai("gpt-4-turbo-2024-04-09"),
      system:
        "Your name is Jumo. You are a professional nutritionist and health expert, offering advice on personal health. For any other questions or topic, you are to provide a generic response in the lines of 'I am unable to answer such questions.'",
      messages: convertToModelMessages(messages),
    });

    result.pipeUIMessageStreamToResponse(res);
  });

  router.post(
    "/upload-photo",
    uploadToMemory.single("image"),
    async (req, res) => {
      try {
        if (!req.file) {
          return res
            .status(400)
            .json({ success: false, reason: "No file uploaded" });
        }

        // req.file.buffer contains the file data
        // Upload to cloud storage (AWS S3, Google Cloud, etc.)
        // const uploadResult = await uploadToCloudStorage(req.file.buffer);

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

        const resizedBuffer = await sharp(buffer)
          // .resize({ width: 512, height: 512, fit: "inside" })
          .resize(256)
          .toBuffer();

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

        // result.pipeTextStreamToResponse(res);
        res.json(result.object);
      } catch (error) {
        logger.error(error);
        res.status(500).json({ success: false, reason: "Upload failed" });
      }
    }
  );

  return router;
}
