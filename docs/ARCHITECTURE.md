# TrackLab MCP Architecture Specification

## Overview
TrackLab MCP Ultimate Edition is structured as a decoupled proxy and physiological analysis server:

1. **Protocol Layer (`src/index.ts`)**: Standard MCP server over Stdio (for local clients) and Express SSE (for web/remote connectors).
2. **Tools Layer (`src/tools/`)**: 70+ domain tools exposed to AI models with Zod validation.
3. **Engine Layer (`src/engines/`)**: 13 physiological engines implementing Daniels VDOT, Norwegian Double Threshold, Casado, Seiler TID, Riegel race predictions, ACWR injury risk, and recovery readiness.
4. **Provider Adapter Layer (`src/providers/`)**: Abstract `ProviderInterface` enabling plug-and-play endurance providers (Intervals.icu initial implementation; Garmin, Strava, COROS, TrainingPeaks ready for expansion).
