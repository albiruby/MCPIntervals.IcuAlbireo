# TrackLab MCP Ultimate Edition 🏃⚡

> Enterprise-Grade Model Context Protocol (MCP) Server & AI Running Engine for Claude, Cursor, Windsurf, VS Code, and Gemini CLI.

![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)
![MCP Standard](https://img.shields.io/badge/MCP-1.6.1-green)
![License](https://img.shields.io/badge/License-MIT-purple)
![Zero Cost](https://img.shields.io/badge/Hosting-100%25%20Free-success)

TrackLab MCP turns any AI Assistant into a physiological AI Running Coach. Built with a plugin architecture, it abstracts raw fitness APIs (Intervals.icu, Garmin, Strava, COROS, TrainingPeaks) and exposes 70+ structured analytical MCP tools powered by literature-backed endurance models (Daniels VDOT, Norwegian Double Threshold, Casado, Seiler TID, Riegel Predictions, ACWR Injury Risk).

---

## 🌟 Key Features

- **🔌 Plugin Architecture Layer**: Built with provider abstraction (`ProviderInterface`). Defaults to Intervals.icu API with zero extra DB costs. Future-proofed for Garmin, Strava, COROS, and TrainingPeaks.
- **🧬 13 Physiological Analytical Engines**:
  - **Threshold Engine**: Multi-model synthesis (Daniels, Norwegian Method, Casado, Seiler, Critical Speed, LT1, LT2).
  - **TID Engine**: Polarized (80/20), Pyramidal, and Threshold distribution classification.
  - **Performance & PMC Engine**: CTL (Fitness), ATL (Fatigue), TSB (Form), VDOT, Running Economy.
  - **Prediction Engine**: Riegel exponential race time predictor (1K to Marathon).
  - **Recovery Engine**: Readiness scoring (0-100), HRV balance, resting HR trends, deload recommendation.
  - **Injury Risk Engine**: ACWR (Acute:Chronic Workload Ratio 7d vs 28d EWMA), Monotony, Strain.
  - **Workout Builder Engine**: Structured step workout generator (Easy, Threshold Cruise Intervals, VO2max, Reps).
  - **Nutrition Engine**: Carb Loading (g/kg), hydration (mL/hr), sodium, intra-race gel schedule.
  - **Race Planner Engine**: Negative split strategy planner & KM split table.
  - **Report Engine**: Full GitHub Markdown performance report generator.
- **⚡ 70+ Dedicated MCP Tools**: Native support for Stdio (Claude Desktop/Cursor/Windsurf) and Express SSE (Claude.ai / Remote Connectors).
- **💸 100% Free Hosting Deployment**: Zero database dependencies required. Ready for Railway, Render, Fly.io, or Docker.

---

## 🚀 Quick Start

### 1. Installation
```bash
git clone https://github.com/your-username/tracklab-mcp.git
cd tracklab-mcp
npm install
```

### 2. Environment Setup
Copy `.env.example` to `.env`:
```bash
INTERVALS_API_KEY=your_intervals_api_key
INTERVALS_ATHLETE_ID=i00000
MCP_TRANSPORT=stdio
```

### 3. Build & Run
```bash
npm run build
npm start
```

---

## 💻 Client Integrations

See detailed configuration instructions in [`docs/CLIENT_SETUP.md`](file:///d:/MCPIntervals.IcuAlbireo/docs/CLIENT_SETUP.md).

- **Claude Desktop**: Connect via STDIO transport in `claude_desktop_config.json`.
- **Cursor / Windsurf**: Add `node dist/index.js` under MCP Settings.
- **Claude.ai**: Deploy via Docker/Railway and point to `https://your-app.up.railway.app/sse`.

---

## 🧪 Testing & Verification

Run Vitest unit tests for engines:
```bash
npm test
```

Typecheck TypeScript strict build:
```bash
npm run typecheck
```

---

## 📚 Documentation & Specs

- [Architecture Blueprint](file:///d:/MCPIntervals.IcuAlbireo/docs/ARCHITECTURE.md)
- [Client Setup Guide](file:///d:/MCPIntervals.IcuAlbireo/docs/CLIENT_SETUP.md)
- [Deployment Guide](file:///d:/MCPIntervals.IcuAlbireo/docs/DEPLOYMENT.md)
- [AI Prompting Guide](file:///d:/MCPIntervals.IcuAlbireo/docs/PROMPT_GUIDE.md)
- [Full MCP Tools Catalog](file:///d:/MCPIntervals.IcuAlbireo/docs/API_TOOLS.md)

---

## 📄 License
MIT License.
