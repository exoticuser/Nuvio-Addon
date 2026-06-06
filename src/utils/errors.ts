export class AppError extends Error {
  public readonly statusCode: number;
  public readonly details?: unknown;

  public constructor(message: string, statusCode = 500, details?: unknown) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

export class ProviderNotFoundError extends AppError {
  public constructor(providerName: string) {
    super(`Provider '${providerName}' is not registered.`, 400);
    this.name = "ProviderNotFoundError";
  }
}

export class UpstreamRequestError extends AppError {
  public constructor(message: string, statusCode = 502, details?: unknown) {
    super(message, statusCode, details);
    this.name = "UpstreamRequestError";
  }
}

export const toAppError = (error: unknown): AppError => {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError(error.message, 500);
  }

  return new AppError("Unexpected internal error", 500, error);
};
