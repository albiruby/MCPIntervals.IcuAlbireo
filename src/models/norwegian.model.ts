import { LiteratureRegistry, ScientificReference } from '../registry/literature.registry.js';
import { formatPace } from '../utils/formatters.js';

export interface NorwegianModelResult {
  targetSubLt2HrMin: number;
  targetSubLt2HrMax: number;
  targetSubLt2PaceFormatted: string;
  lactateTargetMmol: string;
  recommendation: string;
  reference: ScientificReference;
}

export class NorwegianModel {
  public static calculateDoubleThresholdTargets(lthr: number, ltPaceSecKm: number): NorwegianModelResult {
    const ref = LiteratureRegistry.getReference('norwegian_method')!;
    const minHr = lthr - 8;
    const maxHr = lthr - 2;
    const pace = Math.round(ltPaceSecKm * 1.03);

    return {
      targetSubLt2HrMin: minHr,
      targetSubLt2HrMax: maxHr,
      targetSubLt2PaceFormatted: formatPace(pace),
      lactateTargetMmol: '2.5 - 3.5 mmol/L',
      recommendation: `Norwegian Double Threshold protocol: Execute 2 threshold sessions/day @ sub-LT2 HR (${minHr}-${maxHr} bpm, pace ${formatPace(pace)}). Strictly control lactate <3.5 mmol/L.`,
      reference: ref,
    };
  }
}
