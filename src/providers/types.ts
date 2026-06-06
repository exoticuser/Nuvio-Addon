import type {
  CatalogRequest,
  CatalogResponse,
  MetaRequest,
  MetaResponse,
  RuntimeConfig,
  StreamRequest,
  StreamResponse,
} from "../types.js";

export interface StreamProvider {
  readonly id: string;
  readonly displayName: string;
  getCatalog(request: CatalogRequest, config: RuntimeConfig): Promise<CatalogResponse>;
  getMeta(request: MetaRequest, config: RuntimeConfig): Promise<MetaResponse>;
  getStreams(request: StreamRequest, config: RuntimeConfig): Promise<StreamResponse>;
}
