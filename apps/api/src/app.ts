import pkgBodyParser from "body-parser";
import cors from "cors";
import express from "express";

import { apiRouter } from "./controllers/api/index.js";
import { sql } from "./db/index.js";
import { logger } from "./logger.js";
import { auth } from "./middleware/auth.js";
import { errorHandler } from "./middleware/error-handler.js";
import { addBeforeExitHandler } from "./server/process-lifecycle.js";

import { correlationIdMiddleware, getHttpLogger } from "@jumo-monorepo/logger";

const { json, urlencoded } = pkgBodyParser;

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

  app.get("/", async (_req, res) => {
    return res.json({
      app: "jumo-backend",
      version: process.env.npm_package_version,
      env: process.env.APP_ENV,
    });
  });

  app.use(
    "/",
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

  app.use(errorHandler);

  app.use((_req, res, _next) => {
    res.status(404).json({ message: "not found" });
  });

  addBeforeExitHandler(async () => {
    await sql.end();
    logger.info("Db connection terminated");
  });

  return app;
}
