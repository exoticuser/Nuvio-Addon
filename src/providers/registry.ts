import { ProviderNotFoundError } from "../utils/errors.js";
import type { StreamProvider } from "./types.js";
import { streamioBridgeProvider } from "./streamio/provider.js";

const providers = new Map<string, StreamProvider>();

export const registerProviders = (): void => {
  providers.set(streamioBridgeProvider.id, streamioBridgeProvider);
};

export const getProvider = (id: string): StreamProvider => {
  const provider = providers.get(id);
  if (!provider) {
    throw new ProviderNotFoundError(id);
  }

  return provider;
};

export const listProviders = (): string[] => [...providers.keys()];
