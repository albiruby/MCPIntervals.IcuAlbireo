import { Activity } from '../domain/activity.js';
import { AthleteProfile } from '../domain/athlete.js';
import { SeilerModel, SeilerModelResult } from '../models/seiler.model.js';
import { ValidationLayer, ScientificConfidenceDTO } from '../utils/validation.js';

export interface TIDEngineResult {
  zone1TimeSec: number;
  zone2TimeSec: number;
  zone3TimeSec: number;
  zone1Percentage: number;
  zone2Percentage: number;
  zone3Percentage: number;
  modelResult: SeilerModelResult;
  confidence: ScientificConfidenceDTO;
}

export class TIDEngine {
  public static calculateTID(activities: Activity[], profile: AthleteProfile): TIDEngineResult {
    let z1Time = 0;
    let z2Time = 0;
    let z3Time = 0;

    const boundaries = SeilerModel.calculate3ZoneBoundaries(profile.lthr, profile.maxHeartRate);

    for (const act of activities) {
      if (!act.movingTimeSeconds) continue;
      const hr = act.averageHeartRate || profile.restingHeartRate + 80;

      if (hr <= boundaries.z1MaxHr) {
        z1Time += act.movingTimeSeconds;
      } else if (hr <= boundaries.z2MaxHr) {
        z2Time += act.movingTimeSeconds;
      } else {
        z3Time += act.movingTimeSeconds;
      }
    }

    const totalTime = z1Time + z2Time + z3Time || 1;
    const z1Pct = Math.round((z1Time / totalTime) * 100);
    const z2Pct = Math.round((z2Time / totalTime) * 100);
    const z3Pct = Math.round((z3Time / totalTime) * 100);

    const modelResult = SeilerModel.classifyTID(z1Time, z2Time, z3Time, profile.lthr, profile.maxHeartRate);

    const confidence = ValidationLayer.buildConfidenceScore(
      activities.length,
      activities.some((a) => !!a.averageHeartRate),
      false,
      0.88,
      ['3-zone boundaries determined by Seiler Aerobic (LT1) & Anaerobic (LT2) thresholds.']
    );

    return {
      zone1TimeSec: z1Time,
      zone2TimeSec: z2Time,
      zone3TimeSec: z3Time,
      zone1Percentage: z1Pct,
      zone2Percentage: z2Pct,
      zone3Percentage: z3Pct,
      modelResult,
      confidence,
    };
  }
}
