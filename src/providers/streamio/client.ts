import { UpstreamRequestError } from "../../utils/errors.js";

interface FetchJsonOptions {
  timeoutMs: number;
  headers?: Record<string, string>;
}

const withTrailingSlashRemoved = (value: string): string => value.replace(/\/$/, "");

export const fetchJson = async <T>(url: string, options: FetchJsonOptions): Promise<T> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs);

  try {
    const response = await fetch(url, {
      headers: {
        accept: "application/json",
        ...options.headers,
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new UpstreamRequestError(
        `Upstream request failed with status ${response.status}`,
        502,
        await response.text(),
      );
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof UpstreamRequestError) {
      throw error;
    }

    if (error instanceof Error && error.name === "AbortError") {
      throw new UpstreamRequestError("Upstream request timed out", 504);
    }

    throw new UpstreamRequestError("Failed to fetch upstream data", 502, error);
  } finally {
    clearTimeout(timeout);
  }
};

export const joinUpstreamUrl = (baseUrl: string, path: string): string =>
  `${withTrailingSlashRemoved(baseUrl)}${path.startsWith("/") ? path : `/${path}`}`;
