# Changelog

All notable changes to TrackLab MCP Ultimate Edition will be documented in this file.

## [1.0.0] - 2026-07-30

### Added
- **Plugin Architecture**: Abstract `ProviderInterface` with `ProviderCapabilities` (`supports('hrv')`, `supports('power')`, etc.).
- **Intervals.icu Provider**: REST client, DTO mappers, and automatic sandbox fallback mode.
- **Decoupled Scientific Models (`src/models/`)**:
  - `daniels.model.ts` (Jack Daniels VDOT & Oxygen Cost)
  - `seiler.model.ts` (Seiler 3-Zone TID)
  - `norwegian.model.ts` (Norwegian Double Threshold Lactate Control 2.5-3.5 mmol/L)
  - `casado.model.ts` (Casado Threshold Progression)
  - `critical_speed.model.ts` (Critical Speed $D'/t + CS$)
  - `riegel.model.ts` (Riegel Exponential Prediction)
  - `banister.model.ts` (Banister EWMA PMC - CTL/ATL/TSB)
  - `acwr.model.ts` (EWMA Acute:Chronic Workload Ratio, Monotony, Strain)
- **Literature Registry (`src/registry/literature.registry.ts`)**: Scientific references with authors, textbook titles, ISBN/DOI, assumptions, and validity domains.
- **Physiology Config (`src/config/physiology.config.ts`)**: Centralized physiological parameters.
- **Validation Layer & Multi-Factor Confidence (`src/utils/validation.ts`)**: Domain validation & confidence scoring (`{ confidence, dataQuality, modelConfidence, providerQuality }`).
- **Resilience & Observability**: In-memory `TTLCache`, provider health tools (`provider_status`, `provider_ping`).
- **Open Source Governance**: `LICENSE`, `CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md`.
