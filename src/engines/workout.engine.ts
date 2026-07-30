import { Activity } from '../domain/activity.js';
import { formatPace, formatDuration } from '../utils/formatters.js';

export interface WorkoutBreakdown {
  warmupLapCount: number;
  warmupDistanceMeters: number;
  mainSetLapCount: number;
  mainSetDistanceMeters: number;
  cooldownLapCount: number;
  cooldownDistanceMeters: number;
  summaryText: string;
}

export class WorkoutEngine {
  /**
   * Analyzes activity laps to classify Warmup, Main Set, and Cooldown
   */
  public static analyzeLaps(activity: Activity): WorkoutBreakdown {
    const laps = activity.laps;
    if (!laps || laps.length < 3) {
      return {
        warmupLapCount: 0,
        warmupDistanceMeters: 0,
        mainSetLapCount: laps ? laps.length : 0,
        mainSetDistanceMeters: activity.distanceMeters,
        cooldownLapCount: 0,
        cooldownDistanceMeters: 0,
        summaryText: `Continuous session: Total ${activity.distanceMeters / 1000} km in ${formatDuration(activity.movingTimeSeconds)} @ ${formatPace(activity.averagePaceSecPerKm)}`,
      };
    }

    const warmupLap = laps[0];
    const cooldownLap = laps[laps.length - 1];
    const mainLaps = laps.slice(1, laps.length - 1);

    const mainDist = mainLaps.reduce((acc, l) => acc + l.distanceMeters, 0);

    return {
      warmupLapCount: 1,
      warmupDistanceMeters: warmupLap.distanceMeters,
      mainSetLapCount: mainLaps.length,
      mainSetDistanceMeters: mainDist,
      cooldownLapCount: 1,
      cooldownDistanceMeters: cooldownLap.distanceMeters,
      summaryText: `Warmup: ${(warmupLap.distanceMeters / 1000).toFixed(1)} km, Main Set: ${mainLaps.length} reps (${(mainDist / 1000).toFixed(1)} km), Cooldown: ${(cooldownLap.distanceMeters / 1000).toFixed(1)} km`,
    };
  }
}
