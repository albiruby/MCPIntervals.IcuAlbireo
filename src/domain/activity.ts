export type ActivityType =
  | 'Run'
  | 'TrailRun'
  | 'Treadmill'
  | 'VirtualRun'
  | 'Ride'
  | 'VirtualRide'
  | 'Swim'
  | 'Walk'
  | 'Hike'
  | 'WeightTraining'
  | 'Workout';

export interface ActivityLap {
  index: number;
  name?: string;
  distanceMeters: number;
  movingTimeSeconds: number;
  elapsedTimeSeconds: number;
  averageSpeedMps: number;
  averagePaceSecPerKm: number;
  averageHeartRate?: number;
  maxHeartRate?: number;
  averagePowerWatts?: number;
  averageCadenceRpm?: number;
  elevationGainMeters?: number;
}

export interface ActivityStream {
  timeSeconds: number[];
  distanceMeters?: number[];
  heartRateBpm?: number[];
  speedMps?: number[];
  paceSecPerKm?: number[];
  powerWatts?: number[];
  cadenceRpm?: number[];
  altitudeMeters?: number[];
}

export interface Activity {
  id: string;
  externalId?: string;
  name: string;
  type: ActivityType;
  startDateLocal: string; // ISO string
  distanceMeters: number;
  movingTimeSeconds: number;
  elapsedTimeSeconds: number;
  averageSpeedMps: number;
  averagePaceSecPerKm: number;
  maxSpeedMps: number;
  averageHeartRate?: number;
  maxHeartRate?: number;
  averagePowerWatts?: number;
  maxPowerWatts?: number;
  averageCadenceRpm?: number;
  elevationGainMeters: number;
  trainingLoad?: number; // TSS / Load
  trimp?: number;
  decouplingPercentage?: number; // HR/Pace drift
  laps?: ActivityLap[];
  stream?: ActivityStream;
}

export interface DecouplingResult {
  firstHalfPaceSecKm: number;
  firstHalfAvgHr: number;
  firstHalfEfficiencyRatio: number;
  secondHalfPaceSecKm: number;
  secondHalfAvgHr: number;
  secondHalfEfficiencyRatio: number;
  decouplingPercentage: number; // positive means HR drifted up relative to pace/power
  assessment: 'Minimal Drift (<3.5%)' | 'Moderate Drift (3.5-5.0%)' | 'Significant Aerobic Drift (>5.0%)';
}
