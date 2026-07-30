import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import { loadConfig } from './config.js';
import { ProviderFactory } from './providers/provider.factory.js';
import { registerAllTools } from './tools/index.js';

// ─── OAuth 2.0 in-memory store (single-user, personal use) ───
const ACCESS_TOKEN = crypto.randomBytes(32).toString('hex');
interface PendingCode { clientId: string; redirectUri: string; createdAt: number; }
const PENDING_CODES = new Map<string, PendingCode>();
const AUTHORIZED_CLIENTS = new Set<string>();

function generateAuthCode(): string {
  return crypto.randomBytes(16).toString('hex');
}

function getBaseUrl(req: express.Request): string {
  const proto = req.headers['x-forwarded-proto'] || 'http';
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost';
  return `${proto}://${host}`;
}

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
    app.use(express.json());

    let sseTransport: SSEServerTransport | null = null;

    // ─── Health check ───
    app.get('/health', (_req, res) => {
      res.json({ status: 'healthy', provider: provider.providerName, transport: 'sse' });
    });

    // ─── OAuth 2.0 Discovery (RFC 8414) ───
    app.get('/.well-known/oauth-authorization-server', (req, res) => {
      const baseUrl = getBaseUrl(req);
      res.json({
        issuer: baseUrl,
        authorization_endpoint: `${baseUrl}/authorize`,
        token_endpoint: `${baseUrl}/token`,
        response_types_supported: ['code'],
        grant_types_supported: ['authorization_code'],
        token_endpoint_auth_methods_supported: ['none'],
      });
    });

    // ─── OAuth Authorize ───
    app.get('/authorize', (req, res) => {
      const { client_id, redirect_uri, response_type, state } = req.query;

      if (response_type !== 'code') {
        res.status(400).json({ error: 'unsupported_response_type' });
        return;
      }

      const code = generateAuthCode();
      PENDING_CODES.set(code, {
        clientId: client_id as string,
        redirectUri: redirect_uri as string,
        createdAt: Date.now(),
      });

      const separator = (redirect_uri as string).includes('?') ? '&' : '?';
      const callbackUrl = `${redirect_uri}${separator}code=${code}${state ? `&state=${state}` : ''}`;

      console.log(`[TrackLab MCP] OAuth authorize — redirecting to ${redirect_uri}`);
      res.redirect(callbackUrl);
    });

    // ─── OAuth Token ───
    app.post('/token', (req, res) => {
      const { grant_type, code, redirect_uri, client_id } = req.body;

      if (grant_type !== 'authorization_code') {
        res.status(400).json({ error: 'unsupported_grant_type' });
        return;
      }

      const pending = PENDING_CODES.get(code);
      if (!pending) {
        res.status(400).json({ error: 'invalid_grant' });
        return;
      }

      PENDING_CODES.delete(code);
      AUTHORIZED_CLIENTS.add(client_id);

      res.json({
        access_token: ACCESS_TOKEN,
        token_type: 'Bearer',
        expires_in: 86400 * 365,
      });
    });

    // ─── SSE endpoint ───
    app.get('/sse', async (req, res) => {
      console.log('[TrackLab MCP] Client connected via SSE transport');
      sseTransport = new SSEServerTransport('/messages', res);
      await server.connect(sseTransport);
    });

    // ─── Messages endpoint ───
    app.post('/messages', async (req, res) => {
      if (sseTransport) {
        await sseTransport.handlePostMessage(req, res);
      } else {
        res.status(400).send('SSE connection not initialized');
      }
    });

    app.listen(config.port, '0.0.0.0', () => {
      console.log(`[TrackLab MCP] Server running on SSE http://0.0.0.0:${config.port}/sse`);
    });
  } else {
    console.error('[TrackLab MCP] Starting STDIO transport...');
    const stdioTransport = new StdioServerTransport();
    await server.connect(stdioTransport);
  }
}

main().catch((err) => {
  console.error('[TrackLab MCP] Fatal Error:', err);
  process.exit(1);
});
