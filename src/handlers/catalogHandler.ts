import type { Request } from "express";
import { resolveRuntimeConfig } from "../config/parseConfig.js";
import { getProvider } from "../providers/registry.js";
import type { CatalogExtra, CatalogRequest, CatalogResponse, ContentType } from "../types.js";

const parseContentType = (value: string): ContentType => {
  if (value === "movie" || value === "series") {
    return value;
  }

  throw new Error(`Unsupported content type '${value}'`);
};

const parseExtra = (request: Request): CatalogExtra => {
  const extraFromPath = request.params.extra;
  const parsed = new URLSearchParams(extraFromPath ?? "");

  const extra: CatalogExtra = {};
  for (const [key, value] of parsed.entries()) {
    extra[key] = value;
  }

  for (const [key, value] of Object.entries(request.query)) {
    if (typeof value === "string") {
      extra[key] = value;
    }
  }

  return extra;
};

const getRequiredParam = (request: Request, key: "type" | "id"): string => {
  const value = request.params[key];
  if (!value) {
    throw new Error(`Missing '${key}' parameter`);
  }

  return value;
};

export const handleCatalog = async (request: Request): Promise<CatalogResponse> => {
  const runtimeConfig = resolveRuntimeConfig(request);
  const provider = getProvider(runtimeConfig.provider);

  const payload: CatalogRequest = {
    type: parseContentType(getRequiredParam(request, "type")),
    id: getRequiredParam(request, "id"),
    extra: parseExtra(request),
  };

  return provider.getCatalog(payload, runtimeConfig);
};
