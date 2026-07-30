import { Activity } from '../domain/activity.js';
import { ACWRModel, ACWRModelResult } from '../models/acwr.model.js';
import { ValidationLayer, ScientificConfidenceDTO } from '../utils/validation.js';

export interface InjuryRiskEngineResult {
  acwrModel: ACWRModelResult;
  confidence: ScientificConfidenceDTO;
}

export class InjuryRiskEngine {
  public static calculateACWR(activities: Activity[]): InjuryRiskEngineResult {
    const sorted = [...activities].sort((a, b) => new Date(b.startDateLocal).getTime() - new Date(a.startDateLocal).getTime());

    const last7Days = sorted.slice(0, 7);
    const last28Days = sorted.slice(0, 28);

    const loads7d = last7Days.map((a) => a.trainingLoad || 50);
    const loads28d = last28Days.map((a) => a.trainingLoad || 50);

    const acwrRes = ACWRModel.calculateACWR(loads7d, loads28d);

    const confidence = ValidationLayer.buildConfidenceScore(
      activities.length,
      true,
      false,
      0.82,
      ['EWMA Acute (7d) vs Chronic (28d) Workload Ratio', 'ACWR ratio guideline (0.8 - 1.3 sweet spot, >1.5 high risk)']
    );

    return {
      acwrModel: acwrRes,
      confidence,
    };
  }
}
