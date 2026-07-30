# Client Setup Guide - TrackLab MCP Ultimate Edition

## 1. Claude Desktop Setup
Add the following to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "tracklab": {
      "command": "node",
      "args": ["d:/MCPIntervals.IcuAlbireo/dist/index.js"],
      "env": {
        "INTERVALS_API_KEY": "your_api_key_here",
        "INTERVALS_ATHLETE_ID": "i00000",
        "MCP_TRANSPORT": "stdio"
      }
    }
  }
}
```

---

## 2. Cursor Setup
Navigate to **Settings > Cursor Settings > Features > MCP Servers** and add a new MCP server:

- **Name**: `tracklab`
- **Type**: `command`
- **Command**: `node d:/MCPIntervals.IcuAlbireo/dist/index.js`
- **Environment Variables**: `INTERVALS_API_KEY=your_api_key`

---

## 3. Windsurf Setup
In `~/.codeium/windsurf/mcp_config.json`:

```json
{
  "mcpServers": {
    "tracklab": {
      "command": "node",
      "args": ["d:/MCPIntervals.IcuAlbireo/dist/index.js"],
      "env": {
        "INTERVALS_API_KEY": "your_api_key_here",
        "MCP_TRANSPORT": "stdio"
      }
    }
  }
}
```

---

## 4. Claude.ai Setup (Remote Connector)
Deploy TrackLab MCP to Railway or Render (see `docs/DEPLOYMENT.md`), then connect Claude.ai to your SSE URL:

- **Server URL**: `https://your-app.up.railway.app/sse`
