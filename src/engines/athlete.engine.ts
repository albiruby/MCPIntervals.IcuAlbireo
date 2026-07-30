import { AthleteProfile, HeartRateZones, PaceZones } from '../domain/athlete.js';

export class AthleteEngine {
  /**
   * Recalculates HR Zones based on Lactate Threshold HR (LTHR) using 5-zone Karvonen/LTHR model
   */
  public static calculateHrZonesFromLthr(lthr: number, maxHr: number, restHr: number): HeartRateZones {
    return {
      z1: { min: restHr, max: Math.round(lthr * 0.81), name: 'Active Recovery (Z1)' },
      z2: { min: Math.round(lthr * 0.81) + 1, max: Math.round(lthr * 0.89), name: 'Aerobic / Endurance (Z2)' },
      z3: { min: Math.round(lthr * 0.89) + 1, max: Math.round(lthr * 0.94), name: 'Tempo (Z3)' },
      z4: { min: Math.round(lthr * 0.94) + 1, max: lthr, name: 'Sub-Threshold / LTHR (Z4)' },
      z5: { min: lthr + 1, max: maxHr, name: 'VO2max / Anaerobic (Z5)' },
    };
  }

  /**
   * Recalculates Pace Zones from Lactate Threshold Pace (seconds/km)
   */
  public static calculatePaceZonesFromLt(ltPaceSecKm: number): PaceZones {
    return {
      z1: { minPaceSec: Math.round(ltPaceSecKm * 1.25), maxPaceSec: Math.round(ltPaceSecKm * 1.45), name: 'Easy / Recovery' },
      z2: { minPaceSec: Math.round(ltPaceSecKm * 1.1), maxPaceSec: Math.round(ltPaceSecKm * 1.24), name: 'Marathon Pace' },
      z3: { minPaceSec: Math.round(ltPaceSecKm * 1.01), maxPaceSec: Math.round(ltPaceSecKm * 1.09), name: 'Threshold Pace' },
      z4: { minPaceSec: Math.round(ltPaceSecKm * 0.92), maxPaceSec: Math.round(ltPaceSecKm * 1.0), name: 'Interval / VO2max Pace' },
      z5: { minPaceSec: Math.round(ltPaceSecKm * 0.8), maxPaceSec: Math.round(ltPaceSecKm * 0.91), name: 'Repetition / Sprint' },
    };
  }
}
