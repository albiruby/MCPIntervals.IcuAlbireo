import { LiteratureRegistry, ScientificReference } from '../registry/literature.registry.js';
import { formatPace } from '../utils/formatters.js';

export interface CriticalSpeedResult {
  criticalSpeedMps: number;
  criticalPaceSecKm: number;
  criticalPaceFormatted: string;
  anaerobicWorkCapacityMeters: number; // D'
  reference: ScientificReference;
}

export class CriticalSpeedModel {
  /**
   * Calculates Critical Speed (CS) and Anaerobic Distance Capacity (D') from two 2 all-out efforts
   */
  public static calculateFromTwoEfforts(d1Meters: number, t1Seconds: number, d2Meters: number, t2Seconds: number): CriticalSpeedResult {
    const ref = LiteratureRegistry.getReference('critical_speed')!;

    // Slope of Distance vs Time line is Critical Speed (m/s)
    const csMps = (d2Meters - d1Meters) / (t2Seconds - t1Seconds);
    const dPrimeMeters = d1Meters - csMps * t1Seconds;
    const csPaceSecKm = 1000 / (csMps || 1);

    return {
      criticalSpeedMps: Math.round(csMps * 100) / 100,
      criticalPaceSecKm: Math.round(csPaceSecKm),
      criticalPaceFormatted: formatPace(csPaceSecKm),
      anaerobicWorkCapacityMeters: Math.round(dPrimeMeters),
      reference: ref,
    };
  }
}
