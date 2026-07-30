# Contributing to TrackLab MCP Ultimate Edition

Thank you for your interest in contributing to TrackLab MCP!

## 📜 Architectural Standards

TrackLab MCP adheres to 10 strict Principal Engineering standards:
1. **Decoupled Scientific Models (`src/models/`)**: Every physiological formula must be implemented as a standalone model class in `src/models/` complying with the Open/Closed Principle.
2. **Literature Registry (`src/registry/literature.registry.ts`)**: Every scientific formula MUST cite its academic paper/textbook reference (Title, Authors, Year, ISBN/DOI, assumptions, and validity domain).
3. **No Hardcoded Magic Numbers (`src/config/physiology.config.ts`)**: All physiological ratios, time constants, and decay exponents must be externalized.
4. **Provider Capabilities (`provider.supports("capability")`)**: All provider plugins must explicitly define capabilities (`supportsHeartRate`, `supportsPower`, `supportsHrv`, etc.).
5. **Multi-Factor Confidence Scoring**: Analytical tools must return structured `confidence` DTOs (`{ confidence, dataQuality, modelConfidence, providerQuality }`).
6. **Validation Layer**: Input parameters must be validated before running predictions.

## 🧪 Development Workflow

1. Fork & clone the repository.
2. Install dependencies: `npm install`
3. Run TypeScript strict typecheck: `npm run typecheck`
4. Run Vitest test suite: `npm test`
5. Submit a Pull Request describing your changes and references.
