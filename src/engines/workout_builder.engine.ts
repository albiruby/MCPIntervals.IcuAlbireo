import { AthleteProfile } from '../domain/athlete.js';
import { StructuredWorkout } from '../domain/workout.js';
import { formatPace } from '../utils/formatters.js';

export class WorkoutBuilderEngine {
  /**
   * Builds structured Threshold Cruise Intervals (e.g. 5x1000m @ LT Pace w/ 60s jog rest)
   */
  public static buildThresholdWorkout(profile: AthleteProfile, repetitions: number = 5, distMeters: number = 1000): StructuredWorkout {
    const ltPace = profile.ltPaceSecPerKm;

    return {
      title: `${repetitions}x${distMeters}m Threshold Cruise Intervals`,
      category: 'Threshold',
      description: `Classic Jack Daniels Cruise Intervals at LT Pace (${formatPace(ltPace)}) with 60s rest`,
      totalDistanceMeters: distMeters * repetitions + 3000,
      estimatedDurationSeconds: (distMeters / 1000) * ltPace * repetitions + 60 * repetitions + 1200,
      warmup: {
        type: 'Warmup',
        distanceMeters: 2000,
        description: `2km Easy Warmup @ ${formatPace(ltPace * 1.3)}`,
      },
      mainSet: [
        {
          repeatCount: repetitions,
          description: `${repetitions} Repetitions of ${distMeters}m @ LT Pace (${formatPace(ltPace)}) w/ 60s recovery jog`,
          steps: [
            {
              type: 'Active',
              distanceMeters: distMeters,
              targetPaceSecPerKm: { min: ltPace - 3, max: ltPace + 3 },
              description: `Run ${distMeters}m @ ${formatPace(ltPace)}`,
            },
            {
              type: 'Rest',
              durationSeconds: 60,
              description: '60s Easy Recovery Jog',
            },
          ],
        },
      ],
      cooldown: {
        type: 'Cooldown',
        distanceMeters: 1000,
        description: `1km Easy Cooldown @ ${formatPace(ltPace * 1.35)}`,
      },
      textInstructions: `- Warmup: 2km Easy\n- Main Set: ${repetitions}x${distMeters}m @ ${formatPace(ltPace)} (60s jog rest)\n- Cooldown: 1km Easy`,
    };
  }

  /**
   * Builds structured VO2max Workout (e.g. 5x3min @ 5K Pace w/ 2min jog rest)
   */
  public static buildVo2MaxWorkout(profile: AthleteProfile, repetitions: number = 5, durationSec: number = 180): StructuredWorkout {
    const vo2Pace = Math.round(profile.ltPaceSecPerKm * 0.93);

    return {
      title: `${repetitions}x3min VO2max Intervals`,
      category: 'VO2max',
      description: `High-intensity VO2max intervals at 5K Pace (${formatPace(vo2Pace)}) with 2min recovery`,
      estimatedDurationSeconds: (durationSec + 120) * repetitions + 1200,
      warmup: {
        type: 'Warmup',
        distanceMeters: 2000,
        description: `2km Warmup + Dynamic Drills`,
      },
      mainSet: [
        {
          repeatCount: repetitions,
          description: `${repetitions} Repetitions of 3-min @ VO2max Pace (${formatPace(vo2Pace)}) w/ 2min jog rest`,
          steps: [
            {
              type: 'Active',
              durationSeconds: durationSec,
              targetPaceSecPerKm: { min: vo2Pace - 4, max: vo2Pace + 4 },
              description: `Run 3 mins @ ${formatPace(vo2Pace)}`,
            },
            {
              type: 'Rest',
              durationSeconds: 120,
              description: '2 mins Easy Recovery Jog',
            },
          ],
        },
      ],
      cooldown: {
        type: 'Cooldown',
        distanceMeters: 1500,
        description: `1.5km Easy Cooldown`,
      },
      textInstructions: `- Warmup: 2km Easy\n- Main Set: ${repetitions}x3min @ ${formatPace(vo2Pace)} (2min jog rest)\n- Cooldown: 1.5km Easy`,
    };
  }
}
