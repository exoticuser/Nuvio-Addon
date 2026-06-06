import type {
  CatalogRequest,
  CatalogResponse,
  MetaRequest,
  MetaResponse,
  RuntimeConfig,
  StreamRequest,
  StreamResponse,
} from "../../types.js";
import type { StreamProvider } from "../types.js";
import { fetchJson, joinUpstreamUrl } from "./client.js";

const buildAuthHeader = (apiKey?: string): Record<string, string> => {
  if (!apiKey) {
    return {};
  }

  return { Authorization: "Bearer " + apiKey };
};

const formatExtraPath = (extra: CatalogRequest["extra"]): string => {
  const params = new URLSearchParams();

  // This keeps compatibility with Stream.io-style catalog filtering.
  for (const [key, value] of Object.entries(extra)) {
    if (typeof value === "string" && value.length > 0) {
      params.set(key, value);
    }
  }

  const serialized = params.toString();
  return serialized.length > 0 ? `/${serialized}` : "";
};

export const streamioBridgeProvider: StreamProvider = {
  id: "streamio-bridge",
  displayName: "Stream.io Bridge Provider",

  async getCatalog(request: CatalogRequest, config: RuntimeConfig): Promise<CatalogResponse> {
    const extraPath = formatExtraPath(request.extra);
    const url = joinUpstreamUrl(
      config.upstreamUrl,
      `/catalog/${request.type}/${request.id}${extraPath}.json`,
    );

    return fetchJson<CatalogResponse>(url, {
      timeoutMs: config.requestTimeoutMs,
      headers: buildAuthHeader(config.apiKey),
    });
  },

  async getMeta(request: MetaRequest, config: RuntimeConfig): Promise<MetaResponse> {
    const url = joinUpstreamUrl(config.upstreamUrl, `/meta/${request.type}/${request.id}.json`);

    return fetchJson<MetaResponse>(url, {
      timeoutMs: config.requestTimeoutMs,
      headers: buildAuthHeader(config.apiKey),
    });
  },

  async getStreams(request: StreamRequest, config: RuntimeConfig): Promise<StreamResponse> {
    const url = joinUpstreamUrl(config.upstreamUrl, `/stream/${request.type}/${request.id}.json`);

    return fetchJson<StreamResponse>(url, {
      timeoutMs: config.requestTimeoutMs,
      headers: buildAuthHeader(config.apiKey),
    });
  },
};
