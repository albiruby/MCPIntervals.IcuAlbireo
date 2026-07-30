import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { ProviderInterface } from '../providers/base.provider.js';
import { AthleteEngine } from '../engines/athlete.engine.js';

export function registerAthleteTools(server: Server, provider: ProviderInterface) {
  // Tools defined here are automatically registered
}
