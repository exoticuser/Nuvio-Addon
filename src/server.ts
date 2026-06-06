import express, { type NextFunction, type Request, type Response } from "express";
import { handleCatalog } from "./handlers/catalogHandler.js";
import { handleMeta } from "./handlers/metaHandler.js";
import { handleStream } from "./handlers/streamHandler.js";
import { manifest } from "./manifest.js";
import { registerProviders } from "./providers/registry.js";
import { toAppError } from "./utils/errors.js";
import { logger } from "./utils/logger.js";

const app = express();

app.disable("x-powered-by");
app.use(express.json({ limit: "256kb" }));

app.use((request, _response, next) => {
  logger.info({ method: request.method, path: request.path }, "Incoming request");
  next();
});

app.get(["/manifest.json", "/:config/manifest.json"], (request: Request, response: Response) => {
  response.json(manifest);
});

app.get(
  [
    "/catalog/:type/:id.json",
    "/catalog/:type/:id/:extra.json",
    "/:config/catalog/:type/:id.json",
    "/:config/catalog/:type/:id/:extra.json",
  ],
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      response.json(await handleCatalog(request));
    } catch (error) {
      next(error);
    }
  },
);

app.get(
  ["/meta/:type/:id.json", "/:config/meta/:type/:id.json"],
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      response.json(await handleMeta(request));
    } catch (error) {
      next(error);
    }
  },
);

app.get(
  ["/stream/:type/:id.json", "/:config/stream/:type/:id.json"],
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      response.json(await handleStream(request));
    } catch (error) {
      next(error);
    }
  },
);

app.use((_request: Request, response: Response) => {
  response.status(404).json({ error: "Route not found" });
});

// Centralized error handling keeps all endpoint failures in a single normalized shape.
app.use((error: unknown, _request: Request, response: Response, _next: NextFunction) => {
  const normalized = toAppError(error);
  logger.error(
    { err: normalized, statusCode: normalized.statusCode, details: normalized.details },
    "Request failed",
  );

  response.status(normalized.statusCode).json({
    error: normalized.message,
    details: normalized.details,
  });
});

export const createServer = () => {
  registerProviders();
  return app;
};
