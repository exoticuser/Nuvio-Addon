import type { Request } from "express";
import { resolveRuntimeConfig } from "../config/parseConfig.js";
import { getProvider } from "../providers/registry.js";
import type { ContentType, StreamRequest, StreamResponse } from "../types.js";

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

export const handleStream = async (request: Request): Promise<StreamResponse> => {
  const runtimeConfig = resolveRuntimeConfig(request);
  const provider = getProvider(runtimeConfig.provider);

  const payload: StreamRequest = {
    type: parseContentType(getRequiredParam(request, "type")),
    id: getRequiredParam(request, "id"),
  };

  return provider.getStreams(payload, runtimeConfig);
};
