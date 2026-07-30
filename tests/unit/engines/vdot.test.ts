import { describe, it, expect } from 'vitest';
import { DanielsModel } from '../../../src/models/daniels.model.js';
import { SeilerModel } from '../../../src/models/seiler.model.js';
import { RiegelModel } from '../../../src/models/riegel.model.js';
import { BanisterModel } from '../../../src/models/banister.model.js';
import { ACWRModel } from '../../../src/models/acwr.model.js';
import { ValidationLayer } from '../../../src/utils/validation.js';
import { LiteratureRegistry } from '../../../src/registry/literature.registry.js';

// ─── DANIELS MODEL ───────────────────────────────────────────────────────────
describe('DanielsModel', () => {
  it('calculates VDOT correctly for 20-minute 5K (1200s)', () => {
    const vdot = DanielsModel.calculateVDOT(5000, 1200);
    expect(vdot).toBeGreaterThan(47);
    expect(vdot).toBeLessThan(56);
  });

  it('returns training paces from VDOT with literature reference attached', () => {
    const result = DanielsModel.calculatePacesFromVDOT(51.5, 260);
    expect(result.reference.id).toBe('daniels_vdot');
    expect(result.easyPaceSecKm).toBeGreaterThan(result.thresholdPaceSecKm);
    expect(result.intervalPaceSecKm).toBeLessThan(result.thresholdPaceSecKm);
  });
});

// ─── SEILER MODEL ────────────────────────────────────────────────────────────
describe('SeilerModel', () => {
  it('classifies Polarized correctly when Z1 >= 75% and Z3 >= 10%', () => {
    // z1=80%, z2=5%, z3=15% → Polarized
    const z1 = 80 * 60; // 80 minutes
    const z2 = 5 * 60;
    const z3 = 15 * 60;
    const result = SeilerModel.classifyTID(z1, z2, z3, 171, 192);
    expect(result.classifiedModel).toBe('Polarized');
    expect(result.reference.id).toBe('seiler_tid');
  });

  it('classifies Pyramidal correctly', () => {
    const z1 = 70 * 60;
    const z2 = 20 * 60;
    const z3 = 10 * 60;
    const result = SeilerModel.classifyTID(z1, z2, z3, 171, 192);
    expect(result.classifiedModel).toBe('Pyramidal');
  });

  it('returns correct HR zone boundaries from LTHR and MaxHR', () => {
    const { z1MaxHr, z2MaxHr } = SeilerModel.calculate3ZoneBoundaries(171, 192);
    expect(z1MaxHr).toBe(Math.round(171 * 0.83));
    expect(z2MaxHr).toBe(171);
  });
});

// ─── RIEGEL MODEL ────────────────────────────────────────────────────────────
describe('RiegelModel', () => {
  it('predicts Marathon time from 5K baseline using exponent 1.06', () => {
    const result = RiegelModel.predictRace(5000, 1200, 42195);
    expect(result.predictedTimeSeconds).toBeGreaterThan(10000); // > ~2h45m
    expect(result.reference.id).toBe('riegel_model');
    expect(result.formattedTime).toMatch(/\d+:\d{2}:\d{2}/);
  });

  it('predicts 10K correctly from 5K', () => {
    const result = RiegelModel.predictRace(5000, 1200, 10000);
    // Riegel: 1200 * (10000/5000)^1.06 ≈ 2495s
    expect(result.predictedTimeSeconds).toBeCloseTo(2495, -2);
  });
});

// ─── BANISTER MODEL ──────────────────────────────────────────────────────────
describe('BanisterModel', () => {
  it('returns default PMC values for empty input', () => {
    const result = BanisterModel.calculatePMC([]);
    expect(result.ctl).toBe(45);
    expect(result.atl).toBe(40);
    expect(result.tsb).toBe(5);
    expect(result.status).toBe('Fresh');
  });

  it('computes PMC with literature reference attached', () => {
    const loads = Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - i * 86400000).toISOString(),
      load: 65,
    }));
    const result = BanisterModel.calculatePMC(loads);
    expect(result.ctl).toBeGreaterThan(0);
    expect(result.reference.id).toBe('banister_impulse');
  });
});

// ─── ACWR MODEL ──────────────────────────────────────────────────────────────
describe('ACWRModel', () => {
  it('returns Low Risk for steady-state training load', () => {
    const loads7d = Array(7).fill(60);
    const loads28d = Array(28).fill(60);
    const result = ACWRModel.calculateACWR(loads7d, loads28d);
    expect(result.acwr).toBeCloseTo(1.0, 1);
    expect(result.riskLevel).toContain('Low Risk');
    expect(result.reference.id).toBe('acwr_model');
  });

  it('flags High Risk for acute training spike', () => {
    const loads7d = Array(7).fill(150); // acute spike
    const loads28d = [...Array(21).fill(50), ...Array(7).fill(150)];
    const result = ACWRModel.calculateACWR(loads7d, loads28d);
    expect(result.acwr).toBeGreaterThan(1.5);
    expect(result.riskLevel).toBe('High Risk (>1.5)');
  });
});

// ─── VALIDATION LAYER ────────────────────────────────────────────────────────
describe('ValidationLayer', () => {
  it('rejects 400m → Marathon prediction as invalid (ratio > 15x)', () => {
    const result = ValidationLayer.validateRacePrediction(400, 42195);
    expect(result.isValid).toBe(false);
    expect(result.warning).toBeDefined();
  });

  it('accepts 5K → Marathon prediction as valid (ratio ~8.4x)', () => {
    const result = ValidationLayer.validateRacePrediction(5000, 42195);
    expect(result.isValid).toBe(true);
  });

  it('builds multi-factor confidence DTO correctly', () => {
    const dto = ValidationLayer.buildConfidenceScore(20, true, true, 0.9, ['Flat terrain assumed.']);
    expect(dto.confidence).toBeGreaterThan(0.8);
    expect(dto.providerQuality).toBe('excellent');
    expect(dto.assumptions).toContain('Flat terrain assumed.');
  });
});

// ─── LITERATURE REGISTRY ─────────────────────────────────────────────────────
describe('LiteratureRegistry', () => {
  it('returns all 8 registered scientific references', () => {
    const refs = LiteratureRegistry.getAllReferences();
    expect(refs.length).toBeGreaterThanOrEqual(8);
  });

  it('has required fields on Daniels reference', () => {
    const ref = LiteratureRegistry.getReference('daniels_vdot');
    expect(ref).toBeDefined();
    expect(ref?.isbnOrDoi).toContain('ISBN');
    expect(ref?.assumptions.length).toBeGreaterThan(0);
  });
});
