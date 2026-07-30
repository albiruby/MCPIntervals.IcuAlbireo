import { RiegelModel, RiegelPredictionResult } from '../models/riegel.model.js';
import { DanielsModel } from '../models/daniels.model.js';
import { ValidationLayer, ScientificConfidenceDTO } from '../utils/validation.js';

export interface MultiModelPredictionResult {
  targetDistanceName: string;
  targetDistanceMeters: number;
  riegelModel: RiegelPredictionResult;
  danielsVdotEstimate: number;
  isValid: boolean;
  warning?: string;
  confidence: ScientificConfidenceDTO;
}

export class PredictionEngine {
  private static readonly STANDARD_RACES = [
    { name: '1K', distance: 1000 },
    { name: '1 Mile', distance: 1609.34 },
    { name: '3K', distance: 3000 },
    { name: '5K', distance: 5000 },
    { name: '10K', distance: 10000 },
    { name: 'Half Marathon', distance: 21097.5 },
    { name: 'Marathon', distance: 42195 },
  ];

  public static predictRace(knownDistMeters: number, knownTimeSec: number, targetDistMeters: number): MultiModelPredictionResult {
    const val = ValidationLayer.validateRacePrediction(knownDistMeters, targetDistMeters);
    const riegelRes = RiegelModel.predictRace(knownDistMeters, knownTimeSec, targetDistMeters);
    const vdot = DanielsModel.calculateVDOT(knownDistMeters, knownTimeSec);

    const matchName = this.STANDARD_RACES.find((r) => Math.abs(r.distance - targetDistMeters) < 200)?.name || `${(targetDistMeters / 1000).toFixed(1)}K`;

    const confidence = ValidationLayer.buildConfidenceScore(
      1,
      true,
      false,
      val.isValid ? 0.85 : 0.4,
      ['Riegel formula T2 = T1 * (D2/D1)^1.06', 'Daniels VDOT oxygen curve comparison']
    );

    return {
      targetDistanceName: matchName,
      targetDistanceMeters: targetDistMeters,
      riegelModel: riegelRes,
      danielsVdotEstimate: vdot,
      isValid: val.isValid,
      warning: val.warning,
      confidence,
    };
  }

  public static predictAllRaces(knownDistMeters: number, knownTimeSec: number): MultiModelPredictionResult[] {
    return this.STANDARD_RACES.map((race) => this.predictRace(knownDistMeters, knownTimeSec, race.distance));
  }
}
