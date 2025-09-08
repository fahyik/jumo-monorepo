import { createLogger } from "@jumo-monorepo/logger";

export const logger = createLogger({
  defaultMeta: { service: process.env.PACKAGE_NAME ?? "local" },
});
