import { PHYSIOLOGY_CONFIG } from '../config/physiology.config.js';
import { LiteratureRegistry, ScientificReference } from '../registry/literature.registry.js';

export interface SeilerModelResult {
  zone1MaxHr: number;
  zone2MaxHr: number;
  zone3MinHr: number;
  classifiedModel: 'Polarized' | 'Pyramidal' | 'Threshold' | 'Unstructured';
  summaryText: string;
  reference: ScientificReference;
}

export class SeilerModel {
  public static calculate3ZoneBoundaries(lthr: number, maxHr: number): { z1MaxHr: number; z2MaxHr: number } {
    const z1Max = Math.round(lthr * PHYSIOLOGY_CONFIG.seilerZone1MaxRatioLthr);
    const z2Max = Math.round(lthr * PHYSIOLOGY_CONFIG.seilerZone2MaxRatioLthr);
    return { z1MaxHr: z1Max, z2MaxHr: z2Max };
  }

  public static classifyTID(z1TimeSec: number, z2TimeSec: number, z3TimeSec: number, lthr: number, maxHr: number): SeilerModelResult {
    const totalTime = z1TimeSec + z2TimeSec + z3TimeSec || 1;
    const z1Pct = Math.round((z1TimeSec / totalTime) * 100);
    const z2Pct = Math.round((z2TimeSec / totalTime) * 100);
    const z3Pct = Math.round((z3TimeSec / totalTime) * 100);

    const boundaries = this.calculate3ZoneBoundaries(lthr, maxHr);
    const ref = LiteratureRegistry.getReference('seiler_tid')!;

    let classifiedModel: SeilerModelResult['classifiedModel'] = 'Unstructured';
    let summaryText = '';

    if (z1Pct >= 75 && z3Pct >= 10 && z2Pct <= 15) {
      classifiedModel = 'Polarized';
      summaryText = `Polarized model (${z1Pct}% Z1 / ${z2Pct}% Z2 / ${z3Pct}% Z3). Excellent alignment with Seiler 80/20 principle.`;
    } else if (z1Pct >= 65 && z2Pct > z3Pct) {
      classifiedModel = 'Pyramidal';
      summaryText = `Pyramidal model (${z1Pct}% Z1 / ${z2Pct}% Z2 / ${z3Pct}% Z3). Aerobic foundation with progressive threshold work.`;
    } else if (z2Pct >= 25) {
      classifiedModel = 'Threshold';
      summaryText = `Threshold model (${z1Pct}% Z1 / ${z2Pct}% Z2 / ${z3Pct}% Z3). Dominant time spent in tempo/sub-threshold.`;
    } else {
      classifiedModel = 'Unstructured';
      summaryText = `Unstructured distribution (${z1Pct}% Z1 / ${z2Pct}% Z2 / ${z3Pct}% Z3).`;
    }

    return {
      zone1MaxHr: boundaries.z1MaxHr,
      zone2MaxHr: boundaries.z2MaxHr,
      zone3MinHr: boundaries.z2MaxHr + 1,
      classifiedModel,
      summaryText,
      reference: ref,
    };
  }
}
