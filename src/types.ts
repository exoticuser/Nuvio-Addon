export type ContentType = "movie" | "series";

export interface CatalogExtra {
  search?: string;
  genre?: string;
  skip?: string;
  [key: string]: string | undefined;
}

export interface CatalogRequest {
  type: ContentType;
  id: string;
  extra: CatalogExtra;
}

export interface MetaRequest {
  type: ContentType;
  id: string;
}

export interface StreamRequest {
  type: ContentType;
  id: string;
}

export interface ManifestCatalog {
  type: ContentType;
  id: string;
  name: string;
  extra?: Array<{ name: string; isRequired: boolean }>;
}

export interface AddonManifest {
  id: string;
  version: string;
  name: string;
  description: string;
  types: ContentType[];
  resources: Array<string | { name: string; types: ContentType[]; idPrefixes?: string[] }>;
  catalogs: ManifestCatalog[];
  behaviorHints?: {
    configurable?: boolean;
    configurationRequired?: boolean;
    adult?: boolean;
  };
  [key: string]: unknown;
}

export interface CatalogResponse {
  metas: unknown[];
  cacheMaxAge?: number;
  staleRevalidate?: number;
  staleError?: number;
}

export interface MetaResponse {
  meta: Record<string, unknown>;
}

export interface StreamResponse {
  streams: Array<Record<string, unknown>>;
}

export interface RuntimeConfig {
  provider: string;
  upstreamUrl: string;
  apiKey: string | undefined;
  requestTimeoutMs: number;
}
