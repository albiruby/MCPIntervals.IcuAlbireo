import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import express from 'express';
import cors from 'cors';
import { loadConfig } from './config.js';
import { ProviderFactory } from './providers/provider.factory.js';
import { registerAllTools } from './tools/index.js';

async function main() {
  const config = loadConfig();
  const provider = ProviderFactory.createProvider(config);

  const server = new Server(
    {
      name: 'tracklab-mcp',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  registerAllTools(server, provider);

  if (config.mcpTransport === 'sse') {
    const app = express();
    app.use(cors());

    let sseTransport: SSEServerTransport | null = null;

    app.get('/health', (_req, res) => {
      res.json({ status: 'healthy', provider: provider.providerName, transport: 'sse' });
    });

    app.get('/sse', async (req, res) => {
      console.log('[TrackLab MCP] Client connected via SSE transport');
      sseTransport = new SSEServerTransport('/messages', res);
      await server.connect(sseTransport);
    });

    app.post('/messages', async (req, res) => {
      if (sseTransport) {
        await sseTransport.handlePostMessage(req, res);
      } else {
        res.status(400).send('SSE connection not initialized');
      }
    });

    app.listen(config.port, () => {
      console.log(`[TrackLab MCP Ultimate] Server running on SSE http://localhost:${config.port}/sse`);
    });
  } else {
    // Default STDIO transport for Claude Desktop, Cursor, Windsurf
    console.error('[TrackLab MCP Ultimate] Starting STDIO transport...');
    const stdioTransport = new StdioServerTransport();
    await server.connect(stdioTransport);
  }
}

main().catch((err) => {
  console.error('[TrackLab MCP Ultimate] Fatal Error:', err);
  process.exit(1);
});
