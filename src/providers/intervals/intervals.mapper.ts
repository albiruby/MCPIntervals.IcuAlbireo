import { AthleteProfile } from '../../domain/athlete.js';
import { Activity, ActivityType, ActivityStream } from '../../domain/activity.js';
import { IntervalsAthleteResponse, IntervalsActivityResponse, IntervalsStreamResponse } from './types.js';
import { speedMpsToPaceSecKm } from '../../utils/formatters.js';

export class IntervalsMapper {
  public static mapAthlete(raw: IntervalsAthleteResponse): AthleteProfile {
    const maxHr = raw.icu_max_hr || 190;
    const restHr = raw.icu_resting_hr || 50;
    const lthr = raw.icu_lthr || Math.round(maxHr * 0.88);
    const ltPaceMps = raw.icu_threshold_pace || 3.7; // default ~4:30 /km
    const ltPaceSecKm = speedMpsToPaceSecKm(ltPaceMps);

    return {
      id: raw.id,
      name: raw.name || 'Intervals Athlete',
      weightKg: raw.weight || 70,
      maxHeartRate: maxHr,
      restingHeartRate: restHr,
      lthr,
      ltPaceSecPerKm: ltPaceSecKm,
      criticalSpeedMps: ltPaceMps,
      vdot: raw.icu_vdot || 48.0,
      hrZones: {
        z1: { min: restHr, max: Math.round(maxHr * 0.68), name: 'Active Recovery' },
        z2: { min: Math.round(maxHr * 0.68) + 1, max: Math.round(maxHr * 0.78), name: 'Aerobic / Endurance' },
        z3: { min: Math.round(maxHr * 0.78) + 1, max: Math.round(maxHr * 0.86), name: 'Tempo' },
        z4: { min: Math.round(maxHr * 0.86) + 1, max: lthr, name: 'Lactate Threshold' },
        z5: { min: lthr + 1, max: maxHr, name: 'Anaerobic / VO2max' },
      },
      paceZones: {
        z1: { minPaceSec: ltPaceSecKm * 1.25, maxPaceSec: ltPaceSecKm * 1.45, name: 'Easy / Recovery' },
        z2: { minPaceSec: ltPaceSecKm * 1.1, maxPaceSec: ltPaceSecKm * 1.24, name: 'Marathon Pace' },
        z3: { minPaceSec: ltPaceSecKm * 1.01, maxPaceSec: ltPaceSecKm * 1.09, name: 'Threshold Pace' },
        z4: { minPaceSec: ltPaceSecKm * 0.92, maxPaceSec: ltPaceSecKm * 1.0, name: 'Interval / VO2max Pace' },
        z5: { minPaceSec: ltPaceSecKm * 0.82, maxPaceSec: ltPaceSecKm * 0.91, name: 'Repetition / Sprint' },
      },
    };
  }

  public static mapActivity(raw: IntervalsActivityResponse): Activity {
    const avgSpeed = raw.average_speed || 0;
    const avgPace = speedMpsToPaceSecKm(avgSpeed);

    return {
      id: raw.id,
      externalId: raw.external_id,
      name: raw.name || 'Untitled Activity',
      type: (raw.type as ActivityType) || 'Run',
      startDateLocal: raw.start_date_local,
      distanceMeters: raw.distance || 0,
      movingTimeSeconds: raw.moving_time || 0,
      elapsedTimeSeconds: raw.elapsed_time || raw.moving_time || 0,
      averageSpeedMps: avgSpeed,
      averagePaceSecPerKm: avgPace,
      maxSpeedMps: raw.max_speed || 0,
      averageHeartRate: raw.average_heartrate,
      maxHeartRate: raw.max_heartrate,
      averagePowerWatts: raw.average_watts,
      maxPowerWatts: raw.max_watts,
      averageCadenceRpm: raw.average_cadence,
      elevationGainMeters: raw.total_elevation_gain || 0,
      trainingLoad: raw.icu_training_load || 0,
      decouplingPercentage: raw.decoupling,
      laps: raw.icu_laps?.map((l) => ({
        index: l.index,
        name: l.name,
        distanceMeters: l.distance,
        movingTimeSeconds: l.moving_time,
        elapsedTimeSeconds: l.elapsed_time,
        averageSpeedMps: l.average_speed,
        averagePaceSecPerKm: speedMpsToPaceSecKm(l.average_speed),
        averageHeartRate: l.average_heartrate,
        maxHeartRate: l.max_heartrate,
        averagePowerWatts: l.average_watts,
        averageCadenceRpm: l.average_cadence,
        elevationGainMeters: l.total_elevation_gain,
      })),
    };
  }

  public static mapStream(raw: IntervalsStreamResponse): ActivityStream {
    return {
      timeSeconds: raw.time?.data || [],
      distanceMeters: raw.distance?.data,
      heartRateBpm: raw.heartrate?.data,
      speedMps: raw.velocity_smooth?.data,
      paceSecPerKm: raw.velocity_smooth?.data?.map((s) => speedMpsToPaceSecKm(s)),
      powerWatts: raw.watts?.data,
      cadenceRpm: raw.cadence?.data,
      altitudeMeters: raw.altitude?.data,
    };
  }
}
