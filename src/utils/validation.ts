import { PHYSIOLOGY_CONFIG } from '../config/physiology.config.js';

export interface ScientificConfidenceDTO {
  confidence: number; // 0.0 to 1.0 overall score
  dataQuality: number; // 0.0 to 1.0 based on data completeness
  modelConfidence: number; // 0.0 to 1.0 based on model appropriateness
  providerQuality: 'excellent' | 'good' | 'fair' | 'poor';
  assumptions: string[];
  warnings: string[];
}

export class ValidationLayer {
  /**
   * Validates race prediction appropriateness (e.g. rejects predicting 42k marathon from 400m sprint)
   */
  public static validateRacePrediction(sampleDistanceMeters: number, targetDistanceMeters: number): { isValid: boolean; warning?: string } {
    const minMeters = PHYSIOLOGY_CONFIG.minValidRaceDistanceMeters;
    if (sampleDistanceMeters < minMeters) {
      return {
        isValid: false,
        warning: `Sample distance (${sampleDistanceMeters}m) is below minimum valid threshold (${minMeters}m). Prediction NOT recommended.`,
      };
    }

    const ratio = targetDistanceMeters / sampleDistanceMeters;
    if (ratio > PHYSIOLOGY_CONFIG.maxPredictionRatioLimit) {
      return {
        isValid: false,
        warning: `Target distance (${(targetDistanceMeters / 1000).toFixed(1)}km) is ${ratio.toFixed(1)}x greater than sample distance. Prediction confidence is VERY LOW.`,
      };
    }

    return { isValid: true };
  }

  /**
   * Builds multi-factor confidence assessment
   */
  public static buildConfidenceScore(
    sampleCount: number,
    hasHeartRate: boolean,
    hasPower: boolean,
    modelConfidenceBase: number = 0.85,
    assumptionsList: string[] = []
  ): ScientificConfidenceDTO {
    let dataQuality = 0.6;
    if (sampleCount >= 10) dataQuality += 0.2;
    if (hasHeartRate) dataQuality += 0.1;
    if (hasPower) dataQuality += 0.1;

    dataQuality = Math.min(1.0, dataQuality);

    const warnings: string[] = [];
    if (!hasHeartRate) warnings.push('Heart rate stream missing; relying on pace estimates.');

    const overallConfidence = Math.round(((dataQuality + modelConfidenceBase) / 2) * 100) / 100;

    let providerQuality: ScientificConfidenceDTO['providerQuality'] = 'excellent';
    if (dataQuality < 0.7) providerQuality = 'fair';

    return {
      confidence: overallConfidence,
      dataQuality: Math.round(dataQuality * 100) / 100,
      modelConfidence: modelConfidenceBase,
      providerQuality,
      assumptions: assumptionsList,
      warnings,
    };
  }
}
