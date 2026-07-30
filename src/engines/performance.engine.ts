import { Activity } from '../domain/activity.js';
import { AthleteProfile } from '../domain/athlete.js';
import { BanisterModel, BanisterModelResult } from '../models/banister.model.js';
import { DanielsModel } from '../models/daniels.model.js';
import { ValidationLayer, ScientificConfidenceDTO } from '../utils/validation.js';

export interface PerformanceEngineResult {
  pmc: BanisterModelResult;
  vdot: number;
  marathonShapeScore: number;
  confidence: ScientificConfidenceDTO;
}

export class PerformanceEngine {
  public static calculatePMC(activities: Activity[]): BanisterModelResult {
    const loads = activities.map((a) => ({
      date: a.startDateLocal,
      load: a.trainingLoad || 50,
    }));
    return BanisterModel.calculatePMC(loads);
  }

  public static calculateVDOTFromRace(distanceMeters: number, timeSeconds: number): number {
    return DanielsModel.calculateVDOT(distanceMeters, timeSeconds);
  }

  public static calculateMarathonShape(activities: Activity[], profile: AthleteProfile): { score: number; status: string } {
    const totalDist = activities.reduce((acc, a) => acc + a.distanceMeters, 0) / 1000;
    const maxLongRun = Math.max(...activities.map((a) => a.distanceMeters), 0) / 1000;

    let score = 50;
    if (totalDist > 150) score += 25;
    else if (totalDist > 100) score += 15;

    if (maxLongRun >= 30) score += 25;
    else if (maxLongRun >= 24) score += 15;

    let status = 'Developing Base';
    if (score >= 85) status = 'Peak Marathon Ready';
    else if (score >= 70) status = 'Solid Marathon Shape';
    else if (score >= 50) status = 'Moderate Base';

    return { score, status };
  }
}
