import pino from "pino";

const level = process.env.LOG_LEVEL ?? "info";

export const logger = pino({
  name: "nuvio-addon",
  level,
  base: null,
  timestamp: pino.stdTimeFunctions.isoTime,
});
