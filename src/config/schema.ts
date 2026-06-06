import { z } from "zod";

export const runtimeConfigSchema = z.object({
  provider: z.string().min(1).default("streamio-bridge"),
  upstreamUrl: z.string().url().default("https://v3-cinemeta.strem.io"),
  apiKey: z.string().min(1).optional(),
  requestTimeoutMs: z.coerce.number().int().positive().max(60000).default(12000),
});

export type RuntimeConfigInput = z.input<typeof runtimeConfigSchema>;
