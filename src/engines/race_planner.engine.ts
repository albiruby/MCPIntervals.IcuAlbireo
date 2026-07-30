import { AthleteProfile } from '../domain/athlete.js';
import { formatDuration, formatPace } from '../utils/formatters.js';

export interface RacePlan {
  distanceName: string;
  targetTimeFormatted: string;
  averagePaceFormatted: string;
  strategy: 'Negative Split (Recommended)' | 'Even Pacing' | 'Positive Split';
  splits: Array<{ km: number; targetPaceFormatted: string; cumulativeTimeFormatted: string; notes?: string }>;
  fuelingMilestones: string[];
}

export class RacePlannerEngine {
  /**
   * Generates a complete race execution plan with negative split strategy
   */
  public static generateRacePlan(profile: AthleteProfile, distanceKm: number, targetTimeSeconds: number): RacePlan {
    const avgPaceSecKm = targetTimeSeconds / distanceKm;
    const distanceName = distanceKm >= 42 ? 'Marathon' : distanceKm >= 21 ? 'Half Marathon' : `${distanceKm}K`;

    const splits = [];
    const fuelingMilestones = [];

    // Negative split strategy: First 30% slightly conservative (+3s/km), Middle 50% target pace, Final 20% push (-3s/km)
    let cumulativeSec = 0;
    for (let km = 1; km <= Math.ceil(distanceKm); km++) {
      let kmPace = avgPaceSecKm;
      if (km <= distanceKm * 0.3) {
        kmPace = avgPaceSecKm + 3; // controlled start
      } else if (km >= distanceKm * 0.8) {
        kmPace = avgPaceSecKm - 3; // finish strong
      }

      cumulativeSec += kmPace;
      splits.push({
        km,
        targetPaceFormatted: formatPace(kmPace),
        cumulativeTimeFormatted: formatDuration(cumulativeSec),
        notes: km === 1 ? 'Control adrenaline! Save energy.' : km === Math.round(distanceKm * 0.8) ? 'Final surge! Empty the tank.' : undefined,
      });

      // Gel schedule every 7km (~30 mins)
      if (km % 7 === 0 && km < distanceKm - 3) {
        fuelingMilestones.push(`KM ${km}: Take Gel #1 (${formatDuration(cumulativeSec)}) + 150ml water`);
      }
    }

    return {
      distanceName,
      targetTimeFormatted: formatDuration(targetTimeSeconds),
      averagePaceFormatted: formatPace(avgPaceSecKm),
      strategy: 'Negative Split (Recommended)',
      splits,
      fuelingMilestones,
    };
  }
}
