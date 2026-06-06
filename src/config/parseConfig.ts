import type { Request } from "express";
import { runtimeConfigSchema } from "./schema.js";
import type { RuntimeConfig } from "../types.js";

const decodeBase64UrlJson = (value: string): Record<string, unknown> | undefined => {
  try {
    const raw = Buffer.from(value, "base64url").toString("utf8");
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return undefined;
  }
};

const pickDefined = <T extends Record<string, unknown>>(value: T): Partial<T> =>
  Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined)) as Partial<T>;

export const resolveRuntimeConfig = (request: Request): RuntimeConfig => {
  const envConfig = {
    provider: process.env.NUVIO_PROVIDER,
    upstreamUrl: process.env.NUVIO_UPSTREAM_URL,
    apiKey: process.env.NUVIO_API_KEY,
    requestTimeoutMs: process.env.NUVIO_REQUEST_TIMEOUT_MS,
  };

  const pathConfigRaw = request.params.config;
  const pathConfig = pathConfigRaw ? decodeBase64UrlJson(pathConfigRaw) : undefined;

  const queryConfig = {
    provider: typeof request.query.provider === "string" ? request.query.provider : undefined,
    upstreamUrl: typeof request.query.upstreamUrl === "string" ? request.query.upstreamUrl : undefined,
    apiKey: typeof request.query.apiKey === "string" ? request.query.apiKey : undefined,
    requestTimeoutMs:
      typeof request.query.requestTimeoutMs === "string" ? request.query.requestTimeoutMs : undefined,
  };

  const parsed = runtimeConfigSchema.parse({
    ...pickDefined(envConfig),
    ...pickDefined(pathConfig ?? {}),
    ...pickDefined(queryConfig),
  });

  return {
    provider: parsed.provider,
    upstreamUrl: parsed.upstreamUrl,
    apiKey: parsed.apiKey ?? undefined,
    requestTimeoutMs: parsed.requestTimeoutMs,
  };
};
