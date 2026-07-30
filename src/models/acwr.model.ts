import { PHYSIOLOGY_CONFIG } from '../config/physiology.config.js';
import { LiteratureRegistry, ScientificReference } from '../registry/literature.registry.js';
import { mean, standardDeviation } from '../utils/math.js';

export interface ACWRModelResult {
  acuteLoad7d: number;
  chronicLoad28d: number;
  acwr: number;
  monotony: number;
  strain: number;
  riskLevel: 'Low Risk (<0.8 or 0.8-1.3)' | 'Moderate Risk (1.3-1.5)' | 'High Risk (>1.5)';
  recommendation: string;
  reference: ScientificReference;
}

export class ACWRModel {
  public static calculateACWR(dailyLoads7d: number[], dailyLoads28d: number[]): ACWRModelResult {
    const ref = LiteratureRegistry.getReference('acwr_model')!;
    const c = PHYSIOLOGY_CONFIG;

    const acute7d = dailyLoads7d.reduce((a, b) => a + b, 0);
    const chronic28d = dailyLoads28d.reduce((a, b) => a + b, 0) / 4;

    const acwr = Math.round((acute7d / (chronic28d || 1)) * 100) / 100;

    const avgLoad7d = mean(dailyLoads7d);
    const stdDev7d = standardDeviation(dailyLoads7d);
    const monotony = Math.round((avgLoad7d / (stdDev7d || 1)) * 100) / 100;
    const strain = Math.round(acute7d * monotony);

    let riskLevel: ACWRModelResult['riskLevel'] = 'Low Risk (<0.8 or 0.8-1.3)';
    let recommendation = 'Workload ratio is within safe sweet-spot (0.8 - 1.3).';

    if (acwr > c.acwrHighRiskThreshold) {
      riskLevel = 'High Risk (>1.5)';
      recommendation = 'HIGH INJURY RISK! Workload spike detected (ACWR > 1.5). Reduce weekly volume by 20-30%.';
    } else if (acwr > c.acwrSweetSpotMax) {
      riskLevel = 'Moderate Risk (1.3-1.5)';
      recommendation = 'Workload is rapidly increasing (ACWR 1.3 - 1.5). Monitor muscle tightness closely.';
    } else if (acwr < c.acwrSweetSpotMin) {
      riskLevel = 'Low Risk (<0.8 or 0.8-1.3)';
      recommendation = 'Workload is low (ACWR < 0.8). Risk of undertraining if maintained prolonged.';
    }

    return {
      acuteLoad7d: Math.round(acute7d),
      chronicLoad28d: Math.round(chronic28d),
      acwr,
      monotony,
      strain,
      riskLevel,
      recommendation,
      reference: ref,
    };
  }
}
