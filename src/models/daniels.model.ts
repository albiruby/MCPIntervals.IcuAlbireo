import { PHYSIOLOGY_CONFIG } from '../config/physiology.config.js';
import { LiteratureRegistry, ScientificReference } from '../registry/literature.registry.js';

export interface DanielsModelResult {
  vdot: number;
  easyPaceSecKm: number;
  marathonPaceSecKm: number;
  thresholdPaceSecKm: number;
  intervalPaceSecKm: number;
  repetitionPaceSecKm: number;
  reference: ScientificReference;
}

export class DanielsModel {
  /**
   * Calculates Daniels VDOT rating from race distance (meters) and finish time (seconds)
   */
  public static calculateVDOT(distanceMeters: number, timeSeconds: number): number {
    const timeMinutes = timeSeconds / 60;
    const velocityMpm = distanceMeters / timeMinutes;

    const c = PHYSIOLOGY_CONFIG;

    const percentMax =
      c.danielsPercentMaxCoeff1 +
      c.danielsPercentMaxCoeff2 * Math.exp(c.danielsPercentMaxCoeff3 * timeMinutes) +
      c.danielsPercentMaxCoeff4 * Math.exp(c.danielsPercentMaxCoeff5 * timeMinutes);

    const vo2Req = c.danielsVo2Coeff1 + c.danielsVo2Coeff2 * velocityMpm + c.danielsVo2Coeff3 * Math.pow(velocityMpm, 2);

    const vdot = vo2Req / percentMax;
    return Math.round(vdot * 10) / 10;
  }

  /**
   * Generates training paces based on VDOT rating
   */
  public static calculatePacesFromVDOT(vdot: number, ltPaceSecKm: number): DanielsModelResult {
    const ref = LiteratureRegistry.getReference('daniels_vdot')!;

    return {
      vdot,
      easyPaceSecKm: Math.round(ltPaceSecKm * 1.3),
      marathonPaceSecKm: Math.round(ltPaceSecKm * 1.12),
      thresholdPaceSecKm: ltPaceSecKm,
      intervalPaceSecKm: Math.round(ltPaceSecKm * 0.93),
      repetitionPaceSecKm: Math.round(ltPaceSecKm * 0.85),
      reference: ref,
    };
  }
}
