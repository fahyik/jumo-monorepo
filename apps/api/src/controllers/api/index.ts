import { openai } from "@ai-sdk/openai";
import { UIMessage, convertToModelMessages, streamText } from "ai";
import { Router } from "express";
import { Request } from "express";

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

  router.post("/chat", async (req: Request, res) => {
    const { messages }: { messages: UIMessage[] } = req.body;

    const result = streamText({
      model: openai("gpt-5-nano-2025-08-07"),
      messages: convertToModelMessages(messages),
    });

    result.pipeUIMessageStreamToResponse(res);
  });

  return router;
}
