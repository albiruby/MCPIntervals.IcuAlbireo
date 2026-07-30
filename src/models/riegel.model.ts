import { PHYSIOLOGY_CONFIG } from '../config/physiology.config.js';
import { LiteratureRegistry, ScientificReference } from '../registry/literature.registry.js';
import { formatDuration, formatPace } from '../utils/formatters.js';

export interface RiegelPredictionResult {
  targetDistanceMeters: number;
  predictedTimeSeconds: number;
  formattedTime: string;
  predictedPaceSecKm: number;
  formattedPace: string;
  reference: ScientificReference;
}

export class RiegelModel {
  /**
   * Predicts race time using Riegel formula: T2 = T1 * (D2 / D1)^1.06
   */
  public static predictRace(knownDistMeters: number, knownTimeSec: number, targetDistMeters: number): RiegelPredictionResult {
    const ref = LiteratureRegistry.getReference('riegel_model')!;
    const exponent = PHYSIOLOGY_CONFIG.riegelExponent;

    const predictedSec = knownTimeSec * Math.pow(targetDistMeters / knownDistMeters, exponent);
    const paceSecKm = (predictedSec / targetDistMeters) * 1000;

    return {
      targetDistanceMeters: targetDistMeters,
      predictedTimeSeconds: Math.round(predictedSec),
      formattedTime: formatDuration(predictedSec),
      predictedPaceSecKm: Math.round(paceSecKm),
      formattedPace: formatPace(paceSecKm),
      reference: ref,
    };
  }
}
