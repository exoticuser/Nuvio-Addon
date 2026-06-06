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

export const handleStream = async (request: Request): Promise<StreamResponse> => {
  const runtimeConfig = resolveRuntimeConfig(request);
  const provider = getProvider(runtimeConfig.provider);

  const payload: StreamRequest = {
    type: parseContentType(request.params.type),
    id: request.params.id,
  };

  return provider.getStreams(payload, runtimeConfig);
};
