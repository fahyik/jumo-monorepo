import { json, urlencoded } from "body-parser";
import cors from "cors";
import express from "express";

import { apiRouter } from "./controllers/api";
import { dbConnection } from "./db";
import { logger } from "./logger";
import { auth } from "./middleware/auth";
import { errorHandler } from "./middleware/error-handler";
import { addBeforeExitHandler } from "./server/process-lifecycle";

import { correlationIdMiddleware, getHttpLogger } from "@jumo-monorepo/logger";

export async function createServer() {
  logger.debug(`🟠🟠🟠 creating server ..`);

  const app = express();

  app
    .disable("x-powered-by")
    .use(correlationIdMiddleware)
    .use(getHttpLogger(process.env.npm_package_name ?? "local"));

  app.get("/ready", async (_req, res) => {
    res.status(200).json({
      ready: true,
      version: process.env.npm_package_version ?? "local",
    });
    return;
  });

  const originsOnPublic: (string | RegExp)[] = [];

  if (process.env.NODE_ENV !== "production") {
    originsOnPublic.push(
      "http://localhost:3000",
      "http://localhost:3001",
      /.*domain\.vercel\.app$/
    );
  }

  // public
  app.use(
    "/api",
    json({
      verify: (req, res, buf) => {
        // TODO: figure out how to augment types
        // https://stackoverflow.com/questions/58049052/typescript-express-property-rawbody-does-not-exist-on-type-incomingmessage
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (req as any).rawBody = buf;
      },
    }),
    apiRouter()
  );

  // protected routes below
  app
    .use(urlencoded({ extended: true }))
    .use(json())
    .use(cors())
    .use(
      auth.unless({
        path: [],
      })
    );

  app.use(errorHandler);

  app.use((_req, res, _next) => {
    res.status(404).json({ message: "not found" });
  });

  addBeforeExitHandler(async () => {
    await dbConnection.destroy();
  });

  return app;
}
