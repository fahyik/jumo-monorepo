import { openai } from "@ai-sdk/openai";
import { UIMessage, convertToModelMessages, streamText } from "ai";
import { NextFunction, Request, Response } from "express";

export async function postChat(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { messages }: { messages: UIMessage[] } = req.body;

    const result = streamText({
      model: openai("gpt-4-turbo-2024-04-09"),
      system:
        "Your name is Jumo. You are a professional nutritionist and health expert, offering advice on personal health. For any other questions or topic, you are to provide a generic response in the lines of 'I am unable to answer such questions.'",
      messages: convertToModelMessages(messages),
    });

    result.pipeUIMessageStreamToResponse(res);
  } catch (error) {
    next(error);
  }
}
