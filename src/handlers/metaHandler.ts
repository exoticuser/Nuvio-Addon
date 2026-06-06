import type { Request } from "express";
import { resolveRuntimeConfig } from "../config/parseConfig.js";
import { getProvider } from "../providers/registry.js";
import type { ContentType, MetaRequest, MetaResponse } from "../types.js";

const parseContentType = (value: string): ContentType => {
  if (value === "movie" || value === "series") {
    return value;
  }

  throw new Error(`Unsupported content type '${value}'`);
};

const getRequiredParam = (request: Request, key: "type" | "id"): string => {
  const value = request.params[key];
  if (!value) {
    throw new Error(`Missing '${key}' parameter`);
  }

  return value;
};

export const handleMeta = async (request: Request): Promise<MetaResponse> => {
  const runtimeConfig = resolveRuntimeConfig(request);
  const provider = getProvider(runtimeConfig.provider);

  const payload: MetaRequest = {
    type: parseContentType(getRequiredParam(request, "type")),
    id: getRequiredParam(request, "id"),
  };

  return provider.getMeta(payload, runtimeConfig);
};
