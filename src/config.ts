import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const configSchema = z.object({
  port: z.coerce.number().default(3000),
  mcpTransport: z.enum(['stdio', 'sse']).default('stdio'),
  logLevel: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  intervals: z.object({
    apiKey: z.string().optional().default(''),
    athleteId: z.string().optional().default('me'),
    baseUrl: z.string().default('https://intervals.icu/api/v1'),
  }),
});

export type Config = z.infer<typeof configSchema>;

export function loadConfig(): Config {
  return configSchema.parse({
    port: process.env.PORT,
    mcpTransport: process.env.MCP_TRANSPORT,
    logLevel: process.env.LOG_LEVEL,
    intervals: {
      apiKey: process.env.INTERVALS_API_KEY,
      athleteId: process.env.INTERVALS_ATHLETE_ID,
      baseUrl: process.env.INTERVALS_BASE_URL,
    },
  });
}
