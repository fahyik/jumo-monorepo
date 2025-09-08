import morgan from "morgan";

import { asyncLocalStorage } from "./async-local-storage";

const ENV = process.env.NODE_ENV || "development";

morgan.token("correlationId", function () {
  const store = asyncLocalStorage.getStore();
  if (store) {
    return store.get("correlationId");
  }
  return undefined;
});

export function getHttpLogger(serviceName: string) {
  const log = {
    level: "info",
    service: serviceName,
    method: ":method",
    url: ":url",
    status: ":status",
    message: `:method :url :status :response-time ms - :res[content-length]`,
    remoteAddress: ":remote-addr",
    userAgent: ":user-agent",
    referrer: ":referrer",
    httpVersion: ":http-version",
    timestamp: `:date[iso]`,
    correlationId: ":correlationId",
  };

  return morgan(JSON.stringify(log, null, ENV === "development" ? 2 : 0));
}
