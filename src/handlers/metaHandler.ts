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

export const handleMeta = async (request: Request): Promise<MetaResponse> => {
  const runtimeConfig = resolveRuntimeConfig(request);
  const provider = getProvider(runtimeConfig.provider);

  const payload: MetaRequest = {
    type: parseContentType(request.params.type),
    id: request.params.id,
  };

  return provider.getMeta(payload, runtimeConfig);
};
